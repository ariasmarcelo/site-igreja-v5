Set-Location 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui'
$logFile = 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui\logs\deploy-20251110-043023.log'

# Funcao para logar
function Write-Log {
    param([string]$msg)
    $timestamp = Get-Date -Format 'HHmmss'
    "[$timestamp] $msg" | Out-File $logFile -Append
}

# Iniciar log
"========================================" | Out-File $logFile
Write-Log "DEPLOY INICIADO"
Write-Log "Mensagem: test: validacao final deployAutomatico"
"========================================" | Out-File $logFile -Append

try {
    Write-Log ""
    Write-Log "[1/4] Build..."
    pnpm build 2>&1 | Out-File $logFile -Append
    Write-Log "[OK] Build concluido!"
    
    Write-Log ""
    Write-Log "[2/4] Git add..."
    git add . 2>&1 | Out-File $logFile -Append
    Write-Log "[OK] Git add concluido!"
    
    Write-Log ""
    Write-Log "[3/4] Git commit..."
    git commit -m "test: validacao final deployAutomatico" 2>&1 | Out-File $logFile -Append
    Write-Log "[OK] Git commit concluido!"
    
    Write-Log ""
    Write-Log "[4/4] Git push..."
    git push 2>&1 | Out-File $logFile -Append
    Write-Log "[OK] Git push concluido!"
    
    Write-Log ""
    "========================================" | Out-File $logFile -Append
    Write-Log "[SUCCESS] Deploy concluido com sucesso!"
    Write-Log "Finalizado: $(Get-Date -Format 'yyyyMMdd HHmmss')"
    "========================================" | Out-File $logFile -Append
    
} catch {
    Write-Log ""
    "========================================" | Out-File $logFile -Append
    Write-Log "[ERRO] Deploy falhou: $_"
    "========================================" | Out-File $logFile -Append
}

# Limpar logs antigos - manter ultimos 10
$oldLogs = Get-ChildItem "$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10
if ($oldLogs) {
    $oldLogs | Remove-Item -Force
}

# Auto-deletar o script temporario
Remove-Item 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui\temp-deploy-script.ps1' -Force -ErrorAction SilentlyContinue
