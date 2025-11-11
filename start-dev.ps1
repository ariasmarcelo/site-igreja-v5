# start-dev.ps1
# Inicia ambiente de desenvolvimento
# Frontend: Vite (porta 8080) | Backend: Vercel Dev Serverless (porta 3000)

$WorkDir = "c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui"

Write-Host "=== Iniciando Ambiente de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $WorkDir

Write-Host "[1/3] Limpando portas..." -ForegroundColor Yellow

# Limpar porta 8080 (Frontend)
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1
if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 8080 liberada" -ForegroundColor Green
}

# Limpar porta 3000 (Backend)
$port3000 = netstat -ano | findstr ":3000" | Select-Object -First 1
if ($port3000) {
    $processId = ($port3000 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "  Porta 3000 liberada" -ForegroundColor Green
}

Start-Sleep -Seconds 1
Write-Host ""

Write-Host "[2/3] Iniciando Backend (Vercel Dev - porta 3000)..." -ForegroundColor Yellow
Write-Host "  API Serverless (identico a producao)" -ForegroundColor DarkGray

# Iniciar Vercel Dev apenas para APIs
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; vercel dev --listen 3000" -WindowStyle Minimized
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "[3/3] Iniciando Frontend (Vite - porta 8080)..." -ForegroundColor Yellow
Write-Host "  Hot reload ativado" -ForegroundColor DarkGray

# Iniciar Vite
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkDir'; npx vite --port 8080 --host" -WindowStyle Minimized
Start-Sleep -Seconds 4

Write-Host ""
Write-Host "=== Verificando Status ===" -ForegroundColor Cyan
Write-Host ""

# Verificar servidores
$backendOk = netstat -ano | findstr ":3000" | Select-Object -First 1
$frontendOk = netstat -ano | findstr ":8080" | Select-Object -First 1

if ($backendOk) {
    Write-Host "OK Backend (Vercel Dev): http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "ERRO Backend nao iniciou" -ForegroundColor Red
}

if ($frontendOk) {
    Write-Host "OK Frontend (Vite): http://localhost:8080" -ForegroundColor Green
    Write-Host "OK Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor Green
} else {
    Write-Host "ERRO Frontend nao iniciou" -ForegroundColor Red
}

Write-Host ""
Write-Host "IMPORTANTE: Frontend chama API em http://localhost:3000/api/*" -ForegroundColor Yellow
Write-Host "            (Vercel Dev simula producao)" -ForegroundColor DarkGray
Write-Host ""
