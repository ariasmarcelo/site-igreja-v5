const fetch = require('node-fetch');

async function main() {
  console.log('1. Consultando registros órfãos...\n');
  
  const response = await fetch('http://192.168.1.4:3000/api/content/index');
  const result = await response.json();
  
  const orphaned = result.data.filter(entry => 
    entry.json_key === 'instituto.treatments[7]' || 
    entry.json_key === 'instituto.treatments[8]'
  );
  
  console.log(`Encontrados ${orphaned.length} registros órfãos:\n`);
  orphaned.forEach(entry => {
    console.log(`ID: ${entry.id}`);
    console.log(`Key: ${entry.json_key}`);
    console.log(`Content: ${JSON.stringify(entry.content)}`);
    console.log('---');
  });
  
  if (orphaned.length === 0) {
    console.log('Nenhum registro órfão encontrado!');
    return;
  }
  
  console.log('\n2. Deletando registros...\n');
  
  const ids = orphaned.map(e => e.id);
  
  const deleteResponse = await fetch('http://192.168.1.4:3000/api/content/index', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  
  const deleteResult = await deleteResponse.json();
  
  console.log('Resultado:');
  console.log(JSON.stringify(deleteResult, null, 2));
}

main().catch(console.error);
