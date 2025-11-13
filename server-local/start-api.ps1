# start-api.ps1
# Inicia apenas o servidor API local

$ApiDir = "C:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui\server-local"

Write-Host "Iniciando API Local..." -ForegroundColor Cyan
Set-Location $ApiDir

# Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    pnpm install
}

# Iniciar servidor
Write-Host "Servidor API rodando em http://localhost:3001" -ForegroundColor Green
node index.js
