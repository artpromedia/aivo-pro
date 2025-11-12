# IEP Assistant Service

## Overview

The IEP Assistant Service is an AI-powered system for generating SMART IEP goals, tracking student progress, and ensuring compliance with FERPA and IDEA regulations. Following Microsoft Education best practices, it helps special education teams create effective, legally compliant IEPs while saving significant time.

**Port**: 8008  
**Architecture**: FastAPI + PostgreSQL + Redis + Pandas + OpenAI  
**Philosophy**: Data-driven, legally compliant, time-saving

---

## Key Features

### 1. SMART Goal Generation

AI-powered generation following all 5 SMART criteria:

- **S**pecific: Clearly defined behavior/skill
- **M**easurable: Quantifiable progress metrics  
- **A**chievable: Realistic based on baseline data
- **R**elevant: Aligned to grade-level standards
- **T**ime-bound: Annual goals with quarterly benchmarks

**Validation Score**: Every goal receives a confidence score (0-1) based on SMART criteria compliance.

### 2. Progress Tracking & Analysis

- **Linear Regression**: Statistical trend analysis
- **Trend Detection**: Accelerated, On-track, Slow, Declining
- **Mastery Calculation**: Current proficiency level (0-1)
- **Projected Outcomes**: Prediction if student will meet goal
- **Alert Generation**: Automatic notifications for regression or at-risk students

### 3. FERPA & IDEA Compliance

- **FERPA Compliance**: Student data privacy protection
- **IDEA Validation**: Special education law requirements
- **Audit Trails**: Complete logging in ComplianceLog table
- **Electronic Signatures**: Document approval tracking
- **Access Control**: Role-based permissions

### 4. Document Generation

- Annual IEP documents
- Progress reports (quarterly, annual)
- Meeting notes with attendees
- Amendment tracking with justification
- Accommodation and service plans

---

## API Reference

### Base URL
```
http://localhost:8008/v1/iep
```

### Authentication
Include JWT token in headers:
```bash
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Generate SMART Goal

**POST** `/generate`

Generate an IEP goal using AI with SMART validation.

**Request**:
```bash
curl -X POST http://localhost:8008/v1/iep/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "550e8400-e29b-41d4-a716-446655440000",
    "student_name": "Alex Johnson",
    "goal_type": "academic",
    "area": "reading",
    "baseline_data": {
      "current_level": "45 words per minute",
      "grade_level_expectation": "120 words per minute",
      "assessment_date": "2025-09-15"
    },
    "grade_level": 5
  }'
```

**Request Body**:
```json
{
  "student_id": "uuid",
  "student_name": "string",
  "goal_type": "academic|behavioral|communication|motor|social|self_help",
  "area": "string (e.g., reading, math, behavior)",
  "baseline_data": {
    "current_level": "string or number",
    "grade_level_expectation": "string or number",
    "assessment_date": "YYYY-MM-DD"
  },
  "grade_level": 1-12
}
```

**Response**:
```json
{
  "goal_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "goal_text": "By June 15, 2026, when given a grade-level passage, Alex will read aloud with 95% accuracy at a rate of 100 words per minute as measured by curriculum-based measurement probes.",
  "goal_type": "academic",
  "area": "reading",
  "baseline": {
    "current_level": "45 words per minute",
    "grade_level_expectation": "120 words per minute"
  },
  "target": {
    "value": 100,
    "unit": "words per minute",
    "accuracy": 95
  },
  "measurement_method": "Curriculum-based measurement probes administered weekly",
  "timeline_end": "2026-06-15",
  "smart_validation": {
    "scores": {
      "specific": 1.0,
      "measurable": 1.0,
      "achievable": 0.85,
      "relevant": 0.9,
      "time_bound": 1.0
    },
    "overall_score": 0.95,
    "passes": true,
    "issues": []
  },
  "confidence_score": 0.95,
  "objectives": [
    {
      "quarter": 1,
      "timeline": "Quarter 1",
      "target": 58.75,
      "criteria": "Achieve 58.75% accuracy",
      "status": "pending"
    },
    {
      "quarter": 2,
      "timeline": "Quarter 2",
      "target": 72.5,
      "criteria": "Achieve 72.5% accuracy",
      "status": "pending"
    }
  ]
}
```

---

### 2. Get Student Goals

**GET** `/{student_id}/goals`

List all IEP goals for a student.

**Request**:
```bash
curl http://localhost:8008/v1/iep/{student_id}/goals \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "student_id": "550e8400-e29b-41d4-a716-446655440000",
  "goals": [
    {
      "goal_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "goal_text": "By June 15, 2026...",
      "goal_type": "academic",
      "area": "reading",
      "status": "active",
      "current_progress": 62.5,
      "trend": "on_track",
      "created_at": "2025-09-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 3. Record Data Point

**POST** `/goals/{goal_id}/data`

Record a progress data point for a goal.

**Request**:
```bash
curl -X POST http://localhost:8008/v1/iep/goals/{goal_id}/data \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-10-15",
    "value": 65.0,
    "notes": "Student showed improvement with phonics practice"
  }'
```

**Request Body**:
```json
{
  "date": "YYYY-MM-DD",
  "value": 65.0,
  "notes": "Optional observation notes"
}
```

**Response**:
```json
{
  "goal_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "data_point": {
    "date": "2025-10-15",
    "value": 65.0,
    "notes": "Student showed improvement with phonics practice"
  },
  "recorded_at": "2025-10-15T14:30:00Z"
}
```

---

### 4. Get Progress Analysis

**GET** `/goals/{goal_id}/progress`

Analyze progress trend with statistical analysis and alerts.

**Request**:
```bash
curl http://localhost:8008/v1/iep/goals/{goal_id}/progress \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "goal_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "trend": "on_track",
  "slope": 0.25,
  "confidence": 0.87,
  "r_squared": 0.76,
  "p_value": 0.03,
  "projected_outcome": "likely_to_meet",
  "mastery_level": 0.65,
  "alerts": []
}
```

**Trend Types**:
- `accelerated`: Progress faster than expected
- `on_track`: Progress as expected
- `slow`: Progress slower than expected
- `declining`: Regression detected
- `insufficient_data`: Need more data points (< 3)

**Alert Types**:
```json
{
  "type": "regression",
  "severity": "high",
  "message": "Student showing regression in progress"
}
```

---

### 5. Amend Goal

**POST** `/goals/{goal_id}/amend`

Amend an existing goal with justification.

**Request**:
```bash
curl -X POST http://localhost:8008/v1/iep/goals/{goal_id}/amend \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amendment_type": "target_adjustment",
    "amended_text": "By June 15, 2026, when given a grade-level passage, Alex will read aloud with 95% accuracy at a rate of 85 words per minute...",
    "reason": "Student progress indicates original target too aggressive"
  }'
```

**Response**:
```json
{
  "goal_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "amendment": {
    "amendment_type": "target_adjustment",
    "amended_text": "...",
    "reason": "..."
  },
  "status": "Amendment recorded"
}
```

---

### 6. Generate Progress Report

**GET** `/{student_id}/progress-report`

Generate comprehensive progress report.

**Request**:
```bash
curl http://localhost:8008/v1/iep/{student_id}/progress-report \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "student_id": "550e8400-e29b-41d4-a716-446655440000",
  "report": {
    "reporting_period": "Q2 2025-2026",
    "goals_summary": {
      "total": 5,
      "on_track": 3,
      "at_risk": 1,
      "mastered": 1
    },
    "recommendations": [...]
  },
  "status": "Report generated"
}
```

---

### 7. Generate IEP Document

**POST** `/document/generate`

Create complete IEP document.

**Request**:
```bash
curl -X POST http://localhost:8008/v1/iep/document/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "550e8400-e29b-41d4-a716-446655440000",
    "document_type": "annual_iep",
    "meeting_date": "2025-11-08"
  }'
```

**Response**:
```json
{
  "document_id": "a3b2c1d0-e1f2-3g4h-5i6j-7k8l9m0n1o2p",
  "status": "Document generated"
}
```

---

### 8. Check Compliance

**GET** `/compliance/check`

Run FERPA and IDEA compliance validation.

**Request**:
```bash
curl http://localhost:8008/v1/iep/compliance/check \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "compliant": true,
  "checks": {
    "ferpa": {
      "status": "pass",
      "issues": []
    },
    "idea": {
      "status": "pass",
      "issues": []
    }
  },
  "message": "All compliance checks passed",
  "checked_at": "2025-11-08T15:00:00Z"
}
```

---

## Goal Templates

### Academic Goal Template
```
By {date}, when given {condition}, {student} will {behavior} 
with {accuracy}% accuracy as measured by {measurement}.
```

**Example**:
```
By June 15, 2026, when given a grade 5 math worksheet with 
20 multi-digit multiplication problems, Sarah will solve 
the problems with 85% accuracy as measured by weekly probes.
```

### Behavioral Goal Template
```
By {date}, {student} will {behavior} for {duration} minutes 
during {activity} with no more than {max_prompts} prompts.
```

**Example**:
```
By May 30, 2026, Michael will remain seated and engaged 
for 20 minutes during independent work time with no more 
than 2 prompts as measured by teacher observation logs.
```

### Communication Goal Template
```
By {date}, {student} will {behavior} in {context} with 
{accuracy}% accuracy as measured by {measurement}.
```

**Example**:
```
By June 10, 2026, Emma will use complete sentences to 
express needs and wants in classroom settings with 80% 
accuracy as measured by speech-language pathologist data.
```

---

## Configuration

### Environment Variables

```bash
# Service
SERVICE_NAME=iep-assistant-svc
VERSION=1.0.0
PORT=8008
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/aivo_iep
REDIS_URL=redis://localhost:6379/6

# AI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
ANTHROPIC_API_KEY=sk-ant-...  # Optional

# SMART Goals
ENABLE_SMART_VALIDATION=true
MIN_CONFIDENCE_SCORE=0.7
MAX_GOALS_PER_AREA=3

# Progress Tracking
DATA_COLLECTION_FREQUENCY=weekly
TREND_ANALYSIS_MIN_POINTS=3
ALERT_THRESHOLD_REGRESSION=-0.15
ALERT_THRESHOLD_AT_RISK=0.4

# Compliance
ENABLE_FERPA_COMPLIANCE=true
ENABLE_IDEA_VALIDATION=true
REQUIRE_SIGNATURES=true

# Rate Limiting
MAX_GOAL_GENERATIONS_PER_HOUR=20
MAX_DATA_POINTS_PER_DAY=100

# Monitoring
PROMETHEUS_ENABLED=true
SENTRY_DSN=https://...
```

---

## Database Schema

### Core Tables

#### **iep_goals**
```sql
- id: UUID (PK)
- student_id: UUID (indexed)
- goal_text: TEXT
- goal_type: ENUM (academic/behavioral/social/communication/motor/self_help)
- area: VARCHAR(100)
- baseline: JSONB
- target: JSONB
- measurement_method: VARCHAR(500)
- timeline_end: DATE
- current_progress: FLOAT
- trend: ENUM (accelerated/on_track/slow/declining/insufficient_data)
- projected_outcome: VARCHAR(50)
- smart_validation: JSONB
- confidence_score: FLOAT
- status: ENUM (draft/active/mastered/discontinued/amended)
- created_at, updated_at: TIMESTAMP
```

#### **iep_objectives**
Quarterly benchmarks:
```sql
- id: UUID (PK)
- goal_id: UUID (FK)
- quarter: INTEGER
- timeline: VARCHAR(100)
- target: FLOAT
- criteria: VARCHAR(500)
- status: VARCHAR(50)
```

#### **iep_data_points**
Progress data:
```sql
- id: UUID (PK)
- goal_id: UUID (FK)
- date: DATE (indexed)
- value: FLOAT
- notes: TEXT
- recorded_by: VARCHAR(200)
- recorded_at: TIMESTAMP
```

#### **compliance_logs**
Audit trail:
```sql
- id: UUID (PK)
- action: VARCHAR(200)
- user_id: UUID
- student_id: UUID
- details: JSONB
- timestamp: TIMESTAMP (indexed)
```

---

## Deployment

### Docker

**Build**:
```bash
cd services/iep-assistant-svc
docker build -t aivo-iep-assistant .
```

**Run**:
```bash
docker run -d \
  -p 8008:8008 \
  --env-file .env \
  --name iep-assistant \
  aivo-iep-assistant
```

### Docker Compose

```yaml
iep-assistant:
  build: ./services/iep-assistant-svc
  ports:
    - "8008:8008"
  environment:
    - DATABASE_URL=postgresql+asyncpg://aivo:password@postgres:5432/aivo_iep
    - REDIS_URL=redis://redis:6379/6
    - OPENAI_API_KEY=${OPENAI_API_KEY}
  depends_on:
    - postgres
    - redis
  restart: unless-stopped
```

---

## Monitoring

### Health Check
```bash
curl http://localhost:8008/health
```

### Prometheus Metrics
```bash
curl http://localhost:8008/metrics
```

**Available Metrics**:
- `iep_goal_generations_total`: Total goals generated
- `iep_data_points_total`: Data points recorded
- `iep_progress_analyses_total`: Progress analyses run
- `iep_smart_validation_score`: SMART validation scores (histogram)

---

## Best Practices

### For IEP Teams

1. **Start with Quality Baseline Data**
   - Use recent assessments
   - Include multiple data sources
   - Document current performance clearly

2. **Review AI-Generated Goals**
   - Always review and customize
   - Ensure parent/student input
   - Validate with team expertise

3. **Consistent Data Collection**
   - Set regular collection schedule
   - Use consistent measurement methods
   - Document observations thoroughly

4. **Monitor Alerts**
   - Address regression immediately
   - Investigate at-risk trends
   - Consider goal amendments when needed

### For Administrators

1. **Compliance Monitoring**
   - Run regular compliance checks
   - Review audit logs monthly
   - Ensure signature requirements met

2. **Time Savings Tracking**
   - Monitor goal generation efficiency
   - Track document creation time
   - Measure team productivity gains

3. **Quality Assurance**
   - Review SMART validation scores
   - Check for low confidence goals
   - Ensure measurement consistency

---

## Troubleshooting

### Low SMART Validation Scores

**Issue**: Goals receive < 0.7 confidence score

**Solutions**:
1. Provide more detailed baseline data
2. Include specific measurement methods
3. Ensure realistic targets based on baseline
4. Add clear conditions and criteria

### Insufficient Data Alerts

**Issue**: Cannot generate trend analysis

**Solution**: Need minimum 3 data points for statistical analysis

### Compliance Warnings

**Issue**: FERPA or IDEA violations detected

**Actions**:
1. Review compliance log for details
2. Ensure proper signatures
3. Check data access permissions
4. Validate goal components

---

## Security

### Data Privacy
- FERPA compliant data handling
- Encrypted student records
- Role-based access control
- Audit logging for all operations

### Compliance
- IDEA regulations followed
- Electronic signature support
- Parent consent tracking
- Data retention policies

---

## Time Savings

**Estimated Manual Time**: 120 minutes per IEP

**With IEP Assistant**:
- Goal generation: 5 minutes (vs. 30 manual)
- Progress tracking: 2 minutes (vs. 15 manual)
- Report generation: 3 minutes (vs. 20 manual)
- Document creation: 10 minutes (vs. 35 manual)

**Total Time Savings**: ~75% reduction

---

## Support

- **Documentation**: http://localhost:8008/docs (Swagger UI)
- **Metrics**: http://localhost:8008/metrics
- **Logs**: `docker logs iep-assistant`

---

**Version**: 1.0.0  
**License**: Proprietary - AIVO Learning Platform  
**Last Updated**: November 8, 2025
