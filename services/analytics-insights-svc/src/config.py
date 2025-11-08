"""
Configuration settings for Analytics & Insights Service
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Service settings loaded from environment variables"""
    
    # Service info
    SERVICE_NAME: str = "analytics-insights-svc"
    SERVICE_PORT: int = 8013
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = (
        "postgresql://aivo:password@localhost:5432/aivo"
    )
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/3"
    
    # Analytics settings
    CACHE_TTL: int = 3600  # 1 hour
    AGGREGATION_INTERVAL: int = 86400  # 24 hours
    RETENTION_DAYS: int = 365  # 1 year
    
    class Config:
        """Pydantic config"""
        env_file = ".env"
        case_sensitive = True
