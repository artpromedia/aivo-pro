#!/usr/bin/env pwsh
# Test script for AIVO Brain Service

Write-Host "🧪 Testing AIVO Brain Service..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8001"

# Test 1: Health Check
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    if ($health.healthy) {
        Write-Host "   ✅ Health check passed" -ForegroundColor Green
        Write-Host "   Components:" -ForegroundColor Gray
        foreach ($check in $health.checks.PSObject.Properties) {
            $status = if ($check.Value) { "✅" } else { "❌" }
            Write-Host "     $status $($check.Name)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  Service is unhealthy" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Readiness Check
Write-Host "2. Testing readiness endpoint..." -ForegroundColor Yellow
try {
    $readiness = Invoke-RestMethod -Uri "$baseUrl/readiness" -Method Get
    if ($readiness.ready) {
        Write-Host "   ✅ Service is ready" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Service is not ready: $($readiness.reason)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Readiness check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Metrics Endpoint
Write-Host "3. Testing metrics endpoint..." -ForegroundColor Yellow
try {
    $metrics = Invoke-WebRequest -Uri "$baseUrl/metrics" -Method Get
    if ($metrics.StatusCode -eq 200) {
        Write-Host "   ✅ Metrics endpoint accessible" -ForegroundColor Green
        $metricsLines = $metrics.Content -split "`n" | Where-Object { $_ -notmatch '^#' -and $_ -ne '' }
        Write-Host "   Found $($metricsLines.Count) metrics" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Metrics check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: API Documentation
Write-Host "4. Testing API docs..." -ForegroundColor Yellow
try {
    $docs = Invoke-WebRequest -Uri "$baseUrl/docs" -Method Get
    if ($docs.StatusCode -eq 200) {
        Write-Host "   ✅ API docs accessible at $baseUrl/docs" -ForegroundColor Green
    }
} catch {
    Write-Host "   ℹ️  API docs may be disabled (production mode)" -ForegroundColor Blue
}
Write-Host ""

# Test 5: Inference Request
Write-Host "5. Testing inference endpoint..." -ForegroundColor Yellow
$testRequest = @{
    prompt = "Explain photosynthesis in simple terms for a 5th grader."
    grade_level = "5"
    subject = "Science"
    learning_style = "visual"
    max_tokens = 150
    temperature = 0.7
} | ConvertTo-Json

try {
    Write-Host "   Sending test request..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri "$baseUrl/v1/generate" `
        -Method Post `
        -ContentType "application/json" `
        -Body $testRequest `
        -TimeoutSec 60
    
    Write-Host "   ✅ Inference successful!" -ForegroundColor Green
    Write-Host "   Model: $($response.model_used)" -ForegroundColor Gray
    Write-Host "   Inference time: $([math]::Round($response.inference_time_ms, 2))ms" -ForegroundColor Gray
    Write-Host "   Tokens generated: $($response.tokens_generated)" -ForegroundColor Gray
    Write-Host "   Cache hit: $($response.cache_hit)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Response preview:" -ForegroundColor Gray
    $preview = $response.response.Substring(0, [Math]::Min(200, $response.response.Length))
    Write-Host "   $preview..." -ForegroundColor White
} catch {
    Write-Host "   ❌ Inference failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "   Details: $($_.ErrorDetails)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Service URL: $baseUrl" -ForegroundColor White
Write-Host "API Docs:    $baseUrl/docs" -ForegroundColor White
Write-Host "Health:      $baseUrl/health" -ForegroundColor White
Write-Host "Metrics:     $baseUrl/metrics" -ForegroundColor White
Write-Host ""
