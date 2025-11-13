/**
 * Restaura estilos estéticos da página Index usando estilos originais do Git
 * Executar: node scripts/restore-index-styles-from-git.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Carrega variáveis de .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Estilos extraídos do git diff (versão original antes da limpeza)
const indexStyles = [
  // Hero Section
  {
    json_key: 'index.hero.title',
    css_properties: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#222222',
      lineHeight: 'tight'
    }
  },
  {
    json_key: 'index.hero.title@md',
    css_properties: {
      fontSize: '4.5rem'
    }
  },
  {
    json_key: 'index.hero.subtitle',
    css_properties: {
      fontSize: '1.5rem',
      color: '#CFAF5A',
      fontWeight: '600'
    }
  },
  {
    json_key: 'index.hero.subtitle@md',
    css_properties: {
      fontSize: '1.875rem'
    }
  },

  // Igreja Section
  {
    json_key: 'index.igreja.title',
    css_properties: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#222222'
    }
  },
  {
    json_key: 'index.igreja.title@md',
    css_properties: {
      fontSize: '3rem'
    }
  },
  {
    json_key: 'index.igreja.description[0]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.igreja.description[1]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.igreja.description[2]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },

  // Purification Card
  {
    json_key: 'index.purification.title',
    css_properties: {
      fontSize: '1.5rem'
    }
  },

  // Instituto Section (nos cards)
  {
    json_key: 'index.instituto.title',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.instituto.description[0]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.instituto.description[1]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.instituto.description[2]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.instituto.legalNotice',
    css_properties: {
      fontSize: '0.875rem',
      color: '#92400e'
    }
  },
  {
    json_key: 'index.instituto.ctaButton',
    css_properties: {
      fontWeight: '600'
    }
  },

  // Benefits Section
  {
    json_key: 'index.benefitsSection.title',
    css_properties: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      color: '#222222'
    }
  },
  {
    json_key: 'index.benefitsSection.title@md',
    css_properties: {
      fontSize: '3rem'
    }
  },
  {
    json_key: 'index.benefitsSection.subtitle',
    css_properties: {
      fontSize: '1.25rem',
      color: '#4b5563'
    }
  },
  {
    json_key: 'index.instituto.benefits[0].title',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.instituto.benefits[0].description',
    css_properties: {
      fontSize: '1rem',
      color: '#374151'
    }
  },
  {
    json_key: 'index.instituto.benefits[1].title',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.instituto.benefits[1].description',
    css_properties: {
      fontSize: '1rem',
      color: '#374151'
    }
  },
  {
    json_key: 'index.instituto.benefits[2].title',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.instituto.benefits[2].description',
    css_properties: {
      fontSize: '1rem',
      color: '#374151'
    }
  },

  // Físico/Espiritual Section
  {
    json_key: 'index.fisicoEspiritual.title',
    css_properties: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.title@sm',
    css_properties: {
      fontSize: '1.875rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.title@md',
    css_properties: {
      fontSize: '2.25rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.subtitle',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.subtitle@sm',
    css_properties: {
      fontSize: '1.25rem'
    }
  },

  // Físico (azul)
  {
    json_key: 'index.fisicoEspiritual.fisico.title',
    css_properties: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1d4ed8'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.title@sm',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.subtitle',
    css_properties: {
      fontSize: '1rem',
      color: '#2563eb',
      fontWeight: '600'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.subtitle@sm',
    css_properties: {
      fontSize: '1.125rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.description',
    css_properties: {
      fontSize: '0.875rem',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.description@sm',
    css_properties: {
      fontSize: '1rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.abordagem.title',
    css_properties: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#1e40af'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.abordagem.title@sm',
    css_properties: {
      fontSize: '0.875rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.abordagem.description',
    css_properties: {
      fontSize: '0.75rem',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.abordagem.description@sm',
    css_properties: {
      fontSize: '0.875rem'
    }
  },

  // Espiritual (laranja/âmbar)
  {
    json_key: 'index.fisicoEspiritual.espiritual.title',
    css_properties: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#b45309'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.title@sm',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.subtitle',
    css_properties: {
      fontSize: '1rem',
      color: '#d97706',
      fontWeight: '600'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.subtitle@sm',
    css_properties: {
      fontSize: '1.125rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.description',
    css_properties: {
      fontSize: '0.875rem',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.description@sm',
    css_properties: {
      fontSize: '1rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.abordagem.title',
    css_properties: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#92400e'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.abordagem.title@sm',
    css_properties: {
      fontSize: '0.875rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.abordagem.description',
    css_properties: {
      fontSize: '0.75rem',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.abordagem.description@sm',
    css_properties: {
      fontSize: '0.875rem'
    }
  },

  // Integrada (roxo)
  {
    json_key: 'index.fisicoEspiritual.integrada.title',
    css_properties: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#7c3aed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.title@sm',
    css_properties: {
      fontSize: '1.5rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.description',
    css_properties: {
      fontSize: '0.875rem',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.description@sm',
    css_properties: {
      fontSize: '1rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.oferecemos.title',
    css_properties: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#6b21a8'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.oferecemos.title@sm',
    css_properties: {
      fontSize: '1rem'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.conclusao',
    css_properties: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#7c3aed'
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.conclusao@sm',
    css_properties: {
      fontSize: '1rem'
    }
  },

  // Tripla Proteção
  {
    json_key: 'index.triplaProtecao.title',
    css_properties: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    }
  },
  {
    json_key: 'index.triplaProtecao.title@sm',
    css_properties: {
      fontSize: '2.25rem'
    }
  },
  {
    json_key: 'index.triplaProtecao.subtitle',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: 'relaxed'
    }
  },
  {
    json_key: 'index.triplaProtecao.subtitle@sm',
    css_properties: {
      fontSize: '1.25rem'
    }
  },

  // CTA Section
  {
    json_key: 'index.cta.title',
    css_properties: {
      fontSize: '2.25rem',
      fontWeight: 'bold'
    }
  },
  {
    json_key: 'index.cta.title@md',
    css_properties: {
      fontSize: '3rem'
    }
  },
  {
    json_key: 'index.cta.subtitle',
    css_properties: {
      fontSize: '1.25rem'
    }
  },
  {
    json_key: 'index.cta.buttonText',
    css_properties: {
      fontSize: '1.125rem',
      fontWeight: '600'
    }
  }
];

async function restoreStyles() {
  console.log('🎨 Restaurando estilos originais da página Index (do Git)...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const style of indexStyles) {
    try {
      const { error } = await supabase
        .from('style_entries')
        .upsert({
          page_id: 'index',
          json_key: style.json_key,
          css_properties: style.css_properties
        }, {
          onConflict: 'json_key'
        });

      if (error) {
        console.error(`❌ Erro ao inserir ${style.json_key}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${style.json_key}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exceção ao inserir ${style.json_key}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Sucesso: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📝 Total: ${indexStyles.length}`);
}

restoreStyles()
  .then(() => {
    console.log('\n✨ Estilos originais restaurados! Recarregue a página para ver as mudanças.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
