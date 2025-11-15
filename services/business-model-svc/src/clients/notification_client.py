"""HTTP client for the notification microservice."""
from __future__ import annotations

import logging
from typing import Dict, List, Optional

import httpx

logger = logging.getLogger(__name__)


class NotificationServiceClient:
    """Sends templated notifications via the notification service."""

    def __init__(
        self,
        base_url: str,
        timeout: float = 5.0,
        default_channels: Optional[List[str]] = None,
    ) -> None:
        self._client = httpx.AsyncClient(base_url=base_url, timeout=timeout)
        self._default_channels = default_channels or ["email"]

    async def send_notification(
        self,
        user_id: str,
        category: str,
        channel: str,
        template: str,
        data: Optional[Dict] = None,
        priority: str = "normal",
    ) -> None:
        payload = {
            "user_id": user_id,
            "channels": [channel] if channel else self._default_channels,
            "template_id": template,
            "template_data": data or {},
            "priority": priority,
        }

        try:
            response = await self._client.post(
                "/v1/notify/multi-channel",
                json=payload,
            )
            response.raise_for_status()
        except httpx.HTTPError as exc:  # pragma: no cover - network errors
            logger.warning(
                "Notification dispatch failed for user %s: %s",
                user_id,
                exc,
            )

    async def close(self) -> None:
        await self._client.aclose()
