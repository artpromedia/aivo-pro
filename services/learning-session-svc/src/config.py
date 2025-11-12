"""
Configuration management for Learning Session Service
Author: Staff Engineer (ex-Google DeepMind Education)
"""

from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with validation"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Service Configuration
    service_name: str = Field(default="learning-session-svc")
    service_version: str = Field(default="1.0.0")
    log_level: str = Field(default="INFO")
    environment: str = Field(default="development")
    
    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/aivo_learning"
    )
    db_pool_size: int = Field(default=20, ge=5, le=100)
    db_max_overflow: int = Field(default=10, ge=0, le=50)
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/2")
    redis_max_connections: int = Field(default=50, ge=10, le=200)
    
    # BKT Configuration
    bkt_default_p_init: float = Field(default=0.3, ge=0.0, le=1.0)
    bkt_default_p_learn: float = Field(default=0.1, ge=0.0, le=1.0)
    bkt_default_p_guess: float = Field(default=0.2, ge=0.0, le=0.5)
    bkt_default_p_slip: float = Field(default=0.1, ge=0.0, le=0.5)
    
    # Mastery Thresholds
    mastery_threshold: float = Field(default=0.8, ge=0.5, le=1.0)
    struggling_threshold: float = Field(default=0.4, ge=0.0, le=0.5)
    advancement_threshold: float = Field(default=0.85, ge=0.7, le=1.0)
    review_threshold: float = Field(default=0.6, ge=0.3, le=0.8)
    
    # Session Configuration
    session_timeout_minutes: int = Field(default=60, ge=15, le=240)
    min_problems_per_skill: int = Field(default=5, ge=3, le=10)
    max_problems_per_skill: int = Field(default=20, ge=10, le=50)
    websocket_heartbeat_interval: int = Field(default=30, ge=10, le=120)
    
    # Content Generation
    content_generator_model: str = Field(default="adaptive-v1")
    difficulty_adjustment_rate: float = Field(default=0.1, ge=0.05, le=0.3)
    zpd_window: float = Field(default=0.15, ge=0.1, le=0.3)
    
    # Monitoring
    prometheus_port: int = Field(default=9004, ge=1024, le=65535)
    sentry_dsn: Optional[str] = Field(default=None)
    sentry_traces_sample_rate: float = Field(default=0.1, ge=0.0, le=1.0)
    
    # External Services
    aivo_brain_url: str = Field(default="http://localhost:8002")
    content_service_url: str = Field(default="http://localhost:8010")
    
    @field_validator("log_level")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level"""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        v_upper = v.upper()
        if v_upper not in valid_levels:
            raise ValueError(f"log_level must be one of {valid_levels}")
        return v_upper
    
    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment"""
        valid_envs = ["development", "staging", "production"]
        v_lower = v.lower()
        if v_lower not in valid_envs:
            raise ValueError(f"environment must be one of {valid_envs}")
        return v_lower
    
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.environment == "production"
    
    @property
    def bkt_default_params(self) -> dict:
        """Get default BKT parameters as dict"""
        return {
            "p_init": self.bkt_default_p_init,
            "p_learn": self.bkt_default_p_learn,
            "p_guess": self.bkt_default_p_guess,
            "p_slip": self.bkt_default_p_slip
        }
    
    @property
    def mastery_config(self) -> dict:
        """Get mastery configuration as dict"""
        return {
            "mastery_threshold": self.mastery_threshold,
            "struggling_threshold": self.struggling_threshold,
            "advancement_threshold": self.advancement_threshold,
            "review_threshold": self.review_threshold,
            "min_problems_per_skill": self.min_problems_per_skill,
            "max_problems_per_skill": self.max_problems_per_skill
        }


# Global settings instance
settings = Settings()
