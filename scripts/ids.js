#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  SCRIPT DEFINITIVO: Verificação e Correção de IDs Únicos         ║
 * ║  Análise profunda + Correção automática + Relatório completo     ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * FUNCIONALIDADES:
 * ✓ Verifica todos os elementos editáveis ({texts.xxx})
 * ✓ Detecta contexto de arrays (.map)
 * ✓ Suporta nested structures e JSX complexo
 * ✓ Corrige automaticamente IDs faltantes
 * ✓ Relatório detalhado com estatísticas
 * ✓ Backups automáticos antes de modificar
 * 
 * MODOS:
 * --check      : Apenas verifica (padrão)
 * --fix        : Corrige automaticamente
 * --dry-run    : Preview das correções
 * --page=Nome  : Processar apenas uma página
 * --verbose    : Output detalhado
 * 
 * EXECUÇÃO:
 * node scripts/ids.js                    # Verifica apenas
 * node scripts/ids.js --fix              # Verifica e corrige
 * node scripts/ids.js --fix --dry-run    # Preview
 * node scripts/ids.js --page=Index --fix # Página específica
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

const CHECK_ONLY = !process.argv.includes('--fix');
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const PAGE_FILTER = process.argv.find(arg => arg.startsWith('--page='))?.split('=')[1];

// ============================================================================
// BANNER
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║  🎯 Script Definitivo - Verificação e Correção de IDs Únicos     ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
console.log(`🔧 Modo: ${CHECK_ONLY ? '🔍 CHECK' : DRY_RUN ? '👁️  DRY-RUN' : '🔴 FIX'}`);
if (PAGE_FILTER) console.log(`🎯 Filtro: ${PAGE_FILTER}.tsx`);
console.log('');

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function log(...args) {
  if (VERBOSE) console.log(...args);
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

// ============================================================================
// ANÁLISE DE CONTEXTO
// ============================================================================

/**
 * Detecta contexto de array (.map)
 */
function detectArrayContext(code, position) {
  const beforeCode = code.substring(Math.max(0, position - 800), position);
  
  // Procurar .map() mais recente
  const mapRegex = /(\w+)\.map\(\((\w+),?\s*(\w*)\)\s*=>/g;
  const matches = [...beforeCode.matchAll(mapRegex)];
  
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    
    // Verificar se estamos dentro deste .map()
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
 * Encontra tag JSX pai mais próxima
 * Suporta nested structures e tags complexas
 */
function findParentTag(code, position) {
  let startPos = position;
  let openTagPos = -1;
  let depth = 0;
  
  // Buscar para trás até encontrar tag de abertura
  for (let i = startPos; i >= 0; i--) {
    if (code[i] === '>') depth++;
    if (code[i] === '<') {
      depth--;
      if (depth < 0) {
        openTagPos = i;
        break;
      }
    }
  }
  
  if (openTagPos === -1) return null;
  
  // Encontrar fim da tag de abertura
  let closeTagPos = code.indexOf('>', openTagPos);
  if (closeTagPos === -1) return null;
  
  // Extrair tag completa
  const tagContent = code.substring(openTagPos, closeTagPos + 1);
  
  // Pegar nome da tag
  const tagMatch = tagContent.match(/<(\/)?([\w.]+)/);
  const tagName = tagMatch ? tagMatch[2] : 'unknown';
  
  // Ignorar tags de navegação (causam conflitos)
  const navigationTags = ['a', 'Link', 'nav', 'NavLink', 'Button'];
  if (navigationTags.includes(tagName)) {
    // Procurar próximo pai
    return findParentTag(code, openTagPos - 1);
  }
  
  // Verificar se é self-closing
  const isSelfClosing = tagContent.trim().endsWith('/>');
  
  return {
    content: tagContent,
    start: openTagPos,
    end: closeTagPos + 1,
    name: tagName,
    isSelfClosing,
    hasDataJsonKey: /data-json-key\s*=/.test(tagContent)
  };
}

/**
 * Extrai caminho JSON de {texts.xxx.yyy}
 */
function extractJsonPath(textUsage) {
  const match = textUsage.match(/\{texts(\?)?\.([a-zA-Z0-9_.[\]]+)\}/);
  return match ? match[2] : null;
}

// ============================================================================
// GERAÇÃO DE IDs
// ============================================================================

/**
 * Gera ID único baseado em página + caminho JSON + contexto
 */
function generateId(pageId, jsonPath, arrayContext) {
  let id = `${pageId}.${jsonPath}`;
  
  if (arrayContext) {
    // Template string para interpolação dinâmica
    // Ex: tratamentos.treatments[${index}].title
    return `\${${id}[\${${arrayContext.indexName}}]}`;
  }
  
  return id;
}

/**
 * Injeta data-json-key na tag
 */
function injectDataJsonKey(tagContent, dataJsonKey, arrayContext) {
  // Construir novo atributo
  const idAttr = arrayContext
    ? ` data-json-key={\`${dataJsonKey}\`}`
    : ` data-json-key="${dataJsonKey}"`;
  
  // Se já tem data-json-key, substituir
  if (/data-json-key\s*=/.test(tagContent)) {
    return tagContent
      .replace(/\s+data-json-key\s*=\s*"[^"]*"/g, idAttr)
      .replace(/\s+data-json-key\s*=\s*\{`[^`]*`\}/g, idAttr);
  }
  
  // Adicionar antes do fechamento
  const insertPos = tagContent.lastIndexOf('>');
  if (insertPos === -1) return tagContent;
  
  const isSelfClosing = tagContent.substring(insertPos - 1, insertPos) === '/';
  const insertBefore = isSelfClosing ? insertPos - 1 : insertPos;
  
  return tagContent.substring(0, insertBefore) + 
         idAttr + 
         tagContent.substring(insertBefore);
}

// ============================================================================
// PROCESSAMENTO PRINCIPAL
// ============================================================================

const pages = fs.readdirSync(PAGES_DIR)
  .filter(f => f.endsWith('.tsx'))
  .filter(f => !PAGE_FILTER || f === `${PAGE_FILTER}.tsx`);

let totalIssues = 0;
let totalFixed = 0;
let totalPages = 0;
let totalElements = 0;

const results = [];

pages.forEach(pageFile => {
  const pagePath = path.join(PAGES_DIR, pageFile);
  let content = fs.readFileSync(pagePath, 'utf-8');
  const originalContent = content;
  
  const pageId = getPageId(pageFile);
  
  // Encontrar todos os usos de {texts.xxx} ou {texts?.xxx}
  const textsRegex = /\{texts(\?)?\.[\w.[\]]+\}/g;
  const textsMatches = [...content.matchAll(textsRegex)];
  
  if (textsMatches.length === 0) return;
  
  totalPages++;
  totalElements += textsMatches.length;
  
  const pageResult = {
    file: pageFile,
    totalUsages: textsMatches.length,
    issues: [],
    fixed: 0,
    skipped: 0
  };
  
  log(`\n${'─'.repeat(70)}`);
  log(`📄 Processando: ${pageFile}`);
  log(`   Total de usos de texts: ${textsMatches.length}`);
  
  // Processar de trás para frente para não bagunçar posições
  const matchesReversed = [...textsMatches].reverse();
  
  matchesReversed.forEach((match, idx) => {
    const textUsage = match[0]; // Ex: {texts.header.title}
    const position = match.index;
    const lineNumber = originalContent.substring(0, position).split('\n').length;
    
    log(`\n   [${idx + 1}/${textsMatches.length}] Linha ${lineNumber}: ${textUsage}`);
    
    // Extrair caminho JSON
    const jsonPath = extractJsonPath(textUsage);
    if (!jsonPath) {
      log(`      ⚠️  Não foi possível extrair jsonPath`);
      pageResult.skipped++;
      return;
    }
    
    log(`      JSON Path: ${jsonPath}`);
    
    // Detectar contexto de array
    const arrayContext = detectArrayContext(content, position);
    if (arrayContext) {
      log(`      🔄 Contexto de array: ${arrayContext.arrayName}.map((${arrayContext.itemName}, ${arrayContext.indexName}))`);
    }
    
    // Encontrar tag pai
    const tag = findParentTag(content, position);
    if (!tag) {
      log(`      ⚠️  Tag pai não encontrada`);
      pageResult.skipped++;
      return;
    }
    
    log(`      Tag: <${tag.name}>`);
    
    // Se já tem data-json-key correto, pular
    if (tag.hasDataJsonKey) {
      log(`      ✓ Já tem data-json-key`);
      return;
    }
    
    // Problema encontrado!
    totalIssues++;
    
    const issue = {
      line: lineNumber,
      textUsage,
      tagName: tag.name,
      jsonPath,
      arrayContext: arrayContext ? true : false
    };
    
    pageResult.issues.push(issue);
    
    // Se modo FIX, corrigir
    if (!CHECK_ONLY) {
      const dataJsonKey = generateId(pageId, jsonPath, arrayContext);
      const newTag = injectDataJsonKey(tag.content, dataJsonKey, arrayContext);
      
      log(`      🔧 Injetando: ${arrayContext ? 'template string' : 'string'}`);
      log(`      ID: ${dataJsonKey}`);
      
      // Substituir no conteúdo
      content = content.substring(0, tag.start) + newTag + content.substring(tag.end);
      
      pageResult.fixed++;
      totalFixed++;
    }
  });
  
  // Salvar arquivo modificado (se não for dry-run)
  if (!CHECK_ONLY && !DRY_RUN && pageResult.fixed > 0) {
    // Criar backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    fs.writeFileSync(`${pagePath}.backup-${timestamp}`, originalContent);
    fs.writeFileSync(pagePath, content);
    log(`\n   💾 Arquivo salvo com backup`);
  }
  
  results.push(pageResult);
});

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

console.log('\n' + '═'.repeat(70));
console.log('\n📊 RELATÓRIO DETALHADO:\n');

results.forEach(result => {
  const status = result.issues.length === 0 ? '✅' : CHECK_ONLY ? '⚠️' : '🔧';
  
  console.log(`${status} ${result.file}`);
  console.log(`   Total de elementos: ${result.totalUsages}`);
  
  if (result.issues.length === 0) {
    console.log(`   ✓ Todos com data-json-key correto`);
  } else {
    console.log(`   Problemas encontrados: ${result.issues.length}`);
    
    if (CHECK_ONLY) {
      // Mostrar primeiros problemas
      result.issues.slice(0, 3).forEach(issue => {
        console.log(`   ⚠️  L${issue.line}: <${issue.tagName}> ${issue.textUsage}`);
        if (issue.arrayContext) {
          console.log(`      (dentro de .map())`);
        }
      });
      if (result.issues.length > 3) {
        console.log(`   ... e mais ${result.issues.length - 3} problemas`);
      }
    } else {
      console.log(`   ✅ Corrigidos: ${result.fixed}`);
      if (result.skipped > 0) {
        console.log(`   ⏭️  Ignorados: ${result.skipped}`);
      }
    }
  }
  
  console.log('');
});

// ============================================================================
// RESUMO GERAL
// ============================================================================

console.log('═'.repeat(70));
console.log('\n📈 RESUMO GERAL:\n');
console.log(`   📄 Páginas processadas: ${totalPages}`);
console.log(`   🔤 Total de elementos: ${totalElements}`);
console.log(`   ${CHECK_ONLY ? '⚠️' : '✅'} Problemas ${CHECK_ONLY ? 'encontrados' : 'corrigidos'}: ${totalIssues}`);

if (CHECK_ONLY) {
  if (totalIssues === 0) {
    console.log(`\n✅ PERFEITO! Todas as páginas estão corretas!`);
    console.log(`   Todos os ${totalElements} elementos editáveis têm data-json-key.\n`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Encontrados ${totalIssues} elementos sem data-json-key.`);
    console.log(`\n💡 Para corrigir automaticamente:\n`);
    console.log(`   node scripts/ids.js --fix\n`);
    console.log(`   Ou para preview das mudanças:\n`);
    console.log(`   node scripts/ids.js --fix --dry-run\n`);
    process.exit(1);
  }
} else {
  if (DRY_RUN) {
    console.log(`\n👁️  DRY-RUN: Nenhum arquivo foi modificado.`);
    console.log(`   ${totalFixed} elementos seriam corrigidos.`);
    console.log(`\n   Execute sem --dry-run para aplicar:\n`);
    console.log(`   node scripts/ids.js --fix\n`);
  } else {
    console.log(`\n✅ CONCLUÍDO! Arquivos modificados com backups.`);
    console.log(`   ${totalFixed} elementos agora têm data-json-key correto.`);
    console.log(`   Backups salvos com timestamp.\n`);
  }
  process.exit(0);
}
