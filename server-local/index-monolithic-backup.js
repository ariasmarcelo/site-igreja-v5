// Servidor local Express para APIs
// Replica as funções serverless da Vercel localmente
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/content/:pageId
app.get('/api/content/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching content:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar conteúdo do banco de dados', 
      details: error.message,
      pageId: req.params.pageId
    });
  }
});

// GET /api/styles/:pageId
app.get('/api/styles/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const { data, error } = await supabase
      .from('page_styles')
      .select('css')
      .eq('page_id', pageId)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching styles:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar estilos do banco de dados', 
      details: error.message,
      pageId: req.params.pageId
    });
  }
});

// POST /api/save-visual-edits
app.post('/api/save-visual-edits', async (req, res) => {
  try {
    const { pageId, edits } = req.body;
    
    console.log('═══════════════════════════════════════════');
    console.log('📥 REQUISIÇÃO RECEBIDA (LOCAL)');
    console.log('   pageId:', pageId);
    console.log('   editsCount:', Object.keys(edits || {}).length);
    console.log('═══════════════════════════════════════════');
    
    if (!edits || typeof edits !== 'object') {
      console.error('❌ Payload inválido: edits deve ser um objeto');
      return res.status(400).json({ 
        success: false, 
        message: 'Payload inválido: campo "edits" deve ser um objeto contendo as modificações',
        received: typeof edits
      });
    }
    
    // Buscar conteúdo atual
    const { data, error: fetchError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (fetchError) {
      console.error('❌ Erro ao buscar página:', fetchError);
      return res.status(404).json({ 
        success: false, 
        message: `Página "${pageId}" não encontrada no banco de dados`,
        details: fetchError.message
      });
    }
    
    const content = data.content;
    let appliedCount = 0;
    
    // Aplicar edições
    Object.entries(edits).forEach(([elementId, edit]) => {
      if (edit.newText !== undefined) {
        let cleanElementId = elementId;
        if (elementId.startsWith(`${pageId}.`)) {
          cleanElementId = elementId.substring(pageId.length + 1);
        }
        
        const parts = cleanElementId.split('.');
        let current = content;
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
          
          if (arrayMatch) {
            const arrayName = arrayMatch[1];
            const index = parseInt(arrayMatch[2]);
            
            if (current[arrayName] && Array.isArray(current[arrayName]) && current[arrayName][index]) {
              current = current[arrayName][index];
            } else {
              break;
            }
          } else {
            if (i === parts.length - 1) {
              if (current[part] !== undefined) {
                current[part] = edit.newText;
                appliedCount++;
                console.log(`✅ APLICADO: ${cleanElementId}`);
              }
            } else {
              if (current[part] !== undefined) {
                current = current[part];
              } else {
                break;
              }
            }
          }
        }
      }
    });
    
    console.log(`📊 Total aplicado: ${appliedCount} de ${Object.keys(edits).length}`);
    
    // Salvar no Supabase
    const updatedContent = JSON.parse(JSON.stringify(content));
    
    const { data: updateData, error: updateError } = await supabase
      .from('page_contents')
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('page_id', pageId)
      .select();
    
    if (updateError) {
      console.error('❌ Erro ao salvar no banco:', updateError);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao salvar alterações no banco de dados Supabase',
        details: updateError.message,
        pageId,
        appliedCount
      });
    }
    
    console.log('✅ Salvo com sucesso!');
    
    res.status(200).json({ 
      success: true, 
      message: 'Edições salvas com sucesso!',
      appliedCount,
      totalEdits: Object.keys(edits).length
    });
  } catch (error) {
    console.error('❌ Server error (save-visual-edits):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao processar edições',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /api/save-styles
app.post('/api/save-styles', async (req, res) => {
  try {
    const { pageId, css } = req.body;
    
    console.log('═══════════════════════════════════════════');
    console.log('📥 SAVE STYLES - REQUISIÇÃO RECEBIDA');
    console.log('   pageId:', pageId);
    console.log('   css length:', css?.length || 0);
    console.log('   css preview:', css?.substring(0, 100));
    console.log('═══════════════════════════════════════════');
    
    if (!pageId) {
      console.error('❌ pageId não fornecido');
      return res.status(400).json({ 
        success: false, 
        message: 'pageId é obrigatório',
        received: { pageId, cssLength: css?.length }
      });
    }
    
    const { data, error } = await supabase
      .from('page_styles')
      .upsert({
        page_id: pageId,
        css: css,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id'  // Especifica que page_id é o campo único para upsert
      })
      .select();
    
    if (error) {
      console.error('❌ Erro no upsert:', error);
      console.log('   Código:', error.code);
      console.log('   Detalhes:', error.details);
      console.log('   Hint:', error.hint);
      throw error;
    }
    
    console.log('✅ Estilos salvos com sucesso!');
    console.log('   Dados retornados:', data);
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error saving styles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar estilos CSS no banco de dados',
      details: error.message,
      pageId: req.body.pageId
    });
  }
});

// POST /api/save-json
app.post('/api/save-json', async (req, res) => {
  try {
    const { pageId, content } = req.body;
    
    const { data, error } = await supabase
      .from('page_contents')
      .upsert({
        page_id: pageId,
        content: content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id'  // Especifica que page_id é o campo único para upsert
      })
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error saving JSON:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar conteúdo JSON no banco de dados',
      details: error.message,
      pageId: req.body.pageId
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'local' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API Local rodando em http://localhost:${PORT}`);
  console.log(`   Supabase: ${process.env.VITE_SUPABASE_URL}`);
  console.log(`   Endpoints disponíveis:`);
  console.log(`   - GET  /api/content/:pageId`);
  console.log(`   - GET  /api/styles/:pageId`);
  console.log(`   - POST /api/save-visual-edits`);
  console.log(`   - POST /api/save-styles`);
  console.log(`   - POST /api/save-json`);
});
