const http = require('http');

const edits = {
  "__shared__.testimonialsCarousel.title": { 
    "newText": "Testemunhos de Transformação" 
  },
  "__shared__.testimonialsCarousel.subtitle": { 
    "newText": "Histórias reais de cura, crescimento e despertar espiritual" 
  }
};

const postData = JSON.stringify({ edits });

const options = {
  hostname: '192.168.1.4',
  port: 3000,
  path: '/api/content/index',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Criando elementos __shared__ para o carousel de testemunhos...\n');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta da API:');
    console.log(JSON.stringify(JSON.parse(data), null, 2));
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
  process.exit(1);
});

req.write(postData);
req.end();
