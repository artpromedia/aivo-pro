"""
Request/Response schemas for AIVO Main Brain API
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal
from datetime import datetime


class StudentContext(BaseModel):
    """Student-specific context for personalized learning"""
    student_id: str
    grade: str = Field(..., description="K-12 grade level (K, 1-12)")
    subject: str = Field(..., description="Math, Reading, Science, Social Studies, etc.")
    learning_style: Literal["visual", "auditory", "kinesthetic", "reading"] = "visual"
    skill_level: Literal["below_grade", "grade_level", "above_grade"] = "grade_level"
    disability: Optional[str] = Field(None, description="adhd, autism, dyslexia, anxiety, etc.")
    accommodations: List[str] = Field(default_factory=list)
    curriculum_standard: Optional[str] = Field(None, description="Common Core, State-specific, etc.")


class GenerateRequest(BaseModel):
    """Request for AI content generation"""
    prompt: str = Field(..., description="User's question or content request")
    context: StudentContext
    stream: bool = Field(False, description="Stream response in real-time")
    max_tokens: Optional[int] = Field(None, description="Override max tokens")
    temperature: Optional[float] = Field(None, description="Override temperature")


class GenerateResponse(BaseModel):
    """Response from AI generation"""
    response: str
    model: str
    tokens_used: int
    context_applied: Dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AssessmentCriteria(BaseModel):
    """Criteria for assessing student responses"""
    subject: str
    grade: str
    learning_objective: str
    rubric: Optional[Dict] = None


class AssessRequest(BaseModel):
    """Request to assess student response"""
    student_response: str
    criteria: AssessmentCriteria
    expected_answer: Optional[str] = None


class AssessResponse(BaseModel):
    """Assessment results"""
    correctness: float = Field(..., ge=0, le=100, description="Score 0-100")
    understanding_level: Literal["excellent", "good", "needs_improvement", "poor"]
    feedback: str
    strengths: List[str]
    areas_for_improvement: List[str]
    next_steps: str


class CurriculumQuery(BaseModel):
    """Query curriculum knowledge base"""
    subject: str
    grade_level: str
    topic: str
    state: Optional[str] = Field(None, description="State for state-specific standards")


class CurriculumResponse(BaseModel):
    """Curriculum knowledge response"""
    subject: str
    grade_level: str
    standards: List[str]
    learning_objectives: List[str]
    content_summary: str
    related_topics: List[str]


class LessonGenerationRequest(BaseModel):
    """Request to generate a lesson"""
    topic: str
    grade: str
    subject: str
    duration: int = Field(30, description="Lesson duration in minutes")
    learning_objectives: List[str]
    student_context: StudentContext


class LessonPlan(BaseModel):
    """Generated lesson plan"""
    title: str
    grade: str
    subject: str
    duration: int
    learning_objectives: List[str]
    introduction: str
    main_content: List[Dict]
    activities: List[Dict]
    assessment: Dict
    accommodations: List[str]
    resources: List[str]


class HealthResponse(BaseModel):
    """Health check response"""
    status: Literal["healthy", "degraded", "unhealthy"]
    model_loaded: bool
    device: str
    model_name: str
    gpu_available: bool
    memory_usage: Optional[Dict] = None


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
