"""
Subscription management with Stripe integration
"""
from datetime import datetime
from typing import Any, Dict, Optional, cast
import logging

import stripe
from stripe.error import InvalidRequestError  # type: ignore[attr-defined]

from .config import Settings
from .db import Database, database

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

    def __init__(self, db: Database | None = None):
        """Initialize subscription manager"""
        stripe.api_key = settings.STRIPE_API_KEY
        self._db = db or database

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
            items=self._build_subscription_items(tier, price),
            default_payment_method=payment_method_id,
            metadata={
                "tier": tier,
                "child_count": str(child_count or 0),
                "student_count": str(student_count or 0)
            }
        )

        subscription_dict = self._stripe_obj_to_dict(subscription)

        subscription_data = {
            "id": subscription.id,
            "customer_id": customer_id,
            "tier": tier,
            "status": subscription_dict.get("status", "active"),
            "amount": price,
            "current_period_start": self._timestamp_to_datetime(
                subscription_dict.get("current_period_start"),
                "current_period_start",
            ),
            "current_period_end": self._timestamp_to_datetime(
                subscription_dict.get("current_period_end"),
                "current_period_end",
            ),
            "cancel_at_period_end": bool(
                subscription_dict.get("cancel_at_period_end", False)
            ),
            "child_count": child_count,
            "student_count": student_count
        }

        await self._persist_subscription(subscription_data)
        return subscription_data

    async def get_subscription(self, subscription_id: str) -> Optional[Dict]:
        """Get subscription details"""
        try:
            record = await self._db.fetchrow(
                """
                SELECT
                    id,
                    customer_id,
                    tier,
                    status,
                    price_cents,
                    current_period_start,
                    current_period_end,
                    cancel_at_period_end,
                    child_count,
                    student_count
                FROM subscriptions
                WHERE stripe_subscription_id = $1
                """,
                subscription_id,
            )

            if record:
                return self._row_to_subscription(record)

            subscription = stripe.Subscription.retrieve(subscription_id)
            subscription_dict = self._stripe_obj_to_dict(subscription)
            subscription_data = {
                "id": subscription_dict.get("id", subscription_id),
                "customer_id": subscription_dict.get("customer"),
                "tier": subscription_dict
                .get("metadata", {})
                .get("tier", "parent"),
                "status": subscription_dict.get("status", "active"),
                "amount": self._extract_unit_amount(subscription_dict),
                "current_period_start": self._timestamp_to_datetime(
                    subscription_dict.get("current_period_start"),
                    "current_period_start",
                ),
                "current_period_end": self._timestamp_to_datetime(
                    subscription_dict.get("current_period_end"),
                    "current_period_end",
                ),
                "cancel_at_period_end": bool(
                    subscription_dict.get("cancel_at_period_end", False)
                ),
                "child_count": int(
                    subscription_dict
                    .get("metadata", {})
                    .get("child_count", 0)
                ),
                "student_count": int(
                    subscription_dict
                    .get("metadata", {})
                    .get("student_count", 0)
                ),
            }
            await self._persist_subscription(subscription_data)
            return subscription_data

        except InvalidRequestError:
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
        update_items: Any = [{
            "id": subscription.items.data[0].id,
            "price_data": self._build_price_data(current_tier, new_price)
        }]

        updated = stripe.Subscription.modify(
            subscription_id,
            items=update_items,
            metadata=metadata
        )

        updated_dict = self._stripe_obj_to_dict(updated)

        updated_data = {
            "id": updated.id,
            "status": updated.status,
            "amount": new_price
        }
        await self._persist_subscription({
            "id": updated.id,
            "customer_id": updated.customer,
            "tier": current_tier,
            "status": updated.status,
            "amount": new_price,
            "current_period_start": self._timestamp_to_datetime(
                updated_dict.get("current_period_start"),
                "current_period_start",
            ),
            "current_period_end": self._timestamp_to_datetime(
                updated_dict.get("current_period_end"),
                "current_period_end",
            ),
            "cancel_at_period_end": bool(
                updated_dict.get("cancel_at_period_end", False)
            ),
            "child_count": child_count,
            "student_count": student_count,
        })
        return updated_data

    async def cancel_subscription(
        self, subscription_id: str
    ) -> Dict:
        """Cancel subscription at period end"""
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )

        subscription_dict = self._stripe_obj_to_dict(subscription)

        await self._db.execute(
            """
            UPDATE subscriptions
            SET cancel_at_period_end = TRUE,
                status = 'canceled'
            WHERE stripe_subscription_id = $1
            """,
            subscription_id,
        )

        return {
            "id": subscription.id,
            "cancel_at": self._timestamp_to_datetime(
                subscription_dict.get("current_period_end"),
                "current_period_end",
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

    async def _persist_subscription(self, data: Dict) -> None:
        if not self._db:
            return

        await self._db.execute(
            """
            INSERT INTO subscriptions (
                stripe_subscription_id,
                customer_id,
                tier,
                status,
                price_cents,
                current_period_start,
                current_period_end,
                cancel_at_period_end,
                child_count,
                student_count,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            ON CONFLICT (stripe_subscription_id) DO UPDATE SET
                status = EXCLUDED.status,
                price_cents = EXCLUDED.price_cents,
                current_period_start = EXCLUDED.current_period_start,
                current_period_end = EXCLUDED.current_period_end,
                cancel_at_period_end = EXCLUDED.cancel_at_period_end,
                child_count = EXCLUDED.child_count,
                student_count = EXCLUDED.student_count,
                updated_at = NOW()
            """,
            data["id"],
            data.get("customer_id"),
            data.get("tier"),
            data.get("status"),
            data.get("amount"),
            data.get("current_period_start"),
            data.get("current_period_end"),
            data.get("cancel_at_period_end"),
            data.get("child_count"),
            data.get("student_count"),
        )

    def _row_to_subscription(self, row) -> Dict:
        return {
            "id": row["id"],
            "customer_id": row["customer_id"],
            "tier": row["tier"],
            "status": row["status"],
            "amount": row["price_cents"],
            "current_period_start": row["current_period_start"],
            "current_period_end": row["current_period_end"],
            "cancel_at_period_end": row["cancel_at_period_end"],
            "child_count": row["child_count"],
            "student_count": row["student_count"],
        }

    def _build_subscription_items(self, tier: str, price: int) -> Any:
        """Structure Stripe items payload for create/update calls."""
        return [{
            "price_data": self._build_price_data(tier, price)
        }]

    def _build_price_data(self, tier: str, price: int) -> Dict[str, Any]:
        return {
            "currency": "usd",
            "product_data": {
                "name": f"AIVO {tier.capitalize()} Plan"
            },
            "recurring": {"interval": "month"},
            "unit_amount": price,
        }

    def _stripe_obj_to_dict(self, obj: Any) -> Dict[str, Any]:
        if hasattr(obj, "to_dict_recursive"):
            return cast(Dict[str, Any], obj.to_dict_recursive())
        return cast(Dict[str, Any], obj)

    def _timestamp_to_datetime(self, value: Any, field: str) -> datetime:
        if value is None:
            raise ValueError(f"Stripe subscription missing {field}")
        return datetime.fromtimestamp(int(value))

    def _extract_unit_amount(self, subscription_dict: Dict[str, Any]) -> int:
        items = subscription_dict.get("items", {})
        data = items.get("data", []) if isinstance(items, dict) else []
        if not data:
            return 0
        first_item = data[0]
        price = (
            first_item.get("price", {}) if isinstance(first_item, dict) else {}
        )
        return int(price.get("unit_amount", 0))
