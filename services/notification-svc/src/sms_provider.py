"""SMS provider using Twilio with graceful fallback."""
from typing import Dict
import logging

try:
    from twilio.rest import Client  # type: ignore[import]
except ImportError:  # pragma: no cover - optional dependency
    Client = None

from .config import Settings

logger = logging.getLogger(__name__)
settings = Settings()


class SMSProvider:
    """Twilio SMS provider"""

    def __init__(self):
        """Initialize Twilio client"""
        if Client is None:
            logger.warning("Twilio SDK not installed; SMS provider disabled")
            self.client = None
        else:
            self.client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
        self.from_phone = settings.TWILIO_PHONE_NUMBER

    async def send_sms(
        self,
        to_phone: str,
        message: str
    ) -> Dict:
        """
        Send SMS via Twilio

        Args:
            to_phone: Recipient phone number (E.164 format)
            message: SMS message (max 160 chars)

        Returns:
            Send result with message SID
        """
        if self.client is None:
            raise RuntimeError("Twilio SDK not available in this environment")

        try:
            twilio_message = self.client.messages.create(
                body=message,
                from_=self.from_phone,
                to=to_phone
            )

            logger.info(
                "SMS sent to %s - SID: %s",
                to_phone,
                twilio_message.sid
            )

            return {
                "id": twilio_message.sid,
                "status": twilio_message.status
            }

        except Exception as e:
            logger.error("Twilio error: %s", str(e))
            raise RuntimeError(f"SMS send failed: {str(e)}") from e
