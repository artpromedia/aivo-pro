"""
Configuration settings for Notification Service
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Service settings loaded from environment variables"""
    
    # Service info
    SERVICE_NAME: str = "notification-svc"
    SERVICE_PORT: int = 8012
    LOG_LEVEL: str = "INFO"
    
    # SendGrid (Email)
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = "notifications@aivo.com"
    SENDGRID_FROM_NAME: str = "AIVO Learning Platform"
    
    # Twilio (SMS)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    # Firebase (Push)
    FIREBASE_CREDENTIALS_PATH: str = ""
    FIREBASE_PROJECT_ID: str = ""
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/2"
    
    # Rate limiting
    RATE_LIMIT_EMAIL: int = 100  # per hour
    RATE_LIMIT_SMS: int = 50  # per hour
    RATE_LIMIT_PUSH: int = 500  # per hour
    
    class Config:
        """Pydantic config"""
        env_file = ".env"
        case_sensitive = True
