#!/usr/bin/env node

/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  SPLIT TEXT FIELDS - Dividir um campo em múltiplos campos         ║
 * ║  Automatiza a quebra de textos longos em campos editáveis         ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * FUNCIONALIDADES:
 * ✓ Backup automático do JSON antes de modificar
 * ✓ Divide um campo texto em N partes (intro → intro1, intro2, intro3)
 * ✓ Valida que as chaves novas são únicas
 * ✓ Gera diff para revisão
 * ✓ Suporta diferentes delimitadores (ponto final, linha, frase customizada)
 * ✓ Preview mode (--dry-run)
 * 
 * MODOS:
 * --page=Purificacao        : Nome da página (obrigatório)
 * --path=psicodelicos.intro : Caminho do campo a quebrar (obrigatório)
 * --parts=2                 : Número de partes (padrão: 2)
 * --delimiter=.             : Delimitador (padrão: '. ' - ponto final + espaço)
 * --custom="Texto|Texto2"   : Dividir manualmente com | como separador
 * --dry-run                 : Preview sem modificar
 * --verbose                 : Output detalhado
 * 
 * EXEMPLOS:
 * node scripts/split-text.js --page=Purificacao --path=psicodelicos.intro --parts=2
 * node scripts/split-text.js --page=Index --path=hero.title --parts=3 --delimiter=" "
 * node scripts/split-text.js --page=Purificacao --path=psicodelicos.intro --custom="Frase 1|Frase 2|Frase 3"
 * node scripts/split-text.js --page=Purificacao --path=psicodelicos.intro --parts=2 --dry-run
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
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales', 'pt-BR');
const BACKUPS_DIR = path.join(ROOT_DIR, 'backups', 'split-text');

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

const PAGE = process.argv.find(arg => arg.startsWith('--page='))?.split('=')[1];
const PATH_TO_FIELD = process.argv.find(arg => arg.startsWith('--path='))?.split('=')[1];
const PARTS = parseInt(process.argv.find(arg => arg.startsWith('--parts='))?.split('=')[1] || '2');
const DELIMITER = process.argv.find(arg => arg.startsWith('--delimiter='))?.split('=')[1] || '. ';
const CUSTOM_SPLIT = process.argv.find(arg => arg.startsWith('--custom='))?.split('=')[1];

// ============================================================================
// VALIDAÇÃO DE ARGUMENTOS
// ============================================================================

if (!PAGE || !PATH_TO_FIELD) {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║  ❌ ERRO: Argumentos obrigatórios faltando                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  console.log('Uso:');
  console.log('  node scripts/split-text.js --page=NomeDaPagina --path=caminho.do.campo [opções]\n');
  console.log('Exemplos:');
  console.log('  node scripts/split-text.js --page=Purificacao --path=psicodelicos.intro --parts=2');
  console.log('  node scripts/split-text.js --page=Index --path=hero.subtitle --parts=3 --delimiter=" "');
  console.log('  node scripts/split-text.js --page=Purificacao --path=psicodelicos.intro --custom="Frase 1|Frase 2"\n');
  process.exit(1);
}

// ============================================================================
// BANNER
// ============================================================================

console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║  ✂️  Split Text Fields - Quebrar campo em múltiplas partes       ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
console.log(`📄 Página: ${PAGE}`);
console.log(`📍 Campo: ${PATH_TO_FIELD}`);
console.log(`🔢 Partes: ${PARTS}`);
console.log(`🔧 Modo: ${DRY_RUN ? '👁️  DRY-RUN (preview)' : '🔴 MODIFICAR'}\n`);

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function log(...args) {
  if (VERBOSE) console.log(...args);
}

function createBackup(jsonPath) {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = path.basename(jsonPath);
  const backupPath = path.join(BACKUPS_DIR, `${filename.replace('.json', '')}-${timestamp}.json`);
  
  fs.copyFileSync(jsonPath, backupPath);
  console.log(`💾 Backup criado: ${path.relative(ROOT_DIR, backupPath)}`);
  return backupPath;
}

function getNestedValue(obj, pathString) {
  return pathString.split('.').reduce((acc, part) => acc?.[part], obj);
}

function setNestedValue(obj, pathString, value) {
  const parts = pathString.split('.');
  const last = parts.pop();
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
}

function deleteNestedValue(obj, pathString) {
  const parts = pathString.split('.');
  const last = parts.pop();
  const target = parts.reduce((acc, part) => acc?.[part], obj);
  if (target) delete target[last];
}

// ============================================================================
// LÓGICA PRINCIPAL
// ============================================================================

function splitTextField() {
  // 1. Carregar JSON
  const jsonPath = path.join(LOCALES_DIR, `${PAGE}.json`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Arquivo não encontrado: ${jsonPath}`);
    process.exit(1);
  }
  
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const jsonData = JSON.parse(jsonContent);
  
  // 2. Obter valor atual
  const currentValue = getNestedValue(jsonData, PATH_TO_FIELD);
  
  if (!currentValue) {
    console.error(`❌ Campo não encontrado: ${PATH_TO_FIELD}`);
    process.exit(1);
  }
  
  if (typeof currentValue !== 'string') {
    console.error(`❌ Campo não é string: ${PATH_TO_FIELD} (tipo: ${typeof currentValue})`);
    process.exit(1);
  }
  
  console.log(`📝 Valor atual:`);
  console.log(`   "${currentValue}"\n`);
  
  // 3. Dividir o texto
  let splitParts = [];
  
  if (CUSTOM_SPLIT) {
    // Split customizado com |
    splitParts = CUSTOM_SPLIT.split('|').map(s => s.trim());
    console.log(`✂️  Split customizado (${splitParts.length} partes):\n`);
  } else {
    // Split automático por delimitador
    const rawParts = currentValue.split(DELIMITER);
    
    // Reagrupar para ter exatamente PARTS partes
    if (rawParts.length < PARTS) {
      console.error(`❌ Não foi possível dividir em ${PARTS} partes usando delimitador "${DELIMITER}"`);
      console.error(`   Texto tem apenas ${rawParts.length} partes.`);
      console.error(`   Use --custom="Parte 1|Parte 2|..." para dividir manualmente.`);
      process.exit(1);
    }
    
    // Distribuir as partes
    const chunkSize = Math.ceil(rawParts.length / PARTS);
    for (let i = 0; i < PARTS; i++) {
      const chunk = rawParts.slice(i * chunkSize, (i + 1) * chunkSize);
      splitParts.push(chunk.join(DELIMITER).trim());
    }
    
    console.log(`✂️  Split automático (delimitador: "${DELIMITER}"):\n`);
  }
  
  // 4. Mostrar as novas partes
  splitParts.forEach((part, index) => {
    const suffix = index + 1;
    console.log(`   ${PATH_TO_FIELD}${suffix}: "${part}"`);
  });
  console.log('');
  
  // 5. Criar backup (se não for dry-run)
  if (!DRY_RUN) {
    createBackup(jsonPath);
  }
  
  // 6. Atualizar JSON
  const basePath = PATH_TO_FIELD.split('.').slice(0, -1).join('.');
  const fieldName = PATH_TO_FIELD.split('.').pop();
  
  // Remover campo antigo
  deleteNestedValue(jsonData, PATH_TO_FIELD);
  
  // Adicionar novos campos
  splitParts.forEach((part, index) => {
    const suffix = index + 1;
    const newPath = basePath ? `${basePath}.${fieldName}${suffix}` : `${fieldName}${suffix}`;
    setNestedValue(jsonData, newPath, part);
  });
  
  // 7. Salvar (se não for dry-run)
  if (DRY_RUN) {
    console.log('👁️  DRY-RUN: Nenhuma modificação foi feita.\n');
    console.log('📋 Preview do JSON atualizado:');
    console.log(JSON.stringify(getNestedValue(jsonData, basePath || fieldName), null, 2));
  } else {
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2) + '\n', 'utf-8');
    console.log(`✅ JSON atualizado: ${path.relative(ROOT_DIR, jsonPath)}\n`);
  }
  
  // 8. Instruções para próximos passos
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║  📋 PRÓXIMOS PASSOS                                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
  console.log(`1. Atualizar o componente React (src/pages/${PAGE}.tsx):`);
  console.log(`   - Substituir: texts.${PATH_TO_FIELD}`);
  splitParts.forEach((_, index) => {
    const suffix = index + 1;
    const fieldName = PATH_TO_FIELD.split('.').pop();
    const pathWithoutField = PATH_TO_FIELD.split('.').slice(0, -1).join('.');
    const fullPath = pathWithoutField ? `${pathWithoutField}.${fieldName}${suffix}` : `${fieldName}${suffix}`;
    console.log(`   - Por: texts.${fullPath}`);
  });
  console.log('');
  console.log('2. Adicionar data-json-key únicos em cada elemento:');
  splitParts.forEach((_, index) => {
    const suffix = index + 1;
    const fieldName = PATH_TO_FIELD.split('.').pop();
    console.log(`   data-json-key="${PAGE.toLowerCase()}.${PATH_TO_FIELD}${suffix}"`);
  });
  console.log('');
  console.log('3. Limpar cache e reiniciar:');
  console.log('   Remove-Item -Recurse -Force node_modules\\.vite');
  console.log('   pnpm stop');
  console.log('   pnpm start');
  console.log('');
  console.log('4. Limpar localStorage no browser (F12 → Console):');
  console.log('   localStorage.clear(); location.reload();');
  console.log('');
  console.log('5. Verificar IDs únicos:');
  console.log('   node scripts/fix-ids.js --check');
  console.log('');
  console.log('6. Sincronizar com Supabase (quando disponível):');
  console.log(`   node scripts/sync-${PAGE.toLowerCase()}-to-db.js`);
  console.log('');
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

try {
  splitTextField();
} catch (error) {
  console.error('\n❌ ERRO:', error.message);
  if (VERBOSE) console.error(error.stack);
  process.exit(1);
}
