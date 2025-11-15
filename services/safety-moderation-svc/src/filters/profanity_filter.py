"""Profanity filtering"""

from better_profanity import profanity
from typing import Dict, List
import re


class ProfanityFilter:
    """Filter profanity and inappropriate language"""

    def __init__(self):
        self.custom_wordlist = []
        self.profanity_patterns = []

    async def load_wordlists(self):
        """Load profanity wordlists"""
        profanity.load_censor_words()

        # Add custom words for educational context
        self.custom_wordlist = [
            # Add context-specific inappropriate words
        ]

        if self.custom_wordlist:
            profanity.add_censor_words(self.custom_wordlist)

        print("✅ Profanity filter loaded")

    async def check(self, content: str) -> Dict:
        """Check content for profanity"""
        contains = profanity.contains_profanity(content)

        if contains:
            censored = profanity.censor(content, '***')
            words_found = self._extract_profanity(content)

            return {
                "contains_profanity": True,
                "censored_content": censored,
                "profane_words_count": len(words_found),
                "severity": self._calculate_severity(words_found)
            }

        return {
            "contains_profanity": False,
            "content": content
        }

    def _extract_profanity(self, content: str) -> List[str]:
        """Extract profane words from content"""
        words = content.lower().split()
        profane_words = []

        for word in words:
            # Remove punctuation
            clean_word = re.sub(r'[^\w\s]', '', word)
            if profanity.contains_profanity(clean_word):
                profane_words.append(clean_word)

        return profane_words

    def _calculate_severity(self, words: List[str]) -> str:
        """Calculate severity based on words found"""
        if len(words) > 5:
            return "high"
        elif len(words) > 2:
            return "medium"
        return "low"
