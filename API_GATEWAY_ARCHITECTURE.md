# 🔐 API Gateway & Authentication - Enterprise Architecture

**Status:** Architecture Complete, Implementation Ready  
**Based On:** Google BeyondCorp + Microsoft Zero Trust  
**Complexity:** Principal Engineer Level

---

## Executive Summary

The API Gateway service requires **enterprise-grade authentication** with:
- Multi-factor authentication (TOTP, SMS, backup codes)
- JWT-based session management with token rotation
- Argon2id password hashing (NIST 800-63B compliant)
- Risk-based adaptive authentication
- Rate limiting and DDoS protection
- SSO integration (SAML, OAuth2, OIDC)
- COPPA compliance for child accounts
- Comprehensive audit logging

**Estimated Implementation:** 20-30 hours for full production features

---

## 🏗️ Architecture Overview

### Authentication Flow
```
User Request
    ↓
┌─────────────────────────────────────────┐
│ API Gateway (Port 8000)                 │
│ ├─ Rate Limiter (Redis)                │
│ ├─ JWT Validator                        │
│ ├─ Risk Assessment Engine              │
│ └─ MFA Handler                          │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Session Store (Redis)                   │
│ ├─ Active Sessions (15min access)      │
│ ├─ Refresh Tokens (30 day)            │
│ └─ MFA Challenges (5min)               │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Database (PostgreSQL)                   │
│ ├─ Users & Credentials                 │
│ ├─ MFA Backup Codes                    │
│ ├─ Audit Logs                          │
│ └─ Children Profiles (COPPA)           │
└─────────────────────────────────────────┘
```

### Security Layers

**Layer 1: Network Security**
- TLS 1.3 encryption
- CORS with whitelist
- Trusted host middleware
- Network policies (K8s)

**Layer 2: Authentication**
- Argon2id password hashing
- JWT with RS256 signing
- Token rotation on refresh
- Device fingerprinting

**Layer 3: Authorization**
- Role-based access control (RBAC)
- Resource-level permissions
- API key management
- Rate limiting per user/role

**Layer 4: Risk Assessment**
- New device detection
- Geolocation analysis
- Impossible travel detection
- VPN/proxy detection
- Failed attempt tracking

**Layer 5: Audit & Compliance**
- All actions logged
- COPPA consent tracking
- GDPR data export
- FERPA compliance

---

## 🔑 Key Features to Implement

### 1. Password Security (NIST 800-63B)

```python
# Argon2id configuration
PasswordHasher(
    time_cost=2,          # Iterations
    memory_cost=65536,    # 64 MB
    parallelism=4,        # 4 threads
    hash_len=32,
    salt_len=16
)

# Password requirements
- Minimum 12 characters
- Uppercase + lowercase
- Numbers + special chars
- Not in compromised list (HaveIBeenPwned API)
- Password history (last 5)
```

### 2. Multi-Factor Authentication

**TOTP (Authenticator App)**
```python
import pyotp

# Generate secret
secret = pyotp.random_base32()
totp = pyotp.TOTP(secret)

# Verify code
totp.verify(user_code, valid_window=1)
```

**SMS Codes (Twilio)**
```python
# Generate 6-digit code
code = str(secrets.randbelow(999999)).zfill(6)

# Send via Twilio
client.messages.create(
    to=user.phone,
    from_=TWILIO_NUMBER,
    body=f"AIVO verification code: {code}"
)
```

**Backup Codes**
```python
# Generate 10 backup codes
codes = [secrets.token_urlsafe(16) for _ in range(10)]

# Hash and store
for code in codes:
    MFABackupCode.create(
        user_id=user.id,
        code_hash=password_hasher.hash(code)
    )
```

### 3. JWT Token Management

**Access Token (Short-lived)**
```python
{
    "sub": "user_id",
    "email": "user@example.com",
    "role": "parent",
    "session_id": "session_uuid",
    "exp": now + 15min,
    "iat": now,
    "jti": token_id
}
```

**Refresh Token (Long-lived)**
```python
{
    "sub": "user_id",
    "session_id": "session_uuid",
    "type": "refresh",
    "exp": now + 30days,
    "iat": now
}
```

**Token Rotation**
- Refresh tokens are single-use
- New refresh token issued on every refresh
- Old token invalidated immediately
- Prevents token theft

### 4. Risk-Based Authentication

```python
def assess_login_risk(
    user_id: str,
    device_info: Dict,
    ip_address: str
) -> float:
    risk_score = 0.0
    
    # New device (+0.3)
    if not is_known_device(user_id, device_info):
        risk_score += 0.3
    
    # New location (+0.2)
    location = geolocate(ip_address)
    if not is_known_location(user_id, location):
        risk_score += 0.2
    
    # VPN detected (+0.2)
    if is_vpn(ip_address):
        risk_score += 0.2
    
    # Impossible travel (+0.5)
    if is_impossible_travel(user_id, location):
        risk_score += 0.5
    
    # Suspicious time (+0.1)
    if is_suspicious_time():
        risk_score += 0.1
    
    return min(risk_score, 1.0)

# Adaptive MFA
if risk_score > 0.7:
    require_mfa = True
```

### 5. Rate Limiting

```python
from slowapi import Limiter

limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="redis://redis:6379",
    strategy="fixed-window-elastic-expiry"
)

# Per-endpoint limits
@app.post("/v1/auth/login")
@limiter.limit("10/minute")
async def login(...):
    pass

@app.post("/v1/auth/signup")
@limiter.limit("5/hour")
async def signup(...):
    pass

# Global limits
- 1000 requests/hour per IP
- 100 requests/minute per IP
- 50 requests/minute per user
```

### 6. COPPA Compliance

```python
class ChildProfile:
    """COPPA-compliant child profile"""
    
    # Required fields
    parent_id: str
    first_name: str
    grade: str
    
    # Consent tracking
    consent_given: bool
    consent_date: datetime
    consent_ip: str
    
    # Privacy protections
    no_email: bool = True
    no_phone: bool = True
    parental_access_only: bool = True
    
    # Age verification
    def requires_consent(self) -> bool:
        age = calculate_age(self.date_of_birth)
        return age < 13

# Consent workflow
async def add_child(request):
    if child.age < 13 and not request.parental_consent:
        raise HTTPException(
            400,
            "Parental consent required for children under 13"
        )
    
    # Log consent
    AuditLog.create(
        action="parental_consent",
        child_id=child.id,
        ip_address=request.client.host,
        consent_given=True
    )
```

### 7. SSO Integration

**SAML 2.0 (Enterprise)**
```python
from onelogin.saml2.auth import OneLogin_Saml2_Auth

async def initiate_saml_sso(provider: str):
    auth = OneLogin_Saml2_Auth(
        request_data,
        saml_settings[provider]
    )
    
    return {
        "redirect_url": auth.login()
    }

async def handle_saml_callback(saml_response):
    auth.process_response()
    
    if auth.is_authenticated():
        user_data = auth.get_attributes()
        # Create or update user
        return create_session(user_data)
```

**OAuth 2.0 / OIDC (Google, Microsoft)**
```python
async def initiate_oauth(provider: str):
    oauth = OAuth2Session(
        client_id,
        redirect_uri=callback_url,
        scope=["openid", "email", "profile"]
    )
    
    authorization_url, state = oauth.authorization_url(
        provider_config["auth_endpoint"]
    )
    
    return {"redirect_url": authorization_url}

async def oauth_callback(code: str, state: str):
    token = oauth.fetch_token(
        token_endpoint,
        code=code,
        client_secret=client_secret
    )
    
    user_info = oauth.get(userinfo_endpoint).json()
    return create_or_update_user(user_info)
```

---

## 📊 Database Schema (Authentication)

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    
    -- MFA
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT,  -- Encrypted TOTP secret
    
    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Security
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP,
    password_changed_at TIMESTAMP,
    password_history JSONB,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_deleted_at (deleted_at)
);
```

### MFA Backup Codes
```sql
CREATE TABLE mfa_backup_codes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) UNIQUE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_id (user_id),
    INDEX idx_used (used)
);
```

### Audit Logs
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_id_timestamp (user_id, timestamp),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);
```

### Children Profiles (COPPA)
```sql
CREATE TABLE children (
    id UUID PRIMARY KEY,
    parent_id UUID REFERENCES users(id) NOT NULL,
    
    -- Basic info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    grade VARCHAR(10) NOT NULL,
    
    -- Location
    zipcode VARCHAR(10),
    district_id UUID REFERENCES districts(id),
    school_id UUID,
    
    -- Learning profile
    disabilities TEXT[],
    learning_style VARCHAR(50),
    interests TEXT[],
    
    -- COPPA compliance
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    consent_ip INET,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    INDEX idx_parent_id (parent_id),
    INDEX idx_district_id (district_id),
    INDEX idx_deleted_at (deleted_at)
);
```

---

## 🚀 Quick Implementation Path

### Phase 1: Basic Auth (4-6 hours)
1. User signup with email verification
2. Login with password (Argon2id)
3. JWT token generation
4. Basic session management

### Phase 2: MFA (4-6 hours)
5. TOTP setup and verification
6. SMS code generation
7. Backup codes
8. MFA enforcement for roles

### Phase 3: Advanced Security (6-8 hours)
9. Risk-based authentication
10. Device fingerprinting
11. Rate limiting
12. Token rotation

### Phase 4: Enterprise (6-8 hours)
13. SAML SSO
14. OAuth 2.0/OIDC
15. RBAC system
16. Audit logging

### Phase 5: COPPA Compliance (2-4 hours)
17. Child profile management
18. Parental consent workflow
19. Privacy controls
20. Data export/deletion

---

## 📦 Required Dependencies

```txt
# Core
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.9.2

# Security
argon2-cffi==23.1.0
pyjwt[crypto]==2.9.0
cryptography==42.0.8
pyotp==2.9.0
python-jose==3.3.0

# Rate Limiting
slowapi==0.1.9
redis==5.2.0

# Database
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0

# Communications
twilio==9.3.2
sendgrid==6.11.0

# SSO
python-saml==1.16.0
authlib==1.3.2

# Monitoring
prometheus-client==0.21.0
sentry-sdk==2.17.0

# HTTP Client
httpx==0.27.2
```

---

## 🎯 Success Metrics

| Metric | Target | Monitoring |
|--------|--------|------------|
| Auth Latency | <50ms | Prometheus |
| Token Generation | <10ms | Prometheus |
| MFA Verification | <100ms | Prometheus |
| Failed Login Rate | <1% | Grafana |
| Account Lockouts | <0.1% | Alerts |
| Session Active Time | 15min avg | Redis |
| Concurrent Users | 100K+ | Load tests |

---

## 🔐 Security Checklist

- [ ] Argon2id password hashing
- [ ] JWT with RS256 signing
- [ ] Token rotation on refresh
- [ ] MFA for admin/teacher roles
- [ ] Rate limiting on all endpoints
- [ ] HTTPS/TLS 1.3 only
- [ ] CORS whitelist configured
- [ ] Trusted host middleware
- [ ] Device fingerprinting
- [ ] Risk-based auth
- [ ] Audit logging enabled
- [ ] COPPA compliance
- [ ] Password breach checking
- [ ] Session timeout
- [ ] Secure cookie flags

---

**Status:** Architecture Complete ✅  
**Next:** Begin Phase 1 Implementation  
**Estimate:** 20-30 hours total
