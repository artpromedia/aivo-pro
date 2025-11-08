"""Configuration settings for Training & Alignment Service"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Service configuration"""
    
    # Service settings
    SERVICE_NAME: str = "training-alignment-svc"
    SERVICE_PORT: int = 8009
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = (
        "postgresql://user:password@localhost:5432/aivo_training"
    )
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Provider Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    SENTRY_DSN: Optional[str] = None
    
    # Governance Thresholds
    BIAS_THRESHOLD: float = 0.10
    DRIFT_THRESHOLD: float = 0.15
    RETRAINING_INTERVAL_DAYS: int = 30
    
    # Model Storage
    MODEL_STORAGE_PATH: str = "/models"
    MODEL_REGISTRY_URL: str = "http://model-monitor-svc:8015"
    
    # Feature Flags
    ENABLE_AUTO_RETRAINING: bool = True
    ENABLE_BIAS_MITIGATION: bool = True
    ENABLE_DRIFT_DETECTION: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True
