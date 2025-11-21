const http = require('http');

const options = {
  hostname: '192.168.1.4',
  port: 3000,
  path: '/api/content/index',
  method: 'GET',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const json = JSON.parse(data);
    
    console.log('\n=== VERIFICAÇÃO API ===\n');
    console.log('Tem __shared__?', !!json.content.__shared__);
    
    if (json.content.__shared__) {
      console.log('Tem testimonials?', !!json.content.__shared__.testimonials);
      
      if (json.content.__shared__.testimonials) {
        console.log(`Total testimonials: ${json.content.__shared__.testimonials.length}`);
        console.log('\nPrimeiro testemunho:');
        console.log(JSON.stringify(json.content.__shared__.testimonials[0], null, 2));
      }
    }
    
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
  process.exit(1);
});

req.end();
