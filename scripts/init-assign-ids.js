#!/usr/bin/env node

/**
 * Script de inicialização: Verifica IDs únicos automaticamente
 * 
 * EXECUÇÃO:
 * - Roda automaticamente via package.json no "predev"
 * - Verifica flag de controle (.ids-assigned)
 * - Executa ids.js (script definitivo) se necessário
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
    console.log('✅ IDs únicos já verificados (último: ' + new Date(lastExecution).toLocaleString() + ')');
    console.log('   Para forçar verificação: pnpm assign-ids\n');
    process.exit(0);
  }
}

console.log('🔧 Verificando IDs únicos...\n');

try {
  // Executar script definitivo de verificação (apenas check, sem fix)
  execSync('node scripts/ids.js --check', {
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
