#!/usr/bin/env node

/**
 * Script Mestre - Fix All Data-Json-Keys
 * ========================================
 * 
 * Executa ambos os scripts de correção:
 * 1. fix-all-texts.js - Corrige elementos com {texts.xxx}
 * 2. fix-all-maps.js - Corrige arrays com .map()
 * 
 * Este script garante que TODOS os elementos do projeto
 * tenham os data-json-key corretos para edição visual.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Script Mestre - Fix All Data-Json-Keys');
console.log('='.repeat(70));
console.log('');

const scriptsDir = __dirname;
const silent = process.argv.includes('--silent');

/**
 * Executa um script e captura a saída
 */
function runScript(scriptName, description) {
  const scriptPath = path.join(scriptsDir, scriptName);
  
  if (!silent) {
    console.log(`\n${'▶'.repeat(35)}`);
    console.log(`▶  ${description}`);
    console.log(`${'▶'.repeat(35)}\n`);
  }
  
  try {
    const output = execSync(`node "${scriptPath}"`, {
      cwd: path.join(scriptsDir, '..'),
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    
    return { success: true, output };
  } catch (error) {
    console.error(`❌ Erro ao executar ${scriptName}:`, error.message);
    return { success: false, error };
  }
}

// Executar os scripts na ordem correta
const results = [];

// 1. Primeiro corrige elementos diretos com texts.
results.push({
  name: 'fix-all-texts.js',
  ...runScript('fix-all-texts.js', 'Corrigindo elementos com {texts.xxx}')
});

// 2. Depois corrige arrays com .map()
results.push({
  name: 'fix-all-maps.js',
  ...runScript('fix-all-maps.js', 'Corrigindo arrays com .map()')
});

// Relatório final consolidado
if (!silent) {
  console.log('\n\n');
  console.log('═'.repeat(70));
  console.log('📊 RELATÓRIO FINAL CONSOLIDADO');
  console.log('═'.repeat(70));
  console.log('');
  
  const allSuccess = results.every(r => r.success);
  
  if (allSuccess) {
    console.log('✅ Todos os scripts executados com sucesso!');
    console.log('');
    console.log('📝 Scripts executados:');
    results.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} ✓`);
    });
    console.log('');
    console.log('🎯 Resultado: Todos os elementos do projeto estão prontos');
    console.log('   para edição visual com data-json-key corretos.');
  } else {
    console.log('⚠️  Alguns scripts encontraram problemas:');
    console.log('');
    results.forEach((r, i) => {
      const status = r.success ? '✓' : '✗';
      console.log(`   ${i + 1}. ${r.name} ${status}`);
    });
  }
  
  console.log('');
  console.log('═'.repeat(70));
}

// Retornar código de saída apropriado
const exitCode = results.every(r => r.success) ? 0 : 1;
process.exit(exitCode);
