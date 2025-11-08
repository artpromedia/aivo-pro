"""
District license management
"""
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid
import logging

logger = logging.getLogger(__name__)


class LicenseManager:
    """
    Manage district licenses
    
    Features:
    - Seat-based licensing
    - Usage tracking
    - Expiry monitoring
    - Automatic renewal
    """
    
    def __init__(self):
        """Initialize license manager"""
        # In production, this would use a database
        self.licenses: Dict[str, Dict] = {}
    
    async def create_license(
        self,
        district_id: str,
        district_name: str,
        student_count: int,
        duration_months: int
    ) -> Dict:
        """
        Create new district license
        
        Args:
            district_id: Unique district identifier
            district_name: District name
            student_count: Number of student seats
            duration_months: License duration in months
        
        Returns:
            License data
        """
        license_id = str(uuid.uuid4())
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=duration_months * 30)
        
        license_data = {
            "id": license_id,
            "district_id": district_id,
            "district_name": district_name,
            "student_count": student_count,
            "seats_used": 0,
            "start_date": start_date,
            "end_date": end_date,
            "status": "active"
        }
        
        self.licenses[license_id] = license_data
        
        logger.info(
            "Created license %s for district %s (%d students)",
            license_id,
            district_id,
            student_count
        )
        
        return license_data
    
    async def get_license(self, license_id: str) -> Optional[Dict]:
        """Get license details"""
        license_data = self.licenses.get(license_id)
        
        if license_data:
            # Update status based on expiry
            if license_data["end_date"] < datetime.utcnow():
                license_data["status"] = "expired"
        
        return license_data
    
    async def get_district_licenses(
        self, district_id: str
    ) -> List[Dict]:
        """Get all licenses for a district"""
        district_licenses = [
            lic for lic in self.licenses.values()
            if lic["district_id"] == district_id
        ]
        
        return district_licenses
    
    async def check_seat_availability(
        self, license_id: str
    ) -> bool:
        """Check if seats are available"""
        license_data = self.licenses.get(license_id)
        
        if not license_data:
            return False
        
        return license_data["seats_used"] < license_data["student_count"]
    
    async def allocate_seat(
        self, license_id: str, user_id: str
    ) -> bool:
        """
        Allocate a seat to a user
        
        Args:
            license_id: License ID
            user_id: User ID to allocate seat to
        
        Returns:
            True if allocation successful
        """
        if not await self.check_seat_availability(license_id):
            return False
        
        license_data = self.licenses[license_id]
        license_data["seats_used"] += 1
        
        logger.info(
            "Allocated seat for license %s (used: %d/%d)",
            license_id,
            license_data["seats_used"],
            license_data["student_count"]
        )
        
        return True
    
    async def release_seat(
        self, license_id: str, user_id: str
    ) -> bool:
        """
        Release a seat
        
        Args:
            license_id: License ID
            user_id: User ID releasing seat
        
        Returns:
            True if release successful
        """
        license_data = self.licenses.get(license_id)
        
        if not license_data or license_data["seats_used"] <= 0:
            return False
        
        license_data["seats_used"] -= 1
        
        logger.info(
            "Released seat for license %s (used: %d/%d)",
            license_id,
            license_data["seats_used"],
            license_data["student_count"]
        )
        
        return True
    
    async def get_expiring_licenses(
        self, days: int = 30
    ) -> List[Dict]:
        """
        Get licenses expiring within specified days
        
        Args:
            days: Number of days to look ahead
        
        Returns:
            List of expiring licenses
        """
        cutoff_date = datetime.utcnow() + timedelta(days=days)
        
        expiring = [
            lic for lic in self.licenses.values()
            if lic["end_date"] <= cutoff_date and
            lic["status"] == "active"
        ]
        
        return expiring
