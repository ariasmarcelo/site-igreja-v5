// Script de emergência para restaurar texto perdido
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgzMDMsImV4cCI6MjA3ODE0NDMwM30.Cr4-GIPzlUoTOOTt5C5UZfysreDtVPO1fyJpmKazPEI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreText() {
  console.log('🔧 Restaurando texto perdido...');
  
  const textoOriginal = "Intervenções fundadas na neurofisiologia do trauma, oferecendo compreensão profunda dos sistemas autônomos e emocionais. Abordagem que valoriza a experiência subjetiva, acreditando que somos essencialmente bons e capazes de escolhas conscientes.";
  
  const { data, error } = await supabase
    .from('text_entries')
    .upsert({
      page_id: 'tratamentos',
      json_key: 'tratamentos.treatments[0].details',
      content: { 'pt-BR': textoOriginal },
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'json_key'
    })
    .select();
  
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log('✅ Texto restaurado com sucesso!');
  console.log('Dados:', data);
}

restoreText().catch(console.error);
