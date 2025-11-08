# AIVO Agent Services - Quick Reference

## 🚀 Getting Started

### Training & Alignment Agent (LIVE) ✅

The **Training & Alignment Agent** is fully implemented and ready to use!

**Quick Start**:
```bash
# Start with Docker
docker-compose up -d postgres redis training-alignment

# Or run directly
cd services/training-alignment-svc
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8009
```

**Test It**:
```bash
# Health check
curl http://localhost:8009/health

# Validate model output
curl -X POST http://localhost:8009/v1/alignment/validate \
  -H "Content-Type: application/json" \
  -d '{
    "model_id": "test_model",
    "output": "This is educational content for 8-year-old students",
    "context": {"child_age": 8}
  }'

# API Documentation
open http://localhost:8009/docs
```

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `AGENT_IMPLEMENTATION_SUMMARY.md` | **START HERE** - Complete implementation summary |
| `COMPLETE_AGENT_CATALOG.md` | Full 15-agent architecture with implementation guides |
| `services/training-alignment-svc/README.md` | Training & Alignment Agent documentation |

## 🏗️ Architecture

### 15 Agent Services

**Core Learning** (7 agents):
- AIVO Brain (8001), Assessment (8002), Cloning (8003), Session (8004)
- Focus (8005), Homework (8006), IEP (8007)

**Platform Intelligence** (4 agents):
- District (8008), **Training & Alignment (8009)** ✅, Translator (8010), Monitor (8015)

**Business & Operations** (4 agents):
- Business (8011), Notification (8012), Analytics (8013), Safety (8014)

## 🎯 What's Implemented

### ✅ Training & Alignment Agent (Port 8009)
- Responsible AI governance (6 rules)
- Bias detection (4 categories: gender, racial, disability, socioeconomic)
- Model drift monitoring (automatic retraining triggers)
- Continuous training pipeline
- Compliance reporting

**Tech**: Python 3.11, FastAPI, scikit-learn, PostgreSQL, Redis

### ✅ Documentation
- Complete agent catalog with implementation guides
- Docker Compose configuration for all 15 agents
- TypeScript types for frontend integration
- Environment configuration
- Integration patterns

### ✅ Infrastructure
- PostgreSQL for data persistence
- Redis for caching and job queues
- Docker Compose orchestration
- Health checks and monitoring

## 📦 Next Agents to Implement

1. **Language Translator** (Port 8010) - 50+ languages, RTL support
2. **Business Model** (Port 8011) - Subscriptions, Stripe integration
3. **Notification** (Port 8012) - Email, SMS, push notifications
4. **Analytics** (Port 8013) - Platform insights and predictions

Each has a complete implementation guide in `COMPLETE_AGENT_CATALOG.md`.

## 🧪 Testing

```bash
# Training & Alignment Agent
cd services/training-alignment-svc
pytest tests/

# Check bias detection
curl -X POST http://localhost:8009/v1/bias/check \
  -H "Content-Type: application/json" \
  -d '{
    "model_id": "test",
    "output": "Boys are better at math than girls",
    "context": {}
  }'
```

## 🔧 Configuration

Key environment variables (see `.env.example`):
```bash
DATABASE_URL=postgresql://aivo:password@postgres:5432/aivo
REDIS_URL=redis://redis:6379/0
BIAS_THRESHOLD=0.10
DRIFT_THRESHOLD=0.15
```

## 📖 Learn More

- **Implementation Guide**: `AGENT_IMPLEMENTATION_SUMMARY.md`
- **Architecture Details**: `COMPLETE_AGENT_CATALOG.md`
- **API Docs**: http://localhost:8009/docs (when running)

## 🆘 Support

**Service Logs**:
```bash
docker-compose logs -f training-alignment
```

**Common Issues**:
- Ensure PostgreSQL and Redis are running
- Check `.env` file has correct values
- Verify port 8009 is not in use

---

**Status**: Training & Alignment Agent LIVE ✅  
**Last Updated**: November 8, 2025
