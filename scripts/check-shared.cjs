require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkShared() {
  console.log('=== __SHARED__ CONTENT ===\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .eq('page_id', '__shared__')
    .order('json_key');
  
  if (error) {
    console.log('ERRO:', error.message);
    return;
  }
  
  console.log('Total:', data.length, 'registros\n');
  
  data.forEach(d => {
    console.log(d.json_key + ':', d.content['pt-BR'].substring(0, 80));
  });
}

checkShared();
