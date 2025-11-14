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
      const { data: entries, error: entriesError } = await supabase
        .from('text_entries')
        .select('json_key, content')
        .eq('page_id', pageId);

      if (entriesError) throw entriesError;

      if (!entries || entries.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: `Nenhum conteúdo encontrado para: ${pageId}` 
        });
      }

      console.log(`✅ DB: Encontradas ${entries.length} entradas granulares`);

      // STEP 2: Reconstruir objeto da página a partir das entradas granulares
      // Remove o primeiro nível (pageId) para retornar estrutura direta
      const pageContent = {};
      
      entries.forEach(entry => {
        // Remover pageId do início (ex: "index.hero.title" → "hero.title")
        const jsonKey = entry.json_key;
        const keys = jsonKey.includes('.') ? jsonKey.split('.').slice(1) : [jsonKey];
        
        if (keys.length === 0) return; // Skip se não houver keys após remover pageId
        
        let current = pageContent;
        
        // Navegar/criar estrutura aninhada
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        // Atribuir valor final (content é JSONB com locale)
        const lastKey = keys[keys.length - 1];
        current[lastKey] = entry.content['pt-BR'] || entry.content;
      });

      // STEP 3: Buscar footer compartilhado (page_contents com page_id NULL)
      const { data: sharedData, error: sharedError } = await supabase
        .from('page_contents')
        .select('content')
        .is('page_id', null)
        .single();

      // STEP 4: Merge footer compartilhado (se existir)
      const mergedContent = { ...pageContent };
      
      if (!sharedError && sharedData?.content?.footer) {
        mergedContent.footer = sharedData.content.footer;
        console.log(`✅ Footer compartilhado adicionado`);
      }

      console.log(`🔀 Conteúdo final: ${Object.keys(mergedContent).length} keys`);

      return res.status(200).json({ 
        success: true, 
        content: mergedContent,
        source: 'text_entries + shared_footer'
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
