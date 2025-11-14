// Vercel Serverless Function - Get Content with Cache-First Strategy
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Lock para evitar criação simultânea de cache para mesma página
const cacheLocks = new Map();

// Helper: Carregar conteúdo do cache local (fallback JSONs)
async function loadFromCache(pageId) {
  const fallbacksDir = path.join(process.cwd(), 'src', 'locales', 'pt-BR');
  
  try {
    const files = await fs.readdir(fallbacksDir);
    const pageFiles = files.filter(f => f.startsWith(`${pageId}.`) && f.endsWith('.json'));
    
    if (pageFiles.length === 0) {
      return null; // Cache vazio para esta página
    }
    
    const pageContent = {};
    
    for (const file of pageFiles) {
      const filePath = path.join(fallbacksDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const value = JSON.parse(content);
      
      // Extrair caminho do nome do arquivo: "Index.hero.title.json" → ["hero", "title"]
      const jsonKey = file.replace(`${pageId}.`, '').replace('.json', '');
      const keys = jsonKey.split('.');
      
      let current = pageContent;
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
      
      const lastKey = keys[keys.length - 1];
      const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const arrayIndex = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        current[arrayName][arrayIndex] = value;
      } else {
        current[lastKey] = value;
      }
    }
    
    return pageContent;
  } catch (error) {
    console.warn(`⚠️  Erro ao carregar cache: ${error.message}`);
    return null;
  }
}

// Helper: Buscar do DB e criar cache
async function loadFromDBAndCache(pageId) {
  // Buscar do DB
  const { data: entries, error: entriesError } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .in('page_id', [pageId, '__shared__']);

  if (entriesError) throw entriesError;
  if (!entries || entries.length === 0) return null;

  // Reconstruir objeto
  const pageContent = {};
  
  entries.forEach(entry => {
    const jsonKey = entry.json_key;
    const keys = jsonKey.startsWith(pageId + '.') 
      ? jsonKey.split('.').slice(1)
      : jsonKey.split('.');
    
    if (keys.length === 0) return;
    
    let current = pageContent;
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

  // Criar cache em background (não bloquear resposta)
  // LOCK: evitar múltiplas escritas simultâneas para mesma página
  if (!cacheLocks.has(pageId)) {
    const lockPromise = createCacheFiles(pageId, pageContent)
      .catch(err => console.warn(`⚠️  Erro ao criar cache: ${err.message}`))
      .finally(() => cacheLocks.delete(pageId));
    
    cacheLocks.set(pageId, lockPromise);
  }

  return pageContent;
}

// Helper: Criar arquivos de cache com controle de concorrência
async function createCacheFiles(pageId, content) {
  const fallbacksDir = path.join(process.cwd(), 'src', 'locales', 'pt-BR');
  await fs.mkdir(fallbacksDir, { recursive: true });

  const flatten = (obj, prefix = '') => {
    let result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flatten(value, newKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item && typeof item === 'object') {
            Object.assign(result, flatten(item, `${newKey}[${index}]`));
          } else {
            result[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const flat = flatten(content);
  const entries = Object.entries(flat);
  
  // CORREÇÃO: Escrever em batches de 50 para evitar UV_HANDLE_CLOSING
  const BATCH_SIZE = 50;
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async ([key, value]) => {
        const fileName = `${pageId}.${key}.json`;
        const filePath = path.join(fallbacksDir, fileName);
        try {
          await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
        } catch (err) {
          console.warn(`⚠️  Falha ao escrever ${fileName}: ${err.message}`);
        }
      })
    );
  }
  
  console.log(`📝 Cache criado: ${entries.length} arquivos para ${pageId}`);
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Em Vercel, rotas dinâmicas [pageId] vêm em req.query.pageId
    const pageId = req.query.pageId || req.url?.split('/').pop();
    
    if (!pageId) {
      return res.status(400).json({ success: false, message: 'pageId é obrigatório' });
    }

    console.log(`📦 Buscando conteúdo para página: ${pageId}`);

    try {
      // ESTRATÉGIA CACHE-FIRST:
      // 1. Tentar carregar do cache local (fallback JSONs)
      console.log(`🔍 [1/2] Verificando cache local...`);
      let pageContent = await loadFromCache(pageId);
      
      if (pageContent) {
        console.log(`✅ Cache hit! Retornando do cache local`);
        return res.status(200).json({ 
          success: true, 
          content: pageContent,
          source: 'cache (local fallback JSONs)'
        });
      }

      // 2. Cache miss → Buscar do DB e criar cache
      console.log(`⚠️  Cache miss! Buscando do DB...`);
      pageContent = await loadFromDBAndCache(pageId);

      if (!pageContent) {
        return res.status(404).json({ 
          success: false, 
          message: `Nenhum conteúdo encontrado para: ${pageId}` 
        });
      }

      console.log(`✅ DB hit! Cache criado em background`);
      return res.status(200).json({ 
        success: true, 
        content: pageContent,
        source: 'database (cache created)'
      });

    } catch (dbError) {
      console.error(`❌ Erro ao buscar conteúdo:`, dbError.message);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar conteúdo',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error(`❌ Erro geral:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
