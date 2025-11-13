import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkPsicodelicos() {
  const { data, error } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page_id', 'purificacao')
    .single();
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log('📝 Seção psicodelicos:');
  console.log(JSON.stringify(data.content.psicodelicos, null, 2));
}

checkPsicodelicos();
