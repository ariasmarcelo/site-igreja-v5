import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testStylesSave() {
  console.log('🧪 Testando salvamento de estilos na página purificacao...\n');
  
  // Simular o que o Visual Page Editor faz
  const testCss = `.test-class { color: blue; font-size: 16px; }`;
  
  const payload = {
    pageId: 'purificacao',
    css: testCss
  };
  
  console.log('📤 Enviando para API local...');
  console.log('   URL: http://localhost:3001/api/save-styles');
  console.log('   Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch('http://localhost:3001/api/save-styles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log('\n📥 Resposta recebida:');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('   Body (raw):', responseText);
    
    try {
      const responseJson = JSON.parse(responseText);
      console.log('   Body (parsed):', JSON.stringify(responseJson, null, 2));
      
      if (response.ok) {
        console.log('\n✅ Teste bem-sucedido!');
      } else {
        console.log('\n❌ Teste falhou!');
        console.log('   Erro:', responseJson.message || responseJson.error);
        console.log('   Detalhes:', responseJson.details);
      }
    } catch (e) {
      console.log('   (Não é JSON)');
    }
    
  } catch (error) {
    console.error('\n❌ Erro na requisição:', error.message);
  }
}

testStylesSave();
