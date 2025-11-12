"""Database models for District Detection & Analytics Service"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

Base = declarative_base()


class District(Base):
    """School district information"""
    __tablename__ = "districts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nces_id = Column(String(20), unique=True, index=True)
    name = Column(String(200))
    state = Column(String(2))
    enrollment = Column(Integer, nullable=True)
    schools_count = Column(Integer, nullable=True)
    demographics = Column(JSON)
    socioeconomic = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DistrictBoundary(Base):
    """District geographic boundaries"""
    __tablename__ = "district_boundaries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    district_id = Column(String(100), index=True)
    geometry = Column(JSON)  # GeoJSON
    created_at = Column(DateTime, default=datetime.utcnow)


class School(Base):
    """School information"""
    __tablename__ = "schools"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nces_id = Column(String(20), unique=True, index=True)
    district_id = Column(String(100), index=True)
    name = Column(String(200))
    school_type = Column(String(50))
    grades = Column(String(50))
    enrollment = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LearningMetric(Base):
    """Learning performance metrics"""
    __tablename__ = "learning_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50))  # student, class, school, district
    entity_id = Column(String(100), index=True)
    metric_type = Column(String(50))
    metric_value = Column(Float)
    subject = Column(String(50), nullable=True)
    grade_level = Column(String(20), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class EngagementMetric(Base):
    """Engagement metrics"""
    __tablename__ = "engagement_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50))
    entity_id = Column(String(100), index=True)
    metric_type = Column(String(50))
    metric_value = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class OutcomeMetric(Base):
    """Outcome predictions and actuals"""
    __tablename__ = "outcome_metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50))
    entity_id = Column(String(100), index=True)
    outcome_type = Column(String(50))
    predicted_value = Column(Float, nullable=True)
    actual_value = Column(Float, nullable=True)
    confidence = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class AnalyticsReport(Base):
    """Generated analytics reports"""
    __tablename__ = "analytics_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50))
    entity_id = Column(String(100), index=True)
    report_type = Column(String(50))
    date_range = Column(JSON)
    metrics = Column(JSON)
    insights = Column(JSON)
    benchmarks = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    visualizations = Column(JSON, nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow, index=True)
    generation_time_seconds = Column(Float)


class Benchmark(Base):
    """Benchmark data for comparison"""
    __tablename__ = "benchmarks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50))
    level = Column(String(20))  # national, state, district
    metric_name = Column(String(100))
    value = Column(Float)
    percentiles = Column(JSON)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DataExport(Base):
    """Data export jobs"""
    __tablename__ = "data_exports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    export_type = Column(String(50))
    entity_type = Column(String(50))
    entity_id = Column(String(100))
    format = Column(String(20))  # csv, xlsx, json
    status = Column(String(20))  # pending, processing, completed, failed
    file_path = Column(String(500), nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
