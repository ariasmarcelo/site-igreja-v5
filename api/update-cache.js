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

function getDB() {
  if (!global.__lmdbInstance) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    global.__lmdbInstance = open({ 
      path: dbPath, 
      compression: true,
      noSubdir: false,
      maxReaders: 126
    });
    log(`LMDB initialized: ${dbPath}`);
  }
  return global.__lmdbInstance;
}

async function updateCacheFromDB(pageId) {
  try {
    log(`Updating cache for page: ${pageId}`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', pageId);
    
    if (error) {
      log(`DB error: ${error.message}`);
      return { success: false, error: error.message };
    }
    
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
    log(`✅ Cache updated: ${pageId} (${entries.length} entries)`);
    
    return { success: true, entries: entries.length };
  } catch (err) {
    log(`ERROR: ${err.message}`);
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
      return res.status(400).json({ success: false, message: 'Missing pageId' });
    }
    
    // Retorna OK imediatamente
    res.status(200).json({ success: true, message: `Cache update started for ${pageId}` });
    
    // Continua trabalhando em background
    updateCacheFromDB(pageId).then(result => {
      log(`Background update completed: ${JSON.stringify(result)}`);
    });
    
  } catch (err) {
    log(`ERROR: ${err.message}`);
    return res.status(500).json({ success: false, message: err.message });
  }
};
