// Servidor local Express para APIs - VERSÃO GRANULAR
// Replica as funções serverless da Vercel localmente
// Usa estrutura granular: text_entries e style_entries
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

/**
 * Reconstrói objeto aninhado a partir de entries granulares
 * Ex: "psicodelicos.title" → { psicodelicos: { title: "valor" } }
 */
function reconstructObject(entries, pageId) {
  const result = {};
  
  entries.forEach(entry => {
    // Remove prefixo pageId. da json_key
    let key = entry.json_key;
    if (key.startsWith(`${pageId}.`)) {
      key = key.substring(pageId.length + 1);
    }
    
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Handle array notation: items[0]
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        if (!current[arrayName]) {
          current[arrayName] = [];
        }
        
        if (i === parts.length - 1) {
          // Last part - assign value
          current[arrayName][index] = entry.content['pt-BR'] || entry.content;
        } else {
          // More parts to go - create nested object
          if (!current[arrayName][index]) {
            current[arrayName][index] = {};
          }
          current = current[arrayName][index];
        }
      } else {
        // Regular property
        if (i === parts.length - 1) {
          // Last part - assign value
          current[part] = entry.content['pt-BR'] || entry.content;
        } else {
          // More parts to go - create nested object
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      }
    }
  });
  
  return result;
}

/**
 * Converte CSS properties (JSONB) em CSS string
 */
function cssPropertiesToString(entries) {
  let css = '';
  
  entries.forEach(entry => {
    const { json_key, css_properties } = entry;
    
    if (!css_properties || Object.keys(css_properties).length === 0) {
      return;
    }
    
    // Converter camelCase para kebab-case
    const cssLines = Object.entries(css_properties).map(([prop, value]) => {
      const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${kebabProp}: ${value};`;
    });
    
    css += `[data-json-key="${json_key}"] {\n${cssLines.join('\n')}\n}\n\n`;
  });
  
  return css;
}

// GET /api/content/:pageId
app.get('/api/content/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    console.log(`📥 GET /api/content/${pageId}`);
    
    // Buscar todas as entries desta página
    const { data, error } = await supabase
      .from('text_entries')
      .select('json_key, content')
      .eq('page_id', pageId);
    
    if (error) throw error;
    
    // Reconstruir objeto aninhado
    const content = reconstructObject(data, pageId);
    
    console.log(`✅ ${data.length} entries carregadas`);
    
    res.json({ content });
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
    
    console.log(`🎨 GET /api/styles/${pageId}`);
    
    // Buscar todas as style entries desta página
    const { data, error } = await supabase
      .from('style_entries')
      .select('json_key, css_properties')
      .eq('page_id', pageId);
    
    if (error) throw error;
    
    // Converter para CSS string
    const css = cssPropertiesToString(data);
    
    console.log(`✅ ${data.length} style entries carregadas`);
    
    res.json({ css });
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
    console.log('📥 POST /api/save-visual-edits (GRANULAR)');
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
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Processar cada edição individualmente
    for (const [jsonKey, edit] of Object.entries(edits)) {
      if (edit.newText === undefined) {
        continue;
      }
      
      try {
        // Determinar o content baseado no idioma
        const content = { 'pt-BR': edit.newText };
        
        // Upsert na tabela text_entries
        const { error: upsertError } = await supabase
          .from('text_entries')
          .upsert({
            page_id: pageId,
            json_key: jsonKey,
            content: content
          }, {
            onConflict: 'json_key'
          });
        
        if (upsertError) {
          console.error(`❌ Erro ao salvar ${jsonKey}:`, upsertError.message);
          errorCount++;
          errors.push({ key: jsonKey, error: upsertError.message });
        } else {
          console.log(`✅ Salvo: ${jsonKey}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exceção ao salvar ${jsonKey}:`, err.message);
        errorCount++;
        errors.push({ key: jsonKey, error: err.message });
      }
    }
    
    console.log(`📊 Resultado: ${successCount} sucesso, ${errorCount} erros`);
    console.log('═══════════════════════════════════════════\n');
    
    if (errorCount > 0) {
      return res.status(500).json({
        success: false,
        message: `Salvo ${successCount} de ${successCount + errorCount} alterações`,
        successCount,
        errorCount,
        errors
      });
    }
    
    res.json({
      success: true,
      message: `${successCount} alterações salvas com sucesso!`,
      count: successCount
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao salvar alterações',
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
    console.log('🎨 POST /api/save-styles (GRANULAR)');
    console.log('   pageId:', pageId);
    console.log('   css length:', css?.length || 0);
    console.log('═══════════════════════════════════════════');
    
    if (!css || typeof css !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'CSS inválido: deve ser uma string'
      });
    }
    
    // Parse CSS para extrair entries individuais
    const blockRegex = /\[data-json-key="([^"]+)"\]\s*\{([^}]+)\}/g;
    let match;
    const entries = [];
    
    while ((match = blockRegex.exec(css)) !== null) {
      const jsonKey = match[1];
      const cssBlock = match[2];
      
      // Parse propriedades CSS
      const properties = {};
      const propRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
      let propMatch;
      
      while ((propMatch = propRegex.exec(cssBlock)) !== null) {
        const propName = propMatch[1].trim();
        const propValue = propMatch[2].trim();
        
        // Converter kebab-case para camelCase
        const camelCaseName = propName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        properties[camelCaseName] = propValue;
      }
      
      if (Object.keys(properties).length > 0) {
        entries.push({
          page_id: pageId,
          json_key: jsonKey,
          css_properties: properties
        });
      }
    }
    
    console.log(`📊 ${entries.length} style entries para salvar`);
    
    // Salvar cada entry
    let successCount = 0;
    let errorCount = 0;
    
    for (const entry of entries) {
      try {
        const { error: upsertError } = await supabase
          .from('style_entries')
          .upsert(entry, { onConflict: 'json_key' });
        
        if (upsertError) {
          console.error(`❌ Erro ao salvar estilo ${entry.json_key}:`, upsertError.message);
          errorCount++;
        } else {
          console.log(`✅ Estilo salvo: ${entry.json_key}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exceção ao salvar estilo ${entry.json_key}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`📊 Resultado: ${successCount} sucesso, ${errorCount} erros`);
    console.log('═══════════════════════════════════════════\n');
    
    if (errorCount > 0) {
      return res.status(500).json({
        success: false,
        message: `Salvos ${successCount} de ${entries.length} estilos`,
        successCount,
        errorCount
      });
    }
    
    res.json({
      success: true,
      message: `${successCount} estilos salvos com sucesso!`,
      count: successCount
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar estilos CSS no banco de dados',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /api/save-json (salvar JSON completo - backward compatibility)
app.post('/api/save-json', async (req, res) => {
  try {
    const { pageId, content } = req.body;
    
    console.log('═══════════════════════════════════════════');
    console.log('📄 POST /api/save-json (GRANULAR - FLATTEN)');
    console.log('   pageId:', pageId);
    console.log('═══════════════════════════════════════════');
    
    if (!content || typeof content !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Content inválido: deve ser um objeto'
      });
    }
    
    // Flatten object para criar entries
    function flattenObject(obj, prefix = '') {
      const entries = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Verificar se é tradução
          const keys = Object.keys(value);
          const isTranslation = keys.some(k => k.includes('-') || k === 'pt' || k === 'en');
          
          if (isTranslation) {
            entries.push({ key: newKey, value });
          } else {
            entries.push(...flattenObject(value, newKey));
          }
        } else if (typeof value === 'string') {
          entries.push({ key: newKey, value: { 'pt-BR': value } });
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string') {
              entries.push({ 
                key: `${newKey}[${index}]`, 
                value: { 'pt-BR': item } 
              });
            } else if (typeof item === 'object') {
              entries.push(...flattenObject(item, `${newKey}[${index}]`));
            }
          });
        }
      }
      
      return entries;
    }
    
    const entries = flattenObject(content);
    console.log(`📊 ${entries.length} entries para salvar`);
    
    // Salvar todas as entries
    const inserts = entries.map(entry => ({
      page_id: pageId,
      json_key: `${pageId}.${entry.key}`,
      content: entry.value
    }));
    
    // Delete existing entries for this page and insert new ones
    const { error: deleteError } = await supabase
      .from('text_entries')
      .delete()
      .eq('page_id', pageId);
    
    if (deleteError) throw deleteError;
    
    const { error: insertError } = await supabase
      .from('text_entries')
      .insert(inserts);
    
    if (insertError) throw insertError;
    
    console.log(`✅ ${inserts.length} entries salvas`);
    console.log('═══════════════════════════════════════════\n');
    
    res.json({
      success: true,
      message: `Página salva com sucesso! (${inserts.length} entries)`,
      count: inserts.length
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao salvar JSON no banco de dados',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API Server (GRANULAR) rodando',
    version: '2.0-granular'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log('🚀 API Server LOCAL (ESTRUTURA GRANULAR)');
  console.log(`   Porta: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log('   Tabelas: text_entries, style_entries');
  console.log('═══════════════════════════════════════════\n');
});
