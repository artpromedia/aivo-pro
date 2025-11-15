"""Database helpers for the notification service."""

from __future__ import annotations

import logging
from typing import Optional

import asyncpg

from .config import Settings

logger = logging.getLogger(__name__)
settings = Settings()


class Database:
    """Simple asyncpg wrapper that exposes fetch/execute helpers."""

    def __init__(self) -> None:
        self.pool: Optional[asyncpg.pool.Pool] = None

    async def connect(self) -> asyncpg.pool.Pool:
        """Initialize a connection pool if needed."""
        if self.pool:
            return self.pool

        self.pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=settings.DB_POOL_MIN_SIZE,
            max_size=settings.DB_POOL_MAX_SIZE,
            command_timeout=settings.DB_COMMAND_TIMEOUT,
        )

        logger.info(
            "Connected to Postgres at %s (pool %s-%s)",
            settings.DATABASE_URL,
            settings.DB_POOL_MIN_SIZE,
            settings.DB_POOL_MAX_SIZE
        )

        return self.pool

    async def close(self) -> None:
        """Close pool when shutting down the service."""
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("Database pool closed")

    async def _get_pool(self) -> asyncpg.pool.Pool:
        if not self.pool:
            return await self.connect()
        return self.pool

    async def fetch(self, query: str, *args):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetchrow(self, query: str, *args):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def execute(self, query: str, *args):
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            return await conn.execute(query, *args)


database = Database()

__all__ = ["Database", "database"]
