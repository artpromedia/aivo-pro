"""
Homework Helper Service - Main Application
AI-powered homework assistance with Socratic tutoring
Author: Staff Engineer (ex-Google AI for Education)
"""

import uuid
import json
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis.asyncio as redis

# Metrics
from prometheus_client import Counter, Histogram, Gauge, make_asgi_app

from src.config import settings

# Metrics
homework_uploads = Counter('homework_uploads_total', 'Total homework uploads')
ocr_success_rate = Histogram('ocr_success_rate', 'OCR success rate')
tutoring_sessions = Gauge('active_tutoring_sessions', 'Active tutoring sessions')
math_problems_solved = Counter('math_problems_solved_total', 'Math problems solved')

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    problem_number: Optional[int] = None

class OCRResult(BaseModel):
    session_id: str
    status: str
    problems_found: int
    problems: List[Dict]

# FastAPI app
app = FastAPI(
    title="Homework Helper Service",
    version=settings.SERVICE_VERSION,
    description="AI-powered homework assistance with Socratic tutoring"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Global state
redis_client: Optional[redis.Redis] = None


@app.on_event("startup")
async def startup():
    """Initialize service"""
    global redis_client
    redis_client = await redis.from_url(settings.REDIS_URL)
    print(f"✅ {settings.SERVICE_NAME} v{settings.SERVICE_VERSION} started")
    print(f"📊 Port: {settings.PORT}")
    print(f"🔧 OCR enabled: {settings.HANDWRITING_DETECTION}")
    print(f"🤖 Socratic tutoring enabled: {settings.ENABLE_METACOGNITIVE_PROMPTS}")


@app.on_event("shutdown")
async def shutdown():
    """Cleanup"""
    global redis_client
    if redis_client:
        await redis_client.close()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION
    }


@app.post("/v1/homework/upload", response_model=OCRResult)
async def upload_homework(
    file: UploadFile = File(...),
    child_id: str = Form(...),
    subject: str = Form(...),
    grade: str = Form(...)
):
    """
    Upload homework for AI assistance

    Process document with OCR, extract problems, and prepare for tutoring
    """
    # Validate file
    file_ext = file.filename.split('.')[-1].lower()
    if file_ext not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(400, f"Unsupported file type: {file_ext}")

    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(400, f"File too large: {file_size_mb:.1f}MB (max {settings.MAX_FILE_SIZE_MB}MB)")

    homework_uploads.inc()

    session_id = str(uuid.uuid4())

    # Simulate OCR processing (full implementation would use actual OCR)
    ocr_result = {
        "text": "Sample homework text",
        "confidence": 0.95,
        "math_expressions": [],
        "handwritten": [],
        "diagrams": []
    }

    # Extract problems
    problems = [
        {
            "number": 1,
            "text": "Solve for x: 2x + 5 = 13",
            "type": "equation",
            "math_expressions": [
                {
                    "text": "2x + 5 = 13",
                    "latex": "2x + 5 = 13",
                    "type": "equation"
                }
            ],
            "concepts": ["linear_equations", "algebra"],
            "difficulty": "medium"
        }
    ]

    # Store in Redis
    session_data = {
        "session_id": session_id,
        "child_id": child_id,
        "subject": subject,
        "grade": grade,
        "document_name": file.filename,
        "ocr_result": ocr_result,
        "problems": problems,
        "current_problem": 0,
        "hint_level": 0,
        "messages": [],
        "created_at": datetime.utcnow().isoformat()
    }

    await redis_client.setex(
        f"homework_session:{session_id}",
        settings.SESSION_TIMEOUT_MINUTES * 60,
        json.dumps(session_data, default=str)
    )

    tutoring_sessions.inc()
    ocr_success_rate.observe(1.0)

    return {
        "session_id": session_id,
        "status": "processed",
        "problems_found": len(problems),
        "problems": problems
    }


@app.post("/v1/homework/{session_id}/chat")
async def chat_about_homework(
    session_id: str,
    request: ChatRequest
):
    """
    Chat with AI tutor about homework

    Provides Socratic guidance without giving direct answers
    """
    # Get session
    session_json = await redis_client.get(f"homework_session:{session_id}")
    if not session_json:
        raise HTTPException(404, "Session not found or expired")

    session_data = json.loads(session_json)

    # Get current problem
    if request.problem_number is not None:
        session_data["current_problem"] = request.problem_number - 1

    current_problem = session_data["problems"][session_data["current_problem"]] if session_data["problems"] else None

    # Add user message
    user_message = {
        "role": "user",
        "content": request.message,
        "timestamp": datetime.utcnow().isoformat()
    }
    session_data["messages"].append(user_message)

    # Generate Socratic response (simplified version)
    if current_problem and current_problem["type"] == "equation":
        if "solve" in request.message.lower() or "answer" in request.message.lower():
            response_text = (
                "I can't give you the answer directly, but let's work through it together! "
                "What is the equation asking you to find? "
                "What operations do you see?"
            )
            guidance_type = "guided_discovery"
        elif any(word in request.message.lower() for word in ["stuck", "help", "don't know"]):
            session_data["hint_level"] = min(session_data["hint_level"] + 1, settings.MAX_HINT_LEVEL)

            hints = {
                1: "Let's start by looking at what the equation is asking. What variable are we solving for?",
                2: "What operation is being done to x? How can we undo that operation?",
                3: "💡 Hint: Try isolating x on one side of the equation.",
                4: "💡 Hint: First, we need to get rid of the + 5. What's the opposite of adding 5?",
                5: "💡 Hint: If we subtract 5 from both sides, we get 2x = 8. What should we do next?",
                6: "💡 Here's the first step: 2x + 5 - 5 = 13 - 5, which simplifies to 2x = 8"
            }

            response_text = hints.get(session_data["hint_level"], hints[1])
            guidance_type = "scaffolding"
        else:
            # Check if student provided an attempt
            response_text = (
                "That's a good start! Let me ask you: "
                "How did you decide to approach it that way? "
                "Walk me through your thinking."
            )
            guidance_type = "metacognitive"
    else:
        response_text = (
            "Great question! Let's think about this together. "
            "What information is given in the problem? "
            "What are we trying to find?"
        )
        guidance_type = "guided_discovery"

    # Add assistant message
    assistant_message = {
        "role": "assistant",
        "content": response_text,
        "guidance_type": guidance_type,
        "timestamp": datetime.utcnow().isoformat()
    }
    session_data["messages"].append(assistant_message)

    # Update session in Redis
    await redis_client.setex(
        f"homework_session:{session_id}",
        settings.SESSION_TIMEOUT_MINUTES * 60,
        json.dumps(session_data, default=str)
    )

    return {
        "response": response_text,
        "guidance_type": guidance_type,
        "current_problem": session_data["current_problem"] + 1,
        "hint_level": session_data["hint_level"],
        "show_writing_pad": current_problem and "equation" in current_problem.get("type", "")
    }


@app.get("/v1/homework/{session_id}/history")
async def get_chat_history(session_id: str):
    """Get conversation history"""
    session_json = await redis_client.get(f"homework_session:{session_id}")
    if not session_json:
        raise HTTPException(404, "Session not found")

    session_data = json.loads(session_json)
    return {"messages": session_data.get("messages", [])}


@app.websocket("/v1/homework/{session_id}/writing-pad")
async def writing_pad_websocket(websocket: WebSocket, session_id: str):
    """WebSocket for real-time writing pad"""
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()

            # Process stroke (simplified - real implementation would use handwriting recognition)
            if data.get("stroke_complete"):
                result = {
                    "recognized": True,
                    "latex": "x = 4",
                    "preview": "x = 4"
                }
            else:
                result = {"recognized": False}

            await websocket.send_json(result)

    except WebSocketDisconnect:
        tutoring_sessions.dec()


@app.get("/v1/homework/{session_id}/progress")
async def get_session_progress(session_id: str):
    """Get session progress and analytics"""
    session_json = await redis_client.get(f"homework_session:{session_id}")
    if not session_json:
        raise HTTPException(404, "Session not found")

    session_data = json.loads(session_json)

    total_problems = len(session_data.get("problems", []))
    total_messages = len(session_data.get("messages", []))

    return {
        "session_id": session_id,
        "total_problems": total_problems,
        "current_problem": session_data.get("current_problem", 0) + 1,
        "total_messages": total_messages,
        "hint_level": session_data.get("hint_level", 0),
        "created_at": session_data.get("created_at"),
        "subject": session_data.get("subject"),
        "grade": session_data.get("grade")
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)
