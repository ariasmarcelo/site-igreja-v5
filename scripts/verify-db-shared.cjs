const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  const { data, error } = await supabase
    .from('text_entries')
    .select('page_id, json_key')
    .eq('page_id', '__shared__')
    .like('json_key', 'testimonials%');

  if (error) {
    console.error('Erro:', error);
    return;
  }

  console.log(`\n✅ ${data.length} registros de testemunhos em __shared__\n`);
  data.slice(0, 10).forEach(r => {
    console.log(`  - ${r.json_key}`);
  });
  if (data.length > 10) console.log(`  ... e mais ${data.length - 10}`);
}

verify().then(() => process.exit(0));
