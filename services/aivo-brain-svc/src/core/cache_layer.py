"""
Cache Layer using Redis
Following Microsoft Azure Cache patterns
"""

import json
from typing import Any, Optional

import redis.asyncio as redis


class CacheLayer:
    """
    Production cache layer with Redis
    Implements Microsoft's distributed cache patterns
    """
    
    def __init__(
        self,
        redis_url: str,
        ttl: int = 3600,
        max_size: int = 10000
    ):
        self.redis_url = redis_url
        self.ttl = ttl
        self.max_size = max_size
        self.redis_client: Optional[redis.Redis] = None
        
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self.redis_client = await redis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=5,
                socket_keepalive=True,
                health_check_interval=30
            )
            
            # Test connection
            await self.redis_client.ping()
            print("✅ Redis connection established")
            
        except Exception as e:
            print(f"⚠️ Redis connection failed: {e}")
            print("   Cache will be disabled")
            self.redis_client = None
    
    async def get(self, key: str) -> Optional[dict]:
        """Get value from cache"""
        if not self.redis_client:
            return None
        
        try:
            value = await self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
            
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    async def set(
        self,
        key: str,
        value: dict,
        ttl: Optional[int] = None
    ):
        """Set value in cache"""
        if not self.redis_client:
            return
        
        try:
            cache_ttl = ttl or self.ttl
            serialized = json.dumps(value)
            
            await self.redis_client.setex(
                key,
                cache_ttl,
                serialized
            )
            
        except Exception as e:
            print(f"Cache set error: {e}")
    
    async def delete(self, key: str):
        """Delete key from cache"""
        if not self.redis_client:
            return
        
        try:
            await self.redis_client.delete(key)
        except Exception as e:
            print(f"Cache delete error: {e}")
    
    async def clear_all(self):
        """Clear all cache entries (use with caution)"""
        if not self.redis_client:
            return
        
        try:
            await self.redis_client.flushdb()
        except Exception as e:
            print(f"Cache clear error: {e}")
    
    async def health_check(self) -> bool:
        """Check if cache is healthy"""
        if not self.redis_client:
            return False
        
        try:
            await self.redis_client.ping()
            return True
        except Exception:
            return False
    
    async def cleanup(self):
        """Cleanup cache connection"""
        if self.redis_client:
            try:
                await self.redis_client.close()
            except Exception as e:
                print(f"Cache cleanup error: {e}")
