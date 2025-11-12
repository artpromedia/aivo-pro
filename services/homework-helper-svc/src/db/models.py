"""
Database models for Homework Helper Service
Author: Staff Engineer (ex-Google AI for Education)
"""

import uuid
from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum

from sqlalchemy import (
    Column, String, DateTime, Integer, Float, Text, JSON,
    Boolean, ForeignKey, Enum as SQLEnum, ARRAY, LargeBinary
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

Base = declarative_base()


class SubjectType(str, Enum):
    """Subject types"""
    MATH = "math"
    SCIENCE = "science"
    ENGLISH = "english"
    HISTORY = "history"
    LANGUAGE = "language"
    OTHER = "other"


class SessionStatus(str, Enum):
    """Homework session status"""
    PROCESSING = "processing"
    READY = "ready"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ERROR = "error"


class ProblemType(str, Enum):
    """Problem types"""
    EQUATION = "equation"
    WORD_PROBLEM = "word_problem"
    PROOF = "proof"
    GRAPH = "graph"
    TEXT_ANALYSIS = "text_analysis"
    GENERAL = "general"


class HomeworkSession(Base):
    """Homework help session"""
    __tablename__ = "homework_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    child_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Document info
    document_name = Column(String(255), nullable=False)
    document_type = Column(String(50), nullable=False)
    subject = Column(SQLEnum(SubjectType), nullable=False)
    grade = Column(String(20), nullable=False)
    
    # OCR results
    ocr_result = Column(JSONB, nullable=True)
    ocr_confidence = Column(Float, nullable=True)
    extracted_problems = Column(JSONB, nullable=True)
    
    # Session state
    status = Column(SQLEnum(SessionStatus), default=SessionStatus.PROCESSING)
    current_problem_index = Column(Integer, default=0)
    hint_level = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    document = relationship("HomeworkDocument", back_populates="session", uselist=False)
    messages = relationship("ChatMessage", back_populates="session", order_by="ChatMessage.timestamp")
    writing_sessions = relationship("WritingPadSession", back_populates="session")


class HomeworkDocument(Base):
    """Uploaded homework document"""
    __tablename__ = "homework_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("homework_sessions.id"), nullable=False, unique=True)
    
    # File data
    content = Column(LargeBinary, nullable=False)
    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    size = Column(Integer, nullable=False)
    
    # Storage info
    storage_path = Column(String(500), nullable=True)
    
    # Metadata
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    session = relationship("HomeworkSession", back_populates="document")


class ChatMessage(Base):
    """Chat message in tutoring conversation"""
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("homework_sessions.id"), nullable=False, index=True)
    
    # Message content
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    
    # Tutoring metadata
    guidance_type = Column(String(50), nullable=True)  # guided_discovery, scaffolding, etc.
    problem_number = Column(Integer, nullable=True)
    hint_level = Column(Integer, nullable=True)
    metadata = Column(JSONB, nullable=True)  # Full guidance object
    
    # Student interaction
    student_attempt = Column(Text, nullable=True)
    error_identified = Column(String(100), nullable=True)
    
    # Timestamps
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    session = relationship("HomeworkSession", back_populates="messages")


class WritingPadSession(Base):
    """Writing pad session for math work"""
    __tablename__ = "writing_pad_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("homework_sessions.id"), nullable=False, index=True)
    
    # Stroke data
    stroke_data = Column(JSONB, nullable=False)  # Array of points
    
    # Recognition
    recognized = Column(Boolean, default=False)
    recognized_latex = Column(Text, nullable=True)
    recognized_text = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    
    # Timestamps
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    session = relationship("HomeworkSession", back_populates="writing_sessions")


class HomeworkConcept(Base):
    """Extracted mathematical/academic concepts"""
    __tablename__ = "homework_concepts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("homework_sessions.id"), nullable=False, index=True)
    
    # Concept info
    concept_name = Column(String(200), nullable=False)
    concept_category = Column(String(100), nullable=False)  # algebra, geometry, etc.
    difficulty_level = Column(String(20), nullable=False)  # beginner, intermediate, advanced
    
    # Prerequisites
    prerequisites = Column(ARRAY(String), nullable=True)
    
    # Metadata
    identified_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class SolutionStep(Base):
    """Step-by-step solution tracking"""
    __tablename__ = "solution_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("homework_sessions.id"), nullable=False, index=True)
    problem_number = Column(Integer, nullable=False)
    
    # Step info
    step_number = Column(Integer, nullable=False)
    step_description = Column(Text, nullable=False)
    step_work = Column(Text, nullable=True)  # LaTeX or text
    
    # Validation
    is_correct = Column(Boolean, nullable=True)
    student_completed = Column(Boolean, default=False)
    
    # Guidance
    hint_given = Column(Text, nullable=True)
    common_error_warned = Column(String(200), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)


class TutoringAnalytics(Base):
    """Analytics for tutoring effectiveness"""
    __tablename__ = "tutoring_analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("homework_sessions.id"), nullable=False, index=True)
    child_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Session metrics
    total_problems = Column(Integer, nullable=False)
    problems_attempted = Column(Integer, default=0)
    problems_completed = Column(Integer, default=0)
    
    # Interaction metrics
    total_messages = Column(Integer, default=0)
    hints_requested = Column(Integer, default=0)
    average_hint_level = Column(Float, nullable=True)
    
    # Time metrics
    total_time_minutes = Column(Integer, default=0)
    time_per_problem_avg = Column(Float, nullable=True)
    
    # Learning metrics
    concepts_mastered = Column(ARRAY(String), nullable=True)
    struggles_identified = Column(ARRAY(String), nullable=True)
    
    # Socratic effectiveness
    guided_discovery_effectiveness = Column(Float, nullable=True)  # 0-1 score
    student_independence_score = Column(Float, nullable=True)  # 0-1 score
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
