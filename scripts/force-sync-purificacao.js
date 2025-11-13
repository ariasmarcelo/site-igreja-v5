import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://etpvspttppzklzhnwmij.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cHZzcHR0cHB6a2x6aG53bWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNDc1NjYsImV4cCI6MjA0NjgyMzU2Nn0.A88rYi0mDJywJNR-rnPJCrb4oiDr_RyqN7j8H-iKpEk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncPurificacao() {
  console.log('📖 Lendo Purificacao.json...');
  
  const jsonPath = path.join(__dirname, '..', 'src', 'locales', 'pt-BR', 'Purificacao.json');
  const purificacaoData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  console.log('✓ JSON carregado');
  console.log('  Has intro1:', !!purificacaoData.psicodelicos.intro1);
  console.log('  Has intro2:', !!purificacaoData.psicodelicos.intro2);
  console.log('  intro1:', purificacaoData.psicodelicos.intro1?.substring(0, 50) + '...');
  console.log('  intro2:', purificacaoData.psicodelicos.intro2?.substring(0, 50) + '...');
  
  console.log('\n📤 Atualizando Supabase...');
  
  // Tentar atualizar registro existente
  const { data: updateData, error: updateError } = await supabase
    .from('page_contents')
    .update({
      content: purificacaoData,
      updated_at: new Date().toISOString()
    })
    .eq('page_id', 'purificacao')
    .select();
    
  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError.message);
    console.log('\n📝 Tentando inserir novo registro...');
    
    // Se falhou, tentar inserir
    const { data: insertData, error: insertError } = await supabase
      .from('page_contents')
      .insert({
        page_id: 'purificacao',
        locale: 'pt-BR',
        content: purificacaoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError.message);
      process.exit(1);
    } else {
      console.log('✅ Registro inserido com sucesso!');
      console.log('   ID:', insertData[0]?.id);
    }
  } else {
    console.log('✅ Registro atualizado com sucesso!');
    console.log('   Registros atualizados:', updateData.length);
  }
  
  console.log('\n🔄 Agora recarregue a página: http://localhost:8080/purificacao');
}

syncPurificacao().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
