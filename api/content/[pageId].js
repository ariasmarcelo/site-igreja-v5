const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
  const logMsg = `[${new Date().toISOString()}] [CONTENT-API] ${msg}`;
  console.log(logMsg);
}

// Reconstruir objeto a partir das entradas do DB
function reconstructObjectFromEntries(entries, pageId) {
  const pageContent = {};
  
  log(`🔧 Reconstruindo ${entries.length} entradas para pageId="${pageId}"`);
  
  // Primeiro, filtrar para priorizar chaves sem prefixo duplicado
  // Se existir 'valores.cards[7].content' E 'quemsomos.valores.cards[7].content',
  // usar apenas a primeira (sem duplicação)
  const cleanedEntries = new Map();
  
  entries.forEach((entry) => {
    let cleanKey = entry.json_key;
    const hasDuplicatePrefix = cleanKey.startsWith(entry.page_id + '.');
    
    if (hasDuplicatePrefix) {
      cleanKey = cleanKey.substring(entry.page_id.length + 1);
    }
    
    const fullKey = `${entry.page_id}.${cleanKey}`;
    
    // Se já existe uma entrada para essa chave, priorizar a SEM prefixo duplicado
    if (cleanedEntries.has(fullKey)) {
      const existing = cleanedEntries.get(fullKey);
      // Se a entrada atual NÃO tem prefixo duplicado, ela substitui a anterior
      if (!hasDuplicatePrefix) {
        log(`✨ Priorizando chave sem prefixo: "${entry.json_key}" sobre "${existing.original_key}"`);
        cleanedEntries.set(fullKey, {
          ...entry,
          cleanKey,
          fullKey,
          original_key: entry.json_key,
          hasDuplicatePrefix
        });
      }
    } else {
      cleanedEntries.set(fullKey, {
        ...entry,
        cleanKey,
        fullKey,
        original_key: entry.json_key,
        hasDuplicatePrefix
      });
    }
  });
  
  log(`📊 Processadas ${entries.length} entradas → ${cleanedEntries.size} únicas`);
  
  // Agora reconstruir o objeto com as entradas priorizadas
  cleanedEntries.forEach((entry) => {
    
    // Remover prefixo do pageId para construir objeto nested
    // "index.hero.title" -> ["hero", "title"]
    // "__shared__.footer.copyright" -> ["footer", "copyright"]
    // "tratamentos.header.title" -> ["header", "title"]
    let keys;
    
    if (entry.page_id === pageId) {
      // Para a página solicitada, remover o prefixo do pageId
      keys = entry.cleanKey.split('.');
    } else if (entry.page_id === '__shared__') {
      // Para __shared__, usar apenas a cleanKey (sem o prefixo __shared__)
      keys = entry.cleanKey.split('.');
    } else {
      // Para outras páginas, manter a estrutura completa
      keys = entry.fullKey.split('.');
    }
    
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
  
  log(`✅ Objeto reconstruído com chaves: ${Object.keys(pageContent).join(', ')}`);
  return pageContent;
}

// GET - Buscar conteúdo de uma página
function handleGet(pageId) {
  const startTime = Date.now();
  log(`GET pageId=${pageId}`);
  
  // Busca entradas da página específica + __shared__
  return supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .in('page_id', [pageId, '__shared__'])
    .then(({ data: entries, error }) => {
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
    });
}

// PUT - Atualizar conteúdo de uma página
function handlePut(pageId, edits) {
  const startTime = Date.now();
  log(`PUT pageId=${pageId}, edits=${Object.keys(edits || {}).length}`);
  log(`EDITS RECEIVED: ${JSON.stringify(edits)}`);
  
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
  
  // Aplicar updates sequencialmente
  function processUpdate(index) {
    if (index >= updates.length) {
      log(`SUCCESS: ${updates.length} updates completed (${Date.now() - startTime}ms)`);
      return Promise.resolve({ updatedCount: updates.length });
    }
    
    const update = updates[index];
    log(`UPSERTING: page_id="${update.page_id}" json_key="${update.json_key}" text="${update.newText.substring(0, 50)}..."`);
    
    // Salvar na chave correta
    return supabase
      .from('text_entries')
      .upsert({
        page_id: update.page_id,
        json_key: update.json_key,
        content: { 'pt-BR': update.newText },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id,json_key'
      })
      .select()
      .then(({ data, error }) => {
        if (error) {
          log(`ERROR upserting ${update.json_key}: ${error.message}`);
          throw error;
        }
        
        log(`SUCCESS: Updated ${data?.length || 0} row(s)`);
        
        // Deletar chave legada com prefixo duplicado se existir
        const legacyKey = `${update.page_id}.${update.json_key}`;
        if (legacyKey !== update.json_key) {
          return supabase
            .from('text_entries')
            .delete()
            .eq('page_id', update.page_id)
            .eq('json_key', legacyKey)
            .then(({ error: delError }) => {
              if (!delError) {
                log(`🧹 DELETED legacy key: ${legacyKey}`);
              }
              return processUpdate(index + 1);
            });
        }
        
        return processUpdate(index + 1);
      });
  }
  
  return processUpdate(0);
}

module.exports = (req, res) => {
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
    return handleGet(pageId)
      .then((content) => {
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
      })
      .catch((err) => {
        const duration = Date.now() - requestStart;
        log(`ERROR: ${err.message} (${duration}ms)`);
        return res.status(500).json({ 
          success: false, 
          message: err.message 
        });
      });
  }
  
  // PUT /api/content/:pageId
  if (req.method === 'PUT') {
    const { edits } = req.body;
    
    return handlePut(pageId, edits)
      .then((result) => {
        return res.status(200).json({ 
          success: true, 
          message: 'Conteúdo atualizado com sucesso',
          ...result,
          duration: `${Date.now() - requestStart}ms`
        });
      })
      .catch((err) => {
        const duration = Date.now() - requestStart;
        log(`ERROR: ${err.message} (${duration}ms)`);
        return res.status(500).json({ 
          success: false, 
          message: err.message 
        });
      });
  }
  
  return res.status(405).json({ 
    success: false, 
    message: 'Method not allowed. Use GET or PUT.' 
  });
};
