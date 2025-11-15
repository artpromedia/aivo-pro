"""Shared time range utilities for analytics calculations."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Tuple

# Default lookback windows for supported ranges
_TIME_WINDOWS = {
    "day": timedelta(days=1),
    "week": timedelta(days=7),
    "month": timedelta(days=30),
    "quarter": timedelta(days=90),
    "year": timedelta(days=365),
}


def resolve_time_window(
    time_range: str
) -> Tuple[datetime, datetime, timedelta]:
    """Return a (start, end, delta) tuple for the requested time range."""

    normalized = (time_range or "month").lower()
    delta = _TIME_WINDOWS.get(normalized, _TIME_WINDOWS["month"])
    end = datetime.utcnow()
    start = end - delta
    return start, end, delta


__all__ = ["resolve_time_window"]
