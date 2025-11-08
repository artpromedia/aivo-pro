"""
Push notification provider using Firebase
"""
from typing import Dict, Optional
import logging

try:
    import firebase_admin
    from firebase_admin import credentials, messaging
except ImportError:
    firebase_admin = None
    credentials = None
    messaging = None

from .config import Settings

logger = logging.getLogger(__name__)
settings = Settings()


class PushProvider:
    """Firebase Cloud Messaging push provider"""
    
    def __init__(self):
        """Initialize Firebase"""
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
        """
        Send push notification via Firebase
        
        Args:
            user_id: User ID to send notification to
            title: Notification title
            body: Notification body
            data: Custom data payload
            badge: Badge count (iOS)
        
        Returns:
            Send result with message ID
        """
        if not self.enabled:
            raise RuntimeError("Firebase push notifications not configured")
        
        try:
            # Get device token for user (mock implementation)
            device_token = await self._get_device_token(user_id)
            
            if not device_token:
                raise RuntimeError(f"No device token for user {user_id}")
            
            # Build message
            message_obj = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data or {},
                token=device_token,
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            badge=badge
                        )
                    )
                ) if badge else None
            )
            
            # Send message
            response = messaging.send(message_obj)
            
            logger.info(
                "Push sent to user %s - Message ID: %s",
                user_id,
                response
            )
            
            return {
                "id": response,
                "status": "sent"
            }
        
        except Exception as e:
            logger.error("Firebase error: %s", str(e))
            raise RuntimeError(f"Push send failed: {str(e)}") from e
    
    async def _get_device_token(self, user_id: str) -> Optional[str]:
        """
        Get device token for user
        
        In production, query database for user's device tokens
        """
        # Mock implementation
        return "mock_device_token_" + user_id
