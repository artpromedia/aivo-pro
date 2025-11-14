"""Configuration for IEP Assistant Service"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Service configuration"""
    
    # Service
    SERVICE_NAME: str = "iep-assistant-svc"
    VERSION: str = "1.0.0"
    PORT: int = 8008
    LOG_LEVEL: str = "INFO"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/aivo_iep"
    REDIS_URL: str = "redis://localhost:6379/6"
    
    # AI Provider Selection
    AI_PROVIDER: str = "openai"  # Options: openai, anthropic, localai, ollama
    USE_LOCAL_MODELS: bool = False
    
    # LocalAI Configuration (fallback)
    LOCALAI_BASE_URL: str = "http://localai:8080"
    
    # Ollama Configuration (fallback)
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    
    # Model Configuration
    IEP_MODEL: str = "gpt-4o"
    ANALYSIS_MODEL: str = "gpt-4o"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    
    # Anthropic (Alternative)
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"
    
    # Google (Alternative)
    GOOGLE_API_KEY: str = ""
    GOOGLE_MODEL: str = "gemini-1.5-pro"
    
    # SMART Goals
    ENABLE_SMART_VALIDATION: bool = True
    MIN_CONFIDENCE_SCORE: float = 0.7
    MAX_GOALS_PER_AREA: int = 3
    
    # Progress Tracking
    DATA_COLLECTION_FREQUENCY: str = "weekly"
    TREND_ANALYSIS_MIN_POINTS: int = 3
    ALERT_THRESHOLD_REGRESSION: float = -0.15
    ALERT_THRESHOLD_AT_RISK: float = 0.4
    
    # Compliance
    ENABLE_FERPA_COMPLIANCE: bool = True
    ENABLE_IDEA_VALIDATION: bool = True
    REQUIRE_SIGNATURES: bool = True
    
    # Monitoring
    PROMETHEUS_ENABLED: bool = True
    SENTRY_DSN: str = ""
    
    # Rate Limiting
    MAX_GOAL_GENERATIONS_PER_HOUR: int = 20
    MAX_DATA_POINTS_PER_DAY: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
