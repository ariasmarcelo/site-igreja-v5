import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRATAMENTOS_JSON = path.join(__dirname, '../src/locales/pt-BR/Tratamentos.json');
const API_URL = 'http://localhost:3001/api/save-json';

async function syncTratamentos() {
  try {
    console.log('📖 Lendo Tratamentos.json...');
    const jsonContent = JSON.parse(fs.readFileSync(TRATAMENTOS_JSON, 'utf8'));
    console.log('✓ JSON carregado com sucesso');
    console.log('📊 Chaves principais:', Object.keys(jsonContent).join(', '));

    console.log('📤 Enviando para banco de dados (localhost:3001)...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageId: 'tratamentos',
        content: jsonContent
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Sincronização concluída com sucesso!');
      console.log('📝 Detalhes:', result);
      console.log('\n🌐 Conteúdo atualizado no Supabase!');
      console.log('🔄 Recarregue o site para ver as mudanças');
    } else {
      console.error('❌ Erro ao sincronizar:', result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

syncTratamentos();
