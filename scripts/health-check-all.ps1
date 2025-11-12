# AIVO Platform - Health Check Script
# Checks if all backend services are running and healthy

$services = @(
    @{Name="API Gateway"; Port=8001; Path="/health"},
    @{Name="AIVO Brain"; Port=8002; Path="/health"},
    @{Name="Baseline Assessment"; Port=8003; Path="/health"},
    @{Name="Learning Session"; Port=8004; Path="/health"},
    @{Name="Focus Monitor"; Port=8005; Path="/health"},
    @{Name="Curriculum Content"; Port=8006; Path="/health"},
    @{Name="Homework Helper"; Port=8007; Path="/health"},
    @{Name="IEP Assistant"; Port=8008; Path="/health"},
    @{Name="Training & Alignment"; Port=8009; Path="/health"},
    @{Name="Translator"; Port=8010; Path="/health"},
    @{Name="Business Model"; Port=8011; Path="/health"},
    @{Name="Notification"; Port=8012; Path="/health"},
    @{Name="Analytics & Insights"; Port=8013; Path="/health"},
    @{Name="Model Cloning"; Port=8014; Path="/health"},
    @{Name="Speech Therapy"; Port=8015; Path="/health"},
    @{Name="SEL Agent"; Port=8016; Path="/health"}
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "AIVO Platform - Service Health Check" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$healthyCount = 0
$totalServices = $services.Count

foreach ($service in $services) {
    $url = "http://localhost:$($service.Port)$($service.Path)"
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) (Port $($service.Port))" -ForegroundColor Green
            $healthyCount++
        } else {
            Write-Host "⚠️  $($service.Name) (Port $($service.Port)) - Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $($service.Name) (Port $($service.Port)) - NOT RESPONDING" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Health Check Summary:" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Healthy Services: $healthyCount / $totalServices" -ForegroundColor $(if ($healthyCount -eq $totalServices) { "Green" } else { "Yellow" })
Write-Host ""

if ($healthyCount -eq $totalServices) {
    Write-Host "✅ All services are healthy and running!" -ForegroundColor Green
} elseif ($healthyCount -gt 0) {
    Write-Host "⚠️  Some services are not responding. Check docker-compose logs." -ForegroundColor Yellow
} else {
    Write-Host "❌ No services are running. Start services with: docker-compose up -d" -ForegroundColor Red
}
