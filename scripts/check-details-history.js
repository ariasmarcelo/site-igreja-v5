// Verificar histórico recente de edições no campo details
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgzMDMsImV4cCI6MjA3ODE0NDMwM30.Cr4-GIPzlUoTOOTt5C5UZfysreDtVPO1fyJpmKazPEI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHistory() {
  console.log('📊 Verificando histórico do campo details...\n');
  
  const { data, error } = await supabase
    .from('text_entries')
    .select('json_key, content, updated_at, created_at')
    .eq('json_key', 'tratamentos.treatments[0].details')
    .single();
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log('✅ Campo encontrado:');
  console.log('   json_key:', data.json_key);
  console.log('   created_at:', data.created_at);
  console.log('   updated_at:', data.updated_at);
  console.log('   content:', data.content['pt-BR']);
  console.log('\n🔍 O campo existe e tem conteúdo no banco!');
  console.log('\n💡 Se sumiu da página, pode ser:');
  console.log('   1. Cache do navegador');
  console.log('   2. Elemento não sendo renderizado no HTML');
  console.log('   3. API não sendo consultada corretamente pela página');
}

checkHistory();
