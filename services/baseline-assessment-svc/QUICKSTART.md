# Baseline Assessment v2.0 - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Service

```bash
# From aivo-pro root directory
cd services/baseline-assessment-svc

# Install dependencies
pip install -r requirements.txt

# Run locally (development)
uvicorn src.main:app --host 0.0.0.0 --port 8003 --reload

# Or with Docker
docker-compose up baseline-assessment-svc
```

### 2. Verify Service is Running

```bash
curl http://localhost:8003/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "baseline-assessment-svc",
  "version": "2.0.0",
  "features": [
    "irt_adaptive_testing",
    "speech_language_assessment",
    "sel_assessment",
    "comprehensive_evaluation"
  ]
}
```

## 📋 Basic Usage

### Comprehensive Assessment (All Domains)

```bash
curl -X POST http://localhost:8003/v1/assessment/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "child_id": "child-123",
    "age": 8.5,
    "grade": "3",
    "academic_subjects": ["math", "ela"],
    "speech_assessment_data": {
      "articulation": {
        "intelligibility": 92.0,
        "error_sounds": ["r"]
      },
      "language": {
        "expressive_vocabulary_age": 8.0,
        "mean_length_utterance": 7.5,
        "grammar_accuracy": 88.0,
        "receptive_vocabulary_age": 8.5
      },
      "fluency": {
        "words_per_minute": 110,
        "disfluencies_per_100": 2.5
      },
      "voice": {
        "pitch_appropriate": true,
        "volume_appropriate": true,
        "quality_concerns": [],
        "resonance_appropriate": true
      },
      "pragmatics": {
        "turn_taking": "adequate",
        "topic_maintenance": "adequate",
        "conversational_repair": "adequate",
        "nonverbal_communication": "adequate",
        "perspective_taking": "adequate"
      },
      "oral_motor": {
        "structure_normal": true,
        "structure_concerns": [],
        "function_adequate": true,
        "function_concerns": [],
        "feeding_concerns": []
      }
    },
    "sel_assessment_data": {
      "self_awareness": {
        "emotion_recognition": 75.0,
        "self_perception_accuracy": 72.0,
        "strengths_recognition": 78.0,
        "growth_mindset": 80.0
      },
      "self_management": {
        "impulse_control": 68.0,
        "stress_management": 70.0,
        "self_discipline": 72.0,
        "goal_setting": 75.0,
        "organizational_skills": 65.0
      },
      "social_awareness": {
        "empathy": 78.0,
        "perspective_taking": 75.0,
        "appreciating_diversity": 80.0,
        "respect_for_others": 82.0,
        "understanding_social_norms": 76.0
      },
      "relationship_skills": {
        "communication": 74.0,
        "cooperation": 78.0,
        "conflict_resolution": 70.0,
        "help_seeking": 76.0,
        "building_relationships": 75.0
      },
      "responsible_decision_making": {
        "problem_identification": 72.0,
        "solution_generation": 70.0,
        "consequence_evaluation": 73.0,
        "ethical_responsibility": 80.0,
        "safety_awareness": 85.0
      },
      "emotional_intelligence": {
        "recognizing_emotions": 75.0,
        "understanding_emotions": 73.0,
        "labeling_emotions": 78.0,
        "expressing_emotions": 70.0,
        "regulating_emotions": 68.0
      },
      "resilience": {
        "adaptability": 74.0,
        "problem_solving": 72.0,
        "social_support": 80.0,
        "optimism": 76.0,
        "self_efficacy": 73.0,
        "coping_strategies": ["deep_breathing", "talking_to_adult"]
      },
      "mental_health": {
        "anxiety_indicators": [],
        "depression_indicators": [],
        "behavioral_concerns": [],
        "attention_concerns": ["occasional_difficulty_focusing"],
        "trauma_indicators": []
      },
      "executive_function": {
        "working_memory": 70.0,
        "cognitive_flexibility": 72.0,
        "inhibitory_control": 68.0,
        "planning_organization": 65.0,
        "task_initiation": 67.0
      }
    }
  }'
```

### Academic Assessment Only (IRT Adaptive)

#### 1. Start Assessment

```bash
curl -X POST http://localhost:8003/v1/assessment/start \
  -H "Content-Type: application/json" \
  -d '{
    "child_id": "child-123",
    "subject": "math",
    "grade": "3"
  }'
```

Response:
```json
{
  "session_id": "session-abc-123",
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

#### 2. Submit Answer

```bash
curl -X POST http://localhost:8003/v1/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-abc-123",
    "item_id": "math_003",
    "answer": 2,
    "response_time_ms": 12000
  }'
```

#### 3. Complete Assessment

```bash
curl -X POST "http://localhost:8003/v1/assessment/complete?session_id=session-abc-123"
```

## 📊 Understanding Results

### Speech Assessment Results

**Severity Levels**:
- `age_appropriate` - No concerns
- `mild` - 85-95% intelligibility, minimal impact
- `moderate` - 70-85% intelligibility, noticeable impact
- `severe` - <70% intelligibility, significant impact

**Therapy Recommendations**:
- `severe` → 2-3 sessions/week, 12-24 months
- `moderate` → 1-2 sessions/week, 6-12 months
- `mild` → 1 session/week, 3-6 months

### SEL Assessment Results

**Competency Levels** (0-100 scale):
- `above_expected` - 85+
- `at_expected` - 70-84
- `developing` - 55-69
- `below_expected` - 40-54
- `significantly_below` - <40

**Intervention Recommendations**:
- `significantly_below` or `below_expected` → Intervention recommended
- `mental_health.risk_level` = `moderate_concern` or `significant_concern` → Referral required

### Cross-Domain Patterns

The system automatically identifies:
- Language delays impacting academic reading
- Pragmatic difficulties correlating with social skills
- Executive function affecting organization
- Emotional regulation impacting learning readiness

## 🎯 Personalized Plan Components

### Weekly Schedule
Shows frequency of each intervention:
- Academic sessions (daily)
- Speech therapy (1-3x/week based on severity)
- SEL activities (daily to weekly)
- Counseling (as needed)

### SMART Goals
Each goal includes:
- **Domain**: academic, speech, sel
- **Description**: Clear, specific goal
- **Target Date**: Typically 12 weeks
- **Success Criteria**: Measurable outcome
- **Progress Monitoring**: How progress is tracked

### Accommodations
Classroom and testing modifications:
- Extra time for responses
- Visual supports
- Organizational tools
- Emotion regulation breaks

### Parent Involvement
- Home practice activities
- Frequency and duration
- Required materials
- Progress monitoring strategies

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# Database
DATABASE_URL=postgresql://aivo:password@localhost:5432/aivo_assessment
REDIS_URL=redis://localhost:6379/0

# External Services
SPEECH_THERAPY_API_URL=http://localhost:8014
SEL_API_URL=http://localhost:8015

# Server
PORT=8003
LOG_LEVEL=INFO

# Assessment Configuration
MIN_ITEMS=10
MAX_ITEMS=30
TARGET_SE=0.3
```

## 📈 Monitoring

Access Prometheus metrics:

```bash
curl http://localhost:8003/metrics
```

Key metrics:
- `baseline_assessments_total{type="comprehensive"}` - Total comprehensive assessments
- `assessment_duration_seconds{type="speech"}` - Speech assessment duration
- `sel_assessments_completed_total` - SEL assessments completed

## 🐛 Troubleshooting

### Service Won't Start

**Issue**: Port already in use
```bash
# Check what's using port 8003
lsof -i :8003

# Kill process or use different port
PORT=8004 uvicorn src.main:app
```

**Issue**: Database connection failed
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check connection string
echo $DATABASE_URL
```

### Assessment Errors

**Issue**: Speech assessment returns error
- Verify `speech-therapy-svc` is running on port 8014
- Check `SPEECH_THERAPY_API_URL` environment variable
- Review logs: `docker-compose logs speech-therapy-svc`

**Issue**: SEL assessment returns error
- Verify `sel-agent-svc` is running on port 8015
- Check `SEL_API_URL` environment variable
- Review logs: `docker-compose logs sel-agent-svc`

### Missing Assessment Data

**Issue**: Some domains show `null` results
- This is expected if assessment data not provided
- Provide `speech_assessment_data` for speech evaluation
- Provide `sel_assessment_data` for SEL evaluation

## 📚 Next Steps

1. **Explore Full API**: Visit `http://localhost:8003/docs` for Swagger UI
2. **Review Documentation**: See `COMPREHENSIVE_ASSESSMENT_README.md`
3. **Integration**: Connect to Teacher/Parent portals
4. **Customize**: Adjust assessment parameters for your needs

## 💡 Tips

1. **Start with Comprehensive Assessment**: Provides complete child profile
2. **Use Appropriate Age Data**: Ensure assessment data matches child's age
3. **Monitor Cross-Domain Patterns**: Key insights come from interconnections
4. **Review Personalized Plans**: Actionable recommendations for intervention
5. **Track Progress**: Use 6-week review cycles

## 🔗 Related Services

- **Speech Therapy Service** (port 8014): Detailed speech analysis and therapy
- **SEL Agent Service** (port 8015): Emotional intelligence and SEL activities
- **IEP Assistant** (port 8012): Generate IEP goals from assessments
- **Teacher Portal** (port 5175): View reports and monitor progress

---

**Need Help?**
- Documentation: `/docs` (Swagger UI)
- Health Check: `GET /health`
- Version: 2.0.0
