# Script para sincronizar Artigos.json com o banco de dados
$apiUrl = "http://localhost:3001/api/save-json"
$jsonPath = Join-Path $PSScriptRoot "..\src\locales\pt-BR\Artigos.json"

Write-Host "`nSincronizando Artigos.json..." -ForegroundColor Cyan

# Ler JSON
$content = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host "Enviando para banco de dados..." -ForegroundColor Cyan

# Preparar body
$body = @{
    pageId = "artigos"
    content = $content
} | ConvertTo-Json -Depth 10

# Enviar
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json; charset=utf-8"
    
    if ($response.success) {
        Write-Host "OK - Artigos sincronizados!" -ForegroundColor Green
        Write-Host "   Esoterica: $($content.articles.esoterica.Count)" -ForegroundColor Gray
        Write-Host "   Cientifica: $($content.articles.cientifica.Count)" -ForegroundColor Gray
        Write-Host "   Unificada: $($content.articles.unificada.Count)" -ForegroundColor Gray
    } else {
        Write-Host "ERRO: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO ao conectar:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

