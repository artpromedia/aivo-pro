"""Async Postgres helper for the analytics service."""

from __future__ import annotations

import logging
from typing import Optional, Iterable, Any

import asyncpg

from .config import Settings

logger = logging.getLogger(__name__)


class Database:
    """Lightweight asyncpg wrapper shared across analyzers."""

    def __init__(self, settings: Optional[Settings] = None) -> None:
        self._settings = settings or Settings()
        self._pool: Optional[asyncpg.pool.Pool] = None

    async def connect(self) -> asyncpg.pool.Pool:
        """Initialize the pool if it has not been created yet."""
        if self._pool:
            return self._pool

        self._pool = await asyncpg.create_pool(
            dsn=self._settings.DATABASE_URL,
            min_size=self._settings.DB_POOL_MIN_SIZE,
            max_size=self._settings.DB_POOL_MAX_SIZE,
            command_timeout=self._settings.DB_COMMAND_TIMEOUT,
        )

        logger.info(
            "Connected to analytics database %s (pool %s-%s)",
            self._settings.DATABASE_URL,
            self._settings.DB_POOL_MIN_SIZE,
            self._settings.DB_POOL_MAX_SIZE,
        )
        return self._pool

    async def close(self) -> None:
        """Close the pool on shutdown."""
        if self._pool:
            await self._pool.close()
            self._pool = None
            logger.info("Analytics database pool closed")

    async def fetch(self, query: str, *args: Any) -> Iterable[asyncpg.Record]:
        pool = await self.connect()
        async with pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetchrow(
        self,
        query: str,
        *args: Any
    ) -> Optional[asyncpg.Record]:
        pool = await self.connect()
        async with pool.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def execute(self, query: str, *args: Any) -> str:
        pool = await self.connect()
        async with pool.acquire() as conn:
            return await conn.execute(query, *args)


settings = Settings()
database = Database(settings=settings)

__all__ = ["Database", "database"]
