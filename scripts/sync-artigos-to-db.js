/**
 * Script para sincronizar artigos do Artigos.json para o Supabase
 * Mantém a estrutura de artigos em três categorias: esoterica, cientifica e unificada
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cgtscngqrgyfspfvzbkc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndHNjbmdxcmd5ZnNwZnZ6YmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NzE2MDEsImV4cCI6MjA0NjE0NzYwMX0.SZqzstanovnika1R5hxLQxTGu0K8nqPt3PdWRvQW_KmGY2h8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncArticles() {
  try {
    console.log('🚀 Iniciando sincronização de artigos...\n');

    // Carregar dados do JSON
    const jsonPath = join(__dirname, '..', 'src', 'locales', 'pt-BR', 'Artigos.json');
    const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    if (!jsonData.articles) {
      console.error('❌ Estrutura "articles" não encontrada no JSON');
      return;
    }

    // Combinar todos os artigos
    const allArticles = [
      ...(jsonData.articles.esoterica || []),
      ...(jsonData.articles.cientifica || []),
      ...(jsonData.articles.unificada || [])
    ];

    console.log(`📊 Total de artigos encontrados: ${allArticles.length}`);
    console.log(`   - Esotérica: ${jsonData.articles.esoterica?.length || 0}`);
    console.log(`   - Científica: ${jsonData.articles.cientifica?.length || 0}`);
    console.log(`   - Unificada: ${jsonData.articles.unificada?.length || 0}\n`);

    // Verificar se há artigos
    if (allArticles.length === 0) {
      console.log('⚠️  Nenhum artigo para sincronizar');
      return;
    }

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const article of allArticles) {
      try {
        // Verificar se o artigo já existe (por slug)
        const { data: existing } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('slug', article.slug)
          .single();

        // Preparar dados do artigo para o banco
        const postData = {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: `<h2>Introdução</h2><p>${article.excerpt}</p>`, // Conteúdo básico
          author: article.author,
          category: article.category,
          tags: [article.type, article.category.toLowerCase().replace(/\s+/g, '-')],
          cover_image: null,
          published: true,
          published_at: article.date,
        };

        if (existing) {
          // Atualizar artigo existente
          const { error } = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('id', existing.id);

          if (error) throw error;
          updated++;
          console.log(`✅ Atualizado: ${article.title}`);
        } else {
          // Inserir novo artigo
          const { error } = await supabase
            .from('blog_posts')
            .insert(postData);

          if (error) throw error;
          inserted++;
          console.log(`✨ Inserido: ${article.title}`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Erro ao processar "${article.title}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESUMO DA SINCRONIZAÇÃO');
    console.log('='.repeat(60));
    console.log(`✨ Artigos inseridos: ${inserted}`);
    console.log(`✅ Artigos atualizados: ${updated}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total processado: ${inserted + updated + errors}/${allArticles.length}`);
    console.log('='.repeat(60) + '\n');

    if (errors === 0) {
      console.log('🎉 Sincronização concluída com sucesso!\n');
    } else {
      console.log('⚠️  Sincronização concluída com alguns erros.\n');
    }

  } catch (error) {
    console.error('💥 Erro fatal durante sincronização:', error);
    process.exit(1);
  }
}

// Executar
syncArticles();
