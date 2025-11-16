// Teste rápido da conexão com a tabela artigos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tpscvkwrqvxzmxqhokap.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwc2N2a3dycXZ4em14cWhva2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTMyNzUsImV4cCI6MjA0NjM4OTI3NX0.vJsE8EkAzQVlw_bDfVGz7rqNYnqBVjrn6AXVj-RiBqo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧪 Testando conexão com tabela artigos...\n');

async function testArtigosTable() {
  try {
    // Teste 1: Listar artigos
    const { data: artigos, error: listError, count } = await supabase
      .from('artigos')
      .select('id, title, slug, published, views, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (listError) {
      console.error('❌ Erro ao acessar tabela artigos:', listError.message);
      console.log('\n💡 Verifique se:');
      console.log('   1. O SQL foi executado no Supabase');
      console.log('   2. A tabela "artigos" existe');
      console.log('   3. As policies RLS estão corretas\n');
      return;
    }
    
    console.log('✅ Conexão com Supabase OK!');
    console.log(`📊 Total de artigos: ${count || 0}\n`);
    
    console.log('📝 Artigos no banco:');
    console.log('─'.repeat(80));
    
    if (artigos && artigos.length > 0) {
      artigos.forEach((artigo, index) => {
        const status = artigo.published ? '✅ Publicado' : '📝 Rascunho';
        const date = new Date(artigo.created_at).toLocaleDateString('pt-BR');
        const views = artigo.views || 0;
        console.log(`${index + 1}. ${status} | ${artigo.title}`);
        console.log(`   Slug: ${artigo.slug} | Views: ${views} | Data: ${date}`);
        console.log('');
      });
    } else {
      console.log('ℹ️  Nenhum artigo encontrado.');
      console.log('💡 Execute o SQL de inserção de exemplos no Supabase SQL Editor\n');
    }
    
    console.log('─'.repeat(80));
    console.log('\n✅ Teste concluído!');
    console.log(`\n🌐 Para acessar o editor:`);
    console.log(`   1. Abra: http://localhost:3000/admin`);
    console.log(`   2. Clique na aba "Artigos"`);
    console.log(`   3. Use o botão "Novo Post" para criar artigos\n`);
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

testArtigosTable();
