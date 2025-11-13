/**
 * POPULATE ALL STYLES - Script Node.js
 * 
 * Popula o banco de dados com estilos capturados de TODOS os elementos:
 * - Textos (json-key)
 * - Seções (section-id)
 * - Blocos (block-id)
 * 
 * Uso:
 * 1. Execute capture-all-styles.js no navegador
 * 2. Copie o JSON gerado
 * 3. Cole no array capturedStyles abaixo
 * 4. Execute: node scripts/populate-all-styles.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('   Certifique-se que .env.local existe com:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// CARREGA AUTOMATICAMENTE DO ARQUIVO JSON
// ============================================
let capturedStyles = [];

try {
  const jsonPath = join(__dirname, 'captured-styles.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  capturedStyles = JSON.parse(jsonContent);
  console.log(`✅ JSON carregado de: ${jsonPath}\n`);
} catch (error) {
  console.error('❌ Erro ao carregar captured-styles.json');
  console.error('   Execute primeiro: .\auto-capture-styles.ps1');
  console.error('   Ou: node scripts/auto-capture-runner.js\n');
}

// ============================================
// Função principal
// ============================================
async function populateAllStyles() {
  console.log('🚀 POPULAÇÃO DE ESTILOS NO BANCO DE DADOS');
  console.log('==========================================\n');
  
  if (capturedStyles.length === 0) {
    console.log('⚠️  Nenhum estilo para processar!');
    console.log('\n📋 INSTRUÇÕES:');
    console.log('   1. Abra o navegador em http://localhost:8080');
    console.log('   2. Pressione F12 (DevTools) → aba Console');
    console.log('   3. Abra scripts/capture-all-styles.js');
    console.log('   4. Copie TODO o conteúdo do arquivo');
    console.log('   5. Cole no Console e pressione Enter');
    console.log('   6. Copie o JSON gerado');
    console.log('   7. Cole no array capturedStyles deste arquivo');
    console.log('   8. Execute: node scripts/populate-all-styles.js\n');
    process.exit(0);
  }
  
  const pageId = 'index'; // Ajuste se necessário para outras páginas
  
  let successCount = 0;
  let errorCount = 0;
  const stats = {
    'json-key': 0,
    'section-id': 0,
    'block-id': 0
  };
  
  console.log(`📊 Total de elementos: ${capturedStyles.length}`);
  console.log(`📄 Página: ${pageId}\n`);
  
  for (const item of capturedStyles) {
    const { identifier, identifierType, styles } = item;
    
    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('style_entries')
        .select('*')
        .eq('page_id', pageId)
        .eq('json_key', identifier)
        .single();
      
      if (existing) {
        // Atualizar estilo existente
        const { error } = await supabase
          .from('style_entries')
          .update({
            css_properties: styles,
            updated_at: new Date().toISOString()
          })
          .eq('page_id', pageId)
          .eq('json_key', identifier);
        
        if (error) throw error;
        console.log(`✅ Atualizado [${identifierType.padEnd(10)}]: ${identifier}`);
      } else {
        // Inserir novo estilo
        const { error } = await supabase
          .from('style_entries')
          .insert({
            page_id: pageId,
            json_key: identifier,
            css_properties: styles,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        console.log(`✅ Inserido [${identifierType.padEnd(10)}]: ${identifier}`);
      }
      
      successCount++;
      stats[identifierType]++;
      
    } catch (error) {
      console.error(`❌ Erro [${identifierType}] ${identifier}: ${error.message}`);
      errorCount++;
    }
  }
  
  // Resumo final
  console.log('\n==========================================');
  console.log('📊 RESUMO FINAL');
  console.log('==========================================');
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`   • Textos (json-key): ${stats['json-key']}`);
  console.log(`   • Seções (section-id): ${stats['section-id']}`);
  console.log(`   • Blocos (block-id): ${stats['block-id']}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📋 Total: ${capturedStyles.length}`);
  console.log('==========================================\n');
  
  if (errorCount === 0) {
    console.log('🎉 Migração concluída com sucesso!');
    console.log('\n📌 PRÓXIMO PASSO:');
    console.log('   Descomente o reset CSS em src/index.css');
    console.log('   (linhas com *[data-json-key], *[data-section-id], *[data-block-id])');
  } else {
    console.log('⚠️  Alguns erros ocorreram. Verifique os logs acima.');
  }
}

// Executar
populateAllStyles().catch(error => {
  console.error('\n❌ ERRO FATAL:', error);
  process.exit(1);
});
