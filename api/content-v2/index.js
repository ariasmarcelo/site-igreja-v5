const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

// Singleton DB instance - LMDB handles multi-process access natively
function getDB() {
  if (!global.__lmdbCache) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    global.__lmdbCache = open({ 
      path: dbPath, 
      compression: true,
      noSubdir: false,
      maxReaders: 126
    });
    // log(`[LMDB] ✅ Global cache initialized: ${dbPath}`);
  }
  return global.__lmdbCache;
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
    
    // log(`[CACHE] Checked ${paths.length} paths: ${Object.keys(results).length} hits, ${misses.length} misses`);
    return { hits: results, misses };
  } catch (err) {
    log(`[CACHE] ERROR: ${err.message}`);
    return { hits: {}, misses: paths };
  }
}

// Load all paths for a page from cache
// Input: "purificacao"
// PRIVATE: Save flat object to cache
// Input: {"purificacao.header": "text", "purificacao.intro.title": "text", ...}
async function _saveFlatObjectToCache(entries) {
  const startTime = Date.now();
  
  try {
    // log(`[CACHE-WRITE] 💾 START saving ${Object.keys(entries).length} flat entries to cache`);
    
    const db = getDB();
    
    for (const [fullKey, content] of Object.entries(entries)) {
      db.put(fullKey, {
        data: content,
        cachedAt: Date.now(),
        invalidatedAt: null
      });
    }
    
    // log(`[CACHE-WRITE] ✅ SUCCESS - Saved ${Object.keys(entries).length} entries (${Date.now() - startTime}ms)`);
  } catch (err) {
    log(`[CACHE-WRITE] ❌ ERROR: ${err.message} (${Date.now() - startTime}ms)`);
  }
}

async function loadPageFromCache(pageId) {
  const startTime = Date.now();
  
  try {
    // log(`[CACHE-READ] 🔍 START loading from cache: pageId=${pageId}`);
    
    const db = getDB();
    const allKeys = Array.from(db.getKeys());
    
    // All entries now have consistent prefixes including __shared__
    const pagePrefix = `${pageId}.`;
    const pageKeys = allKeys.filter(key => typeof key === 'string' && key.startsWith(pagePrefix));
    
    if (pageKeys.length === 0) {
      // log(`[CACHE-READ] ❌ MISS - No entries for page: ${pageId} (${Date.now() - startTime}ms)`);
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
      // log(`[CACHE-READ] ❌ MISS - All entries invalidated for page: ${pageId} (${Date.now() - startTime}ms)`);
      return null;
    }
    
    // log(`[CACHE-READ] ✅ HIT - Found ${Object.keys(results).length} valid entries for page: ${pageId} (${Date.now() - startTime}ms)`);
    return results;
  } catch (err) {
    log(`[CACHE-READ] ❌ ERROR: ${err.message} (${Date.now() - startTime}ms)`);
    return null;
  }
}

// PRIVATE: Save Supabase entries to cache (converts format)
// Input: [{ json_key: "purificacao.header", content: { "pt-BR": "text" } }, ...]
// For __shared__: receives "footer.trademark", saves as "__shared__.footer.trademark"
async function _saveSupabaseEntriesToCache(entries, pageId) {
  const startTime = Date.now();
  
  try {
    // log(`[CACHE-WRITE] 💾 START saving ${entries.length} DB entries to cache...`);
    
    const db = getDB();
    
    for (const entry of entries) {
      // For __shared__, add pageId prefix (footer.* → __shared__.footer.*)
      const isShared = pageId === '__shared__';
      const cacheKey = isShared && !entry.json_key.startsWith('__shared__.')
        ? `__shared__.${entry.json_key}`
        : entry.json_key;
      
      const cacheEntry = {
        data: entry.content['pt-BR'],
        invalidatedAt: null
      };
      
      db.put(cacheKey, cacheEntry);
    }
    
    // Wait for flush to complete before continuing
    await db.flushed;
    // log(`[CACHE-WRITE] ✅ Successfully saved ${entries.length} entries to LMDB (${Date.now() - startTime}ms)`);
    
    // Verify save
    // if (entries[0]) {
    //   const isShared = pageId === '__shared__';
    //   const testKey = isShared && !entries[0].json_key.startsWith('__shared__.')
    //     ? `__shared__.${entries[0].json_key}`
    //     : entries[0].json_key;
    //   const verify = db.get(testKey);
    //   log(`[CACHE-WRITE] 🔍 Verification: key=${testKey} exists=${!!verify}`);
    // }
  } catch (err) {
    log(`[CACHE-WRITE] ❌ ERROR saving: ${err.message} (${Date.now() - startTime}ms)`);
    log(`[CACHE-WRITE] Stack: ${err.stack}`);
  }
}

// ==================== DATABASE ====================

// Load specific paths from DB
// Input: ["purificacao.header", "purificacao.intro.title"]
// Output: { "purificacao.header": "text", "purificacao.intro.title": "text" }
async function loadPathsFromDB(paths) {
  try {
    // log(`[DB] Querying ${paths.length} paths`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .in('json_key', paths);
    
    if (error) {
      log(`[DB] ERROR: ${error.message}`);
      return {};
    }
    
    // log(`[DB] Found ${entries.length} entries`);
    
    // Save to cache
    await _saveSupabaseEntriesToCache(entries);
    
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
  const startTime = Date.now();
  try {
    // log(`[DB-READ] 🗄️  START querying all entries for page: ${pageId}`);
    
    const { data: entries, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', pageId);
    
    if (error) {
      log(`[DB-READ] ❌ ERROR: ${error.message} (${Date.now() - startTime}ms)`);
      return null;
    }
    
    // log(`[DB-READ] ✅ Found ${entries.length} entries for page: ${pageId} (${Date.now() - startTime}ms)`);
    
    // Save to cache
    // log(`[DB-READ] 💾 Saving to cache...`);
    await _saveSupabaseEntriesToCache(entries, pageId);
    
    // Build results
    const results = {};
    for (const entry of entries) {
      results[entry.json_key] = entry.content['pt-BR'];
    }
    
    // log(`[DB-READ] 🎯 Complete - returning ${Object.keys(results).length} entries (${Date.now() - startTime}ms)`);
    return results;
  } catch (err) {
    log(`[DB-READ] ❌ ERROR: ${err.message} (${Date.now() - startTime}ms)`);
    return null;
  }
}

// ==================== RECONSTRUCTION ====================

// Reconstruct nested object from flat entries
// Input: { "__shared__.footer.trademark": "text", "__shared__.footer.copyright": "text2" }
// Output: { footer: { trademark: "text", copyright: "text2" } }
// All entries now have consistent pageId prefix
function reconstructObject(flatEntries, pageId) {
  const result = {};
  const prefix = `${pageId}.`;
  
  // Sort by depth
  const sorted = Object.keys(flatEntries).sort((a, b) => {
    const depthA = a.split('.').length;
    const depthB = b.split('.').length;
    return depthA - depthB;
  });
  
  for (const fullKey of sorted) {
    // All pages: "purificacao.header.title" → "header.title"
    // Including __shared__: "__shared__.footer.trademark" → "footer.trademark"
    if (!fullKey.startsWith(prefix)) continue;
    const path = fullKey.substring(prefix.length);
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
  const timings = { operations: [] }; // Track detailed timings
  
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
      
      // log(`[REQUEST] Pages: ${pageIds.join(',')}`);
      
      const results = {};
      const sources = {};
      
      // Load __shared__ ONCE for all requests
      // log(`\n[REQUEST] ━━━ Processing __shared__ (footer) ━━━`);
      const sharedStart = Date.now();
      let sharedEntries = await loadPageFromCache('__shared__');
      const sharedCacheTime = Date.now() - sharedStart;
      
      if (sharedEntries) {
        timings.operations.push({ op: 'shared-cache-read', time: sharedCacheTime, result: 'hit' });
        // log(`[STRATEGY] ✅ Cache HIT for __shared__`);
        results['__shared__'] = reconstructObject(sharedEntries, '__shared__');
        sources['__shared__'] = 'cache';
        
        // Trigger background revalidation ONCE
        // log(`[BACKGROUND] 🔄 Triggering revalidation for __shared__`);
        fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/update-cache`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: '__shared__' })
        }).catch(err => log(`[BACKGROUND] ❌ Revalidation failed for __shared__: ${err.message}`));
      } else {
        timings.operations.push({ op: 'shared-cache-read', time: sharedCacheTime, result: 'miss' });
        // log(`[STRATEGY] ❌ Cache MISS for __shared__ - loading from DB`);
        const sharedDbStart = Date.now();
        sharedEntries = await loadPageFromDB('__shared__');
        const sharedDbTime = Date.now() - sharedDbStart;
        timings.operations.push({ op: 'shared-db-query', time: sharedDbTime });
        
        if (sharedEntries && Object.keys(sharedEntries).length > 0) {
          results['__shared__'] = reconstructObject(sharedEntries, '__shared__');
          sources['__shared__'] = 'db';
        }
      }
      
      // Process requested pages
      for (const pageId of pageIds) {
        const pageStart = Date.now();
        // log(`\n[REQUEST] ━━━ Processing page: ${pageId} ━━━`);
        
        // Try cache first
        const cacheStart = Date.now();
        let flatEntries = await loadPageFromCache(pageId);
        const cacheTime = Date.now() - cacheStart;
        
        if (flatEntries) {
          timings.operations.push({ op: `${pageId}-cache-read`, time: cacheTime, result: 'hit' });
          // Cache HIT: return immediately and revalidate in background
          // log(`[STRATEGY] ✅ Cache HIT for ${pageId} - using stale-while-revalidate`);
          results[pageId] = reconstructObject(flatEntries, pageId);
          sources[pageId] = 'cache';
          
          // Trigger background revalidation (fire-and-forget)
          // log(`[BACKGROUND] 🔄 Triggering revalidation for ${pageId}`);
          fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/update-cache`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageId })
          }).catch(err => log(`[BACKGROUND] ❌ Revalidation failed for ${pageId}: ${err.message}`));
          
        } else {
          timings.operations.push({ op: `${pageId}-cache-read`, time: cacheTime, result: 'miss' });
          // Cache MISS: load from DB and save to cache
          // log(`[STRATEGY] ❌ Cache MISS for ${pageId} - loading from DB`);
          const dbStart = Date.now();
          flatEntries = await loadPageFromDB(pageId);
          const dbTime = Date.now() - dbStart;
          timings.operations.push({ op: `${pageId}-db-query`, time: dbTime });
          
          if (flatEntries && Object.keys(flatEntries).length > 0) {
            // log(`[STRATEGY] ✅ Successfully loaded ${pageId} from DB`);
            results[pageId] = reconstructObject(flatEntries, pageId);
            sources[pageId] = 'db';
          } else {
            // log(`[STRATEGY] ⚠️  No data found for ${pageId}`);
            results[pageId] = null;
            sources[pageId] = 'not-found';
          }
        }
        
        const pageTime = Date.now() - pageStart;
        timings.operations.push({ op: `${pageId}-total`, time: pageTime });
      }
      
      const duration = Date.now() - start;
      timings.total = duration;
      // log(`[RESPONSE] Pages: ${pageIds.join(',')}, duration=${duration}ms`);
      
      return res.status(200).json({
        success: true,
        pages: results,
        sources,
        timings
      });
    }
    
    // MODE 2: Specific paths (?paths=purificacao.header,purificacao.intro.title)
    if (pathsParam) {
      const paths = pathsParam.split(',').map(p => p.trim()).filter(Boolean);
      // log(`[REQUEST] Paths: ${paths.length} items`);
      
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
      // log(`[RESPONSE] Paths: ${paths.length} total, ${cacheHits} cache, ${misses.length - cacheHits} db, duration=${duration}ms`);
      
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
