"""
Learning Session Service - Main Application
Production adaptive learning with Bayesian Knowledge Tracing
Author: Staff Engineer (ex-Google DeepMind Education)
"""

import asyncio
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from starlette.responses import Response

from src.db.models import (
    LearningSession, LearningTask, SkillState, ModelSuggestion,
    SessionStatus, TaskStatus, SuggestionStatus
)
from src.db.session import get_db, db_manager
from src.ml.knowledge_tracing import BayesianKnowledgeTracer, Response
from src.config import settings

# Metrics
learning_sessions_active = Gauge(
    'learning_sessions_active',
    'Active learning sessions'
)
task_completion_rate = Histogram(
    'task_completion_rate',
    'Task completion rate'
)
mastery_updates = Counter(
    'mastery_updates_total',
    'Total mastery updates'
)
suggestions_generated = Counter(
    'suggestions_generated_total',
    'Model suggestions generated'
)

# Pydantic models
class StartSessionRequest(BaseModel):
    child_id: str
    subject: str
    grade: Optional[str] = None
    duration_minutes: int = Field(default=30, ge=5, le=120)


class SubmitResponseRequest(BaseModel):
    task_id: str
    response: Any
    time_spent: float = Field(ge=0)
    hint_used: bool = False
    confidence: Optional[float] = Field(None, ge=0, le=1)


class ReviewSuggestionRequest(BaseModel):
    decision: str = Field(pattern="^(accepted|rejected)$")
    notes: Optional[str] = None


# Application
app = FastAPI(
    title="Learning Session Service",
    version="1.0.0",
    description="Adaptive learning with Bayesian Knowledge Tracing"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global state
knowledge_tracer = BayesianKnowledgeTracer()
redis_client: Optional[redis.Redis] = None


@app.on_event("startup")
async def startup():
    """Initialize service"""
    global redis_client
    
    # Initialize database
    db_manager.initialize()
    
    # Initialize Redis
    redis_client = await redis.from_url(
        settings.redis_url,
        max_connections=settings.redis_max_connections
    )
    
    print(f"✅ Learning Session Service started")
    print(f"   Environment: {settings.environment}")
    print(f"   BKT p_init={settings.bkt_default_p_init}, "
          f"p_learn={settings.bkt_default_p_learn}")


@app.on_event("shutdown")
async def shutdown():
    """Cleanup"""
    if redis_client:
        await redis_client.close()
    await db_manager.close()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.service_name,
        "version": settings.service_version
    }


@app.get("/metrics")
async def metrics():
    """Prometheus metrics"""
    return Response(
        content=generate_latest(),
        media_type="text/plain"
    )


@app.post("/v1/sessions/start")
async def start_session(
    request: StartSessionRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Start new adaptive learning session
    
    Creates session, loads skill states, generates initial tasks
    """
    session_id = str(uuid.uuid4())
    
    # Load student's current skill levels
    skill_states_query = select(SkillState).where(
        SkillState.child_id == request.child_id,
        SkillState.subject == request.subject
    )
    result = await db.execute(skill_states_query)
    skill_states = result.scalars().all()
    
    initial_skill_levels = {
        state.skill: state.mastery_probability
        for state in skill_states
    }
    
    # Select target skills (zone of proximal development)
    target_skills = _select_target_skills(initial_skill_levels)
    
    # Generate initial tasks
    tasks = _generate_initial_tasks(
        subject=request.subject,
        grade=request.grade,
        target_skills=target_skills,
        duration_minutes=request.duration_minutes
    )
    
    # Create session
    session = LearningSession(
        id=session_id,
        child_id=request.child_id,
        subject=request.subject,
        grade=request.grade,
        started_at=datetime.utcnow(),
        planned_duration=request.duration_minutes,
        status=SessionStatus.ACTIVE,
        initial_skill_levels=initial_skill_levels,
        target_skills=target_skills
    )
    
    db.add(session)
    
    # Create task records
    for idx, task_data in enumerate(tasks):
        task = LearningTask(
            id=str(uuid.uuid4()),
            session_id=session_id,
            sequence_number=idx + 1,
            skill=task_data["skill"],
            difficulty=task_data["difficulty"],
            content=task_data["content"],
            task_type=task_data["type"],
            estimated_time=task_data["estimated_time"]
        )
        db.add(task)
    
    await db.commit()
    
    # Store session state in Redis
    session_state = {
        "session_id": session_id,
        "child_id": request.child_id,
        "subject": request.subject,
        "current_task": 0,
        "tasks": tasks,
        "responses": [],
        "skill_updates": {},
        "start_time": datetime.utcnow().isoformat()
    }
    
    await redis_client.setex(
        f"learning_session:{session_id}",
        settings.session_timeout_minutes * 60,
        json.dumps(session_state, default=str)
    )
    
    learning_sessions_active.inc()
    
    return {
        "session_id": session_id,
        "status": "created",
        "total_tasks": len(tasks),
        "estimated_duration": request.duration_minutes,
        "first_task": _format_task(tasks[0]) if tasks else None
    }


@app.post("/v1/sessions/{session_id}/submit")
async def submit_response(
    session_id: str,
    request: SubmitResponseRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Submit task response and get next task
    
    Uses BKT to update knowledge state and adapts difficulty
    """
    # Get session state
    session_json = await redis_client.get(f"learning_session:{session_id}")
    if not session_json:
        raise HTTPException(404, "Session not found or expired")
    
    session_state = json.loads(session_json)
    current_idx = session_state["current_task"]
    
    if current_idx >= len(session_state["tasks"]):
        raise HTTPException(400, "No more tasks in session")
    
    current_task = session_state["tasks"][current_idx]
    
    # Evaluate response
    evaluation = _evaluate_response(
        task=current_task,
        response=request.response,
        time_spent=request.time_spent
    )
    
    # Update knowledge using BKT
    bkt_response = Response(
        correct=evaluation["correct"],
        time_spent=request.time_spent,
        attempt_number=1,
        timestamp=datetime.utcnow(),
        hint_used=request.hint_used,
        confidence=request.confidence
    )
    
    prior_mastery, posterior_mastery = knowledge_tracer.update_knowledge(
        student_id=session_state["child_id"],
        skill=current_task["skill"],
        response=bkt_response
    )
    
    # Record response
    response_data = {
        "task_id": request.task_id,
        "response": request.response,
        "correct": evaluation["correct"],
        "score": evaluation["score"],
        "time_spent": request.time_spent,
        "prior_mastery": prior_mastery,
        "posterior_mastery": posterior_mastery,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    session_state["responses"].append(response_data)
    session_state["skill_updates"][current_task["skill"]] = posterior_mastery
    
    # Update database
    task_query = select(LearningTask).where(
        LearningTask.id == request.task_id
    )
    result = await db.execute(task_query)
    task_db = result.scalar_one_or_none()
    
    if task_db:
        task_db.response = request.response
        task_db.correct = evaluation["correct"]
        task_db.score = evaluation["score"]
        task_db.time_spent = request.time_spent
        task_db.prior_mastery = prior_mastery
        task_db.posterior_mastery = posterior_mastery
        task_db.submitted_at = datetime.utcnow()
        task_db.status = TaskStatus.COMPLETED
    
    # Determine next action
    next_action = _determine_next_action(
        session_state, posterior_mastery, evaluation
    )
    
    result = {}
    
    if next_action["type"] == "continue":
        session_state["current_task"] += 1
        
        if session_state["current_task"] < len(session_state["tasks"]):
            next_task = session_state["tasks"][session_state["current_task"]]
            result = {
                "status": "continue",
                "next_task": _format_task(next_task),
                "progress": {
                    "completed": session_state["current_task"],
                    "total": len(session_state["tasks"]),
                    "mastery_delta": round(posterior_mastery - prior_mastery, 3)
                }
            }
        else:
            result = await _complete_session(session_state, db)
    
    elif next_action["type"] == "scaffold":
        scaffold_task = _generate_scaffold_task(
            current_task["skill"],
            current_task["difficulty"]
        )
        session_state["tasks"].insert(current_idx + 1, scaffold_task)
        session_state["current_task"] += 1
        
        result = {
            "status": "scaffold",
            "message": "Let's try an easier problem",
            "next_task": _format_task(scaffold_task)
        }
    
    elif next_action["type"] == "challenge":
        challenge_task = _generate_challenge_task(
            current_task["skill"],
            current_task["difficulty"]
        )
        session_state["tasks"].insert(current_idx + 1, challenge_task)
        session_state["current_task"] += 1
        
        result = {
            "status": "challenge",
            "message": "Great job! Here's a challenge",
            "next_task": _format_task(challenge_task)
        }
    
    # Check for advancement
    if posterior_mastery >= settings.advancement_threshold:
        suggestion = await _generate_advancement_suggestion(
            session_state["child_id"],
            current_task["skill"],
            posterior_mastery,
            db
        )
        if suggestion:
            result["suggestion"] = suggestion
            suggestions_generated.inc()
    
    # Update Redis
    await redis_client.setex(
        f"learning_session:{session_id}",
        settings.session_timeout_minutes * 60,
        json.dumps(session_state, default=str)
    )
    
    await db.commit()
    
    mastery_updates.inc()
    task_completion_rate.observe(evaluation["score"])
    
    return result


@app.get("/v1/sessions/{session_id}")
async def get_session(
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get session details"""
    session_query = select(LearningSession).where(
        LearningSession.id == session_id
    )
    result = await db.execute(session_query)
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(404, "Session not found")
    
    return session


@app.get("/v1/suggestions/{child_id}")
async def get_suggestions(
    child_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get pending suggestions"""
    suggestions_query = select(ModelSuggestion).where(
        ModelSuggestion.child_id == child_id,
        ModelSuggestion.status == SuggestionStatus.PENDING
    ).order_by(ModelSuggestion.created_at.desc()).limit(10)
    
    result = await db.execute(suggestions_query)
    suggestions = result.scalars().all()
    
    return suggestions


@app.post("/v1/suggestions/{suggestion_id}/review")
async def review_suggestion(
    suggestion_id: str,
    request: ReviewSuggestionRequest,
    db: AsyncSession = Depends(get_db)
):
    """Review advancement suggestion"""
    suggestion_query = select(ModelSuggestion).where(
        ModelSuggestion.id == suggestion_id
    )
    result = await db.execute(suggestion_query)
    suggestion = result.scalar_one_or_none()
    
    if not suggestion:
        raise HTTPException(404, "Suggestion not found")
    
    suggestion.status = (
        SuggestionStatus.ACCEPTED if request.decision == "accepted"
        else SuggestionStatus.REJECTED
    )
    suggestion.reviewed_at = datetime.utcnow()
    suggestion.reviewer_notes = request.notes
    
    await db.commit()
    
    return {"status": "reviewed", "decision": request.decision}


# Helper functions
def _select_target_skills(skill_levels: Dict[str, float]) -> List[str]:
    """Select skills in zone of proximal development"""
    zpd_skills = []
    
    for skill, mastery in skill_levels.items():
        if 0.3 <= mastery <= 0.8:  # ZPD range
            zpd_skills.append(skill)
    
    return zpd_skills[:5] if zpd_skills else list(skill_levels.keys())[:5]


def _generate_initial_tasks(
    subject: str,
    grade: Optional[str],
    target_skills: List[str],
    duration_minutes: int
) -> List[Dict]:
    """Generate initial task sequence"""
    tasks = []
    num_tasks = min(duration_minutes // 2, 20)  # ~2 min per task
    
    for i in range(num_tasks):
        skill = target_skills[i % len(target_skills)] if target_skills else "general"
        
        tasks.append({
            "skill": skill,
            "difficulty": 0.5,
            "type": "problem",
            "estimated_time": 120,
            "content": _generate_task_content(subject, skill, 0.5)
        })
    
    return tasks


def _generate_task_content(
    subject: str,
    skill: str,
    difficulty: float
) -> Dict:
    """Generate task content (simplified)"""
    # In production, this would call content generation service
    if subject == "math" and skill == "addition":
        a = int(5 + difficulty * 95)
        b = int(5 + difficulty * 95)
        return {
            "question": f"What is {a} + {b}?",
            "answer": a + b,
            "type": "numeric"
        }
    
    return {
        "question": f"Sample {skill} question",
        "answer": "42",
        "type": "text"
    }


def _evaluate_response(
    task: Dict,
    response: Any,
    time_spent: float
) -> Dict:
    """Evaluate student response"""
    correct_answer = task["content"].get("answer")
    correct = str(response).strip().lower() == str(correct_answer).lower()
    
    return {
        "correct": correct,
        "score": 1.0 if correct else 0.0
    }


def _format_task(task: Dict) -> Dict:
    """Format task for frontend"""
    return {
        "skill": task["skill"],
        "difficulty": task["difficulty"],
        "content": task["content"],
        "estimated_time": task["estimated_time"]
    }


def _determine_next_action(
    session_state: Dict,
    current_mastery: float,
    performance: Dict
) -> Dict:
    """Determine next learning action"""
    if not performance["correct"]:
        if current_mastery < settings.struggling_threshold:
            return {"type": "scaffold", "reason": "struggling"}
    elif current_mastery >= settings.mastery_threshold:
        if session_state["responses"][-3:].count({"correct": True}) >= 2:
            return {"type": "challenge", "reason": "mastery"}
    
    return {"type": "continue", "reason": "progressing"}


def _generate_scaffold_task(skill: str, difficulty: float) -> Dict:
    """Generate easier task"""
    return {
        "skill": skill,
        "difficulty": max(0.1, difficulty - 0.2),
        "type": "scaffold",
        "estimated_time": 90,
        "content": _generate_task_content("math", skill, max(0.1, difficulty - 0.2))
    }


def _generate_challenge_task(skill: str, difficulty: float) -> Dict:
    """Generate harder task"""
    return {
        "skill": skill,
        "difficulty": min(1.0, difficulty + 0.2),
        "type": "challenge",
        "estimated_time": 180,
        "content": _generate_task_content("math", skill, min(1.0, difficulty + 0.2))
    }


async def _generate_advancement_suggestion(
    child_id: str,
    skill: str,
    mastery: float,
    db: AsyncSession
) -> Optional[Dict]:
    """Generate advancement suggestion"""
    skill_progression = {
        "addition": "multiplication",
        "multiplication": "division"
    }
    
    next_skill = skill_progression.get(skill)
    if not next_skill:
        return None
    
    suggestion = ModelSuggestion(
        id=str(uuid.uuid4()),
        child_id=child_id,
        suggestion_type="advance_skill",
        current_skill=skill,
        current_mastery=mastery,
        suggested_skill=next_skill,
        confidence=0.85,
        reasoning=f"Achieved {round(mastery * 100)}% mastery",
        created_at=datetime.utcnow(),
        status=SuggestionStatus.PENDING
    )
    
    db.add(suggestion)
    
    return {
        "type": "advancement",
        "message": f"Ready to advance from {skill} to {next_skill}!",
        "suggestion_id": suggestion.id
    }


async def _complete_session(session_state: Dict, db: AsyncSession) -> Dict:
    """Complete learning session"""
    session_id = session_state["session_id"]
    
    total_correct = sum(1 for r in session_state["responses"] if r["correct"])
    total_attempted = len(session_state["responses"])
    accuracy = total_correct / total_attempted if total_attempted > 0 else 0
    
    # Update session
    session_query = select(LearningSession).where(
        LearningSession.id == session_id
    )
    result = await db.execute(session_query)
    session = result.scalar_one()
    
    session.completed_at = datetime.utcnow()
    session.status = SessionStatus.COMPLETED
    session.total_tasks = total_attempted
    session.correct_tasks = total_correct
    session.accuracy = accuracy
    session.final_skill_levels = session_state["skill_updates"]
    
    await redis_client.delete(f"learning_session:{session_id}")
    learning_sessions_active.dec()
    
    return {
        "status": "completed",
        "session_id": session_id,
        "results": {
            "total_tasks": total_attempted,
            "correct": total_correct,
            "accuracy": round(accuracy * 100, 1)
        }
    }
