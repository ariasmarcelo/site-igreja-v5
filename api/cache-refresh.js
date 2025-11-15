// Vercel Serverless Function - Cache Refresh
// Limpa e pré-aquece o cache LMDB com todos os dados do Supabase
// USO INTERNO: Chamado por save-visual-edits após atualização do DB
const { createClient } = require('@supabase/supabase-js');
const { acquire, release, getStats } = require('./lib/lmdb-pool');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  console.log(`[${new Date().toISOString()}] [CACHE-REFRESH] ${msg}`);
}

// Reconstruir objeto a partir das entradas do DB
function reconstructObjectFromEntries(entries, pageId) {
  const pageContent = {};
  
  entries.forEach(entry => {
    const jsonKey = entry.json_key;
    const content = entry.content['pt-BR'] || '';
    
    // Remove prefixo do pageId se existir
    const keys = jsonKey.startsWith(pageId + '.') 
      ? jsonKey.split('.').slice(1)
      : jsonKey.split('.');
    
    if (keys.length === 0) return;
    
    let current = pageContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      // Detectar array: "items[0]"
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2]);
        
        if (!current[arrayName]) current[arrayName] = [];
        if (!current[arrayName][arrayIndex]) current[arrayName][arrayIndex] = {};
        
        current = current[arrayName][arrayIndex];
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
    
    // Última chave
    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2]);
      
      if (!current[arrayName]) current[arrayName] = [];
      current[arrayName][arrayIndex] = content;
    } else {
      current[lastKey] = content;
    }
  });
  
  return pageContent;
}

// Buscar todos os page_ids únicos do banco
async function getAllPageIds() {
  try {
    const { data, error } = await supabase
      .from('text_entries')
      .select('page_id');
    
    if (error) throw error;
    
    // Retornar lista única de page_ids
    const uniquePageIds = [...new Set(data.map(entry => entry.page_id))];
    return uniquePageIds;
  } catch (error) {
    log(`Error fetching page_ids: ${error.message}`);
    throw error;
  }
}

// Carregar dados de uma página específica do banco
async function loadPageDataFromDB(pageId) {
  try {
    log(`Loading data for pageId: ${pageId}`);
    
    // Buscar entradas da página + compartilhadas
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content, page_id')
      .in('page_id', [pageId, '__shared__']);
    
    if (error) throw error;
    
    log(`Found ${entries.length} entries for pageId: ${pageId}`);
    
    // Reconstruir objeto completo
    const pageContent = reconstructObjectFromEntries(entries, pageId);
    
    return pageContent;
  } catch (error) {
    log(`Error loading page data: ${error.message}`);
    throw error;
  }
}

// Salvar no cache LMDB
async function saveToCache(pageId, content) {
  let connection = null;
  
  try {
    connection = await acquire();
    const db = connection.db;
    const cacheEntry = {
      data: content,
      invalidatedAt: null
    };
    
    log(`Caching pageId: ${pageId}, size: ${JSON.stringify(content).length}b`);
    db.put(pageId, cacheEntry);
    
    return true;
  } catch (error) {
    log(`Error saving to cache: ${error.message}`);
    return false;
  } finally {
    if (connection) {
      release(connection.releaseToken);
    }
  }
}

// Limpar todo o cache
async function clearAllCache() {
  let connection = null;
  
  try {
    connection = await acquire();
    const db = connection.db;
    const allKeys = Array.from(db.getKeys());
    
    log(`🗑️ Clearing cache: ${allKeys.length} entries`);
    
    for (const key of allKeys) {
      db.remove(key);
    }
    
    log(`✅ Cache cleared: ${allKeys.length} entries removed`);
    return allKeys.length;
  } catch (error) {
    log(`⚠️ Error clearing cache: ${error.message}`);
    throw error;
  } finally {
    if (connection) {
      release(connection.releaseToken);
    }
  }
}

// Pré-aquecer cache completo (após limpeza)
async function warmupAllCache() {
  try {
    log(`🔥 Starting cache warm-up...`);
    
    // 1. Buscar todos os page_ids
    const pageIds = await getAllPageIds();
    log(`Found ${pageIds.length} unique page_ids: ${pageIds.join(', ')}`);
    
    // 2. Para cada página, carregar dados do DB e salvar no cache
    const results = [];
    
    for (const pageId of pageIds) {
      try {
        const pageData = await loadPageDataFromDB(pageId);
        const saved = await saveToCache(pageId, pageData);
        
        results.push({
          pageId,
          success: saved,
          keysCount: Object.keys(pageData).length
        });
        
        log(`✅ Cached ${pageId}: ${Object.keys(pageData).length} keys`);
      } catch (error) {
        log(`❌ Failed to cache ${pageId}: ${error.message}`);
        results.push({
          pageId,
          success: false,
          error: error.message
        });
      }
    }
    
    log(`🎉 Cache warm-up complete! Cached ${results.filter(r => r.success).length}/${pageIds.length} pages`);
    
    return results;
  } catch (error) {
    log(`💥 Cache warm-up failed: ${error.message}`);
    throw error;
  }
}

// FUNÇÃO PRINCIPAL: Limpar e pré-aquecer cache (operação completa)
async function refreshCache() {
  try {
    log(`🔄 Starting full cache refresh...`);
    
    // 1. Limpar cache existente
    const clearedCount = await clearAllCache();
    
    // 2. Pré-aquecer com dados frescos do DB
    const warmupResults = await warmupAllCache();
    
    const successCount = warmupResults.filter(r => r.success).length;
    
    log(`✨ Cache refresh complete! Cleared: ${clearedCount}, Cached: ${successCount}/${warmupResults.length}`);
    
    return {
      success: true,
      cleared: clearedCount,
      cached: successCount,
      total: warmupResults.length,
      details: warmupResults
    };
  } catch (error) {
    log(`💥 Cache refresh failed: ${error.message}`);
    throw error;
  }
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST or GET.' 
    });
  }

  try {
    log(`Cache refresh requested (Method: ${req.method})`);
    
    // Executar operação completa: limpar + pré-aquecer
    const result = await refreshCache();
    
    res.status(200).json({
      success: true,
      message: `Cache refreshed successfully`,
      stats: {
        cleared: result.cleared,
        cached: result.cached,
        total: result.total,
        failed: result.total - result.cached
      },
      details: result.details
    });
  } catch (error) {
    log(`Error during cache refresh: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: `Cache refresh failed: ${error.message}`,
      error: error.stack
    });
  }
};

// Exportar também a função para uso interno (chamada por outras APIs)
module.exports.refreshCache = refreshCache;
