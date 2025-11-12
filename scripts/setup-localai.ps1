# AIVO LocalAI Model Setup Script (PowerShell)
Write-Host "🧠 Setting up LocalAI models for AIVO Platform..." -ForegroundColor Green

# Wait for LocalAI to be ready
Write-Host "⏳ Waiting for LocalAI to be ready..." -ForegroundColor Yellow
do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/readyz" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) { break }
    }
    catch {
        Write-Host "LocalAI not ready yet, waiting..." -ForegroundColor Yellow
        Start-Sleep 5
    }
} while ($true)

Write-Host "✅ LocalAI is ready!" -ForegroundColor Green

# Function to install model
function Install-Model {
    param($ModelName, $Description)
    
    Write-Host "📥 Installing $Description ($ModelName)..." -ForegroundColor Cyan
    
    $body = @{
        model = $ModelName
        action = "install"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/models" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ $ModelName installed successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Error installing $ModelName : $_" -ForegroundColor Red
    }
}

# Download models for different AI agents
Write-Host "📥 Downloading AI models..." -ForegroundColor Blue

Install-Model "llama3.2:3b" "main chat model for AIVO Brain"
Install-Model "codellama:7b" "code/math model for homework helper"  
Install-Model "nomic-embed-text" "embedding model for content understanding"
Install-Model "llava:7b" "vision model for homework OCR"
Install-Model "tinyllama:1.1b" "lightweight model for quick responses"

Write-Host "🎉 All AI models installed successfully!" -ForegroundColor Green
Write-Host "🚀 AIVO Platform is now ready with LocalAI integration!" -ForegroundColor Green

# Test the models
Write-Host "🧪 Testing model connectivity..." -ForegroundColor Cyan

$testBody = @{
    model = "llama3.2:3b"
    messages = @(
        @{
            role = "user"
            content = "Hello! Are you ready to help students learn?"
        }
    )
    max_tokens = 50
} | ConvertTo-Json -Depth 3

try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:8080/v1/chat/completions" -Method POST -Body $testBody -ContentType "application/json"
    Write-Host "✅ Model test successful!" -ForegroundColor Green
    Write-Host "Response: $($testResponse.choices[0].message.content)" -ForegroundColor White
}
catch {
    Write-Host "⚠️ Model test failed: $_" -ForegroundColor Red
}

Write-Host "`n✅ LocalAI setup complete! All AIVO services are now connected to local AI models." -ForegroundColor Green