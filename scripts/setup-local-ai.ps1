# AIVO Local AI Setup Script (PowerShell)
# =============================================================================
# This script sets up local AI models for testing without API keys
# Run this after starting docker-compose

Write-Host "🚀 AIVO Local AI Setup" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is running
Write-Host "Checking Ollama service..." -ForegroundColor Blue
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method Get -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Ollama is running" -ForegroundColor Green
            break
        }
    }
    catch {
        Write-Host "Waiting for Ollama to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
    $attempt++
}

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Ollama failed to start. Please check docker-compose logs." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pulling recommended AI models..." -ForegroundColor Blue
Write-Host "This will take a few minutes on first run" -ForegroundColor Yellow
Write-Host ""

# Pull models
$models = @(
    @{Name = "llama3.2:3b"; Description = "Main chat model"},
    @{Name = "nomic-embed-text"; Description = "Embedding model"},
    @{Name = "codellama:7b"; Description = "Code generation"},
    @{Name = "llava:7b"; Description = "Vision model"},
    @{Name = "aya:8b"; Description = "Multilingual model"}
)

$i = 1
foreach ($model in $models) {
    Write-Host "$i. Pulling $($model.Name) - $($model.Description)..." -ForegroundColor Yellow
    docker exec aivo-pro-ollama-1 ollama pull $model.Name
    $i++
}

Write-Host ""
Write-Host "✓ All models pulled successfully!" -ForegroundColor Green
Write-Host ""

# List available models
Write-Host "Available models:" -ForegroundColor Blue
docker exec aivo-pro-ollama-1 ollama list

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:"
Write-Host "  • Access Ollama API at: http://localhost:11434"
Write-Host "  • Access Ollama Web UI at: http://localhost:3000"
Write-Host "  • Access LocalAI at: http://localhost:8080"
Write-Host ""
Write-Host "To test the chat model:"
Write-Host "  docker exec -it aivo-pro-ollama-1 ollama run llama3.2:3b" -ForegroundColor Cyan
Write-Host ""
Write-Host "To use in your app, set AI_PROVIDER=local in .env" -ForegroundColor Cyan
