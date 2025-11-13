import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkTableStructure() {
  // Buscar registro existente de purificacao
  const { data, error } = await supabase
    .from('page_styles')
    .select('*')
    .eq('page_id', 'purificacao')
    .single();
  
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Estrutura do registro:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\nCampos disponíveis:', Object.keys(data));
  }
}

checkTableStructure();
