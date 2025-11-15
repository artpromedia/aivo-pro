"""Async Postgres helper for the business model service."""
from __future__ import annotations

import logging
from typing import Optional, Iterable, Any

import asyncpg

from .config import Settings

logger = logging.getLogger(__name__)


class Database:
    """Minimal asyncpg wrapper shared across managers."""

    def __init__(self, settings: Optional[Settings] = None) -> None:
        self._settings = settings or Settings()
        self._pool: Optional[asyncpg.pool.Pool] = None

    async def connect(self) -> asyncpg.pool.Pool:
        if self._pool:
            return self._pool

        self._pool = await asyncpg.create_pool(
            dsn=self._settings.DATABASE_URL,
            min_size=1,
            max_size=10,
            command_timeout=30,
        )
        logger.info(
            "Connected to business-model database %s",
            self._settings.DATABASE_URL,
        )
        return self._pool

    async def close(self) -> None:
        if self._pool:
            await self._pool.close()
            self._pool = None
            logger.info("Business-model database pool closed")

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
