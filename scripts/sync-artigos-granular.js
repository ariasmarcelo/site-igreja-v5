/**
 * Script para sincronizar artigos do Artigos.json para o Supabase
 * usando a estrutura granular de text_entries
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar Supabase
const supabaseUrl = 'https://cgtscngqrgyfspfvzbkc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndHNjbmdxcmd5ZnNwZnZ6YmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NzE2MDEsImV4cCI6MjA0NjE0NzYwMX0.SZqzstanovnika1R5hxLQxTGu0K8nqPt3PdWRvQW_KmGY2h8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncArticles() {
  try {
    console.log('🚀 Iniciando sincronização de artigos para Supabase...\n');

    // Carregar dados do JSON
    const jsonPath = join(__dirname, '..', 'src', 'locales', 'pt-BR', 'Artigos.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    if (!jsonData.articles) {
      console.error('❌ Estrutura "articles" não encontrada no JSON');
      return;
    }

    console.log('📦 Sincronizando estrutura completa de artigos...\n');

    // 1. Primeiro, deletar entrada antiga de articles se existir
    await supabase
      .from('text_entries')
      .delete()
      .eq('page_id', 'artigos')
      .eq('key', 'articles');

    // 2. Inserir nova entrada com todos os artigos
    const { error: insertError } = await supabase
      .from('text_entries')
      .insert({
        page_id: 'artigos',
        key: 'articles',
        value: jsonData.articles,
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('❌ Erro ao inserir artigos:', insertError.message);
      return;
    }

    console.log('✅ Artigos sincronizados com sucesso!');
    
    // Contar artigos
    const totalArticles = 
      (jsonData.articles.esoterica?.length || 0) +
      (jsonData.articles.cientifica?.length || 0) +
      (jsonData.articles.unificada?.length || 0);

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA SINCRONIZAÇÃO');
    console.log('='.repeat(60));
    console.log(`✨ Total de artigos: ${totalArticles}`);
    console.log(`   - Esotérica: ${jsonData.articles.esoterica?.length || 0}`);
    console.log(`   - Científica: ${jsonData.articles.cientifica?.length || 0}`);
    console.log(`   - Unificada: ${jsonData.articles.unificada?.length || 0}`);
    console.log('='.repeat(60) + '\n');

    console.log('🎉 Sincronização concluída com sucesso!\n');

  } catch (error) {
    console.error('💥 Erro fatal durante sincronização:', error);
    process.exit(1);
  }
}

// Executar
syncArticles();
