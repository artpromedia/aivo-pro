# Baseline Assessment Service v2.0 - Comprehensive Evaluation

## 🎯 Overview

The **Baseline Assessment Service v2.0** is a comprehensive evaluation system that integrates multiple assessment domains to provide a complete profile of each child's developmental needs. This enhanced version combines:

- **Academic Assessment**: IRT-based adaptive testing for math, reading, science
- **Speech & Language Evaluation**: Comprehensive analysis across 6 domains
- **Social-Emotional Learning (SEL) Assessment**: CASEL framework implementation
- **Cross-Domain Analysis**: Identifies patterns and interconnections across all areas
- **Personalized Learning Plans**: Evidence-based intervention recommendations

## 🏗️ Architecture

### Service Structure

```
baseline-assessment-svc/
├── src/
│   ├── assessors/
│   │   ├── speech_assessor.py       # Speech/language evaluation
│   │   └── sel_assessor.py          # SEL assessment
│   ├── core/
│   │   ├── irt_engine.py            # Item Response Theory engine
│   │   ├── item_selector.py         # Adaptive item selection
│   │   ├── session_manager.py       # Session state management
│   │   ├── skill_analyzer.py        # Skill vector calculation
│   │   ├── report_generator.py      # Unified report generation
│   │   └── plan_generator.py        # Personalized plan creation
│   └── main.py                      # FastAPI application
├── Dockerfile
└── requirements.txt
```

### Integration Points

- **Port**: 8003
- **Database**: PostgreSQL (session state, results storage)
- **Cache**: Redis (session management, temporary data)
- **External Services**:
  - `speech-therapy-svc:8014` - Detailed speech analysis
  - `sel-agent-svc:8015` - EI assessment and SEL activities

## 📊 Assessment Domains

### 1. Academic Assessment (IRT-Based)

**Technology**: Item Response Theory (IRT) with adaptive testing

**Features**:
- Personalized difficulty adaptation
- Precise ability estimation (theta)
- Standard error calculation
- Skill vector decomposition
- Stopping criteria optimization

**Subjects**: Math, ELA, Science

### 2. Speech & Language Evaluation

**Framework**: ASHA Guidelines

**Domains Assessed**:

1. **Articulation & Phonology**
   - Speech sound production
   - Intelligibility percentage
   - Error patterns (substitutions, omissions, distortions)
   - Phonological processes

2. **Expressive Language**
   - Vocabulary age equivalent
   - Mean Length of Utterance (MLU)
   - Sentence complexity
   - Grammar accuracy

3. **Receptive Language**
   - Vocabulary comprehension
   - Following directions (1-step to multi-step)
   - Comprehension level (literal, inferential, critical)

4. **Fluency**
   - Words per minute
   - Disfluencies per 100 words
   - Types: repetitions, prolongations, blocks
   - Secondary behaviors

5. **Voice**
   - Pitch appropriateness
   - Volume regulation
   - Quality concerns (hoarseness, breathiness)
   - Resonance

6. **Pragmatics (Social Communication)**
   - Turn-taking
   - Topic maintenance
   - Conversational repair
   - Nonverbal communication
   - Perspective-taking

7. **Oral Motor Function**
   - Structure integrity
   - Functional adequacy
   - Feeding concerns

**Severity Levels**: Mild, Moderate, Severe

### 3. Social-Emotional Learning (SEL) Assessment

**Framework**: CASEL Five Core Competencies + Extensions

#### CASEL Five Competencies

1. **Self-Awareness**
   - Emotion recognition
   - Self-perception accuracy
   - Strengths recognition
   - Growth mindset

2. **Self-Management**
   - Impulse control
   - Stress management
   - Self-discipline
   - Goal-setting
   - Organizational skills

3. **Social Awareness**
   - Empathy
   - Perspective-taking
   - Appreciating diversity
   - Respect for others
   - Understanding social norms

4. **Relationship Skills**
   - Communication
   - Cooperation
   - Conflict resolution
   - Help-seeking
   - Building relationships

5. **Responsible Decision-Making**
   - Problem identification
   - Solution generation
   - Consequence evaluation
   - Ethical responsibility
   - Safety awareness

#### Extended Assessments

6. **Emotional Intelligence (RULER Framework)**
   - Recognizing emotions
   - Understanding emotions
   - Labeling emotions
   - Expressing emotions
   - Regulating emotions

7. **Resilience**
   - Adaptability
   - Problem-solving
   - Social support
   - Optimism
   - Self-efficacy

8. **Mental Health Screening**
   - Anxiety indicators
   - Depression indicators
   - Behavioral concerns
   - Attention concerns
   - Trauma indicators
   - Risk level assessment

9. **Executive Function**
   - Working memory
   - Cognitive flexibility
   - Inhibitory control
   - Planning & organization
   - Task initiation

**Competency Levels**: Significantly Below, Below Expected, Developing, At Expected, Above Expected

## 🔄 Assessment Flow

### Comprehensive Assessment Process

```
1. Start Comprehensive Assessment
   └─> POST /v1/assessment/comprehensive
       {
         "child_id": "uuid",
         "age": 8.5,
         "grade": "3",
         "academic_subjects": ["math", "ela"],
         "speech_assessment_data": { ... },
         "sel_assessment_data": { ... }
       }

2. Parallel Processing
   ├─> Academic IRT sessions created
   ├─> Speech/Language analysis conducted
   └─> SEL competencies evaluated

3. Cross-Domain Analysis
   └─> Identify patterns across domains
       ├─> Language → Academic connections
       ├─> Pragmatics ↔ Social Skills
       ├─> Executive Function → Organization
       └─> Emotional Regulation → Learning

4. Report Generation
   └─> Unified comprehensive report
       ├─> Executive Summary
       ├─> Domain Profiles
       ├─> Cross-Domain Analysis
       └─> Integrated Recommendations

5. Personalized Plan Creation
   └─> AIVO Learning Plan
       ├─> Weekly Schedule
       ├─> SMART Goals
       ├─> Accommodations
       ├─> Parent Involvement
       └─> Progress Monitoring
```

## 📡 API Endpoints

### Comprehensive Assessment

#### POST `/v1/assessment/comprehensive`

Conduct full multi-domain assessment.

**Request Body**:
```json
{
  "child_id": "550e8400-e29b-41d4-a716-446655440000",
  "age": 10.5,
  "grade": "5",
  "academic_subjects": ["math", "ela", "science"],
  "speech_assessment_data": {
    "articulation": {
      "speech_sample": "base64_audio_data",
      "intelligibility": 88.0,
      "error_sounds": ["r", "s"]
    },
    "language": {
      "expressive_vocabulary_age": 9.0,
      "mean_length_utterance": 8.5,
      "grammar_accuracy": 85.0
    },
    "fluency": {
      "words_per_minute": 115,
      "disfluencies_per_100": 4.5
    }
  },
  "sel_assessment_data": {
    "self_awareness": {
      "emotion_recognition": 75.0,
      "growth_mindset": 80.0
    },
    "self_management": {
      "impulse_control": 65.0,
      "stress_management": 70.0
    },
    "emotional_intelligence": {
      "recognizing_emotions": 72.0,
      "regulating_emotions": 68.0
    },
    "resilience": {
      "adaptability": 75.0,
      "optimism": 78.0
    },
    "mental_health": {
      "anxiety_indicators": ["excessive_worry"],
      "depression_indicators": [],
      "behavioral_concerns": []
    }
  }
}
```

**Response**:
```json
{
  "child_id": "550e8400-e29b-41d4-a716-446655440000",
  "assessment_date": "2024-01-15T10:30:00Z",
  "academic_results": {
    "math": {
      "session_id": "abc123",
      "status": "initiated"
    }
  },
  "speech_results": {
    "summary": {
      "overall_severity": "mild",
      "therapy_recommended": true,
      "priority_areas": ["articulation", "language"],
      "estimated_therapy_duration": "3-6 months"
    },
    "articulation": {
      "intelligibility_percent": 88.0,
      "level": "mild",
      "recommendations": ["Target /r/ and /s/ sounds"]
    }
  },
  "sel_results": {
    "summary": {
      "overall_sel_score": 72.5,
      "overall_sel_level": "at_expected",
      "intervention_recommended": false,
      "priority_areas": ["self_management"]
    },
    "casel_competencies": { ... }
  },
  "comprehensive_summary": {
    "domains_assessed": ["academic", "speech_language", "social_emotional"],
    "overall_profile": "Comprehensive evaluation completed...",
    "cross_domain_patterns": [
      "Language delays may impact reading comprehension"
    ],
    "priority_needs": []
  },
  "recommendations": [
    "Speech-language therapy recommended (mild severity, 3-6 months)",
    "Target error sounds: r, s",
    "Weekly articulation therapy recommended (30-45 minutes)"
  ],
  "personalized_plan": {
    "plan_name": "Personalized AIVO Learning Plan - Grade 5",
    "focus_areas": ["academic_math", "speech_articulation"],
    "weekly_schedule": {
      "academic_sessions": {
        "math": "Daily adaptive lessons (20-30 min)"
      },
      "speech_therapy": "1 session per week (30 min)",
      "sel_activities": "Daily SEL moments (5-10 min)"
    },
    "goals": [ ... ],
    "accommodations": [ ... ],
    "parent_involvement": [ ... ]
  }
}
```

### Academic Assessment (IRT)

#### POST `/v1/assessment/start`

Start adaptive academic assessment.

**Request**:
```json
{
  "child_id": "uuid",
  "subject": "math",
  "grade": "5"
}
```

**Response**:
```json
{
  "session_id": "session_uuid",
  "first_item": {
    "item_id": "math_003",
    "question": "What is 15% of 200?",
    "options": ["20", "25", "30", "35"],
    "difficulty": 0.0
  },
  "stats": {
    "theta": 0.0,
    "standard_error": 2.0,
    "num_items": 0
  }
}
```

#### POST `/v1/assessment/submit`

Submit answer and get next item.

**Request**:
```json
{
  "session_id": "session_uuid",
  "item_id": "math_003",
  "answer": 2,
  "response_time_ms": 15000
}
```

#### POST `/v1/assessment/complete`

Complete assessment and get results.

**Request**: `?session_id=session_uuid`

**Response**:
```json
{
  "session_id": "session_uuid",
  "final_theta": 0.45,
  "standard_error": 0.32,
  "num_items": 15,
  "percent_correct": 73.3,
  "duration_seconds": 420,
  "skill_vector": {
    "arithmetic": {
      "mastery": 0.85,
      "confidence": 0.92,
      "items_answered": 5
    }
  },
  "strengths_weaknesses": {
    "strengths": ["arithmetic", "geometry"],
    "weaknesses": ["algebra"]
  },
  "recommendations": [
    "Focus on algebra fundamentals",
    "Practice word problems"
  ]
}
```

### Health Check

#### GET `/health`

Service health status.

**Response**:
```json
{
  "status": "healthy",
  "service": "baseline-assessment-svc",
  "version": "2.0.0",
  "item_bank_size": 500,
  "active_sessions": 12,
  "features": [
    "irt_adaptive_testing",
    "speech_language_assessment",
    "sel_assessment",
    "comprehensive_evaluation"
  ]
}
```

## 📈 Cross-Domain Analysis

### Patterns Identified

The system automatically identifies interconnections across domains:

1. **Language → Academic**
   - Language delays → Reading comprehension difficulties
   - Vocabulary deficits → Content area understanding

2. **Pragmatics ↔ Social Skills**
   - Social communication challenges in both speech and SEL
   - Integrated intervention recommended

3. **Executive Function → Academic**
   - Organization challenges → Task completion
   - Working memory → Multi-step problems

4. **Emotional Regulation → Learning**
   - Emotion dysregulation → Classroom engagement
   - Stress management → Test performance

5. **Articulation → Social Confidence**
   - Low intelligibility → Reduced self-confidence
   - Social avoidance patterns

### Impact Analysis

The system tracks how challenges in one domain affect others:

```json
{
  "impact_analysis": {
    "speech_language": [
      "reading_comprehension",
      "written_expression",
      "vocabulary_development"
    ],
    "social_emotional": [
      "organization",
      "task_completion",
      "study_skills"
    ]
  }
}
```

## 🎯 Personalized Learning Plans

### Components

1. **Weekly Schedule**
   - Academic sessions (subject-specific)
   - Speech therapy (frequency based on severity)
   - SEL activities (daily to weekly)
   - Counseling (as needed)
   - Other services (EF coaching, etc.)

2. **SMART Goals**
   - Domain: academic, speech, sel
   - Target date (typically 12 weeks)
   - Success criteria (measurable)
   - Progress monitoring plan

3. **Accommodations**
   - Category (speech, academic, executive function, sel)
   - Description and implementation
   - Responsible party

4. **Parent Involvement**
   - Home practice activities
   - Progress monitoring
   - Strategy reinforcement

5. **Progress Monitoring**
   - Weekly assessments
   - Teacher observations
   - 6-week comprehensive review

### Example Plan Structure

```json
{
  "plan_name": "Personalized AIVO Learning Plan - Grade 3",
  "focus_areas": [
    "academic_math",
    "speech_articulation",
    "sel_self_management"
  ],
  "weekly_schedule": {
    "academic_sessions": {
      "math": "Daily (20-30 min)",
      "ela": "Daily (20-30 min)"
    },
    "speech_therapy": "2 sessions per week (30 min each)",
    "sel_activities": "Daily SEL curriculum (15-20 min)",
    "counseling": "Weekly check-ins (30 min)"
  },
  "goals": [
    {
      "domain": "speech",
      "category": "articulation",
      "description": "Produce /r/ sound correctly in words and sentences",
      "target_date": "2024-04-15",
      "success_criteria": "80% accuracy in spontaneous speech",
      "progress_monitoring": "Weekly speech samples"
    }
  ],
  "accommodations": [
    {
      "category": "speech",
      "description": "Extra time for verbal responses",
      "implementation": "Allow 50% additional time for oral presentations",
      "responsible_party": "All teachers"
    }
  ]
}
```

## 🚀 Deployment

### Docker

```bash
# Build
docker build -t aivo-baseline-assessment:2.0.0 .

# Run
docker run -d \
  -p 8003:8003 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/aivo_assessment \
  -e REDIS_URL=redis://redis:6379/0 \
  -e SPEECH_THERAPY_API_URL=http://speech-therapy-svc:8014 \
  -e SEL_API_URL=http://sel-agent-svc:8015 \
  aivo-baseline-assessment:2.0.0
```

### Docker Compose

Already integrated in main `docker-compose.yml`:

```yaml
baseline-assessment-svc:
  build: ./services/baseline-assessment-svc
  ports:
    - "8003:8003"
  depends_on:
    - postgres
    - redis
    - speech-therapy-svc
    - sel-agent-svc
  environment:
    DATABASE_URL: postgresql://aivo:password@postgres:5432/aivo_assessment
    REDIS_URL: redis://redis:6379/0
    SPEECH_THERAPY_API_URL: http://speech-therapy-svc:8014
    SEL_API_URL: http://sel-agent-svc:8015
```

### Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

Optional:
- `SPEECH_THERAPY_API_URL`: Speech service endpoint (default: http://speech-therapy-svc:8014)
- `SEL_API_URL`: SEL service endpoint (default: http://sel-agent-svc:8015)
- `LOG_LEVEL`: Logging level (default: INFO)

## 📊 Data Models

### ComprehensiveSpeechAssessment

```python
{
  "child_id": str,
  "assessment_date": datetime,
  "chronological_age": float,
  "grade_level": str,
  "articulation": ArticulationAssessment,
  "language": LanguageAssessment,
  "fluency": FluencyAssessment,
  "voice": VoiceAssessment,
  "pragmatics": PragmaticsAssessment,
  "oral_motor": OralMotorAssessment,
  "overall_severity": str,  # mild, moderate, severe
  "therapy_recommended": bool,
  "priority_areas": List[str],
  "recommendations": List[str]
}
```

### ComprehensiveSELAssessment

```python
{
  "child_id": str,
  "assessment_date": datetime,
  "chronological_age": float,
  "grade_level": str,
  "self_awareness": SelfAwarenessAssessment,
  "self_management": SelfManagementAssessment,
  "social_awareness": SocialAwarenessAssessment,
  "relationship_skills": RelationshipSkillsAssessment,
  "responsible_decision_making": ResponsibleDecisionMakingAssessment,
  "emotional_intelligence": EmotionalIntelligenceAssessment,
  "resilience": ResilienceAssessment,
  "mental_health": MentalHealthScreening,
  "executive_function": ExecutiveFunctionAssessment,
  "overall_sel_score": float,
  "overall_sel_level": CompetencyLevel,
  "intervention_recommended": bool,
  "recommendations": List[str]
}
```

## 🔒 Security & Privacy

- All assessment data encrypted at rest and in transit
- FERPA and COPPA compliant
- Secure session management with Redis
- Role-based access control (RBAC)
- Audit logging for all assessments

## 📈 Monitoring & Metrics

Prometheus metrics exposed at `/metrics`:

- `baseline_assessments_total{type}` - Total assessments conducted
- `assessment_duration_seconds{type}` - Assessment duration
- `assessment_errors_total{type}` - Error count by type
- `active_sessions` - Current active sessions
- `speech_assessments_completed_total` - Speech assessments
- `sel_assessments_completed_total` - SEL assessments

## 🧪 Testing

```bash
# Run tests
pytest tests/

# With coverage
pytest --cov=src tests/

# Integration tests
pytest tests/integration/
```

## 📚 Evidence Base

### Speech/Language
- **ASHA Guidelines**: Clinical practice standards
- **Stanford Protocols**: Evidence-based therapy approaches
- **Brown's Stages**: MLU developmental norms
- **Phonological Process Analysis**: Systematic error patterns

### SEL
- **CASEL Framework**: 25+ years of research
- **RULER Approach**: Yale Center for Emotional Intelligence
- **Resilience Research**: APA resilience factors
- **Mental Health Screening**: Validated screening tools

### Academic
- **Item Response Theory (IRT)**: Psychometric gold standard
- **Adaptive Testing**: CAT research and best practices
- **Skill Decomposition**: Learning progression research

## 🔄 Integration with AIVO Platform

The Baseline Assessment Service v2.0 seamlessly integrates with:

1. **Teacher Portal**: View comprehensive reports, monitor progress
2. **Parent Portal**: Access child's assessment results and home activities
3. **Learner App**: Personalized learning paths based on assessment
4. **Speech Therapy Service**: Detailed speech analysis and therapy
5. **SEL Agent**: Ongoing emotional support and activities
6. **IEP Assistant**: Generate IEP goals from assessment data
7. **Analytics Service**: Track population trends and outcomes

## 📞 Support

For technical support or questions:
- **Documentation**: `/docs` (Swagger UI)
- **Health Check**: `GET /health`
- **Service**: baseline-assessment-svc
- **Port**: 8003

## 🎉 Version 2.0 Features

✅ Multi-domain comprehensive assessment
✅ Speech & language evaluation (6 domains)
✅ SEL assessment (CASEL + extensions)
✅ Cross-domain pattern analysis
✅ Integrated reporting
✅ Personalized learning plans
✅ SMART goals generation
✅ Accommodation recommendations
✅ Parent involvement strategies
✅ Progress monitoring plans

---

**Version**: 2.0.0
**Last Updated**: 2024-01-15
**Status**: Production Ready
