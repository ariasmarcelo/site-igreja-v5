#!/usr/bin/env node

/**
 * Script de inicialização: Verifica e atribui IDs únicos automaticamente
 * 
 * EXECUÇÃO:
 * - Roda automaticamente via package.json no "predev"
 * - Verifica flag de controle (.ids-assigned)
 * - Executa assign-ids-final.js se necessário
 * - Não bloqueia o início do dev server
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const FLAG_FILE = path.join(ROOT_DIR, '.ids-assigned');

console.log('🔍 Verificando IDs únicos...');

// Verificar se já foi executado
if (fs.existsSync(FLAG_FILE)) {
  const flagContent = fs.readFileSync(FLAG_FILE, 'utf-8');
  const lastExecution = parseInt(flagContent);
  const now = Date.now();
  const hoursSince = (now - lastExecution) / (1000 * 60 * 60);
  
  // Se executou nas últimas 24h, pular
  if (hoursSince < 24) {
    console.log('✅ IDs únicos já atribuídos (último: ' + new Date(lastExecution).toLocaleString() + ')');
    console.log('   Para forçar reexecução: npm run assign-ids\n');
    process.exit(0);
  }
}

console.log('🔧 Atribuindo IDs únicos automaticamente...\n');

try {
  // Executar script de atribuição
  execSync('node scripts/assign-ids-final.js', {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });
  
  // Marcar como executado
  fs.writeFileSync(FLAG_FILE, Date.now().toString());
  
  console.log('\n✅ IDs únicos atribuídos com sucesso!\n');
} catch (error) {
  console.error('\n❌ Erro ao atribuir IDs:', error.message);
  console.log('⚠️  Continuando inicialização...\n');
}
