# Stop Safety & Analytics Services

Write-Host "🛑 Stopping Safety & Analytics Services..." -ForegroundColor Yellow
Write-Host ""

# Stop Safety & Moderation Service
Write-Host "Stopping Safety & Moderation Service..." -ForegroundColor Cyan
Set-Location services\safety-moderation-svc
docker-compose down
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Safety & Moderation Service stopped" -ForegroundColor Green
}
Set-Location ..\..

Write-Host ""

# Stop District Analytics Service
Write-Host "Stopping District Analytics Service..." -ForegroundColor Cyan
Set-Location services\district-analytics-svc
docker-compose down
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ District Analytics Service stopped" -ForegroundColor Green
}
Set-Location ..\..

Write-Host ""
Write-Host "✅ All services stopped" -ForegroundColor Green
