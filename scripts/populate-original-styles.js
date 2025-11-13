/**
 * Script para popular o banco de dados com estilos originais capturados
 * 
 * Uso:
 * 1. Execute capture-original-styles.js no navegador
 * 2. Copie o JSON gerado
 * 3. Cole no array capturedStyles abaixo
 * 4. Execute: node scripts/populate-original-styles.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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

// COLE AQUI o JSON capturado do navegador
const capturedStyles = [];

// Função para converter camelCase para kebab-case
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// Função para processar e inserir estilos
async function populateStyles() {
  console.log('🚀 Iniciando população de estilos...\n');
  
  const pageId = 'index'; // Pode ser parametrizado depois
  let successCount = 0;
  let errorCount = 0;
  
  for (const item of capturedStyles) {
    const { jsonKey, styles } = item;
    
    // Converter estilos de camelCase para camelCase (manter como está no DB)
    const cssProperties = {};
    Object.entries(styles).forEach(([key, value]) => {
      cssProperties[key] = value;
    });
    
    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('style_entries')
        .select('*')
        .eq('page_id', pageId)
        .eq('json_key', jsonKey)
        .single();
      
      if (existing) {
        // Atualizar
        const { error } = await supabase
          .from('style_entries')
          .update({
            css_properties: cssProperties,
            updated_at: new Date().toISOString()
          })
          .eq('page_id', pageId)
          .eq('json_key', jsonKey);
        
        if (error) throw error;
        console.log(`✅ Atualizado: ${jsonKey}`);
      } else {
        // Inserir novo
        const { error } = await supabase
          .from('style_entries')
          .insert({
            page_id: pageId,
            json_key: jsonKey,
            css_properties: cssProperties,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        console.log(`✅ Inserido: ${jsonKey}`);
      }
      
      successCount++;
    } catch (error) {
      console.error(`❌ Erro em ${jsonKey}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Resumo:');
  console.log(`   ✅ Sucesso: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📝 Total: ${capturedStyles.length}`);
}

// Executar
if (capturedStyles.length === 0) {
  console.log('⚠️  Nenhum estilo para processar!');
  console.log('   1. Execute capture-original-styles.js no navegador');
  console.log('   2. Copie o JSON gerado');
  console.log('   3. Cole no array capturedStyles neste arquivo');
  process.exit(0);
}

populateStyles().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
