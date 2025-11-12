"""COPPA compliance enforcer"""

from typing import Dict, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


class COPPAEnforcer:
    """Enforce COPPA (Children's Online Privacy Protection Act) compliance"""
    
    def __init__(self):
        self.age_limit = 13
        self.consent_duration_days = 365
    
    async def check_age_requirements(
        self,
        user_id: str,
        date_of_birth: datetime,
        db: AsyncSession
    ) -> Dict:
        """Check if user meets age requirements"""
        age = self._calculate_age(date_of_birth)
        
        if age < self.age_limit:
            # Under 13 - COPPA applies
            consent_status = await self._check_parental_consent(user_id, db)
            
            return {
                "coppa_applies": True,
                "age": age,
                "requires_consent": True,
                "has_consent": consent_status["has_valid_consent"],
                "consent_expires": consent_status.get("expires_at"),
                "restrictions": self._get_age_restrictions(age)
            }
        
        return {
            "coppa_applies": False,
            "age": age,
            "requires_consent": False,
            "has_consent": True
        }
    
    async def _check_parental_consent(
        self,
        child_id: str,
        db: AsyncSession
    ) -> Dict:
        """Check for valid parental consent"""
        from src.db.models import ParentalConsent
        
        # Query for active consent
        result = await db.execute(
            select(ParentalConsent).where(
                ParentalConsent.child_id == child_id,
                ParentalConsent.consent_given == True,
                ParentalConsent.revoked == False,
                ParentalConsent.expires_at > datetime.utcnow()
            ).order_by(ParentalConsent.created_at.desc())
        )
        
        consent = result.scalars().first()
        
        if consent:
            return {
                "has_valid_consent": True,
                "consent_id": str(consent.id),
                "expires_at": consent.expires_at,
                "consent_types": [consent.consent_type]
            }
        
        return {
            "has_valid_consent": False
        }
    
    def _calculate_age(self, date_of_birth: datetime) -> int:
        """Calculate age from date of birth"""
        today = datetime.utcnow().date()
        dob = date_of_birth.date() if isinstance(
            date_of_birth, datetime
        ) else date_of_birth
        
        age = today.year - dob.year
        
        # Adjust if birthday hasn't occurred this year
        if today.month < dob.month or (
            today.month == dob.month and today.day < dob.day
        ):
            age -= 1
        
        return age
    
    def _get_age_restrictions(self, age: int) -> Dict:
        """Get age-appropriate restrictions"""
        if age < 6:
            return {
                "chat_enabled": False,
                "user_generated_content": False,
                "data_collection": "minimal",
                "parental_oversight": "required"
            }
        elif age < 13:
            return {
                "chat_enabled": True,
                "chat_moderation": "strict",
                "user_generated_content": True,
                "content_moderation": "strict",
                "data_collection": "with_consent",
                "parental_oversight": "recommended"
            }
        
        return {
            "chat_enabled": True,
            "user_generated_content": True,
            "data_collection": "standard"
        }
    
    async def enforce_data_minimization(
        self,
        user_id: str,
        data_collection_request: Dict
    ) -> Dict:
        """Enforce data minimization for children"""
        # List of allowed data points for children under 13
        allowed_data = [
            "learning_progress",
            "assessment_scores",
            "content_preferences",
            "session_duration"
        ]
        
        filtered_request = {
            key: value
            for key, value in data_collection_request.items()
            if key in allowed_data
        }
        
        blocked_data = [
            key for key in data_collection_request.keys()
            if key not in allowed_data
        ]
        
        return {
            "allowed_data": filtered_request,
            "blocked_data": blocked_data,
            "reason": "COPPA data minimization"
        }
