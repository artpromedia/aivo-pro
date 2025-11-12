# Safety & Moderation Service

Production-grade content moderation, child safety, and compliance enforcement service.

## Features

### Content Moderation Engine
- **Multi-Layer Filtering**: Profanity detection, toxicity analysis, PII detection
- **ML-Based Classification**: Uses BERT-based models for toxicity detection
- **Age-Appropriate Content**: Ensures content is suitable for different age groups
- **Real-Time Moderation**: Sub-second response times for content checks

### Child Safety Guard
- **COPPA Compliance**: Full compliance with Children's Online Privacy Protection Act
- **FERPA Guardian**: Educational records privacy enforcement
- **Parental Consent Management**: Digital consent tracking and verification
- **Behavior Monitoring**: Real-time analysis of user interactions
- **Grooming Detection**: ML-powered detection of grooming patterns

### Platform Safety Monitor
- **Threat Detection**: Real-time identification of safety threats
- **Safety Score**: Continuous platform safety scoring
- **Incident Response**: Automated handling of critical incidents
- **Compliance Auditing**: Automated audit trails for regulations

## Architecture

```
Safety & Moderation Service
├── Content Moderation Engine
│   ├── Profanity Filter (better-profanity)
│   ├── Toxicity Detector (toxic-bert)
│   ├── PII Detector (regex + ML)
│   ├── Image Scanner (NSFW detection)
│   └── Content Classifier (BART)
├── Child Safety Guard
│   ├── COPPA Enforcer
│   ├── FERPA Guardian
│   ├── Behavior Analyzer
│   └── Consent Manager
└── Platform Safety Monitor
    ├── Threat Assessment
    ├── Safety Scoring
    └── Incident Handler
```

## API Endpoints

### Content Moderation
- `POST /v1/moderate/content` - Moderate text content
- `POST /v1/moderate/image` - Moderate image uploads

### Safety Monitoring
- `POST /v1/safety/monitor-interaction` - Monitor user interactions
- `POST /v1/safety/report-concern` - Report safety concerns
- `GET /v1/safety/score` - Get platform safety score

### Compliance
- `POST /v1/compliance/parental-consent` - Record parental consent

## Setup

### Local Development
```bash
cd services/safety-moderation-svc

# Install dependencies
pip install -r requirements.txt

# Run service
uvicorn src.main:app --reload --port 8016
```

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f safety-moderation-svc
```

## Configuration

Environment variables:
```env
DATABASE_URL=postgresql+asyncpg://aivo:aivopass@localhost:5432/aivo_safety
REDIS_URL=redis://localhost:6379/7
PERSPECTIVE_API_KEY=your_key_here
TOXICITY_THRESHOLD=0.7
COPPA_AGE_LIMIT=13
```

## ML Models

The service uses the following pre-trained models:
- **toxic-bert**: Toxicity detection (Unitary AI)
- **bart-large-mnli**: Zero-shot classification (Facebook)
- **better-profanity**: Profanity filtering

Models are automatically downloaded on first run.

## Compliance

### COPPA (Children's Online Privacy Protection Act)
- Age verification for users under 13
- Parental consent tracking
- Data minimization for children
- Retention policy enforcement

### FERPA (Family Educational Rights and Privacy Act)
- Access authorization checks
- Educational records protection
- Anonymization for research

## Monitoring

Prometheus metrics available at `/metrics`:
- `content_moderated_total` - Content moderation counter
- `threats_detected_total` - Threat detection counter
- `moderation_latency_ms` - Moderation latency histogram
- `platform_safety_score` - Overall safety score gauge

## Testing

```bash
# Test content moderation
curl -X POST http://localhost:8016/v1/moderate/content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test message",
    "content_type": "text",
    "user_id": "user123",
    "context": {"age": 12}
  }'

# Check health
curl http://localhost:8016/health
```

## Security Considerations

- All PII is encrypted at rest
- Content hashes used for audit trails
- Rate limiting on moderation endpoints
- Secure parental consent verification
- Automated threat escalation

## License

Proprietary - AIVO Learning Platform
