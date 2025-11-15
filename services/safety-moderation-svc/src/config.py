"""Configuration for Safety & Moderation Service"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Service settings"""

    # API Configuration
    SERVICE_NAME: str = "safety-moderation-svc"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://aivo:aivopass@localhost:5432/aivo_safety"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/7"

    # External APIs
    PERSPECTIVE_API_KEY: Optional[str] = None
    GOOGLE_CLOUD_DLP_PROJECT: Optional[str] = None

    # Moderation Thresholds
    TOXICITY_THRESHOLD: float = 0.7
    SEVERE_TOXICITY_THRESHOLD: float = 0.5
    PROFANITY_THRESHOLD: float = 0.8
    THREAT_THRESHOLD: float = 0.6

    # COPPA Configuration
    COPPA_AGE_LIMIT: int = 13
    PARENTAL_CONSENT_DURATION_DAYS: int = 365

    # Data Retention (days)
    CHAT_RETENTION_DAYS: int = 30
    CONTENT_RETENTION_DAYS: int = 90
    ASSESSMENT_RETENTION_DAYS: int = 365

    # Safety Monitoring
    MAX_VIOLATIONS_PER_HOUR: int = 10
    MAX_THREATS_PER_DAY: int = 5
    MIN_SAFETY_SCORE: float = 0.8

    # ML Models
    TOXICITY_MODEL: str = "unitary/toxic-bert"
    CONTENT_CLASSIFIER_MODEL: str = "facebook/bart-large-mnli"

    class Config:
        env_file = ".env"


settings = Settings()
