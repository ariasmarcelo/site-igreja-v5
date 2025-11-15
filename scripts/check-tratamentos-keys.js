// Verificar chaves de tratamentos no banco
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgzMDMsImV4cCI6MjA3ODE0NDMwM30.Cr4-GIPzlUoTOOTt5C5UZfysreDtVPO1fyJpmKazPEI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkKeys() {
  console.log('🔍 Verificando chaves de tratamentos no banco...\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('json_key, page_id')
    .eq('page_id', 'tratamentos')
    .order('json_key');
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log(`✅ Encontradas ${data.length} entradas:\n`);
  data.forEach((entry, i) => {
    console.log(`${i + 1}. ${entry.json_key}`);
  });
  
  // Verificar especificamente o details
  console.log('\n🔎 Buscando treatments[0].details...');
  const detailsEntry = data.find(e => e.json_key.includes('treatments[0].details'));
  if (detailsEntry) {
    console.log('✅ ENCONTRADO:', detailsEntry.json_key);
  } else {
    console.log('❌ NÃO ENCONTRADO');
  }
}

checkKeys();
