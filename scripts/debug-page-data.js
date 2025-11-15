// Debug: Verificar o que a página está recebendo
const res = await fetch('http://localhost:3000/api/content-v2?pages=tratamentos');
const data = await res.json();

console.log('📦 Dados recebidos pela página:\n');
console.log('treatments[0] completo:');
console.log(JSON.stringify(data.pages.tratamentos.treatments[0], null, 2));

console.log('\n🔍 Campo details especificamente:');
console.log('Existe?', 'details' in data.pages.tratamentos.treatments[0]);
console.log('Valor:', data.pages.tratamentos.treatments[0].details);
console.log('Tipo:', typeof data.pages.tratamentos.treatments[0].details);
console.log('É undefined?', data.pages.tratamentos.treatments[0].details === undefined);
console.log('É null?', data.pages.tratamentos.treatments[0].details === null);
console.log('É string vazia?', data.pages.tratamentos.treatments[0].details === '');

console.log('\n✅ Se details existe e tem valor, o problema é no React não renderizando');
console.log('⚠️ Se details é undefined/null/vazio, o problema é na API');
