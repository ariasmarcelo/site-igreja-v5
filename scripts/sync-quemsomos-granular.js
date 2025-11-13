import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Converte objeto aninhado em entries granulares
 * Ex: { magia: { introducao: ["texto1", "texto2"] } } 
 * → [{ json_key: "quemsomos.magia.introducao[0]", text_value: "texto1" }, ...]
 */
function flattenObject(obj, prefix = '', pageId = 'quemsomos') {
  const entries = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : `${pageId}.${key}`;
    
    if (Array.isArray(value)) {
      // Array de strings
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          entries.push({
            page_id: pageId,
            json_key: `${fullKey}[${index}]`,
            content: item
          });
        } else if (typeof item === 'object' && item !== null) {
          // Array de objetos (ex: caracteristicas.items)
          entries.push(...flattenObject(item, `${fullKey}[${index}]`, pageId));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      // Objeto aninhado
      entries.push(...flattenObject(value, fullKey, pageId));
    } else if (typeof value === 'string') {
      // String simples
      entries.push({
        page_id: pageId,
        json_key: fullKey,
        content: value
      });
    }
  }
  
  return entries;
}

async function syncQuemSomosGranular() {
  try {
    console.log('🔄 Sincronizando QuemSomos com tabela granular (text_entries)...\n');
    
    // Ler JSON local
    const jsonPath = path.join(__dirname, '..', 'src', 'locales', 'pt-BR', 'QuemSomos.json');
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log('📖 JSON carregado:', Object.keys(jsonContent));
    console.log('📝 magia.introducao:', jsonContent.magia.introducao?.length, 'parágrafos');
    console.log('📝 magia.caracteristicas.items:', jsonContent.magia.caracteristicas?.items?.length, 'itens\n');
    
    // Converter para entries granulares
    const entries = flattenObject(jsonContent);
    
    console.log(`🔢 Total de entries gerados: ${entries.length}\n`);
    
    // Mostrar alguns exemplos de entries de magia
    console.log('📋 Exemplos de entries da seção Magia Divina:');
    const magiaEntries = entries.filter(e => e.json_key.includes('.magia.'));
    magiaEntries.slice(0, 5).forEach(e => {
      console.log(`   ${e.json_key}: ${e.content.substring(0, 50)}...`);
    });
    console.log(`   ... e mais ${magiaEntries.length - 5} entries\n`);
    
    // Deletar entries antigos da página quemsomos
    console.log('🗑️  Deletando entries antigos...');
    const { error: deleteError } = await supabase
      .from('text_entries')
      .delete()
      .eq('page_id', 'quemsomos');
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError);
      return;
    }
    
    console.log('✅ Entries antigos deletados\n');
    
    // Inserir novos entries em lotes de 100
    console.log('💾 Inserindo novos entries...');
    const batchSize = 100;
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('text_entries')
        .insert(batch);
      
      if (insertError) {
        console.error(`❌ Erro no lote ${Math.floor(i/batchSize) + 1}:`, insertError);
        return;
      }
      
      console.log(`   ✓ Lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(entries.length/batchSize)} inserido (${batch.length} entries)`);
    }
    
    console.log('\n✅ Sincronização completa!');
    
    // Verificar o que foi salvo
    console.log('\n🔍 Verificação:');
    const { data: checkData, error: checkError } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', 'quemsomos')
      .like('json_key', '%magia.introducao%')
      .order('json_key');
    
    if (checkData) {
      console.log(`   magia.introducao: ${checkData.length} entries encontrados`);
      checkData.slice(0, 2).forEach(e => {
        console.log(`   - ${e.json_key}: ${e.content.substring(0, 60)}...`);
      });
    }
    
    const { data: checkCarac } = await supabase
      .from('text_entries')
      .select('json_key')
      .eq('page_id', 'quemsomos')
      .like('json_key', '%magia.caracteristicas.items%');
    
    if (checkCarac) {
      console.log(`   magia.caracteristicas: ${checkCarac.length} entries encontrados`);
    }
    
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

syncQuemSomosGranular();
