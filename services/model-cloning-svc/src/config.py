"""
Configuration for Model Cloning Service
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Model Cloning Service Configuration"""
    
    # Service configuration
    SERVICE_NAME: str = "model-cloning-svc"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # API configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8003
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://aivo_admin:aivo_password@localhost:5432/aivo_production"
    )
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 40
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/1")
    
    # Model storage
    AWS_ACCESS_KEY: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "aivo-models")
    
    # Base model configuration
    BASE_MODEL_PATH: str = os.getenv(
        "BASE_MODEL_PATH",
        "microsoft/phi-3-mini-4k-instruct"
    )
    
    # Ray configuration
    RAY_HEAD_ADDRESS: str = os.getenv("RAY_HEAD_ADDRESS", "auto")
    
    # Cloning parameters
    LORA_RANK: int = 16
    LORA_ALPHA: int = 32
    LORA_DROPOUT: float = 0.1
    
    # Performance
    MAX_CONCURRENT_JOBS: int = 10
    CLONING_TIMEOUT_SECONDS: int = 300
    
    # Monitoring
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    
    class Config:
        env_file = ".env"


settings = Settings()
