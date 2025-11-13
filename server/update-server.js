import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://etpvspttppzklzhnwmij.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cHZzcHR0cHB6a2x6aG53bWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNDc1NjYsImV4cCI6MjA0NjgyMzU2Nn0.A88rYi0mDJywJNR-rnPJCrb4oiDr_RyqN7j8H-iKpEk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Endpoint: Atualizar página no Supabase
app.post('/api/update-page', async (req, res) => {
  try {
    const { pageId } = req.body;
    
    const jsonPath = path.join(__dirname, '..', 'src', 'locales', 'pt-BR', `${pageId.charAt(0).toUpperCase() + pageId.slice(1)}.json`);
    const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    const { data, error } = await supabase
      .from('page_contents')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('page_id', pageId.toLowerCase())
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 Pronto para atualizar Supabase\n`);
  console.log(`Teste: curl -X POST http://localhost:${PORT}/api/update-page -H "Content-Type: application/json" -d "{\\"pageId\\":\\"purificacao\\"}"`);
});
