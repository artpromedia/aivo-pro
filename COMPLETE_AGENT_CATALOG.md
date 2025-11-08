# AIVO Complete Agent Catalog - Implementation Guide

## Overview
This document describes the complete 15-agent architecture for the AIVO Learning Platform, including implementation details for all new agents.

## Agent Catalog

### Core Learning Agents (7)
1. **AIVO Main Brain Agent** (Port 8001) - Foundation model orchestrator
2. **Baseline Assessment Agent** (Port 8002) - Adaptive testing with IRT
3. **Personalized Learning Clone Agent** (Port 8003) - Child-specific AI model
4. **Focus Monitor Agent** (Port 8005) - Distraction detection & intervention
5. **Game Generation Agent** (Port TBD) - Educational game creator
6. **Homework Helper Agent** (Port 8006) - Assignment assistance & tutoring
7. **IEP Assistant Agent** (Port 8007) - Goal generation & progress tracking

### Platform Intelligence Agents (4)
8. **District Detection Agent** (Port 8008) - Zipcode to curriculum mapping
9. **Model Monitor Agent** (Port 8015) - Performance & suggestion tracking
10. **Training & Alignment Agent** (Port 8009) - ✅ **IMPLEMENTED** - Continuous learning & responsible AI
11. **Language Translator Agent** (Port 8010) - Multi-language support

### Business & Operations Agents (4)
12. **Business Model Agent** (Port 8011) - Subscription & licensing logic
13. **Notification Agent** (Port 8012) - Multi-channel communications
14. **Safety & Moderation Agent** (Port 8014) - Content filtering & child safety
15. **Analytics & Insights Agent** (Port 8013) - Platform-wide intelligence

---

## Implemented Agents

### Training & Alignment Agent ✅
**Location**: `services/training-alignment-svc/`
**Port**: 8009
**Status**: Fully implemented

**Features**:
- Responsible AI governance with 6 core rules
- Bias detection (gender, racial, disability, socioeconomic)
- Model drift monitoring with automatic retraining triggers
- Continuous training pipeline with priority-based scheduling
- Compliance reporting and audit trail

**API Endpoints**:
- `POST /v1/alignment/validate` - Validate model outputs
- `POST /v1/bias/check` - Check for bias
- `POST /v1/bias/mitigate` - Apply bias mitigation
- `POST /v1/training/schedule` - Schedule retraining
- `POST /v1/training/auto-schedule` - Auto-schedule training
- `POST /v1/drift/check` - Check model drift
- `GET /v1/governance/report` - Generate governance report
- `GET /v1/model/{id}/status` - Get model status

**Key Modules**:
- `governance.py` - Responsible AI validation
- `bias_detection.py` - Bias analysis and mitigation
- `drift_monitor.py` - Performance drift detection
- `training.py` - Continuous training pipeline

---

## Implementation Roadmap for Remaining Agents

### 1. Language Translator Agent (Priority: HIGH)

**Location**: `services/translator-svc/`
**Port**: 8010

**Key Features**:
- Support for 50+ languages
- Education-specific terminology preservation
- RTL language support (Arabic, Hebrew, Persian, Urdu)
- Audio translation for accessibility
- Context-aware translation (IEP, math, general)

**Tech Stack**:
- FastAPI
- Hugging Face Transformers (M2M100)
- Google Translate API (fallback)
- Google Cloud TTS / Amazon Polly (audio)

**Critical Endpoints**:
```python
POST /v1/translate/content      # Single translation
POST /v1/translate/batch        # Batch translation
POST /v1/translate/document     # Full document (IEP/report)
POST /v1/translate/audio        # Text-to-speech
GET  /v1/languages/supported    # List supported languages
```

**Files to Create**:
```
services/translator-svc/
├── package.json
├── requirements.txt
├── Dockerfile
├── .env.example
├── README.md
└── src/
    ├── main.py
    ├── config.py
    ├── translator.py
    ├── glossary.py
    ├── audio.py
    └── __init__.py
```

### 2. Business Model Agent (Priority: HIGH)

**Location**: `services/business-model-svc/`
**Port**: 8011

**Key Features**:
- Subscription lifecycle management (create, upgrade, cancel)
- License allocation for districts
- Dynamic pricing engine
- Churn prediction and retention
- Revenue analytics

**Tech Stack**:
- FastAPI
- Stripe SDK (payment processing)
- scikit-learn (churn prediction)
- Redis (caching)

**Critical Endpoints**:
```python
POST   /v1/subscription/create           # Create subscription
POST   /v1/subscription/{id}/upgrade     # Upgrade plan
POST   /v1/subscription/{id}/cancel      # Cancel subscription
POST   /v1/license/allocate              # Allocate licenses
GET    /v1/license/{district_id}/usage   # Track usage
POST   /v1/churn/predict                 # Predict churn
GET    /v1/revenue/metrics               # Revenue KPIs
```

**Pricing Tiers**:
```yaml
parent_single:
  monthly: $29.99
  annual: $299.99
  
parent_family:
  monthly: $25.00/child
  annual: $250.00/child
  
district_small:
  per_student: $20.00
  minimum: 25 students
  
district_medium:
  per_student: $15.00
  minimum: 100 students
  
district_enterprise:
  custom_pricing: true
  minimum: 500 students
```

### 3. Notification Agent (Priority: MEDIUM)

**Location**: `services/notification-svc/`
**Port**: 8012

**Key Features**:
- Multi-channel delivery (email, SMS, push, in-app)
- Template management with localization
- User preference management
- Delivery tracking and analytics
- Scheduled notifications

**Tech Stack**:
- FastAPI
- SendGrid (email)
- Twilio (SMS)
- Firebase Cloud Messaging (push)
- Celery (scheduling)

**Critical Endpoints**:
```python
POST   /v1/notify/send                   # Send notification
POST   /v1/notify/batch                  # Batch send
POST   /v1/notify/schedule               # Schedule notification
PUT    /v1/notify/preferences/{user_id}  # Update preferences
POST   /v1/notify/unsubscribe            # Handle unsubscribe
GET    /v1/notify/templates              # List templates
```

**Notification Types**:
- Welcome & onboarding
- Learning reminders (daily)
- Progress updates (weekly)
- IEP goal achievements
- Subscription renewals
- System alerts
- Feature announcements

### 4. Analytics & Insights Agent (Priority: MEDIUM)

**Location**: `services/analytics-insights-svc/`
**Port**: 8013

**Key Features**:
- Executive dashboard KPIs
- Learning effectiveness analysis
- Predictive analytics
- Platform-wide metrics
- Custom report generation

**Tech Stack**:
- FastAPI
- pandas / numpy (data processing)
- scikit-learn (predictions)
- PostgreSQL (data warehouse)
- Redis (caching)

**Critical Endpoints**:
```python
GET    /v1/analytics/dashboard           # Executive dashboard
GET    /v1/analytics/learning            # Learning metrics
GET    /v1/analytics/engagement          # Engagement metrics
GET    /v1/analytics/revenue             # Revenue analytics
POST   /v1/analytics/predict             # Predictive analytics
GET    /v1/analytics/export              # Export reports
```

**Key Metrics**:
- Total active learners
- Learning hours per week
- IEP goal achievement rate
- Platform efficiency score
- Mastery rate by subject
- Time to mastery
- Engagement metrics
- Revenue metrics (MRR, ARR, churn)

---

## Integration Architecture

### Agent Communication Matrix

```mermaid
graph TB
    subgraph "Frontend Apps"
        A[Web Portal]
        B[Parent Portal]
        C[Teacher Portal]
        D[Learner App]
    end
    
    subgraph "API Gateway"
        E[Kong/Express Gateway]
    end
    
    subgraph "Core Learning Agents"
        F[AIVO Brain<br/>:8001]
        G[Baseline Assessment<br/>:8002]
        H[Model Cloning<br/>:8003]
        I[Learning Session<br/>:8004]
        J[Focus Monitor<br/>:8005]
    end
    
    subgraph "Platform Intelligence"
        K[Training & Alignment<br/>:8009]
        L[Translator<br/>:8010]
        M[Model Monitor<br/>:8015]
        N[District Detection<br/>:8008]
    end
    
    subgraph "Business & Operations"
        O[Business Model<br/>:8011]
        P[Notification<br/>:8012]
        Q[Analytics<br/>:8013]
        R[Safety<br/>:8014]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> F
    E --> G
    E --> O
    
    F --> K
    F --> L
    F --> R
    
    G --> F
    H --> F
    H --> K
    
    I --> F
    I --> J
    I --> Q
    
    K --> M
    L --> P
    O --> P
    O --> Q
    
    M --> Q
```

### Data Flow Patterns

#### 1. Learning Session Flow
```
Learner App 
  → API Gateway 
  → Learning Session Service :8004
    → AIVO Brain :8001 (content generation)
    → Focus Monitor :8005 (attention tracking)
    → Translator :8010 (multi-language)
    → Safety :8014 (content filtering)
  ← Personalized content returned
```

#### 2. Model Training Flow
```
Model Monitor :8015 (detects drift)
  → Training & Alignment :8009
    → Collect training data
    → Validate governance rules
    → Check bias metrics
    → Execute training
    → Deploy updated model
  → Model Cloning :8003 (update child models)
  → Analytics :8013 (track improvements)
```

#### 3. Subscription Flow
```
Parent Portal
  → API Gateway
  → Business Model :8011
    → Stripe payment processing
    → License allocation
    → Notification :8012 (welcome email)
  → Analytics :8013 (revenue tracking)
```

---

## Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    depends_on:
      - aivo-brain
      - training-alignment
      - translator
      - business-model
      - notification

  # Core Learning Agents
  aivo-brain:
    build: ./services/aivo-brain-svc
    ports:
      - "8001:8001"
    environment:
      - AI_PROVIDERS=openai,anthropic,google,meta
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}

  baseline-assessment:
    build: ./services/baseline-assessment-svc
    ports:
      - "8002:8002"

  model-cloning:
    build: ./services/model-cloning-svc
    ports:
      - "8003:8003"
    depends_on:
      - training-alignment

  learning-session:
    build: ./services/learning-session-svc
    ports:
      - "8004:8004"
    depends_on:
      - aivo-brain
      - focus-monitor

  focus-monitor:
    build: ./services/focus-monitor-svc
    ports:
      - "8005:8005"

  homework-helper:
    build: ./services/homework-helper-svc
    ports:
      - "8006:8006"

  iep-assistant:
    build: ./services/iep-assistant-svc
    ports:
      - "8007:8007"

  # Platform Intelligence Agents
  district-detection:
    build: ./services/district-detection-svc
    ports:
      - "8008:8008"

  training-alignment:
    build: ./services/training-alignment-svc
    ports:
      - "8009:8009"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - BIAS_THRESHOLD=0.10
      - DRIFT_THRESHOLD=0.15

  translator:
    build: ./services/translator-svc
    ports:
      - "8010:8010"
    environment:
      - GOOGLE_TRANSLATE_API_KEY=${GOOGLE_TRANSLATE_API_KEY}
      - GOOGLE_CLOUD_TTS_KEY=${GOOGLE_CLOUD_TTS_KEY}

  # Business & Operations Agents
  business-model:
    build: ./services/business-model-svc
    ports:
      - "8011:8011"
    environment:
      - STRIPE_API_KEY=${STRIPE_API_KEY}
      - DATABASE_URL=${DATABASE_URL}

  notification:
    build: ./services/notification-svc
    ports:
      - "8012:8012"
    environment:
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - FIREBASE_CONFIG=${FIREBASE_CONFIG}

  analytics-insights:
    build: ./services/analytics-insights-svc
    ports:
      - "8013:8013"

  safety-moderation:
    build: ./services/safety-moderation-svc
    ports:
      - "8014:8014"

  model-monitor:
    build: ./services/model-monitor-svc
    ports:
      - "8015:8015"

  # Infrastructure
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=aivo
      - POSTGRES_USER=aivo
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Environment Variables

Create a `.env` file at the root:

```bash
# Database
DATABASE_URL=postgresql://aivo:password@postgres:5432/aivo
REDIS_URL=redis://redis:6379/0

# AI Providers
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key

# Payment Processing
STRIPE_API_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Communication Services
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push Notifications)
FIREBASE_CONFIG=your_firebase_config_json

# Translation Services
GOOGLE_TRANSLATE_API_KEY=your_translate_key
GOOGLE_CLOUD_TTS_KEY=your_tts_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=INFO

# Feature Flags
ENABLE_AUTO_RETRAINING=true
ENABLE_BIAS_MITIGATION=true
ENABLE_MULTI_LANGUAGE=true
```

---

## Development Workflow

### Starting All Services

```bash
# Start all agents
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop all services
docker-compose down
```

### Development Mode (Individual Services)

```bash
# Training & Alignment Agent
cd services/training-alignment-svc
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8009

# Translator Agent
cd services/translator-svc
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8010

# Business Model Agent
cd services/business-model-svc
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8011
```

### Testing

```bash
# Test individual agent
cd services/training-alignment-svc
pytest tests/

# Test all agents
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Integration tests
npm run test:integration
```

---

## TypeScript Types

Update `packages/types/src/agents.ts`:

```typescript
// Training & Alignment Agent
export interface AlignmentValidationRequest {
  model_id: string;
  output: string;
  context: Record<string, any>;
  rules?: GovernanceRule[];
}

export interface BiasMetrics {
  gender_bias: number;
  racial_bias: number;
  disability_bias: number;
  socioeconomic_bias: number;
  overall_bias_score: number;
}

export interface DriftResponse {
  model_id: string;
  drift_score: number;
  drift_detected: boolean;
  degradation_percentage: number;
  recommendation: string;
}

// Translator Agent
export interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
  context?: 'general' | 'iep' | 'math' | 'interface';
}

export interface TranslationResponse {
  original: string;
  translated: string;
  source_lang: string;
  target_lang: string;
  confidence: number;
  rtl: boolean;
}

// Business Model Agent
export interface SubscriptionRequest {
  user_id: string;
  plan: SubscriptionPlan;
  payment_method: string;
}

export type SubscriptionPlan = 
  | 'parent_single'
  | 'parent_family'
  | 'district_small'
  | 'district_medium'
  | 'district_enterprise';

export interface ChurnPrediction {
  user_id: string;
  churn_score: number;
  risk_level: 'low' | 'medium' | 'high';
  interventions: RetentionIntervention[];
}

// Notification Agent
export interface NotificationRequest {
  user_id: string;
  type: NotificationType;
  data: Record<string, any>;
  channels?: NotificationChannel[];
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export type NotificationType =
  | 'welcome'
  | 'learning_reminder'
  | 'progress_update'
  | 'iep_goal_achieved'
  | 'subscription_renewal';

// Analytics Agent
export interface AnalyticsDashboard {
  kpis: PlatformKPIs;
  trends: TrendData[];
  predictions: PredictionData[];
  recommendations: string[];
}

export interface PlatformKPIs {
  total_users: number;
  active_learners: number;
  learning_hours: number;
  iep_goals_achieved: number;
  platform_efficiency: number;
}
```

---

## Next Steps

### Immediate (Week 1-2)
1. ✅ Complete Training & Alignment Agent
2. 🔄 Implement Translator Agent (50+ languages)
3. 🔄 Implement Business Model Agent (Stripe integration)

### Short Term (Week 3-4)
4. Implement Notification Agent (multi-channel)
5. Implement Analytics & Insights Agent
6. Integration testing across all agents

### Medium Term (Month 2)
7. Performance optimization
8. Monitoring and alerting setup
9. Documentation and API reference
10. Developer portal

### Long Term (Month 3+)
11. Advanced features (predictive analytics)
12. Additional language support
13. White-label capabilities
14. Enterprise features

---

## Monitoring & Observability

### Health Checks

Each agent exposes:
- `GET /health` - Health status
- `GET /metrics` - Prometheus metrics
- `GET /ready` - Readiness probe

### Logging

Centralized logging with structured format:
```json
{
  "timestamp": "2025-11-08T10:30:00Z",
  "service": "training-alignment-svc",
  "level": "INFO",
  "message": "Model validation completed",
  "model_id": "model_123",
  "compliant": true
}
```

### Metrics

Key metrics to track:
- Request latency (p50, p95, p99)
- Error rates
- Model performance metrics
- Bias detection rates
- Translation accuracy
- Subscription conversion rates
- Notification delivery rates

---

## Security Considerations

1. **API Authentication**: JWT tokens for all inter-service communication
2. **Data Encryption**: TLS 1.3 for all traffic
3. **PII Protection**: Anonymization in training pipelines
4. **Rate Limiting**: Per-user and per-endpoint limits
5. **Input Validation**: Strict schema validation
6. **Secret Management**: Use environment variables / vault

---

## Support & Resources

- **Documentation**: `/docs` on each service
- **API Reference**: OpenAPI/Swagger at `/openapi.json`
- **Status Page**: `status.aivolearning.com`
- **Support**: `support@aivolearning.com`

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
**Status**: Training & Alignment Agent Implemented ✅
