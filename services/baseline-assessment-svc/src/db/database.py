"""Async Postgres helper for the baseline assessment service."""
from __future__ import annotations

import logging
from typing import Optional, Iterable, Any

import asyncpg

from src.config import Settings

logger = logging.getLogger(__name__)


class Database:
    """Thin asyncpg wrapper that exposes fetch/execute helpers."""

    def __init__(self, settings: Optional[Settings] = None) -> None:
        self._settings = settings or Settings()
        self._pool: Optional[asyncpg.pool.Pool] = None

    async def connect(self) -> asyncpg.pool.Pool:
        """Create the connection pool on first use."""
        if self._pool:
            return self._pool

        self._pool = await asyncpg.create_pool(
            dsn=self._settings.DATABASE_URL,
            min_size=self._settings.DB_POOL_MIN_SIZE,
            max_size=self._settings.DB_POOL_MAX_SIZE,
            command_timeout=self._settings.DB_COMMAND_TIMEOUT,
        )

        logger.info(
            "Connected to baseline assessment database %s (pool %s-%s)",
            self._settings.DATABASE_URL,
            self._settings.DB_POOL_MIN_SIZE,
            self._settings.DB_POOL_MAX_SIZE,
        )
        return self._pool

    async def close(self) -> None:
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None
            logger.info("Baseline assessment database pool closed")

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

    async def fetchval(self, query: str, *args: Any) -> Any:
        pool = await self.connect()
        async with pool.acquire() as conn:
            return await conn.fetchval(query, *args)

    async def execute(self, query: str, *args: Any) -> str:
        pool = await self.connect()
        async with pool.acquire() as conn:
            return await conn.execute(query, *args)


settings = Settings()
database = Database(settings=settings)

__all__ = ["Database", "database"]
