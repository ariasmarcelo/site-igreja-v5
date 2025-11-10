/**
 * 🗄️ Script de Backup Completo do Supabase
 * 
 * Faz backup de todas as tabelas do banco de dados Supabase
 * salvando em arquivos JSON localmente.
 * 
 * Uso:
 *   node scripts/backup-supabase.js
 *   node scripts/backup-supabase.js --verbose
 *   node scripts/backup-supabase.js --table=nome_tabela
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente Supabase não configuradas');
  console.log('📝 Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Argumentos
const VERBOSE = process.argv.includes('--verbose');
const TABLE_FILTER = process.argv.find(arg => arg.startsWith('--table='))?.split('=')[1];

// Diretório de backups
const BACKUP_DIR = path.join(__dirname, '../backups/supabase');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const CURRENT_BACKUP_DIR = path.join(BACKUP_DIR, timestamp);

// Tabelas a fazer backup (adicione suas tabelas aqui)
const TABLES = [
  'page_styles',
  'page_history',
  // Adicione outras tabelas conforme necessário
];

/**
 * Cria diretório de backup
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  if (!fs.existsSync(CURRENT_BACKUP_DIR)) {
    fs.mkdirSync(CURRENT_BACKUP_DIR, { recursive: true });
  }
}

/**
 * Faz backup de uma tabela
 */
async function backupTable(tableName) {
  try {
    if (VERBOSE) console.log(`📥 Backup de ${tableName}...`);
    
    // Buscar todos os dados
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error(`❌ Erro ao buscar ${tableName}:`, error.message);
      return { success: false, tableName, error: error.message };
    }
    
    // Salvar arquivo JSON
    const filePath = path.join(CURRENT_BACKUP_DIR, `${tableName}.json`);
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    
    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
    
    if (VERBOSE) {
      console.log(`✅ ${tableName}: ${count || data.length} registros, ${fileSize} KB`);
    }
    
    return {
      success: true,
      tableName,
      records: count || data.length,
      size: fileSize,
      filePath
    };
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${tableName}:`, error.message);
    return { success: false, tableName, error: error.message };
  }
}

/**
 * Cria arquivo de metadados do backup
 */
function createMetadata(results) {
  const metadata = {
    timestamp: new Date().toISOString(),
    supabaseUrl,
    tables: results.map(r => ({
      name: r.tableName,
      success: r.success,
      records: r.records || 0,
      size: r.size || '0',
      error: r.error || null
    })),
    totalRecords: results.reduce((sum, r) => sum + (r.records || 0), 0),
    totalSize: results.reduce((sum, r) => sum + parseFloat(r.size || 0), 0).toFixed(2),
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  };
  
  const metadataPath = path.join(CURRENT_BACKUP_DIR, '_metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  
  return metadata;
}

/**
 * Remove backups antigos (mantém últimos 10)
 */
function cleanOldBackups() {
  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(name => name !== '.gitkeep')
      .map(name => ({
        name,
        path: path.join(BACKUP_DIR, name),
        time: fs.statSync(path.join(BACKUP_DIR, name)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    // Manter últimos 10 backups
    const toDelete = backups.slice(10);
    
    toDelete.forEach(backup => {
      fs.rmSync(backup.path, { recursive: true, force: true });
      if (VERBOSE) console.log(`🗑️ Backup antigo removido: ${backup.name}`);
    });
    
    if (toDelete.length > 0) {
      console.log(`🧹 ${toDelete.length} backup(s) antigo(s) removido(s)`);
    }
    
  } catch (error) {
    console.error('⚠️ Erro ao limpar backups antigos:', error.message);
  }
}

/**
 * Exibe resumo do backup
 */
function printSummary(metadata) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DO BACKUP');
  console.log('='.repeat(60));
  console.log(`📅 Data: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}`);
  console.log(`📂 Pasta: ${path.basename(CURRENT_BACKUP_DIR)}`);
  console.log(`📋 Tabelas: ${metadata.successful}/${metadata.tables.length} com sucesso`);
  console.log(`📄 Registros: ${metadata.totalRecords}`);
  console.log(`💾 Tamanho: ${metadata.totalSize} KB`);
  
  if (metadata.failed > 0) {
    console.log(`\n⚠️ Falhas: ${metadata.failed}`);
    metadata.tables
      .filter(t => !t.success)
      .forEach(t => console.log(`   ❌ ${t.name}: ${t.error}`));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Backup salvo em: ${CURRENT_BACKUP_DIR}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Função principal
 */
async function main() {
  console.log('🗄️ Iniciando backup do Supabase...\n');
  
  // Verificar conexão
  const { error: connectionError } = await supabase
    .from('page_texts')
    .select('id', { count: 'exact', head: true });
  
  if (connectionError) {
    console.error('❌ Erro ao conectar com Supabase:', connectionError.message);
    console.log('📝 Verifique suas credenciais no .env.local');
    process.exit(1);
  }
  
  console.log('✅ Conectado ao Supabase\n');
  
  // Criar diretório
  ensureBackupDir();
  
  // Filtrar tabelas se necessário
  const tablesToBackup = TABLE_FILTER 
    ? TABLES.filter(t => t === TABLE_FILTER)
    : TABLES;
  
  if (tablesToBackup.length === 0) {
    console.error(`❌ Tabela não encontrada: ${TABLE_FILTER}`);
    console.log(`📋 Tabelas disponíveis: ${TABLES.join(', ')}`);
    process.exit(1);
  }
  
  console.log(`📋 Fazendo backup de ${tablesToBackup.length} tabela(s)...\n`);
  
  // Fazer backup de cada tabela
  const results = [];
  for (const table of tablesToBackup) {
    const result = await backupTable(table);
    results.push(result);
  }
  
  // Criar metadados
  const metadata = createMetadata(results);
  
  // Limpar backups antigos
  cleanOldBackups();
  
  // Exibir resumo
  printSummary(metadata);
  
  // Exit code
  const exitCode = metadata.failed > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Executar
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
