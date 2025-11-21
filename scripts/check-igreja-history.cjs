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
    const igrejaDesc = json.data.filter(item => 
      item.json_key === 'igreja.description[0]' ||
      item.json_key === 'igreja.description[1]' ||
      item.json_key === 'igreja.description[2]'
    );
    
    console.log('\n=== HISTÓRICO DOS REGISTROS IGREJA.DESCRIPTION ===\n');
    igrejaDesc.forEach(item => {
      console.log(`Key: ${item.json_key}`);
      console.log(`ID: ${item.id}`);
      console.log(`Created: ${item.created_at}`);
      console.log(`Updated: ${item.updated_at}`);
      console.log(`Content: ${JSON.stringify(item.content, null, 2)}`);
      console.log('---\n');
    });
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.end();
