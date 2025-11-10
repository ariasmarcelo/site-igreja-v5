<#
.SYNOPSIS
    Script unificado de deploy para GitHub Pages

.DESCRIPTION
    Deploy do site para GitHub Pages com suporte a execução síncrona ou em background.
    Gera logs limpos (sem códigos ANSI) no formato deploy-YYYYMMDD-HHMMSS.log
    
.PARAMETER Background
    Executa o deploy em background, liberando o terminal imediatamente.
    Por padrão, executa de forma síncrona mostrando progresso.
    Alias: -b
    
.PARAMETER Message
    Mensagem do commit. Se não fornecida, usa timestamp padrão.

.EXAMPLE
    .\deploy.ps1 "feat: nova funcionalidade"
    Deploy síncrono com mensagem personalizada
    
.EXAMPLE
    .\deploy.ps1 -b
    Deploy em background com mensagem padrão
    
.EXAMPLE
    .\deploy.ps1 -b "fix: correcao"
    Deploy em background com mensagem personalizada
    
.EXAMPLE
    .\deploy.ps1 -Background "fix: correcao importante"
    Deploy em background com mensagem personalizada (forma longa)
    
.NOTES
    Autor: Sistema Igreja Meta
    Versão: 2.2 (Ordem de parâmetros otimizada)
    Mantém últimos 10 logs automaticamente
#>

param(
    [Parameter()]
    [Alias('b')]
    [switch]$Background,
    
    [Parameter(Position=0)]
    [string]$Message = "deploy: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logDir = Join-Path $projectRoot "logs"
$logFile = Join-Path $logDir "deploy-$timestamp.log"

Set-Location $projectRoot

# ============================================================================
# FUNCOES AUXILIARES
# ============================================================================

function Remove-AnsiCodes {
    <#
    .SYNOPSIS
        Remove códigos ANSI e caracteres Unicode problemáticos
    #>
    param([string]$Text)
    
    # Remove codigos ANSI de cores [XXm
    $cleaned = $Text -replace '\x1b\[[0-9;]*m', ''
    # Remove outros caracteres especiais de controle
    $cleaned = $cleaned -replace '\x1b\[[\d;]*[A-Za-z]', ''
    # Remove caracteres Unicode problematicos (emojis, checkmarks, etc)
    $cleaned = $cleaned -replace '[^\x20-\x7E\r\n\t]', ''
    
    return $cleaned
}

function Write-CleanLog {
    <#
    .SYNOPSIS
        Escreve no log sem códigos ANSI, usando encoding ASCII
    #>
    param([string]$Content)
    
    $cleaned = Remove-AnsiCodes -Text $Content
    Add-Content -Path $logFile -Value $cleaned -Encoding ASCII
}

function Initialize-LogDirectory {
    <#
    .SYNOPSIS
        Cria diretório de logs e limpa logs antigos
    #>
    
    # Criar diretorio se nao existir
    if (!(Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    
    # Manter apenas os ultimos 10 logs
    $oldLogs = Get-ChildItem "$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending | 
                Select-Object -Skip 10
    
    if ($oldLogs) {
        $oldLogs | Remove-Item -Force
        if (!$Background) {
            Write-Host "[CLEANUP] Removidos $($oldLogs.Count) logs antigos" -ForegroundColor Gray
        }
    }
}

function Start-DeploymentSync {
    <#
    .SYNOPSIS
        Executa deploy de forma síncrona (bloqueante)
    #>
    
    Write-Host "`n[DEPLOY SINCRONO] Iniciando deploy..." -ForegroundColor Cyan
    Write-Host "[INFO] Mensagem: $Message" -ForegroundColor Gray
    Write-Host "[INFO] Log: $logFile" -ForegroundColor Gray
    
    # Iniciar log
    $ts = Get-Date -Format 'HHmmss'
    "========================================" | Out-File $logFile -Encoding ASCII
    "[$ts] DEPLOY INICIADO" | Add-Content -Path $logFile -Encoding ASCII
    "[$ts] Mensagem: $Message" | Add-Content -Path $logFile -Encoding ASCII
    "========================================" | Add-Content -Path $logFile -Encoding ASCII
    
    try {
        # [1/4] Build
        Write-Host "`n[1/4] Build..." -ForegroundColor Yellow
        $ts = Get-Date -Format 'HHmmss'
        "[$ts]" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] [1/4] Build..." | Add-Content -Path $logFile -Encoding ASCII
        $buildOutput = pnpm build 2>&1 | Out-String
        Write-CleanLog -Content $buildOutput
        $ts = Get-Date -Format 'HHmmss'
        "[$ts] [OK] Build concluido!" | Add-Content -Path $logFile -Encoding ASCII
        Write-Host "[OK] Build concluido!" -ForegroundColor Green
        
        # [2/4] Git add
        Write-Host "`n[2/4] Git add..." -ForegroundColor Yellow
        $ts = Get-Date -Format 'HHmmss'
        "[$ts]" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] [2/4] Git add..." | Add-Content -Path $logFile -Encoding ASCII
        $gitAddOutput = git add . 2>&1 | Out-String
        Write-CleanLog -Content $gitAddOutput
        $ts = Get-Date -Format 'HHmmss'
        "[$ts] [OK] Git add concluido!" | Add-Content -Path $logFile -Encoding ASCII
        Write-Host "[OK] Git add concluido!" -ForegroundColor Green
        
        # [3/4] Git commit
        Write-Host "`n[3/4] Git commit..." -ForegroundColor Yellow
        $ts = Get-Date -Format 'HHmmss'
        "[$ts]" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] [3/4] Git commit..." | Add-Content -Path $logFile -Encoding ASCII
        $gitCommitOutput = git commit -m $Message 2>&1 | Out-String
        Write-CleanLog -Content $gitCommitOutput
        $ts = Get-Date -Format 'HHmmss'
        "[$ts] [OK] Git commit concluido!" | Add-Content -Path $logFile -Encoding ASCII
        Write-Host "[OK] Git commit concluido!" -ForegroundColor Green
        
        # [4/4] Git push
        Write-Host "`n[4/4] Git push..." -ForegroundColor Yellow
        $ts = Get-Date -Format 'HHmmss'
        "[$ts]" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] [4/4] Git push..." | Add-Content -Path $logFile -Encoding ASCII
        $gitPushOutput = git push 2>&1 | Out-String
        Write-CleanLog -Content $gitPushOutput
        $ts = Get-Date -Format 'HHmmss'
        "[$ts] [OK] Git push concluido!" | Add-Content -Path $logFile -Encoding ASCII
        Write-Host "[OK] Git push concluido!" -ForegroundColor Green
        
        # Finalizar
        $ts = Get-Date -Format 'HHmmss'
        "[$ts]" | Add-Content -Path $logFile -Encoding ASCII
        "========================================" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] [SUCCESS] Deploy concluido com sucesso!" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] Finalizado: $(Get-Date -Format 'yyyyMMdd HHmmss')" | Add-Content -Path $logFile -Encoding ASCII
        "========================================" | Add-Content -Path $logFile -Encoding ASCII
        
        Write-Host "`n[SUCCESS] Deploy concluido com sucesso!" -ForegroundColor Green
        Write-Host "[INFO] Site disponivel em: https://ariasmarcelo.github.io/site-igreja-v6/" -ForegroundColor Cyan
        
    } catch {
        $ts = Get-Date -Format 'HHmmss'
        "[$ts]" | Add-Content -Path $logFile -Encoding ASCII
        "========================================" | Add-Content -Path $logFile -Encoding ASCII
        "[$ts] [ERRO] Deploy falhou: $_" | Add-Content -Path $logFile -Encoding ASCII
        "========================================" | Add-Content -Path $logFile -Encoding ASCII
        
        Write-Host "`n[ERRO] Deploy falhou: $_" -ForegroundColor Red
        exit 1
    }
}

function Start-DeploymentBackground {
    <#
    .SYNOPSIS
        Executa deploy em background usando script temporário
    #>
    
    Write-Host "`n[DEPLOY BACKGROUND] Iniciando deploy em background..." -ForegroundColor Cyan
    Write-Host "[INFO] Mensagem: $Message" -ForegroundColor Gray
    Write-Host "[INFO] Log: $logFile" -ForegroundColor Gray
    Write-Host ""
    
    # Criar script temporario
    $tempScript = Join-Path $projectRoot "temp-deploy-script.ps1"
    $scriptContent = @"
Set-Location '$projectRoot'
`$logFile = '$logFile'

# Funcao para remover codigos ANSI
function Remove-AnsiCodes {
    param([string]`$Text)
    `$cleaned = `$Text -replace '\x1b\[[0-9;]*m', ''
    `$cleaned = `$cleaned -replace '\x1b\[[\d;]*[A-Za-z]', ''
    `$cleaned = `$cleaned -replace '[^\x20-\x7E\r\n\t]', ''
    return `$cleaned
}

function Write-Log {
    param([string]`$msg)
    `$timestamp = Get-Date -Format 'HHmmss'
    "[`$timestamp] `$msg" | Add-Content -Path `$logFile -Encoding ASCII
}

function Write-CleanLog {
    param([string]`$Content)
    `$cleaned = Remove-AnsiCodes -Text `$Content
    Add-Content -Path `$logFile -Value `$cleaned -Encoding ASCII
}

# Iniciar log
"========================================" | Out-File `$logFile -Encoding ASCII
Write-Log "DEPLOY INICIADO"
Write-Log "Mensagem: $Message"
"========================================" | Add-Content -Path `$logFile -Encoding ASCII

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
    "========================================" | Add-Content -Path `$logFile -Encoding ASCII
    Write-Log "[SUCCESS] Deploy concluido com sucesso!"
    Write-Log "Finalizado: `$(Get-Date -Format 'yyyyMMdd HHmmss')"
    "========================================" | Add-Content -Path `$logFile -Encoding ASCII
    
} catch {
    Write-Log ""
    "========================================" | Add-Content -Path `$logFile -Encoding ASCII
    Write-Log "[ERRO] Deploy falhou: `$_"
    "========================================" | Add-Content -Path `$logFile -Encoding ASCII
}

# Limpar logs antigos
`$logDir = '$logDir'
`$oldLogs = Get-ChildItem "`$logDir\deploy-*.log" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10
if (`$oldLogs) {
    `$oldLogs | Remove-Item -Force
}

# Auto-deletar script temporario
Remove-Item '$tempScript' -Force -ErrorAction SilentlyContinue
"@

    # Salvar script temporario
    $scriptContent | Out-File $tempScript -Encoding UTF8
    
    # Executar em background (hidden window)
    Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File `"$tempScript`"" -WindowStyle Hidden
    
    Write-Host "[OK] Deploy iniciado em background!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos uteis:" -ForegroundColor Yellow
    Write-Host "  Ver progresso:  " -NoNewline -ForegroundColor Gray
    Write-Host "Get-Content '$logFile' -Tail 20 -Wait" -ForegroundColor White
    Write-Host "  Ver log:        " -NoNewline -ForegroundColor Gray
    Write-Host "Get-Content '$logFile'" -ForegroundColor White
    Write-Host "  Todos os logs:  " -NoNewline -ForegroundColor Gray
    Write-Host "Get-ChildItem logs\deploy-*.log" -ForegroundColor White
    Write-Host ""
    Write-Host "Voce esta livre para trabalhar! O deploy continua em background..." -ForegroundColor Cyan
}

# ============================================================================
# EXECUCAO PRINCIPAL
# ============================================================================

Initialize-LogDirectory

if ($Background) {
    Start-DeploymentBackground
} else {
    Start-DeploymentSync
}
