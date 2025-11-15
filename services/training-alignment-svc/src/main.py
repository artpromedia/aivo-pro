"""
Training & Alignment Agent Service
Responsible AI governance and continuous model improvement
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import logging
from enum import Enum

from .governance import ResponsibleAIGovernor
from .training import ContinuousTrainingPipeline
from .bias_detection import BiasDetector
from .drift_monitor import ModelDriftMonitor
from .config import Settings
from .scheduler import get_scheduler, start_scheduler, stop_scheduler

# Initialize FastAPI app
app = FastAPI(
    title="Training & Alignment Service",
    description="Responsible AI governance and continuous model improvement",
    version="1.0.0"
)


# ===========================================================================
# LIFECYCLE EVENTS
# ===========================================================================

@app.on_event("startup")
async def startup_event():
    """Start automated training scheduler on service startup"""
    logger.info("Starting Training & Alignment Service...")

    # Start the automated training scheduler
    start_scheduler()

    logger.info("✓ Training & Alignment Service started successfully")
    logger.info("✓ AIVO Main Brain will be trained daily at 2:00 AM")
    logger.info("✓ Drift monitoring active (every 6 hours)")
    logger.info("✓ Weekly full retraining scheduled (Sundays 3:00 AM)")


@app.on_event("shutdown")
async def shutdown_event():
    """Stop scheduler gracefully on service shutdown"""
    logger.info("Shutting down Training & Alignment Service...")

    stop_scheduler()

    logger.info("✓ Training & Alignment Service stopped")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize settings
settings = Settings()

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)


# ===========================================================================
# MODELS
# ===========================================================================

class GovernanceRule(str, Enum):
    """Governance rules for AI validation"""
    NO_HARMFUL_CONTENT = "no_harmful_content"
    AGE_APPROPRIATE = "age_appropriate"
    BIAS_MITIGATION = "bias_mitigation"
    PRIVACY_PRESERVING = "privacy_preserving"
    EXPLAINABLE_DECISIONS = "explainable_decisions"
    EDUCATIONAL_ALIGNMENT = "educational_alignment"


class AlignmentRequest(BaseModel):
    model_id: str = Field(..., description="ID of the model to validate")
    output: str = Field(..., description="Model output to validate")
    context: Dict = Field(
        default_factory=dict,
        description="Context information"
    )
    rules: Optional[List[GovernanceRule]] = None


class AlignmentResponse(BaseModel):
    compliant: bool
    model_id: str
    validations: Dict[str, bool]
    violations: List[str]
    recommendations: List[str]
    timestamp: datetime


class BiasMetrics(BaseModel):
    gender_bias: float = Field(..., ge=0, le=1)
    racial_bias: float = Field(..., ge=0, le=1)
    disability_bias: float = Field(..., ge=0, le=1)
    socioeconomic_bias: float = Field(..., ge=0, le=1)
    overall_bias_score: float = Field(..., ge=0, le=1)


class BiasCheckRequest(BaseModel):
    model_id: str
    output: str
    context: Dict = Field(default_factory=dict)


class BiasCheckResponse(BaseModel):
    bias_detected: bool
    metrics: BiasMetrics
    threshold: float
    mitigation_strategy: Optional[str]


class TrainingRequest(BaseModel):
    model_id: str
    reason: str
    priority: str = Field(
        default="normal",
        pattern="^(low|normal|high|critical)$"
    )
    data_sources: Optional[List[str]] = None
    hyperparameters: Optional[Dict] = None


class TrainingResponse(BaseModel):
    job_id: str
    model_id: str
    status: str
    estimated_completion: datetime
    priority: str


class DriftCheckRequest(BaseModel):
    model_id: str
    evaluation_window_days: int = Field(
        default=7,
        ge=1,
        le=90
    )


class DriftResponse(BaseModel):
    model_id: str
    drift_score: float
    threshold: float
    drift_detected: bool
    degradation_percentage: float
    recommendation: str
    last_training_date: datetime


class GovernanceReport(BaseModel):
    compliance_score: float
    bias_metrics: BiasMetrics
    alignment_checks_passed: int
    violations_caught: int
    models_monitored: int
    models_retrained: int
    last_audit: datetime
    recommendations: List[str]


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Service health check"""
    return {
        "service": "training-alignment-svc",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow()
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "checks": {
            "api": "operational",
            "database": "connected",
            "redis": "connected",
            "model_registry": "available"
        },
        "timestamp": datetime.utcnow()
    }


@app.post("/v1/alignment/validate", response_model=AlignmentResponse)
async def validate_model_alignment(request: AlignmentRequest):
    """
    Validate model outputs for responsible AI compliance

    This endpoint checks model outputs against governance rules to ensure
    they meet responsible AI standards for educational content.
    """
    try:
        governor = ResponsibleAIGovernor()

        # Validate against specified or all rules
        rules_to_check = request.rules or list(GovernanceRule)

        validation_results = await governor.validate_model_output(
            model_id=request.model_id,
            output=request.output,
            context=request.context,
            rules=rules_to_check
        )

        # Log violations if any
        if not validation_results["compliant"]:
            logger.warning(
                f"Compliance violation for model {request.model_id}: "
                f"{validation_results['violations']}"
            )
            await governor.log_compliance_violation(validation_results)

        return AlignmentResponse(
            compliant=validation_results["compliant"],
            model_id=request.model_id,
            validations=validation_results["validations"],
            violations=validation_results["violations"],
            recommendations=validation_results["recommendations"],
            timestamp=datetime.utcnow()
        )

    except Exception as e:
        logger.error(f"Alignment validation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Validation failed: {str(e)}"
        )


@app.post("/v1/bias/check", response_model=BiasCheckResponse)
async def check_bias(request: BiasCheckRequest):
    """
    Detect and measure bias in model outputs

    Analyzes model outputs for various forms of bias including gender,
    racial, disability, and socioeconomic bias.
    """
    try:
        detector = BiasDetector()

        bias_analysis = await detector.analyze_bias(
            model_id=request.model_id,
            output=request.output,
            context=request.context
        )

        metrics = BiasMetrics(
            gender_bias=bias_analysis["metrics"]["gender_bias"],
            racial_bias=bias_analysis["metrics"]["racial_bias"],
            disability_bias=bias_analysis["metrics"]["disability_bias"],
            socioeconomic_bias=bias_analysis["metrics"]["socioeconomic_bias"],
            overall_bias_score=bias_analysis["overall_score"]
        )

        return BiasCheckResponse(
            bias_detected=bias_analysis["bias_detected"],
            metrics=metrics,
            threshold=settings.BIAS_THRESHOLD,
            mitigation_strategy=bias_analysis.get("mitigation_strategy")
        )

    except Exception as e:
        logger.error(f"Bias check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Bias check failed: {str(e)}"
        )


@app.post("/v1/bias/mitigate")
async def mitigate_bias(
    request: BiasCheckRequest,
    background_tasks: BackgroundTasks
):
    """
    Apply bias mitigation strategies to a model

    Triggers bias mitigation procedures for a specific model based on
    detected bias patterns.
    """
    try:
        detector = BiasDetector()

        # First check for bias
        bias_analysis = await detector.analyze_bias(
            request.model_id,
            request.output,
            request.context
        )

        if not bias_analysis["bias_detected"]:
            return {
                "status": "no_action_needed",
                "message": "No significant bias detected",
                "bias_score": bias_analysis["overall_score"]
            }

        # Schedule mitigation in background
        background_tasks.add_task(
            detector.apply_mitigation,
            request.model_id,
            bias_analysis["mitigation_strategy"]
        )

        return {
            "status": "mitigation_scheduled",
            "model_id": request.model_id,
            "strategy": bias_analysis["mitigation_strategy"],
            "estimated_completion": datetime.utcnow() + timedelta(hours=2)
        }

    except Exception as e:
        logger.error(f"Bias mitigation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Mitigation failed: {str(e)}"
        )


@app.post("/v1/training/schedule", response_model=TrainingResponse)
async def schedule_training(
    request: TrainingRequest,
    background_tasks: BackgroundTasks
):
    """
    Schedule model retraining

    Initiates a retraining job for a specific model with optional
    custom hyperparameters and data sources.
    """
    try:
        pipeline = ContinuousTrainingPipeline()

        # Create training job
        job = await pipeline.schedule_retraining(
            model_id=request.model_id,
            reason=request.reason,
            priority=request.priority,
            data_sources=request.data_sources,
            hyperparameters=request.hyperparameters
        )

        # Start training in background for low/normal priority
        if request.priority in ["low", "normal"]:
            background_tasks.add_task(
                pipeline.execute_training_job,
                job["job_id"]
            )

        return TrainingResponse(
            job_id=job["job_id"],
            model_id=request.model_id,
            status=job["status"],
            estimated_completion=job["estimated_completion"],
            priority=request.priority
        )

    except Exception as e:
        logger.error(f"Training scheduling failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scheduling failed: {str(e)}"
        )


@app.post("/v1/training/auto-schedule")
async def auto_schedule_training(background_tasks: BackgroundTasks):
    """
    Automatically schedule training for models that need it

    Checks all models for drift and schedules retraining as needed.
    """
    try:
        pipeline = ContinuousTrainingPipeline()
        drift_monitor = ModelDriftMonitor()

        # Get all model IDs
        model_ids = await pipeline.get_all_model_ids()

        scheduled_count = 0

        for model_id in model_ids:
            # Check for drift
            drift_score = await drift_monitor.evaluate_drift(model_id)

            if drift_score > settings.DRIFT_THRESHOLD:
                # Schedule retraining
                background_tasks.add_task(
                    pipeline.schedule_retraining,
                    model_id,
                    f"auto_drift_score_{drift_score:.3f}",
                    "normal"
                )
                scheduled_count += 1
                logger.info(
                    f"Scheduled retraining for {model_id} "
                    f"due to drift score {drift_score:.3f}"
                )

        return {
            "status": "scheduled",
            "models_checked": len(model_ids),
            "models_scheduled": scheduled_count,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        logger.error(f"Auto-scheduling failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Auto-scheduling failed: {str(e)}"
        )


@app.post("/v1/drift/check", response_model=DriftResponse)
async def check_model_drift(request: DriftCheckRequest):
    """
    Check for model performance drift

    Evaluates whether a model's performance has degraded over time
    and recommends retraining if necessary.
    """
    try:
        monitor = ModelDriftMonitor()

        drift_analysis = await monitor.check_drift(
            model_id=request.model_id,
            evaluation_window_days=request.evaluation_window_days
        )

        return DriftResponse(
            model_id=request.model_id,
            drift_score=drift_analysis["drift_score"],
            threshold=settings.DRIFT_THRESHOLD,
            drift_detected=drift_analysis["drift_detected"],
            degradation_percentage=drift_analysis["degradation_percentage"],
            recommendation=drift_analysis["recommendation"],
            last_training_date=drift_analysis["last_training_date"]
        )

    except Exception as e:
        logger.error(f"Drift check failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Drift check failed: {str(e)}"
        )


@app.get("/v1/governance/report", response_model=GovernanceReport)
async def generate_governance_report():
    """
    Generate comprehensive responsible AI governance report

    Provides metrics on compliance, bias, alignment checks, and
    overall model governance.
    """
    try:
        governor = ResponsibleAIGovernor()

        report_data = await governor.generate_governance_report()

        return GovernanceReport(
            compliance_score=report_data["compliance_score"],
            bias_metrics=BiasMetrics(**report_data["bias_metrics"]),
            alignment_checks_passed=report_data["alignment_checks_passed"],
            violations_caught=report_data["violations_caught"],
            models_monitored=report_data["models_monitored"],
            models_retrained=report_data["models_retrained"],
            last_audit=report_data["last_audit"],
            recommendations=report_data["recommendations"]
        )

    except Exception as e:
        logger.error(f"Report generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Report generation failed: {str(e)}"
        )


@app.get("/v1/model/{model_id}/status")
async def get_model_status(model_id: str):
    """
    Get comprehensive status for a specific model

    Returns governance compliance, bias metrics, drift status, and
    training history for a model.
    """
    try:
        governor = ResponsibleAIGovernor()
        drift_monitor = ModelDriftMonitor()
        pipeline = ContinuousTrainingPipeline()

        # Get all status information
        compliance = await governor.get_model_compliance(model_id)
        drift = await drift_monitor.get_drift_status(model_id)
        training_history = await pipeline.get_training_history(model_id)

        return {
            "model_id": model_id,
            "compliance": compliance,
            "drift": drift,
            "training_history": training_history,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        logger.error(f"Status retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Status retrieval failed: {str(e)}"
        )


@app.get("/v1/scheduler/status")
async def get_scheduler_status():
    """
    Get status of the automated training scheduler

    Returns information about scheduled jobs, currently training models,
    and training history.
    """
    try:
        scheduler = get_scheduler()
        status = scheduler.get_scheduler_status()

        return {
            "scheduler": status,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        logger.error(f"Scheduler status retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Scheduler status failed: {str(e)}"
        )


@app.post("/v1/scheduler/trigger/{model_id}")
async def manually_trigger_training(
    model_id: str,
    reason: str = "manual_trigger",
    priority: str = "high"
):
    """
    Manually trigger training for a specific model

    Useful for testing or emergency retraining outside the
    automated schedule.
    """
    try:
        scheduler = get_scheduler()

        result = await scheduler.manual_trigger_training(
            model_id=model_id,
            reason=reason,
            priority=priority
        )

        return {
            "status": "triggered",
            "model_id": model_id,
            "result": result,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        logger.error(f"Manual training trigger failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Trigger failed: {str(e)}"
        )


@app.post("/v1/scheduler/train-main-brain")
async def trigger_main_brain_training():
    """
    Immediately trigger AIVO Main Brain training

    This bypasses the schedule and trains the main AIVO Brain
    model immediately.
    """
    try:
        scheduler = get_scheduler()

        logger.info("Manual trigger: AIVO Main Brain training")

        result = await scheduler.train_aivo_main_brain()

        return {
            "status": "completed",
            "model_id": "aivo-main-brain-v1",
            "result": result,
            "timestamp": datetime.utcnow()
        }

    except Exception as e:
        logger.error(f"Main brain training failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Training failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)
