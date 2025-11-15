// Verificar texto final
import { open } from 'lmdb';

const db = open({path: '.cache/content-lmdb'});
const keys = Array.from(db.getKeys()).filter(k => k.startsWith('tratamentos.'));
keys.forEach(k => db.remove(k));
console.log('✅ Cache limpo\n');

const res = await fetch('http://localhost:3000/api/content-v2?pages=tratamentos');
const data = await res.json();
const details = data.pages?.tratamentos?.treatments?.[0]?.details;

console.log('🔍 Campo details:');
console.log(details);
console.log('\n✅ Teste concluído!');
