"""
Analytics & Insights Agent Service
Platform KPIs, learning metrics, and predictive insights
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
from enum import Enum
import logging

from .platform_kpis import PlatformKPIAnalyzer
from .learning_metrics import LearningMetricsAnalyzer
from .revenue_analytics import RevenueAnalyzer
from .engagement import EngagementAnalyzer
from .config import Settings

# Initialize FastAPI app
app = FastAPI(
    title="Analytics & Insights Service",
    description="Platform analytics and KPIs",
    version="1.0.0"
)

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
# ENUMS
# ===========================================================================

class TimeRange(str, Enum):
    """Time range for analytics"""
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"


# ===========================================================================
# MODELS
# ===========================================================================

class PlatformKPIs(BaseModel):
    """Platform-wide KPIs"""
    total_users: int
    active_users: int
    total_sessions: int
    avg_session_duration: float  # minutes
    completion_rate: float  # percentage
    retention_rate: float  # percentage
    nps_score: Optional[float] = None


class LearningMetrics(BaseModel):
    """Learning effectiveness metrics"""
    total_learners: int
    hours_practiced: float
    skills_mastered: int
    avg_mastery_rate: float  # percentage
    avg_time_to_mastery: float  # hours
    top_skills: List[Dict[str, int]]


class RevenueMetrics(BaseModel):
    """Revenue analytics"""
    mrr: float  # Monthly Recurring Revenue
    arr: float  # Annual Recurring Revenue
    arpu: float  # Average Revenue Per User
    ltv: float  # Lifetime Value
    churn_rate: float  # percentage
    new_subscriptions: int
    canceled_subscriptions: int


class EngagementMetrics(BaseModel):
    """User engagement metrics"""
    dau: int  # Daily Active Users
    mau: int  # Monthly Active Users
    avg_sessions_per_user: float
    avg_time_per_session: float  # minutes
    feature_adoption_rate: float  # percentage
    top_features: List[Dict[str, int]]


# ===========================================================================
# ENDPOINTS - PLATFORM KPIs
# ===========================================================================

@app.get("/")
async def root():
    """Service health check"""
    return {
        "service": "analytics-insights-svc",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow()
    }


@app.get("/v1/platform/kpis", response_model=PlatformKPIs)
async def get_platform_kpis(time_range: TimeRange = TimeRange.MONTH):
    """
    Get platform-wide KPIs
    
    Includes:
    - User metrics (total, active, retention)
    - Session metrics (count, duration)
    - Engagement metrics (completion, NPS)
    """
    try:
        analyzer = PlatformKPIAnalyzer()
        kpis = await analyzer.calculate_kpis(time_range.value)
        
        return PlatformKPIs(**kpis)
    
    except Exception as e:
        logger.error("Failed to calculate platform KPIs: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate KPIs: {str(e)}"
        ) from e


@app.get("/v1/platform/dashboard")
async def get_platform_dashboard():
    """
    Get comprehensive platform dashboard
    
    Combines all key metrics in single view
    """
    try:
        # Calculate all metrics
        kpi_analyzer = PlatformKPIAnalyzer()
        learning_analyzer = LearningMetricsAnalyzer()
        revenue_analyzer = RevenueAnalyzer()
        engagement_analyzer = EngagementAnalyzer()
        
        kpis = await kpi_analyzer.calculate_kpis("month")
        learning = await learning_analyzer.calculate_metrics("month")
        revenue = await revenue_analyzer.calculate_metrics("month")
        engagement = await engagement_analyzer.calculate_metrics("month")
        
        return {
            "platform_kpis": kpis,
            "learning_metrics": learning,
            "revenue_metrics": revenue,
            "engagement_metrics": engagement,
            "timestamp": datetime.utcnow()
        }
    
    except Exception as e:
        logger.error("Failed to generate dashboard: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate dashboard: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - LEARNING METRICS
# ===========================================================================

@app.get("/v1/learning/metrics", response_model=LearningMetrics)
async def get_learning_metrics(
    time_range: TimeRange = TimeRange.MONTH
):
    """
    Get learning effectiveness metrics
    
    Tracks:
    - Practice hours
    - Skills mastered
    - Mastery rates
    - Time to mastery
    """
    try:
        analyzer = LearningMetricsAnalyzer()
        metrics = await analyzer.calculate_metrics(time_range.value)
        
        return LearningMetrics(**metrics)
    
    except Exception as e:
        logger.error("Failed to calculate learning metrics: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate metrics: {str(e)}"
        ) from e


@app.get("/v1/learning/student/{student_id}")
async def get_student_analytics(student_id: str):
    """Get detailed analytics for a specific student"""
    try:
        analyzer = LearningMetricsAnalyzer()
        analytics = await analyzer.get_student_analytics(student_id)
        
        if not analytics:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )
        
        return analytics
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get student analytics: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get analytics: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - REVENUE ANALYTICS
# ===========================================================================

@app.get("/v1/revenue/metrics", response_model=RevenueMetrics)
async def get_revenue_metrics(time_range: TimeRange = TimeRange.MONTH):
    """
    Get revenue analytics
    
    Includes:
    - MRR/ARR
    - ARPU and LTV
    - Churn rate
    - Subscription changes
    """
    try:
        analyzer = RevenueAnalyzer()
        metrics = await analyzer.calculate_metrics(time_range.value)
        
        return RevenueMetrics(**metrics)
    
    except Exception as e:
        logger.error("Failed to calculate revenue metrics: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate metrics: {str(e)}"
        ) from e


@app.get("/v1/revenue/forecast")
async def get_revenue_forecast(months: int = Query(default=6, ge=1, le=24)):
    """
    Generate revenue forecast
    
    Uses historical data to predict future revenue
    """
    try:
        analyzer = RevenueAnalyzer()
        forecast = await analyzer.generate_forecast(months)
        
        return {
            "forecast_months": months,
            "projections": forecast,
            "confidence_interval": 0.95
        }
    
    except Exception as e:
        logger.error("Failed to generate forecast: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate forecast: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - ENGAGEMENT
# ===========================================================================

@app.get("/v1/engagement/metrics", response_model=EngagementMetrics)
async def get_engagement_metrics(
    time_range: TimeRange = TimeRange.MONTH
):
    """
    Get user engagement metrics
    
    Tracks:
    - Daily/Monthly Active Users
    - Session frequency and duration
    - Feature adoption
    """
    try:
        analyzer = EngagementAnalyzer()
        metrics = await analyzer.calculate_metrics(time_range.value)
        
        return EngagementMetrics(**metrics)
    
    except Exception as e:
        logger.error("Failed to calculate engagement: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate engagement: {str(e)}"
        ) from e


@app.get("/v1/engagement/cohort")
async def get_cohort_analysis(cohort_date: str):
    """
    Perform cohort analysis
    
    Track retention for users who joined in specific period
    """
    try:
        analyzer = EngagementAnalyzer()
        cohort = await analyzer.analyze_cohort(cohort_date)
        
        return cohort
    
    except Exception as e:
        logger.error("Failed to analyze cohort: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze cohort: {str(e)}"
        ) from e


# ===========================================================================
# ENDPOINTS - INSIGHTS
# ===========================================================================

@app.get("/v1/insights/recommendations")
async def get_recommendations():
    """
    Get AI-powered insights and recommendations
    
    Analyzes patterns and suggests actions
    """
    try:
        # Gather insights from all analyzers
        kpi_analyzer = PlatformKPIAnalyzer()
        insights = await kpi_analyzer.generate_insights()
        
        return {
            "insights": insights,
            "generated_at": datetime.utcnow()
        }
    
    except Exception as e:
        logger.error("Failed to generate insights: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate insights: {str(e)}"
        ) from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8013)
