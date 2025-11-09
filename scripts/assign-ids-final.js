#!/usr/bin/env node

/**
 * SCRIPT FINAL: Atribuição Inteligente de IDs Únicos
 * 
 * ESTRATÉGIA APRIMORADA:
 * 1. Encontra todos os {texts.xxx} no código
 * 2. Para cada um, busca o elemento JSX pai MAIS PRÓXIMO (busca reversa)
 * 3. Verifica se elemento já tem data-json-key
 * 4. Gera ID baseado em: seção + jsonPath + contexto de array
 * 5. Injeta data-json-key no elemento (suporta multi-linha e atributos complexos)
 * 
 * EXECUÇÃO:
 * node scripts/assign-ids-final.js [--dry-run] [--page=Index] [--verbose]
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

console.log('🎯 Script FINAL - Atribuição Inteligente de IDs');
console.log('================================================');
console.log(`🔧 Modo: ${DRY_RUN ? 'DRY RUN (preview)' : '🔴 PRODUÇÃO (vai modificar arquivos!)'}`);
if (PAGE_FILTER) console.log(`🎯 Filtro: ${PAGE_FILTER}`);
console.log('');

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function log(...args) {
  if (VERBOSE) console.log(...args);
}

function getPageId(filename) {
  return filename.replace(/\.(tsx|json)$/, '').toLowerCase();
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
    // Remover índices de array para validação
    const cleanPart = part.replace(/\[\d+\]/, '');
    current = current[cleanPart];
  }
  
  return current !== undefined;
}

// ============================================================================
// EXTRAÇÃO DE INFORMAÇÕES
// ============================================================================

/**
 * Extrai seções do código via comentários
 */
function extractSections(code) {
  const sections = [];
  
  // Comentários JSX: {/* Section Name */}
  const jsxCommentRegex = /\{\/\*\s*(.+?)\s*\*\/\}/g;
  let match;
  
  while ((match = jsxCommentRegex.exec(code)) !== null) {
    const sectionName = match[1];
    sections.push({
      name: sectionName,
      id: normalizeIdentifier(sectionName),
      position: match.index,
      end: match.index + match[0].length
    });
  }
  
  return sections.sort((a, b) => a.position - b.position);
}

/**
 * Encontra seção atual para uma posição
 */
function getCurrentSection(position, sections) {
  for (let i = sections.length - 1; i >= 0; i--) {
    if (sections[i].position < position) {
      return sections[i].id;
    }
  }
  return null;
}

/**
 * Encontra todos os usos de {texts.xxx}
 */
function findTextsUsages(code) {
  const usages = [];
  const regex = /\{texts\.([a-zA-Z0-9_.[\]]+)\}/g;
  
  let match;
  while ((match = regex.exec(code)) !== null) {
    usages.push({
      jsonPath: match[1],
      position: match.index,
      fullMatch: match[0],
      line: code.substring(0, match.index).split('\n').length
    });
  }
  
  return usages;
}

/**
 * Busca reversa: encontra tag de abertura JSX mais próxima ANTES da posição
 * MELHORADA: Não captura tags incompletas ou quebradas
 */
function findOpeningTagBefore(code, position) {
  // Buffer para análise (2000 caracteres antes)
  const searchStart = Math.max(0, position - 2000);
  const searchCode = code.substring(searchStart, position);
  
  // Regex MELHORADA: captura tags completas apenas
  // (?<!\=) - Negative lookbehind: não capturar se precedido por =
  // Isso evita pegar tags no meio de atributos como onClick={() =>
  const tagRegex = /<(\/)?([\w.]+)((?:\s+[a-zA-Z][a-zA-Z0-9-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^\s>]+))?)*)\s*(\/?)>/g;
  
  const tags = [];
  let tagMatch;
  
  while ((tagMatch = tagRegex.exec(searchCode)) !== null) {
    const isClosing = !!tagMatch[1];
    const isSelfClosing = !!tagMatch[4];
    const tagName = tagMatch[2] || 'Fragment';
    const attributes = tagMatch[3] || '';
    const fullMatch = tagMatch[0];
    const absolutePos = searchStart + tagMatch.index;
    
    // VALIDAÇÃO: verificar se não é uma tag no meio de um atributo
    const beforeTag = searchCode.substring(Math.max(0, tagMatch.index - 20), tagMatch.index);
    
    // Pular se houver = ou => imediatamente antes (indica atributo inline)
    if (/[=]\s*$/.test(beforeTag)) {
      continue;
    }
    
    tags.push({
      name: tagName,
      isClosing,
      isSelfClosing,
      attributes: attributes.trim(),
      fullMatch,
      position: absolutePos,
      index: tagMatch.index
    });
  }
  
  // Percorrer tags de trás para frente para encontrar o par correto
  let depth = 0;
  for (let i = tags.length - 1; i >= 0; i--) {
    const tag = tags[i];
    
    if (tag.isClosing) {
      depth++;
    } else if (!tag.isSelfClosing) {
      if (depth === 0) {
        // Encontramos a tag de abertura correta!
        
        // FILTRO: Ignorar elementos de navegação/link
        // Esses elementos nunca devem receber data-json-key pois criam conflitos
        // quando contêm elementos editáveis (como Button)
        const navigationTags = ['a', 'Link', 'nav', 'NavLink'];
        if (navigationTags.includes(tag.name)) {
          // Pular este elemento e continuar procurando o próximo pai
          depth--;
          continue;
        }
        
        return tag;
      }
      depth--;
    }
  }
  
  return null;
}

/**
 * Detecta se está dentro de .map()
 */
function detectArrayContext(code, position) {
  const beforeCode = code.substring(Math.max(0, position - 800), position);
  
  // Procurar .map() mais recente
  const mapRegex = /(\w+)\.map\(\((\w+),?\s*(\w*)\)\s*=>/g;
  const matches = [...beforeCode.matchAll(mapRegex)];
  
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    
    // Verificar se estamos dentro deste .map() (buscar o fechamento)
    const afterMap = code.substring(position, Math.min(code.length, position + 500));
    const hasClosingBracket = afterMap.includes(')}');
    
    if (hasClosingBracket) {
      return {
        arrayName: lastMatch[1],
        itemName: lastMatch[2],
        indexName: lastMatch[3] || 'index'
      };
    }
  }
  
  return null;
}

/**
 * Verifica se tag já tem data-json-key
 */
function hasDataJsonKey(attributes) {
  return /data-json-key\s*=/.test(attributes);
}

/**
 * Gera ID único
 */
function generateId(pageId, section, jsonPath, arrayContext) {
  let id = pageId;
  
  // NÃO adicionar seção - ela é apenas para debug/contexto
  // O ID deve mapear diretamente para o path JSON: pageId.jsonPath
  // Isso garante que index.hero.title corresponde a texts.hero.title no JSON
  
  if (jsonPath) {
    id += `.${jsonPath}`;
  }
  
  if (arrayContext) {
    // Template string para interpolação dinâmica
    return `\${${id}[\${${arrayContext.indexName}}]}`;
  }
  
  return id;
}

// ============================================================================
// TRANSFORMAÇÃO
// ============================================================================

/**
 * Injeta data-json-key em um elemento (substitui se já existir)
 * ESTRATÉGIA MELHORADA: Detecta corretamente o fechamento da tag
 */
function injectDataJsonKey(code, tag, id, arrayContext) {
  const { position, fullMatch, attributes } = tag;
  
  // Construir novo atributo
  const idAttr = arrayContext
    ? ` data-json-key={\`${id}\`}`
    : ` data-json-key="${id}"`;
  
  // Construir nova tag
  let newTag;
  
  // Remover data-json-key existente se houver
  let cleanedMatch = fullMatch;
  if (hasDataJsonKey(attributes)) {
    // Remover data-json-key antigo (string ou template string)
    cleanedMatch = cleanedMatch
      .replace(/\s+data-json-key\s*=\s*"[^"]*"/g, '')
      .replace(/\s+data-json-key\s*=\s*\{`[^`]*`\}/g, '');
  }
  
  // ESTRATÉGIA: Procurar o ÚLTIMO > ou /> na tag
  // Isso garante que não injetamos no meio de atributos inline
  const tagClosingRegex = /(\/?>)$/;
  const match = cleanedMatch.match(tagClosingRegex);
  
  if (match) {
    // Inserir data-json-key ANTES do fechamento da tag
    const closingPos = cleanedMatch.lastIndexOf(match[1]);
    newTag = cleanedMatch.substring(0, closingPos) + idAttr + cleanedMatch.substring(closingPos);
  } else {
    // Fallback: tentar método anterior
    if (attributes || hasDataJsonKey(fullMatch)) {
      newTag = cleanedMatch.replace(
        /(\s*)(\/?>)$/,
        `${idAttr}$2`
      );
    } else {
      newTag = cleanedMatch.replace(
        /(<[\w.]+)(\/?>)$/,
        `$1${idAttr}$2`
      );
    }
  }
  
  // Substituir no código
  const before = code.substring(0, position);
  const after = code.substring(position + fullMatch.length);
  
  return {
    code: before + newTag + after,
    newTag,
    oldTag: fullMatch,
    position
  };
}

/**
 * Processa um arquivo TSX
 */
function processFile(file, jsonContent) {
  const pageId = getPageId(file.name);
  let code = file.content;
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📄 ${file.name} (${pageId})`);
  console.log('='.repeat(70));
  
  // Extrair informações
  const sections = extractSections(code);
  const textsUsages = findTextsUsages(code);
  
  console.log(`📍 Seções: ${sections.length}`);
  console.log(`🔍 Usos de texts.xxx: ${textsUsages.length}`);
  
  if (VERBOSE) {
    sections.forEach(s => log(`   📂 ${s.name} (${s.id})`));
  }
  
  // Processar cada uso de texts.xxx
  const transformations = [];
  const warnings = [];
  const skipped = [];
  
  // Ordenar por posição reversa para não invalidar índices
  const sortedUsages = [...textsUsages].sort((a, b) => b.position - a.position);
  
  for (const usage of sortedUsages) {
    log(`\n🔍 Linha ${usage.line}: {texts.${usage.jsonPath}}`);
    
    // Encontrar elemento pai
    const tag = findOpeningTagBefore(code, usage.position);
    
    if (!tag) {
      warnings.push(`Linha ${usage.line}: Não encontrou tag pai para {texts.${usage.jsonPath}}`);
      log(`   ⚠️  Não encontrou tag pai`);
      continue;
    }
    
    log(`   📌 Tag encontrada: <${tag.name}>`);
    
    // Verificar se já tem data-json-key (apenas para log, não pular)
    const alreadyHasId = hasDataJsonKey(tag.attributes);
    if (alreadyHasId) {
      log(`   🔄 Substituindo data-json-key existente`);
    }
    
    // Determinar seção
    const section = getCurrentSection(usage.position, sections);
    log(`   📂 Seção: ${section || 'root'}`);
    
    // Detectar array context
    const arrayContext = detectArrayContext(code, usage.position);
    if (arrayContext) {
      log(`   📊 Array: ${arrayContext.arrayName}[${arrayContext.indexName}]`);
    }
    
    // Gerar ID
    const id = generateId(pageId, section, usage.jsonPath, arrayContext);
    log(`   🆔 ID gerado: ${id}`);
    
    // Validar path no JSON
    const pathToValidate = usage.jsonPath.replace(/\[.*?\]/g, '');
    if (!pathExistsInJSON(jsonContent, pathToValidate)) {
      warnings.push(`Path não encontrado no JSON: ${pathToValidate}`);
      log(`   ⚠️  Path não existe no JSON`);
    }
    
    // Injetar ID
    const result = injectDataJsonKey(code, tag, id, arrayContext);
    code = result.code;
    
    transformations.push({
      line: usage.line,
      tagName: tag.name,
      jsonPath: usage.jsonPath,
      id,
      section,
      arrayContext: !!arrayContext,
      replaced: alreadyHasId
    });
    
    log(`   ✅ ID ${alreadyHasId ? 'substituído' : 'injetado'}`);
  }
  
  // Relatório
  const newIds = transformations.filter(t => !t.replaced).length;
  const replacedIds = transformations.filter(t => t.replaced).length;
  
  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ IDs novos: ${newIds}`);
  console.log(`   🔄 IDs substituídos: ${replacedIds}`);
  console.log(`   📝 Total processado: ${transformations.length}`);
  console.log(`   ⚠️  Avisos: ${warnings.length}`);
  
  if (warnings.length > 0 && VERBOSE) {
    console.log(`\n⚠️  Avisos detalhados:`);
    warnings.slice(0, 10).forEach(w => console.log(`   - ${w}`));
    if (warnings.length > 10) {
      console.log(`   ... e mais ${warnings.length - 10} avisos`);
    }
  }
  
  return {
    code,
    transformations,
    warnings,
    skipped
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
  
  // Mapear JSONs
  const jsonMap = new Map();
  jsonFiles.forEach(f => {
    const pageId = getPageId(f.name);
    jsonMap.set(pageId, f.content);
  });
  
  console.log(`📚 ${tsxFiles.length} páginas TSX, ${jsonFiles.length} arquivos JSON\n`);
  
  if (tsxFiles.length === 0) {
    console.log('❌ Nenhuma página encontrada para processar!');
    return;
  }
  
  // Processar arquivos
  const results = [];
  
  for (const file of tsxFiles) {
    const pageId = getPageId(file.name);
    const jsonContent = jsonMap.get(pageId);
    
    if (!jsonContent) {
      console.log(`\n⚠️  JSON não encontrado para: ${file.name}`);
      continue;
    }
    
    try {
      const result = processFile(file, jsonContent);
      results.push({ file, result });
      
      // Salvar arquivo
      if (DRY_RUN) {
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        const outputPath = path.join(OUTPUT_DIR, file.name);
        fs.writeFileSync(outputPath, result.code, 'utf-8');
        console.log(`\n📋 Preview salvo em: scripts/output/${file.name}`);
      } else {
        // Criar backup antes de sobrescrever
        const backupPath = file.path + '.backup';
        fs.copyFileSync(file.path, backupPath);
        
        fs.writeFileSync(file.path, result.code, 'utf-8');
        console.log(`\n💾 ✓ Arquivo atualizado (backup: ${path.basename(backupPath)})`);
      }
    } catch (error) {
      console.error(`\n❌ Erro ao processar ${file.name}:`, error.message);
    }
  }
  
  // Relatório final
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(70));
  
  const totalFiles = results.length;
  const totalNew = results.reduce((sum, r) => 
    sum + r.result.transformations.filter(t => !t.replaced).length, 0);
  const totalReplaced = results.reduce((sum, r) => 
    sum + r.result.transformations.filter(t => t.replaced).length, 0);
  const totalProcessed = totalNew + totalReplaced;
  const totalWarnings = results.reduce((sum, r) => sum + r.result.warnings.length, 0);
  
  console.log(`\n✅ Arquivos processados: ${totalFiles}`);
  console.log(`🆔 IDs novos: ${totalNew}`);
  console.log(`🔄 IDs substituídos: ${totalReplaced}`);
  console.log(`📝 Total de elementos: ${totalProcessed}`);
  console.log(`⚠️  Avisos: ${totalWarnings}`);
  
  if (DRY_RUN) {
    console.log(`\n📋 Modo DRY RUN - Arquivos preview em: scripts/output/`);
    console.log(`   Para aplicar mudanças, execute:`);
    console.log(`   node scripts/assign-ids-final.js ${PAGE_FILTER ? '--page=' + PAGE_FILTER : ''}`);
  } else {
    console.log(`\n✅ Mudanças aplicadas! Backups criados com extensão .backup`);
  }
  
  console.log('\n✨ Concluído!\n');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
