const http = require('http');

const options = {
  hostname: '192.168.1.4',
  port: 3000,
  path: '/api/content/index',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const json = JSON.parse(data);
    
    if (json.content.__shared__?.testimonials) {
      console.log('\n✅ Testemunhos encontrados em __shared__!');
      console.log(`Total: ${json.content.__shared__.testimonials.length} testemunhos\n`);
      console.log('Primeiros 3:');
      json.content.__shared__.testimonials.slice(0, 3).forEach((t, i) => {
        console.log(`\n[${i}] ${t.name} (${t.date})`);
        console.log(`    ${t.content.substring(0, 80)}...`);
      });
    } else {
      console.log('\n❌ Testemunhos NÃO encontrados em __shared__');
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();
