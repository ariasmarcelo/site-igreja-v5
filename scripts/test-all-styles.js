/**
 * Testa carregamento de estilos de todas as páginas
 */

const pages = [
  'index',
  'artigos', 
  'contato',
  'notfound',
  'purificacao',
  'quemsomos',
  'testemunhos',
  'tratamentos'
];

async function testPageStyles() {
  console.log('🧪 Testando carregamento de estilos...\n');
  
  for (const page of pages) {
    try {
      const response = await fetch(`http://localhost:3001/api/styles/${page}`);
      
      if (!response.ok) {
        console.log(`❌ ${page}: HTTP ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data && data.css) {
        const lines = data.css.split('\n').length;
        const selectors = (data.css.match(/\[data-json-key=/g) || []).length;
        console.log(`✅ ${page.padEnd(12)} - ${lines} linhas, ${selectors} seletores`);
      } else {
        console.log(`⚠️ ${page}: Sem CSS`);
      }
    } catch (error) {
      console.log(`❌ ${page}: ${error.message}`);
    }
  }
}

testPageStyles();
