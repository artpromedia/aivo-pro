"""
Notification Scheduler with Queue Processing
Background task processing, batching, recurring notifications
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
from dataclasses import dataclass


class RecurrenceType(str, Enum):
    """Recurrence patterns"""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


@dataclass
class NotificationJob:
    """Scheduled notification job"""
    job_id: str
    user_id: str
    category: str
    content: Dict
    channels: List[str]
    priority: str
    scheduled_for: datetime
    recurrence: Optional[str] = None
    recurrence_end: Optional[datetime] = None


class NotificationScheduler:
    """
    Queue-based notification scheduler
    Handles batching, digests, recurring notifications, drip campaigns
    """

    def __init__(self, db, redis_client, delivery_orchestrator):
        self.db = db
        self.redis = redis_client
        self.orchestrator = delivery_orchestrator
        self.is_running = False

        # Queue keys
        self.scheduled_queue = "scheduled_notifications"
        self.pending_queue = "pending_notifications"
        self.dead_letter_queue = "dlq_notifications"

        # Batch settings
        self.batch_size = 100
        self.batch_interval = 300  # 5 minutes

        # Digest settings
        self.digest_categories = ["learning_reminder", "homework_help"]
        self.digest_schedule = "daily"  # Send digests daily at 6 PM

    async def start_processor(self):
        """Start background queue processor"""
        self.is_running = True

        # Run multiple processors concurrently
        await asyncio.gather(
            self._process_scheduled_queue(),
            self._process_pending_queue(),
            self._process_batch_queue(),
            self._generate_digests()
        )

    async def stop_processor(self):
        """Stop background processor"""
        self.is_running = False

    async def queue_notification(
        self,
        user_id: str,
        category: str,
        content: Dict,
        channels: List[str],
        priority: str = "normal",
        scheduled_for: datetime = None,
        recurrence: str = None,
        recurrence_end: datetime = None
    ) -> str:
        """
        Queue notification for delivery
        Returns job ID
        """

        # Generate job ID
        job_id = f"notif_{user_id}_{datetime.utcnow().timestamp()}"

        # Default to immediate delivery
        if not scheduled_for:
            scheduled_for = datetime.utcnow()

        # Create job
        job = NotificationJob(
            job_id=job_id,
            user_id=user_id,
            category=category,
            content=content,
            channels=channels,
            priority=priority,
            scheduled_for=scheduled_for,
            recurrence=recurrence,
            recurrence_end=recurrence_end
        )

        # Add to scheduled queue (Redis sorted set)
        job_data = json.dumps({
            "job_id": job.job_id,
            "user_id": job.user_id,
            "category": job.category,
            "content": job.content,
            "channels": job.channels,
            "priority": job.priority,
            "recurrence": job.recurrence,
            "recurrence_end": (
                job.recurrence_end.isoformat()
                if job.recurrence_end else None
            ),
            "created_at": datetime.utcnow().isoformat()
        })

        # Use scheduled time as score
        score = scheduled_for.timestamp()

        await self.redis.zadd(
            self.scheduled_queue,
            {job_data: score}
        )

        return job_id

    async def _process_scheduled_queue(self):
        """
        Process scheduled notifications
        Move due notifications to pending queue
        """

        while self.is_running:
            try:
                # Get notifications due for delivery
                now = datetime.utcnow().timestamp()

                # Get items with score <= now
                results = await self.redis.zrangebyscore(
                    self.scheduled_queue,
                    min=0,
                    max=now,
                    start=0,
                    num=self.batch_size
                )

                for job_data in results:
                    # Parse job
                    job = json.loads(job_data)

                    # Move to pending queue
                    await self.redis.lpush(
                        self.pending_queue,
                        job_data
                    )

                    # Remove from scheduled queue
                    await self.redis.zrem(
                        self.scheduled_queue,
                        job_data
                    )

                    # If recurring, schedule next occurrence
                    if job.get("recurrence"):
                        await self._schedule_next_recurrence(job)

                # Sleep before next check
                await asyncio.sleep(10)  # Check every 10 seconds

            except Exception as e:
                print(f"Error processing scheduled queue: {e}")
                await asyncio.sleep(30)

    async def _process_pending_queue(self):
        """
        Process pending notifications
        Send via delivery orchestrator
        """

        while self.is_running:
            try:
                # Get next notification
                job_data = await self.redis.rpop(self.pending_queue)

                if not job_data:
                    await asyncio.sleep(5)
                    continue

                job = json.loads(job_data)

                # Send notification
                try:
                    result = await self.orchestrator.send_notification(
                        user_id=job["user_id"],
                        category=job["category"],
                        content=job["content"],
                        priority=job["priority"],
                        channels=[c for c in job["channels"]]
                    )

                    if result.get("status") == "sent":
                        # Success - track metrics
                        await self._track_delivery_success(job)
                    else:
                        # Failed - move to DLQ
                        await self._move_to_dlq(
                            job,
                            "delivery_failed"
                        )

                except Exception as e:
                    # Error - move to DLQ
                    await self._move_to_dlq(job, str(e))

            except Exception as e:
                print(f"Error processing pending queue: {e}")
                await asyncio.sleep(10)

    async def _process_batch_queue(self):
        """
        Process low-priority notifications in batches
        Aggregate similar notifications
        """

        while self.is_running:
            try:
                # Every 5 minutes, process batches
                await asyncio.sleep(self.batch_interval)

                # Get low-priority notifications
                batch_key = "batch_notifications"
                notifications = await self.redis.lrange(
                    batch_key,
                    0,
                    -1
                )

                if not notifications:
                    continue

                # Group by user and category
                batches = {}

                for notif_data in notifications:
                    notif = json.loads(notif_data)
                    key = (notif["user_id"], notif["category"])

                    if key not in batches:
                        batches[key] = []

                    batches[key].append(notif)

                # Send batched notifications
                for (user_id, category), items in batches.items():
                    # Create aggregated content
                    content = {
                        "type": "batch",
                        "category": category,
                        "count": len(items),
                        "items": [item["content"] for item in items]
                    }

                    # Send as single notification
                    await self.orchestrator.send_notification(
                        user_id=user_id,
                        category=category,
                        content=content,
                        priority="low",
                        channels=["email"]
                    )

                # Clear batch queue
                await self.redis.delete(batch_key)

            except Exception as e:
                print(f"Error processing batch queue: {e}")

    async def _generate_digests(self):
        """
        Generate daily digest emails
        Aggregate multiple notifications into one email
        """

        while self.is_running:
            try:
                # Check every hour
                await asyncio.sleep(3600)

                # Check if it's digest time (6 PM)
                now = datetime.utcnow()
                if now.hour != 18:  # 6 PM
                    continue

                # Get users with digest enabled
                query = """
                    SELECT user_id
                    FROM notification_preferences
                    WHERE digest_enabled = true
                """

                users = await self.db.fetch(query)

                for user_row in users:
                    user_id = user_row["user_id"]

                    # Get today's notifications for digest categories
                    today_start = now.replace(
                        hour=0,
                        minute=0,
                        second=0,
                        microsecond=0
                    )

                    notif_query = """
                        SELECT category, content, created_at
                        FROM notification_logs
                        WHERE user_id = $1
                        AND created_at >= $2
                        AND category = ANY($3)
                        AND status = 'delivered'
                        ORDER BY created_at DESC
                    """

                    notifications = await self.db.fetch(
                        notif_query,
                        user_id,
                        today_start,
                        self.digest_categories
                    )

                    if not notifications:
                        continue

                    # Create digest content
                    digest_content = {
                        "type": "daily_digest",
                        "date": now.strftime("%Y-%m-%d"),
                        "count": len(notifications),
                        "notifications": [
                            dict(n) for n in notifications
                        ]
                    }

                    # Send digest
                    await self.orchestrator.send_notification(
                        user_id=user_id,
                        category="daily_digest",
                        content=digest_content,
                        priority="low",
                        channels=["email"]
                    )

            except Exception as e:
                print(f"Error generating digests: {e}")

    async def _schedule_next_recurrence(self, job: Dict):
        """Schedule next occurrence for recurring notification"""

        recurrence = job.get("recurrence")
        if not recurrence:
            return

        # Check if recurrence has ended
        recurrence_end = job.get("recurrence_end")
        if recurrence_end:
            end_date = datetime.fromisoformat(recurrence_end)
            if datetime.utcnow() >= end_date:
                return

        # Calculate next occurrence
        current_time = datetime.utcnow()

        if recurrence == RecurrenceType.DAILY.value:
            next_time = current_time + timedelta(days=1)
        elif recurrence == RecurrenceType.WEEKLY.value:
            next_time = current_time + timedelta(weeks=1)
        elif recurrence == RecurrenceType.MONTHLY.value:
            # Add roughly 30 days
            next_time = current_time + timedelta(days=30)
        else:
            # Custom recurrence (would need more logic)
            return

        # Queue next occurrence
        await self.queue_notification(
            user_id=job["user_id"],
            category=job["category"],
            content=job["content"],
            channels=job["channels"],
            priority=job["priority"],
            scheduled_for=next_time,
            recurrence=recurrence,
            recurrence_end=datetime.fromisoformat(recurrence_end) if recurrence_end else None
        )

    async def create_drip_campaign(
        self,
        campaign_name: str,
        user_ids: List[str],
        steps: List[Dict]
    ) -> str:
        """
        Create drip campaign with multiple steps

        Steps format:
        [
            {"delay_days": 0, "category": "welcome", "content": {...}},
            {"delay_days": 3, "category": "tutorial", "content": {...}},
            {"delay_days": 7, "category": "feature_highlight", "content": {...}}
        ]
        """

        campaign_id = f"drip_{campaign_name}_{datetime.utcnow().timestamp()}"

        # Schedule each step for each user
        for user_id in user_ids:
            for step in steps:
                delay_days = step.get("delay_days", 0)
                scheduled_for = datetime.utcnow() + timedelta(days=delay_days)

                await self.queue_notification(
                    user_id=user_id,
                    category=step["category"],
                    content=step["content"],
                    channels=step.get("channels", ["email"]),
                    priority=step.get("priority", "normal"),
                    scheduled_for=scheduled_for
                )

        # Save campaign info
        await self._save_campaign(campaign_id, campaign_name, user_ids, steps)

        return campaign_id

    async def _save_campaign(
        self,
        campaign_id: str,
        campaign_name: str,
        user_ids: List[str],
        steps: List[Dict]
    ):
        """Save drip campaign to database"""

        query = """
            INSERT INTO drip_campaigns (
                campaign_id,
                campaign_name,
                user_count,
                steps,
                created_at,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6)
        """

        await self.db.execute(
            query,
            campaign_id,
            campaign_name,
            len(user_ids),
            json.dumps(steps),
            datetime.utcnow(),
            "active"
        )

    async def _move_to_dlq(self, job: Dict, error: str):
        """Move failed notification to dead letter queue"""

        dlq_item = {
            **job,
            "failed_at": datetime.utcnow().isoformat(),
            "error": error
        }

        await self.redis.lpush(
            self.dead_letter_queue,
            json.dumps(dlq_item)
        )

        # Track failure metric
        await self._track_delivery_failure(job, error)

    async def _track_delivery_success(self, job: Dict):
        """Track successful delivery metrics"""

        # Increment success counter
        await self.redis.incr(
            f"metrics:notifications:sent:{job['category']}"
        )

    async def _track_delivery_failure(self, job: Dict, error: str):
        """Track failed delivery metrics"""

        # Increment failure counter
        await self.redis.incr(
            f"metrics:notifications:failed:{job['category']}"
        )

        # Log to database
        query = """
            INSERT INTO notification_failures (
                user_id,
                category,
                error,
                job_data,
                created_at
            ) VALUES ($1, $2, $3, $4, $5)
        """

        await self.db.execute(
            query,
            job["user_id"],
            job["category"],
            error,
            json.dumps(job),
            datetime.utcnow()
        )

    async def get_queue_stats(self) -> Dict:
        """Get queue statistics"""

        scheduled_count = await self.redis.zcard(self.scheduled_queue)
        pending_count = await self.redis.llen(self.pending_queue)
        dlq_count = await self.redis.llen(self.dead_letter_queue)

        return {
            "scheduled": scheduled_count,
            "pending": pending_count,
            "dead_letter": dlq_count,
            "total": scheduled_count + pending_count
        }
