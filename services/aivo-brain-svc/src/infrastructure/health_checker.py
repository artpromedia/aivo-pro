"""
Health Checker following Google SRE practices
Implements comprehensive health monitoring
"""

import asyncio
from datetime import datetime
from typing import Dict, Optional

# Try to import torch, but make it optional
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False


class HealthChecker:
    """
    Comprehensive health checking system
    Following Google's SRE health check patterns
    """

    def __init__(self, components: Dict):
        self.components = components
        self.last_check_time: Optional[datetime] = None
        self.health_status: Dict = {}

    async def check_health(self) -> Dict:
        """
        Check overall system health
        Returns health status for all components
        """
        checks = {}

        # Check model manager
        if 'model_manager' in self.components:
            checks['model_loaded'] = await self._check_model()

        # Check cache layer
        if 'cache_layer' in self.components:
            checks['cache_available'] = await self._check_cache()

        # Check curriculum expert
        if 'curriculum_expert' in self.components:
            checks['curriculum_available'] = await self._check_curriculum()

        # Check GPU/device
        checks['device_available'] = await self._check_device()

        # Check memory
        checks['memory_ok'] = await self._check_memory()

        # Overall health
        healthy = all(checks.values())

        self.last_check_time = datetime.utcnow()
        self.health_status = {
            "healthy": healthy,
            "checks": checks,
            "timestamp": self.last_check_time.isoformat()
        }

        return self.health_status

    async def check_readiness(self) -> Dict:
        """
        Check if service is ready to accept traffic
        More stringent than health check
        """
        # Service is ready if all critical components are healthy
        health = await self.check_health()

        ready = (
            health["checks"].get("model_loaded", False) and
            health["checks"].get("memory_ok", False)
        )

        return {
            "ready": ready,
            "reason": "All critical components operational" if ready else "Critical components not ready",
            "timestamp": datetime.utcnow().isoformat()
        }

    async def _check_model(self) -> bool:
        """Check if model is loaded and healthy"""
        try:
            model_manager = self.components.get('model_manager')
            if not model_manager:
                return False

            return await model_manager.health_check()

        except Exception as e:
            print(f"Model health check failed: {e}")
            return False

    async def _check_cache(self) -> bool:
        """Check cache availability"""
        try:
            cache_layer = self.components.get('cache_layer')
            if not cache_layer:
                return True  # Cache is optional

            return await cache_layer.health_check()

        except Exception as e:
            print(f"Cache health check failed: {e}")
            return True  # Cache failure shouldn't fail health check

    async def _check_curriculum(self) -> bool:
        """Check curriculum expert availability"""
        try:
            curriculum_expert = self.components.get('curriculum_expert')
            if not curriculum_expert:
                return True  # Optional component

            return await curriculum_expert.health_check()

        except Exception as e:
            print(f"Curriculum health check failed: {e}")
            return True  # Optional component

    async def _check_device(self) -> bool:
        """Check GPU/device availability and health"""
        try:
            if TORCH_AVAILABLE and torch.cuda.is_available():
                # Test GPU with small operation
                test_tensor = torch.rand(10, 10).cuda()
                _ = torch.mm(test_tensor, test_tensor)
                return True
            return True  # CPU mode or cloud mode is acceptable

        except Exception as e:
            print(f"Device health check failed: {e}")
            return True  # Don't fail on device check in cloud mode

    async def _check_memory(self) -> bool:
        """Check memory usage"""
        try:
            if TORCH_AVAILABLE and torch.cuda.is_available():
                # Check GPU memory
                memory_allocated = torch.cuda.memory_allocated()
                total_memory = torch.cuda.get_device_properties(0).total_memory

                # Alert if using >90% memory
                usage_percent = (memory_allocated / total_memory) * 100
                return usage_percent < 90

            return True  # CPU memory check would go here

        except Exception as e:
            print(f"Memory health check failed: {e}")
            return False

    async def start_health_monitoring(self):
        """
        Start continuous health monitoring
        Runs in background
        """
        print("🔍 Starting health monitoring...")

        while True:
            try:
                health = await self.check_health()

                if not health["healthy"]:
                    print(f"⚠️ Health check failed: {health}")

                # Wait before next check
                await asyncio.sleep(30)

            except Exception as e:
                print(f"Health monitoring error: {e}")
                await asyncio.sleep(60)
