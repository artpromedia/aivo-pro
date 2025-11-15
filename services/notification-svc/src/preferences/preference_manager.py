"""
Preference Manager
GDPR-compliant user notification preferences
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
import secrets
import hashlib


class PreferenceManager:
    """
    Manage user notification preferences
    GDPR-compliant with audit trail
    """

    def __init__(self, db, redis_client):
        self.db = db
        self.redis = redis_client

        # Default preferences
        self.defaults = {
            "channels": {
                "email": True,
                "sms": False,
                "push": True,
                "in_app": True
            },
            "categories": {
                "learning_reminder": {
                    "enabled": True,
                    "channels": ["email", "push"]
                },
                "homework_help": {
                    "enabled": True,
                    "channels": ["email", "push"]
                },
                "parent_update": {
                    "enabled": True,
                    "channels": ["email"]
                },
                "iep_reminder": {
                    "enabled": True,
                    "channels": ["email", "sms"]
                },
                "payment_reminder": {
                    "enabled": True,
                    "channels": ["email"]
                },
                "security_alert": {
                    "enabled": True,
                    "channels": ["email", "sms", "push"]
                }
            },
            "quiet_hours": {
                "enabled": True,
                "start": "22:00",
                "end": "08:00",
                "timezone": "UTC"
            },
            "frequency": {
                "max_daily": 10,
                "digest_enabled": False,
                "digest_time": "18:00"
            }
        }

    async def get_preferences(self, user_id: str) -> Dict:
        """
        Get user notification preferences
        Returns defaults if not set
        """

        # Try cache first
        cache_key = f"prefs:{user_id}"
        cached = await self.redis.get(cache_key)

        if cached:
            import json
            return json.loads(cached)

        # Get from database
        query = """
            SELECT preferences
            FROM notification_preferences
            WHERE user_id = $1
        """

        result = await self.db.fetchrow(query, user_id)

        if result and result['preferences']:
            preferences = result['preferences']
        else:
            # Return defaults
            preferences = self.defaults.copy()

        # Cache for 1 hour
        import json
        await self.redis.setex(
            cache_key,
            3600,
            json.dumps(preferences)
        )

        return preferences

    async def update_preferences(
        self,
        user_id: str,
        updates: Dict,
        updated_by: str = None
    ) -> Dict:
        """
        Update user preferences
        Maintains audit trail
        """

        # Get current preferences
        current = await self.get_preferences(user_id)

        # Deep merge updates
        updated = self._deep_merge(current, updates)

        # Save to database
        query = """
            INSERT INTO notification_preferences (
                user_id,
                preferences,
                updated_at,
                updated_by
            ) VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id)
            DO UPDATE SET
                preferences = $2,
                updated_at = $3,
                updated_by = $4
        """

        await self.db.execute(
            query,
            user_id,
            updated,
            datetime.utcnow(),
            updated_by or user_id
        )

        # Log change for audit
        await self._log_preference_change(
            user_id,
            current,
            updated,
            updated_by
        )

        # Invalidate cache
        await self.redis.delete(f"prefs:{user_id}")

        return updated

    def _deep_merge(self, base: Dict, updates: Dict) -> Dict:
        """Deep merge dictionaries"""

        result = base.copy()

        for key, value in updates.items():
            if (
                key in result and
                isinstance(result[key], dict) and
                isinstance(value, dict)
            ):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value

        return result

    async def unsubscribe(
        self,
        user_id: str,
        category: Optional[str] = None,
        token: Optional[str] = None
    ) -> Dict:
        """
        GDPR-compliant unsubscribe

        - If category specified: Unsubscribe from that category
        - If no category: Unsubscribe from all marketing
        - Token required for email unsubscribe links
        """

        # Verify token if provided
        if token:
            if not await self._verify_unsubscribe_token(user_id, token):
                raise ValueError("Invalid unsubscribe token")

        # Get current preferences
        current = await self.get_preferences(user_id)

        if category:
            # Unsubscribe from specific category
            if category in current.get("categories", {}):
                current["categories"][category]["enabled"] = False

            unsubscribe_type = f"category_{category}"
        else:
            # Unsubscribe from all non-essential
            essential_categories = [
                "security_alert",
                "payment_reminder"
            ]

            for cat, settings in current.get("categories", {}).items():
                if cat not in essential_categories:
                    settings["enabled"] = False

            unsubscribe_type = "all_marketing"

        # Save updated preferences
        await self.update_preferences(user_id, current)

        # Log unsubscribe (GDPR requirement)
        await self._log_unsubscribe(
            user_id,
            unsubscribe_type,
            token
        )

        return {
            "status": "unsubscribed",
            "type": unsubscribe_type,
            "timestamp": datetime.utcnow().isoformat()
        }

    async def generate_unsubscribe_token(
        self,
        user_id: str,
        category: Optional[str] = None
    ) -> str:
        """
        Generate secure unsubscribe token
        Valid for 90 days
        """

        # Generate random token
        token = secrets.token_urlsafe(32)

        # Hash for storage
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        # Store in database
        query = """
            INSERT INTO unsubscribe_tokens (
                user_id,
                token_hash,
                category,
                created_at,
                expires_at
            ) VALUES ($1, $2, $3, $4, $5)
        """

        expires_at = datetime.utcnow() + timedelta(days=90)

        await self.db.execute(
            query,
            user_id,
            token_hash,
            category,
            datetime.utcnow(),
            expires_at
        )

        return token

    async def _verify_unsubscribe_token(
        self,
        user_id: str,
        token: str
    ) -> bool:
        """Verify unsubscribe token"""

        # Hash token
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        # Check database
        query = """
            SELECT expires_at, used_at
            FROM unsubscribe_tokens
            WHERE user_id = $1
            AND token_hash = $2
        """

        result = await self.db.fetchrow(query, user_id, token_hash)

        if not result:
            return False

        # Check if expired
        if result['expires_at'] < datetime.utcnow():
            return False

        # Check if already used
        if result['used_at']:
            return False

        # Mark as used
        update_query = """
            UPDATE unsubscribe_tokens
            SET used_at = $1
            WHERE user_id = $2
            AND token_hash = $3
        """

        await self.db.execute(
            update_query,
            datetime.utcnow(),
            user_id,
            token_hash
        )

        return True

    async def check_frequency_limit(
        self,
        user_id: str,
        category: str
    ) -> bool:
        """
        Check if user has reached daily notification limit
        Returns True if under limit, False if limit reached
        """

        prefs = await self.get_preferences(user_id)
        max_daily = prefs.get("frequency", {}).get("max_daily", 10)

        # Count today's notifications
        today_start = datetime.utcnow().replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )

        query = """
            SELECT COUNT(*)
            FROM notification_logs
            WHERE user_id = $1
            AND created_at >= $2
            AND status = 'delivered'
        """

        result = await self.db.fetchrow(query, user_id, today_start)
        count = result[0] if result else 0

        return count < max_daily

    async def get_quiet_hours(self, user_id: str) -> Optional[Dict]:
        """Get user's quiet hours settings"""

        prefs = await self.get_preferences(user_id)
        quiet_hours = prefs.get("quiet_hours")

        if not quiet_hours or not quiet_hours.get("enabled"):
            return None

        return quiet_hours

    async def is_category_enabled(
        self,
        user_id: str,
        category: str
    ) -> bool:
        """Check if category is enabled for user"""

        prefs = await self.get_preferences(user_id)
        category_prefs = prefs.get("categories", {}).get(category, {})

        return category_prefs.get("enabled", False)

    async def get_enabled_channels(
        self,
        user_id: str,
        category: str
    ) -> List[str]:
        """Get enabled channels for category"""

        prefs = await self.get_preferences(user_id)

        # Get category-specific channels
        category_prefs = prefs.get("categories", {}).get(category, {})
        category_channels = category_prefs.get("channels", [])

        # Filter by globally enabled channels
        global_channels = prefs.get("channels", {})

        enabled = [
            ch for ch in category_channels
            if global_channels.get(ch, False)
        ]

        return enabled

    async def _log_preference_change(
        self,
        user_id: str,
        old_prefs: Dict,
        new_prefs: Dict,
        updated_by: Optional[str]
    ):
        """Log preference change for audit trail"""

        # Calculate what changed
        changes = self._calculate_changes(old_prefs, new_prefs)

        query = """
            INSERT INTO preference_audit_log (
                user_id,
                changes,
                updated_by,
                created_at
            ) VALUES ($1, $2, $3, $4)
        """

        import json
        await self.db.execute(
            query,
            user_id,
            json.dumps(changes),
            updated_by,
            datetime.utcnow()
        )

    def _calculate_changes(self, old: Dict, new: Dict) -> Dict:
        """Calculate what changed between preferences"""

        changes = {}

        # Check channels
        old_channels = old.get("channels", {})
        new_channels = new.get("channels", {})

        for channel in set(old_channels.keys()) | set(new_channels.keys()):
            old_val = old_channels.get(channel)
            new_val = new_channels.get(channel)

            if old_val != new_val:
                changes[f"channel_{channel}"] = {
                    "old": old_val,
                    "new": new_val
                }

        # Check categories
        old_cats = old.get("categories", {})
        new_cats = new.get("categories", {})

        for category in set(old_cats.keys()) | set(new_cats.keys()):
            old_val = old_cats.get(category, {}).get("enabled")
            new_val = new_cats.get(category, {}).get("enabled")

            if old_val != new_val:
                changes[f"category_{category}"] = {
                    "old": old_val,
                    "new": new_val
                }

        return changes

    async def _log_unsubscribe(
        self,
        user_id: str,
        unsubscribe_type: str,
        token: Optional[str]
    ):
        """Log unsubscribe event"""

        query = """
            INSERT INTO unsubscribe_log (
                user_id,
                unsubscribe_type,
                method,
                created_at
            ) VALUES ($1, $2, $3, $4)
        """

        method = "token" if token else "manual"

        await self.db.execute(
            query,
            user_id,
            unsubscribe_type,
            method,
            datetime.utcnow()
        )

    async def export_preferences(self, user_id: str) -> Dict:
        """
        Export all user preferences (GDPR data portability)
        """

        # Get preferences
        prefs = await self.get_preferences(user_id)

        # Get audit log
        audit_query = """
            SELECT changes, updated_by, created_at
            FROM preference_audit_log
            WHERE user_id = $1
            ORDER BY created_at DESC
        """

        audit_log = await self.db.fetch(audit_query, user_id)

        # Get unsubscribe log
        unsub_query = """
            SELECT unsubscribe_type, method, created_at
            FROM unsubscribe_log
            WHERE user_id = $1
            ORDER BY created_at DESC
        """

        unsub_log = await self.db.fetch(unsub_query, user_id)

        return {
            "user_id": user_id,
            "current_preferences": prefs,
            "change_history": [dict(r) for r in audit_log],
            "unsubscribe_history": [dict(r) for r in unsub_log],
            "exported_at": datetime.utcnow().isoformat()
        }
