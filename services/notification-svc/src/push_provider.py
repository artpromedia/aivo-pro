"""Push notification provider using Firebase with Postgres persistence."""
from typing import Any, Dict, Optional, cast
from datetime import datetime
import logging

try:
    import firebase_admin
    from firebase_admin import credentials, messaging
except ImportError:
    firebase_admin = None
    credentials = None
    messaging = None

from .config import Settings
from .db import Database

logger = logging.getLogger(__name__)
settings = Settings()


class PushProvider:
    """Firebase Cloud Messaging push provider backed by Postgres."""

    def __init__(self, db: Database):
        """Initialize Firebase and store DB reference."""
        self.db = db

        if firebase_admin is None:
            logger.warning("Firebase not installed, push disabled")
            self.enabled = False
            return

        self.enabled = True

        # Initialize Firebase if not already done
        if not firebase_admin._apps:
            cred = credentials.Certificate(
                settings.FIREBASE_CREDENTIALS_PATH
            )
            firebase_admin.initialize_app(cred)

    async def send_push(
        self,
        user_id: str,
        title: str,
        body: str,
        data: Optional[Dict] = None,
        badge: Optional[int] = None
    ) -> Dict:
        """Send push notification via Firebase."""

        if not self.enabled:
            raise RuntimeError("Firebase push notifications not configured")

        device_info: Optional[Dict[str, Any]] = None
        device_id: Optional[str] = None

        try:
            device_info = await self._get_device_token(user_id)

            if device_info is None:
                raise RuntimeError(f"No device token for user {user_id}")

            payload_for_send = cast(Dict[str, Any], device_info)
            device_id = str(payload_for_send["id"])

            message_obj = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=payload_for_send["token"],
                apns=(
                    messaging.APNSConfig(
                        payload=messaging.APNSPayload(
                            aps=messaging.Aps(badge=badge)
                        )
                    )
                    if badge else None
                )
            )

            response = messaging.send(message_obj)

            logger.info(
                "Push sent to user %s - Message ID: %s",
                user_id,
                response
            )

            if device_id is None:
                raise RuntimeError("Device identifier missing during send")

            await self._mark_device_used(device_id)
            await self._log_delivery(user_id, "sent")

            return {
                "id": response,
                "status": "sent"
            }

        except Exception as exc:  # pragma: no cover - external service errors
            logger.error("Firebase error: %s", str(exc))

            if device_id is not None and "NotRegistered" in str(exc):
                await self._deactivate_device(device_id, str(exc))

            await self._log_delivery(user_id, "failed", str(exc))
            raise RuntimeError(f"Push send failed: {str(exc)}") from exc

    async def _get_device_token(self, user_id: str) -> Optional[Dict]:
        """Fetch the most recent active device token for the user."""

        query = """
            SELECT id, device_token, platform
            FROM notification_device_tokens
            WHERE user_id = $1
              AND is_active = TRUE
              AND (invalidated_at IS NULL)
            ORDER BY last_used_at DESC NULLS LAST, updated_at DESC
            LIMIT 1
        """

        record = await self.db.fetchrow(query, user_id)

        if not record:
            return None

        payload = dict(record)

        return {
            "id": payload["id"],
            "token": payload["device_token"],
            "platform": payload.get("platform")
        }

    async def _mark_device_used(self, device_id: str) -> None:
        """Update metadata to reflect a successful send."""

        query = """
            UPDATE notification_device_tokens
            SET last_used_at = NOW()
            WHERE id = $1
        """

        await self.db.execute(query, device_id)

    async def _deactivate_device(self, device_id: str, reason: str) -> None:
        """Deactivate invalid tokens so we do not reuse them."""

        query = """
            UPDATE notification_device_tokens
            SET is_active = FALSE,
                last_used_at = NOW()
            WHERE id = $1
        """

        await self.db.execute(query, device_id)
        logger.info("Device %s deactivated due to: %s", device_id, reason)

    async def _log_delivery(
        self,
        user_id: str,
        status: str,
        error: Optional[str] = None
    ) -> None:
        """Persist delivery attempt for analytics and compliance."""

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
            "push_direct",
            "push",
            status,
            error,
            datetime.utcnow()
        )
