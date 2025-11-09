#!/usr/bin/env node

/**
 * SCRIPT INTELIGENTE: Atribui IDs únicos baseado em análise semântica
 * 
 * ESTRATÉGIA:
 * 1. Detecta seções via comentários HTML (<!-- Hero Section -->)
 * 2. Para cada JSXExpressionContainer com {texts.xxx}, adiciona data-json-key
 * 3. Gera IDs seguindo convenção: pageId.sectionId.jsonPath
 * 4. Valida contra JSON para garantir paths válidos
 * 5. Detecta arrays via .map() e adiciona índices [${i}]
 * 
 * EXECUÇÃO:
 * node scripts/assign-ids-smart.js [--dry-run] [--page=Index] [--verbose]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const ROOT_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales', 'pt-BR');
const OUTPUT_DIR = path.join(ROOT_DIR, 'scripts', 'output');

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const PAGE_FILTER = process.argv.find(arg => arg.startsWith('--page='))?.split('=')[1];

console.log('🧠 Script INTELIGENTE de Atribuição de IDs');
console.log('===========================================');
console.log(`🔧 Modo: ${DRY_RUN ? 'DRY RUN' : 'PRODUÇÃO'}`);
if (PAGE_FILTER) console.log(`🎯 Filtro: ${PAGE_FILTER}`);
console.log('');

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function log(msg) {
  if (VERBOSE) console.log(msg);
}

function getPageId(filename) {
  return filename.replace('.tsx', '').toLowerCase();
}

function normalizeIdentifier(str) {
  return str
    .toLowerCase()
    .replace(/[áàâã]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íìî]/g, 'i')
    .replace(/[óòôõ]/g, 'o')
    .replace(/[úùû]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function pathExistsInJSON(jsonObj, pathStr) {
  const parts = pathStr.split('.');
  let current = jsonObj;
  
  for (const part of parts) {
    if (current === undefined || current === null) return false;
    current = current[part];
  }
  
  return current !== undefined;
}

// ============================================================================
// ANÁLISE BASEADA EM REGEX (mais rápido e eficaz)
// ============================================================================

/**
 * Extrai seções do código via comentários
 */
function extractSections(code) {
  const sections = [];
  const sectionRegex = /\{\/\*\s*(.+?)\s*\*\/\}/g;
  const commentRegex = /<!--\s*(.+?)\s*-->/g;
  
  let match;
  
  // Comentários JSX: {/* Section Name */}
  while ((match = sectionRegex.exec(code)) !== null) {
    const sectionName = match[1];
    const position = match.index;
    sections.push({
      name: sectionName,
      id: normalizeIdentifier(sectionName),
      position,
      type: 'jsx-comment'
    });
  }
  
  // Comentários HTML: <!-- Section Name -->
  sectionRegex.lastIndex = 0;
  while ((match = commentRegex.exec(code)) !== null) {
    const sectionName = match[1];
    const position = match.index;
    sections.push({
      name: sectionName,
      id: normalizeIdentifier(sectionName),
      position,
      type: 'html-comment'
    });
  }
  
  return sections.sort((a, b) => a.position - b.position);
}

/**
 * Encontra seção atual para uma posição no código
 */
function getCurrentSection(position, sections) {
  let currentSection = 'root';
  
  for (const section of sections) {
    if (section.position < position) {
      currentSection = section.id;
    } else {
      break;
    }
  }
  
  return currentSection;
}

/**
 * Extrai todos os usos de {texts.xxx} no código
 */
function extractTextsUsages(code) {
  const usages = [];
  
  // Padrão: {texts.xxx.yyy}
  const textsRegex = /\{texts\.([a-zA-Z0-9_.[\]]+)\}/g;
  
  let match;
  while ((match = textsRegex.exec(code)) !== null) {
    const jsonPath = match[1];
    const position = match.index;
    const fullMatch = match[0];
    
    usages.push({
      jsonPath,
      position,
      fullMatch,
      line: code.substring(0, position).split('\n').length
    });
  }
  
  return usages;
}

/**
 * Extrai elementos JSX que contêm texts.xxx
 */
function extractJSXElements(code) {
  const elements = [];
  
  // Padrão: <Tag ...>{texts.xxx}</Tag> ou <Tag ...>{...}</Tag>
  const jsxRegex = /<([A-Z][a-zA-Z0-9.]*|[a-z]+)(\s+[^>]*)?>([\s\S]*?)<\/\1>/g;
  
  let match;
  while ((match = jsxRegex.exec(code)) !== null) {
    const tagName = match[1];
    const attributes = match[2] || '';
    const content = match[3];
    const position = match.index;
    
    // Verificar se já tem data-json-key
    if (attributes.includes('data-json-key')) {
      continue;
    }
    
    // Verificar se conteúdo tem texts.xxx
    const textsMatch = /\{texts\.([a-zA-Z0-9_.[\]]+)\}/.exec(content);
    if (textsMatch) {
      const jsonPath = textsMatch[1];
      
      elements.push({
        tagName,
        attributes,
        content,
        position,
        jsonPath,
        line: code.substring(0, position).split('\n').length,
        fullMatch: match[0]
      });
    }
  }
  
  return elements;
}

/**
 * Detecta se elemento está dentro de .map()
 */
function detectArrayContext(code, position) {
  // Buscar .map() antes da posição
  const beforeCode = code.substring(Math.max(0, position - 500), position);
  
  const mapRegex = /(\w+)\.map\(\((\w+),?\s*(\w*)\)\s*=>/g;
  const matches = [...beforeCode.matchAll(mapRegex)];
  
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    return {
      arrayName: lastMatch[1],
      itemName: lastMatch[2],
      indexName: lastMatch[3] || 'index'
    };
  }
  
  return null;
}

// ============================================================================
// GERAÇÃO DE IDs
// ============================================================================

/**
 * Gera ID único seguindo convenção inteligente
 */
function generateSmartId(pageId, section, jsonPath, arrayIndex = null) {
  let id = pageId;
  
  // Adicionar seção (se não for root)
  if (section && section !== 'root') {
    id += `.${section}`;
  }
  
  // Adicionar path JSON
  if (jsonPath) {
    id += `.${jsonPath}`;
  }
  
  // Adicionar índice de array
  if (arrayIndex !== null) {
    id += `[${arrayIndex}]`;
  }
  
  return id;
}

/**
 * Processa arquivo TSX e adiciona IDs
 */
function processFile(file, jsonContent) {
  const pageId = getPageId(file.name);
  let code = file.content;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📄 ${file.name} (pageId: ${pageId})`);
  console.log('='.repeat(60));
  
  // Extrair seções
  const sections = extractSections(code);
  console.log(`📍 Seções detectadas: ${sections.length}`);
  sections.forEach(s => log(`   - ${s.name} (${s.id})`));
  
  // Extrair elementos JSX
  const elements = extractJSXElements(code);
  console.log(`🔍 Elementos com texts.xxx: ${elements.length}`);
  
  // Gerar IDs e transformações
  const transformations = [];
  const usedIds = new Set();
  const warnings = [];
  
  for (const element of elements) {
    const section = getCurrentSection(element.position, sections);
    const arrayContext = detectArrayContext(code, element.position);
    
    // Gerar ID
    let id = generateSmartId(
      pageId,
      section,
      element.jsonPath,
      arrayContext ? '${' + (arrayContext.indexName || 'index') + '}' : null
    );
    
    // Verificar duplicatas
    if (usedIds.has(id) && !arrayContext) {
      let counter = 1;
      const baseId = id;
      while (usedIds.has(id)) {
        id = `${baseId}_${counter}`;
        counter++;
      }
      warnings.push(`Duplicata detectada: ${baseId} → ${id}`);
    }
    
    usedIds.add(id);
    
    // Validar se path existe no JSON
    const jsonPathToValidate = element.jsonPath.replace(/\[.*?\]/g, '');
    if (!pathExistsInJSON(jsonContent, jsonPathToValidate)) {
      warnings.push(`Path não encontrado no JSON: ${jsonPathToValidate}`);
    }
    
    transformations.push({
      element,
      id,
      section,
      arrayContext,
      line: element.line
    });
    
    log(`   Line ${element.line}: <${element.tagName}> → ${id}`);
  }
  
  console.log(`✅ IDs gerados: ${transformations.length}`);
  if (warnings.length > 0) {
    console.log(`⚠️  Avisos: ${warnings.length}`);
    warnings.slice(0, 5).forEach(w => console.log(`   - ${w}`));
    if (warnings.length > 5) {
      console.log(`   ... e mais ${warnings.length - 5} avisos`);
    }
  }
  
  // Aplicar transformações
  console.log(`\n🔧 Aplicando transformações...`);
  
  // Ordenar por posição reversa para não invalidar índices
  transformations.sort((a, b) => b.element.position - a.element.position);
  
  for (const trans of transformations) {
    const { element, id, arrayContext } = trans;
    
    // Construir novo elemento com data-json-key
    const openingTag = `<${element.tagName}`;
    const idAttr = arrayContext
      ? ` data-json-key={\`${id}\`}`
      : ` data-json-key="${id}"`;
    
    const newOpeningTag = element.attributes
      ? `${openingTag}${element.attributes}${idAttr}>`
      : `${openingTag}${idAttr}>`;
    
    const newElement = element.fullMatch.replace(
      `<${element.tagName}${element.attributes || ''}>`,
      newOpeningTag
    );
    
    // Substituir no código
    code = code.substring(0, element.position) + newElement + code.substring(element.position + element.fullMatch.length);
  }
  
  return {
    code,
    transformations,
    warnings
  };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  // Ler arquivos
  const tsxFiles = fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.tsx'))
    .filter(f => !PAGE_FILTER || getPageId(f) === PAGE_FILTER.toLowerCase())
    .map(f => ({
      name: f,
      path: path.join(PAGES_DIR, f),
      content: fs.readFileSync(path.join(PAGES_DIR, f), 'utf-8')
    }));
  
  const jsonFiles = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(LOCALES_DIR, f),
      content: JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, f), 'utf-8'))
    }));
  
  const jsonMap = new Map();
  jsonFiles.forEach(f => {
    const pageId = getPageId(f.name);
    jsonMap.set(pageId, f.content);
    // Também mapear versão com primeira letra maiúscula
    const capitalizedPageId = f.name.replace('.json', '');
    jsonMap.set(capitalizedPageId.toLowerCase(), f.content);
  });
  
  console.log(`📚 ${tsxFiles.length} páginas, ${jsonFiles.length} locales\n`);
  
  // Processar cada arquivo
  const results = [];
  
  for (const file of tsxFiles) {
    const pageId = getPageId(file.name);
    const jsonContent = jsonMap.get(pageId);
    
    if (!jsonContent) {
      console.log(`⚠️  JSON não encontrado para: ${file.name}`);
      continue;
    }
    
    const result = processFile(file, jsonContent);
    results.push({ file, result });
    
    // Salvar arquivo
    if (DRY_RUN) {
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
      const outputPath = path.join(OUTPUT_DIR, file.name);
      fs.writeFileSync(outputPath, result.code, 'utf-8');
      console.log(`📋 Salvo em: scripts/output/${file.name}`);
    } else {
      fs.writeFileSync(file.path, result.code, 'utf-8');
      console.log(`💾 ✓ Arquivo atualizado`);
    }
  }
  
  // Relatório final
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(60));
  
  const totalFiles = results.length;
  const totalTransformations = results.reduce((sum, r) => sum + r.result.transformations.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.result.warnings.length, 0);
  
  console.log(`✅ Arquivos processados: ${totalFiles}`);
  console.log(`🆔 IDs adicionados: ${totalTransformations}`);
  console.log(`⚠️  Avisos: ${totalWarnings}`);
  
  if (DRY_RUN) {
    console.log(`\n📋 Arquivos salvos em: scripts/output/`);
    console.log(`   Execute sem --dry-run para aplicar mudanças`);
  }
  
  console.log('\n✨ Concluído!\n');
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
