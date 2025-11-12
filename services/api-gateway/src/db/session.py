"""
Database Session Management
AsyncPG connection pool with SQLAlchemy 2.0
"""
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    create_async_engine,
    async_sessionmaker
)
from src.config import settings
from src.db.models import Base
import logging

logger = logging.getLogger(__name__)

# Global engine and session factory
engine: AsyncEngine | None = None
async_session_factory: async_sessionmaker[AsyncSession] | None = None


async def init_db() -> None:
    """Initialize database connection"""
    global engine, async_session_factory
    
    logger.info("Initializing database connection...")
    
    # Create async engine
    engine = create_async_engine(
        settings.database_url,
        echo=settings.db_echo,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_timeout=settings.db_pool_timeout,
        pool_pre_ping=True,  # Verify connections before checkout
    )
    
    # Create session factory
    async_session_factory = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False
    )
    
    logger.info("Database connection initialized")


async def create_tables() -> None:
    """Create all tables (development only)"""
    global engine
    
    if engine is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    
    logger.info("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")


async def drop_tables() -> None:
    """Drop all tables (development only)"""
    global engine
    
    if engine is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    
    logger.warning("Dropping all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    logger.warning("All database tables dropped")


async def close_db() -> None:
    """Close database connection"""
    global engine
    
    if engine:
        logger.info("Closing database connection...")
        await engine.dispose()
        logger.info("Database connection closed")


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get database session context manager
    
    Usage:
        async with get_session() as session:
            user = await session.get(User, user_id)
    """
    if async_session_factory is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for database sessions
    
    Usage:
        @app.get("/users/{user_id}")
        async def get_user(
            user_id: str,
            db: AsyncSession = Depends(get_db)
        ):
            return await db.get(User, user_id)
    """
    if async_session_factory is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
