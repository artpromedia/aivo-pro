# Speech Therapy & SEL Services - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20.19.4
- pnpm 9.x
- Python 3.11+ (for local development)

### 1. Clone and Setup

```bash
cd aivo-pro

# Copy environment files
cp services/speech-therapy-svc/.env.example services/speech-therapy-svc/.env
cp services/sel-agent-svc/.env.example services/sel-agent-svc/.env

# Update environment variables if needed
```

### 2. Start Services

#### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d speech-therapy-svc sel-agent-svc

# View logs
docker-compose logs -f speech-therapy-svc sel-agent-svc

# Check health
curl http://localhost:8014/health  # Speech Therapy
curl http://localhost:8015/health  # SEL
```

#### Option B: Local Development

```bash
# Terminal 1: Speech Therapy Service
cd services/speech-therapy-svc
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --port 8014

# Terminal 2: SEL Service
cd services/sel-agent-svc
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --port 8015

# Terminal 3: Frontend
cd apps/learner-app
pnpm install
pnpm dev
```

### 3. Access Services

- **Speech Therapy Service:** http://localhost:8014
- **SEL Service:** http://localhost:8015
- **API Documentation (Speech):** http://localhost:8014/docs
- **API Documentation (SEL):** http://localhost:8015/docs
- **Metrics (Speech):** http://localhost:8014/metrics
- **Metrics (SEL):** http://localhost:8015/metrics
- **Learner App:** http://localhost:5176

---

## 📋 Quick API Examples

### Speech Therapy

#### 1. Conduct Assessment

```bash
curl -X POST http://localhost:8014/v1/speech/assessment \
  -F "audio_file=@recording.wav" \
  -F "child_id=child123" \
  -F "child_age=7" \
  -F 'concerns=["articulation"]'
```

#### 2. Get Daily Activity

```bash
curl -X POST http://localhost:8014/v1/speech/activity \
  -H "Content-Type: application/json" \
  -d '{
    "child_id": "child123",
    "age": 7,
    "session_id": "session456"
  }'
```

#### 3. WebSocket Live Therapy

```javascript
const ws = new WebSocket('ws://localhost:8014/v1/speech/live-therapy');

ws.onopen = () => {
  // Send audio data
  ws.send(audioBlob);
};

ws.onmessage = (event) => {
  const feedback = JSON.parse(event.data);
  console.log('Feedback:', feedback);
};
```

### Social-Emotional Learning

#### 1. Create SEL Program

```bash
curl -X POST http://localhost:8015/v1/sel/program \
  -H "Content-Type: application/json" \
  -d '{
    "child_id": "child123",
    "age": 9,
    "assessment_data": {
      "strengths": ["empathy"],
      "challenges": ["emotion_regulation"]
    },
    "parent_concerns": ["anxiety"]
  }'
```

#### 2. Emotional Check-In

```bash
curl -X POST http://localhost:8015/v1/sel/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "child_id": "child123",
    "age": 6,
    "context": "morning"
  }'
```

#### 3. Get Daily Activity

```bash
curl -X POST http://localhost:8015/v1/sel/activity \
  -H "Content-Type: application/json" \
  -d '{
    "child_age": 8,
    "focus_competency": "self_awareness",
    "previous_activities": []
  }'
```

#### 4. Guide Mindfulness Session

```bash
curl -X POST http://localhost:8015/v1/sel/mindfulness \
  -H "Content-Type: application/json" \
  -d '{
    "child_age": 7,
    "session_type": "breathing",
    "duration_minutes": 5
  }'
```

---

## 🎯 Testing the Frontend

### Speech Therapy Interface

1. Navigate to `http://localhost:5176`
2. Go to Speech Therapy section
3. Allow microphone access
4. Click "Start" to record
5. Say target word clearly
6. Click "Stop" to submit
7. View feedback and stars

### SEL Interface

1. Navigate to `http://localhost:5176`
2. Go to SEL section
3. Select your emotion
4. Try breathing exercise
5. Complete daily activity
6. Add flowers to kindness garden

---

## 🔧 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs speech-therapy-svc
docker-compose logs sel-agent-svc

# Restart services
docker-compose restart speech-therapy-svc sel-agent-svc

# Rebuild if needed
docker-compose build --no-cache speech-therapy-svc sel-agent-svc
docker-compose up -d speech-therapy-svc sel-agent-svc
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Create databases manually
docker-compose exec postgres psql -U aivo -c "CREATE DATABASE aivo_speech_therapy;"
docker-compose exec postgres psql -U aivo -c "CREATE DATABASE aivo_sel;"
```

### Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping
```

### Frontend Issues

```bash
# Clear cache and reinstall
cd apps/learner-app
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Microphone Not Working

1. Check browser permissions (Chrome: chrome://settings/content/microphone)
2. Use HTTPS in production (microphone requires secure context)
3. Test with: `navigator.mediaDevices.getUserMedia({ audio: true })`

---

## 📊 Monitoring

### Prometheus Metrics

Add to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'speech-therapy'
    static_configs:
      - targets: ['localhost:8014']
    metrics_path: /metrics

  - job_name: 'sel-agent'
    static_configs:
      - targets: ['localhost:8015']
    metrics_path: /metrics
```

### Key Metrics to Monitor

**Speech Therapy:**
- `speech_therapy_sessions_total` - Session count
- `articulation_improvement_rate` - Progress tracking
- `words_practiced_total` - Engagement

**SEL:**
- `emotional_checkins_total` - Daily usage
- `mindfulness_sessions_total` - Practice frequency
- `sel_activities_completed_total` - Engagement

---

## 🔐 Security Considerations

### Production Deployment

1. **Environment Variables:**
   ```bash
   # Use strong passwords
   DB_PASSWORD=<strong-password>
   REDIS_PASSWORD=<strong-password>
   ```

2. **HTTPS Required:**
   - Microphone access requires HTTPS
   - Use Let's Encrypt for certificates

3. **API Authentication:**
   - Implement JWT tokens
   - Rate limiting
   - CORS configuration

4. **Data Privacy:**
   - Encrypt audio recordings
   - Anonymize PII
   - HIPAA compliance for healthcare data

---

## 📚 Next Steps

1. **Review Documentation:**
   - Full docs: `SPEECH_THERAPY_SEL_DOCUMENTATION.md`
   - API docs: http://localhost:8014/docs

2. **Customize for Your Needs:**
   - Adjust age groups
   - Add custom activities
   - Modify therapy approaches

3. **Integrate with Existing Services:**
   - API Gateway routing
   - Authentication flow
   - Database migrations

4. **Enable AI/ML Features:**
   - Uncomment ML dependencies in `requirements.txt`
   - Download Whisper models
   - Configure GPU (optional)

---

## 💬 Support

- Documentation: `SPEECH_THERAPY_SEL_DOCUMENTATION.md`
- API Docs: `/docs` endpoint on each service
- Issues: Create GitHub issue
- Email: support@aivo.com

---

## 📝 Development Checklist

- [ ] Services running (8014, 8015)
- [ ] Databases created
- [ ] Redis connected
- [ ] Frontend accessible (5176)
- [ ] Microphone permission granted
- [ ] API endpoints responding
- [ ] WebSocket connections working
- [ ] Metrics collecting
- [ ] Health checks passing

---

**Happy Developing! 🎉**

For comprehensive documentation, see `SPEECH_THERAPY_SEL_DOCUMENTATION.md`
