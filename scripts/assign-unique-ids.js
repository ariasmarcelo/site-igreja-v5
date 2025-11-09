#!/usr/bin/env node

/**
 * Script para atribuir IDs únicos (data-json-key) a todos os elementos JSX
 * que referenciam textos/ícones dos arquivos JSON de locale.
 * 
 * FUNCIONALIDADES:
 * 1. Lê todos os arquivos TSX em src/pages/
 * 2. Lê todos os arquivos JSON em src/locales/pt-BR/
 * 3. Mapeia relações TSX → JSON via imports e useLocaleTexts()
 * 4. Analisa AST para encontrar elementos JSX que usam texts.xxx
 * 5. Gera IDs únicos seguindo convenção: pageId.sectionId.componentType[.uniqueId]
 * 6. Injeta data-json-key nos elementos JSX
 * 7. Valida integridade referencial (todos os IDs correspondem a paths JSON válidos)
 * 
 * EXECUÇÃO:
 * node scripts/assign-unique-ids.js [--dry-run] [--page=Index]
 */

import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extrair default exports (compatibilidade ES6/CommonJS)
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const ROOT_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'src', 'pages');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales', 'pt-BR');
const OUTPUT_DIR = path.join(ROOT_DIR, 'scripts', 'output');

// Flags de execução
const DRY_RUN = process.argv.includes('--dry-run');
const PAGE_FILTER = process.argv.find(arg => arg.startsWith('--page='))?.split('=')[1];

console.log('🚀 Script de Atribuição de IDs Únicos');
console.log('=====================================');
console.log(`📁 Páginas: ${PAGES_DIR}`);
console.log(`📁 Locales: ${LOCALES_DIR}`);
console.log(`🔧 Modo: ${DRY_RUN ? 'DRY RUN (sem salvar)' : 'PRODUÇÃO (vai sobrescrever)'}`);
if (PAGE_FILTER) console.log(`🎯 Filtro: apenas página "${PAGE_FILTER}"`);
console.log('');

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Lê todos os arquivos TSX de uma pasta
 */
function readTSXFiles(dir) {
  const files = fs.readdirSync(dir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => ({
      name: file,
      path: path.join(dir, file),
      content: fs.readFileSync(path.join(dir, file), 'utf-8')
    }));
  
  return files;
}

/**
 * Lê todos os arquivos JSON de uma pasta
 */
function readJSONFiles(dir) {
  const files = fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      name: file,
      path: path.join(dir, file),
      content: JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'))
    }));
  
  return files;
}

/**
 * Extrai o pageId do nome do arquivo (Index.tsx → index)
 */
function getPageId(filename) {
  return filename.replace('.tsx', '').toLowerCase();
}

/**
 * Extrai o pageId do nome do arquivo JSON (Index.json → index)
 */
function getPageIdFromJSON(filename) {
  return filename.replace('.json', '').toLowerCase();
}

/**
 * Converte path JSON (hero.title) para array [hero, title]
 */
function parseJsonPath(path) {
  return path.split('.');
}

/**
 * Obtém valor de um objeto seguindo path (ex: hero.title → obj.hero.title)
 */
function getValueByPath(obj, pathStr) {
  const parts = parseJsonPath(pathStr);
  let current = obj;
  
  for (const part of parts) {
    // Suporta arrays: items[0] → items.0
    const cleanPart = part.replace(/\[(\d+)\]/, '.$1');
    const subParts = cleanPart.split('.');
    
    for (const subPart of subParts) {
      if (current === undefined || current === null) return undefined;
      current = current[subPart];
    }
  }
  
  return current;
}

/**
 * Valida se um path JSON existe no objeto
 */
function pathExistsInJSON(jsonObj, pathStr) {
  return getValueByPath(jsonObj, pathStr) !== undefined;
}

/**
 * Gera ID único seguindo convenção
 * @param {string} pageId - ID da página (index, quemsomos, etc)
 * @param {string} context - Contexto do elemento (seção, componente pai)
 * @param {string} elementType - Tipo do elemento (title, button, icon, etc)
 * @param {string} identifier - Identificador único (opcional)
 * @param {number} arrayIndex - Índice de array (opcional)
 */
function generateUniqueId(pageId, context, elementType, identifier = null, arrayIndex = null) {
  let id = pageId;
  
  if (context) id += `.${context}`;
  if (elementType) id += `.${elementType}`;
  if (identifier) id += `.${identifier}`;
  if (arrayIndex !== null) id += `[${arrayIndex}]`;
  
  return id;
}

/**
 * Normaliza nome de identificador (remove caracteres especiais)
 */
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
// ANÁLISE DE TSX
// ============================================================================

/**
 * Analisa arquivo TSX e extrai informações
 */
function analyzeTSXFile(fileData) {
  const ast = parse(fileData.content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  
  const analysis = {
    pageId: getPageId(fileData.name),
    localePageId: null, // Extraído do useLocaleTexts('pageId')
    imports: [],
    textsUsages: [], // Onde texts.xxx é usado
    iconsUsages: [], // Onde SVGs/Icons são usados
    elements: [] // Elementos que precisam de data-json-key
  };
  
  // Encontrar import do useLocaleTexts
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (source.includes('useLocaleTexts')) {
        analysis.imports.push({ type: 'useLocaleTexts', source });
      }
    },
    
    // Encontrar chamada useLocaleTexts('pageId')
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee, { name: 'useLocaleTexts' })) {
        const firstArg = path.node.arguments[0];
        if (t.isStringLiteral(firstArg)) {
          analysis.localePageId = firstArg.value;
        }
      }
    },
    
    // Encontrar uso de texts.xxx
    MemberExpression(path) {
      if (t.isIdentifier(path.node.object, { name: 'texts' })) {
        const propertyPath = getMemberExpressionPath(path.node);
        analysis.textsUsages.push({
          path: propertyPath,
          node: path.node,
          parent: path.parent
        });
      }
    },
    
    // Encontrar elementos JSX que precisam de IDs
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const elementName = getJSXElementName(openingElement);
      
      // Verificar se já tem data-json-key
      const hasDataJsonKey = openingElement.attributes.some(
        attr => t.isJSXAttribute(attr) && attr.name.name === 'data-json-key'
      );
      
      if (!hasDataJsonKey) {
        // Verificar se elemento usa texts.xxx
        let usesTexts = false;
        traverse(path.node, {
          MemberExpression(innerPath) {
            if (t.isIdentifier(innerPath.node.object, { name: 'texts' })) {
              usesTexts = true;
            }
          }
        }, path.scope, path);
        
        if (usesTexts) {
          analysis.elements.push({
            type: elementName,
            node: path.node,
            openingElement: openingElement,
            hasDataJsonKey: false,
            line: openingElement.loc?.start.line
          });
        }
      }
    }
  });
  
  return { ast, analysis };
}

/**
 * Obtém path completo de MemberExpression (texts.hero.title → 'hero.title')
 */
function getMemberExpressionPath(node, parts = []) {
  if (t.isIdentifier(node)) {
    return parts.reverse().join('.');
  }
  
  if (t.isMemberExpression(node)) {
    if (t.isIdentifier(node.property)) {
      parts.push(node.property.name);
    }
    return getMemberExpressionPath(node.object, parts);
  }
  
  return parts.reverse().join('.');
}

/**
 * Obtém nome do elemento JSX (Button, h1, svg, etc)
 */
function getJSXElementName(openingElement) {
  const name = openingElement.name;
  if (t.isJSXIdentifier(name)) {
    return name.name;
  }
  if (t.isJSXMemberExpression(name)) {
    return `${name.object.name}.${name.property.name}`;
  }
  return 'unknown';
}

// ============================================================================
// GERAÇÃO DE IDs
// ============================================================================

/**
 * Gera mapa de IDs únicos para uma página
 */
function generateIdsForPage(analysis, jsonContent) {
  const idMap = new Map(); // element → generatedId
  const usedIds = new Set(); // Para detectar duplicatas
  
  // Contexto atual (seção sendo processada)
  let currentSection = 'root';
  
  analysis.elements.forEach((element, index) => {
    // Tentar inferir contexto/seção do elemento
    const context = inferContext(element, analysis);
    
    // Tentar inferir tipo de componente
    const componentType = inferComponentType(element);
    
    // Tentar inferir identificador único
    const identifier = inferIdentifier(element, analysis, jsonContent);
    
    // Detectar se está em array
    const arrayInfo = detectArrayContext(element);
    
    // Gerar ID
    let generatedId = generateUniqueId(
      analysis.pageId,
      context,
      componentType,
      identifier,
      arrayInfo?.index
    );
    
    // Garantir unicidade
    let counter = 1;
    const originalId = generatedId;
    while (usedIds.has(generatedId)) {
      generatedId = `${originalId}_${counter}`;
      counter++;
    }
    
    usedIds.add(generatedId);
    idMap.set(element, generatedId);
  });
  
  return idMap;
}

/**
 * Infere contexto/seção do elemento (hero, section_igreja, etc)
 */
function inferContext(element, analysis) {
  // TODO: Implementar lógica mais sofisticada
  // Por enquanto, retorna um contexto genérico
  return 'section';
}

/**
 * Infere tipo de componente (title, button, icon, text, etc)
 */
function inferComponentType(element) {
  const type = element.type.toLowerCase();
  
  // Mapeamento de tipos JSX para tipos de componente
  const typeMap = {
    'h1': 'title',
    'h2': 'title',
    'h3': 'subtitle',
    'h4': 'subtitle',
    'p': 'text',
    'span': 'text',
    'button': 'button',
    'a': 'link',
    'svg': 'icon',
    'img': 'image'
  };
  
  // Componentes shadcn/ui
  if (type === 'button') return 'button';
  if (type.includes('card')) return 'card';
  if (type.includes('dialog')) return 'dialog';
  
  return typeMap[type] || 'element';
}

/**
 * Infere identificador único do elemento
 */
function inferIdentifier(element, analysis, jsonContent) {
  // TODO: Implementar lógica para inferir identificador
  // Pode usar o conteúdo do elemento, atributos, etc
  return null;
}

/**
 * Detecta se elemento está dentro de um .map() (array context)
 */
function detectArrayContext(element) {
  // TODO: Implementar detecção de array context
  return null;
}

// ============================================================================
// TRANSFORMAÇÃO DE AST
// ============================================================================

/**
 * Injeta data-json-key nos elementos do AST
 */
function injectIdsIntoAST(ast, idMap) {
  const transformations = [];
  
  traverse(ast, {
    JSXElement(path) {
      const element = Array.from(idMap.keys()).find(
        el => el.openingElement === path.node.openingElement
      );
      
      if (element) {
        const generatedId = idMap.get(element);
        
        // Adicionar atributo data-json-key
        const attribute = t.jsxAttribute(
          t.jsxIdentifier('data-json-key'),
          t.stringLiteral(generatedId)
        );
        
        path.node.openingElement.attributes.push(attribute);
        
        transformations.push({
          line: element.line,
          type: element.type,
          id: generatedId
        });
      }
    }
  });
  
  return transformations;
}

// ============================================================================
// VALIDAÇÃO
// ============================================================================

/**
 * Valida integridade referencial entre IDs gerados e JSON
 */
function validateIntegrity(idMap, jsonContent, pageId) {
  const errors = [];
  const warnings = [];
  
  for (const [element, generatedId] of idMap.entries()) {
    // Remover pageId. do início para verificar no JSON
    const jsonPath = generatedId.replace(`${pageId}.`, '');
    
    // Verificar se path existe no JSON
    if (!pathExistsInJSON(jsonContent, jsonPath)) {
      warnings.push({
        id: generatedId,
        path: jsonPath,
        message: `Path não encontrado no JSON: ${jsonPath}`
      });
    }
  }
  
  return { errors, warnings };
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

async function main() {
  console.log('📖 Lendo arquivos TSX...');
  const tsxFiles = readTSXFiles(PAGES_DIR);
  console.log(`   Encontrados: ${tsxFiles.length} arquivos\n`);
  
  console.log('📖 Lendo arquivos JSON...');
  const jsonFiles = readJSONFiles(LOCALES_DIR);
  console.log(`   Encontrados: ${jsonFiles.length} arquivos\n`);
  
  // Criar mapa JSON por pageId
  const jsonMap = new Map();
  jsonFiles.forEach(file => {
    const pageId = getPageIdFromJSON(file.name);
    jsonMap.set(pageId, file.content);
  });
  
  // Processar cada página
  const results = [];
  
  for (const tsxFile of tsxFiles) {
    const pageId = getPageId(tsxFile.name);
    
    // Aplicar filtro se especificado
    if (PAGE_FILTER && pageId !== PAGE_FILTER.toLowerCase()) {
      continue;
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 Processando: ${tsxFile.name} (pageId: ${pageId})`);
    console.log('='.repeat(60));
    
    try {
      // Análise do TSX
      const { ast, analysis } = analyzeTSXFile(tsxFile);
      
      console.log(`\n📊 Análise:`);
      console.log(`   Locale Page ID: ${analysis.localePageId}`);
      console.log(`   Usos de texts.xxx: ${analysis.textsUsages.length}`);
      console.log(`   Elementos sem ID: ${analysis.elements.length}`);
      
      // Obter JSON correspondente
      const jsonContent = jsonMap.get(analysis.localePageId || pageId);
      
      if (!jsonContent) {
        console.log(`   ⚠️  JSON não encontrado para pageId: ${analysis.localePageId || pageId}`);
        continue;
      }
      
      // Gerar IDs únicos
      console.log(`\n🔧 Gerando IDs únicos...`);
      const idMap = generateIdsForPage(analysis, jsonContent);
      console.log(`   Gerados: ${idMap.size} IDs`);
      
      // Validar integridade
      console.log(`\n✅ Validando integridade...`);
      const validation = validateIntegrity(idMap, jsonContent, pageId);
      
      if (validation.errors.length > 0) {
        console.log(`   ❌ Erros: ${validation.errors.length}`);
        validation.errors.forEach(err => {
          console.log(`      - ${err.message}`);
        });
      }
      
      if (validation.warnings.length > 0) {
        console.log(`   ⚠️  Avisos: ${validation.warnings.length}`);
        validation.warnings.slice(0, 5).forEach(warn => {
          console.log(`      - ${warn.message}`);
        });
        if (validation.warnings.length > 5) {
          console.log(`      ... e mais ${validation.warnings.length - 5} avisos`);
        }
      }
      
      if (validation.errors.length === 0 && validation.warnings.length === 0) {
        console.log(`   ✓ Todos os IDs são válidos`);
      }
      
      // Injetar IDs no AST
      console.log(`\n💉 Injetando IDs no código...`);
      const transformations = injectIdsIntoAST(ast, idMap);
      console.log(`   Transformações: ${transformations.length}`);
      
      // Gerar código modificado
      const output = generate(ast, {
        retainLines: true,
        comments: true
      }, tsxFile.content);
      
      // Salvar resultado
      const result = {
        file: tsxFile.name,
        pageId,
        analysis,
        idMap,
        validation,
        transformations,
        outputCode: output.code
      };
      
      results.push(result);
      
      // Salvar arquivo (se não for dry-run)
      if (!DRY_RUN) {
        console.log(`\n💾 Salvando arquivo modificado...`);
        fs.writeFileSync(tsxFile.path, output.code, 'utf-8');
        console.log(`   ✓ Salvo: ${tsxFile.path}`);
      } else {
        // Salvar em pasta de output para revisão
        if (!fs.existsSync(OUTPUT_DIR)) {
          fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        const outputPath = path.join(OUTPUT_DIR, tsxFile.name);
        fs.writeFileSync(outputPath, output.code, 'utf-8');
        console.log(`   📋 Salvo em: ${outputPath} (para revisão)`);
      }
      
    } catch (error) {
      console.error(`\n❌ Erro ao processar ${tsxFile.name}:`);
      console.error(error);
    }
  }
  
  // Relatório final
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(60));
  
  const totalFiles = results.length;
  const totalIds = results.reduce((sum, r) => sum + r.idMap.size, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.validation.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.validation.warnings.length, 0);
  
  console.log(`\n✅ Arquivos processados: ${totalFiles}`);
  console.log(`🆔 IDs gerados: ${totalIds}`);
  console.log(`❌ Erros: ${totalErrors}`);
  console.log(`⚠️  Avisos: ${totalWarnings}`);
  
  if (DRY_RUN) {
    console.log(`\n📋 Modo DRY RUN - Arquivos salvos em: ${OUTPUT_DIR}`);
    console.log(`   Para aplicar mudanças, execute sem --dry-run`);
  } else {
    console.log(`\n✅ Mudanças aplicadas aos arquivos TSX`);
  }
  
  console.log('\n✨ Script concluído!');
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:');
  console.error(error);
  process.exit(1);
});
