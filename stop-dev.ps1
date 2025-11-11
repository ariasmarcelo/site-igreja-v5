# stop-dev.ps1
# Para o servidor Vercel Dev

Write-Host "=== Parando Servidor de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

# Parar porta 3000 (Vercel Dev)
$port3000 = netstat -ano | findstr ":3000" | Select-Object -First 1
if ($port3000) {
    $processId = ($port3000 -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null | Out-Null
    Write-Host "OK Vercel Dev encerrado (porta 3000)" -ForegroundColor Green
} else {
    Write-Host "Nenhum processo rodando na porta 3000" -ForegroundColor DarkGray
}

Write-Host ""
