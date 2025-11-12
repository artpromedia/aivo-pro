"""
Database models for IEP Assistant Service
Author: Principal Engineer (ex-Microsoft Education)
"""

import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Column, String, DateTime, Integer, Float, Text, Boolean,
    ForeignKey, Enum as SQLEnum, Date
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

Base = declarative_base()


class GoalType(str, Enum):
    """IEP goal types"""
    ACADEMIC = "academic"
    BEHAVIORAL = "behavioral"
    SOCIAL = "social"
    COMMUNICATION = "communication"
    MOTOR = "motor"
    SELF_HELP = "self_help"


class GoalStatus(str, Enum):
    """Goal status"""
    DRAFT = "draft"
    ACTIVE = "active"
    MASTERED = "mastered"
    DISCONTINUED = "discontinued"
    AMENDED = "amended"


class ProgressTrend(str, Enum):
    """Progress trend"""
    ACCELERATED = "accelerated"
    ON_TRACK = "on_track"
    SLOW = "slow"
    DECLINING = "declining"
    INSUFFICIENT_DATA = "insufficient_data"


class IEPGoal(Base):
    """IEP Goal"""
    __tablename__ = "iep_goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Goal information
    goal_text = Column(Text, nullable=False)
    goal_type = Column(SQLEnum(GoalType), nullable=False)
    area = Column(String(100), nullable=False)  # reading, math, etc
    
    # SMART components
    baseline = Column(JSONB, nullable=False)
    target = Column(JSONB, nullable=False)
    measurement_method = Column(String(500), nullable=False)
    timeline_end = Column(Date, nullable=False)
    
    # Progress tracking
    current_progress = Column(Float, nullable=True)
    trend = Column(SQLEnum(ProgressTrend), nullable=True)
    projected_outcome = Column(String(50), nullable=True)
    
    # SMART validation
    smart_validation = Column(JSONB, nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    # Status
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.DRAFT)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    data_points = relationship("IEPDataPoint", back_populates="goal")
    objectives = relationship("IEPObjective", back_populates="goal")


class IEPObjective(Base):
    """Short-term objectives/benchmarks"""
    __tablename__ = "iep_objectives"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("iep_goals.id"))
    
    # Objective info
    quarter = Column(Integer, nullable=False)
    timeline = Column(String(100), nullable=False)
    target = Column(Float, nullable=False)
    criteria = Column(String(500), nullable=False)
    status = Column(String(50), default="pending")
    
    # Relationships
    goal = relationship("IEPGoal", back_populates="objectives")


class IEPDataPoint(Base):
    """Data point for goal progress"""
    __tablename__ = "iep_data_points"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("iep_goals.id"))
    
    # Data
    date = Column(Date, nullable=False, index=True)
    value = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    
    # Metadata
    recorded_by = Column(String(200), nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    goal = relationship("IEPGoal", back_populates="data_points")


class IEPDocument(Base):
    """IEP document"""
    __tablename__ = "iep_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Document info
    document_type = Column(String(50), nullable=False)
    content = Column(JSONB, nullable=False)
    
    # Status
    status = Column(String(50), default="draft")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    finalized_at = Column(DateTime, nullable=True)


class IEPMeeting(Base):
    """IEP meeting record"""
    __tablename__ = "iep_meetings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Meeting info
    meeting_type = Column(String(50), nullable=False)
    meeting_date = Column(Date, nullable=False)
    attendees = Column(JSONB, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)


class IEPAmendment(Base):
    """Goal amendment"""
    __tablename__ = "iep_amendments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("iep_goals.id"))
    
    # Amendment info
    amendment_type = Column(String(50), nullable=False)
    original_text = Column(Text, nullable=False)
    amended_text = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)


class IEPAccommodation(Base):
    """Accommodation"""
    __tablename__ = "iep_accommodations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Accommodation info
    accommodation_text = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False)
    
    # Status
    active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)


class IEPService(Base):
    """Special education service"""
    __tablename__ = "iep_services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Service info
    service_type = Column(String(200), nullable=False)
    frequency = Column(String(100), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    location = Column(String(200), nullable=False)
    
    # Timestamps
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)


class StudentProgress(Base):
    """Overall student progress"""
    __tablename__ = "student_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Progress data
    reporting_period = Column(String(50), nullable=False)
    progress_summary = Column(JSONB, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)


class ComplianceLog(Base):
    """FERPA/IDEA compliance log"""
    __tablename__ = "compliance_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Log info
    action = Column(String(200), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    student_id = Column(UUID(as_uuid=True), nullable=True)
    details = Column(JSONB, nullable=True)
    
    # Timestamp
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
