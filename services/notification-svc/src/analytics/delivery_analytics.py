"""
Delivery Analytics
Track notification performance and engagement
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
import secrets


@dataclass
class AnalyticsEvent:
    """Analytics event"""
    event_type: str
    user_id: str
    notification_id: str
    channel: str
    category: str
    timestamp: datetime
    metadata: Dict


class DeliveryAnalytics:
    """
    Track and analyze notification delivery and engagement
    Open rates, click-through rates, bounces, A/B testing
    """

    def __init__(self, db, redis_client):
        self.db = db
        self.redis = redis_client

    async def track_sent(
        self,
        notification_id: str,
        user_id: str,
        category: str,
        channel: str,
        template_name: str,
        metadata: Dict = None
    ):
        """Track notification sent"""

        query = """
            INSERT INTO notification_analytics (
                notification_id,
                user_id,
                category,
                channel,
                template_name,
                status,
                metadata,
                sent_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """

        await self.db.execute(
            query,
            notification_id,
            user_id,
            category,
            channel,
            template_name,
            "sent",
            metadata or {},
            datetime.utcnow()
        )

        # Update metrics
        await self._increment_metric(f"sent:{channel}:{category}")

    async def track_delivered(
        self,
        notification_id: str,
        delivery_time_ms: int
    ):
        """Track successful delivery"""

        query = """
            UPDATE notification_analytics
            SET status = 'delivered',
                delivered_at = $1,
                delivery_time_ms = $2
            WHERE notification_id = $3
        """

        await self.db.execute(
            query,
            datetime.utcnow(),
            delivery_time_ms,
            notification_id
        )

        # Get notification details for metrics
        notif = await self._get_notification(notification_id)
        if notif:
            await self._increment_metric(
                f"delivered:{notif['channel']}:{notif['category']}"
            )

    async def track_opened(
        self,
        notification_id: str,
        tracking_pixel_id: str = None
    ):
        """Track notification opened (email open tracking)"""

        query = """
            UPDATE notification_analytics
            SET opened_at = $1,
                open_count = open_count + 1
            WHERE notification_id = $2
        """

        await self.db.execute(
            query,
            datetime.utcnow(),
            notification_id
        )

        # Track in Redis for real-time metrics
        notif = await self._get_notification(notification_id)
        if notif:
            await self._increment_metric(
                f"opened:{notif['channel']}:{notif['category']}"
            )

    async def track_clicked(
        self,
        notification_id: str,
        link_url: str,
        click_id: str = None
    ):
        """Track link click"""

        # Update notification record
        query = """
            UPDATE notification_analytics
            SET clicked_at = $1,
                click_count = click_count + 1
            WHERE notification_id = $2
        """

        await self.db.execute(
            query,
            datetime.utcnow(),
            notification_id
        )

        # Track individual click
        click_query = """
            INSERT INTO notification_clicks (
                notification_id,
                link_url,
                click_id,
                clicked_at
            ) VALUES ($1, $2, $3, $4)
        """

        await self.db.execute(
            click_query,
            notification_id,
            link_url,
            click_id or secrets.token_urlsafe(16),
            datetime.utcnow()
        )

        # Update metrics
        notif = await self._get_notification(notification_id)
        if notif:
            await self._increment_metric(
                f"clicked:{notif['channel']}:{notif['category']}"
            )

    async def track_bounced(
        self,
        notification_id: str,
        bounce_type: str,  # hard or soft
        reason: str
    ):
        """Track bounce"""

        query = """
            UPDATE notification_analytics
            SET status = 'bounced',
                bounce_type = $1,
                bounce_reason = $2,
                bounced_at = $3
            WHERE notification_id = $4
        """

        await self.db.execute(
            query,
            bounce_type,
            reason,
            datetime.utcnow(),
            notification_id
        )

        # Update metrics
        notif = await self._get_notification(notification_id)
        if notif:
            await self._increment_metric(
                f"bounced:{notif['channel']}:{notif['category']}"
            )
            await self._increment_metric(
                f"bounced_{bounce_type}:{notif['channel']}"
            )

    async def track_unsubscribed(
        self,
        notification_id: str,
        unsubscribe_reason: str = None
    ):
        """Track unsubscribe from notification"""

        query = """
            UPDATE notification_analytics
            SET unsubscribed_at = $1,
                unsubscribe_reason = $2
            WHERE notification_id = $3
        """

        await self.db.execute(
            query,
            datetime.utcnow(),
            unsubscribe_reason,
            notification_id
        )

        # Update metrics
        notif = await self._get_notification(notification_id)
        if notif:
            await self._increment_metric(
                f"unsubscribed:{notif['channel']}:{notif['category']}"
            )

    async def generate_tracking_pixel(
        self,
        notification_id: str
    ) -> str:
        """Generate tracking pixel for email opens"""

        pixel_id = secrets.token_urlsafe(16)

        # Store mapping
        await self.redis.setex(
            f"tracking_pixel:{pixel_id}",
            2592000,  # 30 days
            notification_id
        )

        return pixel_id

    async def generate_click_tracking_url(
        self,
        notification_id: str,
        target_url: str
    ) -> str:
        """Generate click tracking URL"""

        click_id = secrets.token_urlsafe(16)

        # Store mapping
        await self.redis.setex(
            f"click_tracking:{click_id}",
            2592000,  # 30 days
            f"{notification_id}|{target_url}"
        )

        return f"https://aivo.com/track/click/{click_id}"

    async def calculate_rates(
        self,
        channel: str,
        category: str,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        """Calculate delivery, open, and click-through rates"""

        query = """
            SELECT
                COUNT(*) as total_sent,
                COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
                COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened,
                COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked,
                COUNT(*) FILTER (WHERE status = 'bounced') as bounced,
                COUNT(*) FILTER (WHERE bounce_type = 'hard') as hard_bounces,
                COUNT(*) FILTER (WHERE bounce_type = 'soft') as soft_bounces,
                COUNT(*) FILTER (WHERE unsubscribed_at IS NOT NULL) as unsubscribed,
                AVG(delivery_time_ms) as avg_delivery_time_ms
            FROM notification_analytics
            WHERE channel = $1
            AND category = $2
            AND sent_at >= $3
            AND sent_at <= $4
        """

        result = await self.db.fetchrow(
            query,
            channel,
            category,
            start_date,
            end_date
        )

        total_sent = result['total_sent'] or 0
        delivered = result['delivered'] or 0
        opened = result['opened'] or 0
        clicked = result['clicked'] or 0
        bounced = result['bounced'] or 0

        # Calculate rates
        delivery_rate = (delivered / total_sent * 100) if total_sent > 0 else 0
        open_rate = (opened / delivered * 100) if delivered > 0 else 0
        click_rate = (clicked / delivered * 100) if delivered > 0 else 0
        bounce_rate = (bounced / total_sent * 100) if total_sent > 0 else 0
        unsubscribe_rate = (
            (result['unsubscribed'] / delivered * 100)
            if delivered > 0 else 0
        )

        return {
            "channel": channel,
            "category": category,
            "period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "counts": {
                "total_sent": total_sent,
                "delivered": delivered,
                "opened": opened,
                "clicked": clicked,
                "bounced": bounced,
                "hard_bounces": result['hard_bounces'] or 0,
                "soft_bounces": result['soft_bounces'] or 0,
                "unsubscribed": result['unsubscribed'] or 0
            },
            "rates": {
                "delivery_rate": round(delivery_rate, 2),
                "open_rate": round(open_rate, 2),
                "click_through_rate": round(click_rate, 2),
                "bounce_rate": round(bounce_rate, 2),
                "unsubscribe_rate": round(unsubscribe_rate, 2)
            },
            "performance": {
                "avg_delivery_time_ms": (
                    result['avg_delivery_time_ms'] or 0
                )
            }
        }

    async def get_ab_test_results(
        self,
        test_id: str
    ) -> Dict:
        """Get A/B test results"""

        # Get test config
        test_query = """
            SELECT
                test_name,
                template_name,
                variant_a_version,
                variant_b_version,
                created_at
            FROM template_ab_tests
            WHERE test_id = $1
        """

        test = await self.db.fetchrow(test_query, test_id)

        if not test:
            return None

        # Get metrics for each variant
        metrics_query = """
            SELECT
                template_version,
                COUNT(*) as sent,
                COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened,
                COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked,
                AVG(delivery_time_ms) as avg_delivery_time
            FROM notification_analytics
            WHERE template_name = $1
            AND template_version IN ($2, $3)
            AND sent_at >= $4
            GROUP BY template_version
        """

        results = await self.db.fetch(
            metrics_query,
            test['template_name'],
            test['variant_a_version'],
            test['variant_b_version'],
            test['created_at']
        )

        # Calculate rates for each variant
        variants = {}

        for result in results:
            version = result['template_version']
            sent = result['sent'] or 0
            opened = result['opened'] or 0
            clicked = result['clicked'] or 0

            variants[version] = {
                "sent": sent,
                "opened": opened,
                "clicked": clicked,
                "open_rate": (opened / sent * 100) if sent > 0 else 0,
                "click_rate": (clicked / sent * 100) if sent > 0 else 0,
                "avg_delivery_time_ms": result['avg_delivery_time']
            }

        # Determine winner
        variant_a = variants.get(test['variant_a_version'], {})
        variant_b = variants.get(test['variant_b_version'], {})

        winner = None
        if variant_a.get('click_rate', 0) > variant_b.get('click_rate', 0):
            winner = "variant_a"
            lift = (
                (variant_a['click_rate'] - variant_b['click_rate']) /
                variant_b['click_rate'] * 100
                if variant_b.get('click_rate', 0) > 0 else 0
            )
        elif variant_b.get('click_rate', 0) > variant_a.get('click_rate', 0):
            winner = "variant_b"
            lift = (
                (variant_b['click_rate'] - variant_a['click_rate']) /
                variant_a['click_rate'] * 100
                if variant_a.get('click_rate', 0) > 0 else 0
            )
        else:
            lift = 0

        return {
            "test_id": test_id,
            "test_name": test['test_name'],
            "template_name": test['template_name'],
            "variant_a": variant_a,
            "variant_b": variant_b,
            "winner": winner,
            "lift_percentage": round(lift, 2) if lift else 0,
            "recommendation": self._generate_ab_recommendation(
                variant_a,
                variant_b,
                winner
            )
        }

    def _generate_ab_recommendation(
        self,
        variant_a: Dict,
        variant_b: Dict,
        winner: Optional[str]
    ) -> str:
        """Generate recommendation for A/B test"""

        min_sample = 100

        a_sent = variant_a.get('sent', 0)
        b_sent = variant_b.get('sent', 0)

        if a_sent < min_sample or b_sent < min_sample:
            return "Continue test - need more data for significance"

        if not winner:
            return "No significant difference - keep current version"

        if winner == "variant_a":
            return f"Use Variant A - {variant_a['click_rate']:.2f}% CTR"
        else:
            return f"Use Variant B - {variant_b['click_rate']:.2f}% CTR"

    async def get_channel_performance(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict]:
        """Compare performance across channels"""

        query = """
            SELECT
                channel,
                COUNT(*) as sent,
                COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
                COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened,
                COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked,
                AVG(delivery_time_ms) as avg_delivery_time
            FROM notification_analytics
            WHERE sent_at >= $1
            AND sent_at <= $2
            GROUP BY channel
            ORDER BY sent DESC
        """

        results = await self.db.fetch(query, start_date, end_date)

        performance = []

        for result in results:
            sent = result['sent'] or 0
            delivered = result['delivered'] or 0

            performance.append({
                "channel": result['channel'],
                "sent": sent,
                "delivered": delivered,
                "opened": result['opened'] or 0,
                "clicked": result['clicked'] or 0,
                "delivery_rate": (
                    (delivered / sent * 100) if sent > 0 else 0
                ),
                "open_rate": (
                    (result['opened'] / delivered * 100)
                    if delivered > 0 else 0
                ),
                "click_rate": (
                    (result['clicked'] / delivered * 100)
                    if delivered > 0 else 0
                ),
                "avg_delivery_time_ms": result['avg_delivery_time']
            })

        return performance

    async def _get_notification(
        self,
        notification_id: str
    ) -> Optional[Dict]:
        """Get notification details"""

        query = """
            SELECT channel, category, template_name
            FROM notification_analytics
            WHERE notification_id = $1
        """

        result = await self.db.fetchrow(query, notification_id)

        return dict(result) if result else None

    async def _increment_metric(self, metric_key: str):
        """Increment metric counter in Redis"""

        key = f"metrics:{metric_key}"
        await self.redis.incr(key)

        # Set TTL of 30 days
        await self.redis.expire(key, 2592000)

    async def get_real_time_metrics(self) -> Dict:
        """Get real-time metrics from Redis"""

        # Get all metric keys
        pattern = "metrics:*"
        keys = await self.redis.keys(pattern)

        metrics = {}

        for key in keys:
            value = await self.redis.get(key)
            metric_name = key.replace("metrics:", "")
            metrics[metric_name] = int(value) if value else 0

        return metrics
