# Deploy Sincrono (mostra progresso no terminal)
# Diferenca do deployAutomatico: este BLOQUEIA o terminal ate terminar
# Ambos geram o MESMO arquivo de log

param(
    [Parameter(Position=0)]
    [string]$Message = "deploy: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logDir "deploy-$timestamp.log"

Set-Location $projectRoot

# Funcao para remover codigos ANSI do log
function Remove-AnsiCodes {
    param([string]$Text)
    # Remove codigos ANSI [XXm
    $cleaned = $Text -replace '\x1b\[[0-9;]*m', ''
    # Remove outros caracteres especiais de controle
    $cleaned = $cleaned -replace '\x1b\[[\d;]*[A-Za-z]', ''
    # Remove caracteres Unicode problematicos (emojis, checkmarks, etc)
    $cleaned = $cleaned -replace '[^\x20-\x7E\r\n\t]', ''
    return $cleaned
}

# Funcao para escrever no log sem codigos ANSI
function Write-CleanLog {
    param([string]$Content)
    $cleaned = Remove-AnsiCodes -Text $Content
    # Escrever como texto ASCII puro
    Add-Content -Path $logFile -Value $cleaned -Encoding ASCII
}

# Criar diretorio de logs se nao existir
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Limpar logs antigos - manter apenas os ultimos 10
$oldLogs = Get-ChildItem "$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10
if ($oldLogs) {
    $oldLogs | Remove-Item -Force
    Write-Host "[CLEANUP] Removidos $($oldLogs.Count) logs antigos" -ForegroundColor Gray
}

# Iniciar log
$ts = Get-Date -Format 'HHmmss'
"========================================" | Out-File $logFile
"[$ts] DEPLOY INICIADO" | Out-File $logFile -Append
"[$ts] Mensagem: $Message" | Out-File $logFile -Append
"========================================" | Out-File $logFile -Append

Write-Host "`n[DEPLOY SINCRONO] Iniciando deploy..." -ForegroundColor Cyan
Write-Host "[INFO] Mensagem: $Message" -ForegroundColor Gray
Write-Host "[INFO] Log: $logFile" -ForegroundColor Gray

try {
    Write-Host "`n[1/4] Build..." -ForegroundColor Yellow
    $ts = Get-Date -Format 'HHmmss'
    "[$ts]" | Out-File $logFile -Append
    "[$ts] [1/4] Build..." | Out-File $logFile -Append
    $buildOutput = pnpm build 2>&1 | Out-String
    Write-CleanLog -Content $buildOutput
    $ts = Get-Date -Format 'HHmmss'
    "[$ts] [OK] Build concluido!" | Out-File $logFile -Append
    Write-Host "[OK] Build concluido!" -ForegroundColor Green
    
    Write-Host "`n[2/4] Git add..." -ForegroundColor Yellow
    $ts = Get-Date -Format 'HHmmss'
    "[$ts]" | Out-File $logFile -Append
    "[$ts] [2/4] Git add..." | Out-File $logFile -Append
    $gitAddOutput = git add . 2>&1 | Out-String
    Write-CleanLog -Content $gitAddOutput
    $ts = Get-Date -Format 'HHmmss'
    "[$ts] [OK] Git add concluido!" | Out-File $logFile -Append
    Write-Host "[OK] Git add concluido!" -ForegroundColor Green
    
    Write-Host "`n[3/4] Git commit..." -ForegroundColor Yellow
    $ts = Get-Date -Format 'HHmmss'
    "[$ts]" | Out-File $logFile -Append
    "[$ts] [3/4] Git commit..." | Out-File $logFile -Append
    $gitCommitOutput = git commit -m $Message 2>&1 | Out-String
    Write-CleanLog -Content $gitCommitOutput
    $ts = Get-Date -Format 'HHmmss'
    "[$ts] [OK] Git commit concluido!" | Out-File $logFile -Append
    Write-Host "[OK] Git commit concluido!" -ForegroundColor Green
    
    Write-Host "`n[4/4] Git push..." -ForegroundColor Yellow
    $ts = Get-Date -Format 'HHmmss'
    "[$ts]" | Out-File $logFile -Append
    "[$ts] [4/4] Git push..." | Out-File $logFile -Append
    $gitPushOutput = git push 2>&1 | Out-String
    Write-CleanLog -Content $gitPushOutput
    $ts = Get-Date -Format 'HHmmss'
    "[$ts] [OK] Git push concluido!" | Out-File $logFile -Append
    Write-Host "[OK] Git push concluido!" -ForegroundColor Green
    
    $ts = Get-Date -Format 'HHmmss'
    "[$ts]" | Out-File $logFile -Append
    "========================================" | Out-File $logFile -Append
    "[$ts] [SUCCESS] Deploy concluido com sucesso!" | Out-File $logFile -Append
    "[$ts] Finalizado: $(Get-Date -Format 'yyyyMMdd HHmmss')" | Out-File $logFile -Append
    "========================================" | Out-File $logFile -Append
    
    Write-Host "`n[SUCCESS] Deploy concluido com sucesso!" -ForegroundColor Green
    Write-Host "[INFO] Site disponivel em: https://ariasmarcelo.github.io/site-igreja-v5/" -ForegroundColor Cyan
    
} catch {
    $ts = Get-Date -Format 'HHmmss'
    "[$ts]" | Out-File $logFile -Append
    "========================================" | Out-File $logFile -Append
    "[$ts] [ERRO] Deploy falhou: $_" | Out-File $logFile -Append
    "========================================" | Out-File $logFile -Append
    Write-Host "`n[ERRO] Deploy falhou: $_" -ForegroundColor Red
    exit 1
}
