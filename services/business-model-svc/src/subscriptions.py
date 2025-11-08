"""
Subscription management with Stripe integration
"""
from datetime import datetime
from typing import Dict, Optional
import stripe
import logging

from .config import Settings

logger = logging.getLogger(__name__)
settings = Settings()


class SubscriptionManager:
    """
    Manage subscriptions with Stripe
    
    Pricing tiers:
    - Parent: $29.99/month (1 child)
    - Family: $25/child/month
    - District: $15-20/student/month (volume pricing)
    """
    
    def __init__(self):
        """Initialize subscription manager"""
        stripe.api_key = settings.STRIPE_API_KEY
    
    async def create_subscription(
        self,
        customer_id: str,
        tier: str,
        payment_method_id: str,
        child_count: Optional[int] = 1,
        student_count: Optional[int] = None
    ) -> Dict:
        """
        Create new subscription
        
        Args:
            customer_id: Stripe customer ID
            tier: Subscription tier (parent, family, district)
            payment_method_id: Stripe payment method ID
            child_count: Number of children (family plan)
            student_count: Number of students (district plan)
        
        Returns:
            Subscription data
        """
        # Calculate price based on tier
        if tier == "parent":
            price = settings.PARENT_PLAN_PRICE
        elif tier == "family":
            price = settings.FAMILY_PLAN_PRICE * (child_count or 1)
        elif tier == "district":
            price = self._calculate_district_price(student_count or 100)
        else:
            raise ValueError(f"Invalid tier: {tier}")
        
        # Create Stripe subscription
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"AIVO {tier.capitalize()} Plan"
                    },
                    "recurring": {
                        "interval": "month"
                    },
                    "unit_amount": price
                }
            }],
            default_payment_method=payment_method_id,
            metadata={
                "tier": tier,
                "child_count": str(child_count or 0),
                "student_count": str(student_count or 0)
            }
        )
        
        return {
            "id": subscription.id,
            "customer_id": customer_id,
            "tier": tier,
            "status": subscription.status,
            "amount": price,
            "current_period_start": datetime.fromtimestamp(
                subscription.current_period_start
            ),
            "current_period_end": datetime.fromtimestamp(
                subscription.current_period_end
            ),
            "cancel_at_period_end": subscription.cancel_at_period_end,
            "child_count": child_count,
            "student_count": student_count
        }
    
    async def get_subscription(self, subscription_id: str) -> Optional[Dict]:
        """Get subscription details"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            return {
                "id": subscription.id,
                "customer_id": subscription.customer,
                "tier": subscription.metadata.get("tier", "parent"),
                "status": subscription.status,
                "amount": subscription.items.data[0].price.unit_amount,
                "current_period_start": datetime.fromtimestamp(
                    subscription.current_period_start
                ),
                "current_period_end": datetime.fromtimestamp(
                    subscription.current_period_end
                ),
                "cancel_at_period_end": subscription.cancel_at_period_end,
                "child_count": int(
                    subscription.metadata.get("child_count", 0)
                ),
                "student_count": int(
                    subscription.metadata.get("student_count", 0)
                )
            }
        
        except stripe.error.InvalidRequestError:
            return None
    
    async def update_subscription(
        self,
        subscription_id: str,
        tier: Optional[str] = None,
        child_count: Optional[int] = None,
        student_count: Optional[int] = None
    ) -> Dict:
        """Update subscription"""
        subscription = stripe.Subscription.retrieve(subscription_id)
        
        # Update metadata
        metadata = subscription.metadata or {}
        if tier:
            metadata["tier"] = tier
        if child_count is not None:
            metadata["child_count"] = str(child_count)
        if student_count is not None:
            metadata["student_count"] = str(student_count)
        
        # Calculate new price
        current_tier = tier or metadata.get("tier", "parent")
        if current_tier == "parent":
            new_price = settings.PARENT_PLAN_PRICE
        elif current_tier == "family":
            count = child_count or int(metadata.get("child_count", 1))
            new_price = settings.FAMILY_PLAN_PRICE * count
        else:  # district
            count = student_count or int(metadata.get("student_count", 100))
            new_price = self._calculate_district_price(count)
        
        # Update subscription
        updated = stripe.Subscription.modify(
            subscription_id,
            items=[{
                "id": subscription.items.data[0].id,
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"AIVO {current_tier.capitalize()} Plan"
                    },
                    "recurring": {
                        "interval": "month"
                    },
                    "unit_amount": new_price
                }
            }],
            metadata=metadata
        )
        
        return {
            "id": updated.id,
            "status": updated.status,
            "amount": new_price
        }
    
    async def cancel_subscription(
        self, subscription_id: str
    ) -> Dict:
        """Cancel subscription at period end"""
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        
        return {
            "id": subscription.id,
            "cancel_at": datetime.fromtimestamp(
                subscription.current_period_end
            )
        }
    
    def _calculate_district_price(self, student_count: int) -> int:
        """
        Calculate district pricing based on volume
        
        Pricing:
        - 1-100 students: $20/student
        - 101-500 students: $18/student
        - 501-1000 students: $16/student
        - 1000+ students: $15/student
        """
        if student_count <= 100:
            price_per_student = 2000  # $20
        elif student_count <= 500:
            price_per_student = 1800  # $18
        elif student_count <= 1000:
            price_per_student = 1600  # $16
        else:
            price_per_student = 1500  # $15
        
        return price_per_student * student_count
