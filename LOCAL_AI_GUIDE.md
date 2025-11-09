# 🧠 AIVO Local AI Testing Guide

This guide explains how to run the entire AIVO platform locally using Docker Hub
models, **without any API keys or cloud costs**.

## 🎯 What's Included

### Local AI Services
1. **Ollama** - Primary LLM service (port 11434)
   - Llama 3.2, Mistral, Gemma, CodeLlama, etc.
   - OpenAI-compatible API
   - GPU-accelerated inference

2. **Ollama Web UI** - Model management interface (port 3000)
   - Chat interface for testing
   - Model library browser
   - Performance monitoring

3. **LocalAI** - Alternative inference engine (port 8080)
   - OpenAI API compatibility
   - Multiple model format support
   - CPU and GPU modes

4. **vLLM** - High-performance server (port 8081)
   - Production-grade inference
   - Optimized for throughput
   - Advanced batching

## 🚀 Quick Start

### 1. Start All Services (Without GPU)

```powershell
# Copy local AI environment config
Copy-Item .env.local-ai .env

# Start services (CPU mode)
docker-compose up -d
```

### 2. Start With GPU Support

```powershell
# Ensure NVIDIA Container Toolkit is installed
docker-compose --profile gpu up -d
```

### 3. Pull and Setup Models

```powershell
# Run setup script (PowerShell)
.\scripts\setup-local-ai.ps1

# Or manually pull models
docker exec aivo-pro-ollama-1 ollama pull llama3.2:3b
docker exec aivo-pro-ollama-1 ollama pull nomic-embed-text
docker exec aivo-pro-ollama-1 ollama pull codellama:7b
```

### 4. Verify Setup

```powershell
# Check Ollama is working
curl http://localhost:11434/api/tags

# Test chat completion
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

## 📊 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Ollama API | http://localhost:11434 | Primary LLM inference |
| Ollama Web UI | http://localhost:3000 | Model management UI |
| LocalAI | http://localhost:8080 | Alternative inference |
| vLLM | http://localhost:8081 | Production-grade inference |
| MinIO Console | http://localhost:9001 | Model storage (minioadmin/minioadmin) |
| Web App | http://localhost:5173 | Marketing site |
| Parent Portal | http://localhost:5174 | Parent dashboard |
| Teacher Portal | http://localhost:5175 | Teacher dashboard |
| Learner App | http://localhost:5176 | Student interface |

## 🎓 Recommended Models

### For Development (Fast, Low Memory)
```bash
llama3.2:3b          # 2GB - Fast chat model
tinyllama:1b         # 600MB - Ultra-fast, basic tasks
qwen2.5:3b          # 2GB - Good multilingual
phi3:3b             # 2GB - Microsoft's efficient model
```

### For Production Testing (Better Quality)
```bash
llama3.2:7b          # 4GB - Balanced performance
mistral:7b           # 4GB - Great instruction following
gemma2:9b            # 5GB - Google's powerful model
qwen2.5:14b         # 8GB - Advanced reasoning
```

### Specialized Models
```bash
codellama:7b         # Code generation
llava:7b             # Vision + language
aya:8b               # 101 languages
nomic-embed-text     # Embeddings for RAG
```

## 🔧 Configuration

### Using Local Models in Your App

**Option 1: Environment Variables**
```bash
# .env
AI_PROVIDER=local
OLLAMA_BASE_URL=http://localhost:11434
LOCAL_CHAT_MODEL=llama3.2:3b
```

**Option 2: Mixed Local + Cloud**
```bash
# Use local for dev, cloud for production features
AI_PROVIDER=mixed
USE_LOCAL_MODELS=true
OPENAI_API_KEY=sk-... # Optional fallback
```

### Model Selection by Use Case

```typescript
// In your service configuration
const AI_CONFIG = {
  chat: 'ollama/llama3.2:3b',           // Student interactions
  reasoning: 'ollama/qwen2.5:14b',      // Complex problem solving
  code: 'ollama/codellama:7b',          // Code generation
  vision: 'ollama/llava:7b',            // Image analysis
  embeddings: 'ollama/nomic-embed-text', // RAG/search
  translation: 'ollama/aya:8b'          // Multi-language
};
```

## 🧪 Testing Scenarios

### 1. Test Student Chat Interaction
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Explain photosynthesis to a 10-year-old",
  "stream": false
}'
```

### 2. Test Code Generation
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "codellama:7b",
  "prompt": "Write a Python function to calculate fibonacci numbers",
  "stream": false
}'
```

### 3. Test Translation
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "aya:8b",
  "prompt": "Translate to Spanish: The student completed their homework",
  "stream": false
}'
```

### 4. Test Vision Understanding
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llava:7b",
  "prompt": "Describe this math diagram",
  "images": ["base64_encoded_image"]
}'
```

## 📈 Performance Optimization

### CPU Mode (No GPU)
```yaml
# docker-compose.override.yml
services:
  ollama:
    environment:
      - OLLAMA_NUM_PARALLEL=2
      - OLLAMA_MAX_LOADED_MODELS=1
```

### GPU Mode (NVIDIA)
```yaml
services:
  ollama:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

### Memory Optimization
```bash
# Use quantized models
docker exec aivo-pro-ollama-1 ollama pull llama3.2:3b-q4  # 4-bit quantized

# Limit concurrent models
OLLAMA_MAX_LOADED_MODELS=1
```

## 🔍 Monitoring & Debugging

### Check Model Performance
```bash
# View Ollama logs
docker logs -f aivo-pro-ollama-1

# Monitor resource usage
docker stats aivo-pro-ollama-1
```

### Test Model Locally
```bash
# Interactive chat
docker exec -it aivo-pro-ollama-1 ollama run llama3.2:3b

# Then type your questions
>>> Why is the sky blue?
>>> What is 2+2?
>>> /bye  # Exit
```

### Check Available Models
```bash
docker exec aivo-pro-ollama-1 ollama list
```

## 🚨 Troubleshooting

### Ollama Won't Start
```bash
# Check if port is in use
netstat -ano | findstr :11434

# Check Docker logs
docker logs aivo-pro-ollama-1
```

### Out of Memory
```bash
# Use smaller models
ollama pull tinyllama:1b
ollama pull phi3:3b

# Or increase Docker memory
# Docker Desktop > Settings > Resources > Memory
```

### Slow Inference
```bash
# Check if GPU is detected
docker exec aivo-pro-ollama-1 nvidia-smi

# Use CPU-optimized models
ollama pull llama3.2:3b-q4_K_M
```

### Models Not Pulling
```bash
# Check internet connection
curl https://ollama.ai

# Try manual download
docker exec -it aivo-pro-ollama-1 ollama pull llama3.2:3b --verbose
```

## 🎯 Development Workflow

### 1. Start Development Environment
```bash
# Start all services
docker-compose up -d

# Setup models (first time only)
.\scripts\setup-local-ai.ps1

# Start watching logs
docker-compose logs -f ollama aivo-brain model-cloning
```

### 2. Test AIVO Brain Integration
```bash
# Verify AIVO Brain is using Ollama
curl http://localhost:8001/health

# Test student model cloning
curl http://localhost:8014/clone -d '{
  "studentId": "test-student-001",
  "baseModel": "llama3.2:3b"
}'
```

### 3. Test Frontend Apps
```bash
# All apps should now work without API keys
# Open in browser:
- http://localhost:5176 (Learner App)
- http://localhost:5175 (Teacher Portal)
- http://localhost:5174 (Parent Portal)
```

## 💰 Cost Comparison

| Scenario | Cloud (GPT-4) | Local (Llama 3.2) |
|----------|--------------|-------------------|
| 1000 chat messages | $30 | $0 |
| 100 student models | $500/mo | $0 |
| Development testing | $100+/mo | $0 |
| **Total Monthly** | **$600+** | **$0** |

## 🎓 Best Practices

1. **Start Small**: Use `llama3.2:3b` for initial testing
2. **Monitor Memory**: Check `docker stats` regularly
3. **Cache Aggressively**: Enable Redis caching for repeated queries
4. **Use GPU**: 10-50x faster inference with GPU
5. **Quantize Models**: Use Q4 or Q5 quantization for memory savings
6. **Test Locally First**: Validate features before cloud deployment
7. **Mix Strategically**: Local for dev, cloud for production

## 🔄 Switching Between Local and Cloud

```bash
# Use local AI
cp .env.local-ai .env
docker-compose restart

# Use cloud AI
cp .env.cloud .env
docker-compose restart
```

## 📚 Additional Resources

- [Ollama Model Library](https://ollama.ai/library)
- [LocalAI Documentation](https://localai.io/docs/)
- [vLLM Documentation](https://docs.vllm.ai/)
- [Model Comparison Benchmarks](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)

## 🎉 Next Steps

1. ✅ Setup complete - all services running
2. 🧪 Test chat interactions in Ollama Web UI
3. 🔗 Integrate with AIVO apps
4. 📊 Monitor performance and tune
5. 🚀 Deploy to production when ready

---

**Need Help?** Check the main [README.md](../README.md) or open an issue!
