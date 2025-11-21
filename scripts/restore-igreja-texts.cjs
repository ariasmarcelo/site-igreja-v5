const http = require('http');

const edits = {
  "igreja.description[1]": { 
    "newText": "Somos uma organização iniciática e religiosa, na qual a transformação pessoal e a elevação da consciência humana são o foco central de nossos trabalhos." 
  },
  "igreja.description[2]": { 
    "newText": "Promovemos uma Jornada de Purificação e Ascensão, guiando cada membro através de um processo estruturado que busca a liberação de cargas psíquicas e de energias densas." 
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

console.log('Restaurando textos da Igreja...\n');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta da API:');
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.write(postData);
req.end();
