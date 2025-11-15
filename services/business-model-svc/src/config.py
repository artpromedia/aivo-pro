"""
Configuration settings for Business Model Service
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Service settings loaded from environment variables"""

    # Service info
    SERVICE_NAME: str = "business-model-svc"
    SERVICE_PORT: int = 8011
    LOG_LEVEL: str = "INFO"

    # Stripe configuration
    STRIPE_API_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""

    # Internal services
    NOTIFICATION_SERVICE_URL: str = "http://localhost:8001"

    # Database
    DATABASE_URL: str = (
        "postgresql://aivo:password@localhost:5432/aivo"
    )

    # Pricing (in cents)
    PARENT_PLAN_PRICE: int = 2999  # $29.99/month
    FAMILY_PLAN_PRICE: int = 2500  # $25/child/month
    DISTRICT_PLAN_MIN_PRICE: int = 1500  # $15/student/month
    DISTRICT_PLAN_MAX_PRICE: int = 2000  # $20/student/month

    # Churn prediction
    CHURN_THRESHOLD: float = 0.70
    CHURN_CHECK_INTERVAL: int = 86400  # 24 hours

    # License management
    LICENSE_EXPIRY_WARNING_DAYS: int = 30

    class Config:
        """Pydantic config"""
        env_file = ".env"
        case_sensitive = True
