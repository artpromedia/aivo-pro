# AI Model Connection Test Script
# Tests all AI models for AIVO platform
# Author: E2E QA Engineer

Write-Host "🧪 AIVO AI Model Connection Test Suite" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$testsPassed = 0
$testsFailed = 0

function Test-Service {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedStatus = "200"
    )
    
    Write-Host "Testing $Name..." -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            return $true
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host " ❌ FAIL ($($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

function Test-OllamaModel {
    param(
        [string]$ModelName
    )
    
    Write-Host "Testing Ollama model: $ModelName..." -NoNewline
    
    try {
        $body = @{
            model = $ModelName
            prompt = "Say 'OK' if you are working"
            stream = $false
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        if ($response) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host " ❌ FAIL ($($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
    
    return $false
}

# Test 1: Docker is running
Write-Host "`n📦 Phase 1: Docker Infrastructure" -ForegroundColor Yellow
Write-Host "-----------------------------------"

try {
    docker version | Out-Null
    Write-Host "Docker Desktop: ✅ RUNNING" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host "Docker Desktop: ❌ NOT RUNNING" -ForegroundColor Red
    Write-Host "ERROR: Please start Docker Desktop and run this script again." -ForegroundColor Red
    $testsFailed++
    exit 1
}

# Test 2: Check containers
Write-Host "`n🐳 Phase 2: Container Status" -ForegroundColor Yellow
Write-Host "----------------------------"

$containers = @(
    "aivo-pro-ollama-1",
    "aivo-pro-localai-1",
    "aivo-pro-aivo-brain-1",
    "aivo-pro-homework-helper-1",
    "aivo-pro-curriculum-content-1",
    "aivo-pro-iep-assistant-1",
    "aivo-pro-model-cloning-1"
)

foreach ($container in $containers) {
    $status = docker ps --filter "name=$container" --format "{{.Status}}" 2>$null
    if ($status) {
        Write-Host "$container : ✅ $status" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "$container : ❌ NOT RUNNING" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 3: Service Health Checks
Write-Host "`n🏥 Phase 3: Service Health Endpoints" -ForegroundColor Yellow
Write-Host "------------------------------------"

$services = @{
    "Ollama API" = "http://localhost:11434/api/version"
    "Ollama Web UI" = "http://localhost:3000"
    "LocalAI" = "http://localhost:8080/readyz"
    "AIVO Brain" = "http://localhost:8014/health"
    "Homework Helper" = "http://localhost:8007/health"
    "Curriculum Content" = "http://localhost:8006/health"
    "IEP Assistant" = "http://localhost:8008/health"
    "Model Cloning" = "http://localhost:8002/health"
}

foreach ($service in $services.GetEnumerator()) {
    if (Test-Service -Name $service.Key -Url $service.Value) {
        $testsPassed++
    } else {
        $testsFailed++
    }
}

# Test 4: Ollama Models Available
Write-Host "`n🤖 Phase 4: Ollama Model Availability" -ForegroundColor Yellow
Write-Host "-------------------------------------"

try {
    $models = docker exec aivo-pro-ollama-1 ollama list 2>$null
    Write-Host $models
    
    $requiredModels = @(
        "llama3.2:3b",
        "codellama:7b",
        "llava:7b",
        "nomic-embed-text",
        "tinyllama:1.1b"
    )
    
    foreach ($model in $requiredModels) {
        if ($models -match $model) {
            Write-Host "$model : ✅ INSTALLED" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "$model : ❌ NOT INSTALLED" -ForegroundColor Red
            $testsFailed++
        }
    }
} catch {
    Write-Host "❌ Failed to check Ollama models" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Model Inference Test
Write-Host "`n🧠 Phase 5: Model Inference Tests" -ForegroundColor Yellow
Write-Host "----------------------------------"

$modelsToTest = @("llama3.2:3b", "tinyllama:1.1b")

foreach ($model in $modelsToTest) {
    if (Test-OllamaModel -ModelName $model) {
        $testsPassed++
    } else {
        $testsFailed++
    }
}

# Test 6: LocalAI Bridge to Ollama
Write-Host "`n🌉 Phase 6: LocalAI-Ollama Bridge" -ForegroundColor Yellow
Write-Host "---------------------------------"

try {
    $body = @{
        model = "gpt-3.5-turbo"
        messages = @(
            @{
                role = "user"
                content = "Say OK"
            }
        )
    } | ConvertTo-Json -Depth 3
    
    Write-Host "Testing LocalAI bridge to Ollama..." -NoNewline
    $response = Invoke-RestMethod -Uri "http://localhost:8080/v1/chat/completions" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 30 `
        -ErrorAction Stop
    
    if ($response) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        $testsPassed++
    }
} catch {
    Write-Host " ❌ FAIL ($($_.Exception.Message))" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed ✅" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed ❌" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED! Your AI models are configured correctly!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  SOME TESTS FAILED. Please review the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "1. If containers aren't running: docker-compose up -d" -ForegroundColor White
    Write-Host "2. If models aren't installed: .\scripts\setup-local-ai.ps1" -ForegroundColor White
    Write-Host "3. If services are unhealthy: docker-compose restart <service>" -ForegroundColor White
    Write-Host "4. View logs: docker-compose logs -f <service-name>" -ForegroundColor White
    exit 1
}
