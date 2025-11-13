import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Ler o JSON local correto (tem intro1 e intro2 separados)
const localData = JSON.parse(
  fs.readFileSync('src/locales/pt-BR/Purificacao.json', 'utf8')
);

async function restorePsicodelicos() {
  console.log('📝 Restaurando seção psicodelicos do backup...\n');
  
  // Buscar conteúdo atual
  const { data: current } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'purificacao')
    .single();
  
  // Atualizar apenas a seção psicodelicos
  current.content.psicodelicos = localData.psicodelicos;
  
  // Salvar de volta
  const { error } = await supabase
    .from('page_contents')
    .update({ 
      content: current.content,
      updated_at: new Date().toISOString()
    })
    .eq('page_id', 'purificacao');
  
  if (error) {
    console.error('❌ Erro ao atualizar:', error);
    return;
  }
  
  console.log('✅ Seção psicodelicos restaurada com sucesso!');
  console.log('\n📝 Estrutura restaurada:');
  console.log(JSON.stringify(localData.psicodelicos, null, 2));
}

restorePsicodelicos();
