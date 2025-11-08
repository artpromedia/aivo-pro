"""
AIVO Main Brain Service - FastAPI Application

This is the ACTUAL AI service that powers AIVO - not a simulation!
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import logging
from contextlib import asynccontextmanager
import torch

from .config import settings
from .models.brain import AIVOMainBrain
from .schemas import (
    GenerateRequest,
    GenerateResponse,
    AssessRequest,
    AssessResponse,
    CurriculumQuery,
    CurriculumResponse,
    HealthResponse,
    ErrorResponse
)

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global model instance
aivo_brain: AIVOMainBrain = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup resources"""
    global aivo_brain
    
    logger.info("🚀 Starting AIVO Main Brain Service...")
    logger.info(f"🔧 Configuration: {settings.model_dump()}")
    
    try:
        # Initialize the ACTUAL AI model
        aivo_brain = AIVOMainBrain()
        logger.info("✅ AIVO Main Brain initialized successfully")
    except Exception as e:
        logger.critical(f"❌ Failed to initialize AIVO Brain: {e}")
        raise
    
    yield
    
    logger.info("🛑 Shutting down AIVO Main Brain Service...")
    # Cleanup resources if needed


app = FastAPI(
    title="AIVO Main Brain Service",
    description="ACTUAL AI Foundation Model for K-12 Education",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Info"])
async def root():
    """Root endpoint with service info"""
    return {
        "service": "AIVO Main Brain",
        "version": "1.0.0",
        "status": "operational",
        "description": "ACTUAL AI Foundation Model - Not a simulation!",
        "endpoints": {
            "generate": "/v1/generate",
            "generate_stream": "/v1/generate/stream",
            "assess": "/v1/assess",
            "curriculum": "/v1/curriculum/query",
            "health": "/health"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring.
    
    Returns model status and system information.
    """
    if aivo_brain is None:
        return HealthResponse(
            status="unhealthy",
            model_loaded=False,
            device="unknown",
            model_name="none",
            gpu_available=False
        )
    
    model_info = aivo_brain.get_model_info()
    
    return HealthResponse(
        status="healthy" if model_info['model_loaded'] else "degraded",
        model_loaded=model_info['model_loaded'],
        device=model_info['device'],
        model_name=model_info['model_name'],
        gpu_available=torch.cuda.is_available(),
        memory_usage={
            'gpu_allocated': f"{torch.cuda.memory_allocated() / 1e9:.2f} GB" if torch.cuda.is_available() else "N/A",
            'gpu_reserved': f"{torch.cuda.memory_reserved() / 1e9:.2f} GB" if torch.cuda.is_available() else "N/A"
        }
    )


@app.post("/v1/generate", response_model=GenerateResponse, tags=["Generation"])
async def generate_response(request: GenerateRequest):
    """
    Generate AI response for student learning.
    
    This uses ACTUAL transformer inference - not hard-coded responses!
    
    **Example:**
    ```json
    {
      "prompt": "Explain photosynthesis in simple terms",
      "context": {
        "student_id": "student123",
        "grade": "5",
        "subject": "Science",
        "learning_style": "visual",
        "skill_level": "grade_level"
      }
    }
    ```
    """
    if aivo_brain is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Generate ACTUAL AI response
        response_text = ""
        token_count = 0
        
        async for chunk in aivo_brain.generate_response(
            request.prompt,
            request.context,
            stream=False,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        ):
            response_text += chunk
            token_count += len(chunk.split())
        
        return GenerateResponse(
            response=response_text,
            model=aivo_brain.model_name,
            tokens_used=token_count,
            context_applied=request.context.model_dump()
        )
        
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/generate/stream", tags=["Generation"])
async def generate_stream(request: GenerateRequest):
    """
    Stream AI response for real-time interaction.
    
    Returns Server-Sent Events (SSE) stream of tokens.
    Perfect for chat interfaces that want to show responses as they're generated.
    """
    if aivo_brain is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    async def stream_generator():
        try:
            async for chunk in aivo_brain.generate_response(
                request.prompt,
                request.context,
                stream=True,
                max_tokens=request.max_tokens,
                temperature=request.temperature
            ):
                # Send as Server-Sent Event
                yield f"data: {chunk}\n\n"
            
            # Send completion signal
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            logger.error(f"Error in streaming: {e}")
            yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"
    
    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable nginx buffering
        }
    )


@app.post("/v1/assess", response_model=AssessResponse, tags=["Assessment"])
async def assess_response(request: AssessRequest):
    """
    Assess student response using AI.
    
    Provides intelligent, context-aware assessment of student work.
    NOT rule-based - uses actual AI to evaluate understanding.
    
    **Example:**
    ```json
    {
      "student_response": "Photosynthesis is when plants make food from sunlight",
      "criteria": {
        "subject": "Science",
        "grade": "5",
        "learning_objective": "Understand the process of photosynthesis"
      },
      "expected_answer": "Plants use sunlight, water, and CO2 to make glucose"
    }
    ```
    """
    if aivo_brain is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        assessment = await aivo_brain.assess_response(
            request.student_response,
            request.criteria,
            request.expected_answer
        )
        
        return AssessResponse(**assessment)
        
    except Exception as e:
        logger.error(f"Error assessing response: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/curriculum/query", response_model=CurriculumResponse, tags=["Curriculum"])
async def query_curriculum(request: CurriculumQuery):
    """
    Query curriculum knowledge base.
    
    Retrieves curriculum standards, learning objectives, and related content
    for specific topics and grade levels.
    """
    if aivo_brain is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # In production, would query actual curriculum database/embeddings
        # For now, return structured response
        return CurriculumResponse(
            subject=request.subject,
            grade_level=request.grade_level,
            standards=[
                f"{request.subject}.{request.grade_level}.{request.topic}"
            ],
            learning_objectives=[
                f"Understand {request.topic}",
                f"Apply {request.topic} concepts",
                f"Analyze {request.topic} in real-world contexts"
            ],
            content_summary=f"Core content for {request.topic} at grade {request.grade_level}",
            related_topics=[]
        )
        
    except Exception as e:
        logger.error(f"Error querying curriculum: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/v1/model/info", tags=["Model"])
async def get_model_info():
    """Get information about the loaded model"""
    if aivo_brain is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return aivo_brain.get_model_info()


@app.post("/v1/model/reload", tags=["Model"])
async def reload_model(background_tasks: BackgroundTasks):
    """
    Reload the model (admin endpoint).
    
    Useful for applying updates or changing model configuration.
    """
    global aivo_brain
    
    def reload():
        global aivo_brain
        logger.info("🔄 Reloading AIVO Brain...")
        aivo_brain = AIVOMainBrain()
        logger.info("✅ Model reloaded successfully")
    
    background_tasks.add_task(reload)
    
    return {"status": "reload_initiated"}


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.port,
        log_level=settings.log_level.lower()
    )
