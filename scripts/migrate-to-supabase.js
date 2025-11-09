#!/usr/bin/env node

/**
 * Script de Migração: File System → Supabase
 * 
 * Migra todos os JSONs e CSS para o banco de dados Supabase
 * 
 * Execução:
 * node scripts/migrate-to-supabase.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração
const ROOT_DIR = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales', 'pt-BR');
const STYLES_DIR = path.join(ROOT_DIR, 'src', 'styles', 'pages');

// Supabase - Carregar do .env.local
const envPath = path.join(ROOT_DIR, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1];
const SUPABASE_SERVICE_KEY = envContent.match(/SUPABASE_SERVICE_KEY=(.*)/)[1];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🚀 Migração: File System → Supabase');
console.log('='.repeat(70));
console.log('');

/**
 * Migrar JSONs para page_contents
 */
async function migrateJSONs() {
  console.log('📄 Migrando JSONs...\n');
  
  const files = fs.readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json') && !f.includes('_20')); // Ignorar backups
  
  let success = 0;
  let errors = 0;
  
  for (const file of files) {
    const pageId = file.replace('.json', '').toLowerCase();
    const filePath = path.join(LOCALES_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    try {
      const { error } = await supabase
        .from('page_contents')
        .upsert({
          page_id: pageId,
          content: content,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      console.log(`   ✅ ${file} → page_contents.${pageId}`);
      success++;
    } catch (error) {
      console.error(`   ❌ ${file}: ${error.message}`);
      errors++;
    }
  }
  
  console.log(`\n   📊 Total: ${success} sucesso, ${errors} erros\n`);
  return { success, errors };
}

/**
 * Migrar CSS para page_styles
 */
async function migrateCSS() {
  console.log('🎨 Migrando CSS...\n');
  
  const files = fs.readdirSync(STYLES_DIR)
    .filter(f => f.endsWith('.css') && !f.includes('_20')); // Ignorar backups
  
  let success = 0;
  let errors = 0;
  
  for (const file of files) {
    const pageId = file.replace('.css', '').toLowerCase();
    const filePath = path.join(STYLES_DIR, file);
    const css = fs.readFileSync(filePath, 'utf-8');
    
    try {
      const { error } = await supabase
        .from('page_styles')
        .upsert({
          page_id: pageId,
          css: css,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      console.log(`   ✅ ${file} → page_styles.${pageId}`);
      success++;
    } catch (error) {
      console.error(`   ❌ ${file}: ${error.message}`);
      errors++;
    }
  }
  
  console.log(`\n   📊 Total: ${success} sucesso, ${errors} erros\n`);
  return { success, errors };
}

/**
 * Verificar migração
 */
async function verifyMigration() {
  console.log('🔍 Verificando migração...\n');
  
  // Contar registros
  const { count: contentsCount } = await supabase
    .from('page_contents')
    .select('*', { count: 'exact', head: true });
  
  const { count: stylesCount } = await supabase
    .from('page_styles')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   📄 page_contents: ${contentsCount} registros`);
  console.log(`   🎨 page_styles: ${stylesCount} registros`);
  console.log('');
  
  // Listar páginas
  const { data: contents } = await supabase
    .from('page_contents')
    .select('page_id')
    .order('page_id');
  
  if (contents && contents.length > 0) {
    console.log('   📋 Páginas migradas:');
    contents.forEach(({ page_id }) => {
      console.log(`      - ${page_id}`);
    });
  }
}

/**
 * Executar migração
 */
async function main() {
  try {
    // Testar conexão
    const { error: testError } = await supabase.from('page_contents').select('count').limit(1);
    if (testError) {
      console.error('❌ Erro ao conectar com Supabase:', testError.message);
      console.error('   Verifique suas credenciais no .env.local');
      process.exit(1);
    }
    
    console.log('✅ Conexão com Supabase OK\n');
    console.log('─'.repeat(70));
    console.log('');
    
    // Migrar dados
    const jsonResult = await migrateJSONs();
    console.log('─'.repeat(70));
    console.log('');
    
    const cssResult = await migrateCSS();
    console.log('─'.repeat(70));
    console.log('');
    
    // Verificar
    await verifyMigration();
    console.log('─'.repeat(70));
    console.log('');
    
    // Resumo final
    const totalSuccess = jsonResult.success + cssResult.success;
    const totalErrors = jsonResult.errors + cssResult.errors;
    
    console.log('🎉 MIGRAÇÃO CONCLUÍDA!');
    console.log('');
    console.log(`   ✅ ${totalSuccess} arquivos migrados com sucesso`);
    if (totalErrors > 0) {
      console.log(`   ❌ ${totalErrors} erros encontrados`);
    }
    console.log('');
    console.log('🔗 Acesse: https://supabase.com/dashboard/project/laikwxajpcahfatiybnb/editor');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

main();
