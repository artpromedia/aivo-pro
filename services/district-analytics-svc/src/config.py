"""Configuration for District Detection & Analytics Service"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Service settings"""

    # API Configuration
    SERVICE_NAME: str = "district-analytics-svc"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://aivo:aivopass@localhost:5432/aivo_analytics"
    )

    # Redis
    REDIS_URL: str = "redis://localhost:6379/8"

    # External APIs
    NCES_API_KEY: Optional[str] = None
    NCES_API_URL: str = "https://nces.ed.gov/api/v1"

    # Geocoding
    NOMINATIM_USER_AGENT: str = "aivo-platform"
    ZIP_API_URL: str = "https://api.zippopotam.us"

    # Analytics Configuration
    DEFAULT_DATE_RANGE_DAYS: int = 30
    MAX_DATA_POINTS: int = 10000
    CACHE_TTL_SECONDS: int = 300

    # Benchmarking
    ENABLE_BENCHMARKS: bool = True
    BENCHMARK_UPDATE_HOURS: int = 24

    class Config:
        env_file = ".env"


settings = Settings()
