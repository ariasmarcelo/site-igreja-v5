# Inicia servidor de desenvolvimento em janela externa

Write-Host "🚀 Iniciando servidor Vite em janela externa..." -ForegroundColor Cyan

# Para processos node existentes
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Inicia em nova janela do PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npx vite --port 5173"

Write-Host "✅ Servidor iniciado em janela externa na porta 5173" -ForegroundColor Green
Write-Host "⏳ Aguarde alguns segundos para o servidor inicializar completamente" -ForegroundColor Yellow
