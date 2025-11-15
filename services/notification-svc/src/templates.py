"""
Notification template management
"""
from typing import Dict, List, Optional, Tuple
from jinja2 import Template
import logging

logger = logging.getLogger(__name__)


class TemplateManager:
    """
    Manage notification templates

    Supports Jinja2 templating for:
    - Email (HTML and text)
    - SMS
    - Push notifications
    """

    def __init__(self):
        """Initialize template manager"""
        self.templates = self._load_templates()

    def _load_templates(self) -> Dict[str, Dict]:
        """
        Load notification templates

        In production, load from database
        """
        return {
            "welcome_email": {
                "id": "welcome_email",
                "name": "Welcome Email",
                "channels": ["email"],
                "email_subject": "Welcome to AIVO Learning!",
                "email_html": """
                    <h1>Welcome {{ first_name }}!</h1>
                    <p>We're excited to have you join AIVO.</p>
                    <p>Get started by:</p>
                    <ul>
                        <li>Completing your profile</li>
                        <li>Setting learning goals</li>
                        <li>Exploring our curriculum</li>
                    </ul>
                """,
                "email_text": """
                    Welcome {{ first_name }}!
                    We're excited to have you join AIVO.
                """
            },
            "progress_report": {
                "id": "progress_report",
                "name": "Weekly Progress Report",
                "channels": ["email", "push"],
                "email_subject": "Your Weekly Progress - {{ week_of }}",
                "email_html": """
                    <h2>Progress Report for {{ student_name }}</h2>
                    <p>Hours practiced: {{ hours_practiced }}</p>
                    <p>Skills mastered: {{ skills_mastered }}</p>
                    <p>Current streak: {{ streak_days }} days</p>
                """,
                "push_title": "Weekly Progress Report",
                "push_body": (
                    "{{ student_name }} practiced "
                    "{{ hours_practiced }} hours this week!"
                )
            },
            "assignment_reminder": {
                "id": "assignment_reminder",
                "name": "Assignment Reminder",
                "channels": ["email", "sms", "push"],
                "email_subject": "Reminder: {{ assignment_name }} due soon",
                "email_html": """
                    <h3>Assignment Reminder</h3>
                    <p>{{ assignment_name }} is due {{ due_date }}</p>
                """,
                "sms_text": (
                    "Reminder: {{ assignment_name }} due {{ due_date }}"
                ),
                "push_title": "Assignment Due",
                "push_body": "{{ assignment_name }} is due {{ due_date }}"
            },
            "payment_success": {
                "id": "payment_success",
                "name": "Payment Success",
                "channels": ["email"],
                "email_subject": "Payment Successful",
                "email_html": """
                    <h2>Payment Confirmed</h2>
                    <p>Amount: ${{ amount }}</p>
                    <p>Invoice: {{ invoice_id }}</p>
                """
            },
            "iep_update": {
                "id": "iep_update",
                "name": "IEP Updated",
                "channels": ["email", "push"],
                "email_subject": "IEP Document Updated",
                "email_html": """
                    <h2>IEP Updated</h2>
                    <p>{{ student_name }}'s IEP has been updated.</p>
                    <p>View changes in your parent portal.</p>
                """,
                "push_title": "IEP Updated",
                "push_body": "{{ student_name }}'s IEP has been updated"
            }
        }

    async def render_email_template(
        self,
        template_id: str,
        data: Dict
    ) -> Tuple[str, str]:
        """
        Render email template

        Args:
            template_id: Template identifier
            data: Template data

        Returns:
            (html_content, text_content)
        """
        template = self.templates.get(template_id)

        if not template or "email" not in template["channels"]:
            raise ValueError(f"Email template not found: {template_id}")

        # Render HTML
        html_template = Template(template["email_html"])
        html_content = html_template.render(**data)

        # Render text (or use plain version)
        if "email_text" in template:
            text_template = Template(template["email_text"])
            text_content = text_template.render(**data)
        else:
            # Strip HTML tags for text version (basic)
            text_content = html_content.replace("<br>", "\n")
            text_content = text_content.replace("</p>", "\n\n")
            # Remove all other tags
            import re
            text_content = re.sub(r'<[^>]+>', '', text_content)

        return html_content, text_content

    async def render_sms_template(
        self,
        template_id: str,
        data: Dict
    ) -> str:
        """
        Render SMS template

        Args:
            template_id: Template identifier
            data: Template data

        Returns:
            SMS message text
        """
        template = self.templates.get(template_id)

        if not template or "sms" not in template["channels"]:
            raise ValueError(f"SMS template not found: {template_id}")

        sms_template = Template(template["sms_text"])
        message = sms_template.render(**data)

        # Ensure 160 char limit
        if len(message) > 160:
            message = message[:157] + "..."

        return message

    async def list_templates(self) -> List[Dict]:
        """List all available templates"""
        return [
            {
                "id": t["id"],
                "name": t["name"],
                "channels": t["channels"]
            }
            for t in self.templates.values()
        ]

    async def get_template(self, template_id: str) -> Optional[Dict]:
        """Get template details"""
        return self.templates.get(template_id)
