// Vercel Serverless Function - Sync Granular Fallbacks
const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { pageId, content } = req.body;

    if (!pageId || !content) {
      return res.status(400).json({ success: false, message: 'pageId and content required' });
    }

    // Converter pageId para PascalCase (index -> Index, quem-somos -> QuemSomos)
    const pageName = pageId
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    // Caminho base para JSONs granulares
    const fallbacksDir = path.join(process.cwd(), 'src', 'locales', 'pt-BR');
    
    // Criar diretório se não existir
    await fs.mkdir(fallbacksDir, { recursive: true });

    // Função recursiva para salvar cada campo como JSON individual
    async function saveGranularJSON(obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}.${key}` : key;
        const fullPath = `${pageName}.${currentPath}`;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Objeto aninhado - recursão
          await saveGranularJSON(value, currentPath);
        } else if (Array.isArray(value)) {
          // Array - salvar cada item com índice
          for (let i = 0; i < value.length; i++) {
            const arrayPath = `${currentPath}[${i}]`;
            const arrayFullPath = `${pageName}.${arrayPath}`;
            
            if (typeof value[i] === 'object') {
              await saveGranularJSON(value[i], arrayPath);
            } else {
              const fileName = `${arrayFullPath}.json`;
              const filePath = path.join(fallbacksDir, fileName);
              await fs.writeFile(filePath, JSON.stringify(value[i], null, 2), 'utf-8');
            }
          }
        } else {
          // Valor primitivo - salvar JSON
          const fileName = `${fullPath}.json`;
          const filePath = path.join(fallbacksDir, fileName);
          
          // Ler arquivo existente (se houver) e comparar
          try {
            const existing = await fs.readFile(filePath, 'utf-8');
            const existingValue = JSON.parse(existing);
            
            // Se igual, pular
            if (JSON.stringify(existingValue) === JSON.stringify(value)) {
              return;
            }
          } catch {
            // Arquivo não existe ou erro ao ler - continua para salvar
          }
          
          // Salvar novo valor
          await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
        }
      }
    }

    await saveGranularJSON(content);

    res.status(200).json({ 
      success: true, 
      message: 'Fallbacks sincronizados',
      pageId,
      pageName
    });
  } catch (error) {
    console.error('Erro ao sincronizar fallbacks:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erro ao sincronizar fallbacks' 
    });
  }
};
