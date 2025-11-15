"""
Delivery Orchestrator
Intelligent multi-channel notification routing
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import asyncio


class Priority(str, Enum):
    """Notification priority levels"""
    CRITICAL = "critical"    # Send immediately, no quiet hours
    HIGH = "high"           # Send within 5 minutes
    NORMAL = "normal"       # Send within 30 minutes
    LOW = "low"             # Can be batched/digested


class Channel(str, Enum):
    """Delivery channels"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"


class DeliveryOrchestrator:
    """
    Intelligent notification delivery with routing and fallback
    """

    def __init__(
        self,
        email_provider,
        sms_provider,
        push_provider,
        in_app_provider,
        preference_manager,
        db,
        redis_client
    ):
        self.email = email_provider
        self.sms = sms_provider
        self.push = push_provider
        self.in_app = in_app_provider
        self.preferences = preference_manager
        self.db = db
        self.redis = redis_client

        # Rate limits per channel (requests per second)
        self.rate_limits = {
            Channel.EMAIL: 100,
            Channel.SMS: 10,
            Channel.PUSH: 500,
            Channel.IN_APP: 1000
        }

        # Retry configuration
        self.retry_delays = [10, 30, 60]  # seconds
        self.max_retries = 3

    async def send_notification(
        self,
        user_id: str,
        category: str,
        content: Dict,
        priority: Priority = Priority.NORMAL,
        channels: List[Channel] = None
    ) -> Dict:
        """
        Send notification with intelligent routing
        """

        # Get user preferences
        user_prefs = await self.preferences.get_preferences(user_id)

        # Determine channels to use
        if channels:
            target_channels = channels
        else:
            target_channels = await self._select_channels(
                user_prefs,
                category,
                priority
            )

        # Check quiet hours (unless critical)
        if priority != Priority.CRITICAL:
            if await self._is_quiet_hours(user_prefs):
                # Defer notification
                return await self._defer_notification(
                    user_id,
                    category,
                    content,
                    target_channels,
                    priority
                )

        # Optimize delivery time (unless high/critical priority)
        if priority in [Priority.NORMAL, Priority.LOW]:
            optimal_time = await self._calculate_optimal_time(user_id)
            if optimal_time > datetime.utcnow():
                return await self._schedule_notification(
                    user_id,
                    category,
                    content,
                    target_channels,
                    optimal_time
                )

        # Send via selected channels with fallback
        results = await self._send_multi_channel(
            user_id,
            category,
            content,
            target_channels,
            priority
        )

        return {
            "status": "sent",
            "channels_attempted": len(target_channels),
            "channels_succeeded": sum(1 for r in results if r["success"]),
            "results": results
        }

    async def _select_channels(
        self,
        user_prefs: Dict,
        category: str,
        priority: Priority
    ) -> List[Channel]:
        """
        Select optimal channels based on preferences and priority
        """

        selected = []

        # Get category preferences
        category_prefs = user_prefs.get("categories", {}).get(category, {})

        # Critical: Use all enabled channels
        if priority == Priority.CRITICAL:
            for channel in Channel:
                if user_prefs.get("channels", {}).get(channel.value, True):
                    selected.append(channel)
            return selected

        # High: Use preferred channels + SMS fallback
        if priority == Priority.HIGH:
            # Primary channel from preferences
            primary = category_prefs.get("primary_channel", "email")
            if user_prefs.get("channels", {}).get(primary, True):
                selected.append(Channel(primary))

            # Add SMS as fallback if enabled
            if user_prefs.get("channels", {}).get("sms", False):
                if Channel.SMS not in selected:
                    selected.append(Channel.SMS)

            return selected

        # Normal: Use category-specific preferences
        if priority == Priority.NORMAL:
            preferred_channels = category_prefs.get(
                "channels",
                ["email", "push"]
            )

            for channel_name in preferred_channels:
                channel = Channel(channel_name)
                if user_prefs.get("channels", {}).get(channel_name, True):
                    selected.append(channel)

            return selected

        # Low: Email only (for digests)
        return [Channel.EMAIL]

    async def _is_quiet_hours(self, user_prefs: Dict) -> bool:
        """Check if currently in user's quiet hours"""

        quiet_hours = user_prefs.get("quiet_hours")
        if not quiet_hours or not quiet_hours.get("enabled"):
            return False

        # Get user's current time (considering timezone)
        user_tz = user_prefs.get("timezone", "UTC")
        # Simplified: In production, use pytz
        current_time = datetime.utcnow().time()

        # Parse quiet hours
        start_str = quiet_hours.get("start", "22:00")
        end_str = quiet_hours.get("end", "08:00")

        start_hour, start_min = map(int, start_str.split(":"))
        end_hour, end_min = map(int, end_str.split(":"))

        start_time = datetime.utcnow().replace(
            hour=start_hour,
            minute=start_min
        ).time()
        end_time = datetime.utcnow().replace(
            hour=end_hour,
            minute=end_min
        ).time()

        # Handle overnight quiet hours (e.g., 22:00-08:00)
        if start_time > end_time:
            return current_time >= start_time or current_time <= end_time
        else:
            return start_time <= current_time <= end_time

    async def _calculate_optimal_time(self, user_id: str) -> datetime:
        """
        Calculate optimal delivery time based on user behavior
        """

        # Get user's historical engagement patterns
        query = """
            SELECT
                EXTRACT(HOUR FROM opened_at) as hour,
                COUNT(*) as opens
            FROM notification_engagement
            WHERE user_id = $1
            AND opened_at > $2
            GROUP BY hour
            ORDER BY opens DESC
            LIMIT 1
        """

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        result = await self.db.fetchrow(query, user_id, thirty_days_ago)

        if result and result['hour']:
            # Schedule for user's most active hour
            optimal_hour = int(result['hour'])

            now = datetime.utcnow()
            optimal_time = now.replace(
                hour=optimal_hour,
                minute=0,
                second=0,
                microsecond=0
            )

            # If optimal time already passed today, schedule for tomorrow
            if optimal_time <= now:
                optimal_time += timedelta(days=1)

            return optimal_time

        # Default: Send immediately
        return datetime.utcnow()

    async def _send_multi_channel(
        self,
        user_id: str,
        category: str,
        content: Dict,
        channels: List[Channel],
        priority: Priority
    ) -> List[Dict]:
        """
        Send via multiple channels with fallback
        """

        results = []

        for channel in channels:
            # Check rate limit
            if not await self._check_rate_limit(channel):
                results.append({
                    "channel": channel.value,
                    "success": False,
                    "error": "rate_limit_exceeded"
                })
                continue

            # Send with retry
            result = await self._send_with_retry(
                user_id,
                category,
                content,
                channel
            )

            results.append(result)

            # For critical priority, try all channels
            # For others, stop on first success
            if priority != Priority.CRITICAL and result["success"]:
                break

        return results

    async def _send_with_retry(
        self,
        user_id: str,
        category: str,
        content: Dict,
        channel: Channel
    ) -> Dict:
        """
        Send via channel with exponential backoff retry
        """

        last_error = None

        for attempt in range(self.max_retries):
            try:
                # Select provider
                if channel == Channel.EMAIL:
                    await self.email.send(user_id, content)
                elif channel == Channel.SMS:
                    await self.sms.send(user_id, content)
                elif channel == Channel.PUSH:
                    await self.push.send(user_id, content)
                elif channel == Channel.IN_APP:
                    await self.in_app.send(user_id, content)

                # Success
                await self._track_delivery(
                    user_id,
                    category,
                    channel,
                    "delivered"
                )

                return {
                    "channel": channel.value,
                    "success": True,
                    "attempt": attempt + 1
                }

            except Exception as e:
                last_error = str(e)

                # Wait before retry
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(self.retry_delays[attempt])

        # All retries failed
        await self._track_delivery(
            user_id,
            category,
            channel,
            "failed",
            last_error
        )

        return {
            "channel": channel.value,
            "success": False,
            "error": last_error,
            "attempts": self.max_retries
        }

    async def _check_rate_limit(self, channel: Channel) -> bool:
        """Check if under rate limit for channel"""

        key = f"rate_limit:{channel.value}"
        limit = self.rate_limits[channel]

        # Get current count
        count = await self.redis.get(key)
        count = int(count) if count else 0

        if count >= limit:
            return False

        # Increment counter
        await self.redis.incr(key)
        await self.redis.expire(key, 1)  # 1 second window

        return True

    async def _defer_notification(
        self,
        user_id: str,
        category: str,
        content: Dict,
        channels: List[Channel],
        priority: Priority
    ) -> Dict:
        """Defer notification until after quiet hours"""

        # Get user preferences for quiet hours end time
        user_prefs = await self.preferences.get_preferences(user_id)
        quiet_hours = user_prefs.get("quiet_hours", {})

        end_str = quiet_hours.get("end", "08:00")
        end_hour, end_min = map(int, end_str.split(":"))

        # Schedule for end of quiet hours
        scheduled_time = datetime.utcnow().replace(
            hour=end_hour,
            minute=end_min,
            second=0,
            microsecond=0
        )

        # If end time already passed today, schedule for tomorrow
        if scheduled_time <= datetime.utcnow():
            scheduled_time += timedelta(days=1)

        return await self._schedule_notification(
            user_id,
            category,
            content,
            channels,
            scheduled_time
        )

    async def _schedule_notification(
        self,
        user_id: str,
        category: str,
        content: Dict,
        channels: List[Channel],
        scheduled_time: datetime
    ) -> Dict:
        """Schedule notification for future delivery"""

        # Add to scheduled queue (Redis sorted set)
        notification_data = {
            "user_id": user_id,
            "category": category,
            "content": content,
            "channels": [c.value for c in channels],
            "created_at": datetime.utcnow().isoformat()
        }

        # Use timestamp as score for sorted set
        score = scheduled_time.timestamp()

        await self.redis.zadd(
            "scheduled_notifications",
            {str(notification_data): score}
        )

        return {
            "status": "scheduled",
            "scheduled_for": scheduled_time.isoformat(),
            "reason": "quiet_hours_or_optimization"
        }

    async def _track_delivery(
        self,
        user_id: str,
        category: str,
        channel: Channel,
        status: str,
        error: str = None
    ):
        """Track delivery attempt"""

        query = """
            INSERT INTO notification_logs (
                user_id,
                category,
                channel,
                status,
                error,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
        """

        await self.db.execute(
            query,
            user_id,
            category,
            channel.value,
            status,
            error,
            datetime.utcnow()
        )
