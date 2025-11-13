# ============================================
# MIGRACAO AUTOMATICA DE ESTILOS
# ============================================
# Este script captura estilos Tailwind e salva no DB
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MIGRACAO DE ESTILOS PARA BANCO DE DADOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar servidor
Write-Host "[1/4] Verificando servidor Vite..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "      OK - Servidor rodando`n" -ForegroundColor Green
} catch {
    Write-Host "      ERRO - Servidor nao esta rodando!" -ForegroundColor Red
    Write-Host "      Execute: .\start-dev.ps1`n" -ForegroundColor Yellow
    exit 1
}

# Informar usuario
Write-Host "[2/4] Preparando captura..." -ForegroundColor Yellow
Write-Host "      Vou abrir a pagina principal em seu navegador." -ForegroundColor White
Write-Host "      Voce precisara:" -ForegroundColor White
Write-Host "      1. Pressionar F12 (DevTools)" -ForegroundColor White
Write-Host "      2. Ir para aba Console" -ForegroundColor White
Write-Host "      3. Colar o codigo (Ctrl+V)" -ForegroundColor White
Write-Host "      4. Pressionar Enter`n" -ForegroundColor White

Write-Host "      Pressione ENTER para abrir o navegador..." -ForegroundColor Cyan
$null = Read-Host

# Copiar codigo de captura para clipboard
$captureCode = @'
(function() {
  const all = [];
  const props = ['fontSize','fontWeight','fontFamily','fontStyle','lineHeight','letterSpacing','textAlign','textTransform','textDecoration','textIndent','color','backgroundColor','margin','marginTop','marginRight','marginBottom','marginLeft','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','border','borderRadius','borderWidth','borderColor','display','width','height','maxWidth','maxHeight','flexDirection','alignItems','justifyContent','gap','rowGap','columnGap','gridTemplateColumns'];
  
  function cap(el, id, type) {
    const s = window.getComputedStyle(el);
    const styles = {};
    props.forEach(p => {
      const v = s[p];
      if(v && v!=='normal' && v!=='none' && v!=='auto' && v!=='0px' && v!=='rgba(0, 0, 0, 0)' && v!=='transparent') styles[p]=v;
    });
    if(Object.keys(styles).length>0) all.push({identifier:id,identifierType:type,tagName:el.tagName.toLowerCase(),styles});
  }
  
  document.querySelectorAll('[data-json-key]').forEach(e => cap(e, e.getAttribute('data-json-key'), 'json-key'));
  document.querySelectorAll('[data-section-id]').forEach(e => cap(e, e.getAttribute('data-section-id'), 'section-id'));
  document.querySelectorAll('[data-block-id]').forEach(e => cap(e, e.getAttribute('data-block-id'), 'block-id'));
  
  const txt = all.filter(s=>s.identifierType==='json-key').length;
  const sec = all.filter(s=>s.identifierType==='section-id').length;
  const blk = all.filter(s=>s.identifierType==='block-id').length;
  
  console.log(`CAPTURADO: ${all.length} elementos (Textos:${txt} Secoes:${sec} Blocos:${blk})`);
  console.log('JSON copiado para clipboard!');
  
  navigator.clipboard.writeText(JSON.stringify(all));
  return all;
})();
'@

Set-Clipboard -Value $captureCode
Write-Host "      Codigo copiado para clipboard!`n" -ForegroundColor Green

# Abrir navegador
Start-Process "http://localhost:8080"
Write-Host "      Navegador aberto!" -ForegroundColor Green
Write-Host "      Agora:" -ForegroundColor Yellow
Write-Host "      1. Pressione F12" -ForegroundColor White
Write-Host "      2. Va para aba Console" -ForegroundColor White
Write-Host "      3. Cole com Ctrl+V" -ForegroundColor White
Write-Host "      4. Pressione Enter`n" -ForegroundColor White

Write-Host "      Apos executar no console, pressione ENTER aqui..." -ForegroundColor Cyan
$null = Read-Host

# Ler JSON do clipboard
Write-Host "`n[3/4] Lendo JSON capturado..." -ForegroundColor Yellow
try {
    $jsonText = Get-Clipboard -Raw
    $capturedData = $jsonText | ConvertFrom-Json
    
    if (-not $capturedData -or $capturedData.Count -eq 0) {
        throw "JSON vazio ou invalido"
    }
    
    Write-Host "      OK - $($capturedData.Count) elementos capturados`n" -ForegroundColor Green
    
    # Salvar JSON temporario
    $jsonText | Out-File -FilePath "scripts\captured-styles.json" -Encoding UTF8
    Write-Host "      Salvo em: scripts\captured-styles.json`n" -ForegroundColor Green
    
} catch {
    Write-Host "      ERRO ao ler clipboard: $_" -ForegroundColor Red
    Write-Host "      Certifique-se que executou o codigo no console!`n" -ForegroundColor Yellow
    exit 1
}

# Popular banco de dados
Write-Host "[4/4] Populando banco de dados..." -ForegroundColor Yellow
node scripts/populate-all-styles.js

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MIGRACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Proximo passo:" -ForegroundColor Yellow
Write-Host "  Descomentar reset CSS em src/index.css`n" -ForegroundColor White
