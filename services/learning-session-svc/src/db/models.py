"""
Database models for Learning Session Service
Author: Staff Engineer (ex-Google DeepMind Education)
"""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Index, Text, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum

Base = declarative_base()


class SessionStatus(str, enum.Enum):
    """Learning session status"""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class TaskStatus(str, enum.Enum):
    """Learning task status"""
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    SKIPPED = "skipped"


class SuggestionStatus(str, enum.Enum):
    """Model suggestion status"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class LearningSession(Base):
    """Learning session with adaptive content"""
    __tablename__ = "learning_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    child_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    subject = Column(String(100), nullable=False)
    grade = Column(String(20))
    
    # Session metadata
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at = Column(DateTime)
    planned_duration = Column(Integer)  # Minutes
    actual_duration = Column(Integer)  # Seconds
    status = Column(SQLEnum(SessionStatus), nullable=False, 
                   default=SessionStatus.ACTIVE)
    
    # Skill tracking
    initial_skill_levels = Column(JSONB)  # {skill: mastery_level}
    final_skill_levels = Column(JSONB)
    target_skills = Column(JSONB)  # List of skills to practice
    skill_improvements = Column(JSONB)  # {skill: {initial, final, improvement}}
    
    # Performance metrics
    total_tasks = Column(Integer, default=0)
    correct_tasks = Column(Integer, default=0)
    accuracy = Column(Float)
    average_response_time = Column(Float)  # Seconds
    
    # Adaptive learning metrics
    scaffolding_count = Column(Integer, default=0)
    challenge_count = Column(Integer, default=0)
    review_count = Column(Integer, default=0)
    
    # Relationships
    tasks = relationship("LearningTask", back_populates="session", 
                        cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('ix_learning_sessions_child_status', 'child_id', 'status'),
        Index('ix_learning_sessions_started', 'started_at'),
    )


class LearningTask(Base):
    """Individual learning task within a session"""
    __tablename__ = "learning_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    session_id = Column(UUID(as_uuid=True), 
                       ForeignKey('learning_sessions.id'), nullable=False)
    
    # Task metadata
    sequence_number = Column(Integer, nullable=False)
    skill = Column(String(100), nullable=False)
    difficulty = Column(Float, nullable=False)  # 0.0 to 1.0
    task_type = Column(String(50))  # problem, quiz, practice, etc.
    
    # Content
    content = Column(JSONB, nullable=False)
    estimated_time = Column(Integer)  # Seconds
    
    # Response data
    response = Column(JSONB)
    correct = Column(Boolean)
    score = Column(Float)  # 0.0 to 1.0
    time_spent = Column(Float)  # Seconds
    attempt_number = Column(Integer, default=1)
    
    # BKT tracking
    prior_mastery = Column(Float)
    posterior_mastery = Column(Float)
    
    # Metadata
    presented_at = Column(DateTime)
    submitted_at = Column(DateTime)
    status = Column(SQLEnum(TaskStatus), nullable=False, 
                   default=TaskStatus.PENDING)
    
    # Relationships
    session = relationship("LearningSession", back_populates="tasks")
    
    __table_args__ = (
        Index('ix_learning_tasks_session', 'session_id', 'sequence_number'),
        Index('ix_learning_tasks_skill', 'skill'),
    )


class SkillState(Base):
    """Student skill state tracking using BKT"""
    __tablename__ = "skill_states"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    child_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    skill = Column(String(100), nullable=False)
    subject = Column(String(100), nullable=False)
    
    # BKT parameters (personalized)
    p_init = Column(Float, nullable=False)
    p_learn = Column(Float, nullable=False)
    p_guess = Column(Float, nullable=False)
    p_slip = Column(Float, nullable=False)
    
    # Current state
    mastery_probability = Column(Float, nullable=False)  # P(knows)
    confidence = Column(Float)  # Confidence in estimate
    
    # Practice history
    total_attempts = Column(Integer, default=0)
    correct_attempts = Column(Integer, default=0)
    last_practiced = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('ix_skill_states_child_skill', 'child_id', 'skill', 
              unique=True),
        Index('ix_skill_states_mastery', 'mastery_probability'),
    )


class ModelSuggestion(Base):
    """ML model suggestions for advancement/intervention"""
    __tablename__ = "model_suggestions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    child_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Suggestion details
    suggestion_type = Column(String(50), nullable=False)
    # Types: advance_skill, advance_grade, review_prerequisite, 
    #        change_difficulty, intervention
    
    current_skill = Column(String(100))
    current_mastery = Column(Float)
    suggested_skill = Column(String(100))
    suggested_action = Column(Text)
    
    # Confidence & reasoning
    confidence = Column(Float, nullable=False)  # 0.0 to 1.0
    reasoning = Column(Text)
    supporting_data = Column(JSONB)
    
    # Review
    status = Column(SQLEnum(SuggestionStatus), nullable=False,
                   default=SuggestionStatus.PENDING)
    reviewed_by = Column(String(100))  # teacher_id or "system"
    reviewed_at = Column(DateTime)
    reviewer_notes = Column(Text)
    
    # Metadata
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    expires_at = Column(DateTime)
    
    __table_args__ = (
        Index('ix_suggestions_child_status', 'child_id', 'status'),
        Index('ix_suggestions_created', 'created_at'),
    )


class SubjectProgress(Base):
    """Overall subject progress tracking"""
    __tablename__ = "subject_progress"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    child_id = Column(UUID(as_uuid=True), nullable=False)
    subject = Column(String(100), nullable=False)
    grade = Column(String(20))
    
    # Progress metrics
    skills_mastered = Column(Integer, default=0)
    skills_in_progress = Column(Integer, default=0)
    skills_struggling = Column(Integer, default=0)
    total_skills = Column(Integer, default=0)
    
    # Time tracking
    total_time_minutes = Column(Integer, default=0)
    sessions_completed = Column(Integer, default=0)
    
    # Performance
    overall_accuracy = Column(Float)
    average_mastery = Column(Float)
    
    # Skill breakdown
    skill_details = Column(JSONB)  # {skill: {mastery, attempts, ...}}
    
    # Metadata
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('ix_subject_progress_child', 'child_id', 'subject', 
              unique=True),
    )


class TaskContent(Base):
    """Reusable task content library"""
    __tablename__ = "task_contents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    subject = Column(String(100), nullable=False)
    skill = Column(String(100), nullable=False)
    task_type = Column(String(50), nullable=False)
    
    # Content
    content = Column(JSONB, nullable=False)
    difficulty = Column(Float, nullable=False)
    estimated_time = Column(Integer)
    
    # Metadata
    tags = Column(JSONB)  # List of tags
    prerequisites = Column(JSONB)  # Required skills
    
    # Usage tracking
    times_used = Column(Integer, default=0)
    average_score = Column(Float)
    average_time = Column(Float)
    
    # Quality metrics
    discrimination = Column(Float)  # IRT discrimination
    quality_score = Column(Float)
    
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('ix_task_contents_skill', 'skill', 'difficulty'),
        Index('ix_task_contents_subject', 'subject'),
    )


class ModelUpdate(Base):
    """Track BKT parameter updates and model improvements"""
    __tablename__ = "model_updates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    child_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    skill = Column(String(100), nullable=False)
    
    # Parameter updates
    old_parameters = Column(JSONB, nullable=False)
    new_parameters = Column(JSONB, nullable=False)
    
    # Performance metrics
    fit_improvement = Column(Float)  # Log-likelihood improvement
    prediction_accuracy = Column(Float)
    
    # Training data
    training_samples = Column(Integer)
    date_range = Column(JSONB)  # {start, end}
    
    # Metadata
    update_reason = Column(String(100))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    __table_args__ = (
        Index('ix_model_updates_child_skill', 'child_id', 'skill'),
        Index('ix_model_updates_created', 'created_at'),
    )
