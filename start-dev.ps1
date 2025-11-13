# start-dev.ps1
# Inicia ambiente de desenvolvimento local (API + Frontend)
# API local (Express) na porta 3001 + Vite na porta 8080

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Ambiente Local ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

Write-Host "[1/3] Limpando portas..." -ForegroundColor Yellow

# Limpar porta 3001 (API)
$port3001 = netstat -ano | findstr ":3001" | Select-Object -First 1
if ($port3001) {
    $processId = ($port3001 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 3001 liberada" -ForegroundColor Green
}

# Limpar porta 8080 (Frontend)
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1
if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 8080 liberada" -ForegroundColor Green
}

Start-Sleep -Seconds 1
Write-Host ""

Write-Host "[2/3] Iniciando API Local (porta 3001)..." -ForegroundColor Yellow
# Iniciar API local
Start-Process powershell -ArgumentList "-NoExit", "-File", "$WorkDir\server-local\start-api.ps1" -WindowStyle Minimized
Start-Sleep -Seconds 5

Write-Host "[3/3] Iniciando Vite (porta 8080)..." -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:8080" -ForegroundColor DarkGray
Write-Host "  API: http://localhost:3001" -ForegroundColor DarkGray
Write-Host ""

# Iniciar Vite
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; pnpm run dev" -WorkingDirectory $WorkDir -WindowStyle Minimized
Start-Sleep -Seconds 5

Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

# Verificar API
$apiOk = netstat -ano | findstr ":3001" | Select-Object -First 1

# Verificar Frontend
$frontendOk = netstat -ano | findstr ":8080" | Select-Object -First 1

if ($apiOk -and $frontendOk) {
    Write-Host "OK API Local: http://localhost:3001" -ForegroundColor Green
    Write-Host "OK Frontend: http://localhost:8080" -ForegroundColor Green
    Write-Host "OK Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ambiente 100% LOCAL funcionando!" -ForegroundColor Cyan
} else {
    if (-not $apiOk) {
        Write-Host "ERRO API Local nao iniciou" -ForegroundColor Red
    }
    if (-not $frontendOk) {
        Write-Host "ERRO Frontend nao iniciou" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host ""
