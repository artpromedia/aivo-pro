"""Email provider using SendGrid with graceful dependency fallback."""
from typing import Optional, Dict
import logging

try:
    from sendgrid import SendGridAPIClient  # type: ignore[import]
    from sendgrid.helpers.mail import Mail, Email, To  # type: ignore[import]
except ImportError:  # pragma: no cover - optional dependency
    SendGridAPIClient = None
    Mail = Email = To = None

from .config import Settings

logger = logging.getLogger(__name__)
settings = Settings()


class EmailProvider:
    """SendGrid email provider"""

    def __init__(self):
        """Initialize SendGrid client"""
        if SendGridAPIClient is None:
            logger.warning(
                "SendGrid SDK not installed; email provider disabled"
            )
            self.client = None
        else:
            self.client = SendGridAPIClient(settings.SENDGRID_API_KEY)

        self.from_email = settings.SENDGRID_FROM_EMAIL
        self.from_name = settings.SENDGRID_FROM_NAME

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: Optional[str] = None,
        text_content: Optional[str] = None
    ) -> Dict:
        """
        Send email via SendGrid

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text email body

        Returns:
            Send result with message ID
        """
        if self.client is None or Mail is None or Email is None or To is None:
            raise RuntimeError(
                "SendGrid SDK not available in this environment"
            )

        try:
            message = Mail(
                from_email=Email(self.from_email, self.from_name),
                to_emails=To(to_email),
                subject=subject,
                html_content=html_content,
                plain_text_content=text_content
            )

            response = self.client.send(message)

            logger.info(
                "Email sent to %s - Status: %d",
                to_email,
                response.status_code
            )

            return {
                "id": response.headers.get("X-Message-Id", "unknown"),
                "status": "sent" if response.status_code == 202 else "failed"
            }

        except Exception as e:
            logger.error("SendGrid error: %s", str(e))
            raise RuntimeError(f"Email send failed: {str(e)}") from e
