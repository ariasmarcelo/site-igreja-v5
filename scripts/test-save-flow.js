// Teste completo do fluxo de salvamento
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgzMDMsImV4cCI6MjA3ODE0NDMwM30.Cr4-GIPzlUoTOOTt5C5UZfysreDtVPO1fyJpmKazPEI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSaveFlow() {
  console.log('🧪 TESTE: Salvamento de texto com prefixo pageId\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 1. Verificar estado atual
  console.log('1️⃣ Verificando texto atual no banco...');
  const { data: before, error: errorBefore } = await supabase
    .from('text_entries')
    .select('content')
    .eq('json_key', 'tratamentos.treatments[0].details')
    .single();
  
  if (errorBefore) {
    console.error('❌ Erro ao buscar:', errorBefore);
    return;
  }
  
  const textoBefore = before.content['pt-BR'];
  console.log(`✅ Texto atual: "${textoBefore.substring(0, 80)}..."\n`);
  
  // 2. Simular salvamento (como se viesse do editor)
  console.log('2️⃣ Simulando salvamento com texto modificado...');
  const textoNovo = textoBefore + ' [TESTE EDITADO EM ' + new Date().toLocaleTimeString() + ']';
  
  const { data: updated, error: errorUpdate } = await supabase
    .from('text_entries')
    .upsert({
      page_id: 'tratamentos',
      json_key: 'tratamentos.treatments[0].details',  // ✅ COM prefixo
      content: { 'pt-BR': textoNovo },
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'json_key'
    })
    .select();
  
  if (errorUpdate) {
    console.error('❌ Erro ao salvar:', errorUpdate);
    return;
  }
  
  console.log('✅ Salvamento realizado\n');
  
  // 3. Verificar se foi salvo corretamente
  console.log('3️⃣ Verificando se salvou corretamente...');
  const { data: after, error: errorAfter } = await supabase
    .from('text_entries')
    .select('content, json_key, page_id')
    .eq('json_key', 'tratamentos.treatments[0].details')
    .single();
  
  if (errorAfter) {
    console.error('❌ Erro ao buscar:', errorAfter);
    return;
  }
  
  const textoAfter = after.content['pt-BR'];
  console.log(`✅ Texto salvo: "${textoAfter.substring(0, 80)}..."`);
  console.log(`✅ json_key: ${after.json_key}`);
  console.log(`✅ page_id: ${after.page_id}\n`);
  
  // 4. Verificar se API retorna corretamente
  console.log('4️⃣ Testando se API retorna dados corretamente...');
  const apiResponse = await fetch('http://localhost:3000/api/content-v2?pages=tratamentos&refresh=true');
  const apiData = await apiResponse.json();
  
  if (apiData.success && apiData.pages?.tratamentos?.treatments?.[0]?.details) {
    const apiText = apiData.pages.tratamentos.treatments[0].details;
    console.log(`✅ API retornou: "${apiText.substring(0, 80)}..."`);
    
    if (apiText === textoAfter) {
      console.log('\n🎉 SUCESSO! Fluxo completo funcionando corretamente!');
      console.log('✅ Banco armazena com prefixo: tratamentos.treatments[0].details');
      console.log('✅ API retorna estrutura aninhada correta');
      console.log('✅ Texto não foi perdido');
    } else {
      console.log('\n⚠️ ATENÇÃO: Texto da API diferente do banco');
      console.log('Banco:', textoAfter.substring(0, 50));
      console.log('API:', apiText.substring(0, 50));
    }
  } else {
    console.log('❌ API não retornou o campo details');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

testSaveFlow();
