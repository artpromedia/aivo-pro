"""Platform KPI analyzer backed by real data."""

from __future__ import annotations

from typing import Dict, List, Optional
import logging

from .db import Database, database
from .time_windows import resolve_time_window

logger = logging.getLogger(__name__)


class PlatformKPIAnalyzer:
    """
    Calculate platform-wide KPIs from production tables.

    Metrics:
    - User growth and retention
    - Session analytics
    - Engagement rates
    - NPS score (when survey data is available)
    """

    def __init__(self, db: Optional[Database] = None) -> None:
        self.db = db or database

    async def calculate_kpis(self, time_range: str) -> Dict:
        """Calculate platform KPIs for the requested time window."""

        start, end, delta = resolve_time_window(time_range)

        total_users_row = await self.db.fetchrow(
            "SELECT COUNT(*) AS total_users FROM users"
        )

        active_users_row = await self.db.fetchrow(
            """
            SELECT COUNT(DISTINCT user_id) AS active_users
            FROM sessions
            WHERE last_activity >= $1
            """,
            start,
        )

        session_row = await self.db.fetchrow(
            """
            SELECT
                COUNT(*) AS total_sessions,
                COALESCE(AVG(actual_duration), 0) AS avg_duration,
                AVG(
                    CASE WHEN status = 'completed' THEN 1.0 ELSE 0 END
                ) AS completion_rate
            FROM learning_sessions
            WHERE started_at >= $1 AND started_at < $2
            """,
            start,
            end,
        )

        retention_row = await self.db.fetchrow(
            """
            WITH current_period AS (
                SELECT DISTINCT child_id
                FROM learning_sessions
                WHERE started_at >= $1 AND started_at < $2
            ), previous_period AS (
                SELECT DISTINCT child_id
                FROM learning_sessions
                WHERE started_at >= $3 AND started_at < $1
            )
            SELECT
                (SELECT COUNT(*) FROM current_period) AS current_count,
                (
                    SELECT COUNT(*)
                    FROM (
                        SELECT child_id FROM current_period
                        INTERSECT
                        SELECT child_id FROM previous_period
                    ) retained
                ) AS retained_count
            """,
            start,
            end,
            start - delta,
        )

        nps_score = await self._fetch_nps_score(start, end)

        current_count = (retention_row or {}).get("current_count", 0) or 0
        retained_count = (retention_row or {}).get("retained_count", 0) or 0
        retention_rate = (
            (retained_count / current_count) * 100 if current_count else 0.0
        )

        return {
            "total_users": int((total_users_row or {}).get("total_users", 0)),
            "active_users": int(
                (active_users_row or {}).get("active_users", 0)
            ),
            "total_sessions": int(
                (session_row or {}).get("total_sessions", 0)
            ),
            "avg_session_duration": round(
                ((session_row or {}).get("avg_duration", 0) or 0) / 60, 2
            ),
            "completion_rate": round(
                ((session_row or {}).get("completion_rate", 0) or 0) * 100, 2
            ),
            "retention_rate": round(retention_rate, 2),
            "nps_score": nps_score,
        }

    async def generate_insights(self) -> List[Dict]:
        """
        Generate actionable insights from data

        Returns:
            List of insights with recommendations
        """
        insights = []

        # Get recent metrics
        kpis = await self.calculate_kpis("week")

        # Check for concerning trends
        if kpis["retention_rate"] < 80:
            insights.append({
                "type": "retention",
                "severity": "warning",
                "message": (
                    "User retention below 80% threshold"
                ),
                "recommendation": (
                    "Implement re-engagement campaign for "
                    "inactive users"
                ),
                "impact": "high",
            })

        if kpis["completion_rate"] < 70:
            insights.append({
                "type": "engagement",
                "severity": "warning",
                "message": (
                    "Low completion rate detected"
                ),
                "recommendation": (
                    "Review content difficulty and "
                    "provide additional support"
                ),
                "impact": "medium",
            })

        # Identify positive trends
        if kpis["nps_score"] and kpis["nps_score"] > 60:
            insights.append({
                "type": "satisfaction",
                "severity": "success",
                "message": (
                    f"Strong NPS score of {kpis['nps_score']}"
                ),
                "recommendation": (
                    "Leverage promoters for referral program"
                ),
                "impact": "high",
            })

        return insights

    async def _fetch_nps_score(
        self,
        start,
        end,
    ) -> Optional[float]:
        """Fetch NPS score when survey data exists."""

        try:
            row = await self.db.fetchrow(
                """
                SELECT AVG(score) AS nps_score
                FROM nps_responses
                WHERE recorded_at >= $1 AND recorded_at < $2
                """,
                start,
                end,
            )
        except Exception as exc:  # Table may not exist yet
            logger.debug("NPS query unavailable: %s", exc)
            return None

        if not row:
            return None

        value = row.get("nps_score")
        return round(value, 2) if value is not None else None
