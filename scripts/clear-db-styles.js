#!/usr/bin/env node

/**
 * Script para limpar estilos corrompidos do banco de dados
 * Mantém apenas um CSS vazio para não quebrar a estrutura
 */

import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase (mesmas usadas no update-server.js)
const supabaseUrl = 'https://etpvspttppzklzhnwmij.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cHZzcHR0cHB6a2x6aG53bWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNDc1NjYsImV4cCI6MjA0NjgyMzU2Nn0.A88rYi0mDJywJNR-rnPJCrb4oiDr_RyqN7j8H-iKpEk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearStyles() {
  console.log('\n🧹 Limpando estilos corrompidos do banco de dados...\n');

  try {
    // Listar estilos atuais
    const { data: currentStyles, error: listError } = await supabase
      .from('page_styles')
      .select('page_id, css')
      .order('page_id');

    if (listError) throw listError;

    console.log('📋 Estilos encontrados:');
    currentStyles.forEach(style => {
      console.log(`   - ${style.page_id}: ${style.css.length} caracteres`);
    });

    // Limpar cada página
    console.log('\n🔄 Limpando estilos...\n');

    for (const style of currentStyles) {
      const { error: updateError } = await supabase
        .from('page_styles')
        .update({
          css: '/* Estilos limpos - usando apenas Tailwind CSS inline */',
          updated_at: new Date().toISOString()
        })
        .eq('page_id', style.page_id);

      if (updateError) {
        console.error(`   ❌ Erro ao limpar ${style.page_id}:`, updateError.message);
      } else {
        console.log(`   ✅ ${style.page_id}: Limpo`);
      }
    }

    console.log('\n✨ Estilos limpos com sucesso!');
    console.log('📌 Agora as páginas usarão apenas Tailwind CSS inline dos componentes TSX\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

clearStyles();
