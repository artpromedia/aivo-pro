"""Database models for Safety & Moderation Service"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, Enum, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
import enum

Base = declarative_base()


class ThreatLevel(str, enum.Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ViolationType(str, enum.Enum):
    PROFANITY = "profanity"
    BULLYING = "bullying"
    INAPPROPRIATE = "inappropriate"
    PII_EXPOSURE = "pii_exposure"
    COPPA_VIOLATION = "coppa_violation"
    FERPA_VIOLATION = "ferpa_violation"
    GROOMING_ATTEMPT = "grooming_attempt"
    SELF_HARM = "self_harm"


class ModerationLog(Base):
    """Log of content moderation actions"""
    __tablename__ = "moderation_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    moderation_id = Column(String(100), unique=True, index=True)
    content_type = Column(String(50))
    user_id = Column(String(100), index=True)
    result = Column(String(50))  # approved, rejected, modified
    violation_type = Column(Enum(ViolationType), nullable=True)
    severity = Column(String(20), nullable=True)
    latency_ms = Column(Float)
    toxicity_scores = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class SafetyIncident(Base):
    """Critical safety incidents"""
    __tablename__ = "safety_incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    threat_level = Column(Enum(ThreatLevel))
    threat_type = Column(String(100))
    user_id = Column(String(100), index=True, nullable=True)
    details = Column(JSON)
    response_actions = Column(JSON)
    notifications_sent = Column(JSON)
    status = Column(String(50))  # active, investigating, resolved
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class ThreatAssessment(Base):
    """Threat assessments from behavior analysis"""
    __tablename__ = "threat_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interaction_id = Column(String(100))
    user_id = Column(String(100), index=True)
    threat_level = Column(Enum(ThreatLevel))
    concerns = Column(JSON)
    actions_required = Column(JSON)
    resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class ParentalConsent(Base):
    """COPPA parental consent records"""
    __tablename__ = "parental_consents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    child_id = Column(String(100), index=True)
    parent_id = Column(String(100), index=True)
    consent_type = Column(String(100))  # data_collection, communication, etc.
    consent_given = Column(Boolean)
    consent_date = Column(DateTime)
    ip_address = Column(String(50))
    method = Column(String(50))  # verified_account, email, etc.
    expires_at = Column(DateTime)
    revoked = Column(Boolean, default=False)
    revoked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class BlockedContent(Base):
    """Blocked content for audit trail"""
    __tablename__ = "blocked_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_hash = Column(String(64), unique=True)
    content_type = Column(String(50))
    user_id = Column(String(100), index=True)
    violation_type = Column(Enum(ViolationType))
    original_content = Column(Text)  # Encrypted
    reason = Column(Text)
    blocked_at = Column(DateTime, default=datetime.utcnow, index=True)


class UserFlag(Base):
    """User behavior flags"""
    __tablename__ = "user_flags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), index=True)
    flag_type = Column(String(100))
    severity = Column(String(20))
    details = Column(JSON)
    flagged_by = Column(String(50))  # system, moderator, report
    reviewed = Column(Boolean, default=False)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(String(100), nullable=True)
    action_taken = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class ComplianceAudit(Base):
    """Compliance audit trail"""
    __tablename__ = "compliance_audits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    audit_type = Column(String(50))  # coppa, ferpa, data_retention
    entity_type = Column(String(50))
    entity_id = Column(String(100))
    regulation = Column(String(50))
    compliant = Column(Boolean)
    findings = Column(JSON)
    remediation = Column(JSON, nullable=True)
    audited_at = Column(DateTime, default=datetime.utcnow, index=True)


class DataRetention(Base):
    """Data retention enforcement log"""
    __tablename__ = "data_retention_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    data_type = Column(String(100))
    retention_policy_days = Column(Integer)
    records_deleted = Column(Integer)
    records_anonymized = Column(Integer)
    cutoff_date = Column(DateTime)
    executed_at = Column(DateTime, default=datetime.utcnow)


class Child(Base):
    """Child user records for COPPA compliance"""
    __tablename__ = "children"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), unique=True, index=True)
    date_of_birth = Column(DateTime)
    parent_id = Column(String(100), index=True)
    consent_status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    """Chat messages for retention enforcement"""
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(100), index=True)
    content = Column(Text)
    moderation_status = Column(String(50))
    retained_for_safety = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
