require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
const db = open({ 
  path: dbPath, 
  compression: true,
  noSubdir: false,
  maxReaders: 126
});

console.log('🔄 Populando cache LMDB...\n');
console.log('📁 Cache path:', dbPath, '\n');

async function populateCache() {
  // Buscar todos os page_ids
  const { data: allData } = await supabase
    .from('text_entries')
    .select('page_id')
    .neq('page_id', null);
  
  const pageIds = [...new Set(allData.map(d => d.page_id))];
  
  console.log(`📋 Encontradas ${pageIds.length} páginas: ${pageIds.join(', ')}\n`);
  
  let totalSaved = 0;
  
  for (const pageId of pageIds) {
    console.log(`\n📄 Processando: ${pageId}`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', pageId);
    
    if (error) {
      console.log(`  ❌ Erro: ${error.message}`);
      continue;
    }
    
    console.log(`  📥 ${entries.length} entradas encontradas`);
    
    for (const entry of entries) {
      const cacheKey = entry.json_key;
      const cacheEntry = {
        data: entry.content['pt-BR'],
        invalidatedAt: null
      };
      
      db.put(cacheKey, cacheEntry);
      totalSaved++;
    }
    
    await db.flushed;
    console.log(`  ✅ ${entries.length} entradas salvas no cache`);
  }
  
  console.log(`\n🎉 Cache populado com sucesso!`);
  console.log(`📊 Total: ${totalSaved} entradas`);
  
  db.close();
}

populateCache().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
