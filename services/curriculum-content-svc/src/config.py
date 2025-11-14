"""
Configuration for Curriculum Content Service
Comprehensive K-12 content generation across all subjects and systems
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Service configuration"""

    # Service
    SERVICE_NAME: str = "curriculum-content-svc"
    SERVICE_VERSION: str = "1.0.0"
    PORT: int = 8006
    LOG_LEVEL: str = "INFO"

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@aivo-postgres:5432/"
        "aivo_curriculum"
    )
    REDIS_URL: str = "redis://aivo-redis:6379/4"

    # AI Provider Selection
    AI_PROVIDER: str = "localai"  # Options: openai, localai, ollama
    USE_LOCAL_MODELS: bool = True

    # LocalAI Configuration
    LOCALAI_BASE_URL: str = "http://localai:8080"

    # Ollama Configuration
    OLLAMA_BASE_URL: str = "http://ollama:11434"

    # Model Configuration
    CONTENT_MODEL: str = "llama3.2:3b"
    MATH_MODEL: str = "codellama:7b"
    SCIENCE_MODEL: str = "llama3.2:3b"

    # OpenAI (Fallback)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"

    # Curriculum Systems
    SUBJECTS: List[str] = [
        "math",
        "science",
        "english",
        "social_studies",
        "languages",
        "arts",
        "pe",
        "cs",
    ]
    ENABLE_US_COMMON_CORE: bool = True
    ENABLE_UK_NATIONAL: bool = True
    ENABLE_IB: bool = True
    ENABLE_CHINESE_NATIONAL: bool = True

    # Content Generation
    MAX_CONTENT_BATCH_SIZE: int = 20
    MIN_DIFFICULTY: float = 0.0
    MAX_DIFFICULTY: float = 1.0
    DEFAULT_DIFFICULTY: float = 0.5

    # Caching
    CACHE_TTL: int = 3600  # 1 hour

    # Monitoring
    PROMETHEUS_ENABLED: bool = True
    SENTRY_DSN: str = ""

    # Rate Limiting
    MAX_REQUESTS_PER_MINUTE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
