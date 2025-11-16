const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  console.log(`[${new Date().toISOString()}] [CONTENT-API] ${msg}`);
}

// Reconstruir objeto a partir das entradas do DB
function reconstructObjectFromEntries(entries, pageId) {
  const pageContent = {};
  
  entries.forEach(entry => {
    let jsonKey = entry.json_key;
    
    // Adicionar prefixo __shared__. se a entrada vem de page_id='__shared__'
    if (entry.page_id === '__shared__') {
      jsonKey = `__shared__.${jsonKey}`;
    }
    // Para página específica, adicionar prefixo do pageId se não tiver
    else if (!jsonKey.startsWith(pageId + '.')) {
      jsonKey = `${pageId}.${jsonKey}`;
    }
    
    // Agora remover o prefixo para construir o objeto nested
    // "__shared__.footer.copyright" -> ["__shared__", "footer", "copyright"]
    // "index.header.title" -> ["header", "title"] (remove "index")
    const keys = jsonKey.startsWith(pageId + '.') 
      ? jsonKey.split('.').slice(1)
      : jsonKey.split('.');
    
    if (keys.length === 0) return;
    
    let current = pageContent;
    
    // Navega pela estrutura criando objetos/arrays conforme necessário
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
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
    
    // Define o valor final
    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const arrayIndex = parseInt(arrayMatch[2]);
      if (!current[arrayName]) current[arrayName] = [];
      current[arrayName][arrayIndex] = entry.content['pt-BR'] || entry.content;
    } else {
      current[lastKey] = entry.content['pt-BR'] || entry.content;
    }
  });
  
  return pageContent;
}

// GET - Buscar conteúdo de uma página
async function handleGet(pageId) {
  const startTime = Date.now();
  log(`GET pageId=${pageId}`);
  
  // Busca entradas da página específica + __shared__
  const { data: entries, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .in('page_id', [pageId, '__shared__']);

  if (error) {
    log(`ERROR: ${error.message} (${Date.now() - startTime}ms)`);
    throw error;
  }
  
  if (!entries || entries.length === 0) {
    log(`NOT FOUND: pageId=${pageId} (${Date.now() - startTime}ms)`);
    return null;
  }

  log(`SUCCESS: ${entries.length} entries (${Date.now() - startTime}ms)`);
  
  const pageContent = reconstructObjectFromEntries(entries, pageId);
  return pageContent;
}

// PUT - Atualizar conteúdo de uma página
async function handlePut(pageId, edits) {
  const startTime = Date.now();
  log(`PUT pageId=${pageId}, edits=${Object.keys(edits).length}`);
  
  if (!edits || typeof edits !== 'object') {
    throw new Error('Invalid edits object');
  }
  
  const updates = [];
  
  for (const [jsonKey, edit] of Object.entries(edits)) {
    if (edit.newText === undefined) continue;
    
    // Detectar se é conteúdo compartilhado pelo prefixo __shared__.
    const isSharedKey = jsonKey.startsWith('__shared__.');
    
    // Determinar page_id e json_key para salvar
    let targetPageId;
    let finalJsonKey;
    
    if (isSharedKey) {
      // Conteúdo compartilhado: page_id='__shared__', json_key='footer.copyright'
      targetPageId = '__shared__';
      finalJsonKey = jsonKey.replace('__shared__.', ''); // Remove prefixo
    } else {
      // Conteúdo de página específica: page_id='index', json_key='header.title' (sem prefixo)
      targetPageId = pageId;
      const hasPagePrefix = jsonKey.startsWith(`${pageId}.`);
      finalJsonKey = hasPagePrefix ? jsonKey.substring(pageId.length + 1) : jsonKey;
    }
    
    updates.push({
      page_id: targetPageId,
      json_key: finalJsonKey,
      newText: edit.newText
    });
  }
  
  // Aplicar updates
  for (const update of updates) {
    log(`UPSERTING: page_id="${update.page_id}" json_key="${update.json_key}" text="${update.newText.substring(0, 50)}..."`);
    
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
      log(`ERROR upserting ${update.json_key}: ${error.message}`);
      throw error;
    }
    
    log(`SUCCESS: Updated ${data?.length || 0} row(s)`);
  }
  
  log(`SUCCESS: ${updates.length} entries updated (${Date.now() - startTime}ms)`);
  return { updatedCount: updates.length };
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const requestStart = Date.now();
  
  try {
    // Extrair pageId da URL
    const pageId = req.query.pageId || req.url?.split('/').pop()?.split('?')[0];
    
    if (!pageId) {
      return res.status(400).json({ 
        success: false, 
        message: 'pageId é obrigatório' 
      });
    }

    // GET /api/content/:pageId
    if (req.method === 'GET') {
      const content = await handleGet(pageId);
      
      if (!content) {
        return res.status(404).json({ 
          success: false, 
          message: `Conteúdo não encontrado: ${pageId}` 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        content,
        source: 'supabase-db',
        duration: `${Date.now() - requestStart}ms`
      });
    }
    
    // PUT /api/content/:pageId
    if (req.method === 'PUT') {
      const { edits } = req.body;
      const result = await handlePut(pageId, edits);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Conteúdo atualizado com sucesso',
        ...result,
        duration: `${Date.now() - requestStart}ms`
      });
    }
    
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use GET or PUT.' 
    });
    
  } catch (err) {
    const duration = Date.now() - requestStart;
    log(`ERROR: ${err.message} (${duration}ms)`);
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};
