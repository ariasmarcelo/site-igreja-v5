// Vercel Serverless Function - Save Visual Edits (Granular System)
const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Log helper
function log(msg) {
  console.log(`[${new Date().toISOString()}] [SAVE-API] ${msg}`);
}

// Get singleton LMDB instance
function getDB() {
  if (!global.__lmdbInstance) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    log(`Initializing LMDB at ${dbPath}`);
    global.__lmdbInstance = open({
      path: dbPath,
      compression: true,
    });
  }
  return global.__lmdbInstance;
}

// 🗑️ INVALIDAR TODO O CACHE após salvamento
// Isso garante que qualquer requisição posterior pegue dados frescos do banco
function invalidateAllCache() {
  try {
    const db = getDB();
    const allKeys = Array.from(db.getKeys());
    
    log(`🗑️ Clearing entire cache: ${allKeys.length} entries`);
    
    for (const key of allKeys) {
      db.remove(key);
    }
    
    log(`✅ Cache completely cleared: ${allKeys.length} entries removed`);
  } catch (error) {
    log(`⚠️ Error clearing cache: ${error.message}`);
    // Non-critical error - don't fail the request
  }
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { pageId, edits } = req.body;
    
    log(`Received request - pageId: ${pageId}, edits count: ${Object.keys(edits || {}).length}`);
    
    if (!edits || typeof edits !== 'object') {
      log(`Invalid edits - type: ${typeof edits}`);
      return res.status(400).json({ success: false, message: 'Edits inválidas' });
    }
    
    // ESTRATÉGIA GRANULAR: Atualizar apenas entries específicas modificadas
    let appliedCount = 0;
    const updates = [];
    
    for (const [jsonKey, edit] of Object.entries(edits)) {
      log(`Processing edit - jsonKey: ${jsonKey}, hasNewText: ${edit.newText !== undefined}, isShared: ${edit.isShared}, targetPage: ${edit.targetPage}`);
      
      if (edit.newText === undefined) {
        log(`Skipping ${jsonKey} - no newText`);
        continue;
      }
      
      // 🌐 CONTEÚDO COMPARTILHADO: Detectar se é conteúdo compartilhado
      // Compartilhado = NÃO tem prefixo pageId (footer.*, header.*, etc.)
      const hasPagePrefix = jsonKey.startsWith(`${pageId}.`);
      const isSharedContent = !hasPagePrefix || edit.isShared === true;
      
      // 📄 PÁGINA DE DESTINO: 
      // - Se compartilhado: page_id = '__shared__'
      // - Se não compartilhado: page_id = pageId (ou targetPage se fornecido)
      const targetPageId = isSharedContent ? '__shared__' : (edit.targetPage || pageId);
      
      // ✅ NUNCA MODIFICAR json_key - usar exatamente como recebido
      // Banco armazena:
      // - Compartilhado: "footer.copyright" (SEM prefixo)
      // - Página: "tratamentos.treatments[0].details" (COM prefixo)
      
      log(`Prepared update - page_id: ${targetPageId}, json_key: ${jsonKey}, isShared: ${isSharedContent}`);
      
      updates.push({
        page_id: targetPageId,
        json_key: jsonKey,
        newText: edit.newText
      });
      
      appliedCount++;
    }
    
    // Aplicar updates individuais (upsert granular)
    log(`Starting database upserts - ${updates.length} entries`);
    for (const update of updates) {
      log(`Upserting: page_id=${update.page_id}, json_key=${update.json_key}`);
      
      const { data, error } = await supabase
        .from('text_entries')
        .upsert({
          page_id: update.page_id,
          json_key: update.json_key,
          content: { 'pt-BR': update.newText },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'json_key'
        })
        .select();
      
      if (error) {
        log(`Database error: ${error.message}, code: ${error.code}, details: ${JSON.stringify(error.details)}`);
        throw error;
      }
      
      log(`Upsert successful for ${update.json_key}: ${data ? 'updated' : 'created'}`);
    }
    
    log(`Database save successful: pageId=${pageId}, applied=${appliedCount}/${Object.keys(edits).length}`);
    
    // 🗑️ APAGAR TODO O CACHE após salvamento bem-sucedido
    // Garante que todas as próximas requisições busquem dados frescos do banco
    invalidateAllCache();
    
    res.status(200).json({ 
      success: true, 
      message: 'Edições salvas com sucesso!',
      appliedCount,
      totalEdits: Object.keys(edits).length,
      updates: updates.map(u => ({ page_id: u.page_id, json_key: u.json_key }))
    });
  } catch (error) {
    log(`Error saving edits: ${error.message}`);
    log(`Error stack: ${error.stack}`);
    
    // Detailed error response
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: {
        code: error.code,
        hint: error.hint,
        details: error.details
      }
    });
  }
};
