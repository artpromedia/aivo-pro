# 🚀 Quick Start Guide - API Gateway & Baseline Assessment

## ⚡ Start Services (5 minutes)

### 1. Start Infrastructure
```powershell
# Start PostgreSQL and Redis
docker compose up -d postgres redis

# Wait for health checks
Start-Sleep -Seconds 10
```

### 2. Start API Gateway
```powershell
# Start API Gateway
docker compose up -d api-gateway

# View logs
docker compose logs -f api-gateway
```

### 3. Start Baseline Assessment
```powershell
# Start Baseline Assessment
docker compose up -d baseline-assessment

# View logs
docker compose logs -f baseline-assessment
```

### 4. Verify Services
```powershell
# Check health
curl http://localhost:8001/health  # API Gateway
curl http://localhost:8003/health  # Baseline Assessment
```

---

## 🧪 Test API Gateway

### Create Account
```powershell
$signup = @{
    email = "parent@example.com"
    password = "SecureP@ssw0rd123!"
    first_name = "John"
    last_name = "Doe"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8001/v1/auth/signup" `
    -ContentType "application/json" `
    -Body $signup

$response
```

### Login
```powershell
$login = @{
    email = "parent@example.com"
    password = "SecureP@ssw0rd123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8001/v1/auth/login" `
    -ContentType "application/json" `
    -Body $login

$accessToken = $response.access_token
$refreshToken = $response.refresh_token

Write-Host "Access Token: $accessToken"
```

### Refresh Token
```powershell
$refresh = @{
    refresh_token = $refreshToken
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8001/v1/auth/refresh" `
    -ContentType "application/json" `
    -Body $refresh

$response
```

---

## 📝 Test Baseline Assessment

### Start Assessment
```powershell
$start = @{
    child_id = "550e8400-e29b-41d4-a716-446655440000"
    subject = "math"
    grade = "5"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8003/v1/assessment/start" `
    -ContentType "application/json" `
    -Body $start

$sessionId = $response.session_id
$firstItem = $response.first_item

Write-Host "Session ID: $sessionId"
Write-Host "First Question: $($firstItem.question)"
Write-Host "Options: $($firstItem.options)"
```

### Submit Answer
```powershell
$answer = @{
    session_id = $sessionId
    item_id = $firstItem.item_id
    answer = 2  # Index of correct answer
    response_time_ms = 5000
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8003/v1/assessment/submit" `
    -ContentType "application/json" `
    -Body $answer

Write-Host "Correct: $($response.correct)"
Write-Host "Should Continue: $($response.should_continue)"
Write-Host "Current Theta: $($response.stats.theta)"
Write-Host "Standard Error: $($response.stats.standard_error)"

if ($response.next_item) {
    Write-Host "`nNext Question: $($response.next_item.question)"
}
```

### Complete Assessment
```powershell
$response = Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8003/v1/assessment/complete?session_id=$sessionId"

Write-Host "`n=== Assessment Complete ==="
Write-Host "Final Theta: $($response.final_theta)"
Write-Host "Standard Error: $($response.standard_error)"
Write-Host "Items Answered: $($response.num_items)"
Write-Host "Percent Correct: $($response.percent_correct)%"
Write-Host "`nSkill Vector:"
$response.skill_vector | ConvertTo-Json
Write-Host "`nStrengths: $($response.strengths_weaknesses.strengths)"
Write-Host "Weaknesses: $($response.strengths_weaknesses.weaknesses)"
Write-Host "`nRecommendations:"
$response.recommendations | ForEach-Object { Write-Host "  - $_" }
```

---

## 🐛 Troubleshooting

### Check Service Logs
```powershell
# API Gateway
docker compose logs api-gateway --tail=50

# Baseline Assessment
docker compose logs baseline-assessment --tail=50

# PostgreSQL
docker compose logs postgres --tail=50

# Redis
docker compose logs redis --tail=50
```

### Restart Services
```powershell
# Restart individual service
docker compose restart api-gateway
docker compose restart baseline-assessment

# Restart all services
docker compose restart
```

### Check Container Status
```powershell
docker compose ps
```

### Access Container Shell
```powershell
# API Gateway
docker compose exec api-gateway sh

# Baseline Assessment
docker compose exec baseline-assessment sh

# PostgreSQL
docker compose exec postgres psql -U aivo -d aivo_auth
```

---

## 📊 View Metrics

### Prometheus Metrics
```powershell
# API Gateway metrics
curl http://localhost:8001/metrics

# Baseline Assessment metrics (if enabled)
curl http://localhost:8003/metrics
```

---

## 🔧 Configuration

### Environment Variables
```powershell
# Copy example config
Copy-Item services\api-gateway\.env.example services\api-gateway\.env

# Edit configuration
code services\api-gateway\.env
```

### Key Settings:
```env
# Email (optional for testing)
SENDGRID_API_KEY=your-key

# SMS (optional for testing)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token

# Password checking
HIBP_API_KEY=your-key

# JWT Security
JWT_SECRET_KEY=change-this-to-secure-random-string-min-32-chars
```

---

## ✅ Success Criteria

### API Gateway Working:
- ✅ `/health` returns 200
- ✅ Signup creates user
- ✅ Email verification token generated
- ✅ Login returns JWT tokens
- ✅ Refresh token works
- ✅ Audit logs created

### Baseline Assessment Working:
- ✅ `/health` returns 200
- ✅ Start assessment creates session
- ✅ First item returned
- ✅ Submit answer updates theta
- ✅ Next item selected
- ✅ Stopping criteria evaluated
- ✅ Complete returns skill vector

---

## 📚 API Documentation

### Interactive Docs (Development Only):
- API Gateway: http://localhost:8001/docs
- Baseline Assessment: http://localhost:8003/docs

---

## 🎯 Next Steps

1. **Test Full Flow:** Complete end-to-end assessment
2. **Configure Email:** Set up SendGrid for verification emails
3. **Add Items:** Expand item bank beyond 5 demo items
4. **Database:** Set up production PostgreSQL
5. **Monitoring:** Configure Sentry and Prometheus
6. **Security:** Generate RSA keys for JWT signing

---

**Need Help?** Check `IMPLEMENTATION_STATUS_NOV8.md` for full details!
