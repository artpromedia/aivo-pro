"""
Baseline Assessment Service - Main Application
FastAPI service for IRT-based adaptive testing
"""
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from contextlib import asynccontextmanager
import logging
import sys

from src.config import Settings
from src.db.database import Database
from src.core.item_selector import item_selector, stopping_criteria
from src.core.session_manager import session_manager
from src.core.skill_analyzer import skill_analyzer
from src.repositories.item_bank_repository import ItemBankRepository
from src.repositories.session_repository import AssessmentSessionRepository

# Import comprehensive assessment modules
from src.assessors.speech_assessor import SpeechLanguageAssessor
from src.assessors.sel_assessor import SocialEmotionalAssessor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)


settings = Settings()
database = Database(settings=settings)
item_repository = ItemBankRepository(
    db=database,
    cache_ttl_seconds=settings.ITEM_CACHE_TTL_SECONDS
)
session_repository = AssessmentSessionRepository(db=database)


# ============================================
# Request/Response Models
# ============================================

class StartAssessmentRequest(BaseModel):
    """Start assessment request"""
    child_id: str = Field(description="Child UUID")
    subject: str = Field(description="Subject area (math, ela, science)")
    grade: str = Field(description="Grade level (K, 1-12)")


class StartAssessmentResponse(BaseModel):
    """Start assessment response"""
    session_id: str
    first_item: Dict
    stats: Dict


class SubmitAnswerRequest(BaseModel):
    """Submit answer request"""
    session_id: str
    item_id: str
    answer: int
    response_time_ms: int


class SubmitAnswerResponse(BaseModel):
    """Submit answer response"""
    correct: bool
    next_item: Optional[Dict]
    stats: Dict
    should_continue: bool
    message: str


class CompleteAssessmentResponse(BaseModel):
    """Complete assessment response"""
    session_id: str
    final_theta: float
    standard_error: float
    num_items: int
    percent_correct: float
    duration_seconds: int
    skill_vector: Dict
    strengths_weaknesses: Dict
    recommendations: List[str]


class ComprehensiveAssessmentRequest(BaseModel):
    """Request for comprehensive assessment including academic, speech, and SEL"""
    child_id: str = Field(description="Child UUID")
    age: float = Field(description="Child's age in years")
    grade: str = Field(description="Grade level (K, 1-12)")

    # Academic assessment data (IRT)
    academic_subjects: List[str] = Field(default=["math", "ela"])

    # Speech/Language assessment data
    speech_assessment_data: Optional[Dict] = Field(
        default=None,
        description="Speech and language assessment responses"
    )

    # SEL assessment data
    sel_assessment_data: Optional[Dict] = Field(
        default=None,
        description="Social-emotional learning assessment responses"
    )


class ComprehensiveAssessmentResponse(BaseModel):
    """Response for comprehensive assessment"""
    child_id: str
    assessment_date: str

    # Academic results
    academic_results: Dict

    # Speech/Language results
    speech_results: Optional[Dict]

    # SEL results
    sel_results: Optional[Dict]

    # Integrated analysis
    comprehensive_summary: Dict
    recommendations: List[str]
    personalized_plan: Dict



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting Baseline Assessment Service...")
    await database.connect()

    # Share dependencies via app state
    app.state.database = database
    app.state.item_repository = item_repository
    app.state.session_repository = session_repository

    item_count = await database.fetchval(
        "SELECT COUNT(*) FROM item_bank WHERE is_active = TRUE"
    ) or 0
    logger.info("Loaded %d calibrated assessment items", item_count)

    # Initialize comprehensive assessors
    app.state.speech_assessor = SpeechLanguageAssessor()
    app.state.sel_assessor = SocialEmotionalAssessor()
    logger.info("Initialized Speech and SEL assessors")

    try:
        yield
    finally:
        await app.state.speech_assessor.client.aclose()
        await app.state.sel_assessor.client.aclose()
        await database.close()
        logger.info("Shutting down Baseline Assessment Service...")


# Create FastAPI application
app = FastAPI(
    title="AIVO Baseline Assessment Service",
    version="1.0.0",
    description="IRT-based adaptive testing for skill assessment",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Endpoints
# ============================================

@app.post("/v1/assessment/start", response_model=StartAssessmentResponse)
async def start_assessment(request: StartAssessmentRequest):
    """
    Start new adaptive assessment

    Flow:
    1. Create session
    2. Select initial item (medium difficulty)
    3. Return item and session info
    """
    session = session_manager.create_session(
        child_id=request.child_id,
        subject=request.subject,
        grade=request.grade
    )
    await session_repository.create_session(
        session.session_id,
        request.child_id,
        request.subject,
        request.grade,
    )

    try:
        snapshot = await item_repository.get_snapshot(
            request.subject,
            request.grade
        )
    except ValueError as exc:  # No calibrated items
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc)
        ) from exc

    total_assessments = await session_repository.get_total_assessments(
        subject=request.subject,
        grade=request.grade,
    )

    first_item_params = item_selector.select_initial_item(
        list(snapshot.parameters.values()),
        snapshot.exposure_counts,
        total_assessments
    )

    if not first_item_params:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No items available in item bank"
        )

    # Track exposure
    await item_repository.increment_exposure(first_item_params.item_id)
    item_content = snapshot.content.get(first_item_params.item_id)

    first_item = {
        "item_id": first_item_params.item_id,
        "question": item_content.question if item_content else None,
        "options": item_content.options if item_content else None,
        "difficulty": round(first_item_params.difficulty, 2)
    }

    return StartAssessmentResponse(
        session_id=session.session_id,
        first_item=first_item,
        stats=session.get_stats()
    )


@app.post("/v1/assessment/submit", response_model=SubmitAnswerResponse)
async def submit_answer(request: SubmitAnswerRequest):
    """
    Submit answer and get next item

    Flow:
    1. Validate answer
    2. Update ability estimate
    3. Check stopping criteria
    4. Select next item or complete
    """
    session = session_manager.get_session(request.session_id)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {request.session_id} not found"
        )

    try:
        snapshot = await item_repository.get_snapshot(
            session.subject,
            session.grade
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc)
        ) from exc

    # Get correct answer
    item_content = snapshot.content.get(request.item_id)
    if not item_content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {request.item_id} not found"
        )

    correct = (request.answer == item_content.correct_answer)

    # Submit response and update ability
    stats = session_manager.submit_response(
        request.session_id,
        request.item_id,
        correct,
        request.response_time_ms,
        snapshot.parameters
    )

    last_response = session.responses[-1]
    await session_repository.record_response(
        session_id=request.session_id,
        item_id=request.item_id,
        answer=request.answer,
        correct=correct,
        response_time_ms=request.response_time_ms,
        theta_before=last_response.theta_before,
        theta_after=last_response.theta_after,
    )
    await session_repository.update_progress(
        request.session_id,
        stats,
    )

    # Check stopping criteria
    should_stop, reason = session_manager.check_stopping_criteria(
        request.session_id
    )

    next_item = None

    if not should_stop:
        total_assessments = await session_repository.get_total_assessments(
            subject=session.subject,
            grade=session.grade,
        )

        # Select next item
        next_item_params = item_selector.select_next_item(
            session.theta,
            list(snapshot.parameters.values()),
            session.administered_items,
            snapshot.exposure_counts,
            total_assessments
        )

        if next_item_params:
            # Track exposure
            await item_repository.increment_exposure(next_item_params.item_id)
            next_content = snapshot.content.get(next_item_params.item_id)

            next_item = {
                "item_id": next_item_params.item_id,
                "question": (
                    next_content.question if next_content else None
                ),
                "options": (
                    next_content.options if next_content else None
                ),
                "difficulty": round(next_item_params.difficulty, 2)
            }
        else:
            should_stop = True
            reason = "No more available items"

    return SubmitAnswerResponse(
        correct=correct,
        next_item=next_item,
        stats=stats,
        should_continue=not should_stop,
        message=reason
    )


@app.post("/v1/assessment/complete", response_model=CompleteAssessmentResponse)
async def complete_assessment(session_id: str):
    """
    Complete assessment and generate skill vector

    Flow:
    1. Mark session complete
    2. Calculate skill vector
    3. Identify strengths/weaknesses
    4. Generate recommendations
    """
    session = session_manager.get_session(session_id)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found"
        )

    # Complete session
    final_stats = session_manager.complete_session(session_id)
    await session_repository.update_progress(session_id, final_stats)

    snapshot = await item_repository.get_snapshot(
        session.subject,
        session.grade,
    )

    # Calculate skill vector
    skill_vector = skill_analyzer.calculate_skill_vector(
        session.responses,
        snapshot.parameters,
        snapshot.skills,
        session.theta
    )

    # Analyze strengths/weaknesses
    analysis = skill_analyzer.identify_strengths_weaknesses(skill_vector)

    # Generate recommendations
    recommendations = skill_analyzer.generate_recommendations(
        skill_vector,
        analysis
    )

    # Format skill vector for response
    formatted_skills = {
        skill: {
            "mastery": mastery.mastery,
            "confidence": mastery.confidence,
            "items_answered": mastery.items_answered
        }
        for skill, mastery in skill_vector.items()
    }

    await session_repository.complete_session(
        session_id,
        skill_vector,
        recommendations,
    )

    return CompleteAssessmentResponse(
        session_id=session_id,
        final_theta=session.theta,
        standard_error=session.standard_error,
        num_items=len(session.responses),
        percent_correct=session.get_percent_correct(),
        duration_seconds=session.get_duration_seconds(),
        skill_vector=formatted_skills,
        strengths_weaknesses=analysis,
        recommendations=recommendations
    )


@app.get("/v1/assessment/session/{session_id}")
async def get_session_status(session_id: str):
    """Get current session status"""
    session = session_manager.get_session(session_id)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found"
        )

    stop_check = stopping_criteria.get_assessment_stats(
        len(session.responses),
        session.standard_error,
        session.theta
    )

    return {
        "session": session.get_stats(),
        "stopping_criteria": stop_check
    }


@app.post("/v1/assessment/comprehensive",
          response_model=ComprehensiveAssessmentResponse)
async def conduct_comprehensive_assessment(
    request: ComprehensiveAssessmentRequest
):
    """
    Conduct comprehensive baseline assessment including:
    - Academic assessment (IRT-based adaptive testing)
    - Speech and language evaluation
    - Social-emotional learning assessment

    Returns integrated results with cross-domain analysis and
    personalized AIVO learning plan
    """
    from datetime import datetime

    logger.info(
        f"Starting comprehensive assessment for child {request.child_id}"
    )

    results = {
        "child_id": request.child_id,
        "assessment_date": datetime.now().isoformat(),
        "academic_results": {},
        "speech_results": None,
        "sel_results": None,
        "comprehensive_summary": {},
        "recommendations": [],
        "personalized_plan": {}
    }

    # 1. Conduct Academic Assessments (IRT-based)
    academic_results = {}
    for subject in request.academic_subjects:
        # Start academic assessment session
        session = session_manager.create_session(
            child_id=request.child_id,
            subject=subject,
            grade=request.grade
        )
        await session_repository.create_session(
            session.session_id,
            request.child_id,
            subject,
            request.grade,
        )

        # This is simplified - in real implementation, would conduct full
        # adaptive test. For now, we'll store session info
        academic_results[subject] = {
            "session_id": session.session_id,
            "status": "initiated",
            "subject": subject,
            "grade": request.grade,
            "message": "Academic assessment session created. "
                      "Use /v1/assessment/start to begin adaptive test."
        }

    results["academic_results"] = academic_results

    # 2. Conduct Speech & Language Assessment
    if request.speech_assessment_data:
        logger.info("Conducting speech and language assessment...")
        try:
            speech_assessment = \
                await app.state.speech_assessor.conduct_comprehensive_assessment(
                    child_id=request.child_id,
                    age=request.age,
                    grade=request.grade,
                    assessment_data=request.speech_assessment_data
                )
            results["speech_results"] = speech_assessment.to_dict()
            logger.info("Speech assessment completed")
        except Exception as e:
            logger.error(f"Speech assessment failed: {e}")
            results["speech_results"] = {"error": str(e)}

    # 3. Conduct SEL Assessment
    if request.sel_assessment_data:
        logger.info("Conducting SEL assessment...")
        try:
            sel_assessment = \
                await app.state.sel_assessor.conduct_comprehensive_assessment(
                    child_id=request.child_id,
                    age=request.age,
                    grade=request.grade,
                    assessment_data=request.sel_assessment_data
                )
            results["sel_results"] = sel_assessment.to_dict()
            logger.info("SEL assessment completed")
        except Exception as e:
            logger.error(f"SEL assessment failed: {e}")
            results["sel_results"] = {"error": str(e)}

    # 4. Generate Comprehensive Summary
    summary = _generate_comprehensive_summary(
        academic_results,
        results.get("speech_results"),
        results.get("sel_results")
    )
    results["comprehensive_summary"] = summary

    # 5. Generate Integrated Recommendations
    recommendations = _generate_integrated_recommendations(
        academic_results,
        results.get("speech_results"),
        results.get("sel_results")
    )
    results["recommendations"] = recommendations

    # 6. Create Personalized AIVO Learning Plan
    personalized_plan = _create_personalized_plan(
        request.child_id,
        request.age,
        request.grade,
        academic_results,
        results.get("speech_results"),
        results.get("sel_results")
    )
    results["personalized_plan"] = personalized_plan

    logger.info(
        f"Comprehensive assessment completed for child {request.child_id}"
    )

    return ComprehensiveAssessmentResponse(**results)


def _generate_comprehensive_summary(
    academic_results: Dict,
    speech_results: Optional[Dict],
    sel_results: Optional[Dict]
) -> Dict:
    """Generate comprehensive summary across all domains"""

    summary = {
        "domains_assessed": [],
        "overall_profile": "",
        "cross_domain_patterns": [],
        "priority_needs": []
    }

    # Identify assessed domains
    if academic_results:
        summary["domains_assessed"].append("academic")
    if speech_results and "error" not in speech_results:
        summary["domains_assessed"].append("speech_language")
    if sel_results and "error" not in sel_results:
        summary["domains_assessed"].append("social_emotional")

    # Analyze cross-domain patterns
    patterns = []

    # Check for language-academic connections
    if (speech_results and sel_results and
        "error" not in speech_results and "error" not in sel_results):

        # Language delays may impact academic performance
        if speech_results.get("language", {}).get("age_appropriate") is False:
            patterns.append(
                "Language delays may impact reading comprehension and "
                "written expression"
            )

        # Pragmatic difficulties may relate to social skills
        if (not speech_results.get("pragmatics", {}).get("age_appropriate") and
            sel_results.get("casel_competencies", {})
            .get("relationship_skills", {}).get("level") in
            ["below_expected", "significantly_below"]):
            patterns.append(
                "Social communication challenges evident across speech "
                "and SEL domains"
            )

    # Check for attention/executive function patterns
    if sel_results and "error" not in sel_results:
        ef_score = (sel_results.get("executive_function", {})
                   .get("overall_score", 70))
        if ef_score < 60:
            patterns.append(
                "Executive function challenges may impact academic "
                "performance and organization"
            )
            summary["priority_needs"].append("executive_function_support")

    # Determine overall profile
    if len(summary["domains_assessed"]) >= 3:
        summary["overall_profile"] = (
            "Comprehensive evaluation completed across academic, "
            "speech/language, and social-emotional domains"
        )
    elif len(summary["domains_assessed"]) >= 2:
        summary["overall_profile"] = (
            f"Multi-domain evaluation completed: "
            f"{', '.join(summary['domains_assessed'])}"
        )
    else:
        summary["overall_profile"] = "Limited assessment data available"

    summary["cross_domain_patterns"] = patterns

    return summary


def _generate_integrated_recommendations(
    academic_results: Dict,
    speech_results: Optional[Dict],
    sel_results: Optional[Dict]
) -> List[str]:
    """Generate integrated recommendations across all domains"""

    recommendations = []

    # Academic recommendations
    if academic_results:
        recommendations.append(
            "Complete adaptive academic assessment in all subject areas"
        )

    # Speech recommendations
    if speech_results and "error" not in speech_results:
        if speech_results.get("summary", {}).get("therapy_recommended"):
            severity = speech_results.get("summary", {}).get("overall_severity")
            duration = speech_results.get("summary", {}).get(
                "estimated_therapy_duration"
            )
            recommendations.append(
                f"Speech-language therapy recommended "
                f"({severity} severity, {duration})"
            )

        # Add top speech recommendations
        speech_recs = speech_results.get("summary", {}).get("recommendations", [])
        recommendations.extend(speech_recs[:3])

    # SEL recommendations
    if sel_results and "error" not in sel_results:
        if sel_results.get("summary", {}).get("intervention_recommended"):
            recommendations.append(
                "Social-emotional learning intervention recommended"
            )

        # Mental health concerns
        if sel_results.get("mental_health", {}).get("referral_recommended"):
            recommendations.append(
                "Mental health referral recommended - "
                "consult school counselor or psychologist"
            )

        # Add top SEL recommendations
        sel_recs = sel_results.get("summary", {}).get("recommendations", [])
        recommendations.extend(sel_recs[:3])

    # Integrated recommendations
    if speech_results and sel_results:
        if (speech_results.get("pragmatics", {}).get("age_appropriate") is False and
            sel_results.get("summary", {}).get("intervention_recommended")):
            recommendations.append(
                "Consider integrated social communication intervention "
                "combining speech therapy and SEL"
            )

    return recommendations


def _create_personalized_plan(
    child_id: str,
    age: float,
    grade: str,
    academic_results: Dict,
    speech_results: Optional[Dict],
    sel_results: Optional[Dict]
) -> Dict:
    """Create personalized AIVO learning plan"""

    plan = {
        "child_id": child_id,
        "plan_name": f"Personalized AIVO Learning Plan - Grade {grade}",
        "focus_areas": [],
        "weekly_schedule": {},
        "goals": [],
        "accommodations": [],
        "parent_involvement": []
    }

    # Academic focus
    if academic_results:
        for subject in academic_results.keys():
            plan["focus_areas"].append(f"academic_{subject}")
            plan["goals"].append(
                f"Progress monitoring and skill building in {subject}"
            )

    # Speech therapy schedule
    if speech_results and "error" not in speech_results:
        if speech_results.get("summary", {}).get("therapy_recommended"):
            priority_areas = speech_results.get("summary", {}).get(
                "priority_areas", []
            )
            for area in priority_areas:
                plan["focus_areas"].append(f"speech_{area}")

            severity = speech_results.get("summary", {}).get("overall_severity")
            if severity == "severe":
                plan["weekly_schedule"]["speech_therapy"] = "2-3 sessions per week"
            elif severity == "moderate":
                plan["weekly_schedule"]["speech_therapy"] = "1-2 sessions per week"
            else:
                plan["weekly_schedule"]["speech_therapy"] = "1 session per week"

            plan["goals"].append(
                "Improve speech and language skills through targeted therapy"
            )
            plan["parent_involvement"].append(
                "Practice speech exercises at home 10-15 minutes daily"
            )

    # SEL activities schedule
    if sel_results and "error" not in sel_results:
        priority_areas = sel_results.get("summary", {}).get("priority_areas", [])
        for area in priority_areas:
            plan["focus_areas"].append(f"sel_{area}")

        if sel_results.get("summary", {}).get("intervention_recommended"):
            plan["weekly_schedule"]["sel_activities"] = "Daily SEL curriculum"
            plan["weekly_schedule"]["counseling"] = "Weekly check-ins"
        else:
            plan["weekly_schedule"]["sel_activities"] = (
                "Daily SEL moments and mindfulness"
            )

        plan["goals"].append(
            "Develop social-emotional competencies and coping skills"
        )
        plan["parent_involvement"].append(
            "Emotion check-ins and mindfulness practice at home"
        )

    # Accommodations
    if sel_results:
        ef_appropriate = sel_results.get("executive_function", {}).get(
            "age_appropriate", True
        )
        if not ef_appropriate:
            plan["accommodations"].extend([
                "Extended time for assignments",
                "Organizational tools and visual schedules",
                "Breaking tasks into smaller steps"
            ])

    if speech_results:
        if not speech_results.get("articulation", {}).get("age_appropriate"):
            plan["accommodations"].append(
                "Allow extra time for verbal responses"
            )
        if not speech_results.get("language", {}).get("age_appropriate"):
            plan["accommodations"].append(
                "Provide visual supports and simplified language"
            )

    return plan


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    item_count = await database.fetchval(
        "SELECT COUNT(*) FROM item_bank WHERE is_active = TRUE"
    ) or 0
    return {
        "status": "healthy",
        "service": "baseline-assessment-svc",
        "version": "2.0.0",
        "item_bank_size": item_count,
        "active_sessions": len(session_manager.sessions),
        "features": [
            "irt_adaptive_testing",
            "speech_language_assessment",
            "sel_assessment",
            "comprehensive_evaluation"
        ]
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AIVO Baseline Assessment",
        "version": "2.0.0",
        "description": "Comprehensive baseline assessment with academic, "
                      "speech/language, and social-emotional evaluation",
        "endpoints": {
            "comprehensive": "/v1/assessment/comprehensive",
            "start": "/v1/assessment/start",
            "submit": "/v1/assessment/submit",
            "complete": "/v1/assessment/complete",
            "status": "/v1/assessment/session/{session_id}"
        }
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8003,
        reload=True,
        log_level="info"
    )
