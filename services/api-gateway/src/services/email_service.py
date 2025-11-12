"""
Email Service using SendGrid
Handles verification emails, password resets, and notifications
"""
from typing import Optional
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail, Email, To, Content
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False
from jinja2 import Template
from src.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Email sending and template management"""
    
    def __init__(self):
        self.client = None
        self.from_email = None
        if SENDGRID_AVAILABLE and settings.sendgrid_api_key:
            self.client = SendGridAPIClient(settings.sendgrid_api_key)
            self.from_email = Email(settings.from_email, settings.from_name)
        else:
            logger.warning("SendGrid API key not configured")
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """
        Send email via SendGrid
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            text_content: Plain text fallback
            
        Returns:
            True if sent successfully, False otherwise
        """
        if not self.client:
            logger.error("SendGrid client not initialized")
            return False
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=To(to_email),
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            
            if text_content:
                message.add_content(Content("text/plain", text_content))
            
            response = self.client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"Email sent to {to_email}")
                return True
            else:
                logger.error(
                    f"Failed to send email: {response.status_code}"
                )
                return False
                
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False
    
    async def send_verification_email(
        self,
        to_email: str,
        first_name: str,
        verification_url: str
    ) -> bool:
        """
        Send email verification link
        
        Args:
            to_email: Recipient email
            first_name: User's first name
            verification_url: Verification URL with token
            
        Returns:
            True if sent successfully
        """
        subject = "Verify your AIVO email address"
        
        html_template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF7B5C, #FF636F); 
                         color: white; padding: 30px; text-align: center; 
                         border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; 
                          border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 12px 30px; 
                         background: #FF7B5C; color: white; text-decoration: none; 
                         border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #666; 
                         font-size: 12px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AIVO!</h1>
                </div>
                <div class="content">
                    <p>Hi {{ first_name }},</p>
                    <p>Thanks for signing up! Please verify your email address 
                       by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="{{ verification_url }}" class="button">
                            Verify Email Address
                        </a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">
                        {{ verification_url }}
                    </p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, you can safely ignore 
                       this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 AIVO Learning. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """)
        
        html_content = html_template.render(
            first_name=first_name,
            verification_url=verification_url
        )
        
        text_content = f"""
        Hi {first_name},
        
        Thanks for signing up for AIVO! Please verify your email address by 
        visiting this link:
        
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
        
        © 2025 AIVO Learning
        """
        
        return await self.send_email(to_email, subject, html_content, text_content)
    
    async def send_password_reset_email(
        self,
        to_email: str,
        first_name: str,
        reset_url: str
    ) -> bool:
        """
        Send password reset link
        
        Args:
            to_email: Recipient email
            first_name: User's first name
            reset_url: Password reset URL with token
            
        Returns:
            True if sent successfully
        """
        subject = "Reset your AIVO password"
        
        html_template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF7B5C, #FF636F); 
                         color: white; padding: 30px; text-align: center; 
                         border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; 
                          border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 12px 30px; 
                         background: #FF7B5C; color: white; text-decoration: none; 
                         border-radius: 6px; margin: 20px 0; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; 
                          padding: 15px; margin: 20px 0; }
                .footer { text-align: center; color: #666; 
                         font-size: 12px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi {{ first_name }},</p>
                    <p>We received a request to reset your password. Click the 
                       button below to create a new password:</p>
                    <p style="text-align: center;">
                        <a href="{{ reset_url }}" class="button">
                            Reset Password
                        </a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">
                        {{ reset_url }}
                    </p>
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour. If you didn't request 
                        a password reset, please ignore this email or contact 
                        support if you're concerned about your account security.
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 AIVO Learning. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """)
        
        html_content = html_template.render(
            first_name=first_name,
            reset_url=reset_url
        )
        
        text_content = f"""
        Hi {first_name},
        
        We received a request to reset your password. Visit this link to create 
        a new password:
        
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        © 2025 AIVO Learning
        """
        
        return await self.send_email(to_email, subject, html_content, text_content)
    
    async def send_login_alert(
        self,
        to_email: str,
        first_name: str,
        ip_address: str,
        device: str,
        location: Optional[str] = None
    ) -> bool:
        """
        Send security alert for new login
        
        Args:
            to_email: Recipient email
            first_name: User's first name
            ip_address: Login IP address
            device: Device information
            location: Geographic location
            
        Returns:
            True if sent successfully
        """
        subject = "New login to your AIVO account"
        
        location_text = f" from {location}" if location else ""
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>New Login Detected</h2>
                <p>Hi {first_name},</p>
                <p>We detected a new login to your account{location_text}:</p>
                <ul>
                    <li><strong>IP Address:</strong> {ip_address}</li>
                    <li><strong>Device:</strong> {device}</li>
                    {f'<li><strong>Location:</strong> {location}</li>' if location else ''}
                </ul>
                <p>If this was you, no action is needed.</p>
                <p>If this wasn't you, please secure your account immediately 
                   by changing your password.</p>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(to_email, subject, html_content)


# Global email service instance
email_service = EmailService()
