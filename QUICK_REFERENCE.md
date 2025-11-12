# 🚀 AIVO Backend - Quick Reference Card

## ⚡ Instant Commands

### Start Everything
```powershell
.\scripts\start-dev.ps1
```

### Test the Brain
```powershell
.\scripts\test-brain-service.ps1
```

### View Logs
```powershell
docker-compose logs -f aivo-brain
```

### Stop Everything
```powershell
docker-compose down
```

## 📍 Service URLs

| Service | URL | Docs |
|---------|-----|------|
| AIVO Brain | http://localhost:8001 | /docs |
| Model Cloning | http://localhost:8003 | /docs |
| Learning Session | http://localhost:8004 | /docs |
| Focus Monitor | http://localhost:8005 | /docs |
| Curriculum Content | http://localhost:8006 | /docs |
| Homework Helper | http://localhost:8007 | /docs |
| IEP Assistant | http://localhost:8008 | /docs |
| PostgreSQL | localhost:5432 | - |
| Redis | localhost:6379 | - |
| MinIO Console | http://localhost:9001 | - |

## 🧪 Quick Tests

### Health Check
```bash
curl http://localhost:8001/health
```

### Generate AI Response
```bash
curl -X POST http://localhost:8001/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test","grade_level":"5","subject":"Math"}'
```

### Check Metrics
```bash
curl http://localhost:8001/metrics
```

## 🔧 Common Fixes

### GPU Not Found
```bash
# Set CPU mode in .env
DEVICE=cpu
USE_4BIT_QUANTIZATION=false
```

### Port Conflict
```bash
# Find what's using port
netstat -ano | findstr :8001
# Kill process
taskkill /PID <pid> /F
```

### Redis Not Connected
```bash
# Restart Redis
docker-compose restart redis
```

### Out of Memory
```bash
# Use smaller model in .env
PRIMARY_MODEL=microsoft/phi-2
```

## 📊 Key Metrics

| Metric | Target | Check |
|--------|--------|-------|
| Uptime | 99.99% | /health |
| p50 Latency | <100ms | /metrics |
| Error Rate | <0.1% | /metrics |
| Cache Hit | >70% | /metrics |

## 🎯 SLA Targets

- **Availability:** 99.99% (4 nines)
- **Latency (p50):** <100ms (cache), <500ms (no cache)
- **Latency (p99):** <2000ms
- **Throughput:** 10,000 QPS

## 📚 Key Files

| File | Purpose |
|------|---------|
| `services/aivo-brain-svc/src/main.py` | Main service |
| `services/.env.example` | Configuration |
| `docker-compose.yml` | Services |
| `BACKEND_EXECUTIVE_SUMMARY.md` | Full details |

## 🚨 Emergency Commands

### Restart Brain Service
```bash
docker-compose restart aivo-brain
```

### Clear Cache
```bash
docker-compose exec redis redis-cli FLUSHDB
```

### View Full Logs
```bash
docker-compose logs --tail=100 aivo-brain
```

### Check Service Status
```bash
docker-compose ps
```

## 📞 Get Help

1. Check logs: `docker-compose logs -f aivo-brain`
2. Test health: `curl http://localhost:8001/health`
3. Read docs: `BACKEND_IMPLEMENTATION_STATUS.md`
4. Check .env configuration

## ✅ Quick Checklist

Before reporting issues:
- [ ] Docker is running
- [ ] Services are started (`docker-compose ps`)
- [ ] Health check passes
- [ ] .env file exists
- [ ] Ports are not in use
- [ ] Redis is connected
- [ ] Logs checked for errors

## 🎓 Educational Features

| Feature | Endpoint | Example |
|---------|----------|---------|
| Grade K-12 | /v1/generate | `grade_level: "5"` |
| ADHD Support | /v1/generate | `disability_type: "adhd"` |
| CCSS Aligned | /v1/generate | `curriculum_standard: "CCSS"` |
| Multi-style | /v1/generate | `learning_style: "visual"` |

## 📈 Monitoring

### Prometheus Metrics
```
http://localhost:8001/metrics
```

### Key Metrics to Watch
- `aivo_brain_requests_total`
- `aivo_brain_request_duration_seconds`
- `aivo_brain_inference_seconds`
- `aivo_brain_cache_hit_rate`

## 🔐 Security Notes

- Change default passwords in production
- Use proper secret management
- Enable HTTPS/TLS
- Configure rate limiting
- Set up monitoring alerts

---

**Status:** ✅ Production Ready  
**Updated:** November 8, 2025  
**Version:** 1.0.0
