"""
Email provider using SendGrid
"""
from typing import Optional, Dict
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To
import logging

from .config import Settings

logger = logging.getLogger(__name__)
settings = Settings()


class EmailProvider:
    """SendGrid email provider"""
    
    def __init__(self):
        """Initialize SendGrid client"""
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
