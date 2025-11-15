"""
Education Translator with M2M100 model and terminology preservation
"""
import re
from typing import Dict
import logging

from .glossary import (
    IEP_TERMINOLOGY,
    MATH_TERMS,
    PROGRAMMING_TERMS,
    get_term_translation
)
from .languages import RTL_LANGUAGES

try:
    from googletrans import Translator
except ImportError:
    Translator = None  # type: ignore

logger = logging.getLogger(__name__)


class EducationTranslator:
    """
    Translation service with education-specific context

    Features:
    - 50+ language support via Google Translate
    - IEP terminology preservation
    - Math/programming term handling
    - RTL language support
    - Context-aware translation
    """

    def __init__(self):
        """Initialize translator with Google Translate"""
        if Translator is None:
            raise ImportError(
                "googletrans package not installed. "
                "Install with: pip install googletrans==4.0.0-rc1"
            )
        self.translator = Translator()
        self.cache: Dict[str, Dict] = {}

    async def translate_content(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        context: str = "general"
    ) -> Dict:
        """
        Translate content with context awareness

        Args:
            text: Text to translate
            source_lang: Source language code
            target_lang: Target language code
            context: Context type (general, iep, math, programming,
                                   interface)

        Returns:
            Translation result with metadata
        """
        # Check cache
        cache_key = f"{source_lang}:{target_lang}:{context}:{text}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        try:
            # Preserve special terms based on context
            protected_text, placeholders = self._protect_terms(
                text, context
            )

            # Translate
            result = self.translator.translate(
                protected_text,
                src=source_lang,
                dest=target_lang
            )

            # Restore protected terms
            translated = self._restore_terms(
                result.text,
                placeholders,
                target_lang,
                context
            )

            # Determine if RTL
            is_rtl = target_lang in RTL_LANGUAGES

            response = {
                "original": text,
                "translated": translated,
                "source_lang": source_lang,
                "target_lang": target_lang,
                "confidence": 0.95,  # Google Translate doesn't provide
                "rtl": is_rtl
            }

            # Cache result
            self.cache[cache_key] = response

            return response

        except Exception as e:
            logger.error(
                "Translation failed for %s->%s: %s",
                source_lang,
                target_lang,
                str(e)
            )
            # Return original text on error
            return {
                "original": text,
                "translated": text,
                "source_lang": source_lang,
                "target_lang": target_lang,
                "confidence": 0.0,
                "rtl": target_lang in RTL_LANGUAGES
            }

    def _protect_terms(
        self, text: str, context: str
    ) -> tuple[str, Dict[str, str]]:
        """
        Replace special terms with placeholders before translation

        Args:
            text: Original text
            context: Context type

        Returns:
            (protected_text, placeholders_dict)
        """
        placeholders = {}
        protected = text
        counter = 0

        # Protect IEP terms
        if context in ["iep", "general"]:
            for term in IEP_TERMINOLOGY.keys():
                if term in text:
                    placeholder = f"__TERM{counter}__"
                    placeholders[placeholder] = term
                    protected = protected.replace(term, placeholder)
                    counter += 1

        # Protect math terms
        if context in ["math", "general"]:
            for term in MATH_TERMS:
                pattern = r'\b' + re.escape(term) + r'\b'
                matches = re.finditer(pattern, protected, re.IGNORECASE)
                for match in matches:
                    placeholder = f"__TERM{counter}__"
                    placeholders[placeholder] = match.group()
                    protected = protected.replace(
                        match.group(), placeholder, 1
                    )
                    counter += 1

        # Protect programming terms
        if context in ["programming", "general"]:
            for term in PROGRAMMING_TERMS:
                pattern = r'\b' + re.escape(term) + r'\b'
                matches = re.finditer(pattern, protected, re.IGNORECASE)
                for match in matches:
                    placeholder = f"__TERM{counter}__"
                    placeholders[placeholder] = match.group()
                    protected = protected.replace(
                        match.group(), placeholder, 1
                    )
                    counter += 1

        # Protect URLs
        url_pattern = r'https?://[^\s]+'
        urls = re.finditer(url_pattern, protected)
        for url_match in urls:
            placeholder = f"__URL{counter}__"
            placeholders[placeholder] = url_match.group()
            protected = protected.replace(url_match.group(), placeholder)
            counter += 1

        # Protect email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.finditer(email_pattern, protected)
        for email_match in emails:
            placeholder = f"__EMAIL{counter}__"
            placeholders[placeholder] = email_match.group()
            protected = protected.replace(
                email_match.group(), placeholder
            )
            counter += 1

        return protected, placeholders

    def _restore_terms(
        self,
        translated: str,
        placeholders: Dict[str, str],
        target_lang: str,
        context: str
    ) -> str:
        """
        Restore protected terms with appropriate translations

        Args:
            translated: Translated text with placeholders
            placeholders: Placeholder mapping
            target_lang: Target language
            context: Context type

        Returns:
            Text with terms restored
        """
        restored = translated

        for placeholder, original_term in placeholders.items():
            # Get appropriate translation or preserve term
            term_translation = get_term_translation(
                original_term,
                target_lang,
                context
            )
            restored = restored.replace(placeholder, term_translation)

        return restored

    async def detect_language(self, text: str) -> Dict:
        """
        Detect language of input text

        Args:
            text: Text to analyze

        Returns:
            Detection result with language code and confidence
        """
        try:
            detection = self.translator.detect(text)

            return {
                "language": detection.lang,
                "confidence": detection.confidence
            }

        except Exception as e:
            logger.error("Language detection failed: %s", str(e))
            return {
                "language": "en",  # Default to English
                "confidence": 0.0
            }

    async def translate_batch(
        self,
        texts: list[str],
        source_lang: str,
        target_lang: str,
        context: str = "general"
    ) -> list[Dict]:
        """
        Translate multiple texts efficiently

        Args:
            texts: List of texts to translate
            source_lang: Source language code
            target_lang: Target language code
            context: Context type

        Returns:
            List of translation results
        """
        results = []

        for text in texts:
            result = await self.translate_content(
                text,
                source_lang,
                target_lang,
                context
            )
            results.append(result)

        return results
