"""Domain models for interacting with the adaptive item bank."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List

from src.core.irt_engine import ItemParameters


@dataclass(frozen=True)
class ItemContent:
    """Renderable content for an assessment item."""

    item_id: str
    question: str
    options: List[str]
    correct_answer: int
    subject: str
    grade: str
    skill: str


@dataclass
class ItemBankSnapshot:
    """Cached view of the item bank for a subject/grade band."""

    subject: str
    grade: str
    parameters: Dict[str, ItemParameters]
    content: Dict[str, ItemContent]
    skills: Dict[str, str]
    exposure_counts: Dict[str, int]
    expires_at: datetime

    def is_expired(self) -> bool:
        return datetime.utcnow() >= self.expires_at

    @classmethod
    def new(
        cls,
        subject: str,
        grade: str,
        parameters: Dict[str, ItemParameters],
        content: Dict[str, ItemContent],
        exposure_counts: Dict[str, int],
        ttl_seconds: int
    ) -> "ItemBankSnapshot":
        skills = {item_id: item.skill for item_id, item in content.items()}
        expires_at = datetime.utcnow() + timedelta(seconds=ttl_seconds)
        return cls(
            subject=subject,
            grade=grade,
            parameters=parameters,
            content=content,
            skills=skills,
            exposure_counts=exposure_counts,
            expires_at=expires_at,
        )
