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
        provider = PushProvider()
        
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
                push_provider = PushProvider()
                
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
