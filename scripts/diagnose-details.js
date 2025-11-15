// Diagnóstico completo do problema
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgzMDMsImV4cCI6MjA3ODE0NDMwM30.Cr4-GIPzlUoTOOTt5C5UZfysreDtVPO1fyJpmKazPEI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('🔬 DIAGNÓSTICO COMPLETO\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 1. Verificar banco
  console.log('1️⃣ BANCO DE DADOS:');
  const { data: dbData, error } = await supabase
    .from('text_entries')
    .select('json_key, content')
    .eq('json_key', 'tratamentos.treatments[0].details')
    .single();
  
  if (error || !dbData) {
    console.log('   ❌ Campo NÃO existe no banco!');
    return;
  }
  
  const dbText = dbData.content['pt-BR'];
  console.log(`   ✅ Existe: "${dbText.substring(0, 80)}..."`);
  console.log(`   📏 Tamanho: ${dbText.length} caracteres\n`);
  
  // 2. Verificar API
  console.log('2️⃣ API (/api/content-v2):');
  const apiRes = await fetch('http://localhost:3000/api/content-v2?pages=tratamentos');
  const apiData = await apiRes.json();
  
  if (!apiData.success) {
    console.log('   ❌ API retornou erro!');
    return;
  }
  
  const treatment0 = apiData.pages?.tratamentos?.treatments?.[0];
  
  if (!treatment0) {
    console.log('   ❌ treatments[0] não existe na resposta!');
    return;
  }
  
  console.log('   ✅ treatments[0] existe');
  console.log('   Campos:', Object.keys(treatment0).join(', '));
  
  if (treatment0.details) {
    console.log(`   ✅ details existe: "${treatment0.details.substring(0, 80)}..."`);
    console.log(`   📏 Tamanho: ${treatment0.details.length} caracteres`);
    
    if (treatment0.details === dbText) {
      console.log('   ✅ MATCH: API retorna exatamente o que está no banco!\n');
    } else {
      console.log('   ⚠️ DIFERENTE: API retorna texto diferente do banco!');
      console.log('   DB:', dbText.substring(0, 50));
      console.log('   API:', treatment0.details.substring(0, 50));
    }
  } else {
    console.log('   ❌ details NÃO existe na resposta da API!\n');
  }
  
  // 3. Conclusão
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📋 DIAGNÓSTICO:');
  
  if (treatment0?.details) {
    console.log('✅ Banco: OK');
    console.log('✅ API: OK');
    console.log('\n💡 Se o campo sumiu da PÁGINA:');
    console.log('   → Limpe o cache do navegador (Ctrl+Shift+R)');
    console.log('   → Verifique se a página está usando /api/content-v2');
    console.log('   → Inspecione o HTML e procure por data-json-key="tratamentos.treatments[0].details"');
  } else {
    console.log('❌ Problema identificado: API não retorna o campo details');
  }
}

diagnose();
