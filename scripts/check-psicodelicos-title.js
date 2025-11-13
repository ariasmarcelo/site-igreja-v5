import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler .env manualmente
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPsicodelicosTitle() {
  console.log('🔍 Verificando título da seção psicodélicos no banco...\n');
  
  // Buscar o título
  const { data: titleData, error: titleError } = await supabase
    .from('text_entries')
    .select('*')
    .eq('page_id', 'purificacao')
    .eq('key_path', 'psicodelicos.title');
  
  if (titleError) {
    console.error('❌ Erro ao buscar título:', titleError);
    return;
  }
  
  console.log('📝 Título encontrado:');
  console.log(JSON.stringify(titleData, null, 2));
  
  // Buscar todas as entradas relacionadas a psicodelicos
  const { data: allData, error: allError } = await supabase
    .from('text_entries')
    .select('*')
    .eq('page_id', 'purificacao')
    .like('key_path', 'psicodelicos%')
    .order('key_path');
  
  if (allError) {
    console.error('❌ Erro ao buscar entradas:', allError);
    return;
  }
  
  console.log('\n📋 Todas as entradas de psicodélicos:');
  allData.forEach(entry => {
    console.log(`  ${entry.key_path}: "${entry.value}"`);
  });
  
  // Verificar o que está no JSON local
  console.log('\n📄 Comparando com JSON local...');
  
  const jsonPath = path.join(__dirname, '../src/locales/pt-BR/Purificacao.json');
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('JSON local - psicodelicos.title:', jsonContent.psicodelicos?.title);
}

checkPsicodelicosTitle();
