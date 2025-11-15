"""
Database session management
Author: Staff Engineer (ex-Google DeepMind Education)
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    create_async_engine,
    async_sessionmaker
)
from sqlalchemy.pool import NullPool

from src.config import settings


class DatabaseManager:
    """Manage database connections and sessions"""

    def __init__(self):
        self.engine: AsyncEngine = None
        self.session_factory: async_sessionmaker = None

    def initialize(self):
        """Initialize database engine"""
        self.engine = create_async_engine(
            settings.database_url,
            pool_size=settings.db_pool_size,
            max_overflow=settings.db_max_overflow,
            pool_pre_ping=True,
            echo=settings.log_level == "DEBUG",
            poolclass=NullPool if settings.environment == "test" else None
        )

        self.session_factory = async_sessionmaker(
            self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False
        )

    async def close(self):
        """Close database connections"""
        if self.engine:
            await self.engine.dispose()

    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get database session context manager"""
        async with self.session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise


# Global database manager
db_manager = DatabaseManager()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for FastAPI"""
    async with db_manager.session() as session:
        yield session
