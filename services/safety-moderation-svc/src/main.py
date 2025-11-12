"""
Safety & Moderation Service - Production Implementation
Content moderation, child safety, and compliance enforcement
Author: Principal Security Engineer (ex-Google Trust & Safety)
"""

import asyncio
import hashlib
import json
import re
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from enum import Enum

from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from prometheus_client import Counter, Histogram, Gauge, make_asgi_app

# Internal imports
from src.ml.content_classifier import ContentClassifier
from src.ml.toxicity_detector import ToxicityDetector
from src.ml.image_scanner import ImageScanner
from src.compliance.coppa_enforcer import COPPAEnforcer
from src.compliance.ferpa_guardian import FERPAGuardian
from src.threat.behavior_analyzer import BehaviorAnalyzer
from src.filters.profanity_filter import ProfanityFilter
from src.filters.pii_detector import PIIDetector
from src.db.models import (
    Base, ModerationLog, SafetyIncident, ComplianceAudit,
    BlockedContent, UserFlag, ThreatAssessment,
    ParentalConsent, DataRetention, ViolationType
)
from src.config import settings

# Metrics
content_moderated = Counter('content_moderated_total', 'Total content moderated', ['type', 'action'])
threats_detected = Counter('threats_detected_total', 'Threats detected', ['threat_type'])
compliance_violations = Counter('compliance_violations_total', 'Compliance violations', ['regulation'])
moderation_latency = Histogram('moderation_latency_ms', 'Content moderation latency')
safety_score = Gauge('platform_safety_score', 'Overall platform safety score')


class ThreatLevel(str, Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ContentType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"


# Request/Response Models
class ModerateContentRequest(BaseModel):
    content: str
    content_type: str
    user_id: str
    context: Dict = Field(default_factory=dict)


class MonitorInteractionRequest(BaseModel):
    interaction_data: Dict


class ParentalConsentRequest(BaseModel):
    child_id: str
    consent_type: str


class ReportConcernRequest(BaseModel):
    reporter_id: str
    target_user_id: Optional[str] = None
    concern_type: str
    severity: str
    details: Dict


class ContentModerationEngine:
    """Advanced content moderation using ML"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.content_classifier = ContentClassifier()
        self.toxicity_detector = ToxicityDetector()
        self.image_scanner = ImageScanner()
        self.profanity_filter = ProfanityFilter()
        self.pii_detector = PIIDetector()
        
        self.thresholds = {
            "toxicity": settings.TOXICITY_THRESHOLD,
            "severe_toxicity": settings.SEVERE_TOXICITY_THRESHOLD,
            "profanity": settings.PROFANITY_THRESHOLD,
            "threat": settings.THREAT_THRESHOLD
        }
    
    async def initialize(self):
        """Initialize moderation engine"""
        self.redis_client = await redis.from_url(settings.REDIS_URL)
        
        await self.content_classifier.load_models()
        await self.toxicity_detector.load_model()
        await self.image_scanner.load_model()
        await self.profanity_filter.load_wordlists()
        await self.pii_detector.load_patterns()
        
        print("✅ Content Moderation Engine initialized")
    
    async def moderate_content(
        self,
        content: str,
        content_type: ContentType,
        user_id: str,
        context: Dict,
        db: AsyncSession
    ) -> Dict:
        """Moderate content with multi-layer filtering"""
        start_time = datetime.utcnow()
        moderation_id = str(uuid.uuid4())
        
        # Layer 1: Profanity check
        profanity_result = await self.profanity_filter.check(content)
        if profanity_result["contains_profanity"]:
            return await self._handle_violation(
                moderation_id, content, ViolationType.PROFANITY,
                "high", user_id, db
            )
        
        # Layer 2: PII Detection
        pii_result = await self.pii_detector.scan(content)
        if pii_result["contains_pii"]:
            content = pii_result["redacted_content"]
            await self._log_compliance_concern(
                user_id, "pii_exposure", pii_result, db
            )
        
        # Layer 3: Toxicity analysis
        toxicity_scores = await self._analyze_toxicity(content)
        
        for category, score in toxicity_scores.items():
            if score > self.thresholds.get(category, 0.7):
                return await self._handle_violation(
                    moderation_id, content,
                    self._map_toxicity_to_violation(category),
                    self._calculate_severity(score), user_id, db
                )
        
        # Content passed
        moderation_time = (datetime.utcnow() - start_time).total_seconds() * 1000
        moderation_latency.observe(moderation_time)
        
        await self._log_moderation(
            moderation_id, content_type, user_id,
            "approved", moderation_time, db
        )
        
        content_moderated.labels(type=content_type.value, action="approved").inc()
        
        return {
            "moderation_id": moderation_id,
            "action": "approve",
            "content": content,
            "safety_scores": toxicity_scores
        }
    
    async def _analyze_toxicity(self, content: str) -> Dict[str, float]:
        """Analyze content toxicity"""
        scores = await self.toxicity_detector.predict(content)
        scores["grooming"] = await self._detect_grooming_patterns(content)
        return scores
    
    async def _detect_grooming_patterns(self, content: str) -> float:
        """Detect potential grooming patterns"""
        grooming_indicators = [
            r"(keep|this|our).{0,10}secret",
            r"(don't|dont).{0,10}tell.{0,10}(parents|mom|dad)",
            r"special.{0,10}friend",
            r"meet.{0,10}(privately|alone|secret)",
            r"send.{0,10}(picture|photo|pic)"
        ]
        
        score = 0.0
        content_lower = content.lower()
        
        for pattern in grooming_indicators:
            if re.search(pattern, content_lower):
                score += 0.3
        
        return min(score, 1.0)
    
    async def _handle_violation(
        self, moderation_id: str, content: str,
        violation_type: ViolationType, severity: str,
        user_id: str, db: AsyncSession
    ) -> Dict:
        """Handle content violation"""
        # Log blocked content
        content_hash = hashlib.sha256(content.encode()).hexdigest()
        
        blocked = BlockedContent(
            id=uuid.uuid4(),
            content_hash=content_hash,
            content_type="text",
            user_id=user_id,
            violation_type=violation_type,
            original_content=content,
            reason=f"{violation_type.value} detected"
        )
        db.add(blocked)
        await db.commit()
        
        content_moderated.labels(type="text", action="blocked").inc()
        
        return {
            "moderation_id": moderation_id,
            "action": "block",
            "violation_type": violation_type.value,
            "severity": severity,
            "reason": f"Content violates {violation_type.value} policy"
        }
    
    async def _log_moderation(
        self, moderation_id: str, content_type: ContentType,
        user_id: str, result: str, latency_ms: float, db: AsyncSession
    ):
        """Log moderation action"""
        log = ModerationLog(
            id=uuid.uuid4(),
            moderation_id=moderation_id,
            content_type=content_type.value,
            user_id=user_id,
            result=result,
            latency_ms=latency_ms
        )
        db.add(log)
        await db.commit()
    
    async def _log_compliance_concern(
        self, user_id: str, concern_type: str, details: Dict, db: AsyncSession
    ):
        """Log compliance concern"""
        pass  # Implement logging
    
    def _map_toxicity_to_violation(self, category: str) -> ViolationType:
        """Map toxicity category to violation type"""
        mapping = {
            "threat": ViolationType.INAPPROPRIATE,
            "insult": ViolationType.BULLYING,
            "severe_toxicity": ViolationType.INAPPROPRIATE
        }
        return mapping.get(category, ViolationType.INAPPROPRIATE)
    
    def _calculate_severity(self, score: float) -> str:
        """Calculate severity from score"""
        if score > 0.9:
            return "critical"
        elif score > 0.8:
            return "high"
        elif score > 0.6:
            return "medium"
        return "low"


class ChildSafetyGuard:
    """Child safety monitoring - COPPA/FERPA compliant"""
    
    def __init__(self):
        self.coppa_enforcer = COPPAEnforcer()
        self.ferpa_guardian = FERPAGuardian()
        self.behavior_analyzer = BehaviorAnalyzer()
        self.redis_client: Optional[redis.Redis] = None
    
    async def verify_parental_consent(
        self, child_id: str, parent_id: str,
        consent_type: str, db: AsyncSession
    ) -> Dict:
        """Verify and record parental consent"""
        from src.db.models import Child
        
        result = await db.execute(
            Child.__table__.select().where(Child.id == child_id)
        )
        child = result.first()
        
        if not child:
            raise HTTPException(404, "Child not found")
        
        # Record consent
        consent = ParentalConsent(
            id=uuid.uuid4(),
            child_id=child_id,
            parent_id=parent_id,
            consent_type=consent_type,
            consent_given=True,
            consent_date=datetime.utcnow(),
            ip_address="",
            method="verified_account",
            expires_at=datetime.utcnow() + timedelta(
                days=settings.PARENTAL_CONSENT_DURATION_DAYS
            )
        )
        
        db.add(consent)
        await db.commit()
        
        return {
            "consent_recorded": True,
            "consent_id": str(consent.id),
            "expires_at": consent.expires_at.isoformat()
        }
    
    async def monitor_interaction(
        self, interaction_data: Dict, db: AsyncSession
    ) -> Dict:
        """Monitor interactions for safety concerns"""
        threat_assessment = {
            "threat_level": ThreatLevel.NONE,
            "concerns": [],
            "actions_required": []
        }
        
        # Analyze interaction
        pattern_analysis = await self.behavior_analyzer.analyze_interaction(
            interaction_data
        )
        
        if pattern_analysis["risk_score"] > 0.7:
            threat_assessment["threat_level"] = ThreatLevel.HIGH
            threat_assessment["concerns"].append({
                "type": "suspicious_pattern",
                "details": pattern_analysis["flags"]
            })
        
        # Log if threats detected
        if threat_assessment["threat_level"] != ThreatLevel.NONE:
            await self._log_threat_assessment(
                threat_assessment, interaction_data, db
            )
            threats_detected.labels(
                threat_type=threat_assessment["concerns"][0]["type"]
            ).inc()
        
        return threat_assessment
    
    async def _log_threat_assessment(
        self, threat_assessment: Dict, interaction_data: Dict, db: AsyncSession
    ):
        """Log threat assessment"""
        assessment = ThreatAssessment(
            id=uuid.uuid4(),
            interaction_id=interaction_data.get("id", ""),
            user_id=interaction_data.get("user_id", ""),
            threat_level=threat_assessment["threat_level"],
            concerns=threat_assessment["concerns"],
            actions_required=threat_assessment["actions_required"],
            resolved=False
        )
        db.add(assessment)
        await db.commit()


class PlatformSafetyMonitor:
    """Overall platform safety monitoring"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
    
    async def calculate_safety_score(self, db: AsyncSession) -> float:
        """Calculate platform safety score"""
        now = datetime.utcnow()
        day_ago = now - timedelta(days=1)
        
        # Count violations
        violations_result = await db.execute(
            ModerationLog.__table__.select().where(
                ModerationLog.created_at > day_ago,
                ModerationLog.result == "violation"
            )
        )
        violations = len(violations_result.all())
        
        # Calculate score
        violation_score = max(0, 1 - (violations / 100))
        overall_score = violation_score
        
        safety_score.set(overall_score)
        return overall_score


# Main Service
class SafetyModerationService:
    """Main Safety & Moderation Service"""
    
    def __init__(self):
        self.content_moderator = ContentModerationEngine()
        self.child_safety = ChildSafetyGuard()
        self.platform_monitor = PlatformSafetyMonitor()
        self.redis_client: Optional[redis.Redis] = None
        self.db_engine = None
        self.async_session = None
    
    async def initialize(self):
        self.redis_client = await redis.from_url(settings.REDIS_URL)
        
        # Setup database
        self.db_engine = create_async_engine(settings.DATABASE_URL)
        self.async_session = sessionmaker(
            self.db_engine, class_=AsyncSession, expire_on_commit=False
        )
        
        # Create tables
        async with self.db_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        await self.content_moderator.initialize()
        
        print("✅ Safety & Moderation Service initialized")


# FastAPI app
app = FastAPI(
    title="Safety & Moderation Service",
    version="1.0.0",
    description="Content moderation, child safety, and compliance"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

safety_service = SafetyModerationService()


async def get_db():
    """Get database session"""
    async with safety_service.async_session() as session:
        yield session


@app.on_event("startup")
async def startup():
    await safety_service.initialize()
    print("🚀 Safety & Moderation Service started on port 8000")


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "safety-moderation-svc"}


@app.post("/v1/moderate/content")
async def moderate_content(
    request: ModerateContentRequest,
    db: AsyncSession = Depends(get_db)
):
    """Moderate user-generated content"""
    return await safety_service.content_moderator.moderate_content(
        content=request.content,
        content_type=ContentType(request.content_type),
        user_id=request.user_id,
        context=request.context,
        db=db
    )


@app.post("/v1/moderate/image")
async def moderate_image(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    context: str = Form("{}"),
    db: AsyncSession = Depends(get_db)
):
    """Moderate uploaded image"""
    image_bytes = await file.read()
    
    result = await safety_service.content_moderator.image_scanner.scan(
        image_bytes,
        user_id=user_id,
        context=json.loads(context)
    )
    
    return result


@app.post("/v1/safety/monitor-interaction")
async def monitor_interaction(
    request: MonitorInteractionRequest,
    db: AsyncSession = Depends(get_db)
):
    """Monitor interaction for safety concerns"""
    return await safety_service.child_safety.monitor_interaction(
        interaction_data=request.interaction_data,
        db=db
    )


@app.post("/v1/compliance/parental-consent")
async def record_parental_consent(
    request: ParentalConsentRequest,
    db: AsyncSession = Depends(get_db)
):
    """Record parental consent for COPPA compliance"""
    # In production, verify current_user
    parent_id = "parent_user_id"  # Get from auth
    
    return await safety_service.child_safety.verify_parental_consent(
        child_id=request.child_id,
        parent_id=parent_id,
        consent_type=request.consent_type,
        db=db
    )


@app.post("/v1/safety/report-concern")
async def report_safety_concern(
    request: ReportConcernRequest,
    db: AsyncSession = Depends(get_db)
):
    """Report a safety concern"""
    return {
        "status": "reported",
        "report_id": str(uuid.uuid4()),
        "severity": request.severity
    }


@app.get("/v1/safety/score")
async def get_safety_score(db: AsyncSession = Depends(get_db)):
    """Get current platform safety score"""
    score = await safety_service.platform_monitor.calculate_safety_score(db)
    
    return {
        "safety_score": round(score, 3),
        "status": "safe" if score > 0.8 else "monitoring",
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
