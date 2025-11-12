"""
Stripe Webhook Handler
Subscription lifecycle and dunning management
"""

from typing import Dict, List
from datetime import datetime, timedelta
from enum import Enum


class WebhookEvent(str, Enum):
    """Stripe webhook event types"""
    SUBSCRIPTION_CREATED = "customer.subscription.created"
    SUBSCRIPTION_UPDATED = "customer.subscription.updated"
    SUBSCRIPTION_DELETED = "customer.subscription.deleted"
    PAYMENT_SUCCEEDED = "invoice.payment_succeeded"
    PAYMENT_FAILED = "invoice.payment_failed"
    PAYMENT_ACTION_REQUIRED = "invoice.payment_action_required"
    TRIAL_ENDING = "customer.subscription.trial_will_end"


class StripeWebhookHandler:
    """
    Handle Stripe webhook events
    Subscription lifecycle, payments, dunning
    """
    
    def __init__(self, db, notification_service):
        self.db = db
        self.notification_service = notification_service
        
        # Dunning schedule (days after failure)
        self.dunning_schedule = [3, 7, 14]
    
    async def handle_webhook(
        self,
        event_type: str,
        event_data: Dict
    ) -> Dict:
        """
        Route webhook to appropriate handler
        """
        
        handlers = {
            WebhookEvent.SUBSCRIPTION_CREATED: self.handle_subscription_created,
            WebhookEvent.SUBSCRIPTION_UPDATED: self.handle_subscription_updated,
            WebhookEvent.SUBSCRIPTION_DELETED: self.handle_subscription_deleted,
            WebhookEvent.PAYMENT_SUCCEEDED: self.handle_payment_succeeded,
            WebhookEvent.PAYMENT_FAILED: self.handle_payment_failed,
            WebhookEvent.PAYMENT_ACTION_REQUIRED: self.handle_payment_action_required,
            WebhookEvent.TRIAL_ENDING: self.handle_trial_ending
        }
        
        handler = handlers.get(event_type)
        
        if not handler:
            return {"status": "ignored", "event_type": event_type}
        
        result = await handler(event_data)
        
        # Log webhook processing
        await self._log_webhook(event_type, event_data, result)
        
        return result
    
    async def handle_subscription_created(self, data: Dict) -> Dict:
        """
        New subscription created
        - Send welcome email
        - Start onboarding
        """
        
        subscription = data['object']
        customer_id = subscription['customer']
        
        # Get customer details
        customer = await self._get_customer(customer_id)
        
        # Send welcome email
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="subscription",
            channel="email",
            template="welcome_subscription",
            data={
                "customer_name": customer['name'],
                "plan": subscription['items']['data'][0]['price']['nickname'],
                "trial_end": subscription.get('trial_end')
            }
        )
        
        # Track in analytics
        await self._track_event(
            customer_id,
            "subscription_created",
            {"plan": subscription['items']['data'][0]['price']['id']}
        )
        
        return {
            "status": "processed",
            "action": "welcome_sent"
        }
    
    async def handle_subscription_updated(self, data: Dict) -> Dict:
        """
        Subscription updated (plan change, quantity, etc.)
        - Send confirmation email
        - Update billing
        """
        
        subscription = data['object']
        previous_attributes = data.get('previous_attributes', {})
        
        customer_id = subscription['customer']
        customer = await self._get_customer(customer_id)
        
        # Detect change type
        changes = []
        
        if 'items' in previous_attributes:
            changes.append("plan_change")
        
        if 'quantity' in previous_attributes:
            changes.append("quantity_change")
        
        if 'cancel_at_period_end' in previous_attributes:
            if subscription['cancel_at_period_end']:
                changes.append("scheduled_cancellation")
            else:
                changes.append("cancellation_reverted")
        
        # Send notification
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="subscription",
            channel="email",
            template="subscription_updated",
            data={
                "customer_name": customer['name'],
                "changes": changes,
                "effective_date": subscription['current_period_end']
            }
        )
        
        return {
            "status": "processed",
            "changes": changes
        }
    
    async def handle_subscription_deleted(self, data: Dict) -> Dict:
        """
        Subscription canceled
        - Send cancellation confirmation
        - Start offboarding
        - Request feedback
        """
        
        subscription = data['object']
        customer_id = subscription['customer']
        customer = await self._get_customer(customer_id)
        
        # Update subscription status
        await self._update_subscription_status(
            subscription['id'],
            'canceled'
        )
        
        # Send cancellation email with feedback request
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="subscription",
            channel="email",
            template="subscription_canceled",
            data={
                "customer_name": customer['name'],
                "end_date": subscription['ended_at'],
                "feedback_url": f"https://aivo.com/feedback?customer={customer_id}"
            }
        )
        
        # Track churn
        await self._track_event(
            customer_id,
            "subscription_canceled",
            {
                "reason": subscription.get('cancellation_details', {}).get('reason'),
                "lifetime_days": self._calculate_lifetime(subscription)
            }
        )
        
        return {
            "status": "processed",
            "action": "cancellation_confirmed"
        }
    
    async def handle_payment_succeeded(self, data: Dict) -> Dict:
        """
        Payment successful
        - Send receipt
        - Reset failed payment count
        """
        
        invoice = data['object']
        customer_id = invoice['customer']
        customer = await self._get_customer(customer_id)
        
        # Send receipt
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="payment",
            channel="email",
            template="payment_receipt",
            data={
                "customer_name": customer['name'],
                "amount": invoice['amount_paid'] / 100,
                "invoice_pdf": invoice['invoice_pdf']
            }
        )
        
        # Reset failed payment counter
        await self._reset_failed_payments(customer_id)
        
        # Update subscription status to active
        if invoice.get('subscription'):
            await self._update_subscription_status(
                invoice['subscription'],
                'active'
            )
        
        return {
            "status": "processed",
            "action": "receipt_sent"
        }
    
    async def handle_payment_failed(self, data: Dict) -> Dict:
        """
        Payment failed
        - Start dunning sequence
        - Assess churn risk
        - Send recovery email
        """
        
        invoice = data['object']
        customer_id = invoice['customer']
        customer = await self._get_customer(customer_id)
        
        # Increment failed payment count
        failed_count = await self._increment_failed_payments(customer_id)
        
        # Determine dunning action based on attempt count
        if failed_count == 1:
            # First failure - immediate retry
            template = "payment_failed_first"
            action = "immediate_retry"
        elif failed_count == 2:
            # Second failure - update payment method
            template = "payment_failed_second"
            action = "update_payment_method"
        elif failed_count >= 3:
            # Third+ failure - final notice
            template = "payment_failed_final"
            action = "final_notice"
        else:
            template = "payment_failed"
            action = "retry"
        
        # Send dunning email
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="payment",
            channel="email",
            template=template,
            priority="high",
            data={
                "customer_name": customer['name'],
                "amount": invoice['amount_due'] / 100,
                "attempt_count": failed_count,
                "next_retry": self._calculate_next_retry(failed_count),
                "update_url": f"https://aivo.com/billing/update?customer={customer_id}"
            }
        )
        
        # Assess churn risk
        churn_risk = await self._assess_churn_risk(
            customer_id,
            failed_count
        )
        
        # If high risk, notify retention team
        if churn_risk > 0.7:
            await self._notify_retention_team(
                customer_id,
                churn_risk,
                failed_count
            )
        
        # Update subscription status
        if invoice.get('subscription'):
            await self._update_subscription_status(
                invoice['subscription'],
                'past_due'
            )
        
        return {
            "status": "processed",
            "action": action,
            "failed_count": failed_count,
            "churn_risk": churn_risk
        }
    
    async def handle_payment_action_required(self, data: Dict) -> Dict:
        """
        3D Secure authentication required
        - Send action link to customer
        """
        
        invoice = data['object']
        customer_id = invoice['customer']
        customer = await self._get_customer(customer_id)
        
        # Send authentication request
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="payment",
            channel="email",
            template="payment_action_required",
            priority="high",
            data={
                "customer_name": customer['name'],
                "amount": invoice['amount_due'] / 100,
                "action_url": invoice['hosted_invoice_url']
            }
        )
        
        return {
            "status": "processed",
            "action": "authentication_requested"
        }
    
    async def handle_trial_ending(self, data: Dict) -> Dict:
        """
        Trial ending in 3 days
        - Send reminder with value proposition
        - Offer to extend or convert
        """
        
        subscription = data['object']
        customer_id = subscription['customer']
        customer = await self._get_customer(customer_id)
        
        # Calculate days until trial end
        trial_end = datetime.fromtimestamp(subscription['trial_end'])
        days_remaining = (trial_end - datetime.utcnow()).days
        
        # Send trial ending reminder
        await self.notification_service.send_notification(
            user_id=customer['id'],
            category="subscription",
            channel="email",
            template="trial_ending",
            priority="high",
            data={
                "customer_name": customer['name'],
                "days_remaining": days_remaining,
                "trial_end_date": trial_end.strftime('%B %d, %Y'),
                "plan_price": subscription['items']['data'][0]['price']['unit_amount'] / 100,
                "features_used": await self._get_feature_usage(customer_id)
            }
        )
        
        return {
            "status": "processed",
            "action": "trial_reminder_sent",
            "days_remaining": days_remaining
        }
    
    def _calculate_next_retry(self, failed_count: int) -> str:
        """Calculate next retry date based on dunning schedule"""
        
        if failed_count <= len(self.dunning_schedule):
            days = self.dunning_schedule[failed_count - 1]
        else:
            days = 14  # Default to 14 days for subsequent retries
        
        next_retry = datetime.utcnow() + timedelta(days=days)
        return next_retry.strftime('%B %d, %Y')
    
    async def _get_customer(self, stripe_customer_id: str) -> Dict:
        """Get customer from database"""
        query = """
            SELECT id, name, email
            FROM customers
            WHERE stripe_customer_id = $1
        """
        return await self.db.fetchrow(query, stripe_customer_id)
    
    async def _increment_failed_payments(self, customer_id: str) -> int:
        """Increment and return failed payment count"""
        query = """
            UPDATE subscriptions
            SET failed_payment_count = failed_payment_count + 1,
                last_payment_failed_at = $1
            WHERE customer_id = $2
            RETURNING failed_payment_count
        """
        result = await self.db.fetchrow(
            query,
            datetime.utcnow(),
            customer_id
        )
        return result['failed_payment_count']
    
    async def _reset_failed_payments(self, customer_id: str):
        """Reset failed payment count on successful payment"""
        query = """
            UPDATE subscriptions
            SET failed_payment_count = 0,
                last_payment_failed_at = NULL
            WHERE customer_id = $1
        """
        await self.db.execute(query, customer_id)
    
    async def _update_subscription_status(
        self,
        subscription_id: str,
        status: str
    ):
        """Update subscription status"""
        query = """
            UPDATE subscriptions
            SET status = $1,
                updated_at = $2
            WHERE stripe_subscription_id = $3
        """
        await self.db.execute(
            query,
            status,
            datetime.utcnow(),
            subscription_id
        )
    
    async def _assess_churn_risk(
        self,
        customer_id: str,
        failed_payment_count: int
    ) -> float:
        """Calculate churn risk based on failed payments"""
        
        # Base risk from failed payments
        risk = min(failed_payment_count * 0.25, 0.75)
        
        # Get engagement data
        query = """
            SELECT engagement_score, last_active_at
            FROM user_analytics
            WHERE customer_id = $1
        """
        result = await self.db.fetchrow(query, customer_id)
        
        if result:
            # Add risk for low engagement
            if result['engagement_score'] < 0.3:
                risk += 0.15
            
            # Add risk for inactivity
            days_inactive = (
                datetime.utcnow() - result['last_active_at']
            ).days
            if days_inactive > 7:
                risk += 0.1
        
        return min(risk, 1.0)
    
    async def _notify_retention_team(
        self,
        customer_id: str,
        churn_risk: float,
        failed_payment_count: int
    ):
        """Notify retention team of high-risk customer"""
        
        # Send internal notification
        await self.notification_service.send_notification(
            user_id="retention_team",
            category="internal_alert",
            channel="email",
            template="high_churn_risk",
            priority="critical",
            data={
                "customer_id": customer_id,
                "churn_risk": churn_risk,
                "failed_payment_count": failed_payment_count,
                "recommended_action": "immediate_outreach"
            }
        )
    
    async def _get_feature_usage(self, customer_id: str) -> List[Dict]:
        """Get features used during trial"""
        query = """
            SELECT feature_name, usage_count
            FROM feature_usage
            WHERE customer_id = $1
            AND usage_count > 0
            ORDER BY usage_count DESC
            LIMIT 5
        """
        results = await self.db.fetch(query, customer_id)
        return [dict(r) for r in results]
    
    def _calculate_lifetime(self, subscription: Dict) -> int:
        """Calculate subscription lifetime in days"""
        start = subscription['created']
        end = subscription['ended_at']
        return (end - start) // 86400  # Convert seconds to days
    
    async def _track_event(
        self,
        customer_id: str,
        event_type: str,
        metadata: Dict
    ):
        """Track analytics event"""
        query = """
            INSERT INTO analytics_events (
                customer_id,
                event_type,
                metadata,
                created_at
            ) VALUES ($1, $2, $3, $4)
        """
        await self.db.execute(
            query,
            customer_id,
            event_type,
            metadata,
            datetime.utcnow()
        )
    
    async def _log_webhook(
        self,
        event_type: str,
        event_data: Dict,
        result: Dict
    ):
        """Log webhook processing"""
        query = """
            INSERT INTO webhook_logs (
                event_type,
                event_data,
                result,
                processed_at
            ) VALUES ($1, $2, $3, $4)
        """
        await self.db.execute(
            query,
            event_type,
            event_data,
            result,
            datetime.utcnow()
        )
