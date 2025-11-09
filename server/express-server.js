import express from 'express';
import cors from 'cors';
import apiRouter from './supabase-routes.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rotas API
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📝 Endpoints disponíveis (Supabase):`);
  console.log(`   GET  /api/content/:pageId - Buscar conteúdo JSON`);
  console.log(`   GET  /api/styles/:pageId - Buscar estilos CSS`);
  console.log(`   POST /api/save-json - Salvar JSON completo`);
  console.log(`   POST /api/save-visual-edits - Salvar edições de TEXTO`);
  console.log(`   POST /api/save-styles - Salvar edições de CSS`);
  console.log(`   PUT  /api/blog-posts/:id - Atualizar artigo do blog`);
  console.log(`   POST /api/blog-posts - Criar novo artigo do blog`);
  console.log(`\n💾 Usando Supabase (PostgreSQL) como backend`);
});
