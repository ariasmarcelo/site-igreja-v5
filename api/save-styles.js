// Vercel Serverless Function - Save Styles (GRANULAR)
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
    const { pageId, css } = req.body;
    
    console.log('\n=== [save-styles] REQUISIÇÃO RECEBIDA ===');
    console.log('[save-styles] PageId:', pageId);
    console.log('[save-styles] CSS length:', css?.length);
    console.log('[save-styles] CSS:', css);
    
    // Parse CSS para extrair [data-json-key="..."] { ... }
    const cssBlocks = css.match(/\[data-json-key="([^"]+)"\]\s*\{([^}]+)\}/g);
    
    if (!cssBlocks || cssBlocks.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum bloco CSS válido encontrado' 
      });
    }
    
    const entries = [];
    
    for (const block of cssBlocks) {
      const keyMatch = block.match(/\[data-json-key="([^"]+)"\]/);
      const propsMatch = block.match(/\{([^}]+)\}/);
      
      if (!keyMatch || !propsMatch) continue;
      
      const jsonKey = keyMatch[1];
      const cssProps = propsMatch[1].trim();
      
      // Converter CSS para objeto JSON
      const styleObj = {};
      const props = cssProps.split(';').filter(p => p.trim());
      
      for (const prop of props) {
        const [key, value] = prop.split(':').map(s => s.trim());
        if (key && value) {
          styleObj[key] = value;
        }
      }
      
      entries.push({
        json_key: jsonKey,
        value: JSON.stringify(styleObj),
        updated_at: new Date().toISOString()
      });
    }
    
    console.log('[save-styles] Total entries a salvar:', entries.length);
    console.log('[save-styles] Entries:', JSON.stringify(entries, null, 2));
    
    // Upsert em style_entries (granular)
    const { data, error } = await supabase
      .from('style_entries')
      .upsert(entries, { onConflict: 'json_key' })
      .select();
    
    console.log('[save-styles] Supabase response:', { data, error });
    
    if (error) {
      console.error('[save-styles] ❌ Erro do Supabase:', error);
      throw error;
    }
    
    res.status(200).json({ 
      success: true, 
      message: `${entries.length} estilos salvos com sucesso!`,
      count: entries.length
    });
  } catch (error) {
    console.error('[save-styles] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
