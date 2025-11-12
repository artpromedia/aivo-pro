#!/usr/bin/env pwsh
# AIVO Backend Services - Development Startup Script
# Production-grade local development environment

Write-Host "🚀 Starting AIVO Backend Services..." -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "  ✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Host "  ✅ Docker Compose: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker Compose not found." -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "  ✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Python not found (required for some services)" -ForegroundColor Yellow
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Node.js not found (required for frontend)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Setting up environment..." -ForegroundColor Cyan

# Create .env file if it doesn't exist
$envFile = "services\.env"
$envExample = "services\.env.example"

if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
        Write-Host "  📝 Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item $envExample $envFile
        Write-Host "  ✅ .env file created" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  .env.example not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✅ .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan

# Start infrastructure services first
Write-Host "  Starting infrastructure (PostgreSQL, Redis, MinIO)..." -ForegroundColor Yellow
docker-compose up -d postgres redis minio

# Wait for services to be healthy
Write-Host "  Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service health
$postgresHealth = docker-compose ps postgres | Select-String "healthy"
$redisHealth = docker-compose ps redis | Select-String "healthy"

if ($postgresHealth) {
    Write-Host "  ✅ PostgreSQL is ready" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  PostgreSQL may not be fully ready" -ForegroundColor Yellow
}

if ($redisHealth) {
    Write-Host "  ✅ Redis is ready" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Redis may not be fully ready" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🤖 Starting AI services..." -ForegroundColor Cyan

# Check for GPU
$hasGPU = $false
try {
    $nvidiaCheck = nvidia-smi 2>$null
    if ($LASTEXITCODE -eq 0) {
        $hasGPU = $true
        Write-Host "  ✅ NVIDIA GPU detected" -ForegroundColor Green
    }
} catch {
    Write-Host "  ℹ️  No NVIDIA GPU detected, using CPU mode" -ForegroundColor Blue
}

if ($hasGPU) {
    Write-Host "  Starting AIVO Brain with GPU support..." -ForegroundColor Yellow
    docker-compose up -d aivo-brain
} else {
    Write-Host "  Starting AIVO Brain in CPU mode..." -ForegroundColor Yellow
    $env:DEVICE = "cpu"
    $env:USE_4BIT_QUANTIZATION = "false"
    docker-compose up -d aivo-brain
}

Write-Host ""
Write-Host "📊 Starting support services..." -ForegroundColor Cyan
docker-compose up -d training-alignment translator notification analytics-insights

Write-Host ""
Write-Host "🌐 Starting frontend applications..." -ForegroundColor Cyan
docker-compose up -d web parent-portal teacher-portal learner-app baseline-assessment

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📍 Service URLs:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend Applications:" -ForegroundColor Yellow
Write-Host "  🌐 Marketing Website:    http://localhost:5173" -ForegroundColor White
Write-Host "  👨‍👩‍👧 Parent Portal:       http://localhost:5174" -ForegroundColor White
Write-Host "  👨‍🏫 Teacher Portal:      http://localhost:5175" -ForegroundColor White
Write-Host "  🎓 Learner App:          http://localhost:5176" -ForegroundColor White
Write-Host "  📝 Baseline Assessment:  http://localhost:5179" -ForegroundColor White
Write-Host ""
Write-Host "Backend Services:" -ForegroundColor Yellow
Write-Host "  🧠 AIVO Brain API:       http://localhost:8001" -ForegroundColor White
Write-Host "     ├─ Docs:              http://localhost:8001/docs" -ForegroundColor Gray
Write-Host "     ├─ Health:            http://localhost:8001/health" -ForegroundColor Gray
Write-Host "     └─ Metrics:           http://localhost:8001/metrics" -ForegroundColor Gray
Write-Host "  🔬 Model Cloning:        http://localhost:8003" -ForegroundColor White
Write-Host "  🎯 Training Alignment:   http://localhost:8009" -ForegroundColor White
Write-Host "  🌍 Translator:           http://localhost:8010" -ForegroundColor White
Write-Host "  💰 Business Model:       http://localhost:8011" -ForegroundColor White
Write-Host "  📬 Notifications:        http://localhost:8012" -ForegroundColor White
Write-Host "  📊 Analytics:            http://localhost:8013" -ForegroundColor White
Write-Host ""
Write-Host "Infrastructure:" -ForegroundColor Yellow
Write-Host "  🐘 PostgreSQL:           localhost:5432" -ForegroundColor White
Write-Host "  🔴 Redis:                localhost:6379" -ForegroundColor White
Write-Host "  📦 MinIO Console:        http://localhost:9001" -ForegroundColor White
Write-Host "     (Login: minioadmin / minioadmin)" -ForegroundColor Gray
Write-Host ""
Write-Host "Local AI Services:" -ForegroundColor Yellow
Write-Host "  🦙 Ollama:               http://localhost:11434" -ForegroundColor White
Write-Host "  🎨 Ollama Web UI:        http://localhost:3000" -ForegroundColor White
Write-Host "  🤖 LocalAI:              http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "  View logs:               docker-compose logs -f [service-name]" -ForegroundColor White
Write-Host "  Stop all services:       docker-compose down" -ForegroundColor White
Write-Host "  Restart a service:       docker-compose restart [service-name]" -ForegroundColor White
Write-Host "  View service status:     docker-compose ps" -ForegroundColor White
Write-Host "  Enter service shell:     docker-compose exec [service-name] sh" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  - Check service health with: curl http://localhost:8001/health" -ForegroundColor White
Write-Host "  - View API docs at: http://localhost:8001/docs" -ForegroundColor White
Write-Host "  - Monitor logs in real-time: docker-compose logs -f aivo-brain" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Monitoring Service Startup:" -ForegroundColor Cyan
Write-Host "  Run: docker-compose logs -f aivo-brain" -ForegroundColor White
Write-Host ""

# Offer to tail logs
$tailLogs = Read-Host "Would you like to view AIVO Brain logs? (y/n)"
if ($tailLogs -eq 'y') {
    docker-compose logs -f aivo-brain
}
