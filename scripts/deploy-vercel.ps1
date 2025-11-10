# =============================================================================
# SCRIPT DE DEPLOY AUTOMATIZADO PARA VERCEL
# =============================================================================
# 
# Este script automatiza o processo de deploy no Vercel, incluindo:
# - Verificação de login
# - Deploy inicial (preview)
# - Configuração de variáveis de ambiente
# - Deploy em produção
#
# =============================================================================

param(
    [switch]$SkipEnvConfig = $false,
    [switch]$ProdOnly = $false
)

$ErrorActionPreference = "Continue"

# Cores para output
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Step($Message) {
    Write-ColorOutput Yellow "`n[STEP] $Message"
}

function Write-Success($Message) {
    Write-ColorOutput Green "[OK] $Message"
}

function Write-Error-Custom($Message) {
    Write-ColorOutput Red "[ERROR] $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Cyan "[INFO] $Message"
}

# =============================================================================
# VERIFICAÇÕES INICIAIS
# =============================================================================

Write-Step "Verificando Vercel CLI..."

try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI não encontrado"
    }
    Write-Success "Vercel CLI instalado: $vercelVersion"
} catch {
    Write-Error-Custom "Vercel CLI não está instalado!"
    Write-Info "Instale com: npm install -g vercel"
    exit 1
}

# =============================================================================
# VERIFICAR SE JÁ ESTÁ LOGADO
# =============================================================================

Write-Step "Verificando autenticação..."

$whoami = vercel whoami 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Já autenticado como: $whoami"
} else {
    Write-Info "Você precisa fazer login no Vercel"
    Write-Info "Um navegador será aberto. Faça login e volte aqui."
    Write-Info ""
    Write-Info "Pressione ENTER para continuar..."
    Read-Host
    
    Write-Step "Executando login no Vercel..."
    
    # Executar login em processo separado
    $loginProcess = Start-Process -FilePath "vercel" -ArgumentList "login" -NoNewWindow -PassThru -Wait
    
    if ($loginProcess.ExitCode -ne 0) {
        Write-Error-Custom "Falha no login"
        exit 1
    }
    
    # Verificar novamente
    Start-Sleep -Seconds 2
    $whoami = vercel whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Login realizado com sucesso! Usuário: $whoami"
    } else {
        Write-Error-Custom "Login falhou. Execute 'vercel login' manualmente."
        exit 1
    }
}

# =============================================================================
# VERIFICAR .env.local
# =============================================================================

Write-Step "Verificando credenciais locais..."

$envLocalPath = ".env.local"
if (-Not (Test-Path $envLocalPath)) {
    Write-Error-Custom "Arquivo .env.local não encontrado!"
    Write-Info "Crie o arquivo .env.local com suas credenciais do Supabase"
    Write-Info "Use .env.example como referência"
    exit 1
}

# Ler variáveis do .env.local
$envVars = @{}
Get-Content $envLocalPath | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

# Verificar variáveis obrigatórias
$requiredVars = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_KEY"
)

$missingVars = @()
foreach ($varName in $requiredVars) {
    if (-Not $envVars.ContainsKey($varName) -or [string]::IsNullOrWhiteSpace($envVars[$varName])) {
        $missingVars += $varName
    }
}

if ($missingVars.Count -gt 0) {
    Write-Error-Custom "Variáveis faltando no .env.local:"
    $missingVars | ForEach-Object { Write-Info "  - $_" }
    exit 1
}

Write-Success "Credenciais encontradas no .env.local"

# =============================================================================
# DEPLOY PREVIEW (se não for prod-only)
# =============================================================================

if (-Not $ProdOnly) {
    Write-Step "Executando deploy de preview..."
    Write-Info "Isso pode levar alguns minutos..."
    
    # Executar deploy em modo não-interativo
    $deployOutput = vercel --yes 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Deploy de preview falhou"
        Write-Info $deployOutput
        exit 1
    }
    
    # Extrair URL do preview
    $previewUrl = $deployOutput | Select-String -Pattern "https://[^\s]+" | Select-Object -First 1
    if ($previewUrl) {
        Write-Success "Deploy de preview concluído!"
        Write-Info "Preview URL: $previewUrl"
    } else {
        Write-Success "Deploy de preview concluído!"
    }
    
    Start-Sleep -Seconds 3
}

# =============================================================================
# CONFIGURAR VARIÁVEIS DE AMBIENTE
# =============================================================================

if (-Not $SkipEnvConfig) {
    Write-Step "Configurando variáveis de ambiente no Vercel..."
    
    # Listar variáveis existentes
    Write-Info "Verificando variáveis existentes..."
    $existingEnv = vercel env ls 2>&1
    
    # Variáveis para configurar
    $envToSet = @{
        "VITE_SUPABASE_URL" = $envVars["VITE_SUPABASE_URL"]
        "VITE_SUPABASE_ANON_KEY" = $envVars["VITE_SUPABASE_ANON_KEY"]
        "SUPABASE_SERVICE_KEY" = $envVars["SUPABASE_SERVICE_KEY"]
    }
    
    foreach ($key in $envToSet.Keys) {
        $value = $envToSet[$key]
        
        # Verificar se já existe
        if ($existingEnv -match $key) {
            Write-Info "$key já existe, pulando..."
            continue
        }
        
        Write-Info "Configurando $key..."
        
        # Criar arquivo temporário com o valor
        $tempFile = [System.IO.Path]::GetTempFileName()
        $value | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline
        
        try {
            # Adicionar variável (production, preview, development)
            $result = Get-Content $tempFile | vercel env add $key production 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "$key configurado"
            } else {
                Write-Info "${key}: $result"
            }
            
            Start-Sleep -Seconds 1
        } finally {
            Remove-Item $tempFile -ErrorAction SilentlyContinue
        }
    }
    
    # Configurar VITE_API_URL
    Write-Info "Obtendo URL do projeto..."
    $projectInfo = vercel project ls --yes 2>&1
    
    # Tentar extrair URL do projeto
    $projectUrl = $projectInfo | Select-String -Pattern "https://[^\s]+\.vercel\.app" | Select-Object -First 1
    
    if ($projectUrl) {
        $apiUrl = $projectUrl.ToString().Trim()
        Write-Info "URL do projeto: $apiUrl"
        
        if (-Not ($existingEnv -match "VITE_API_URL")) {
            Write-Info "Configurando VITE_API_URL..."
            $tempFile = [System.IO.Path]::GetTempFileName()
            $apiUrl | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline
            
            try {
                Get-Content $tempFile | vercel env add VITE_API_URL production 2>&1 | Out-Null
                Write-Success "VITE_API_URL configurado"
                Start-Sleep -Seconds 1
            } finally {
                Remove-Item $tempFile -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Info "Não foi possível detectar URL automaticamente"
        Write-Info "Configure VITE_API_URL manualmente depois do deploy"
    }
    
    Write-Success "Variáveis de ambiente configuradas!"
}

# =============================================================================
# DEPLOY PRODUÇÃO
# =============================================================================

Write-Step "Executando deploy de PRODUÇÃO..."
Write-Info "Isso pode levar alguns minutos..."
Write-Info "Build e otimização em andamento..."

$prodOutput = vercel --prod --yes 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Deploy de produção falhou"
    Write-Info $prodOutput
    exit 1
}

# Extrair URL de produção
$prodUrl = $prodOutput | Select-String -Pattern "https://[^\s]+" | Select-Object -Last 1

Write-Success "`n=========================================="
Write-Success "DEPLOY CONCLUÍDO COM SUCESSO!"
Write-Success "=========================================="

if ($prodUrl) {
    $cleanUrl = $prodUrl.ToString().Trim()
    Write-Info "`nURLs do seu projeto:"
    Write-ColorOutput Green "  Site: $cleanUrl"
    Write-ColorOutput Green "  Admin Console: $cleanUrl/436F6E736F6C45"
    Write-Info "`nDashboard: https://vercel.com/dashboard"
}

Write-Info "`nPróximos passos:"
Write-Info "1. Acesse o site e teste as páginas"
Write-Info "2. Acesse o Admin Console e teste edições"
Write-Info "3. Verifique os logs no dashboard da Vercel"

Write-Success "`n[CONCLUÍDO] Deploy finalizado!"
