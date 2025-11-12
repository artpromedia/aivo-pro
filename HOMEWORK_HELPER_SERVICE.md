# Homework Helper Service

## Overview

The Homework Helper Service is an AI-powered tutoring system that uses the **Socratic method** to guide students through their homework without giving direct answers. It combines advanced OCR technology with pedagogical best practices to help students develop critical thinking skills.

**Port**: 8007  
**Architecture**: FastAPI + PostgreSQL + Redis + Google Cloud Vision  
**Philosophy**: Never give answers, always guide discovery

---

## Key Features

### 1. Advanced OCR System
- **PDF Processing**: Multi-page document support with poppler-utils
- **Image Upload**: PNG, JPG, JPEG formats (max 10MB)
- **Handwriting Recognition**: Specialized OCR for student handwriting
- **Math Expression Extraction**: LaTeX conversion with high confidence scoring
- **Technologies**: Google Cloud Vision API, Tesseract OCR, OpenCV

### 2. Socratic Tutoring Method

Following Google's pedagogical AI research, the system uses three guidance strategies:

#### **Guided Discovery** 
Refuses to give direct answers, asks leading questions:
```
Student: "Can you solve this for me?"
Tutor: "Let's work through it together. What variable are we trying to find?"
```

#### **Scaffolding** (6-Level Progressive Hints)
Provides increasing support based on student struggle:

**Example**: For equation "2x + 5 = 13"

- **Level 1** (Conceptual): "What variable are we solving for?"
- **Level 2** (Strategic): "What operation is being done to x? How can we undo it?"
- **Level 3** (Procedural): "💡 Hint: Try isolating x on one side"
- **Level 4** (Specific Guidance): "💡 Hint: First, get rid of the + 5. What's the opposite?"
- **Level 5** (Detailed Step): "💡 Hint: Subtract 5 from both sides: 2x = 8. What next?"
- **Level 6** (Partial Solution): "💡 Here's first step: 2x + 5 - 5 = 13 - 5 → 2x = 8"

#### **Metacognitive Prompting**
Encourages thinking about thinking:
```
Student: "I got x = 4"
Tutor: "Great! How did you arrive at that answer? Can you explain your thinking?"
```

### 3. WebSocket Writing Pad
Real-time handwriting recognition for students who prefer to write:
- Stroke-by-stroke capture
- Instant LaTeX conversion
- Confidence scoring
- Error detection

### 4. Analytics & Progress Tracking
- Student independence score (0-1)
- Guided discovery effectiveness
- Time per problem
- Concepts mastered vs. struggles identified
- Hint usage patterns

---

## API Reference

### Base URL
```
http://localhost:8007/v1/homework
```

### Authentication
Include JWT token in headers:
```bash
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Upload Homework

**POST** `/upload`

Upload a homework document (PDF or image) for OCR processing.

**Request**:
```bash
curl -X POST http://localhost:8007/v1/homework/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@homework.pdf" \
  -F "subject=math" \
  -F "grade=8"
```

**Request Body** (multipart/form-data):
- `file`: PDF or image file (max 10MB)
- `subject`: Subject type (math, science, english, etc.)
- `grade`: Grade level (1-12)

**Response**:
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "document_name": "homework.pdf",
  "extracted_problems": [
    {
      "problem_number": 1,
      "text": "Solve for x: 2x + 5 = 13",
      "type": "equation"
    },
    {
      "problem_number": 2,
      "text": "Simplify: (3x + 2)(x - 4)",
      "type": "algebraic_expression"
    }
  ],
  "ocr_confidence": 0.92,
  "status": "ready"
}
```

---

### 2. Chat About Homework

**POST** `/{session_id}/chat`

Engage in Socratic tutoring conversation about a specific problem.

**Request**:
```bash
curl -X POST http://localhost:8007/v1/homework/{session_id}/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I'\''m stuck on problem 1",
    "problem_number": 1
  }'
```

**Request Body**:
```json
{
  "message": "I'm stuck on problem 1",
  "problem_number": 1
}
```

**Response**:
```json
{
  "response": "Let's work through it together. What variable are we trying to solve for?",
  "guidance_type": "guided_discovery",
  "hint_level": 1,
  "problem_number": 1,
  "message_id": "msg-123"
}
```

**Guidance Types**:
- `guided_discovery`: Leading questions, no direct answers
- `scaffolding`: Progressive hints based on struggle
- `metacognitive`: Prompts about thinking process

---

### 3. Get Conversation History

**GET** `/{session_id}/history`

Retrieve all messages in the tutoring session.

**Request**:
```bash
curl http://localhost:8007/v1/homework/{session_id}/history \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [
    {
      "role": "user",
      "content": "I'm stuck on problem 1",
      "problem_number": 1,
      "timestamp": "2025-11-08T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "What variable are we solving for?",
      "guidance_type": "guided_discovery",
      "hint_level": 1,
      "timestamp": "2025-11-08T10:30:05Z"
    }
  ],
  "total_messages": 2
}
```

---

### 4. WebSocket Writing Pad

**WebSocket** `/{session_id}/writing-pad`

Real-time handwriting recognition.

**Connection**:
```javascript
const ws = new WebSocket('ws://localhost:8007/v1/homework/{session_id}/writing-pad');

// Send stroke data
ws.send(JSON.stringify({
  type: 'stroke',
  points: [
    {x: 10, y: 20, pressure: 0.5, timestamp: 1699444800000},
    {x: 15, y: 25, pressure: 0.6, timestamp: 1699444800100}
  ],
  problem_number: 1
}));

// Receive recognition results
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Recognized:', data.latex);
  console.log('Confidence:', data.confidence);
};
```

**Message Types**:

**Client → Server**:
```json
{
  "type": "stroke",
  "points": [
    {"x": 10, "y": 20, "pressure": 0.5, "timestamp": 1699444800000}
  ],
  "problem_number": 1
}
```

**Server → Client**:
```json
{
  "type": "recognition",
  "latex": "2x + 5 = 13",
  "text": "2x + 5 = 13",
  "confidence": 0.89,
  "problem_number": 1
}
```

---

### 5. Get Session Progress

**GET** `/{session_id}/progress`

Get analytics for the tutoring session.

**Request**:
```bash
curl http://localhost:8007/v1/homework/{session_id}/progress \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_problems": 5,
  "current_problem": 2,
  "problems_completed": 1,
  "total_messages": 12,
  "current_hint_level": 3,
  "student_independence_score": 0.72,
  "time_elapsed_minutes": 18,
  "started_at": "2025-11-08T10:00:00Z",
  "last_activity": "2025-11-08T10:18:00Z"
}
```

---

## Configuration

### Environment Variables

```bash
# Service
SERVICE_NAME=homework-helper-svc
VERSION=1.0.0
PORT=8007
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/aivo_homework
REDIS_URL=redis://localhost:6379/5

# AI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
ANTHROPIC_API_KEY=sk-ant-...  # Optional fallback

# Google Cloud (for OCR)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
GOOGLE_PROJECT_ID=your-project-id

# OCR Settings
TESSERACT_PATH=/usr/bin/tesseract
OCR_LANGUAGES=eng  # Comma-separated: eng,spa,fra
OCR_DPI=300
HANDWRITING_DETECTION=true

# Math Processing
MATH_CONFIDENCE_THRESHOLD=0.85
ENABLE_LATEX_CONVERSION=true

# Socratic Tutoring
MAX_HINT_LEVEL=6
ENABLE_METACOGNITIVE_PROMPTS=true
MIN_THINK_TIME_SECONDS=5

# File Upload
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=pdf,png,jpg,jpeg
UPLOAD_STORAGE_PATH=/app/uploads

# Session Management
SESSION_TIMEOUT_MINUTES=120
CONVERSATION_HISTORY_LIMIT=50

# Rate Limiting
MAX_UPLOADS_PER_HOUR=10
MAX_CHAT_MESSAGES_PER_MINUTE=20

# Monitoring
PROMETHEUS_ENABLED=true
SENTRY_DSN=https://...
```

---

## Database Schema

### Tables

#### **homework_sessions**
Main session tracking:
```sql
- id: UUID (PK)
- child_id: UUID (FK)
- document_name: VARCHAR
- document_type: VARCHAR
- subject: ENUM (SubjectType)
- grade: INTEGER
- ocr_result: JSONB
- extracted_problems: JSONB
- status: ENUM (processing/ready/in_progress/completed/error)
- current_problem_index: INTEGER (default 0)
- hint_level: INTEGER (default 0)
- created_at, updated_at, completed_at: TIMESTAMP
```

#### **homework_documents**
Binary file storage:
```sql
- id: UUID (PK)
- session_id: UUID (FK, unique)
- content: BYTEA
- filename: VARCHAR
- content_type: VARCHAR
- size: INTEGER
- storage_path: VARCHAR
- uploaded_at: TIMESTAMP
```

#### **chat_messages**
Conversation history:
```sql
- id: UUID (PK)
- session_id: UUID (FK)
- role: VARCHAR (user/assistant/system)
- content: TEXT
- guidance_type: VARCHAR (guided_discovery/scaffolding/metacognitive)
- problem_number: INTEGER
- hint_level: INTEGER
- metadata: JSONB
- student_attempt: TEXT
- error_identified: VARCHAR
- timestamp: TIMESTAMP
```

#### **tutoring_analytics**
Effectiveness tracking:
```sql
- id: UUID (PK)
- session_id: UUID (FK)
- child_id: UUID
- total_problems, problems_attempted, problems_completed: INTEGER
- total_messages, hints_requested: INTEGER
- average_hint_level: FLOAT
- total_time_minutes, time_per_problem_avg: FLOAT
- concepts_mastered: ARRAY
- struggles_identified: ARRAY
- guided_discovery_effectiveness: FLOAT (0-1)
- student_independence_score: FLOAT (0-1)
- created_at, updated_at: TIMESTAMP
```

---

## Deployment

### Docker

**Build**:
```bash
cd services/homework-helper-svc
docker build -t aivo-homework-helper .
```

**Run**:
```bash
docker run -d \
  -p 8007:8007 \
  --env-file .env \
  --name homework-helper \
  aivo-homework-helper
```

### Docker Compose

```yaml
homework-helper:
  build: ./services/homework-helper-svc
  ports:
    - "8007:8007"
  environment:
    - DATABASE_URL=postgresql+asyncpg://aivo:password@postgres:5432/aivo_homework
    - REDIS_URL=redis://redis:6379/5
    - OPENAI_API_KEY=${OPENAI_API_KEY}
  depends_on:
    - postgres
    - redis
  restart: unless-stopped
```

**Start**:
```bash
docker-compose up -d homework-helper
```

---

## Monitoring

### Health Check
```bash
curl http://localhost:8007/health
```

**Response**:
```json
{
  "status": "healthy",
  "service": "homework-helper-svc",
  "version": "1.0.0"
}
```

### Prometheus Metrics
```bash
curl http://localhost:8007/metrics
```

**Available Metrics**:
- `homework_uploads_total`: Total homework uploads
- `ocr_success_rate`: OCR confidence scores (histogram)
- `tutoring_sessions_total`: Active tutoring sessions (gauge)
- `math_problems_solved_total`: Completed problems

---

## Best Practices

### For Students
1. **Upload clear photos**: Good lighting, no shadows
2. **One problem at a time**: Focus on understanding each problem
3. **Engage with questions**: Think before asking for hints
4. **Explain your thinking**: Practice metacognition

### For Teachers/Parents
1. **Monitor independence scores**: Track student self-reliance
2. **Review hint usage**: High hint levels may indicate concept gaps
3. **Check time per problem**: Unusually long times need investigation
4. **Use analytics**: Identify patterns in struggles

---

## Troubleshooting

### OCR Not Working
1. Check Google Cloud credentials:
   ```bash
   echo $GOOGLE_APPLICATION_CREDENTIALS
   ```
2. Verify Tesseract installation:
   ```bash
   docker exec homework-helper tesseract --version
   ```
3. Check file format and size

### Poor Recognition Quality
- Increase DPI: `OCR_DPI=400`
- Enable handwriting detection: `HANDWRITING_DETECTION=true`
- Use higher quality images

### Rate Limit Errors
- Adjust limits in .env
- Check Redis connection
- Review usage patterns

---

## Security

### Data Privacy
- All homework documents encrypted at rest
- Student data FERPA compliant
- No retention of uploaded files beyond session
- Audit logging for all access

### API Security
- JWT authentication required
- Rate limiting per student
- File type validation
- Size limits enforced

---

## Future Enhancements

- [ ] Support for more languages (Spanish, French, Mandarin)
- [ ] Voice input for verbal problem explanation
- [ ] Collaborative tutoring sessions
- [ ] Parent/teacher observation mode
- [ ] Offline mode with local OCR

---

## Support

- **Documentation**: http://localhost:8007/docs (Swagger UI)
- **Metrics**: http://localhost:8007/metrics
- **Logs**: `docker logs homework-helper`

---

**Version**: 1.0.0  
**License**: Proprietary - AIVO Learning Platform  
**Last Updated**: November 8, 2025
