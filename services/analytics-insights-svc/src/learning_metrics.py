"""Learning metrics analyzer backed by Postgres."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging

from .db import Database, database
from .time_windows import resolve_time_window

logger = logging.getLogger(__name__)


class LearningMetricsAnalyzer:
    """Analyze learning effectiveness metrics using real session data."""

    def __init__(self, db: Optional[Database] = None) -> None:
        self.db = db or database

    async def calculate_metrics(self, time_range: str) -> Dict:
        """Calculate learning metrics for the requested window."""

        start, end, _ = resolve_time_window(time_range)

        session_stats = await self.db.fetchrow(
            """
            SELECT
                COUNT(DISTINCT child_id)                AS learner_count,
                COALESCE(SUM(actual_duration), 0)       AS total_duration,
                COALESCE(SUM(CASE WHEN status = 'completed'
                                  THEN 1 ELSE 0 END), 0) AS completed_sessions
            FROM learning_sessions
            WHERE started_at >= $1 AND started_at < $2
            """,
            start,
            end,
        )

        mastery_stats = await self.db.fetchrow(
            """
            SELECT
                COALESCE(SUM(skills_mastered), 0)       AS total_skills,
                COALESCE(AVG(average_mastery), 0)       AS avg_mastery,
                COALESCE(SUM(total_time_minutes), 0)    AS total_minutes
            FROM subject_progress
            WHERE updated_at >= $1
            """,
            start,
        )

        top_skills = await self.db.fetch(
            """
            SELECT
                skill,
                COUNT(*) FILTER (WHERE correct IS TRUE) AS mastery_events
            FROM learning_tasks
            WHERE submitted_at >= $1 AND submitted_at < $2
            GROUP BY skill
            ORDER BY mastery_events DESC
            LIMIT 5
            """,
            start,
            end,
        )

        total_duration = (session_stats or {}).get("total_duration", 0) or 0
        total_skills = (mastery_stats or {}).get("total_skills", 0) or 0
        total_minutes = (mastery_stats or {}).get("total_minutes", 0) or 0
        learner_count = (session_stats or {}).get("learner_count", 0) or 0

        avg_time_to_mastery = 0.0
        if total_skills:
            avg_time_to_mastery = (total_minutes / total_skills) / 60

        return {
            "total_learners": learner_count,
            "hours_practiced": round(total_duration / 3600, 2),
            "skills_mastered": int(total_skills),
            "avg_mastery_rate": round(
                ((mastery_stats or {}).get("avg_mastery", 0) or 0) * 100, 2
            ),
            "avg_time_to_mastery": round(avg_time_to_mastery, 2),
            "top_skills": [
                {
                    "name": record["skill"],
                    "count": record["mastery_events"] or 0,
                }
                for record in top_skills
            ],
        }

    async def get_student_analytics(
        self, student_id: str
    ) -> Optional[Dict]:
        """Get detailed analytics for a specific student."""

        session_stats = await self.db.fetchrow(
            """
            SELECT
                COALESCE(SUM(actual_duration), 0) AS total_duration,
                COALESCE(AVG(accuracy), 0)      AS avg_accuracy,
                COALESCE(MAX(completed_at), NULL) AS last_completed,
                COUNT(*) FILTER (
                    WHERE status = 'completed'
                ) AS completed_sessions
            FROM learning_sessions
            WHERE child_id = $1
            """,
            student_id,
        )

        progress_rows = await self.db.fetch(
            """
            SELECT subject, skills_mastered, skill_details
            FROM subject_progress
            WHERE child_id = $1
            """,
            student_id,
        )

        if not session_stats and not progress_rows:
            return None

        total_hours = (
            (session_stats or {}).get("total_duration", 0) or 0
        ) / 3600
        mastery_rate = (
            ((session_stats or {}).get("avg_accuracy", 0) or 0) * 100
        )
        skills_mastered = sum(
            (row["skills_mastered"] or 0) for row in progress_rows
        )

        strong_areas, improvement_areas = self._derive_skill_focus(
            progress_rows
        )
        current_streak = await self._calculate_practice_streak(student_id)
        achievements = await self._recent_achievements(student_id)

        return {
            "student_id": student_id,
            "total_hours": round(total_hours, 2),
            "skills_mastered": int(skills_mastered),
            "current_streak": current_streak,
            "mastery_rate": round(mastery_rate, 2),
            "strong_areas": strong_areas,
            "improvement_areas": improvement_areas,
            "recent_achievements": achievements,
        }

    def _derive_skill_focus(
        self, progress_rows: List
    ) -> Tuple[List[str], List[str]]:
        """Split skills into strengths vs improvements based on mastery."""

        strong: List[str] = []
        improve: List[str] = []

        for row in progress_rows:
            details = row.get("skill_details") or {}
            for skill, info in details.items():
                mastery = (
                    info.get("mastery")
                    or info.get("mastery_probability")
                    or info.get("mastery_level")
                )

                if mastery is None:
                    continue

                if mastery >= 0.8:
                    strong.append(skill)
                elif mastery <= 0.5:
                    improve.append(skill)

        return strong[:5], improve[:5]

    async def _calculate_practice_streak(self, student_id: str) -> int:
        """Calculate the current daily practice streak."""

        rows = await self.db.fetch(
            """
            SELECT DISTINCT DATE(started_at) AS session_date
            FROM learning_sessions
            WHERE child_id = $1
            ORDER BY session_date DESC
            LIMIT 30
            """,
            student_id,
        )

        streak = 0
        expected_date = datetime.utcnow().date()

        for row in rows:
            session_date = row["session_date"]
            if session_date == expected_date:
                streak += 1
                expected_date -= timedelta(days=1)
            elif session_date == expected_date - timedelta(days=1):
                # Skip gaps up to 1 day to allow for timezone differences
                expected_date -= timedelta(days=1)
            else:
                break

        return streak

    async def _recent_achievements(self, student_id: str) -> List[str]:
        """Return human-readable strings for the latest completed sessions."""

        rows = await self.db.fetch(
            """
            SELECT subject, completed_at, accuracy
            FROM learning_sessions
            WHERE child_id = $1 AND status = 'completed'
            ORDER BY completed_at DESC
            LIMIT 3
            """,
            student_id,
        )

        achievements: List[str] = []
        for row in rows:
            subject = row["subject"] or "Session"
            completed_at = row["completed_at"]
            accuracy = row["accuracy"] or 0
            if completed_at:
                achievements.append(
                    f"{subject} mastery at {accuracy * 100:.1f}% on "
                    f"{completed_at.strftime('%b %d')}"
                )
            else:
                achievements.append(
                    f"{subject} mastery at {accuracy * 100:.1f}%"
                )

        return achievements
