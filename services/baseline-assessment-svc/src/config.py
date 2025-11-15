"""Configuration for the baseline assessment service."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables."""

    SERVICE_NAME: str = "baseline-assessment-svc"
    LOG_LEVEL: str = "INFO"

    DATABASE_URL: str = (
        "postgresql://aivo:password@localhost:5432/aivo_assessments"
    )
    DB_POOL_MIN_SIZE: int = 1
    DB_POOL_MAX_SIZE: int = 10
    DB_COMMAND_TIMEOUT: int = 30

    ITEM_CACHE_TTL_SECONDS: int = 300

    class Config:
        env_file = ".env"
        case_sensitive = True
