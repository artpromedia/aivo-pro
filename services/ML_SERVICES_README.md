# AIVO ML Services - Quick Start

## 🚀 You now have ACTUAL AI, not simulations!

---

## Services Overview

### AIVO Main Brain (Port 8001)
**What:** Foundation AI model for K-12 education  
**Location:** `services/aivo-brain-svc/`  
**Model:** Mistral-7B-Instruct (7B parameters)  
**Purpose:** Generate educational content, assess responses, provide tutoring

### Model Cloning (Port 8014)
**What:** Creates personalized AI for each student  
**Location:** `services/model-cloning-svc/`  
**Purpose:** Clone Main Brain → fine-tune → personalize → deploy

---

## Quick Start

### 1. Start Services (Docker Compose)

```bash
# With GPU (recommended):
docker-compose up aivo-brain model-cloning

# Without GPU (CPU fallback):
docker-compose up aivo-brain model-cloning
```

### 2. Test AIVO Brain

```bash
curl http://localhost:8001/health

curl -X POST http://localhost:8001/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain fractions to a 3rd grader",
    "context": {
      "student_id": "test",
      "grade": "3",
      "subject": "Math"
    }
  }'
```

### 3. Test Model Cloning

```bash
curl -X POST http://localhost:8014/v1/clone/start \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "student123",
    "student_profile": {
      "student_id": "student123",
      "name": "Alex",
      "grade": "5"
    },
    "baseline_data": {
      "assessment_id": "baseline_001",
      "responses": [],
      "overall_score": 75.0
    }
  }'
```

---

## Frontend Integration

```typescript
import { aiBrainService } from '@aivo/ui/services/AIBrainService';

// Generate AI response
const response = await aiBrainService.generateResponse({
  prompt: 'Explain photosynthesis',
  context: {
    student_id: user.id,
    grade: user.grade,
    subject: 'Science'
  }
});

// Start model cloning
const { clone_id } = await aiBrainService.startCloning({
  student_id: student.id,
  student_profile: {...},
  baseline_data: {...}
});
```

---

## Full Documentation

- **Complete Guide:** `../ML_INFRASTRUCTURE_GUIDE.md`
- **Implementation Summary:** `../ACTUAL_AI_IMPLEMENTATION.md`
- **Agent Status:** `../AGENT_IMPLEMENTATION_STATUS.md`

---

## Key Points

✅ **REAL AI** - 7 billion parameter transformer models  
✅ **REAL Cloning** - Actual LoRA fine-tuning per student  
✅ **GPU-Accelerated** - CUDA-enabled for fast inference  
✅ **Production-Ready** - K8s + AWS Terraform configs  
✅ **Not Simulations** - Everything uses actual ML models  

---

**The platform now has its AI brain!** 🧠
