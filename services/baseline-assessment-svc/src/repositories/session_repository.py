"""Persistence helpers for assessment sessions and responses."""
from __future__ import annotations

import json
from datetime import datetime
from typing import Dict, Optional

from ..db.database import Database, database


class AssessmentSessionRepository:
    """Persists session metadata, responses, and outcomes."""

    def __init__(self, db: Database | None = None) -> None:
        self._db = db or database

    async def create_session(
        self,
        session_id: str,
        child_id: str,
        subject: str,
        grade: str,
    ) -> None:
        await self._db.execute(
            """
            INSERT INTO baseline_sessions (
                id,
                child_id,
                subject,
                grade,
                status,
                started_at
            ) VALUES ($1, $2, $3, $4, 'in_progress', $5)
            ON CONFLICT (id) DO NOTHING
            """,
            session_id,
            child_id,
            subject,
            grade,
            datetime.utcnow(),
        )

    async def record_response(
        self,
        session_id: str,
        item_id: str,
        answer: int,
        correct: bool,
        response_time_ms: int,
        theta_before: float,
        theta_after: float,
    ) -> None:
        await self._db.execute(
            """
            INSERT INTO baseline_responses (
                session_id,
                item_id,
                answer,
                correct,
                response_time_ms,
                theta_before,
                theta_after,
                timestamp
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
            session_id,
            item_id,
            answer,
            correct,
            response_time_ms,
            theta_before,
            theta_after,
            datetime.utcnow(),
        )

    async def update_progress(
        self,
        session_id: str,
        stats: Dict,
    ) -> None:
        await self._db.execute(
            """
            UPDATE baseline_sessions
            SET theta_estimate = $1,
                standard_error = $2,
                total_items = $3,
                percent_correct = $4,
                total_time_seconds = $5,
                updated_at = $6
            WHERE id = $7
            """,
            stats.get("theta"),
            stats.get("standard_error"),
            stats.get("num_items"),
            stats.get("percent_correct"),
            stats.get("duration_seconds"),
            datetime.utcnow(),
            session_id,
        )

    async def complete_session(
        self,
        session_id: str,
        skill_vector: Dict,
        recommendations: list[str],
    ) -> None:
        await self._db.execute(
            """
            UPDATE baseline_sessions
            SET status = 'completed',
                completed_at = $1,
                skill_vector = $2,
                recommendations = $3
            WHERE id = $4
            """,
            datetime.utcnow(),
            json.dumps({k: v.__dict__ if hasattr(v, "__dict__") else v
                        for k, v in skill_vector.items()}),
            json.dumps(recommendations),
            session_id,
        )

    async def get_total_assessments(
        self,
        subject: Optional[str] = None,
        grade: Optional[str] = None,
    ) -> int:
        base_query = "SELECT COUNT(*) FROM baseline_sessions"
        params = []
        clauses = []

        if subject:
            clauses.append("subject = $%s" % (len(params) + 1))
            params.append(subject)
        if grade:
            clauses.append("grade = $%s" % (len(params) + 1))
            params.append(grade)

        if clauses:
            base_query += " WHERE " + " AND ".join(clauses)

        result = await self._db.fetchrow(base_query, *params)
        return result["count"] if result and result["count"] is not None else 0
