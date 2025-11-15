"""
Configuration Management for API Gateway
Uses Pydantic Settings for type-safe configuration
"""
from typing import List, Optional
from pydantic import Field, field_validator, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """API Gateway Configuration"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Application
    app_name: str = "AIVO API Gateway"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False
    log_level: str = "INFO"

    # Server
    host: str = "0.0.0.0"
    port: int = 8001
    workers: int = 4

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://aivo:password@localhost:5432/aivo_auth"
    )
    db_pool_size: int = 20
    db_max_overflow: int = 10
    db_pool_timeout: int = 30
    db_echo: bool = False

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_password: Optional[str] = None
    redis_max_connections: int = 50
    cache_ttl: int = 3600

    # JWT Configuration
    jwt_secret_key: str = Field(min_length=32)
    jwt_algorithm: str = "RS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 30
    jwt_private_key_path: Optional[str] = None
    jwt_public_key_path: Optional[str] = None

    # Password Security
    password_min_length: int = 12
    password_time_cost: int = 2
    password_memory_cost: int = 65536
    password_parallelism: int = 4
    password_hash_length: int = 32
    password_salt_length: int = 16

    # Email Service
    sendgrid_api_key: Optional[str] = None
    from_email: str = "noreply@aivolearning.com"
    from_name: str = "AIVO Learning"
    email_verification_expire_hours: int = 24
    password_reset_expire_hours: int = 1

    # SMS Service
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_from_phone: Optional[str] = None
    sms_verification_expire_minutes: int = 5

    # MFA Configuration
    mfa_issuer: str = "AIVO Learning"
    mfa_backup_codes_count: int = 10
    mfa_totp_digits: int = 6
    mfa_totp_interval: int = 30

    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_login: str = "10/minute"
    rate_limit_signup: str = "5/hour"
    rate_limit_api: str = "1000/hour"
    rate_limit_storage_url: str = "redis://localhost:6379/1"

    # CORS
    cors_origins: List[str] = Field(
        default=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176"
        ]
    )
    cors_credentials: bool = True
    cors_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    cors_headers: List[str] = ["*"]

    # Session Management
    session_timeout_minutes: int = 30
    session_extend_on_activity: bool = True
    max_sessions_per_user: int = 5

    # Security Headers
    hsts_max_age: int = 31536000
    csp_default_src: str = "self"
    x_frame_options: str = "DENY"
    x_content_type_options: str = "nosniff"

    # Risk-Based Authentication
    risk_score_threshold: float = 0.7
    device_fingerprint_enabled: bool = True
    geolocation_enabled: bool = True
    impossible_travel_threshold_km: int = 500
    maxmind_license_key: Optional[str] = None
    maxmind_db_path: str = "/app/data/GeoLite2-City.mmdb"

    # COPPA Compliance
    coppa_age_threshold: int = 13
    parental_consent_required: bool = True
    parental_verification_methods: List[str] = ["credit_card", "government_id"]

    # SAML
    saml_enabled: bool = False
    saml_sp_entity_id: Optional[str] = None
    saml_sp_acs_url: Optional[str] = None
    saml_sp_cert_path: Optional[str] = None
    saml_sp_key_path: Optional[str] = None

    # OAuth
    oauth_google_enabled: bool = False
    oauth_google_client_id: Optional[str] = None
    oauth_google_client_secret: Optional[str] = None
    oauth_google_redirect_uri: Optional[str] = None

    oauth_microsoft_enabled: bool = False
    oauth_microsoft_client_id: Optional[str] = None
    oauth_microsoft_client_secret: Optional[str] = None
    oauth_microsoft_redirect_uri: Optional[str] = None

    # Monitoring
    sentry_dsn: Optional[str] = None
    sentry_environment: str = "development"
    sentry_traces_sample_rate: float = 0.1
    prometheus_enabled: bool = True

    # External Services
    hibp_api_key: Optional[str] = None
    hibp_api_url: str = "https://api.pwnedpasswords.com/range"

    # Feature Flags
    feature_mfa_required: bool = False
    feature_risk_based_auth: bool = True
    feature_sso_enabled: bool = False
    feature_coppa_strict_mode: bool = True

    # Audit Logging
    audit_log_retention_days: int = 730
    audit_log_sensitive_fields: List[str] = ["password", "token", "secret"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("cors_methods", mode="before")
    @classmethod
    def parse_cors_methods(cls, v):
        if isinstance(v, str):
            return [method.strip() for method in v.split(",")]
        return v

    @field_validator("parental_verification_methods", mode="before")
    @classmethod
    def parse_verification_methods(cls, v):
        if isinstance(v, str):
            return [method.strip() for method in v.split(",")]
        return v

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


# Global settings instance
settings = Settings()
