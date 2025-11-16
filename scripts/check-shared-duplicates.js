/**
 * Script para verificar duplicações de conteúdo __shared__
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  console.log('\n🔍 VERIFICANDO CONTEÚDO __shared__ NO BANCO\n');
  console.log('═'.repeat(80));
  
  // Buscar todas as entradas __shared__
  const { data: sharedEntries, error } = await supabase
    .from('text_entries')
    .select('id, page_id, json_key, content, created_at, updated_at')
    .eq('page_id', '__shared__')
    .order('json_key');

  if (error) {
    console.error('❌ Erro ao buscar dados:', error.message);
    return;
  }

  console.log(`\n📊 Total de entradas __shared__: ${sharedEntries.length}\n`);

  if (sharedEntries.length === 0) {
    console.log('⚠️  Nenhuma entrada __shared__ encontrada no banco!\n');
    return;
  }

  // Agrupar por json_key para detectar duplicatas
  const grouped = {};
  sharedEntries.forEach(entry => {
    if (!grouped[entry.json_key]) {
      grouped[entry.json_key] = [];
    }
    grouped[entry.json_key].push(entry);
  });

  // Mostrar resultados
  const duplicates = [];
  
  Object.entries(grouped).forEach(([jsonKey, entries]) => {
    if (entries.length > 1) {
      duplicates.push({ jsonKey, entries });
      console.log(`❌ DUPLICADO: "${jsonKey}" (${entries.length} entradas)`);
      entries.forEach((entry, i) => {
        console.log(`   [${i + 1}] ID: ${entry.id.substring(0, 8)}...`);
        console.log(`       content: "${(entry.content['pt-BR'] || '').substring(0, 60)}..."`);
        console.log(`       updated_at: ${entry.updated_at}`);
      });
      console.log('');
    } else {
      console.log(`✅ "${jsonKey}"`);
      console.log(`   content: "${(entries[0].content['pt-BR'] || '').substring(0, 60)}..."`);
      console.log('');
    }
  });

  console.log('═'.repeat(80));
  
  if (duplicates.length > 0) {
    console.log(`\n⚠️  ENCONTRADAS ${duplicates.length} CHAVES DUPLICADAS!\n`);
    console.log('🔧 Para corrigir, execute:');
    console.log('   node scripts/fix-shared-duplicates.js\n');
  } else {
    console.log('\n✅ Nenhuma duplicação encontrada!\n');
  }

  // Verificar também se há entradas com prefixo __shared__. na json_key
  const { data: wrongPrefix, error: error2 } = await supabase
    .from('text_entries')
    .select('id, page_id, json_key')
    .like('json_key', '__shared__%');

  if (!error2 && wrongPrefix && wrongPrefix.length > 0) {
    console.log('⚠️  PROBLEMA: Encontradas entradas com prefixo __shared__. na json_key:');
    wrongPrefix.forEach(entry => {
      console.log(`   page_id="${entry.page_id}" json_key="${entry.json_key}"`);
    });
    console.log('\n   Essas entradas estão incorretas! json_key não deve ter __shared__.');
    console.log('   O correto é: page_id="__shared__" json_key="footer.copyright"\n');
  }
}

checkDuplicates();
