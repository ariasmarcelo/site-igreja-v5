# ============================================
# AUTO CAPTURE STYLES - PowerShell Script
# ============================================

Write-Host "AUTO CAPTURA DE ESTILOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o servidor está rodando
Write-Host "Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 3
    Write-Host "Servidor Vite rodando OK" -ForegroundColor Green
} catch {
    Write-Host "Servidor Vite NAO esta rodando!" -ForegroundColor Red
    Write-Host "Execute: .\start-dev.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Instalando dependencias necessarias..." -ForegroundColor Yellow
npm install --save-dev puppeteer

Write-Host ""
Write-Host "Executando captura de estilos..." -ForegroundColor Yellow
node scripts/auto-capture-runner.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Captura concluida!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "   1. Verifique: scripts/captured-styles.json" -ForegroundColor White
Write-Host "   2. Execute: node scripts/populate-all-styles.js" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
