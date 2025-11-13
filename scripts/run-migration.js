import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔧 Executando migration SQL...\n');

  try {
    const migrationFile = path.resolve(__dirname, '../supabase/migrations/20251112_create_granular_tables.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    // Supabase JS client não suporta SQL direto, precisamos executar via RPC ou manualmente
    // Vamos criar as tabelas via SQL no dashboard ou usar um script Node alternativo
    
    console.log('📄 Migration SQL gerado em:');
    console.log(`   ${migrationFile}`);
    console.log('\n⚠️  ATENÇÃO: Execute este SQL no Supabase Dashboard:');
    console.log('   1. Acesse: https://laikwxajpcahfatiybnb.supabase.co');
    console.log('   2. Vá em SQL Editor');
    console.log('   3. Cole e execute o conteúdo do arquivo acima\n');
    
    // Aguardar confirmação do usuário
    console.log('Após executar o SQL, pressione ENTER para continuar com a migração de dados...');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

runMigration();
