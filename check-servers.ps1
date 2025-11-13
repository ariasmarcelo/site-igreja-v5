# check-servers.ps1
# Verifica status do ambiente de desenvolvimento

Write-Host "=== Verificando Ambiente de Desenvolvimento ===" -ForegroundColor Cyan
Write-Host ""

# Verificar porta 8080 (Vercel Dev)
Write-Host "Vercel Dev (porta 8080):" -ForegroundColor Yellow
$port8080 = netstat -ano | findstr ":8080" | Select-Object -First 1

if ($port8080) {
    $processId = ($port8080 -split '\s+')[-1]
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    # Obter detalhes do processo via WMI
    $wmiProc = Get-CimInstance Win32_Process -Filter "ProcessId=$processId" -ErrorAction SilentlyContinue
    
    Write-Host "  [OK] RODANDO" -ForegroundColor Green
    Write-Host "     PID: $processId" -ForegroundColor DarkGray
    if ($process) {
        Write-Host "     Processo: $($process.ProcessName)" -ForegroundColor DarkGray
        Write-Host "     Memoria: $([math]::Round($process.WorkingSet64/1MB, 2)) MB" -ForegroundColor DarkGray
    }
    if ($wmiProc -and $wmiProc.CommandLine) {
        $shortCmd = if ($wmiProc.CommandLine.Length -gt 60) {
            $wmiProc.CommandLine.Substring(0, 57) + "..."
        } else {
            $wmiProc.CommandLine
        }
        Write-Host "     Comando: $shortCmd" -ForegroundColor DarkGray
    }
    Write-Host "     URL: http://localhost:8080" -ForegroundColor DarkGray
    Write-Host "     Admin Console: http://localhost:8080/436F6E736F6C45" -ForegroundColor DarkGray
} else {
    Write-Host "  [X] PARADO" -ForegroundColor Red
    Write-Host "     Execute: pnpm start" -ForegroundColor Yellow
}

Write-Host ""

# Verificar processos Node.js relacionados ao projeto  
Write-Host "Processos Node.js de desenvolvimento:" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $devFound = $false
    foreach ($nodeProc in $nodeProcesses) {
        $wmiProc = Get-CimInstance Win32_Process -Filter "ProcessId=$($nodeProc.Id)" -ErrorAction SilentlyContinue
        if ($wmiProc -and $wmiProc.CommandLine -match "vite|vercel|webpack|next|site-igreja") {
            $devFound = $true
            $type = "Node.js"
            if ($wmiProc.CommandLine -match "vite") { $type = "Vite" }
            elseif ($wmiProc.CommandLine -match "vercel") { $type = "Vercel" }
            
            Write-Host "  PID: $($nodeProc.Id) | Tipo: $type | Memoria: $([math]::Round($nodeProc.WorkingSet64/1MB, 2)) MB" -ForegroundColor Cyan
        }
    }
    if (-not $devFound) {
        Write-Host "  Nenhum processo Node.js do projeto detectado" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  Nenhum processo Node.js rodando" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "=== Fim da Verificacao ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquitetura:" -ForegroundColor Yellow
Write-Host "  Vercel Dev -> Frontend + APIs -> Supabase (remoto)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Comandos uteis:" -ForegroundColor Yellow
Write-Host "  pnpm start  - Inicia Vercel Dev" -ForegroundColor DarkGray
Write-Host "  pnpm stop   - Para Vercel Dev" -ForegroundColor DarkGray
Write-Host "  pnpm check  - Verifica status" -ForegroundColor DarkGray
