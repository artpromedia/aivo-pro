# AIVO Local AI Test Script
# Tests all local AI services to ensure they're working correctly

Write-Host "🧪 AIVO Local AI Service Tests" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Testing $Name..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host " ✓ PASSED" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
    return $false
}

function Test-OllamaModel {
    param([string]$Model)
    
    Write-Host "Testing model $Model..." -NoNewline
    try {
        $body = @{
            model = $Model
            prompt = "Say 'Hello, AIVO!' and nothing else."
            stream = $false
        } | ConvertTo-Json

        $response = Invoke-WebRequest `
            -Uri "http://localhost:11434/api/generate" `
            -Method Post `
            -Body $body `
            -ContentType "application/json" `
            -TimeoutSec 30 `
            -ErrorAction Stop

        if ($response.StatusCode -eq 200) {
            Write-Host " ✓ PASSED" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host " ✗ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
    return $false
}

# Test Infrastructure Services
Write-Host "`n📦 Infrastructure Services" -ForegroundColor Blue
Write-Host "-------------------------" -ForegroundColor Blue
$allPassed = $allPassed -and (Test-Service "PostgreSQL" "http://localhost:5432" "Database")
$allPassed = $allPassed -and (Test-Service "Redis" "http://localhost:6379" "Cache")

# Test Local AI Services
Write-Host "`n🤖 Local AI Services" -ForegroundColor Blue
Write-Host "--------------------" -ForegroundColor Blue
$allPassed = $allPassed -and (Test-Service "Ollama API" "http://localhost:11434/api/tags" "LLM Service")
$allPassed = $allPassed -and (Test-Service "Ollama Web UI" "http://localhost:3000" "Model Manager")
$allPassed = $allPassed -and (Test-Service "LocalAI" "http://localhost:8080/readyz" "Alternative LLM")

# Test AIVO Services
Write-Host "`n🧠 AIVO AI Services" -ForegroundColor Blue
Write-Host "-------------------" -ForegroundColor Blue
$allPassed = $allPassed -and (Test-Service "AIVO Brain" "http://localhost:8001/health" "Main AI Brain")
$allPassed = $allPassed -and (Test-Service "Model Cloning" "http://localhost:8014/health" "Student Models")
$allPassed = $allPassed -and (Test-Service "Translation" "http://localhost:8010/health" "Multi-language")
$allPassed = $allPassed -and (Test-Service "Analytics" "http://localhost:8013/health" "Insights")

# Test Frontend Apps
Write-Host "`n🌐 Frontend Applications" -ForegroundColor Blue
Write-Host "------------------------" -ForegroundColor Blue
$allPassed = $allPassed -and (Test-Service "Web App" "http://localhost:5173" "Marketing")
$allPassed = $allPassed -and (Test-Service "Parent Portal" "http://localhost:5174" "Parents")
$allPassed = $allPassed -and (Test-Service "Teacher Portal" "http://localhost:5175" "Teachers")
$allPassed = $allPassed -and (Test-Service "Learner App" "http://localhost:5176" "Students")

# Test Ollama Models (if available)
Write-Host "`n🎯 Testing AI Models" -ForegroundColor Blue
Write-Host "--------------------" -ForegroundColor Blue

# Get list of available models
try {
    $modelsResponse = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get
    if ($modelsResponse.models.Count -gt 0) {
        Write-Host "Found $($modelsResponse.models.Count) models installed" -ForegroundColor Green
        
        # Test first model
        $firstModel = $modelsResponse.models[0].name
        Test-OllamaModel -Model $firstModel
    }
    else {
        Write-Host "⚠ No models installed yet" -ForegroundColor Yellow
        Write-Host "  Run: .\scripts\setup-local-ai.ps1" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "⚠ Could not check models" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "🎉 All tests PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your AIVO platform is ready for local testing!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Open http://localhost:3000 for Ollama UI"
    Write-Host "  2. Open http://localhost:5176 for Learner App"
    Write-Host "  3. Start building and testing!"
    exit 0
}
else {
    Write-Host "❌ Some tests FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check if all containers are running: docker-compose ps"
    Write-Host "  2. View logs: docker-compose logs -f"
    Write-Host "  3. Restart services: docker-compose restart"
    exit 1
}
