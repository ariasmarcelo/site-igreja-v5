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

async function createTables() {
  console.log('🔧 Criando novas tabelas no Supabase...\n');

  try {
    // Ler o arquivo SQL
    const migrationFile = path.resolve(__dirname, '../supabase/migrations/20251112_create_granular_tables.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('📄 Executando migration SQL...');
    
    // Executar SQL via RPC (raw SQL execution)
    // Nota: Supabase precisa de permissões adequadas para executar DDL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Se não tiver a função exec_sql, vamos criar as tabelas manualmente via REST API
      console.log('⚠️  Função exec_sql não disponível, criando tabelas via API...\n');
      
      // Criar text_entries
      console.log('📝 Criando tabela text_entries...');
      const { error: textError } = await supabase
        .from('text_entries')
        .select('id')
        .limit(1);

      if (textError && textError.message.includes('does not exist')) {
        console.log('   ⚠️  Tabela text_entries não existe. Será necessário criar via SQL Editor.');
        console.log('   📍 Acesse: https://laikwxajpcahfatiybnb.supabase.co/project/_/sql');
        console.log('   📄 Execute o SQL em: supabase/migrations/20251112_create_granular_tables.sql\n');
        
        console.log('Ou cole este SQL no SQL Editor do Supabase:\n');
        console.log('═'.repeat(80));
        console.log(sql);
        console.log('═'.repeat(80));
        
        return false;
      } else {
        console.log('   ✅ Tabela text_entries já existe');
      }

      // Criar style_entries
      console.log('🎨 Criando tabela style_entries...');
      const { error: styleError } = await supabase
        .from('style_entries')
        .select('id')
        .limit(1);

      if (styleError && styleError.message.includes('does not exist')) {
        console.log('   ⚠️  Tabela style_entries não existe.');
        return false;
      } else {
        console.log('   ✅ Tabela style_entries já existe');
      }
      
      console.log('\n✅ Tabelas verificadas com sucesso!');
      return true;
    }

    console.log('✅ Migration SQL executada com sucesso!');
    return true;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

// Executar
createTables().then(success => {
  if (success) {
    console.log('\n🎯 Próximo passo: Execute o script de migração de dados');
    console.log('   node scripts/migrate-to-granular.js');
  } else {
    console.log('\n⏸️  Aguardando criação das tabelas no Supabase Dashboard');
    console.log('   Após criar as tabelas, execute: node scripts/migrate-to-granular.js');
  }
});
