import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function updatePsicodelicosStyles() {
  console.log('🎨 Atualizando estilos da seção psicodélicos...\n');
  
  // Estilos customizados para a seção psicodélicos (seguindo padrão das fases)
  const customStyles = {
    // Títulos principais
    'purificacao.psicodelicos.title': {
      'font-size': '2.25rem',
      'font-weight': '600',
      'color': '#ffffff',
      'margin-bottom': '0.75rem',
      'text-shadow': '0 2px 10px rgba(0,0,0,0.3)'
    },
    'purificacao.psicodelicos.subtitle': {
      'font-size': '1.25rem',
      'font-style': 'italic',
      'color': '#ffffff',
      'opacity': '0.95',
      'font-weight': '300'
    },
    
    // Textos introdutórios
    'purificacao.psicodelicos.intro1': {
      'font-size': '1.25rem',
      'line-height': '1.75',
      'color': '#1f2937',
      'text-align': 'center',
      'font-weight': '400',
      'margin-bottom': '0.5rem'
    },
    'purificacao.psicodelicos.intro2': {
      'font-size': '1.125rem',
      'line-height': '1.75',
      'color': '#4b5563',
      'text-align': 'center',
      'font-style': 'italic',
      'font-weight': '300'
    },
    
    // Tripla Proteção - título
    'purificacao.psicodelicos.tripleProtection.title': {
      'font-size': '1.5rem',
      'font-weight': '600',
      'color': '#7c3aed',
      'text-align': 'center',
      'margin-bottom': '2rem',
      'letter-spacing': '0.025em'
    },
    
    // Cards de Proteção
    'purificacao.psicodelicos.tripleProtection.cards[0].title': {
      'font-size': '1.125rem',
      'font-weight': '600',
      'color': '#1e3a8a',
      'margin-bottom': '0.75rem',
      'text-align': 'center'
    },
    'purificacao.psicodelicos.tripleProtection.cards[0].description': {
      'font-size': '0.875rem',
      'line-height': '1.625',
      'color': '#374151',
      'text-align': 'center'
    },
    
    'purificacao.psicodelicos.tripleProtection.cards[1].title': {
      'font-size': '1.125rem',
      'font-weight': '600',
      'color': '#14532d',
      'margin-bottom': '0.75rem',
      'text-align': 'center'
    },
    'purificacao.psicodelicos.tripleProtection.cards[1].description': {
      'font-size': '0.875rem',
      'line-height': '1.625',
      'color': '#374151',
      'text-align': 'center'
    },
    
    'purificacao.psicodelicos.tripleProtection.cards[2].title': {
      'font-size': '1.125rem',
      'font-weight': '600',
      'color': '#78350f',
      'margin-bottom': '0.75rem',
      'text-align': 'center'
    },
    'purificacao.psicodelicos.tripleProtection.cards[2].description': {
      'font-size': '0.875rem',
      'line-height': '1.625',
      'color': '#374151',
      'text-align': 'center'
    },
    
    // Aplicações Terapêuticas
    'purificacao.psicodelicos.applications.title': {
      'font-size': '1.5rem',
      'font-weight': '600',
      'color': '#7c3aed',
      'text-align': 'center',
      'margin-bottom': '1.5rem',
      'letter-spacing': '0.025em'
    },
    
    // Conclusão
    'purificacao.psicodelicos.conclusion.title': {
      'font-size': '1.25rem',
      'font-weight': '600',
      'color': '#78350f',
      'text-align': 'center',
      'margin-bottom': '1rem',
      'letter-spacing': '0.025em'
    },
    'purificacao.psicodelicos.conclusion.content': {
      'font-size': '1rem',
      'line-height': '1.75',
      'color': '#1f2937',
      'text-align': 'center'
    },
    
    // Botão CTA
    'purificacao.psicodelicos.ctaButton': {
      'font-size': '1.125rem',
      'font-weight': '600',
      'letter-spacing': '0.05em'
    }
  };
  
  // Converter para CSS string
  const cssString = Object.entries(customStyles)
    .map(([selector, styles]) => {
      const styleRules = Object.entries(styles)
        .map(([prop, value]) => `${prop}: ${value}`)
        .join('; ');
      return `[data-json-key="purificacao.${selector.replace('purificacao.', '')}"] { ${styleRules}; }`;
    })
    .join('\n');
  
  console.log('📝 CSS gerado:\n');
  console.log(cssString);
  console.log('\n📤 Enviando para API local...');
  
  const response = await fetch('http://localhost:3001/api/save-styles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pageId: 'purificacao',
      css: cssString
    })
  });
  
  if (response.ok) {
    const result = await response.json();
    console.log('✅ Estilos salvos com sucesso!');
    console.log('   Resposta:', result);
  } else {
    const error = await response.text();
    console.error('❌ Erro ao salvar:', error);
  }
}

updatePsicodelicosStyles();
