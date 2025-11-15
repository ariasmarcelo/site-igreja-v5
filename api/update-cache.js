// API para atualizar cache em background
const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  console.log(`[${new Date().toISOString()}] [CACHE-UPDATE] ${msg}`);
}

// Singleton DB instance
function getDB() {
  if (!global.__lmdbCache) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    global.__lmdbCache = open({ 
      path: dbPath, 
      compression: true,
      noSubdir: false,
      maxReaders: 126
    });
    log(`✅ LMDB cache initialized: ${dbPath}`);
  }
  return global.__lmdbCache;
}

// Update cache for a single page from database
async function updateSinglePageCache(pageId) {
  const startTime = Date.now();
  
  try {
    log(`\n[BACKGROUND-UPDATE] ━━━ START updating cache for: ${pageId} ━━━`);
    log(`[BACKGROUND-UPDATE] 🗄️  Fetching from DB...`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', pageId);
    
    if (error) {
      log(`[BACKGROUND-UPDATE] ❌ DB error: ${error.message} (${Date.now() - startTime}ms)`);
      return { success: false, error: error.message };
    }
    
    log(`[BACKGROUND-UPDATE] ✅ Fetched ${entries.length} entries from DB (${Date.now() - startTime}ms)`);
    log(`[BACKGROUND-UPDATE] 💾 Writing to cache...`);
    
    const db = getDB();
    
    for (const entry of entries) {
      const cacheKey = entry.json_key;
      const cacheEntry = {
        data: entry.content['pt-BR'],
        invalidatedAt: null
      };
      db.put(cacheKey, cacheEntry);
    }
    
    await db.flushed;
    log(`[BACKGROUND-UPDATE] ✅ Cache updated: ${pageId} (${entries.length} entries, ${Date.now() - startTime}ms)`);
    log(`[BACKGROUND-UPDATE] ━━━ COMPLETE ━━━\n`);
    
    return { success: true, entries: entries.length };
  } catch (err) {
    log(`[BACKGROUND-UPDATE] ❌ ERROR: ${err.message} (${Date.now() - startTime}ms)`);
    return { success: false, error: err.message };
  }
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const { pageId } = req.body;
    
    if (!pageId) {
      log(`[UPDATE-CACHE-API] ❌ Missing pageId in request`);
      return res.status(400).json({ success: false, message: 'Missing pageId' });
    }
    
    log(`[UPDATE-CACHE-API] 🚀 Received request for pageId: ${pageId}`);
    log(`[UPDATE-CACHE-API] ⚡ Returning immediate OK to client...`);
    
    // Retorna OK imediatamente
    res.status(200).json({ success: true, message: `Cache update started for ${pageId}` });
    
    // Continua trabalhando em background
    log(`[UPDATE-CACHE-API] 🔄 Starting background update...`);
    // Background update
    updateSinglePageCache(pageId).then(result => {
      log(`[UPDATE-CACHE-API] 🎉 Background update completed: ${JSON.stringify(result)}`);
    }).catch(err => {
      log(`[UPDATE-CACHE-API] ❌ Background update failed: ${err.message}`);
    });
    
  } catch (err) {
    log(`[UPDATE-CACHE-API] ❌ ERROR: ${err.message}`);
    return res.status(500).json({ success: false, message: err.message });
  }
};
