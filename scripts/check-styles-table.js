import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkStylesTable() {
  console.log('🔍 Verificando tabela page_styles...\n');
  
  // Tentar buscar todos os registros
  const { data: allData, error: allError } = await supabase
    .from('page_styles')
    .select('*');
  
  if (allError) {
    console.error('❌ Erro ao buscar todos os registros:', allError);
    console.log('\n💡 A tabela page_styles pode não existir ou não ter permissões corretas.');
    
    // Tentar criar a tabela
    console.log('\n📝 Tentando verificar se a tabela existe...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('page_styles')
      .select('page_id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Tabela não existe ou sem permissão:', tableError.message);
      console.log('\n🛠️ SOLUÇÃO: Execute este SQL no Supabase:');
      console.log(`
CREATE TABLE IF NOT EXISTS page_styles (
  page_id TEXT PRIMARY KEY,
  css TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE page_styles ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir tudo (ajuste conforme necessário)
CREATE POLICY "Enable all access for service role" ON page_styles
  FOR ALL
  USING (true)
  WITH CHECK (true);
      `);
    }
  } else {
    console.log('✅ Tabela page_styles existe!');
    console.log(`📊 Total de registros: ${allData.length}\n`);
    
    if (allData.length > 0) {
      console.log('📝 Registros encontrados:');
      allData.forEach(record => {
        console.log(`   - page_id: ${record.page_id}`);
        console.log(`     css length: ${record.css?.length || 0} caracteres`);
        console.log(`     updated_at: ${record.updated_at}`);
      });
    } else {
      console.log('⚠️ Nenhum registro encontrado na tabela.');
    }
  }
  
  // Testar inserção
  console.log('\n🧪 Testando inserção/atualização...');
  const testPageId = 'test-page';
  const testCss = '.test { color: red; }';
  
  const { data: upsertData, error: upsertError } = await supabase
    .from('page_styles')
    .upsert({
      page_id: testPageId,
      css: testCss,
      updated_at: new Date().toISOString()
    })
    .select();
  
  if (upsertError) {
    console.error('❌ Erro ao fazer upsert:', upsertError);
    console.log('   Código:', upsertError.code);
    console.log('   Detalhes:', upsertError.details);
    console.log('   Hint:', upsertError.hint);
  } else {
    console.log('✅ Upsert funcionou!');
    console.log('   Dados inseridos:', upsertData);
    
    // Limpar teste
    await supabase.from('page_styles').delete().eq('page_id', testPageId);
    console.log('🧹 Registro de teste removido.');
  }
}

checkStylesTable();
