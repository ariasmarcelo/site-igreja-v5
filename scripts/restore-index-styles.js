/**
 * Restaura estilos estéticos da página Index no banco de dados
 * Executar: node scripts/restore-index-styles.js
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
    json_key: 'index.hero.title@media(min-width:768px)',
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
    json_key: 'index.hero.subtitle@media(min-width:768px)',
    css_properties: {
      fontSize: '1.875rem'
    }
  },

  // Igreja Section
  {
    json_key: 'index.igreja.title',
    css_properties: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#222222',
      '@media (min-width: 768px)': {
        fontSize: '3rem'
      }
    }
  },
  {
    json_key: 'index.igreja.description[0]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.75'
    }
  },
  {
    json_key: 'index.igreja.description[1]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.75'
    }
  },
  {
    json_key: 'index.igreja.description[2]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.75'
    }
  },

  // Purification Card
  {
    json_key: 'index.purification.title',
    css_properties: {
      fontSize: '1.5rem',
      fontWeight: '600'
    }
  },

  // Instituto Section
  {
    json_key: 'index.instituto.title',
    css_properties: {
      fontSize: '1.5rem',
      fontWeight: '600'
    }
  },
  {
    json_key: 'index.instituto.description[0]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.75'
    }
  },
  {
    json_key: 'index.instituto.description[1]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.75'
    }
  },
  {
    json_key: 'index.instituto.description[2]',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.75'
    }
  },
  {
    json_key: 'index.instituto.legalNotice',
    css_properties: {
      fontSize: '0.875rem',
      color: '#92400e'
    }
  },

  // Benefits Section
  {
    json_key: 'index.benefitsSection.title',
    css_properties: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#222222',
      '@media (min-width: 768px)': {
        fontSize: '3rem'
      }
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
      fontSize: '1.5rem',
      fontWeight: '600'
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
      fontSize: '1.5rem',
      fontWeight: '600'
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
      fontSize: '1.5rem',
      fontWeight: '600'
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
      fontWeight: '700',
      '@media (min-width: 640px)': {
        fontSize: '1.875rem'
      },
      '@media (min-width: 768px)': {
        fontSize: '2.25rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.subtitle',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      '@media (min-width: 640px)': {
        fontSize: '1.25rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.title',
    css_properties: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1d4ed8',
      '@media (min-width: 640px)': {
        fontSize: '1.5rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.subtitle',
    css_properties: {
      fontSize: '1rem',
      color: '#2563eb',
      fontWeight: '600',
      '@media (min-width: 640px)': {
        fontSize: '1.125rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.description',
    css_properties: {
      fontSize: '0.875rem',
      '@media (min-width: 640px)': {
        fontSize: '1rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.abordagem.title',
    css_properties: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#1e40af',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.fisico.abordagem.description',
    css_properties: {
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.title',
    css_properties: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#b45309',
      '@media (min-width: 640px)': {
        fontSize: '1.5rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.subtitle',
    css_properties: {
      fontSize: '1rem',
      color: '#d97706',
      fontWeight: '600',
      '@media (min-width: 640px)': {
        fontSize: '1.125rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.description',
    css_properties: {
      fontSize: '0.875rem',
      '@media (min-width: 640px)': {
        fontSize: '1rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.abordagem.title',
    css_properties: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#92400e',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.espiritual.abordagem.description',
    css_properties: {
      fontSize: '0.75rem',
      '@media (min-width: 640px)': {
        fontSize: '0.875rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.title',
    css_properties: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#7c3aed',
      '@media (min-width: 640px)': {
        fontSize: '1.5rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.description',
    css_properties: {
      fontSize: '0.875rem',
      '@media (min-width: 640px)': {
        fontSize: '1rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.oferecemos.title',
    css_properties: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#6b21a8',
      '@media (min-width: 640px)': {
        fontSize: '1rem'
      }
    }
  },
  {
    json_key: 'index.fisicoEspiritual.integrada.conclusao',
    css_properties: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#7c3aed',
      '@media (min-width: 640px)': {
        fontSize: '1rem'
      }
    }
  },

  // Tripla Proteção
  {
    json_key: 'index.triplaProtecao.title',
    css_properties: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#1f2937',
      '@media (min-width: 640px)': {
        fontSize: '2.25rem'
      }
    }
  },
  {
    json_key: 'index.triplaProtecao.subtitle',
    css_properties: {
      fontSize: '1.125rem',
      color: '#374151',
      '@media (min-width: 640px)': {
        fontSize: '1.25rem'
      }
    }
  },

  // CTA Section
  {
    json_key: 'index.cta.title',
    css_properties: {
      fontSize: '2.25rem',
      fontWeight: '700',
      '@media (min-width: 768px)': {
        fontSize: '3rem'
      }
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
  },

  // Footer
  {
    json_key: 'index.footer.copyright',
    css_properties: {
      fontSize: '0.875rem'
    }
  },
  {
    json_key: 'index.footer.trademark',
    css_properties: {
      fontSize: '0.75rem'
    }
  }
];

async function restoreStyles() {
  console.log('🎨 Restaurando estilos da página Index...\n');

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
    console.log('\n✨ Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
