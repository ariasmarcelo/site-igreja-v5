# stop-dev.ps1
# Para o ambiente de desenvolvimento local (API + Frontend)

Write-Host "=== Parando Ambiente de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

# Parar porta 3001 (API Local)
Write-Host "Parando API Local (porta 3001)..." -ForegroundColor Yellow
$port3001 = netstat -ano | findstr ":3001" | Select-Object -First 1
if ($port3001) {
    $processId = ($port3001 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Processo encerrado (PID: $processId)" -ForegroundColor Green
} else {
    Write-Host "  Nenhum processo rodando na porta 3001" -ForegroundColor DarkGray
}

Write-Host ""

# Parar porta 8080 (Frontend - Vite)
Write-Host "Parando Frontend (porta 8080)..." -ForegroundColor Yellow
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1
if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Processo encerrado (PID: $processId)" -ForegroundColor Green
} else {
    Write-Host "  Nenhum processo rodando na porta 8080" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "[OK] Ambiente de desenvolvimento encerrado" -ForegroundColor Green
