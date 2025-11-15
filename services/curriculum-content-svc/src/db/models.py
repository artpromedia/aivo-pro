"""
Comprehensive K-12 Curriculum Database Models
Supports US, UK, EU, China, Africa, Middle East educational systems
All subjects: Math, Science, English, Social Studies, Languages, Arts, PE, CS
"""

from datetime import datetime
from typing import Optional
from uuid import uuid4
import enum

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Index, Text, Enum as SQLEnum, JSON
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class CurriculumSystem(str, enum.Enum):
    """Educational systems supported"""
    US_COMMON_CORE = "us_common_core"
    US_STATE_STANDARDS = "us_state_standards"
    UK_NATIONAL = "uk_national_curriculum"
    IB_PYP = "ib_pyp"  # International Baccalaureate Primary Years
    IB_MYP = "ib_myp"  # Middle Years Programme
    IB_DP = "ib_dp"  # Diploma Programme
    EUROPEAN_BACC = "european_baccalaureate"
    CHINESE_NATIONAL = "chinese_national"
    AFRICAN_UNION = "african_union_curriculum"
    SOUTH_AFRICAN = "south_african_caps"
    KENYAN = "kenyan_cbc"
    NIGERIAN = "nigerian_curriculum"
    GCSE = "gcse"  # UK
    A_LEVEL = "a_level"  # UK
    MIDDLE_EAST_GCC = "gcc_standards"
    SAUDI_ARABIAN = "saudi_curriculum"
    EMIRATES = "uae_curriculum"


class Subject(str, enum.Enum):
    """All subjects supported"""
    # Core subjects
    MATHEMATICS = "mathematics"
    SCIENCE = "science"
    ENGLISH_LANGUAGE_ARTS = "english_language_arts"
    SOCIAL_STUDIES = "social_studies"

    # Science sub-disciplines
    BIOLOGY = "biology"
    CHEMISTRY = "chemistry"
    PHYSICS = "physics"
    EARTH_SCIENCE = "earth_science"

    # Mathematics sub-disciplines
    ALGEBRA = "algebra"
    GEOMETRY = "geometry"
    CALCULUS = "calculus"
    STATISTICS = "statistics"

    # Languages
    SPANISH = "spanish"
    FRENCH = "french"
    MANDARIN = "mandarin"
    ARABIC = "arabic"
    GERMAN = "german"
    PORTUGUESE = "portuguese"
    SWAHILI = "swahili"

    # Arts & Humanities
    ART = "art"
    MUSIC = "music"
    DRAMA = "drama"
    LITERATURE = "literature"
    HISTORY = "history"
    GEOGRAPHY = "geography"
    CIVICS = "civics"
    ECONOMICS = "economics"

    # Technology & Skills
    COMPUTER_SCIENCE = "computer_science"
    CODING = "coding"
    DIGITAL_LITERACY = "digital_literacy"
    ROBOTICS = "robotics"

    # Physical & Life Skills
    PHYSICAL_EDUCATION = "physical_education"
    HEALTH = "health"
    LIFE_SKILLS = "life_skills"
    SOCIAL_EMOTIONAL_LEARNING = "social_emotional_learning"

    # Religious & Cultural
    RELIGIOUS_STUDIES = "religious_studies"
    CULTURAL_STUDIES = "cultural_studies"


class GradeLevel(str, enum.Enum):
    """Grade levels - flexible system"""
    PRE_K = "pre_k"
    KINDERGARTEN = "kindergarten"
    GRADE_1 = "grade_1"
    GRADE_2 = "grade_2"
    GRADE_3 = "grade_3"
    GRADE_4 = "grade_4"
    GRADE_5 = "grade_5"
    GRADE_6 = "grade_6"
    GRADE_7 = "grade_7"
    GRADE_8 = "grade_8"
    GRADE_9 = "grade_9"
    GRADE_10 = "grade_10"
    GRADE_11 = "grade_11"
    GRADE_12 = "grade_12"
    # International equivalents
    YEAR_1 = "year_1"  # UK system
    YEAR_13 = "year_13"


class ContentType(str, enum.Enum):
    """Types of learning content"""
    PROBLEM = "problem"
    QUESTION = "question"
    LESSON = "lesson"
    VIDEO = "video"
    ARTICLE = "article"
    SIMULATION = "simulation"
    GAME = "game"
    PROJECT = "project"
    ASSESSMENT = "assessment"
    PRACTICE = "practice"


class CurriculumStandard(Base):
    """Educational standards (Common Core, National Curriculum, etc.)"""
    __tablename__ = "curriculum_standards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    curriculum_system = Column(SQLEnum(CurriculumSystem), nullable=False)
    subject = Column(SQLEnum(Subject), nullable=False)
    grade_level = Column(SQLEnum(GradeLevel), nullable=False)

    # Standard identification
    standard_code = Column(String(100), nullable=False)  # e.g., CCSS.MATH.5.NBT.A.1
    standard_name = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)

    # Taxonomy
    domain = Column(String(200))  # e.g., "Number & Operations in Base Ten"
    cluster = Column(String(300))  # e.g., "Understand the place value system"

    # Relationships to skills
    skill_ids = Column(ARRAY(UUID(as_uuid=True)))

    # Metadata
    difficulty_level = Column(Float)  # 0.0 to 1.0
    typical_age_range = Column(String(50))  # e.g., "10-11 years"

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)

    __table_args__ = (
        Index('ix_standards_system_subject_grade',
              'curriculum_system', 'subject', 'grade_level'),
        Index('ix_standards_code', 'standard_code', unique=True),
    )


class Skill(Base):
    """Atomic learning skills (nodes in knowledge graph)"""
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    subject = Column(SQLEnum(Subject), nullable=False)

    # Skill identification
    skill_code = Column(String(100), nullable=False, unique=True)
    skill_name = Column(String(300), nullable=False)
    description = Column(Text)

    # Skill taxonomy
    grade_levels = Column(ARRAY(String(50)))  # Can span multiple grades
    difficulty = Column(Float, nullable=False)  # 0.0 to 1.0
    cognitive_level = Column(String(50))  # Bloom's: remember, understand, apply, analyze, evaluate, create

    # Prerequisites (skill graph edges stored separately in graph DB)
    prerequisite_ids = Column(ARRAY(UUID(as_uuid=True)))

    # Standards alignment
    standards = Column(JSONB)  # {system: [standard_ids]}

    # Content generation hints
    example_problems = Column(JSONB)  # Sample problems for this skill
    teaching_strategies = Column(JSONB)  # Pedagogical approaches
    common_misconceptions = Column(JSONB)  # Things students often get wrong

    # Usage statistics
    content_count = Column(Integer, default=0)
    total_attempts = Column(Integer, default=0)
    average_success_rate = Column(Float)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)

    __table_args__ = (
        Index('ix_skills_subject', 'subject'),
        Index('ix_skills_difficulty', 'difficulty'),
    )


class LearningContent(Base):
    """Individual learning content items"""
    __tablename__ = "learning_contents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    # Classification
    subject = Column(SQLEnum(Subject), nullable=False)
    content_type = Column(SQLEnum(ContentType), nullable=False)
    grade_level = Column(SQLEnum(GradeLevel), nullable=False)

    # Skills targeted
    primary_skill_id = Column(UUID(as_uuid=True), ForeignKey('skills.id'),
                             nullable=False)
    secondary_skill_ids = Column(ARRAY(UUID(as_uuid=True)))

    # Standards alignment
    standards = Column(JSONB)  # {system: [standard_ids]}

    # Content data
    title = Column(String(500))
    content_data = Column(JSONB, nullable=False)
    # Structure: {
    #   "question": str,
    #   "answer": any,
    #   "options": list (for multiple choice),
    #   "explanation": str,
    #   "hints": list,
    #   "media": {images, videos, audio},
    #   "interactive_elements": {}
    # }

    # Difficulty & targeting
    difficulty = Column(Float, nullable=False)  # 0.0 to 1.0
    irt_parameters = Column(JSONB)  # {a: discrimination, b: difficulty, c: guessing}
    estimated_time_seconds = Column(Integer)

    # Quality metrics
    quality_score = Column(Float)  # 0.0 to 1.0
    reviewed = Column(Boolean, default=False)
    review_score = Column(Float)

    # Usage tracking
    times_used = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    average_time_seconds = Column(Float)

    # Localization
    language = Column(String(10), nullable=False, default='en')
    translations = Column(JSONB)  # {lang_code: content_data}

    # Accessibility
    accessibility_features = Column(JSONB)
    # {text_to_speech, screen_reader, high_contrast, dyslexia_friendly}

    # Metadata
    author = Column(String(200))
    source = Column(String(200))  # "generated", "teacher_created", "expert_reviewed"
    tags = Column(ARRAY(String(100)))

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)

    __table_args__ = (
        Index('ix_content_subject_grade', 'subject', 'grade_level'),
        Index('ix_content_skill', 'primary_skill_id'),
        Index('ix_content_difficulty', 'difficulty'),
        Index('ix_content_quality', 'quality_score'),
    )


class LessonPlan(Base):
    """Structured lesson plans"""
    __tablename__ = "lesson_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    # Classification
    subject = Column(SQLEnum(Subject), nullable=False)
    grade_level = Column(SQLEnum(GradeLevel), nullable=False)
    curriculum_system = Column(SQLEnum(CurriculumSystem))

    # Lesson metadata
    title = Column(String(500), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer)

    # Skills & standards
    skills = Column(ARRAY(UUID(as_uuid=True)))
    standards = Column(JSONB)
    learning_objectives = Column(JSONB)  # List of objectives

    # Lesson structure
    lesson_plan = Column(JSONB, nullable=False)
    # {
    #   "warm_up": {activities, duration},
    #   "instruction": {content, examples, duration},
    #   "guided_practice": {activities, duration},
    #   "independent_practice": {content_ids, duration},
    #   "assessment": {content_ids, rubric},
    #   "closure": {summary, homework}
    # }

    # Resources
    materials = Column(JSONB)  # Required materials
    content_ids = Column(ARRAY(UUID(as_uuid=True)))  # Content used in lesson

    # Differentiation
    modifications = Column(JSONB)
    # {
    #   "struggling_learners": [],
    #   "advanced_learners": [],
    #   "ell_students": [],
    #   "special_needs": []
    # }

    # Quality
    quality_score = Column(Float)
    reviewed = Column(Boolean, default=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                       onupdate=datetime.utcnow)

    __table_args__ = (
        Index('ix_lessons_subject_grade', 'subject', 'grade_level'),
    )


class ContentTemplate(Base):
    """Templates for generating content"""
    __tablename__ = "content_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    # Classification
    subject = Column(SQLEnum(Subject), nullable=False)
    content_type = Column(SQLEnum(ContentType), nullable=False)
    skill_codes = Column(ARRAY(String(100)))

    # Template
    template_name = Column(String(200), nullable=False)
    template_structure = Column(JSONB, nullable=False)
    # Jinja2-style template with variables
    generation_rules = Column(JSONB)  # Rules for AI generation

    # Difficulty range
    min_difficulty = Column(Float)
    max_difficulty = Column(Float)

    # Quality
    success_rate = Column(Float)  # How often generated content is good
    times_used = Column(Integer, default=0)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        Index('ix_templates_subject', 'subject'),
    )


class AssessmentBank(Base):
    """Assessment items (tests, quizzes, exit tickets)"""
    __tablename__ = "assessment_bank"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    # Classification
    subject = Column(SQLEnum(Subject), nullable=False)
    grade_level = Column(SQLEnum(GradeLevel), nullable=False)
    assessment_type = Column(String(50))  # quiz, test, exit_ticket, benchmark

    # Content
    name = Column(String(300), nullable=False)
    instructions = Column(Text)
    content_ids = Column(ARRAY(UUID(as_uuid=True)))  # Questions in assessment

    # Scoring
    total_points = Column(Integer)
    time_limit_minutes = Column(Integer)
    rubric = Column(JSONB)

    # Standards coverage
    standards_covered = Column(JSONB)
    skills_assessed = Column(ARRAY(UUID(as_uuid=True)))

    # Statistics
    times_administered = Column(Integer, default=0)
    average_score = Column(Float)
    reliability_coefficient = Column(Float)  # Cronbach's alpha

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        Index('ix_assessments_subject_grade', 'subject', 'grade_level'),
    )


class SubjectScope(Base):
    """Scope and sequence for subjects"""
    __tablename__ = "subject_scopes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    # Identification
    curriculum_system = Column(SQLEnum(CurriculumSystem), nullable=False)
    subject = Column(SQLEnum(Subject), nullable=False)
    grade_level = Column(SQLEnum(GradeLevel), nullable=False)

    # Scope & sequence
    units = Column(JSONB, nullable=False)
    # [
    #   {
    #     "unit_number": 1,
    #     "name": "Number Operations",
    #     "duration_weeks": 4,
    #     "skills": [skill_ids],
    #     "standards": [standard_ids],
    #     "learning_outcomes": []
    #   }
    # ]

    # Pacing guide
    pacing_guide = Column(JSONB)
    # Weekly/monthly breakdown

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        Index('ix_scope_system_subject_grade',
              'curriculum_system', 'subject', 'grade_level',
              unique=True),
    )
