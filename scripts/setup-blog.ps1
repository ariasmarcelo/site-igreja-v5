# Script para criar tabela blog_posts e inserir dados de exemplo
# Execute no PowerShell

Write-Host "🗄️  Criando sistema de blog no Supabase..." -ForegroundColor Cyan
Write-Host ""

$scriptDir = $PSScriptRoot
$createTable = Get-Content "$scriptDir\..\supabase\migrations\20251115_create_blog_posts.sql" -Raw
$insertData = Get-Content "$scriptDir\..\supabase\migrations\20251115_insert_blog_posts_samples.sql" -Raw

Write-Host "📋 SQL carregado. Cole no Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host $createTable -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Pressione ENTER para ver os dados de exemplo..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host $insertData -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""

Write-Host "✅ Após executar no Supabase:" -ForegroundColor Green
Write-Host "   1. Acesse http://localhost:3000/admin" -ForegroundColor White
Write-Host "   2. Clique na aba 'Blog'" -ForegroundColor White
Write-Host "   3. Você verá 4 artigos publicados + 1 rascunho" -ForegroundColor White
Write-Host ""
