# Agent Communication Matrix - Implementation Status

## ❌ CRITICAL: Inter-Agent Communication NOT IMPLEMENTED

The agent communication matrix described in your architecture diagram has **NOT been implemented**. Currently, all agent services are **isolated microservices** without inter-service communication.

---

## Current State (Isolated Services)

### ✅ Implemented Agents (Standalone)
1. **Training & Alignment Agent** (Port 8009) - FastAPI service ✅
2. **Language Translator Agent** (Port 8010) - FastAPI service ✅
3. **Business Model Agent** (Port 8011) - FastAPI service ✅
4. **Notification Agent** (Port 8012) - FastAPI service ✅
5. **Analytics & Insights Agent** (Port 8013) - FastAPI service ✅

### ❌ Missing Communication Infrastructure
- ❌ No API Gateway (Kong, NGINX, AWS API Gateway)
- ❌ No service discovery (Consul, etcd, Kubernetes DNS)
- ❌ No inter-service HTTP client wrappers
- ❌ No service mesh (Istio, Linkerd)
- ❌ No message queue for async communication (RabbitMQ, Kafka)
- ❌ No circuit breakers or retry logic
- ❌ No load balancing between services

---

## Required Implementation: Communication Matrix

Based on your diagram, here's what needs to be implemented:

### 1. API Gateway → All Services
**Priority: CRITICAL**
```
API Gateway (Port 80/443)
├── Route /training/* → training-alignment-svc:8009
├── Route /translate/* → translator-svc:8010
├── Route /business/* → business-model-svc:8011
├── Route /notify/* → notification-svc:8012
└── Route /analytics/* → analytics-insights-svc:8013
```

### 2. AIVO Brain (Central Orchestrator)
**Status: NOT IMPLEMENTED**

The "AIVO Brain" needs to be created as a central orchestration service that:
- Receives requests from API Gateway
- Routes to appropriate agents
- Aggregates responses
- Manages multi-agent workflows

**Suggested Implementation**:
```python
# services/aivo-brain-svc/src/main.py
from fastapi import FastAPI
import httpx

class AIVOBrain:
    def __init__(self):
        self.training_url = "http://training-alignment:8009"
        self.translator_url = "http://translator:8010"
        self.business_url = "http://business-model:8011"
        self.notification_url = "http://notification:8012"
        self.analytics_url = "http://analytics-insights:8013"
    
    async def process_learning_session(self, session_data):
        # Orchestrate multiple agents
        # 1. Translate content
        # 2. Check for bias
        # 3. Track analytics
        # 4. Send notifications
        pass
```

### 3. Frontend Apps → AIVO Brain Communication
**Status: PARTIAL** (Frontend exists, but no Brain orchestrator)

```
Baseline Assessment (5179) ──┐
Model Cloning (5177)     ────┤
Learning Session (5176)  ────┼──→ AIVO Brain → Training & Alignment
Focus Monitor (?)        ────┤       ↓
Homework Helper (?)      ────┘    Translator
                                     ↓
                                  Analytics
```

### 4. Agent-to-Agent Communication Needed

#### A. Training & Alignment → Analytics
```python
# In training-alignment-svc/src/main.py
async def report_bias_detected(self, metrics):
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://analytics-insights:8013/v1/events/bias-detected",
            json=metrics
        )
```

#### B. Business Model → Notification
```python
# In business-model-svc/src/subscriptions.py
async def send_payment_notification(self, subscription):
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://notification:8012/v1/email/send",
            json={
                "to": subscription.customer_email,
                "template_id": "payment_success",
                "template_data": {...}
            }
        )
```

#### C. Learning Session → Analytics
```python
# Frontend needs to call through Brain
async def track_learning_event(session_id, event_data):
    await httpx.post(
        "http://aivo-brain:8000/v1/learning/track",
        json={"session_id": session_id, "event": event_data}
    )
```

#### D. IEP Assistant → Notification
```python
# IEP service needs to notify on updates
async def notify_iep_update(student_id):
    await httpx.post(
        "http://notification:8012/v1/notify/multi-channel",
        json={
            "user_id": student_id,
            "channels": ["email", "push"],
            "template_id": "iep_update",
            "template_data": {...}
        }
    )
```

---

## Implementation Plan

### Phase 1: Service Discovery (Week 1)
**Add to docker-compose.yml**:
```yaml
services:
  # Service discovery
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
    command: agent -dev -ui
  
  # Or use Docker DNS (simpler)
  # Services can communicate via service names
  training-alignment:
    networks:
      - aivo-network
  
  translator:
    networks:
      - aivo-network
```

**Update each service to register**:
```python
# Add to each service's config.py
SERVICE_REGISTRY = {
    "training-alignment": "http://training-alignment:8009",
    "translator": "http://translator:8010",
    "business-model": "http://business-model:8011",
    "notification": "http://notification:8012",
    "analytics-insights": "http://analytics-insights:8013",
}
```

### Phase 2: HTTP Client Wrapper (Week 1-2)
Create shared HTTP client for inter-service communication:

```python
# packages/service-client/src/client.py
import httpx
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class ServiceClient:
    """HTTP client for inter-service communication"""
    
    def __init__(self, service_registry: Dict[str, str]):
        self.registry = service_registry
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def call_service(
        self,
        service: str,
        path: str,
        method: str = "GET",
        data: Any = None
    ):
        """Call another service with retry logic"""
        url = f"{self.registry[service]}{path}"
        
        try:
            if method == "GET":
                response = await self.client.get(url)
            elif method == "POST":
                response = await self.client.post(url, json=data)
            elif method == "PUT":
                response = await self.client.put(url, json=data)
            
            response.raise_for_status()
            return response.json()
        
        except httpx.HTTPError as e:
            logger.error(f"Service call failed: {service} {path} - {e}")
            raise
    
    async def translate_content(self, text: str, target_lang: str):
        """Helper: Call translator service"""
        return await self.call_service(
            "translator",
            "/v1/translate/content",
            "POST",
            {"text": text, "source_lang": "en", "target_lang": target_lang}
        )
    
    async def send_notification(self, notification_data: Dict):
        """Helper: Call notification service"""
        return await self.call_service(
            "notification",
            "/v1/notify/multi-channel",
            "POST",
            notification_data
        )
    
    async def track_analytics(self, event_data: Dict):
        """Helper: Call analytics service"""
        return await self.call_service(
            "analytics-insights",
            "/v1/events/track",
            "POST",
            event_data
        )
```

### Phase 3: Create AIVO Brain Orchestrator (Week 2)
```python
# services/aivo-brain-svc/src/main.py
from fastapi import FastAPI, HTTPException
from .service_client import ServiceClient
from .workflows import LearningSessionWorkflow, IEPUpdateWorkflow

app = FastAPI(title="AIVO Brain - Central Orchestrator")

# Initialize service client
service_client = ServiceClient(SERVICE_REGISTRY)

@app.post("/v1/learning/session/start")
async def start_learning_session(session_data: dict):
    """
    Orchestrate learning session across multiple agents:
    1. Translate content if needed
    2. Check for bias
    3. Track analytics
    """
    workflow = LearningSessionWorkflow(service_client)
    result = await workflow.execute(session_data)
    return result

@app.post("/v1/iep/update")
async def update_iep(iep_data: dict):
    """
    Orchestrate IEP update:
    1. Validate IEP document
    2. Translate for multilingual families
    3. Send notifications
    4. Track in analytics
    """
    workflow = IEPUpdateWorkflow(service_client)
    result = await workflow.execute(iep_data)
    return result

@app.post("/v1/subscription/created")
async def handle_subscription_created(subscription: dict):
    """
    Handle new subscription:
    1. Send welcome notification
    2. Track revenue analytics
    """
    # Send notification
    await service_client.send_notification({
        "user_id": subscription["customer_id"],
        "channels": ["email"],
        "template_id": "welcome_email",
        "template_data": subscription
    })
    
    # Track analytics
    await service_client.track_analytics({
        "event": "subscription_created",
        "data": subscription
    })
    
    return {"status": "success"}
```

### Phase 4: Add API Gateway (Week 3)
**Option A: NGINX (Recommended for simplicity)**
```nginx
# docker/nginx.conf
upstream aivo-brain {
    server aivo-brain:8000;
}

upstream translator {
    server translator:8010;
}

server {
    listen 80;
    
    location /api/v1/brain/ {
        proxy_pass http://aivo-brain/;
    }
    
    location /api/v1/translate/ {
        proxy_pass http://translator/v1/;
    }
    
    # Add other routes...
}
```

**Option B: Kong API Gateway**
```yaml
# docker-compose.yml
services:
  kong-database:
    image: postgres:15
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: kong
  
  kong:
    image: kong:latest
    ports:
      - "8000:8000"  # Proxy
      - "8001:8001"  # Admin API
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: kong-database
```

### Phase 5: Add Message Queue for Async Communication (Week 4)
```yaml
# docker-compose.yml
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"   # AMQP
      - "15672:15672" # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: aivo
      RABBITMQ_DEFAULT_PASS: password
```

**Example: Async notification**:
```python
# In business-model-svc when subscription created
await message_queue.publish(
    "notifications.email",
    {
        "template": "welcome_email",
        "to": customer_email,
        "data": subscription_data
    }
)

# Notification service consumes from queue
@app.on_event("startup")
async def start_queue_consumer():
    await queue.consume("notifications.email", handle_email_notification)
```

---

## Immediate Next Steps

### 1. **TODAY: Add Service Discovery**
Update `docker-compose.yml` to use proper networking:

```yaml
networks:
  aivo-network:
    driver: bridge

services:
  training-alignment:
    networks:
      - aivo-network
  
  translator:
    networks:
      - aivo-network
  
  # ... all other services
```

### 2. **Week 1: Create Service Client Package**
```bash
mkdir -p packages/service-client/src
```

Create the shared HTTP client that all services can use.

### 3. **Week 1-2: Implement AIVO Brain**
```bash
mkdir -p services/aivo-brain-svc/src
```

Central orchestrator that coordinates all agents.

### 4. **Week 2: Add Communication Patterns**
Update each service to call others when needed:
- Training & Alignment → Analytics (report bias)
- Business Model → Notification (payment events)
- IEP Assistant → Notification (document updates)
- Learning Session → Analytics (track progress)

### 5. **Week 3: Add API Gateway**
Choose NGINX or Kong and set up routing.

---

## Testing Inter-Service Communication

Once implemented, test with:

```python
# Test workflow: Create subscription → Send notification → Track analytics
import httpx

async def test_subscription_workflow():
    # 1. Create subscription
    subscription = await httpx.post(
        "http://localhost:8011/v1/subscriptions/create",
        json={...}
    )
    
    # 2. Verify notification sent
    # (Check notification service logs)
    
    # 3. Verify analytics tracked
    analytics = await httpx.get(
        "http://localhost:8013/v1/revenue/metrics"
    )
    
    assert analytics["new_subscriptions"] > 0
```

---

## Summary

**Current State**: ❌ NO agent communication  
**Required State**: ✅ Full service mesh with orchestration  
**Estimated Implementation**: 3-4 weeks  
**Priority**: **HIGH** - Without this, agents cannot work together

The agents are **built and ready**, but they're **isolated**. They need the communication infrastructure to become a cohesive platform.
