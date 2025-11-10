Set-Location 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui'
$logFile = 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui\logs\deploy-20251110-045955.log'

# Funcao para remover codigos ANSI
function Remove-AnsiCodes {
    param([string]$Text)
    $cleaned = $Text -replace '\x1b\[[0-9;]*m', ''
    $cleaned = $cleaned -replace '\x1b\[[\d;]*[A-Za-z]', ''
    $cleaned = $cleaned -replace '[^\x20-\x7E\r\n\t]', ''
    return $cleaned
}

function Write-Log {
    param([string]$msg)
    $timestamp = Get-Date -Format 'HHmmss'
    "[$timestamp] $msg" | Add-Content -Path $logFile -Encoding ASCII
}

function Write-CleanLog {
    param([string]$Content)
    $cleaned = Remove-AnsiCodes -Text $Content
    Add-Content -Path $logFile -Value $cleaned -Encoding ASCII
}

# Iniciar log
"========================================" | Out-File $logFile -Encoding ASCII
Write-Log "DEPLOY INICIADO"
Write-Log "Mensagem: feat: testando modo background do script unificado"
"========================================" | Add-Content -Path $logFile -Encoding ASCII

try {
    Write-Log ""
    Write-Log "[1/4] Build..."
    $buildOutput = pnpm build 2>&1 | Out-String
    Write-CleanLog -Content $buildOutput
    Write-Log "[OK] Build concluido!"
    
    Write-Log ""
    Write-Log "[2/4] Git add..."
    $gitAddOutput = git add . 2>&1 | Out-String
    Write-CleanLog -Content $gitAddOutput
    Write-Log "[OK] Git add concluido!"
    
    Write-Log ""
    Write-Log "[3/4] Git commit..."
    $gitCommitOutput = git commit -m "feat: testando modo background do script unificado" 2>&1 | Out-String
    Write-CleanLog -Content $gitCommitOutput
    Write-Log "[OK] Git commit concluido!"
    
    Write-Log ""
    Write-Log "[4/4] Git push..."
    $gitPushOutput = git push 2>&1 | Out-String
    Write-CleanLog -Content $gitPushOutput
    Write-Log "[OK] Git push concluido!"
    
    Write-Log ""
    "========================================" | Add-Content -Path $logFile -Encoding ASCII
    Write-Log "[SUCCESS] Deploy concluido com sucesso!"
    Write-Log "Finalizado: $(Get-Date -Format 'yyyyMMdd HHmmss')"
    "========================================" | Add-Content -Path $logFile -Encoding ASCII
    
} catch {
    Write-Log ""
    "========================================" | Add-Content -Path $logFile -Encoding ASCII
    Write-Log "[ERRO] Deploy falhou: $_"
    "========================================" | Add-Content -Path $logFile -Encoding ASCII
}

# Limpar logs antigos
$logDir = 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui\logs'
$oldLogs = Get-ChildItem "$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10
if ($oldLogs) {
    $oldLogs | Remove-Item -Force
}

# Auto-deletar script temporario
Remove-Item 'C:\temp\Site_Igreja_Meta\V5_SiteIgreja\workspace\shadcn-ui\temp-deploy-script.ps1' -Force -ErrorAction SilentlyContinue
