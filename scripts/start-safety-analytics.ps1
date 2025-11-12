# Quick Start Script for Safety & Analytics Services
# Run this script to start both services locally

Write-Host "🚀 Starting Safety & Analytics Services..." -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Cyan
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Create network if it doesn't exist
Write-Host "Creating Docker network..." -ForegroundColor Cyan
docker network create aivo-network 2>$null
Write-Host "✅ Network ready" -ForegroundColor Green
Write-Host ""

# Start Safety & Moderation Service
Write-Host "Starting Safety & Moderation Service..." -ForegroundColor Cyan
Set-Location services\safety-moderation-svc

# Copy env file if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "📝 Created .env file from .env.example" -ForegroundColor Yellow
    Write-Host "Please edit .env with your API keys if needed" -ForegroundColor Yellow
}

docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Safety & Moderation Service started on port 8016" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start Safety & Moderation Service" -ForegroundColor Red
}

Set-Location ..\..
Write-Host ""

# Start District Analytics Service
Write-Host "Starting District Analytics Service..." -ForegroundColor Cyan
Set-Location services\district-analytics-svc

# Copy env file if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "📝 Created .env file from .env.example" -ForegroundColor Yellow
    Write-Host "Please edit .env with your API keys if needed" -ForegroundColor Yellow
}

docker-compose up -d
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ District Analytics Service started on port 8017" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start District Analytics Service" -ForegroundColor Red
}

Set-Location ..\..
Write-Host ""

# Wait for services to be healthy
Write-Host "Waiting for services to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Check health endpoints
Write-Host "Checking service health..." -ForegroundColor Cyan

try {
    $safetyHealth = Invoke-RestMethod -Uri "http://localhost:8016/health" -TimeoutSec 5
    Write-Host "✅ Safety Service: $($safetyHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Safety Service: Not ready yet (may need more time)" -ForegroundColor Yellow
}

try {
    $analyticsHealth = Invoke-RestMethod -Uri "http://localhost:8017/health" -TimeoutSec 5
    Write-Host "✅ Analytics Service: $($analyticsHealth.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Analytics Service: Not ready yet (may need more time)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Services Started!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Safety & Moderation Service:" -ForegroundColor White
Write-Host "  • Health:  http://localhost:8016/health" -ForegroundColor Gray
Write-Host "  • API:     http://localhost:8016/docs" -ForegroundColor Gray
Write-Host "  • Metrics: http://localhost:8016/metrics" -ForegroundColor Gray
Write-Host ""
Write-Host "District Analytics Service:" -ForegroundColor White
Write-Host "  • Health:  http://localhost:8017/health" -ForegroundColor Gray
Write-Host "  • API:     http://localhost:8017/docs" -ForegroundColor Gray
Write-Host "  • Metrics: http://localhost:8017/metrics" -ForegroundColor Gray
Write-Host ""
Write-Host "To view logs:" -ForegroundColor White
Write-Host "  cd services/safety-moderation-svc && docker-compose logs -f" -ForegroundColor Gray
Write-Host "  cd services/district-analytics-svc && docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop services:" -ForegroundColor White
Write-Host "  .\scripts\stop-services.ps1" -ForegroundColor Gray
Write-Host ""
