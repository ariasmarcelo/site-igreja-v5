// Vercel Serverless Function - Get Content with Shared Content (NULL page_id)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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
      // STEP 1: Buscar entradas granulares da página (text_entries - onde os dados REALMENTE estão)
      // Buscar tanto conteúdo da página quanto conteúdo compartilhado (__shared__)
      const { data: entries, error: entriesError } = await supabase
        .from('text_entries')
        .select('json_key, content')
        .in('page_id', [pageId, '__shared__']);

      if (entriesError) throw entriesError;

      if (!entries || entries.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: `Nenhum conteúdo encontrado para: ${pageId}` 
        });
      }

      // STEP 2: Reconstruir objeto da página a partir das entradas granulares
      // Conteúdo compartilhado (__shared__) é mesclado com conteúdo da página
      const pageContent = {};
      
      entries.forEach(entry => {
        const jsonKey = entry.json_key;
        
        // Conteúdo compartilhado: "footer.copyright" → "footer.copyright"
        // Conteúdo da página: "pagina.secao.campo" → "secao.campo"
        const keys = jsonKey.startsWith(pageId + '.') 
          ? jsonKey.split('.').slice(1)  // Remove prefixo da página
          : jsonKey.split('.');           // Mantém keys compartilhadas como estão
        
        if (keys.length === 0) return; // Skip se não houver keys
        
        let current = pageContent;
        
        // Navegar/criar estrutura aninhada
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          
          // Detectar índice de array: "items[0]" ou "phases[1]"
          const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
          
          if (arrayMatch) {
            const arrayName = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2]);
            
            if (!current[arrayName]) {
              current[arrayName] = [];
            }
            if (!current[arrayName][arrayIndex]) {
              current[arrayName][arrayIndex] = {};
            }
            current = current[arrayName][arrayIndex];
          } else {
            if (!current[key]) {
              current[key] = {};
            }
            current = current[key];
          }
        }
        
        // Atribuir valor final (content é JSONB com locale)
        const lastKey = keys[keys.length - 1];
        const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/);
        
        if (arrayMatch) {
          const arrayName = arrayMatch[1];
          const arrayIndex = parseInt(arrayMatch[2]);
          
          if (!current[arrayName]) {
            current[arrayName] = [];
          }
          current[arrayName][arrayIndex] = entry.content['pt-BR'] || entry.content;
        } else {
          current[lastKey] = entry.content['pt-BR'] || entry.content;
        }
      });

      return res.status(200).json({ 
        success: true, 
        content: pageContent,
        source: 'text_entries (granular + shared)'
      });

    } catch (dbError) {
      console.error(`❌ Erro ao buscar do DB:`, dbError.message);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar conteúdo do banco de dados',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error(`❌ Erro geral:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
