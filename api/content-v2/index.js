const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// Singleton LMDB
function getDB() {
  if (!global.__lmdbInstance) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    global.__lmdbInstance = open({ 
      path: dbPath, 
      compression: true,
      noSubdir: false,
      maxReaders: 126
    });
    log(`[LMDB] Initialized: ${dbPath}`);
  }
  return global.__lmdbInstance;
}

// ==================== CACHE GRANULAR ====================

// Load specific paths from cache
// Input: ["purificacao.header", "purificacao.intro.title"]
// Output: { "purificacao.header": "text", "purificacao.intro.title": "text" } OR null for misses
function loadPathsFromCache(paths) {
  try {
    const db = getDB();
    const results = {};
    const misses = [];
    
    for (const fullPath of paths) {
      const cached = db.get(fullPath);
      
      if (cached && (cached.invalidatedAt === null || cached.invalidatedAt === undefined)) {
        results[fullPath] = cached.data;
      } else {
        misses.push(fullPath);
      }
    }
    
    log(`[CACHE] Checked ${paths.length} paths: ${Object.keys(results).length} hits, ${misses.length} misses`);
    return { hits: results, misses };
  } catch (err) {
    log(`[CACHE] ERROR: ${err.message}`);
    return { hits: {}, misses: paths };
  }
}

// Load all paths for a page from cache
// Input: "purificacao"
// Output: { "purificacao.header": "text", "purificacao.intro.title": "text", ... }
function loadPageFromCache(pageId) {
  try {
    const db = getDB();
    const allKeys = Array.from(db.getKeys());
    const pagePrefix = `${pageId}.`;
    const pageKeys = allKeys.filter(key => typeof key === 'string' && key.startsWith(pagePrefix));
    
    if (pageKeys.length === 0) {
      log(`[CACHE] No entries for page: ${pageId}`);
      return null;
    }
    
    const results = {};
    for (const key of pageKeys) {
      const cached = db.get(key);
      if (cached && (cached.invalidatedAt === null || cached.invalidatedAt === undefined)) {
        results[key] = cached.data;
      }
    }
    
    if (Object.keys(results).length === 0) {
      log(`[CACHE] All entries invalidated for page: ${pageId}`);
      return null;
    }
    
    log(`[CACHE] Found ${Object.keys(results).length} valid entries for page: ${pageId}`);
    return results;
  } catch (err) {
    log(`[CACHE] ERROR: ${err.message}`);
    return null;
  }
}

// Save entries to cache (granular)
// Input: [{ json_key: "purificacao.header", content: { "pt-BR": "text" } }, ...]
async function saveToCache(entries) {
  try {
    const db = getDB();
    log(`[CACHE] Saving ${entries.length} entries to cache...`);
    
    for (const entry of entries) {
      const cacheKey = entry.json_key; // Already includes pageId
      const cacheEntry = {
        data: entry.content['pt-BR'],
        invalidatedAt: null
      };
      
      db.put(cacheKey, cacheEntry);
      log(`[CACHE] Saved key: ${cacheKey}`);
    }
    
    // Wait for flush to complete before continuing
    await db.flushed;
    log(`[CACHE] ✅ Successfully saved ${entries.length} entries to LMDB`);
    
    // Verify save
    const testKey = entries[0]?.json_key;
    if (testKey) {
      const verify = db.get(testKey);
      log(`[CACHE] Verification: key=${testKey} exists=${!!verify}`);
    }
  } catch (err) {
    log(`[CACHE] ❌ ERROR saving: ${err.message}`);
    log(`[CACHE] Stack: ${err.stack}`);
  }
}

// ==================== DATABASE ====================

// Load specific paths from DB
// Input: ["purificacao.header", "purificacao.intro.title"]
// Output: { "purificacao.header": "text", "purificacao.intro.title": "text" }
async function loadPathsFromDB(paths) {
  try {
    log(`[DB] Querying ${paths.length} paths`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .in('json_key', paths);
    
    if (error) {
      log(`[DB] ERROR: ${error.message}`);
      return {};
    }
    
    log(`[DB] Found ${entries.length} entries`);
    
    // Save to cache
    await saveToCache(entries);
    
    // Build results
    const results = {};
    for (const entry of entries) {
      results[entry.json_key] = entry.content['pt-BR'];
    }
    
    return results;
  } catch (err) {
    log(`[DB] ERROR: ${err.message}`);
    return {};
  }
}

// Load all entries for a page from DB
// Input: "purificacao"
// Output: { "purificacao.header": "text", "purificacao.intro.title": "text", ... }
async function loadPageFromDB(pageId) {
  try {
    log(`[DB] Querying all entries for page: ${pageId}`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', pageId);
    
    if (error) {
      log(`[DB] ERROR: ${error.message}`);
      return null;
    }
    
    log(`[DB] Found ${entries.length} entries for page: ${pageId}`);
    
    // Save to cache
    await saveToCache(entries);
    
    // Build results
    const results = {};
    for (const entry of entries) {
      results[entry.json_key] = entry.content['pt-BR'];
    }
    
    return results;
  } catch (err) {
    log(`[DB] ERROR: ${err.message}`);
    return null;
  }
}

// ==================== RECONSTRUCTION ====================

// Reconstruct nested object from flat entries
// Input: { "purificacao.header.title": "text", "purificacao.header.subtitle": "text2" }
// Output: { header: { title: "text", subtitle: "text2" } }
// Special case: __shared__ entries don't have pageId prefix (footer.* not __shared__.footer.*)
function reconstructObject(flatEntries, pageId) {
  const result = {};
  const prefix = `${pageId}.`;
  const isShared = pageId === '__shared__';
  
  // Sort by depth
  const sorted = Object.keys(flatEntries).sort((a, b) => {
    const depthA = a.split('.').length;
    const depthB = b.split('.').length;
    return depthA - depthB;
  });
  
  for (const fullKey of sorted) {
    // For __shared__, keys don't have prefix (footer.* not __shared__.footer.*)
    // For other pages: "purificacao.header.title" → "header.title"
    let path;
    if (isShared) {
      path = fullKey; // Use as-is for shared content
    } else {
      if (!fullKey.startsWith(prefix)) continue;
      path = fullKey.substring(prefix.length);
    }
    const parts = path.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        if (!current[arrayName]) current[arrayName] = [];
        if (!current[arrayName][index]) current[arrayName][index] = {};
        current = current[arrayName][index];
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
    
    const lastPart = parts[parts.length - 1];
    const arrayMatch = lastPart.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      if (!current[arrayName]) current[arrayName] = [];
      current[arrayName][index] = flatEntries[fullKey];
    } else {
      if (typeof current[lastPart] !== 'object' || current[lastPart] === null) {
        current[lastPart] = flatEntries[fullKey];
      }
    }
  }
  
  return result;
}

// ==================== HTTP HANDLER ====================

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const start = Date.now();
  
  try {
    const { pages: pagesParam, paths: pathsParam } = req.query;
    
    // MODE 1: Full pages (?pages=purificacao,testemunhos)
    if (pagesParam && !pathsParam) {
      const pageIds = pagesParam.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
      
      // Special case: __all__ returns only list of available pages
      if (pageIds.length === 1 && pageIds[0] === '__all__') {
        log(`[REQUEST] Fetching list of all available pages`);
        
        try {
          const { data, error } = await supabase
            .from('text_entries')
            .select('page_id');
          
          if (error) throw error;
          
          const uniquePages = [...new Set(data.map(row => row.page_id))].sort();
          
          log(`[RESPONSE] Found ${uniquePages.length} unique pages`);
          
          return res.status(200).json({
            success: true,
            availablePages: uniquePages
          });
        } catch (error) {
          log(`[ERROR] Failed to fetch pages: ${error.message}`);
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch available pages'
          });
        }
      }
      
      log(`[REQUEST] Pages: ${pageIds.join(',')}`);
      
      const results = {};
      const sources = {};
      
      // Load shared content first (footer, etc.)
      let sharedEntries = loadPageFromCache('__shared__');
      
      if (sharedEntries) {
        // Cache HIT: return and revalidate in background
        log(`[CACHE-HIT] __shared__ - returning cached data and revalidating in background`);
        results['__shared__'] = reconstructObject(sharedEntries, '__shared__');
        sources['__shared__'] = 'cache';
        
        // Trigger background revalidation
        fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/update-cache`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: '__shared__' })
        }).catch(err => log(`[BACKGROUND] Revalidation failed for __shared__: ${err.message}`));
        
      } else {
        // Cache MISS: load from DB
        log(`[CACHE-MISS] __shared__ - loading from DB`);
        sharedEntries = await loadPageFromDB('__shared__');
        
        if (sharedEntries && Object.keys(sharedEntries).length > 0) {
          results['__shared__'] = reconstructObject(sharedEntries, '__shared__');
          sources['__shared__'] = 'db';
          log(`[SHARED] Loaded ${Object.keys(sharedEntries).length} shared entries from DB`);
        }
      }
      
      for (const pageId of pageIds) {
        // Try cache first
        let flatEntries = loadPageFromCache(pageId);
        let source = 'cache';
        
        if (flatEntries) {
          // Cache HIT: return immediately and revalidate in background
          log(`[CACHE-HIT] ${pageId} - returning cached data and revalidating in background`);
          results[pageId] = reconstructObject(flatEntries, pageId);
          sources[pageId] = 'cache';
          
          // Trigger background revalidation (fire-and-forget)
          fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/update-cache`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageId })
          }).catch(err => log(`[BACKGROUND] Revalidation failed for ${pageId}: ${err.message}`));
          
        } else {
          // Cache MISS: load from DB and save to cache
          log(`[CACHE-MISS] ${pageId} - loading from DB`);
          flatEntries = await loadPageFromDB(pageId);
          source = 'db';
          
          if (flatEntries && Object.keys(flatEntries).length > 0) {
            results[pageId] = reconstructObject(flatEntries, pageId);
            sources[pageId] = source;
          } else {
            results[pageId] = null;
            sources[pageId] = 'not-found';
          }
        }
      }
      
      const duration = Date.now() - start;
      log(`[RESPONSE] Pages: ${pageIds.join(',')}, duration=${duration}ms`);
      
      return res.status(200).json({
        success: true,
        pages: results,
        sources
      });
    }
    
    // MODE 2: Specific paths (?paths=purificacao.header,purificacao.intro.title)
    if (pathsParam) {
      const paths = pathsParam.split(',').map(p => p.trim()).filter(Boolean);
      log(`[REQUEST] Paths: ${paths.length} items`);
      
      // Try cache first
      const { hits, misses } = loadPathsFromCache(paths);
      
      // Load misses from DB
      let dbResults = {};
      if (misses.length > 0) {
        dbResults = await loadPathsFromDB(misses);
      }
      
      // Combine results
      const results = { ...hits, ...dbResults };
      const sources = {};
      for (const path of paths) {
        if (hits[path] !== undefined) {
          sources[path] = 'cache';
        } else if (dbResults[path] !== undefined) {
          sources[path] = 'db';
        } else {
          sources[path] = 'not-found';
        }
      }
      
      const duration = Date.now() - start;
      const cacheHits = Object.keys(hits).length;
      log(`[RESPONSE] Paths: ${paths.length} total, ${cacheHits} cache, ${misses.length - cacheHits} db, duration=${duration}ms`);
      
      return res.status(200).json({
        success: true,
        data: results,
        sources
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: 'Missing pages or paths parameter. Use ?pages=purificacao OR ?paths=purificacao.header' 
    });
    
  } catch (err) {
    const duration = Date.now() - start;
    log(`[ERROR] ${err.message}, duration=${duration}ms`);
    return res.status(500).json({ success: false, message: err.message });
  }
};
