// Script para limpar cache do localStorage e recarregar
console.log('🗑️ Limpando cache do localStorage...');
const keys = Object.keys(localStorage);
let clearedCount = 0;

keys.forEach(key => {
  if (key.startsWith('page_cache_') || key.startsWith('page_history_')) {
    localStorage.removeItem(key);
    console.log(`  ✓ Removido: ${key}`);
    clearedCount++;
  }
});

console.log(`✅ ${clearedCount} chaves limpas`);
console.log('🔄 Recarregue a página com Ctrl+Shift+R ou F5');
