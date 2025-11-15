require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function findText() {
  console.log('=== Buscando "Tratamentos Associados" ===\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key, content')
    .ilike('content->>pt-BR', '%Tratamentos Associados%');
  
  if (error) {
    console.log('ERRO:', error.message);
    return;
  }
  
  console.log('Total:', data.length, 'ocorrências\n');
  
  data.forEach(d => {
    console.log('PAGE:', d.page_id);
    console.log('KEY:', d.json_key);
    console.log('TEXT:', d.content['pt-BR'].substring(0, 100));
    console.log('---\n');
  });
}

findText();
