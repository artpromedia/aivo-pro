"""
AIVO Main Brain Service - Production Implementation
Author: Senior Backend Engineer (ex-Google/Microsoft)
Following: Google SRE Book, Microsoft Azure Well-Architected Framework

This is the CRITICAL service - the entire platform depends on it.
"""

import asyncio
import hashlib
import json
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncGenerator, Dict, Optional

import sentry_sdk
import uvicorn
from circuitbreaker import circuit
from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from prometheus_client import Counter, Gauge, Histogram, generate_latest
from pydantic import BaseModel, Field, validator
from sentry_sdk.integrations.fastapi import FastApiIntegration

from src.config import settings
from src.core.cache_layer import CacheLayer
from src.core.inference_engine import InferenceEngine
# Import model managers conditionally to avoid torch dependency in cloud mode
if settings.USE_LOCAL_MODELS:
    from src.core.model_manager import ModelManager
else:
    ModelManager = None
from src.core.cloud_model_manager import CloudModelManager
from src.infrastructure.health_checker import HealthChecker
from src.ml.curriculum_expert import CurriculumExpertSystem
from src.monitoring.metrics import MetricsCollector
from src.security.input_validator import InputValidator

# Initialize Sentry for error tracking (Microsoft AppInsights pattern)
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )

# Prometheus metrics (Google SRE golden signals)
request_count = Counter(
    'aivo_brain_requests_total',
    'Total requests',
    ['method', 'endpoint', 'status']
)
request_duration = Histogram(
    'aivo_brain_request_duration_seconds',
    'Request duration',
    ['method', 'endpoint']
)
active_requests = Gauge(
    'aivo_brain_active_requests',
    'Active requests'
)
model_inference_time = Histogram(
    'aivo_brain_inference_seconds',
    'Model inference time'
)
cache_hit_rate = Gauge(
    'aivo_brain_cache_hit_rate',
    'Cache hit rate'
)


class AIVOBrainService:
    """
    Production-grade AIVO Brain Service
    Implements Google's microservice patterns and Microsoft's resilience
    """
    
    def __init__(self):
        self.model_manager: Optional[ModelManager] = None
        self.inference_engine: Optional[InferenceEngine] = None
        self.cache_layer: Optional[CacheLayer] = None
        self.health_checker: Optional[HealthChecker] = None
        self.metrics_collector: Optional[MetricsCollector] = None
        self.curriculum_expert: Optional[CurriculumExpertSystem] = None
        self.input_validator: InputValidator = InputValidator()
        
        # Circuit breaker pattern (Netflix Hystrix style)
        self.circuit_breaker_settings = {
            'failure_threshold': 5,
            'recovery_timeout': 60,
            'expected_exception': Exception
        }
        
    async def initialize(self):
        """
        Initialize all components with proper error handling
        Following Google's graceful degradation pattern
        """
        try:
            print("🚀 Initializing AIVO Brain Service...")
            
            # Initialize Redis cache (Microsoft Azure Cache pattern)
            self.cache_layer = CacheLayer(
                redis_url=settings.REDIS_URL,
                ttl=settings.CACHE_TTL,
                max_size=settings.CACHE_MAX_SIZE
            )
            await self.cache_layer.initialize()
            print("✅ Cache layer initialized")
            
            # Initialize model manager based on AI provider
            if settings.USE_LOCAL_MODELS:
                # Local HuggingFace models
                self.model_manager = ModelManager(
                    primary_model=settings.PRIMARY_MODEL,
                    fallback_models=settings.FALLBACK_MODELS,
                    device_map="auto",
                    optimization_level=settings.OPTIMIZATION_LEVEL
                )
                await self.model_manager.load_models()
                print("✅ Local model manager initialized")
            else:
                # Cloud AI providers (OpenAI, Anthropic, Google)
                self.model_manager = CloudModelManager(
                    ai_provider=settings.AI_PROVIDER,
                    primary_model=settings.PRIMARY_MODEL,
                    fallback_models=settings.FALLBACK_MODELS,
                    openai_api_key=settings.OPENAI_API_KEY,
                    anthropic_api_key=settings.ANTHROPIC_API_KEY,
                    google_api_key=settings.GOOGLE_API_KEY
                )
                await self.model_manager.load_models()
                print(f"✅ Cloud model manager initialized ({settings.AI_PROVIDER})")
            
            # Initialize inference engine with batching
            self.inference_engine = InferenceEngine(
                model_manager=self.model_manager,
                batch_size=settings.BATCH_SIZE,
                max_batch_delay_ms=settings.MAX_BATCH_DELAY_MS
            )
            print("✅ Inference engine initialized")
            
            # Initialize curriculum expert system
            self.curriculum_expert = CurriculumExpertSystem(
                knowledge_base_path=settings.KNOWLEDGE_BASE_PATH,
                standards_mapping=settings.CURRICULUM_STANDARDS
            )
            await self.curriculum_expert.load_knowledge_base()
            print("✅ Curriculum expert initialized")
            
            # Initialize health checker
            self.health_checker = HealthChecker(
                components={
                    'model_manager': self.model_manager,
                    'cache_layer': self.cache_layer,
                    'curriculum_expert': self.curriculum_expert
                }
            )
            print("✅ Health checker initialized")
            
            # Initialize metrics collector
            self.metrics_collector = MetricsCollector()
            print("✅ Metrics collector initialized")
            
            print("✅ AIVO Brain Service initialized successfully")
            
        except Exception as e:
            print(f"❌ Failed to initialize AIVO Brain Service: {str(e)}")
            await self.initialize_fallback_mode()
    
    async def initialize_fallback_mode(self):
        """Fallback initialization for partial functionality"""
        print("⚠️ Initializing in fallback mode with reduced functionality")
        
        try:
            # In cloud mode, use cloud model manager for fallback
            if not settings.USE_LOCAL_MODELS:
                self.model_manager = CloudModelManager(
                    ai_provider=settings.AI_PROVIDER,
                    primary_model="gpt-3.5-turbo",  # Cheaper fallback
                    fallback_models=[],
                    openai_api_key=settings.OPENAI_API_KEY,
                    anthropic_api_key=settings.ANTHROPIC_API_KEY,
                    google_api_key=settings.GOOGLE_API_KEY
                )
            else:
                # Initialize only critical components for local mode
                if ModelManager is None:
                    raise Exception("ModelManager not available in cloud mode")
                self.model_manager = ModelManager(
                    primary_model="microsoft/phi-2",
                    fallback_models=[],
                    device_map="cpu",
                    optimization_level="low"
                )
            
            await self.model_manager.load_models()
            
            self.inference_engine = InferenceEngine(
                model_manager=self.model_manager,
                batch_size=1,
                max_batch_delay_ms=0
            )
            
            print("✅ Fallback mode initialized")
        except Exception as e:
            print(f"❌ Even fallback mode failed: {str(e)}")
            raise
    
    @circuit
    async def generate_response(
        self,
        request: "InferenceRequest",
        streaming: bool = False
    ) -> Dict:
        """
        Generate AI response with production safeguards
        Implements Google's defensive programming practices
        """
        start_time = time.time()
        
        try:
            # Input validation (Microsoft Security Development Lifecycle)
            validated_input = self.input_validator.validate(request)
            
            # Check cache first (Google's caching strategy)
            if not streaming:
                cache_key = self._generate_cache_key(validated_input)
                cached_response = await self.cache_layer.get(cache_key)
                
                if cached_response:
                    cache_hit_rate.set(1.0)
                    return cached_response
                
                cache_hit_rate.set(0.0)
            
            # Build context with curriculum alignment
            context = await self._build_context(validated_input)
            
            # Generate response with timeout protection
            response = await asyncio.wait_for(
                self.inference_engine.generate(
                    prompt=validated_input.prompt,
                    context=context,
                    max_tokens=validated_input.max_tokens,
                    temperature=validated_input.temperature,
                    streaming=streaming
                ),
                timeout=settings.INFERENCE_TIMEOUT_SECONDS
            )
            
            # Cache non-streaming responses
            if not streaming:
                await self.cache_layer.set(cache_key, response)
            
            # Record metrics
            inference_time = time.time() - start_time
            model_inference_time.observe(inference_time)
            
            return response
            
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Model inference timeout"
            )
        except Exception as e:
            if settings.SENTRY_DSN:
                sentry_sdk.capture_exception(e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Inference failed: {str(e)}"
            )
    
    async def _build_context(
        self,
        request: "InferenceRequest"
    ) -> Dict:
        """
        Build comprehensive context for inference
        Following Google's context-aware AI patterns
        """
        context = {
            "grade_level": request.grade_level,
            "subject": request.subject,
            "curriculum_standard": request.curriculum_standard,
            "learning_style": request.learning_style,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Add curriculum expertise
        if request.curriculum_standard and self.curriculum_expert:
            try:
                curriculum_data = (
                    await self.curriculum_expert.get_relevant_content(
                        standard=request.curriculum_standard,
                        grade=request.grade_level,
                        subject=request.subject
                    )
                )
                context["curriculum_context"] = curriculum_data
            except Exception as e:
                print(f"Warning: Could not fetch curriculum data: {e}")
        
        # Add disability accommodations if specified
        if request.disability_type:
            accommodations = self._get_accommodations(
                request.disability_type
            )
            context["accommodations"] = accommodations
        
        return context
    
    def _get_accommodations(self, disability_type: str) -> Dict:
        """Get specific accommodations based on disability type"""
        accommodations_map = {
            "adhd": {
                "response_length": "short",
                "structure": "bullet_points",
                "engagement": "high",
                "break_frequency": "every_10_min"
            },
            "autism": {
                "language": "literal",
                "structure": "predictable",
                "visual_supports": True,
                "routine": "consistent"
            },
            "dyslexia": {
                "font": "dyslexic_friendly",
                "spacing": "increased",
                "audio_support": True,
                "simplified_language": True
            },
            "anxiety": {
                "tone": "calm",
                "reassurance": True,
                "gradual_difficulty": True,
                "stress_reduction": True
            }
        }
        return accommodations_map.get(disability_type, {})
    
    def _generate_cache_key(self, request: "InferenceRequest") -> str:
        """Generate cache key using Google's cache key design"""
        key_components = [
            request.prompt[:100],
            request.grade_level,
            request.subject,
            request.curriculum_standard or "none",
            request.disability_type or "none",
            str(request.temperature),
            str(request.max_tokens)
        ]
        
        key_string = "|".join(key_components)
        hash_digest = hashlib.sha256(key_string.encode()).hexdigest()
        return f"aivo:inference:{hash_digest}"
    
    async def cleanup(self):
        """Cleanup resources on shutdown"""
        if self.cache_layer:
            await self.cache_layer.cleanup()
        if self.model_manager:
            await self.model_manager.cleanup()


# Global service instance
brain_service = AIVOBrainService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager (ASGI lifespan protocol)
    Following Microsoft's application lifecycle management
    """
    # Startup
    print("Starting AIVO Brain Service...")
    await brain_service.initialize()
    
    # Start background tasks
    if brain_service.health_checker:
        asyncio.create_task(
            brain_service.health_checker.start_health_monitoring()
        )
    if brain_service.metrics_collector:
        asyncio.create_task(
            brain_service.metrics_collector.start_collection()
        )
    
    yield
    
    # Shutdown
    print("Shutting down AIVO Brain Service...")
    await brain_service.cleanup()


# Initialize FastAPI with production configurations
app = FastAPI(
    title="AIVO Main Brain Service",
    version=settings.VERSION,
    docs_url="/docs" if settings.ENABLE_DOCS else None,
    redoc_url="/redoc" if settings.ENABLE_DOCS else None,
    lifespan=lifespan
)

# Add CORS middleware (configured for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    max_age=3600
)


# Request/Response models with validation
class InferenceRequest(BaseModel):
    """Request model with Google-style validation"""
    prompt: str = Field(..., min_length=1, max_length=4096)
    grade_level: str = Field(..., pattern=r"^(K|[1-9]|1[0-2])$")
    subject: str = Field(..., min_length=1, max_length=50)
    curriculum_standard: Optional[str] = Field(None, max_length=20)
    disability_type: Optional[str] = Field(
        None,
        pattern=r"^(adhd|autism|dyslexia|anxiety)$"
    )
    learning_style: str = Field(
        default="visual",
        pattern=r"^(visual|auditory|kinesthetic|reading)$"
    )
    max_tokens: int = Field(
        default=512,
        ge=1,
        le=settings.MAX_TOKENS_LIMIT
    )
    temperature: float = Field(default=0.7, ge=0.0, le=1.0)
    
    @validator('prompt')
    def validate_prompt(cls, v):
        """Validate prompt for safety"""
        if not v or not v.strip():
            raise ValueError("Prompt cannot be empty")
        return v.strip()


class InferenceResponse(BaseModel):
    """Response model following Google's API design guide"""
    response: str
    model_used: str
    inference_time_ms: float
    tokens_generated: int
    cache_hit: bool
    request_id: str
    timestamp: str


# API Endpoints
@app.post("/v1/generate", response_model=InferenceResponse)
async def generate(
    request: InferenceRequest,
    raw_request: Request
):
    """
    Main inference endpoint with comprehensive monitoring
    Following Google's API design guidelines
    """
    request_id = raw_request.headers.get(
        "X-Request-ID",
        str(uuid.uuid4())
    )
    
    with active_requests.track_inprogress():
        start_time = time.time()
        
        try:
            result = await brain_service.generate_response(
                request,
                streaming=False
            )
            
            duration = (time.time() - start_time) * 1000
            
            # Record metrics
            request_count.labels(
                method="POST",
                endpoint="/v1/generate",
                status="success"
            ).inc()
            request_duration.labels(
                method="POST",
                endpoint="/v1/generate"
            ).observe(duration / 1000)
            
            return InferenceResponse(
                response=result["response"],
                model_used=result["model_used"],
                inference_time_ms=duration,
                tokens_generated=result["tokens_generated"],
                cache_hit=result.get("cache_hit", False),
                request_id=request_id,
                timestamp=datetime.utcnow().isoformat()
            )
            
        except Exception as e:
            request_count.labels(
                method="POST",
                endpoint="/v1/generate",
                status="error"
            ).inc()
            raise


@app.post("/v1/generate/stream")
async def generate_stream(request: InferenceRequest):
    """
    Streaming endpoint for real-time responses
    Implements Server-Sent Events (SSE) pattern
    """
    async def event_generator():
        """Generate SSE events"""
        try:
            result = await brain_service.generate_response(
                request,
                streaming=True
            )
            
            if isinstance(result, dict) and "chunks" in result:
                for chunk in result["chunks"]:
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                    await asyncio.sleep(0)
            else:
                # Non-streaming fallback
                yield f"data: {json.dumps({'chunk': result['response']})}\n\n"
                
            yield f"data: {json.dumps({'done': True})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )


@app.get("/health")
async def health():
    """
    Health check endpoint (Kubernetes liveness probe)
    Following Google's health check standards
    """
    if not brain_service.health_checker:
        return {"healthy": False, "reason": "Health checker not initialized"}
    
    health_status = await brain_service.health_checker.check_health()
    
    if health_status["healthy"]:
        return health_status
    else:
        return Response(
            content=json.dumps(health_status),
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            media_type="application/json"
        )


@app.get("/readiness")
async def readiness():
    """
    Readiness check endpoint (Kubernetes readiness probe)
    """
    if not brain_service.health_checker:
        return Response(
            content=json.dumps({
                "ready": False,
                "reason": "Health checker not initialized"
            }),
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            media_type="application/json"
        )
    
    readiness_status = await brain_service.health_checker.check_readiness()
    
    if readiness_status["ready"]:
        return readiness_status
    else:
        return Response(
            content=json.dumps(readiness_status),
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            media_type="application/json"
        )


@app.get("/metrics")
async def metrics():
    """
    Prometheus metrics endpoint
    Following Google's monitoring practices
    """
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        workers=settings.WORKER_COUNT,
        log_level=settings.LOG_LEVEL,
        access_log=settings.ACCESS_LOG_ENABLED
    )
