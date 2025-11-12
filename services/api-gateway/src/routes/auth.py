"""
Authentication Routes - Phase 1
Signup, email verification, login, token refresh
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
import secrets
import uuid

from src.db.session import get_db
from src.db.models import User, Session as DBSession, AuditLog
from src.security.password import password_validator, password_hasher
from src.security.jwt_manager import jwt_manager
from src.services.email_service import email_service
from src.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/auth", tags=["authentication"])
security = HTTPBearer()


# ============================================
# Request/Response Models
# ============================================

class SignupRequest(BaseModel):
    """User signup request"""
    email: EmailStr
    password: str = Field(min_length=12)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None


class SignupResponse(BaseModel):
    """User signup response"""
    user_id: str
    email: str
    verification_required: bool
    message: str


class LoginRequest(BaseModel):
    """User login request"""
    email: EmailStr
    password: str
    device_id: Optional[str] = None
    device_name: Optional[str] = None


class LoginResponse(BaseModel):
    """User login response"""
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: dict


class TokenRefreshRequest(BaseModel):
    """Token refresh request"""
    refresh_token: str


class VerifyEmailRequest(BaseModel):
    """Email verification request"""
    token: str


class ResendVerificationRequest(BaseModel):
    """Resend verification email request"""
    email: EmailStr


# ============================================
# Helper Functions
# ============================================

async def create_verification_token(db: AsyncSession, user: User) -> str:
    """Generate and save email verification token"""
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(
        hours=settings.email_verification_expire_hours
    )
    
    user.email_verification_token = token
    user.email_verification_expires = expires
    
    await db.commit()
    return token


async def log_audit_event(
    db: AsyncSession,
    user_id: Optional[uuid.UUID],
    event_type: str,
    event_category: str,
    description: str,
    ip_address: Optional[str],
    user_agent: Optional[str],
    metadata: dict = None
):
    """Log security audit event"""
    audit_log = AuditLog(
        user_id=user_id,
        event_type=event_type,
        event_category=event_category,
        description=description,
        ip_address=ip_address,
        user_agent=user_agent,
        metadata=metadata or {}
    )
    db.add(audit_log)
    await db.commit()


def get_client_ip(request: Request) -> str:
    """Extract client IP from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# ============================================
# Endpoints
# ============================================

@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request_data: SignupRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Register new user account
    
    Steps:
    1. Validate email uniqueness
    2. Check password strength
    3. Check HaveIBeenPwned
    4. Hash password with Argon2id
    5. Create user record
    6. Generate verification token
    7. Send verification email
    """
    ip_address = get_client_ip(request)
    
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == request_data.email.lower())
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        # Log failed attempt
        await log_audit_event(
            db, None, "signup_failed", "authentication",
            f"Signup attempt with existing email: {request_data.email}",
            ip_address, request.headers.get("User-Agent")
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Validate password strength
    is_valid, errors = password_validator.validate_strength(request_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Password does not meet requirements", "errors": errors}
        )
    
    # Check if password is common
    if password_validator.check_common_passwords(request_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is too common. Please choose a more secure password."
        )
    
    # Check HaveIBeenPwned
    is_compromised = await password_validator.check_compromised(request_data.password)
    if is_compromised:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password has been compromised in a data breach. Please choose a different password."
        )
    
    # Hash password
    password_hash = password_hasher.hash_password(request_data.password)
    
    # Create user
    user = User(
        email=request_data.email.lower(),
        password_hash=password_hash,
        first_name=request_data.first_name,
        last_name=request_data.last_name,
        phone=request_data.phone,
        date_of_birth=request_data.date_of_birth,
        role="parent",
        email_verified=settings.is_development  # Auto-verify in development
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Skip email verification in development mode
    if settings.is_development:
        # Log successful signup
        await log_audit_event(
            db, user.id, "signup_success", "authentication",
            f"New user registered (dev mode - auto-verified): {user.email}",
            ip_address, request.headers.get("User-Agent"),
            {"email": user.email}
        )
        
        return SignupResponse(
            user_id=str(user.id),
            email=user.email,
            verification_required=False,
            message="Account created successfully. You can now log in."
        )
    
    # Production mode - send verification email
    # Generate verification token
    token = await create_verification_token(db, user)
    
    # Send verification email
    verification_url = f"{settings.cors_origins[0]}/verify-email?token={token}"
    
    email_sent = await email_service.send_verification_email(
        to_email=user.email,
        first_name=user.first_name,
        verification_url=verification_url
    )
    
    if not email_sent:
        logger.error(f"Failed to send verification email to {user.email}")
    
    # Log successful signup
    await log_audit_event(
        db, user.id, "signup_success", "authentication",
        f"New user registered: {user.email}",
        ip_address, request.headers.get("User-Agent"),
        {"email": user.email}
    )
    
    return SignupResponse(
        user_id=str(user.id),
        email=user.email,
        verification_required=True,
        message="Account created successfully. Please check your email to verify your account."
    )


@router.post("/verify-email")
async def verify_email(
    request_data: VerifyEmailRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Verify user email address"""
    # Find user with token
    result = await db.execute(
        select(User).where(
            User.email_verification_token == request_data.token
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Check expiration
    if user.email_verification_expires and \
       user.email_verification_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new one."
        )
    
    # Verify email
    user.email_verified = True
    user.email_verification_token = None
    user.email_verification_expires = None
    
    await db.commit()
    
    # Log verification
    await log_audit_event(
        db, user.id, "email_verified", "authentication",
        f"Email verified for user: {user.email}",
        get_client_ip(request), request.headers.get("User-Agent")
    )
    
    return {"message": "Email verified successfully. You can now log in."}


@router.post("/login", response_model=LoginResponse)
async def login(
    request_data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    User login
    
    Steps:
    1. Find user by email
    2. Check if account is locked
    3. Verify password
    4. Check email verification
    5. Create session
    6. Generate tokens
    7. Log login event
    """
    ip_address = get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "unknown")
    
    # Find user
    result = await db.execute(
        select(User).where(User.email == request_data.email.lower())
    )
    user = result.scalar_one_or_none()
    
    if not user:
        await log_audit_event(
            db, None, "login_failed", "authentication",
            f"Login attempt with non-existent email: {request_data.email}",
            ip_address, user_agent
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=f"Account is locked until {user.locked_until.isoformat()}"
        )
    
    # Verify password
    if not password_hasher.verify_password(request_data.password, user.password_hash):
        # Increment failed attempts
        user.failed_login_attempts += 1
        
        # Lock account after 5 failed attempts
        if user.failed_login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=30)
            await db.commit()
            
            await log_audit_event(
                db, user.id, "account_locked", "security",
                f"Account locked due to failed login attempts: {user.email}",
                ip_address, user_agent
            )
            
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail="Account locked due to too many failed login attempts. Please try again in 30 minutes."
            )
        
        await db.commit()
        
        await log_audit_event(
            db, user.id, "login_failed", "authentication",
            f"Failed login attempt for user: {user.email}",
            ip_address, user_agent
        )
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check email verification
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before logging in"
        )
    
    # Reset failed attempts
    user.failed_login_attempts = 0
    user.last_login_at = datetime.utcnow()
    user.last_login_ip = ip_address
    
    # Create session
    session = DBSession(
        user_id=user.id,
        refresh_token_hash="",  # Will be set after token generation
        device_id=request_data.device_id,
        device_name=request_data.device_name,
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=datetime.utcnow() + timedelta(
            days=settings.jwt_refresh_token_expire_days
        )
    )
    
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    # Generate tokens
    access_token = jwt_manager.create_access_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )
    
    refresh_token = jwt_manager.create_refresh_token(
        user_id=str(user.id),
        session_id=str(session.id)
    )
    
    # Hash and store refresh token
    session.refresh_token_hash = password_hasher.hash_password(refresh_token)
    await db.commit()
    
    # Log successful login
    await log_audit_event(
        db, user.id, "login_success", "authentication",
        f"User logged in: {user.email}",
        ip_address, user_agent,
        {"device_id": request_data.device_id}
    )
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.jwt_access_token_expire_minutes * 60,
        user={
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "mfa_enabled": user.mfa_enabled
        }
    )


@router.post("/refresh", response_model=LoginResponse)
async def refresh_token(
    request_data: TokenRefreshRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        claims = jwt_manager.verify_token(request_data.refresh_token, "refresh")
        user_id = uuid.UUID(claims["sub"])
        session_id = uuid.UUID(claims["session_id"])
        
    except Exception as e:
        logger.warning(f"Invalid refresh token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Find session
    result = await db.execute(
        select(DBSession).where(
            DBSession.id == session_id,
            DBSession.user_id == user_id,
            DBSession.status == "active"
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found or expired"
        )
    
    # Verify refresh token hash
    if not password_hasher.verify_password(
        request_data.refresh_token,
        session.refresh_token_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Check session expiration
    if session.expires_at < datetime.utcnow():
        session.status = "expired"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again."
        )
    
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new tokens
    new_access_token = jwt_manager.create_access_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role
    )
    
    new_refresh_token = jwt_manager.create_refresh_token(
        user_id=str(user.id),
        session_id=str(session.id)
    )
    
    # Update session with new refresh token
    session.refresh_token_hash = password_hasher.hash_password(new_refresh_token)
    session.last_activity = datetime.utcnow()
    await db.commit()
    
    return LoginResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.jwt_access_token_expire_minutes * 60,
        user={
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "mfa_enabled": user.mfa_enabled
        }
    )
