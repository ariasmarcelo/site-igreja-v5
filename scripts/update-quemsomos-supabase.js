import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://laikwxajpcahfatiybnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaWt3eGFqcGNhaGZhdGl5Ym5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU2ODMwMywiZXhwIjoyMDc4MTQ0MzAzfQ.nvcfxdNtcl5FhU7-xvEq3niiqCzdUzobGIshth5klLE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateQuemSomosData() {
  try {
    console.log('🔄 Atualizando dados de QuemSomos no Supabase...');
    
    // Ler o JSON local
    const jsonPath = path.join(__dirname, '../src/locales/pt-BR/QuemSomos.json');
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log('📖 JSON carregado:', Object.keys(jsonContent));
    console.log('📝 magia.introducao:', jsonContent.magia.introducao?.length, 'parágrafos');
    console.log('📝 magia.caracteristicas.items:', jsonContent.magia.caracteristicas?.items?.length, 'itens');
    
    // Atualizar no Supabase (UPSERT para criar ou atualizar)
    const { data, error } = await supabase
      .from('page_contents')
      .upsert({ 
        page_id: 'quemsomos',
        content: jsonContent,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page_id'
      })
      .select();
    
    if (error) {
      console.error('❌ Erro ao salvar:', error);
      return;
    }
    
    console.log('✅ Dados salvos com sucesso!');
    if (data && data.length > 0) {
      console.log('📊 Registro:', data[0].page_id);
    }
    
    // Verificar o que foi salvo
    const { data: checkData } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', 'quemsomos')
      .single();
    
    if (checkData) {
      console.log('\n🔍 Verificação do que foi salvo:');
      console.log('magia.introducao:', checkData.content.magia?.introducao ? `${checkData.content.magia.introducao.length} parágrafos` : 'NÃO EXISTE');
      console.log('magia.caracteristicas:', checkData.content.magia?.caracteristicas ? `${checkData.content.magia.caracteristicas.items?.length} itens` : 'NÃO EXISTE');
      console.log('magia.paragraphs (ANTIGO):', checkData.content.magia?.paragraphs ? `${checkData.content.magia.paragraphs.length} parágrafos` : 'não existe');
    }
    
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

updateQuemSomosData();
