// Vercel Serverless Function - Save Visual Edits (Granular System)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    if (!edits || typeof edits !== 'object') {
      return res.status(400).json({ success: false, message: 'Edits inválidas' });
    }
    
    // ESTRATÉGIA GRANULAR: Atualizar apenas entries específicas modificadas
    let appliedCount = 0;
    const updates = [];
    
    for (const [elementId, edit] of Object.entries(edits)) {
      if (edit.newText === undefined) {
        continue;
      }
      
      // Remover prefixo pageId se presente
      let cleanElementId = elementId;
      if (elementId.startsWith(`${pageId}.`)) {
        cleanElementId = elementId.substring(pageId.length + 1);
      }
      
      // CONTEÚDO COMPARTILHADO: footer.* não deve ter prefixo de página
      const isSharedContent = cleanElementId.startsWith('footer.');
      const jsonKey = isSharedContent ? cleanElementId : `${pageId}.${cleanElementId}`;
      const targetPageId = isSharedContent ? '__shared__' : pageId;
      
      updates.push({
        page_id: targetPageId,
        json_key: jsonKey,
        newText: edit.newText
      });
      
      appliedCount++;
    }
    
    // Aplicar updates individuais (upsert granular)
    for (const update of updates) {
      const { error } = await supabase
        .from('text_entries')
        .upsert({
          page_id: update.page_id,
          json_key: update.json_key,
          content: { 'pt-BR': update.newText },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'json_key'
        });
      
      if (error) {
        throw error;
      }
    }
    
    // NÃO sincronizar JSONs locais - isso é responsabilidade do sistema de leitura
    // Os JSONs serão atualizados automaticamente quando a página buscar dados da API
    // O editor trabalha APENAS com o DB via API
    
    res.status(200).json({ 
      success: true, 
      message: 'Edições salvas com sucesso!',
      appliedCount,
      totalEdits: Object.keys(edits).length
    });
  } catch (error) {
    console.error('❌ Erro geral:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
