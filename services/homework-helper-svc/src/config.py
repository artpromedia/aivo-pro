"""
Configuration for Homework Helper Service
"""

import os
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


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

    # OpenAI
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4"

    # Anthropic
    ANTHROPIC_API_KEY: str | None = None

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
    ALLOWED_FILE_TYPES: List[str] = ["pdf", "png", "jpg", "jpeg"]
    UPLOAD_STORAGE_PATH: str = "/app/uploads"

    @field_validator('ALLOWED_FILE_TYPES', mode='before')
    @classmethod
    def parse_allowed_file_types(cls, v):
        """Parse ALLOWED_FILE_TYPES from comma-separated string or list"""
        if isinstance(v, str):
            return [item.strip() for item in v.split(',')]
        return v
    
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
