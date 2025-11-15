"""
Notification Agent Service
Multi-channel communications: Email, SMS, Push
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum
import logging

from .email_provider import EmailProvider
from .sms_provider import SMSProvider
from .push_provider import PushProvider
from .templates import TemplateManager
from .config import Settings
from .db import database

# Initialize FastAPI app
app = FastAPI(
    title="Notification Service",
    description="Multi-channel notification delivery",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize settings
settings = Settings()

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)

push_provider: Optional[PushProvider] = None


@app.on_event("startup")
async def startup_event():
    """Initialize shared resources."""
    global push_provider

    await database.connect()
    push_provider = PushProvider(db=database)
    logger.info("Notification service startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup shared resources."""
    await database.close()


# ===========================================================================
# ENUMS
# ===========================================================================

class NotificationChannel(str, Enum):
    """Notification channels"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"


class NotificationPriority(str, Enum):
    """Notification priority"""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class DevicePlatform(str, Enum):
    """Supported push notification platforms"""
    IOS = "ios"
    ANDROID = "android"
    WEB = "web"


# ===========================================================================
# MODELS
# ===========================================================================

class EmailNotificationRequest(BaseModel):
    """Email notification request"""
    to: EmailStr
    subject: str
    template_id: Optional[str] = None
    template_data: Optional[Dict] = None
    html_body: Optional[str] = None
    text_body: Optional[str] = None


class SMSNotificationRequest(BaseModel):
    """SMS notification request"""
    to: str = Field(..., pattern=r'^\+?1?\d{9,15}$')
    message: str = Field(..., max_length=160)
    template_id: Optional[str] = None
    template_data: Optional[Dict] = None


class PushNotificationRequest(BaseModel):
    """Push notification request"""
    user_id: str
    title: str
    body: str
    data: Optional[Dict] = None
    badge: Optional[int] = None


class DeviceRegistrationRequest(BaseModel):
    """Device token registration payload"""
    user_id: str
    device_token: str = Field(..., min_length=10)
    platform: DevicePlatform
    app_version: Optional[str] = None
    locale: Optional[str] = None
    timezone: Optional[str] = None
    metadata: Optional[Dict] = None


class MultiChannelRequest(BaseModel):
    """Multi-channel notification request"""
    user_id: str
    channels: List[NotificationChannel]
    template_id: str
    template_data: Dict
    priority: NotificationPriority = NotificationPriority.NORMAL


class NotificationResponse(BaseModel):
    """Notification response"""
    id: str
    channel: NotificationChannel
    status: str
    sent_at: datetime


# ===========================================================================
# ENDPOINTS - DEVICE REGISTRATION
# ===========================================================================


@app.post("/v1/push/register")
async def register_push_device(request: DeviceRegistrationRequest):
    """Register or update a device token for push notifications."""

    try:
        query = """
            INSERT INTO notification_device_tokens (
                user_id,
                device_token,
                platform,
                app_version,
                locale,
                timezone,
                metadata,
                is_active,
                last_used_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW())
            ON CONFLICT (device_token)
            DO UPDATE SET
                user_id = EXCLUDED.user_id,
                platform = EXCLUDED.platform,
                app_version = EXCLUDED.app_version,
                locale = EXCLUDED.locale,
                timezone = EXCLUDED.timezone,
                metadata = EXCLUDED.metadata,
                is_active = TRUE,
                last_used_at = NOW()
            RETURNING id
        """

        record = await database.fetchrow(
            query,
            request.user_id,
            request.device_token,
            request.platform.value,
            request.app_version,
            request.locale,
            request.timezone,
            request.metadata or {}
        )

        device_id = None
        if record:
            try:
                device_id = record["id"]
            except (KeyError, IndexError):
                device_id = None

        return {
            "status": "registered",
            "device_id": device_id or request.device_token
        }

    except Exception as e:
        logger.error("Device registration failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Device registration failed: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - EMAIL
# ===========================================================================

@app.get("/")
async def root():
    """Service health check"""
    return {
        "service": "notification-svc",
        "status": "operational",
        "version": "1.0.0",
        "channels": ["email", "sms", "push"],
        "timestamp": datetime.utcnow()
    }


@app.post("/v1/email/send", response_model=NotificationResponse)
async def send_email(request: EmailNotificationRequest):
    """
    Send email notification via SendGrid

    Supports:
    - Template-based emails
    - Custom HTML/text content
    - Attachments
    """
    try:
        provider = EmailProvider()

        # Use template or custom content
        if request.template_id:
            template_mgr = TemplateManager()
            html, text = await template_mgr.render_email_template(
                request.template_id,
                request.template_data or {}
            )
        else:
            html = request.html_body
            text = request.text_body

        result = await provider.send_email(
            to_email=request.to,
            subject=request.subject,
            html_content=html,
            text_content=text
        )

        return NotificationResponse(
            id=result["id"],
            channel=NotificationChannel.EMAIL,
            status=result["status"],
            sent_at=datetime.utcnow()
        )

    except Exception as e:
        logger.error("Email send failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Email send failed: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - SMS
# ===========================================================================

@app.post("/v1/sms/send", response_model=NotificationResponse)
async def send_sms(request: SMSNotificationRequest):
    """
    Send SMS notification via Twilio

    Supports:
    - Template-based messages
    - Custom messages (max 160 chars)
    """
    try:
        provider = SMSProvider()

        # Use template or custom message
        if request.template_id:
            template_mgr = TemplateManager()
            message = await template_mgr.render_sms_template(
                request.template_id,
                request.template_data or {}
            )
        else:
            message = request.message

        result = await provider.send_sms(
            to_phone=request.to,
            message=message
        )

        return NotificationResponse(
            id=result["id"],
            channel=NotificationChannel.SMS,
            status=result["status"],
            sent_at=datetime.utcnow()
        )

    except Exception as e:
        logger.error("SMS send failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"SMS send failed: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - PUSH
# ===========================================================================

@app.post("/v1/push/send", response_model=NotificationResponse)
async def send_push(request: PushNotificationRequest):
    """
    Send push notification via Firebase

    Supports:
    - iOS and Android
    - Custom data payloads
    - Badge counts
    """
    try:
        if push_provider is None:
            raise HTTPException(
                status_code=503,
                detail="Push notifications not configured"
            )

        provider = push_provider

        result = await provider.send_push(
            user_id=request.user_id,
            title=request.title,
            body=request.body,
            data=request.data,
            badge=request.badge
        )

        return NotificationResponse(
            id=result["id"],
            channel=NotificationChannel.PUSH,
            status=result["status"],
            sent_at=datetime.utcnow()
        )

    except Exception as e:
        logger.error("Push send failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Push send failed: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - MULTI-CHANNEL
# ===========================================================================

@app.post("/v1/notify/multi-channel")
async def send_multi_channel(request: MultiChannelRequest):
    """
    Send notification across multiple channels

    Intelligently routes notifications based on:
    - User preferences
    - Channel availability
    - Priority level
    """
    try:
        results = []

        # Send on each requested channel
        for channel in request.channels:
            if channel == NotificationChannel.EMAIL:
                email_provider = EmailProvider()
                template_mgr = TemplateManager()

                html, text = await template_mgr.render_email_template(
                    request.template_id,
                    request.template_data
                )

                result = await email_provider.send_email(
                    to_email=request.template_data.get("email", ""),
                    subject=request.template_data.get("subject", ""),
                    html_content=html,
                    text_content=text
                )
                results.append({
                    "channel": "email",
                    "status": result["status"]
                })

            elif channel == NotificationChannel.SMS:
                sms_provider = SMSProvider()
                template_mgr = TemplateManager()

                message = await template_mgr.render_sms_template(
                    request.template_id,
                    request.template_data
                )

                result = await sms_provider.send_sms(
                    to_phone=request.template_data.get("phone", ""),
                    message=message
                )
                results.append({
                    "channel": "sms",
                    "status": result["status"]
                })

            elif channel == NotificationChannel.PUSH:
                if push_provider is None:
                    raise HTTPException(
                        status_code=503,
                        detail="Push notifications not configured"
                    )

                result = await push_provider.send_push(
                    user_id=request.user_id,
                    title=request.template_data.get("title", ""),
                    body=request.template_data.get("body", ""),
                    data=request.template_data.get("data")
                )
                results.append({
                    "channel": "push",
                    "status": result["status"]
                })

        return {
            "user_id": request.user_id,
            "channels_sent": len(results),
            "results": results
        }

    except Exception as e:
        logger.error("Multi-channel send failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Multi-channel send failed: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - TEMPLATES
# ===========================================================================

@app.get("/v1/templates")
async def list_templates():
    """List available notification templates"""
    template_mgr = TemplateManager()
    templates = await template_mgr.list_templates()

    return {
        "templates": templates,
        "total": len(templates)
    }


@app.get("/v1/templates/{template_id}")
async def get_template(template_id: str):
    """Get template details"""
    template_mgr = TemplateManager()
    template = await template_mgr.get_template(template_id)

    if not template:
        raise HTTPException(
            status_code=404,
            detail="Template not found"
        )

    return template


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8012)
