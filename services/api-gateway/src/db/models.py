"""
Database Models for API Gateway
SQLAlchemy 2.0 async models
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import uuid


class Base(DeclarativeBase):
    """Base class for all models"""
    pass


class User(Base):
    """Core user authentication table"""
    __tablename__ = "users"
    
    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    # Authentication
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    email_verification_token: Mapped[Optional[str]] = mapped_column(String(255))
    email_verification_expires: Mapped[Optional[datetime]] = mapped_column(DateTime)
    
    # Profile
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(DateTime)
    
    # MFA
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    mfa_secret: Mapped[Optional[str]] = mapped_column(String(255))
    mfa_method: Mapped[Optional[str]] = mapped_column(String(20))  # totp, sms
    
    # Role & Permissions
    role: Mapped[str] = mapped_column(String(50), default="parent")  # parent, teacher, admin
    permissions: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    # Security
    password_changed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime)
    force_password_change: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), default="active")  # active, suspended, deleted
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    last_login_ip: Mapped[Optional[str]] = mapped_column(String(45))
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # Indexes
    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_status", "status"),
        Index("idx_users_role", "role"),
    )


class MFABackupCode(Base):
    """MFA backup codes for account recovery"""
    __tablename__ = "mfa_backup_codes"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    code_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    used: Mapped[bool] = mapped_column(Boolean, default=False)
    used_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index("idx_mfa_codes_user_id", "user_id"),
    )


class Session(Base):
    """User session management"""
    __tablename__ = "sessions"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    refresh_token_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Device Information
    device_id: Mapped[Optional[str]] = mapped_column(String(255))
    device_name: Mapped[Optional[str]] = mapped_column(String(255))
    user_agent: Mapped[Optional[str]] = mapped_column(Text)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    
    # Geolocation
    country: Mapped[Optional[str]] = mapped_column(String(2))
    city: Mapped[Optional[str]] = mapped_column(String(100))
    latitude: Mapped[Optional[float]] = mapped_column(Float)
    longitude: Mapped[Optional[float]] = mapped_column(Float)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), default="active")
    last_activity: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index("idx_sessions_user_id", "user_id"),
        Index("idx_sessions_status", "status"),
        Index("idx_sessions_expires_at", "expires_at"),
    )


class AuditLog(Base):
    """Comprehensive audit logging"""
    __tablename__ = "audit_logs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True))
    
    # Event Information
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    event_category: Mapped[str] = mapped_column(String(50), nullable=False)
    event_severity: Mapped[str] = mapped_column(String(20), default="info")
    
    # Details
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    # Request Context
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    user_agent: Mapped[Optional[str]] = mapped_column(Text)
    request_id: Mapped[Optional[str]] = mapped_column(String(255))
    
    # Risk Score
    risk_score: Mapped[Optional[float]] = mapped_column(Float)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index("idx_audit_user_id", "user_id"),
        Index("idx_audit_event_type", "event_type"),
        Index("idx_audit_created_at", "created_at"),
        Index("idx_audit_event_category", "event_category"),
    )


class Child(Base):
    """Child profiles (COPPA compliant)"""
    __tablename__ = "children"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    parent_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    
    # Profile
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_birth: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    grade: Mapped[str] = mapped_column(String(10), nullable=False)
    
    # COPPA Compliance
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    requires_parental_consent: Mapped[bool] = mapped_column(Boolean, default=True)
    parental_consent_given: Mapped[bool] = mapped_column(Boolean, default=False)
    parental_consent_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    
    # Privacy Settings
    data_collection_allowed: Mapped[bool] = mapped_column(Boolean, default=False)
    marketing_allowed: Mapped[bool] = mapped_column(Boolean, default=False)
    data_sharing_allowed: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Learning Profile
    personalized_model_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True))
    baseline_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    baseline_completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    
    # Status
    status: Mapped[str] = mapped_column(String(20), default="active")
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    __table_args__ = (
        Index("idx_children_parent_id", "parent_id"),
        Index("idx_children_status", "status"),
    )


class Organization(Base):
    """Organizations (schools, districts)"""
    __tablename__ = "organizations"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # school, district
    
    # Contact
    domain: Mapped[Optional[str]] = mapped_column(String(255))
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(20))
    
    # SSO Configuration
    sso_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    sso_provider: Mapped[Optional[str]] = mapped_column(String(50))
    sso_config: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    # Subscription
    subscription_tier: Mapped[str] = mapped_column(String(50), default="basic")
    subscription_status: Mapped[str] = mapped_column(String(20), default="active")
    subscription_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    
    # Limits
    max_teachers: Mapped[int] = mapped_column(Integer, default=10)
    max_students: Mapped[int] = mapped_column(Integer, default=100)
    
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    __table_args__ = (
        Index("idx_organizations_domain", "domain"),
        Index("idx_organizations_status", "status"),
    )


class DeviceFingerprint(Base):
    """Device fingerprinting for security"""
    __tablename__ = "device_fingerprints"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    
    # Fingerprint
    device_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    fingerprint_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Device Details
    device_name: Mapped[Optional[str]] = mapped_column(String(255))
    device_type: Mapped[Optional[str]] = mapped_column(String(50))
    os: Mapped[Optional[str]] = mapped_column(String(100))
    browser: Mapped[Optional[str]] = mapped_column(String(100))
    
    # Trust Level
    trusted: Mapped[bool] = mapped_column(Boolean, default=False)
    trust_score: Mapped[float] = mapped_column(Float, default=0.5)
    
    # Activity
    first_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    login_count: Mapped[int] = mapped_column(Integer, default=1)
    
    status: Mapped[str] = mapped_column(String(20), default="active")
    
    __table_args__ = (
        Index("idx_device_user_id", "user_id"),
        Index("idx_device_id", "device_id"),
    )
