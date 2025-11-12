"""
Template Engine
Multi-language templates with personalization
"""

from typing import Dict, Optional
from datetime import datetime
from jinja2 import Environment, Template, TemplateNotFound
import json


class TemplateEngine:
    """
    Notification template management with personalization
    Supports multiple languages, dynamic content, A/B testing
    """
    
    def __init__(self, db, redis_client):
        self.db = db
        self.redis = redis_client
        
        # Jinja2 environment
        self.jinja_env = Environment(autoescape=True)
        
        # Template cache TTL
        self.cache_ttl = 3600  # 1 hour
    
    async def render_template(
        self,
        template_name: str,
        channel: str,
        locale: str = "en_US",
        data: Dict = None,
        version: str = "latest"
    ) -> Dict:
        """
        Render notification template
        Returns rendered subject and body
        """
        
        # Get template
        template = await self._get_template(
            template_name,
            channel,
            locale,
            version
        )
        
        if not template:
            raise TemplateNotFound(
                f"Template {template_name} not found for {channel}/{locale}"
            )
        
        # Prepare context
        context = self._prepare_context(data or {})
        
        # Render subject and body
        rendered = {}
        
        if template.get("subject"):
            subject_template = self.jinja_env.from_string(
                template["subject"]
            )
            rendered["subject"] = subject_template.render(**context)
        
        if template.get("body"):
            body_template = self.jinja_env.from_string(
                template["body"]
            )
            rendered["body"] = body_template.render(**context)
        
        # For email, render HTML and text versions
        if channel == "email":
            if template.get("html"):
                html_template = self.jinja_env.from_string(
                    template["html"]
                )
                rendered["html"] = html_template.render(**context)
            
            if template.get("text"):
                text_template = self.jinja_env.from_string(
                    template["text"]
                )
                rendered["text"] = text_template.render(**context)
        
        # Track render
        await self._track_render(template_name, channel, locale)
        
        return rendered
    
    def _prepare_context(self, data: Dict) -> Dict:
        """
        Prepare template context with helper functions
        """
        
        context = data.copy()
        
        # Add helper functions
        context['now'] = datetime.utcnow()
        context['format_date'] = self._format_date
        context['format_currency'] = self._format_currency
        context['pluralize'] = self._pluralize
        
        return context
    
    def _format_date(self, date, format_str="%B %d, %Y"):
        """Format date helper"""
        if isinstance(date, str):
            date = datetime.fromisoformat(date)
        return date.strftime(format_str)
    
    def _format_currency(self, amount, currency="USD"):
        """Format currency helper"""
        if currency == "USD":
            return f"${amount:,.2f}"
        elif currency == "EUR":
            return f"€{amount:,.2f}"
        else:
            return f"{amount:,.2f} {currency}"
    
    def _pluralize(self, count, singular, plural=None):
        """Pluralize helper"""
        if count == 1:
            return singular
        return plural or f"{singular}s"
    
    async def _get_template(
        self,
        template_name: str,
        channel: str,
        locale: str,
        version: str
    ) -> Optional[Dict]:
        """Get template from cache or database"""
        
        # Try cache first
        cache_key = f"template:{template_name}:{channel}:{locale}:{version}"
        cached = await self.redis.get(cache_key)
        
        if cached:
            return json.loads(cached)
        
        # Get from database
        query = """
            SELECT 
                template_id,
                subject,
                body,
                html,
                text,
                metadata
            FROM notification_templates
            WHERE name = $1
            AND channel = $2
            AND locale = $3
            AND (version = $4 OR $4 = 'latest')
            AND status = 'active'
            ORDER BY created_at DESC
            LIMIT 1
        """
        
        result = await self.db.fetchrow(
            query,
            template_name,
            channel,
            locale,
            version
        )
        
        if not result:
            # Try fallback to default locale
            if locale != "en_US":
                return await self._get_template(
                    template_name,
                    channel,
                    "en_US",
                    version
                )
            return None
        
        template = dict(result)
        
        # Cache template
        await self.redis.setex(
            cache_key,
            self.cache_ttl,
            json.dumps(template)
        )
        
        return template
    
    async def create_template(
        self,
        name: str,
        channel: str,
        locale: str,
        subject: Optional[str],
        body: Optional[str],
        html: Optional[str] = None,
        text: Optional[str] = None,
        metadata: Dict = None,
        version: str = "v1"
    ) -> str:
        """Create new template"""
        
        # Validate template syntax
        self._validate_template(subject, body, html, text)
        
        # Generate template ID
        template_id = f"{name}_{channel}_{locale}_{version}"
        
        query = """
            INSERT INTO notification_templates (
                template_id,
                name,
                channel,
                locale,
                version,
                subject,
                body,
                html,
                text,
                metadata,
                status,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (template_id)
            DO UPDATE SET
                subject = $6,
                body = $7,
                html = $8,
                text = $9,
                metadata = $10,
                updated_at = $12
        """
        
        await self.db.execute(
            query,
            template_id,
            name,
            channel,
            locale,
            version,
            subject,
            body,
            html,
            text,
            metadata or {},
            "active",
            datetime.utcnow()
        )
        
        # Invalidate cache
        cache_key = f"template:{name}:{channel}:{locale}:{version}"
        await self.redis.delete(cache_key)
        
        return template_id
    
    def _validate_template(
        self,
        subject: Optional[str],
        body: Optional[str],
        html: Optional[str],
        text: Optional[str]
    ):
        """Validate template syntax"""
        
        templates_to_check = [
            ("subject", subject),
            ("body", body),
            ("html", html),
            ("text", text)
        ]
        
        for name, content in templates_to_check:
            if not content:
                continue
            
            try:
                # Try to parse template
                self.jinja_env.from_string(content)
            except Exception as e:
                raise ValueError(
                    f"Invalid template syntax in {name}: {str(e)}"
                )
    
    async def preview_template(
        self,
        template_name: str,
        channel: str,
        locale: str,
        sample_data: Dict
    ) -> Dict:
        """Preview template with sample data"""
        
        rendered = await self.render_template(
            template_name,
            channel,
            locale,
            sample_data
        )
        
        return {
            "template_name": template_name,
            "channel": channel,
            "locale": locale,
            "preview": rendered,
            "sample_data": sample_data
        }
    
    async def create_ab_test(
        self,
        test_name: str,
        template_name: str,
        channel: str,
        locale: str,
        variant_a: Dict,
        variant_b: Dict,
        allocation: float = 0.5
    ) -> str:
        """
        Create A/B test for templates
        """
        
        test_id = f"ab_{template_name}_{datetime.utcnow().timestamp()}"
        
        # Create variant A template
        await self.create_template(
            name=template_name,
            channel=channel,
            locale=locale,
            version=f"{test_id}_a",
            **variant_a
        )
        
        # Create variant B template
        await self.create_template(
            name=template_name,
            channel=channel,
            locale=locale,
            version=f"{test_id}_b",
            **variant_b
        )
        
        # Save test configuration
        query = """
            INSERT INTO template_ab_tests (
                test_id,
                test_name,
                template_name,
                channel,
                locale,
                variant_a_version,
                variant_b_version,
                allocation,
                status,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """
        
        await self.db.execute(
            query,
            test_id,
            test_name,
            template_name,
            channel,
            locale,
            f"{test_id}_a",
            f"{test_id}_b",
            allocation,
            "active",
            datetime.utcnow()
        )
        
        return test_id
    
    async def get_test_variant(
        self,
        test_id: str,
        user_id: str
    ) -> str:
        """Assign user to A/B test variant"""
        
        # Get test config
        query = """
            SELECT allocation, variant_a_version, variant_b_version
            FROM template_ab_tests
            WHERE test_id = $1
            AND status = 'active'
        """
        
        result = await self.db.fetchrow(query, test_id)
        
        if not result:
            return "latest"
        
        # Consistent hashing for same user
        user_hash = hash(user_id) % 100
        
        if user_hash < result['allocation'] * 100:
            return result['variant_b_version']
        else:
            return result['variant_a_version']
    
    async def get_available_locales(self, template_name: str) -> list:
        """Get available locales for template"""
        
        query = """
            SELECT DISTINCT locale
            FROM notification_templates
            WHERE name = $1
            AND status = 'active'
            ORDER BY locale
        """
        
        results = await self.db.fetch(query, template_name)
        
        return [r['locale'] for r in results]
    
    async def _track_render(
        self,
        template_name: str,
        channel: str,
        locale: str
    ):
        """Track template render for analytics"""
        
        # Increment counter in Redis
        key = f"metrics:template_renders:{template_name}:{channel}:{locale}"
        await self.redis.incr(key)
        
        # Set TTL of 7 days
        await self.redis.expire(key, 604800)
    
    async def get_template_stats(self, template_name: str) -> Dict:
        """Get template usage statistics"""
        
        query = """
            SELECT 
                channel,
                locale,
                COUNT(*) as render_count
            FROM notification_logs
            WHERE template_name = $1
            AND created_at > $2
            GROUP BY channel, locale
        """
        
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        results = await self.db.fetch(query, template_name, seven_days_ago)
        
        stats = {
            "template_name": template_name,
            "period": "last_7_days",
            "by_channel_locale": [dict(r) for r in results],
            "total_renders": sum(r['render_count'] for r in results)
        }
        
        return stats


# Pre-defined templates for common notifications
DEFAULT_TEMPLATES = {
    "welcome_subscription": {
        "email": {
            "en_US": {
                "subject": "Welcome to AIVO Learning Platform!",
                "html": """
                <h1>Welcome {{customer_name}}!</h1>
                <p>Thank you for subscribing to AIVO Learning Platform.</p>
                <p>Your {{plan}} subscription is now active.</p>
                {% if trial_end %}
                <p>Your trial ends on {{format_date(trial_end)}}.</p>
                {% endif %}
                <p>Get started at <a href="https://aivo.com/dashboard">your dashboard</a>.</p>
                """,
                "text": """
                Welcome {{customer_name}}!
                
                Thank you for subscribing to AIVO Learning Platform.
                Your {{plan}} subscription is now active.
                {% if trial_end %}
                Your trial ends on {{format_date(trial_end)}}.
                {% endif %}
                
                Get started at https://aivo.com/dashboard
                """
            }
        }
    },
    "payment_failed": {
        "email": {
            "en_US": {
                "subject": "Payment Failed - Action Required",
                "html": """
                <h1>Payment Failed</h1>
                <p>Hi {{customer_name}},</p>
                <p>We couldn't process your payment of {{format_currency(amount)}}.</p>
                <p>Please <a href="{{update_url}}">update your payment method</a> to continue your subscription.</p>
                <p>We'll retry in {{next_retry}}.</p>
                """,
                "text": """
                Payment Failed
                
                Hi {{customer_name}},
                
                We couldn't process your payment of {{format_currency(amount)}}.
                Please update your payment method to continue: {{update_url}}
                
                We'll retry in {{next_retry}}.
                """
            }
        }
    }
}
