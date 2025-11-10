# Deploy em Background - Versao que REALMENTE funciona
# Uso: .\scripts\deploy-bg-real.ps1 "mensagem do commit"

param(
    [Parameter(Position=0)]
    [string]$Message = "deploy: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logDir "deploy-$timestamp.log"

# Criar diretorio de logs se nao existir
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

Write-Host "`n[DEPLOY BG] Iniciando deploy em background..." -ForegroundColor Cyan
Write-Host "[INFO] Mensagem: $Message" -ForegroundColor Gray
Write-Host "[INFO] Log: $logFile" -ForegroundColor Gray
Write-Host ""

# Criar script temporario que sera executado em background
$tempScript = Join-Path $projectRoot "temp-deploy-script.ps1"
$scriptContent = @"
Set-Location '$projectRoot'
`$logFile = '$logFile'

# Funcao para remover codigos ANSI
function Remove-AnsiCodes {
    param([string]`$Text)
    `$cleaned = `$Text -replace '\x1b\[[0-9;]*m', ''
    `$cleaned = `$cleaned -replace '\x1b\[[\d;]*[A-Za-z]', ''
    return `$cleaned
}

# Funcao para logar sem ANSI
function Write-Log {
    param([string]`$msg)
    `$timestamp = Get-Date -Format 'HHmmss'
    "[`$timestamp] `$msg" | Out-File `$logFile -Append -Encoding UTF8
}

function Write-CleanLog {
    param([string]`$Content)
    `$cleaned = Remove-AnsiCodes -Text `$Content
    `$cleaned | Out-File `$logFile -Append -Encoding UTF8
}

# Iniciar log
"========================================" | Out-File `$logFile -Encoding UTF8
Write-Log "DEPLOY INICIADO"
Write-Log "Mensagem: $Message"
"========================================" | Out-File `$logFile -Append -Encoding UTF8

try {
    Write-Log ""
    Write-Log "[1/4] Build..."
    `$buildOutput = pnpm build 2>&1 | Out-String
    Write-CleanLog -Content `$buildOutput
    Write-Log "[OK] Build concluido!"
    
    Write-Log ""
    Write-Log "[2/4] Git add..."
    `$gitAddOutput = git add . 2>&1 | Out-String
    Write-CleanLog -Content `$gitAddOutput
    Write-Log "[OK] Git add concluido!"
    
    Write-Log ""
    Write-Log "[3/4] Git commit..."
    `$gitCommitOutput = git commit -m "$Message" 2>&1 | Out-String
    Write-CleanLog -Content `$gitCommitOutput
    Write-Log "[OK] Git commit concluido!"
    
    Write-Log ""
    Write-Log "[4/4] Git push..."
    `$gitPushOutput = git push 2>&1 | Out-String
    Write-CleanLog -Content `$gitPushOutput
    Write-Log "[OK] Git push concluido!"
    
    Write-Log ""
    "========================================" | Out-File `$logFile -Append
    Write-Log "[SUCCESS] Deploy concluido com sucesso!"
    Write-Log "Finalizado: `$(Get-Date -Format 'yyyyMMdd HHmmss')"
    "========================================" | Out-File `$logFile -Append
    
} catch {
    Write-Log ""
    "========================================" | Out-File `$logFile -Append
    Write-Log "[ERRO] Deploy falhou: `$_"
    "========================================" | Out-File `$logFile -Append
}

# Limpar logs antigos - manter ultimos 10
`$oldLogs = Get-ChildItem "`$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10
if (`$oldLogs) {
    `$oldLogs | Remove-Item -Force
}

# Auto-deletar o script temporario
Remove-Item '$tempScript' -Force -ErrorAction SilentlyContinue
"@

# Salvar script temporario
$scriptContent | Out-File $tempScript -Encoding UTF8

# Executar em processo separado
Start-Process powershell -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $tempScript -WindowStyle Hidden

Write-Host "[OK] Deploy iniciado em background!" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "  Ver progresso:  Get-Content '$logFile' -Tail 20 -Wait" -ForegroundColor Gray
Write-Host "  Ver log:        Get-Content '$logFile'" -ForegroundColor Gray
Write-Host "  Todos os logs:  Get-ChildItem logs\deploy-*.log" -ForegroundColor Gray
Write-Host ""
Write-Host "Voce esta livre para trabalhar! O deploy continua em background..." -ForegroundColor Green
Write-Host ""
