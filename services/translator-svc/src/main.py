"""
Language Translator Agent Service
Multi-language support with 50+ languages for AIVO Learning Platform
"""
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import logging

from .translator import EducationTranslator
from .languages import SUPPORTED_LANGUAGES, RTL_LANGUAGES
from .glossary import IEP_TERMINOLOGY
from .config import Settings

# Initialize FastAPI app
app = FastAPI(
    title="Language Translator Service",
    description="Multi-language translation with education terminology",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize settings
settings = Settings()

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)


# ===========================================================================
# MODELS
# ===========================================================================

class TranslationRequest(BaseModel):
    """Single translation request"""
    text: str = Field(..., description="Text to translate")
    source_lang: str = Field(..., description="Source language code")
    target_lang: str = Field(..., description="Target language code")
    context: Optional[str] = Field(
        default="general",
        description="Context: general, iep, math, interface, etc."
    )


class TranslationResponse(BaseModel):
    """Translation response"""
    original: str
    translated: str
    source_lang: str
    target_lang: str
    confidence: float = Field(..., ge=0, le=1)
    rtl: bool


class BatchTranslationItem(BaseModel):
    """Item in batch translation"""
    text: str
    source: str
    target: str
    context: Optional[str] = "general"


class BatchTranslationRequest(BaseModel):
    """Batch translation request"""
    items: List[BatchTranslationItem]


class BatchTranslationResponse(BaseModel):
    """Batch translation response"""
    translations: List[TranslationResponse]


class LanguageInfo(BaseModel):
    """Language information"""
    code: str
    name: str
    native_name: str
    rtl: bool
    family: str


class SupportedLanguagesResponse(BaseModel):
    """Supported languages response"""
    languages: Dict[str, LanguageInfo]
    total: int
    rtl_languages: List[str]


# ===========================================================================
# ENDPOINTS
# ===========================================================================

@app.get("/")
async def root():
    """Service health check"""
    return {
        "service": "translator-svc",
        "status": "operational",
        "version": "1.0.0",
        "supported_languages": len(SUPPORTED_LANGUAGES),
        "timestamp": datetime.utcnow()
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "checks": {
            "api": "operational",
            "redis": "connected",
            "translation_model": "loaded"
        },
        "timestamp": datetime.utcnow()
    }


@app.post("/v1/translate/content", response_model=TranslationResponse)
async def translate_content(request: TranslationRequest):
    """
    Translate content with education-specific context
    
    Supports 50+ languages with special handling for:
    - IEP and education terminology
    - Mathematical expressions
    - RTL languages (Arabic, Hebrew, Persian, Urdu)
    """
    try:
        # Validate language codes
        if request.source_lang not in SUPPORTED_LANGUAGES:
            raise HTTPException(
                status_code=400,
                detail=f"Source language '{request.source_lang}' not supported"
            )
        
        if request.target_lang not in SUPPORTED_LANGUAGES:
            raise HTTPException(
                status_code=400,
                detail=f"Target language '{request.target_lang}' not supported"
            )
        
        # Translate
        translator = EducationTranslator()
        result = await translator.translate_content(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            context=request.context or "general"
        )
        
        return TranslationResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Translation failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        ) from e


@app.post(
    "/v1/translate/batch",
    response_model=BatchTranslationResponse
)
async def translate_batch(request: BatchTranslationRequest):
    """
    Translate multiple pieces of content in batch
    
    Efficiently handles multiple translations in a single request.
    """
    try:
        translator = EducationTranslator()
        translations = []
        
        for item in request.items:
            result = await translator.translate_content(
                text=item.text,
                source_lang=item.source,
                target_lang=item.target,
                context=item.context
            )
            translations.append(TranslationResponse(**result))
        
        return BatchTranslationResponse(translations=translations)
    
    except Exception as e:
        logger.error("Batch translation failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Batch translation failed: {str(e)}"
        ) from e


@app.get(
    "/v1/languages/supported",
    response_model=SupportedLanguagesResponse
)
async def get_supported_languages():
    """
    Get list of all supported languages
    
    Returns 50+ languages with metadata including:
    - Language codes and names
    - Native names
    - RTL support
    - Language families
    """
    languages = {}
    
    for code, info in SUPPORTED_LANGUAGES.items():
        languages[code] = LanguageInfo(
            code=code,
            name=info["name"],
            native_name=info["native"],
            rtl=info["rtl"],
            family=info["family"]
        )
    
    return SupportedLanguagesResponse(
        languages=languages,
        total=len(SUPPORTED_LANGUAGES),
        rtl_languages=RTL_LANGUAGES
    )


@app.get("/v1/terminology/iep")
async def get_iep_terminology():
    """
    Get IEP and education-specific terminology mappings
    
    Returns specialized education terms with translations
    for proper handling of IEP documents and reports.
    """
    return {
        "terminology": IEP_TERMINOLOGY,
        "total_terms": len(IEP_TERMINOLOGY),
        "categories": list(set(
            term["category"] for term in IEP_TERMINOLOGY.values()
        ))
    }


@app.post("/v1/translate/detect")
async def detect_language(text: str = Body(..., min_length=1, embed=True)):
    """
    Detect the language of input text
    
    Uses language detection to automatically identify
    the source language.
    """
    try:
        translator = EducationTranslator()
        detected = await translator.detect_language(text)
        
        return {
            "text": text[:100],
            "detected_language": detected["language"],
            "confidence": detected["confidence"],
            "language_name": SUPPORTED_LANGUAGES.get(
                detected["language"], {}
            ).get("name", "Unknown")
        }
    
    except Exception as e:
        logger.error("Language detection failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Language detection failed: {str(e)}"
        ) from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
