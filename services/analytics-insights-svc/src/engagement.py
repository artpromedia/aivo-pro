"""User engagement analyzer backed by production data."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, Optional
import logging

from .db import Database, database
from .time_windows import resolve_time_window

logger = logging.getLogger(__name__)


class EngagementAnalyzer:
    """Analyze user engagement metrics."""

    def __init__(self, db: Optional[Database] = None) -> None:
        self.db = db or database

    async def calculate_metrics(self, time_range: str) -> Dict:
        """Calculate engagement metrics using session and feature data."""

        start, end, _ = resolve_time_window(time_range)
        now = datetime.utcnow()
        one_day_ago = now - timedelta(days=1)
        one_month_ago = now - timedelta(days=30)

        dau_row = await self.db.fetchrow(
            """
            SELECT COUNT(DISTINCT user_id) AS dau
            FROM sessions
            WHERE last_activity >= $1
            """,
            one_day_ago,
        )

        mau_row = await self.db.fetchrow(
            """
            SELECT COUNT(DISTINCT user_id) AS mau
            FROM sessions
            WHERE last_activity >= $1
            """,
            one_month_ago,
        )

        session_row = await self.db.fetchrow(
            """
            SELECT
                COUNT(*) AS session_count,
                COUNT(DISTINCT child_id) AS learner_count,
                COALESCE(AVG(actual_duration), 0) AS avg_duration
            FROM learning_sessions
            WHERE started_at >= $1 AND started_at < $2
            """,
            start,
            end,
        )

        adoption_row = await self.db.fetchrow(
            """
            WITH adoption AS (
                SELECT customer_id, SUM(usage_count) AS total_usage
                FROM feature_usage
                GROUP BY customer_id
            )
            SELECT
                COUNT(*) AS customers,
                COUNT(*) FILTER (WHERE total_usage > 0) AS adopters
            FROM adoption
            """
        )

        top_features = await self.db.fetch(
            """
            SELECT feature_name, SUM(usage_count) AS usage
            FROM feature_usage
            GROUP BY feature_name
            ORDER BY usage DESC
            LIMIT 5
            """
        )

        session_count = (session_row or {}).get("session_count", 0) or 0
        learner_count = (session_row or {}).get("learner_count", 0) or 0
        avg_sessions = (
            session_count / learner_count if learner_count else 0.0
        )

        customers = (adoption_row or {}).get("customers", 0) or 0
        adopters = (adoption_row or {}).get("adopters", 0) or 0
        adoption_rate = (
            (adopters / customers) * 100 if customers else 0.0
        )

        return {
            "dau": int((dau_row or {}).get("dau", 0)),
            "mau": int((mau_row or {}).get("mau", 0)),
            "avg_sessions_per_user": round(avg_sessions, 2),
            "avg_time_per_session": round(
                ((session_row or {}).get("avg_duration", 0) or 0) / 60, 2
            ),
            "feature_adoption_rate": round(adoption_rate, 2),
            "top_features": [
                {"name": row["feature_name"], "usage": row["usage"] or 0}
                for row in top_features
            ],
        }

    async def analyze_cohort(self, cohort_date: str) -> Dict:
        """Perform cohort retention analysis for a signup month."""

        cohort_start = self._parse_cohort_date(cohort_date)
        cohort_end = cohort_start + timedelta(days=30)

        users = await self.db.fetch(
            """
            SELECT id
            FROM users
            WHERE created_at >= $1 AND created_at < $2
            """,
            cohort_start,
            cohort_end,
        )

        user_ids = [row["id"] for row in users]
        if not user_ids:
            return {
                "cohort_date": cohort_start.date().isoformat(),
                "initial_size": 0,
                "retention": {},
            }

        retention_points = {
            "week_1": 7,
            "week_2": 14,
            "month_1": 30,
            "month_2": 60,
            "month_3": 90,
        }

        retention = {}
        total_users = len(user_ids)

        for label, days in retention_points.items():
            checkpoint = cohort_start + timedelta(days=days)
            row = await self.db.fetchrow(
                """
                SELECT COUNT(DISTINCT user_id) AS retained
                FROM sessions
                WHERE user_id = ANY($1::uuid[])
                  AND last_activity >= $2
                """,
                user_ids,
                checkpoint,
            )
            retained = (row or {}).get("retained", 0) or 0
            retention[label] = round((retained / total_users) * 100, 2)

        return {
            "cohort_date": cohort_start.date().isoformat(),
            "initial_size": total_users,
            "retention": retention,
        }

    def _parse_cohort_date(self, value: str) -> datetime:
        """Parse YYYY-MM or ISO date strings for cohort analysis."""

        try:
            if len(value) == 7:
                return datetime.strptime(value, "%Y-%m")
            return datetime.fromisoformat(value)
        except ValueError as exc:
            raise ValueError(
                "cohort_date must be in YYYY-MM or YYYY-MM-DD format"
            ) from exc
