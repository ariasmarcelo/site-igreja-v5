import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local do diretório raiz do projeto
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Inicializar Supabase com service_role key (para operações de escrita)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Variáveis de ambiente Supabase não configuradas');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const router = express.Router();

// Função para sanitizar texto: remover TODAS as tags HTML
function sanitizeText(text) {
  if (typeof text !== 'string') return text;
  
  // Remover TODAS as tags HTML: qualquer coisa entre < e >
  const sanitized = text.replace(/<[^>]*>/g, '');
  
  if (sanitized !== text) {
    console.log(`⚠️ Sanitized HTML tags from text`);
  }
  
  return sanitized;
}

// Função para atualizar JSON por chave (dot notation ou array notation)
function updateJsonByKey(obj, key, newValue) {
  try {
    // Converter chave para array de partes
    // Exemplos: "hero.title" → ["hero", "title"]
    //          "features[0].title" → ["features", "0", "title"]
    const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.');
    
    let current = obj;
    
    // Navegar até o penúltimo elemento
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      
      // Se o próximo é um número, o atual é um array
      if (!isNaN(nextPart)) {
        if (!Array.isArray(current[part])) {
          console.warn(`  ⚠️ Expected array at ${part}, got ${typeof current[part]}`);
          return false;
        }
        current = current[part];
      } else {
        if (typeof current[part] !== 'object' || current[part] === null) {
          console.warn(`  ⚠️ Expected object at ${part}, got ${typeof current[part]}`);
          return false;
        }
        current = current[part];
      }
    }
    
    // Atualizar o último elemento (sanitizar se for texto)
    const lastKey = parts[parts.length - 1];
    const oldValue = current[lastKey];
    const sanitizedValue = sanitizeText(newValue);
    
    current[lastKey] = sanitizedValue;
    
    console.log(`  ✓ Updated ${key}:`);
    console.log(`     OLD: "${oldValue?.substring ? oldValue.substring(0, 50) : oldValue}..."`);
    console.log(`     NEW: "${sanitizedValue.substring(0, 50)}..."`);
    
    return true;
  } catch (error) {
    console.error(`  ✗ Error updating ${key}:`, error.message);
    return false;
  }
}

// ========== ENDPOINTS SUPABASE ==========

// Endpoint: Buscar conteúdo JSON
router.get('/content/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId.toLowerCase())
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
router.get('/styles/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const { data, error } = await supabase
      .from('page_styles')
      .select('css')
      .eq('page_id', pageId.toLowerCase())
      .single();
    
    if (error) {
      return res.status(404).json({ success: false, message: 'Estilos não encontrados' });
    }
    
    res.json({ success: true, css: data.css });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Função para criar backup no histórico
async function createHistoryBackup(pageId, contentType, content, css = null) {
  try {
    const { error } = await supabase
      .from('page_history')
      .insert({
        page_id: pageId.toLowerCase(),
        content_type: contentType,
        content: contentType === 'json' ? content : null,
        css: contentType === 'css' ? css : null,
        saved_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('⚠️ Erro ao criar backup:', error.message);
    } else {
      console.log(`💾 Backup criado: ${pageId} (${contentType})`);
    }
  } catch (error) {
    console.error('⚠️ Erro ao criar backup:', error.message);
  }
}

// Endpoint: Salvar JSON completo
router.post('/save-json', express.json(), async (req, res) => {
  try {
    const { pageId, content } = req.body;
    
    if (!pageId || !content) {
      return res.status(400).json({ error: 'pageId e content são obrigatórios' });
    }
    
    // Buscar versão atual para backup
    const { data: currentData } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId.toLowerCase())
      .single();
    
    // Criar backup da versão atual (se existir)
    if (currentData?.content) {
      await createHistoryBackup(pageId, 'json', currentData.content);
    }
    
    // Salvar nova versão
    const { error } = await supabase
      .from('page_contents')
      .upsert({
        page_id: pageId.toLowerCase(),
        content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id'
      });
    
    if (error) throw error;
    
    res.json({ success: true, message: 'JSON salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Salvar edições visuais (texto)
router.post('/save-visual-edits', express.json(), async (req, res) => {
  try {
    const { pageId, edits } = req.body;
    
    if (!pageId || !edits) {
      return res.status(400).json({ error: 'pageId e edits são obrigatórios' });
    }
    
    // Buscar conteúdo atual do Supabase
    const { data, error: fetchError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId.toLowerCase())
      .single();
    
    if (fetchError) {
      return res.status(404).json({ success: false, message: 'Página não encontrada' });
    }
    
    const jsonData = data.content;
    
    console.log(`\n🔄 Updating ${pageId}...`);
    console.log(`📊 Total edits to apply: ${Object.keys(edits).length}`);
    
    // Aplicar cada edição
    let updatedCount = 0;
    const editsArray = Object.entries(edits);
    
    for (const [elementId, newText] of editsArray) {
      console.log(`\n📝 Processing edit: ${elementId}`);
      
      // Remover prefixo pageId do elementId se presente
      let jsonKey = elementId;
      const pagePrefix = `${pageId}.`;
      
      if (elementId.startsWith(pagePrefix)) {
        jsonKey = elementId.substring(pagePrefix.length);
        console.log(`   🔧 Removed prefix: "${elementId}" → "${jsonKey}"`);
      }
      
      if (jsonKey && jsonKey.trim() !== '') {
        console.log(`   🔑 Using JSON key: ${jsonKey}`);
        const updated = updateJsonByKey(jsonData, jsonKey, newText);
        if (updated) {
          updatedCount++;
        }
      }
    }
    
    // Salvar de volta no Supabase
    if (updatedCount > 0) {
      // Criar backup antes de salvar
      await createHistoryBackup(pageId, 'json', data.content);
      
      const { error: updateError } = await supabase
        .from('page_contents')
        .upsert({
          page_id: pageId.toLowerCase(),
          content: jsonData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id'
        });
      
      if (updateError) throw updateError;
      
      console.log(`\n✅ Updated ${updatedCount} values in ${pageId}`);
    }
    
    res.json({ 
      success: true, 
      message: `✓ ${updatedCount} textos atualizados!`,
      updatedCount,
      totalEdits: Object.keys(edits).length
    });

  } catch (error) {
    console.error('Erro ao salvar edições:', error);
    res.status(500).json({ error: 'Erro ao salvar edições', details: error.message });
  }
});

// Endpoint: Salvar estilos CSS
router.post('/save-styles', express.json(), async (req, res) => {
  try {
    const { pageId, styles } = req.body;
    
    if (!pageId || !styles) {
      return res.status(400).json({ error: 'pageId e styles são obrigatórios' });
    }
    
    console.log(`\n🎨 Saving styles for ${pageId}...`);
    
    // Buscar versão atual para backup
    const { data: currentData } = await supabase
      .from('page_styles')
      .select('css')
      .eq('page_id', pageId.toLowerCase())
      .single();
    
    // Criar backup da versão atual (se existir)
    if (currentData?.css) {
      await createHistoryBackup(pageId, 'css', null, currentData.css);
    }
    
    // Salvar nova versão
    const { error } = await supabase
      .from('page_styles')
      .upsert({
        page_id: pageId.toLowerCase(),
        css: styles,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id'
      });
    
    if (error) throw error;
    
    console.log(`✅ Styles saved for ${pageId}`);
    
    res.json({ 
      success: true, 
      message: 'Estilos salvos com sucesso!',
      cssLength: styles.length
    });

  } catch (error) {
    console.error('Erro ao salvar estilos:', error);
    res.status(500).json({ error: 'Erro ao salvar estilos', details: error.message });
  }
});

// ========== BLOG ENDPOINTS ==========

// Endpoint: Atualizar artigo do blog
router.put('/blog-posts/:id', express.json(), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`\n📝 Updating blog post ${id}...`);
    console.log(`Content length: ${updateData.content?.length || 0} chars`);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: updateData.title,
        slug: updateData.slug,
        excerpt: updateData.excerpt,
        content: updateData.content,
        author: updateData.author,
        category: updateData.category,
        tags: updateData.tags,
        cover_image: updateData.cover_image,
        published: updateData.published,
        published_at: updateData.published_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post não encontrado' 
      });
    }
    
    console.log(`✅ Blog post updated successfully`);
    console.log(`✅ Verified content length: ${data[0].content?.length || 0} chars`);
    
    res.json({ 
      success: true, 
      message: 'Artigo atualizado com sucesso!',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar artigo', 
      error: error.message 
    });
  }
});

// Endpoint: Criar novo artigo do blog
router.post('/blog-posts', express.json(), async (req, res) => {
  try {
    const postData = req.body;
    
    console.log(`\n📝 Creating new blog post...`);
    console.log(`Title: ${postData.title}`);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        author: postData.author,
        category: postData.category,
        tags: postData.tags,
        cover_image: postData.cover_image,
        published: postData.published,
        published_at: postData.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log(`✅ Blog post created successfully with ID: ${data[0].id}`);
    
    res.json({ 
      success: true, 
      message: 'Artigo criado com sucesso!',
      data: data[0]
    });

  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar artigo', 
      error: error.message 
    });
  }
});

// ========== VERSIONAMENTO ==========

// Endpoint: Listar histórico de versões
router.get('/history/:pageId/:contentType', async (req, res) => {
  try {
    const { pageId, contentType } = req.params;
    
    const { data, error } = await supabase
      .from('page_history')
      .select('id, saved_at, created_by')
      .eq('page_id', pageId.toLowerCase())
      .eq('content_type', contentType)
      .order('saved_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    res.json({ success: true, versions: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Obter versão específica
router.get('/history/:pageId/:contentType/:versionId', async (req, res) => {
  try {
    const { pageId, contentType, versionId } = req.params;
    
    const { data, error } = await supabase
      .from('page_history')
      .select('*')
      .eq('page_id', pageId.toLowerCase())
      .eq('content_type', contentType)
      .eq('id', versionId)
      .single();
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      version: {
        id: data.id,
        content: data.content,
        css: data.css,
        saved_at: data.saved_at,
        created_by: data.created_by
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: Restaurar versão
router.post('/restore-version', express.json(), async (req, res) => {
  try {
    const { pageId, contentType, versionId } = req.body;
    
    if (!pageId || !contentType || !versionId) {
      return res.status(400).json({ error: 'pageId, contentType e versionId são obrigatórios' });
    }
    
    // Buscar a versão do histórico
    const { data: version, error: fetchError } = await supabase
      .from('page_history')
      .select('*')
      .eq('page_id', pageId.toLowerCase())
      .eq('content_type', contentType)
      .eq('id', versionId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Buscar conteúdo atual para criar backup
    if (contentType === 'json') {
      const { data: currentData } = await supabase
        .from('page_contents')
        .select('content')
        .eq('page_id', pageId.toLowerCase())
        .single();
      
      if (currentData?.content) {
        await createHistoryBackup(pageId, 'json', currentData.content);
      }
      
      // Restaurar versão
      const { error: restoreError } = await supabase
        .from('page_contents')
        .upsert({
          page_id: pageId.toLowerCase(),
          content: version.content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id'
        });
      
      if (restoreError) throw restoreError;
      
    } else if (contentType === 'css') {
      const { data: currentData } = await supabase
        .from('page_styles')
        .select('css')
        .eq('page_id', pageId.toLowerCase())
        .single();
      
      if (currentData?.css) {
        await createHistoryBackup(pageId, 'css', null, currentData.css);
      }
      
      // Restaurar versão
      const { error: restoreError } = await supabase
        .from('page_styles')
        .upsert({
          page_id: pageId.toLowerCase(),
          css: version.css,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id'
        });
      
      if (restoreError) throw restoreError;
    }
    
    console.log(`🔄 Versão restaurada: ${pageId} (${contentType}) - ID ${versionId}`);
    
    res.json({ 
      success: true, 
      message: 'Versão restaurada com sucesso!',
      restored_version: versionId
    });
    
  } catch (error) {
    console.error('Erro ao restaurar versão:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
