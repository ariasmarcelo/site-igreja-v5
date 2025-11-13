import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Função recursiva para flatten JSON em entries
 * Ex: { psicodelicos: { title: "texto" } } → [{ key: "psicodelicos.title", value: "texto" }]
 */
function flattenObject(obj, prefix = '', result = []) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Se é um objeto, verifica se tem propriedades de idioma (pt-BR, en, etc)
      const keys = Object.keys(value);
      const isTranslation = keys.some(k => k.includes('-') || k === 'pt' || k === 'en');
      
      if (isTranslation) {
        // É um objeto de tradução, salvar como valor
        result.push({ key: newKey, value });
      } else {
        // É um objeto aninhado, continuar recursão
        flattenObject(value, newKey, result);
      }
    } else if (typeof value === 'string') {
      // É um texto simples (sem tradução multi-idioma)
      result.push({ key: newKey, value: { 'pt-BR': value } });
    } else if (Array.isArray(value)) {
      // É um array, salvar cada item com índice
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          result.push({ 
            key: `${newKey}[${index}]`, 
            value: { 'pt-BR': item } 
          });
        } else if (typeof item === 'object') {
          flattenObject(item, `${newKey}[${index}]`, result);
        }
      });
    }
  }
  
  return result;
}

/**
 * Parseia CSS em propriedades individuais
 */
function parseCssToProperties(css) {
  if (!css || typeof css !== 'string') return {};
  
  const properties = {};
  
  // Regex para extrair blocos CSS: [data-json-key="chave"] { ... }
  const blockRegex = /\[data-json-key="([^"]+)"\]\s*\{([^}]+)\}/g;
  let match;
  
  const entries = [];
  
  while ((match = blockRegex.exec(css)) !== null) {
    const jsonKey = match[1];
    const cssBlock = match[2];
    
    // Parse propriedades CSS
    const props = {};
    const propRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
    let propMatch;
    
    while ((propMatch = propRegex.exec(cssBlock)) !== null) {
      const propName = propMatch[1].trim();
      const propValue = propMatch[2].trim();
      
      // Converter kebab-case para camelCase
      const camelCaseName = propName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      props[camelCaseName] = propValue;
    }
    
    if (Object.keys(props).length > 0) {
      entries.push({ key: jsonKey, properties: props });
    }
  }
  
  return entries;
}

async function migrateData() {
  console.log('🔄 Iniciando migração de dados...\n');

  try {
    // 1. Buscar dados das tabelas antigas
    console.log('📥 Buscando dados das tabelas antigas...');
    const { data: oldContents, error: contentsError } = await supabase
      .from('page_contents')
      .select('*');

    if (contentsError) throw contentsError;
    console.log(`✅ ${oldContents.length} páginas encontradas\n`);

    const { data: oldStyles, error: stylesError } = await supabase
      .from('page_styles')
      .select('*');

    if (stylesError) throw stylesError;

    let totalTextEntries = 0;
    let totalStyleEntries = 0;

    // 2. Processar cada página
    for (const page of oldContents) {
      console.log(`\n📄 Processando página: ${page.page_id}`);
      
      // Flatten JSON para entries
      const textEntries = flattenObject(page.content);
      console.log(`   📝 ${textEntries.length} entradas de texto encontradas`);
      
      // Inserir text entries em batch
      const textInserts = textEntries.map(entry => ({
        page_id: page.page_id,
        json_key: `${page.page_id}.${entry.key}`,
        content: entry.value
      }));

      if (textInserts.length > 0) {
        const { error: insertError } = await supabase
          .from('text_entries')
          .insert(textInserts);

        if (insertError) {
          console.error(`   ❌ Erro ao inserir textos: ${insertError.message}`);
        } else {
          console.log(`   ✅ ${textInserts.length} textos inseridos`);
          totalTextEntries += textInserts.length;
        }
      }
    }

    // 3. Processar estilos
    for (const page of oldStyles) {
      console.log(`\n🎨 Processando estilos: ${page.page_id}`);
      
      const styleEntries = parseCssToProperties(page.css);
      console.log(`   🎨 ${styleEntries.length} entradas de estilo encontradas`);
      
      // Inserir style entries em batch
      const styleInserts = styleEntries.map(entry => ({
        page_id: page.page_id,
        json_key: entry.key,
        css_properties: entry.properties
      }));

      if (styleInserts.length > 0) {
        const { error: insertError } = await supabase
          .from('style_entries')
          .insert(styleInserts);

        if (insertError) {
          console.error(`   ❌ Erro ao inserir estilos: ${insertError.message}`);
        } else {
          console.log(`   ✅ ${styleInserts.length} estilos inseridos`);
          totalStyleEntries += styleInserts.length;
        }
      }
    }

    console.log('\n\n✅ Migração concluída!');
    console.log(`   📝 Total de text_entries: ${totalTextEntries}`);
    console.log(`   🎨 Total de style_entries: ${totalStyleEntries}`);

    // Salvar resumo da migração
    const summary = {
      timestamp: new Date().toISOString(),
      totalPages: oldContents.length,
      totalTextEntries,
      totalStyleEntries,
      pages: oldContents.map(p => p.page_id)
    };

    const summaryFile = path.resolve(__dirname, '../backups/migration-granular/migration-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Resumo salvo em: ${summaryFile}`);

  } catch (error) {
    console.error('\n❌ Erro na migração:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateData();
