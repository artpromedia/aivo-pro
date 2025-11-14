"""
Configuration for Homework Helper Service
"""

import os
from pydantic_settings import BaseSettings
from pydantic import model_validator
from typing import List, Any


class Settings(BaseSettings):
    """Service configuration"""

    # Service
    SERVICE_NAME: str = "homework-helper-svc"
    SERVICE_VERSION: str = "1.0.0"
    PORT: int = 8007
    LOG_LEVEL: str = "INFO"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://aivo:password@localhost:5432/aivo_homework"
    REDIS_URL: str = "redis://localhost:6379/5"

    # Google Cloud
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    GOOGLE_PROJECT_ID: str | None = None

    # AI Provider Selection
    AI_PROVIDER: str = "openai"  # Options: openai, anthropic, localai, ollama
    USE_LOCAL_MODELS: bool = False
    
    # LocalAI Configuration (fallback)
    LOCALAI_BASE_URL: str = "http://localai:8080"
    
    # Ollama Configuration (fallback)
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    
    # Model Configuration
    CHAT_MODEL: str = "gpt-4o-mini"
    MATH_MODEL: str = "gpt-4o"
    VISION_MODEL: str = "gpt-4o"
    
    # OpenAI
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Anthropic (Alternative)
    ANTHROPIC_API_KEY: str | None = None
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-20241022"
    
    # Google (Alternative)
    GOOGLE_API_KEY: str | None = None
    GOOGLE_MODEL: str = "gemini-1.5-pro"

    # OCR Settings
    TESSERACT_PATH: str = "/usr/bin/tesseract"
    OCR_LANGUAGES: str = "eng"
    OCR_DPI: int = 300
    HANDWRITING_DETECTION: bool = True

    # Math Processing
    MATH_CONFIDENCE_THRESHOLD: float = 0.85
    ENABLE_LATEX_CONVERSION: bool = True

    # Socratic Tutoring
    MAX_HINT_LEVEL: int = 6
    ENABLE_METACOGNITIVE_PROMPTS: bool = True
    MIN_THINK_TIME_SECONDS: int = 5

    # File Upload
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: Any = ["pdf", "png", "jpg", "jpeg"]
    UPLOAD_STORAGE_PATH: str = "/app/uploads"

    @model_validator(mode='before')
    @classmethod
    def parse_env_vars(cls, values: dict) -> dict:
        """Parse environment variables that need special handling"""
        # Handle ALLOWED_FILE_TYPES which may come as comma-separated string
        if 'ALLOWED_FILE_TYPES' in values:
            val = values['ALLOWED_FILE_TYPES']
            if isinstance(val, str):
                values['ALLOWED_FILE_TYPES'] = [item.strip() for item in val.split(',')]
        return values
    
    # Session Management
    SESSION_TIMEOUT_MINUTES: int = 120
    CONVERSATION_HISTORY_LIMIT: int = 50
    
    # Monitoring
    PROMETHEUS_ENABLED: bool = True
    SENTRY_DSN: str | None = None
    
    # Rate Limiting
    MAX_UPLOADS_PER_HOUR: int = 10
    MAX_CHAT_MESSAGES_PER_MINUTE: int = 20
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
