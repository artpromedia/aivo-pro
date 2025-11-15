"""Data access helpers for the adaptive item bank."""
from __future__ import annotations

import json
import logging
from typing import Dict, Tuple

from src.core.irt_engine import ItemParameters
from src.db import Database, database
from src.models.item_bank import ItemBankSnapshot, ItemContent

logger = logging.getLogger(__name__)


class ItemBankRepository:
    """Loads calibrated assessment items from Postgres with simple caching."""

    def __init__(
        self,
        db: Database | None = None,
        cache_ttl_seconds: int = 300
    ) -> None:
        self._db = db or database
        self._cache_ttl_seconds = cache_ttl_seconds
        self._cache: Dict[Tuple[str, str], ItemBankSnapshot] = {}

    def _cache_key(self, subject: str, grade: str) -> Tuple[str, str]:
        return (subject.lower(), grade.lower())

    async def get_snapshot(self, subject: str, grade: str) -> ItemBankSnapshot:
        """Return cached snapshot or hydrate from the database."""
        key = self._cache_key(subject, grade)
        snapshot = self._cache.get(key)

        if snapshot and not snapshot.is_expired():
            return snapshot

        rows = await self._db.fetch(
            """
            SELECT
                id,
                subject,
                grade,
                skill,
                question,
                options,
                correct_answer,
                difficulty,
                discrimination,
                guessing,
                upper_asymptote,
                COALESCE(exposure_count, 0) AS exposure_count
            FROM item_bank
            WHERE subject = $1
              AND grade = $2
              AND is_active = TRUE
            ORDER BY difficulty
            """,
            subject,
            grade,
        )

        if not rows:
            raise ValueError(
                "No calibrated items found for subject="
                f"{subject} grade={grade}"
            )

        parameters: Dict[str, ItemParameters] = {}
        content: Dict[str, ItemContent] = {}
        exposure_counts: Dict[str, int] = {}

        for row in rows:
            item_id = row["id"]
            parameters[item_id] = ItemParameters(
                item_id=item_id,
                difficulty=row["difficulty"],
                discrimination=row["discrimination"],
                guessing=row["guessing"],
                upper_asymptote=row["upper_asymptote"],
            )

            options = row["options"]
            if isinstance(options, str):
                options = json.loads(options)

            content[item_id] = ItemContent(
                item_id=item_id,
                question=row["question"],
                options=options,
                correct_answer=row["correct_answer"],
                subject=row["subject"],
                grade=row["grade"],
                skill=row["skill"],
            )
            exposure_counts[item_id] = row["exposure_count"]

        snapshot = ItemBankSnapshot.new(
            subject=subject,
            grade=grade,
            parameters=parameters,
            content=content,
            exposure_counts=exposure_counts,
            ttl_seconds=self._cache_ttl_seconds,
        )
        self._cache[key] = snapshot
        logger.info(
            "Loaded %s items for %s grade %s",
            len(parameters),
            subject,
            grade,
        )
        return snapshot

    async def increment_exposure(self, item_id: str) -> None:
        """Increment exposure count for a delivered item."""
        await self._db.execute(
            """
            UPDATE item_bank
            SET exposure_count = COALESCE(exposure_count, 0) + 1
            WHERE id = $1
            """,
            item_id,
        )

        for snapshot in self._cache.values():
            if item_id in snapshot.exposure_counts:
                snapshot.exposure_counts[item_id] += 1
                break
