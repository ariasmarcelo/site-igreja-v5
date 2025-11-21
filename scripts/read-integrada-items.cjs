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
    const items = json.content.fisicoEspiritual?.integrada?.oferecemos?.items;
    
    if (items) {
      console.log('\n=== ITENS DA ABORDAGEM INTEGRADA ===\n');
      items.forEach((item, i) => {
        console.log(`[${i}] ${item}\n`);
      });
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
  process.exit(1);
});

req.end();
