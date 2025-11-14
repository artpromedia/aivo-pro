"""
Configuration Management
Following Google's configuration best practices
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Production configuration with validation"""
    
    # Service configuration
    SERVICE_NAME: str = "aivo-brain-svc"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # API configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8001
    WORKER_COUNT: int = int(os.getenv("WORKER_COUNT", "4"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    ACCESS_LOG_ENABLED: bool = True
    ENABLE_DOCS: bool = ENVIRONMENT != "production"
    
    # CORS configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "https://aivo.app",
        "https://*.aivo.app"
    ]
    
    # Redis configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CACHE_TTL: int = 3600  # 1 hour
    CACHE_MAX_SIZE: int = 10000
    
    # AI Provider Selection
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "localai")
    USE_LOCAL_MODELS: bool = os.getenv("USE_LOCAL_MODELS", "true").lower() == "true"
    
    # LocalAI Configuration
    LOCALAI_BASE_URL: str = os.getenv("LOCALAI_BASE_URL", "http://localai:8080")
    
    # Ollama Configuration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
    
    # Model configuration
    PRIMARY_MODEL: str = os.getenv("PRIMARY_MODEL", "llama3.2:3b")
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "tinyllama:1.1b")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")
    FALLBACK_MODELS: List[str] = [
        "llama3.2:3b",
        "tinyllama:1.1b"
    ]
    OPTIMIZATION_LEVEL: str = os.getenv("OPTIMIZATION_LEVEL", "medium")  # low, medium, high
    
    # Inference configuration
    BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "8"))
    MAX_BATCH_DELAY_MS: int = 50
    INFERENCE_TIMEOUT_SECONDS: int = 30
    MAX_TOKENS_DEFAULT: int = 512
    MAX_TOKENS_LIMIT: int = 2048
    
    # Curriculum configuration
    KNOWLEDGE_BASE_PATH: str = os.getenv("KNOWLEDGE_BASE_PATH", "/app/data/knowledge_base")
    CURRICULUM_STANDARDS: List[str] = ["CCSS", "NGSS", "State-Specific"]
    
    # Monitoring configuration
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")
    PROMETHEUS_ENABLED: bool = True
    METRICS_PORT: int = 9090
    
    # Database configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://aivo_admin:aivo_password@localhost:5432/aivo_production"
    )
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 40
    
    # Security configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Health check configuration
    HEALTH_CHECK_INTERVAL_SECONDS: int = 30
    READINESS_CHECK_TIMEOUT_SECONDS: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
