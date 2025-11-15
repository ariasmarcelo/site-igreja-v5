const { open } = require('lmdb');
const path = require('path');

const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
const db = open({ 
  path: dbPath, 
  compression: true,
  noSubdir: false,
  maxReaders: 126
});

console.log('🔍 Inspecionando cache LMDB...\n');

const pages = ['index', 'contato', 'tratamentos', 'purificacao', 'quemsomos', 'testemunhos', 'artigos'];

pages.forEach(pageId => {
  console.log(`\n📄 ${pageId.toUpperCase()}:`);
  
  const cached = db.get(pageId);
  
  if (!cached) {
    console.log('  ❌ Não encontrado no cache');
    return;
  }
  
  if (cached.invalidatedAt !== null && cached.invalidatedAt !== undefined) {
    console.log(`  ⚠️  Invalidado em: ${new Date(cached.invalidatedAt).toLocaleString()}`);
    return;
  }
  
  console.log('  ✅ Cache válido');
  
  if (cached.data) {
    const keys = Object.keys(cached.data);
    console.log(`  📋 ${keys.length} chaves principais: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
    
    // Mostrar header se existir
    if (cached.data.header) {
      console.log(`  📌 Header title: "${cached.data.header.title || 'N/A'}"`);
    }
  }
});

db.close();
console.log('\n✅ Inspeção concluída');
