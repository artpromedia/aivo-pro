"""Configuration settings for Language Translator Service"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Service configuration"""

    # Service settings
    SERVICE_NAME: str = "translator-svc"
    SERVICE_PORT: int = 8010
    ENVIRONMENT: str = "development"

    # Cache
    REDIS_URL: str = "redis://localhost:6379/1"

    # Translation APIs
    GOOGLE_TRANSLATE_API_KEY: Optional[str] = None
    GOOGLE_CLOUD_TTS_KEY: Optional[str] = None

    # Model Configuration
    TRANSLATION_MODEL: str = "facebook/m2m100_418M"
    ENABLE_CACHE: bool = True
    CACHE_TTL_SECONDS: int = 3600

    # Logging
    LOG_LEVEL: str = "INFO"
    SENTRY_DSN: Optional[str] = None

    # Feature Flags
    ENABLE_AUDIO_TRANSLATION: bool = True
    ENABLE_BATCH_TRANSLATION: bool = True
    ENABLE_DOCUMENT_TRANSLATION: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True
