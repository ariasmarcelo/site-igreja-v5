#!/usr/bin/env node

/**
 * Script de Deploy Automatizado
 * 
 * Uso:
 *   node scripts/deploy.js          # Deploy completo
 *   node scripts/deploy.js frontend # Apenas frontend
 *   node scripts/deploy.js backend  # Apenas backend
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const args = process.argv.slice(2);
const target = args[0] || 'all';

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    log(`\n▶ ${command}`, 'cyan');
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    log(`✗ Erro ao executar: ${command}`, 'red');
    throw error;
  }
}

async function checkEnvironment() {
  log('\n🔍 Verificando ambiente...', 'yellow');
  
  try {
    const env = readFileSync('.env.local', 'utf-8');
    if (!env.includes('VITE_SUPABASE_URL')) {
      log('⚠️  VITE_SUPABASE_URL não encontrado no .env.local', 'yellow');
    }
    if (!env.includes('VITE_SUPABASE_ANON_KEY')) {
      log('⚠️  VITE_SUPABASE_ANON_KEY não encontrado no .env.local', 'yellow');
    }
    log('✓ Variáveis de ambiente encontradas', 'green');
  } catch (error) {
    log('⚠️  Arquivo .env.local não encontrado', 'yellow');
  }
}

async function deployFrontend() {
  log('\n📦 Deploy do Frontend (GitHub Pages)...', 'yellow');
  
  // Build
  log('\n🔨 Building frontend...', 'cyan');
  exec('pnpm run build');
  
  // Commit e push (GitHub Actions faz o resto)
  log('\n📤 Pushing to GitHub...', 'cyan');
  exec('git add .');
  
  try {
    exec('git commit -m "deploy: update frontend"');
  } catch (error) {
    log('ℹ️  Nada para commitar', 'cyan');
  }
  
  exec('git push origin main');
  
  log('\n✓ Frontend enviado! GitHub Actions fará o deploy.', 'green');
  log('📊 Acompanhe em: https://github.com/SEU_USUARIO/SEU_REPO/actions', 'cyan');
}

async function deployBackend() {
  log('\n🚀 Deploy do Backend (Vercel)...', 'yellow');
  
  // Verificar se Vercel CLI está instalado
  try {
    exec('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    log('⚠️  Vercel CLI não instalado. Instalando...', 'yellow');
    exec('npm install -g vercel');
  }
  
  // Deploy
  log('\n📤 Deploying to Vercel...', 'cyan');
  exec('vercel --prod');
  
  log('\n✓ Backend deployed!', 'green');
}

async function main() {
  log('\n🚀 Igreja de Metatron - Deploy Script', 'green');
  log('=====================================\n', 'green');
  
  await checkEnvironment();
  
  try {
    if (target === 'all' || target === 'frontend') {
      await deployFrontend();
    }
    
    if (target === 'all' || target === 'backend') {
      await deployBackend();
    }
    
    log('\n✓ Deploy concluído com sucesso!', 'green');
    log('\n📝 Próximos passos:', 'cyan');
    log('   1. Verificar build no GitHub Actions', 'reset');
    log('   2. Testar URL do frontend', 'reset');
    log('   3. Testar URL do backend (API)', 'reset');
    log('   4. Atualizar VITE_API_URL se necessário\n', 'reset');
    
  } catch (error) {
    log('\n✗ Deploy falhou!', 'red');
    log('Verifique os logs acima para mais detalhes.\n', 'red');
    process.exit(1);
  }
}

main();
