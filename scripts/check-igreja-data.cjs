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
    console.log('\n=== RESPOSTA DA API ===');
    console.log(JSON.stringify(json, null, 2));
    
    if (json.data) {
      const igrejaData = json.data.filter(item => item.json_key.startsWith('igreja.'));
      
      console.log('\n=== DADOS DA IGREJA ===\n');
      igrejaData.forEach(item => {
        console.log(`Key: ${item.json_key}`);
        console.log(`Content: ${JSON.stringify(item.content, null, 2)}`);
        console.log('---');
      });
      console.log(`\nTotal: ${igrejaData.length} registros`);
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();
