// Vercel Serverless Function - API Routes
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Inicializar Supabase com service_role key (para operações de escrita)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Variáveis de ambiente Supabase não configuradas');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Supabase já mantém histórico de alterações automaticamente
// Não é mais necessário gerenciar backups manualmente

// Endpoint: Salvar JSON
app.post('/api/save-json', async (req, res) => {
  try {
    const { pageId, content } = req.body;
    
    const { error } = await supabase
      .from('page_contents')
      .upsert({
        page_id: pageId,
        content,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    res.json({ success: true, message: 'JSON salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Salvar edições visuais (texto)
app.post('/api/save-visual-edits', async (req, res) => {
  try {
    const { pageId, updates } = req.body;
    
    // Buscar conteúdo atual do Supabase
    const { data, error: fetchError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ success: false, message: 'Página não encontrada' });
    }
    
    const content = data.content;
    
    // Aplicar updates
    updates.forEach(({ key, value }) => {
      const keys = key.split('.');
      let current = content;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
    });
    
    // Salvar de volta no Supabase
    const { error: updateError } = await supabase
      .from('page_contents')
      .upsert({
        page_id: pageId,
        content,
        updated_at: new Date().toISOString()
      });
    
    if (updateError) throw updateError;
    
    res.json({ success: true, message: 'Edições salvas com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Salvar estilos CSS
app.post('/api/save-styles', async (req, res) => {
  try {
    const { pageId, css } = req.body;
    
    const { error } = await supabase
      .from('page_styles')
      .upsert({
        page_id: pageId,
        css,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    res.json({ success: true, message: 'CSS salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Buscar conteúdo JSON
app.get('/api/content/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (error) {
      return res.status(404).json({ success: false, message: 'Página não encontrada' });
    }
    
    res.json({ success: true, content: data.content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Buscar estilos CSS
app.get('/api/styles/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const { data, error } = await supabase
      .from('page_styles')
      .select('css')
      .eq('page_id', pageId)
      .single();
    
    if (error) {
      return res.status(404).json({ success: false, message: 'Estilos não encontrados' });
    }
    
    res.json({ success: true, css: data.css });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export para Vercel Serverless Functions
module.exports = app;
module.exports.default = app;
