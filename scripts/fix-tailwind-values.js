/**
 * Corrige valores do Tailwind para CSS válido no banco de dados
 * Executar: node scripts/fix-tailwind-values.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de valores Tailwind para CSS
const tailwindToCSS = {
  // line-height
  'tight': '1.25',
  'relaxed': '1.625',
  'loose': '2',
  'normal': '1.5',
  // font-weight
  'bold': '700',
  '600': '600',
  '500': '500',
  '400': '400'
};

async function fixTailwindValues() {
  console.log('🔧 Corrigindo valores do Tailwind...\n');

  // Buscar todos os style_entries
  const { data: entries, error } = await supabase
    .from('style_entries')
    .select('*');

  if (error) {
    console.error('❌ Erro ao buscar entries:', error);
    process.exit(1);
  }

  let fixedCount = 0;

  for (const entry of entries) {
    let needsUpdate = false;
    const cssProps = { ...entry.css_properties };

    // Verificar cada propriedade
    for (const [prop, value] of Object.entries(cssProps)) {
      if (typeof value === 'string' && tailwindToCSS[value]) {
        cssProps[prop] = tailwindToCSS[value];
        needsUpdate = true;
        console.log(`  🔄 ${entry.json_key}: ${prop}: ${value} → ${tailwindToCSS[value]}`);
      }
    }

    // Atualizar se necessário
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('style_entries')
        .update({ css_properties: cssProps })
        .eq('id', entry.id);

      if (updateError) {
        console.error(`❌ Erro ao atualizar ${entry.json_key}:`, updateError);
      } else {
        fixedCount++;
      }
    }
  }

  console.log(`\n✅ Corrigidos: ${fixedCount} entries`);
}

fixTailwindValues()
  .then(() => {
    console.log('\n✨ Valores do Tailwind corrigidos!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
