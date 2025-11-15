"""
District license management
"""
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid
import logging

from .db import Database, database

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

    def __init__(self, db: Database | None = None):
        """Initialize license manager"""
        self._db = db or database

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

        record = await self._db.fetchrow(
            """
            INSERT INTO district_licenses (
                id,
                district_id,
                district_name,
                student_count,
                seats_used,
                start_date,
                end_date,
                status,
                created_at
            ) VALUES ($1, $2, $3, $4, 0, $5, $6, 'active', NOW())
            RETURNING id, district_id, district_name, student_count,
                      seats_used, start_date, end_date, status
            """,
            license_id,
            district_id,
            district_name,
            student_count,
            start_date,
            end_date,
        )

        logger.info(
            "Created license %s for district %s (%d students)",
            license_id,
            district_id,
            student_count
        )

        return self._row_to_dict(record)

    async def get_license(self, license_id: str) -> Optional[Dict]:
        """Get license details"""
        record = await self._db.fetchrow(
            """
            SELECT * FROM district_licenses
            WHERE id = $1
            """,
            license_id,
        )

        if not record:
            return None

        if (
            record["end_date"] < datetime.utcnow() and
            record["status"] == "active"
        ):
            await self._db.execute(
                "UPDATE district_licenses SET status = 'expired' "
                "WHERE id = $1",
                license_id,
            )
            record = dict(record)
            record["status"] = "expired"

        return self._row_to_dict(record)

    async def get_district_licenses(
        self, district_id: str
    ) -> List[Dict]:
        """Get all licenses for a district"""
        rows = await self._db.fetch(
            """
            SELECT * FROM district_licenses
            WHERE district_id = $1
            ORDER BY start_date DESC
            """,
            district_id,
        )

        return [self._row_to_dict(row) for row in rows]

    async def check_seat_availability(
        self, license_id: str
    ) -> bool:
        """Check if seats are available"""
        record = await self._db.fetchrow(
            """
            SELECT student_count, seats_used
            FROM district_licenses
            WHERE id = $1
            """,
            license_id,
        )

        if not record:
            return False

        return record["seats_used"] < record["student_count"]

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
        result = await self._db.fetchrow(
            """
            UPDATE district_licenses
            SET seats_used = seats_used + 1,
                updated_at = NOW()
            WHERE id = $1
              AND seats_used < student_count
            RETURNING seats_used, student_count
            """,
            license_id,
        )

        if not result:
            return False

        logger.info(
            "Allocated seat for license %s (used: %d/%d)",
            license_id,
            result["seats_used"],
            result["student_count"],
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
        result = await self._db.fetchrow(
            """
            UPDATE district_licenses
            SET seats_used = GREATEST(seats_used - 1, 0),
                updated_at = NOW()
            WHERE id = $1
            RETURNING seats_used, student_count
            """,
            license_id,
        )

        if not result:
            return False

        logger.info(
            "Released seat for license %s (used: %d/%d)",
            license_id,
            result["seats_used"],
            result["student_count"],
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

        rows = await self._db.fetch(
            """
            SELECT * FROM district_licenses
            WHERE status = 'active'
              AND end_date <= $1
            ORDER BY end_date
            """,
            cutoff_date,
        )

        return [self._row_to_dict(row) for row in rows]

    def _row_to_dict(self, row) -> Dict:
        return {
            "id": row["id"],
            "district_id": row["district_id"],
            "district_name": row["district_name"],
            "student_count": row["student_count"],
            "seats_used": row["seats_used"],
            "start_date": row["start_date"],
            "end_date": row["end_date"],
            "status": row["status"],
        }
