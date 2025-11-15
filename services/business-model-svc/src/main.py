"""
Business Model Agent Service
Subscription management, licensing, and revenue operations
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
from contextlib import asynccontextmanager
import logging
import stripe
from stripe.error import (  # type: ignore[attr-defined]
    SignatureVerificationError,
    StripeError,
)

from .subscriptions import SubscriptionManager
from .licenses import LicenseManager
from .churn import ChurnPredictor
from .config import Settings
from .db import database
from .clients.notification_client import NotificationServiceClient
from .webhooks.stripe_handler import StripeWebhookHandler

settings = Settings()
notification_client = NotificationServiceClient(
    base_url=settings.NOTIFICATION_SERVICE_URL,
    default_channels=["email"]
)
subscription_manager = SubscriptionManager(db=database)
license_manager = LicenseManager(db=database)
churn_predictor = ChurnPredictor(db=database)
webhook_handler = StripeWebhookHandler(database, notification_client)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await database.connect()
    try:
        yield
    finally:
        await notification_client.close()
        await database.close()


# Initialize FastAPI app
app = FastAPI(
    title="Business Model Service",
    description="Subscription and licensing management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Stripe
stripe.api_key = settings.STRIPE_API_KEY

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)


# ===========================================================================
# ENUMS
# ===========================================================================

class SubscriptionTier(str, Enum):
    """Subscription tiers"""
    PARENT = "parent"
    FAMILY = "family"
    DISTRICT = "district"


class SubscriptionStatus(str, Enum):
    """Subscription status"""
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    TRIALING = "trialing"


# ===========================================================================
# MODELS
# ===========================================================================

class CreateSubscriptionRequest(BaseModel):
    """Create subscription request"""
    customer_id: str
    tier: SubscriptionTier
    payment_method_id: str
    child_count: Optional[int] = Field(default=1, ge=1)
    student_count: Optional[int] = Field(default=None, ge=1)


class SubscriptionResponse(BaseModel):
    """Subscription response"""
    id: str
    customer_id: str
    tier: SubscriptionTier
    status: SubscriptionStatus
    amount: int  # in cents
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    child_count: Optional[int] = None
    student_count: Optional[int] = None


class UpdateSubscriptionRequest(BaseModel):
    """Update subscription request"""
    tier: Optional[SubscriptionTier] = None
    child_count: Optional[int] = Field(default=None, ge=1)
    student_count: Optional[int] = Field(default=None, ge=1)


class CreateLicenseRequest(BaseModel):
    """Create district license request"""
    district_id: str
    district_name: str
    student_count: int = Field(..., ge=1)
    duration_months: int = Field(..., ge=1, le=36)


class LicenseResponse(BaseModel):
    """License response"""
    id: str
    district_id: str
    district_name: str
    student_count: int
    seats_used: int
    start_date: datetime
    end_date: datetime
    status: str


class ChurnPredictionResponse(BaseModel):
    """Churn prediction response"""
    customer_id: str
    churn_probability: float = Field(..., ge=0, le=1)
    risk_level: str  # low, medium, high
    factors: List[str]
    recommended_actions: List[str]


# ===========================================================================
# ENDPOINTS - SUBSCRIPTIONS
# ===========================================================================

@app.get("/")
async def root():
    """Service health check"""
    return {
        "service": "business-model-svc",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow()
    }


@app.post(
    "/v1/subscriptions/create",
    response_model=SubscriptionResponse
)
async def create_subscription(request: CreateSubscriptionRequest):
    """
    Create new subscription with Stripe

    Pricing:
    - Parent plan: $29.99/month (1 child)
    - Family plan: $25/child/month
    - District plan: $15-20/student/month (volume-based)
    """
    try:
        subscription = await subscription_manager.create_subscription(
            customer_id=request.customer_id,
            tier=request.tier,
            payment_method_id=request.payment_method_id,
            child_count=request.child_count,
            student_count=request.student_count
        )

        return SubscriptionResponse(**subscription)

    except StripeError as e:
        logger.error("Stripe error: %s", str(e))
        raise HTTPException(
            status_code=400,
            detail=f"Stripe error: {str(e)}"
        ) from e
    except Exception as e:
        logger.error("Subscription creation failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Subscription creation failed: {str(e)}"
        ) from e


@app.get(
    "/v1/subscriptions/{subscription_id}",
    response_model=SubscriptionResponse
)
async def get_subscription(subscription_id: str):
    """Get subscription details"""
    try:
        subscription = await subscription_manager.get_subscription(
            subscription_id
        )

        if not subscription:
            raise HTTPException(
                status_code=404,
                detail="Subscription not found"
            )

        return SubscriptionResponse(**subscription)

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get subscription: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get subscription: {str(e)}"
        ) from e


@app.patch("/v1/subscriptions/{subscription_id}")
async def update_subscription(
    subscription_id: str,
    request: UpdateSubscriptionRequest
):
    """
    Update subscription

    Can change tier or adjust child/student counts.
    """
    try:
        updated = await subscription_manager.update_subscription(
            subscription_id=subscription_id,
            tier=request.tier,
            child_count=request.child_count,
            student_count=request.student_count
        )

        return {"success": True, "subscription": updated}

    except Exception as e:
        logger.error("Subscription update failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Subscription update failed: {str(e)}"
        ) from e


@app.post("/v1/subscriptions/{subscription_id}/cancel")
async def cancel_subscription(subscription_id: str):
    """Cancel subscription at period end"""
    try:
        result = await subscription_manager.cancel_subscription(
            subscription_id
        )

        return {
            "success": True,
            "message": "Subscription will cancel at period end",
            "cancel_at": result["cancel_at"]
        }

    except Exception as e:
        logger.error("Subscription cancellation failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Subscription cancellation failed: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - LICENSES
# ===========================================================================

@app.post("/v1/licenses/create", response_model=LicenseResponse)
async def create_license(request: CreateLicenseRequest):
    """
    Create district license

    District pricing: $15-20/student/month based on volume
    """
    try:
        license_data = await license_manager.create_license(
            district_id=request.district_id,
            district_name=request.district_name,
            student_count=request.student_count,
            duration_months=request.duration_months
        )

        return LicenseResponse(**license_data)

    except Exception as e:
        logger.error("License creation failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"License creation failed: {str(e)}"
        ) from e


@app.get(
    "/v1/licenses/{license_id}",
    response_model=LicenseResponse
)
async def get_license(license_id: str):
    """Get license details"""
    try:
        license_data = await license_manager.get_license(license_id)

        if not license_data:
            raise HTTPException(
                status_code=404,
                detail="License not found"
            )

        return LicenseResponse(**license_data)

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get license: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get license: {str(e)}"
        ) from e


@app.get("/v1/licenses/district/{district_id}")
async def get_district_licenses(district_id: str):
    """Get all licenses for a district"""
    try:
        licenses = await license_manager.get_district_licenses(district_id)

        return {
            "district_id": district_id,
            "licenses": licenses,
            "total_seats": sum(lic["student_count"] for lic in licenses),
            "total_used": sum(lic["seats_used"] for lic in licenses)
        }

    except Exception as e:
        logger.error("Failed to get district licenses: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get district licenses: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - CHURN PREDICTION
# ===========================================================================

@app.get(
    "/v1/churn/predict/{customer_id}",
    response_model=ChurnPredictionResponse
)
async def predict_churn(customer_id: str):
    """
    Predict customer churn risk

    Analyzes:
    - Usage patterns
    - Payment history
    - Support tickets
    - Engagement metrics
    """
    try:
        prediction = await churn_predictor.predict_churn(customer_id)

        return ChurnPredictionResponse(**prediction)

    except Exception as e:
        logger.error("Churn prediction failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Churn prediction failed: {str(e)}"
        ) from e


@app.get("/v1/churn/high-risk")
async def get_high_risk_customers():
    """Get list of high-risk customers"""
    try:
        high_risk = await churn_predictor.get_high_risk_customers(
            threshold=settings.CHURN_THRESHOLD
        )

        return {
            "high_risk_count": len(high_risk),
            "customers": high_risk
        }

    except Exception as e:
        logger.error("Failed to get high-risk customers: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get high-risk customers: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - WEBHOOKS
# ===========================================================================

@app.post("/v1/webhooks/stripe")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhooks

    Events:
    - payment_intent.succeeded
    - payment_intent.payment_failed
    - customer.subscription.updated
    - customer.subscription.deleted
    """
    try:
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")

        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )

        result = await webhook_handler.handle_webhook(
            event["type"],
            event["data"]
        )

        return {"status": "success", "result": result}

    except ValueError as e:
        logger.error("Invalid payload: %s", str(e))
        raise HTTPException(status_code=400, detail="Invalid payload") from e
    except SignatureVerificationError as e:
        logger.error("Invalid signature: %s", str(e))
        raise HTTPException(status_code=400, detail="Invalid signature") from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011)
