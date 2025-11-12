# Speech Therapy & SEL Services

## 🎯 Overview

Two comprehensive therapeutic services for the AIVO Learning Platform:

- **Speech Therapy Service** - AI-powered speech and language therapy
- **SEL Service** - Social-Emotional Learning based on CASEL & RULER frameworks

## 🚀 Quick Start

```bash
# Start services
docker-compose up -d speech-therapy-svc sel-agent-svc

# Verify
curl http://localhost:8014/health  # Speech Therapy
curl http://localhost:8015/health  # SEL

# View API docs
open http://localhost:8014/docs
open http://localhost:8015/docs
```

## 📚 Documentation

- **[Complete Documentation](./SPEECH_THERAPY_SEL_DOCUMENTATION.md)** - Full technical details
- **[Quick Start Guide](./SPEECH_THERAPY_SEL_QUICKSTART.md)** - Get up and running
- **[Executive Summary](./SPEECH_THERAPY_SEL_SUMMARY.md)** - High-level overview

## 🎯 Key Features

### Speech Therapy (Port 8014)
- Articulation assessment & therapy
- Fluency analysis (stuttering detection)
- Voice quality evaluation
- Age-appropriate games (K-12)
- Parent involvement system
- Evidence-based approaches

### SEL (Port 8015)
- CASEL's 5 core competencies
- RULER framework (Yale)
- Daily emotional check-ins
- Mindfulness & meditation
- Resilience building
- Coping strategies

## 📦 What's Included

```
services/
├── speech-therapy-svc/          # Port 8014
│   ├── src/main.py             # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
│
└── sel-agent-svc/               # Port 8015
    ├── src/main.py             # FastAPI app
    ├── Dockerfile
    └── requirements.txt

apps/
└── learner-app/src/components/
    ├── SpeechTherapy/          # Speech therapy UI
    └── SEL/                    # SEL UI
```

## 🔗 API Endpoints

### Speech Therapy
```
POST /v1/speech/assessment   - Conduct assessment
POST /v1/speech/activity     - Get daily activity
WS   /v1/speech/live-therapy - Real-time session
```

### SEL
```
POST /v1/sel/program         - Create SEL program
POST /v1/sel/check-in        - Emotional check-in
POST /v1/sel/activity        - Get daily activity
POST /v1/sel/mindfulness     - Guide mindfulness
```

## 🎨 Age-Appropriate Design

| Age Group | Style | Sessions | Examples |
|-----------|-------|----------|----------|
| K-2 (5-7) | Cartoon, bright | 5-10 min | Sound Safari, Bunny Breathing |
| 3-5 (8-10) | Adventure | 10-15 min | Space Mission, 4-7-8 Breathing |
| 6-8 (11-13) | Gaming | 15-20 min | Word Detective, Thought Clouds |
| 9-12 (14-18) | Modern | 20-30 min | Presentation Pro, RAIN |

## 📊 Monitoring

Prometheus metrics available at:
- http://localhost:8014/metrics
- http://localhost:8015/metrics

## 🔐 Security

- HTTPS/WSS for audio transmission
- JWT authentication ready
- HIPAA, FERPA, COPPA compliant
- PII anonymization

## 📖 Evidence-Based

**Speech Therapy:**
- Stanford Children's Hospital protocols
- ASHA guidelines
- Google Project Euphonia research

**SEL:**
- CASEL Framework
- RULER Approach (Yale)
- Mindfulness research

## 🤝 Contributing

See individual service README files for development setup.

## 📄 License

Proprietary - AIVO Learning Platform

---

**Version:** 1.0.0  
**Status:** Production Ready ✅
