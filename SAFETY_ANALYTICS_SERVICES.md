# Safety & Moderation + District Analytics Services

## Overview

Two production-ready microservices implementing advanced safety, compliance, and analytics capabilities for the AIVO Learning Platform.

## Services

### 1. Safety & Moderation Service (Port 8016)
**Purpose**: Content moderation, child safety, and regulatory compliance

**Key Features**:
- Multi-layer content filtering (profanity, toxicity, PII)
- COPPA/FERPA compliance enforcement
- Grooming pattern detection
- Real-time threat monitoring
- Parental consent management
- Platform safety scoring

**Tech Stack**:
- FastAPI + Uvicorn
- PostgreSQL + Redis
- Transformers (toxic-bert, BART)
- better-profanity
- Perspective API (optional)

### 2. District Detection & Analytics Service (Port 8017)
**Purpose**: Geographic district detection and comprehensive learning analytics

**Key Features**:
- Zipcode-to-district mapping
- NCES boundary integration
- Multi-dimensional analytics (learning, engagement, progress)
- ML-powered outcome prediction
- Trend analysis
- Interactive visualizations
- Benchmarking (national/state/district)

**Tech Stack**:
- FastAPI + Uvicorn
- PostgreSQL + Redis
- GeoPandas + Shapely
- Plotly (visualizations)
- scikit-learn (ML models)

## Quick Start

### Run Both Services with Docker Compose

Create `docker-compose.services.yml`:
```yaml
version: '3.8'

services:
  # Safety & Moderation Service
  safety-moderation:
    build: ./services/safety-moderation-svc
    ports:
      - "8016:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://aivo:aivopass@postgres:5432/aivo_safety
      - REDIS_URL=redis://redis:6379/7
      - PERSPECTIVE_API_KEY=${PERSPECTIVE_API_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - aivo-network
  
  # District & Analytics Service
  district-analytics:
    build: ./services/district-analytics-svc
    ports:
      - "8017:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://aivo:aivopass@postgres:5432/aivo_analytics
      - REDIS_URL=redis://redis:6379/8
      - NCES_API_KEY=${NCES_API_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - aivo-network
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=aivo
      - POSTGRES_PASSWORD=aivopass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - aivo-network
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - aivo-network

volumes:
  postgres_data:
  redis_data:

networks:
  aivo-network:
    driver: bridge
```

Run services:
```bash
docker-compose -f docker-compose.services.yml up -d
```

### Local Development

**Safety & Moderation Service**:
```bash
cd services/safety-moderation-svc
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8016
```

**District Analytics Service**:
```bash
cd services/district-analytics-svc
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8017
```

## API Examples

### Safety & Moderation

**Moderate Content**:
```bash
curl -X POST http://localhost:8016/v1/moderate/content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test message",
    "content_type": "text",
    "user_id": "user123",
    "context": {"age": 12, "grade_band": "6-8"}
  }'
```

**Monitor Interaction**:
```bash
curl -X POST http://localhost:8016/v1/safety/monitor-interaction \
  -H "Content-Type: application/json" \
  -d '{
    "interaction_data": {
      "user_id": "user123",
      "content": "Hello teacher",
      "recipient_id": "teacher456",
      "timestamp": "2025-11-09T10:00:00Z"
    }
  }'
```

**Get Safety Score**:
```bash
curl http://localhost:8016/v1/safety/score
```

### District Analytics

**Detect District**:
```bash
curl -X POST http://localhost:8017/v1/district/detect \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "94102"}'
```

**Generate Analytics**:
```bash
curl -X POST http://localhost:8017/v1/analytics/generate \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "student",
    "entity_id": "student123",
    "date_range": {
      "start": "2025-10-01T00:00:00Z",
      "end": "2025-11-01T00:00:00Z"
    },
    "metrics": ["learning", "engagement", "progress"]
  }'
```

**Get Dashboard Data**:
```bash
curl http://localhost:8017/v1/analytics/dashboard/student/student123
```

## Integration with AIVO Platform

### Safety & Moderation Integration

**Parent Portal**: Use parental consent endpoints
```typescript
// Record parental consent
const response = await fetch('/api/safety/parental-consent', {
  method: 'POST',
  body: JSON.stringify({
    child_id: childId,
    consent_type: 'data_collection'
  })
});
```

**Learner App**: Moderate all user-generated content
```typescript
// Before posting message
const moderation = await fetch('/api/safety/moderate', {
  method: 'POST',
  body: JSON.stringify({
    content: message,
    content_type: 'text',
    user_id: currentUser.id,
    context: { age: currentUser.age }
  })
});

if (moderation.action === 'approve') {
  // Post message
} else {
  // Show warning
}
```

**Teacher Portal**: Monitor classroom interactions
```typescript
// Real-time monitoring
const ws = new WebSocket('/api/safety/real-time');
ws.onmessage = (event) => {
  const safetyData = JSON.parse(event.data);
  updateSafetyDashboard(safetyData);
};
```

### District Analytics Integration

**District Portal**: Show district-level analytics
```typescript
// Get district dashboard
const analytics = await fetch(
  `/api/analytics/dashboard/district/${districtId}`
);
```

**Teacher Portal**: View class analytics
```typescript
// Generate comprehensive report
const report = await fetch('/api/analytics/generate', {
  method: 'POST',
  body: JSON.stringify({
    entity_type: 'class',
    entity_id: classId,
    date_range: { start: startDate, end: endDate },
    metrics: ['learning', 'engagement', 'progress']
  })
});
```

**Parent Portal**: Show student progress
```typescript
// Get student analytics
const progress = await fetch(
  `/api/analytics/dashboard/student/${studentId}`
);
```

## Monitoring & Observability

### Prometheus Metrics

**Safety Service** (`http://localhost:8016/metrics`):
```
content_moderated_total{type="text",action="approved"} 1523
content_moderated_total{type="text",action="blocked"} 47
threats_detected_total{threat_type="grooming_indicator"} 3
moderation_latency_ms_bucket{le="50"} 1245
platform_safety_score 0.92
```

**Analytics Service** (`http://localhost:8017/metrics`):
```
districts_detected_total 342
analytics_reports_generated 156
data_points_processed 45231
analytics_latency_seconds_bucket{le="2.0"} 148
```

### Health Checks

```bash
# Safety Service
curl http://localhost:8016/health

# Analytics Service
curl http://localhost:8017/health
```

## Security Considerations

### Safety & Moderation
- All moderated content logged for audit
- PII automatically redacted
- Encryption at rest for sensitive data
- Rate limiting on moderation endpoints
- Automated threat escalation

### District Analytics
- FERPA-compliant data anonymization
- Row-level security on district data
- Encrypted data exports
- Access control by role
- Audit trails for all data access

## Performance

### Safety & Moderation
- Content moderation: < 200ms average
- Image scanning: < 500ms average
- Threat detection: Real-time
- Throughput: 1000+ req/sec

### District Analytics
- District detection: < 100ms (cached)
- Analytics generation: 1-3 seconds
- Dashboard queries: < 50ms (cached)
- Report generation: 2-5 seconds

## Database Schemas

### Safety Service Tables
- `moderation_logs` - Content moderation history
- `safety_incidents` - Critical incidents
- `threat_assessments` - Behavior analysis
- `parental_consents` - COPPA consent records
- `blocked_content` - Violation audit trail
- `compliance_audits` - Regulatory compliance logs

### Analytics Service Tables
- `districts` - District information
- `district_boundaries` - Geographic boundaries
- `schools` - School information
- `learning_metrics` - Performance data
- `engagement_metrics` - Activity data
- `analytics_reports` - Generated reports
- `benchmarks` - Comparison data

## Deployment

### Kubernetes (Production)
```bash
# Deploy both services
kubectl apply -f k8s/safety-moderation-deployment.yaml
kubectl apply -f k8s/district-analytics-deployment.yaml

# Verify
kubectl get pods -n aivo-services
```

### Docker Compose (Development)
```bash
# Start services
docker-compose -f docker-compose.services.yml up -d

# View logs
docker-compose logs -f safety-moderation
docker-compose logs -f district-analytics

# Stop services
docker-compose down
```

## Testing

### Integration Tests
```bash
# Safety & Moderation
cd services/safety-moderation-svc
pytest tests/integration/

# District Analytics
cd services/district-analytics-svc
pytest tests/integration/
```

### Load Testing
```bash
# Use k6 or locust
k6 run tests/load/safety-moderation.js
k6 run tests/load/district-analytics.js
```

## Troubleshooting

### Common Issues

**ML Models Not Loading**:
```bash
# Pre-download models
python -c "from transformers import pipeline; pipeline('text-classification', model='unitary/toxic-bert')"
```

**Database Connection Issues**:
```bash
# Check PostgreSQL
docker-compose ps postgres

# Check connection
psql -h localhost -U aivo -d aivo_safety
```

**Redis Connection Issues**:
```bash
# Check Redis
docker-compose ps redis

# Test connection
redis-cli -h localhost ping
```

## Support

For issues or questions:
- Safety Service: See `services/safety-moderation-svc/README.md`
- Analytics Service: See `services/district-analytics-svc/README.md`

## License

Proprietary - AIVO Learning Platform
