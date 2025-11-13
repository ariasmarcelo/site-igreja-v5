/**
 * Extrai estilos originais de TODAS as páginas do Git e restaura no DB
 * Executar: node scripts/restore-all-pages-styles.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Páginas a processar
const pages = [
  'Artigos',
  'Contato', 
  'NotFound',
  'Purificacao',
  'QuemSomos',
  'Testemunhos',
  'Tratamentos'
];

// Regex para extrair className de elementos com data-json-key
const classNameRegex = /className="([^"]+)"\s+data-json-key="([^"]+)"/g;

// Mapeamento Tailwind -> CSS
const tailwindMap = {
  // Font sizes
  'text-xs': { fontSize: '0.75rem' },
  'text-sm': { fontSize: '0.875rem' },
  'text-base': { fontSize: '1rem' },
  'text-lg': { fontSize: '1.125rem' },
  'text-xl': { fontSize: '1.25rem' },
  'text-2xl': { fontSize: '1.5rem' },
  'text-3xl': { fontSize: '1.875rem' },
  'text-4xl': { fontSize: '2.25rem' },
  'text-5xl': { fontSize: '3rem' },
  'text-6xl': { fontSize: '3.75rem' },
  'text-7xl': { fontSize: '4.5rem' },
  'text-8xl': { fontSize: '6rem' },
  
  // Font weights
  'font-thin': { fontWeight: '100' },
  'font-extralight': { fontWeight: '200' },
  'font-light': { fontWeight: '300' },
  'font-normal': { fontWeight: '400' },
  'font-medium': { fontWeight: '500' },
  'font-semibold': { fontWeight: '600' },
  'font-bold': { fontWeight: '700' },
  'font-extrabold': { fontWeight: '800' },
  'font-black': { fontWeight: '900' },
  
  // Colors - gray
  'text-gray-50': { color: '#f9fafb' },
  'text-gray-100': { color: '#f3f4f6' },
  'text-gray-200': { color: '#e5e7eb' },
  'text-gray-300': { color: '#d1d5db' },
  'text-gray-400': { color: '#9ca3af' },
  'text-gray-500': { color: '#6b7280' },
  'text-gray-600': { color: '#4b5563' },
  'text-gray-700': { color: '#374151' },
  'text-gray-800': { color: '#1f2937' },
  'text-gray-900': { color: '#111827' },
  
  // Colors - blue
  'text-blue-50': { color: '#eff6ff' },
  'text-blue-100': { color: '#dbeafe' },
  'text-blue-200': { color: '#bfdbfe' },
  'text-blue-300': { color: '#93c5fd' },
  'text-blue-400': { color: '#60a5fa' },
  'text-blue-500': { color: '#3b82f6' },
  'text-blue-600': { color: '#2563eb' },
  'text-blue-700': { color: '#1d4ed8' },
  'text-blue-800': { color: '#1e40af' },
  'text-blue-900': { color: '#1e3a8a' },
  
  // Colors - amber
  'text-amber-50': { color: '#fffbeb' },
  'text-amber-100': { color: '#fef3c7' },
  'text-amber-200': { color: '#fde68a' },
  'text-amber-300': { color: '#fcd34d' },
  'text-amber-400': { color: '#fbbf24' },
  'text-amber-500': { color: '#f59e0b' },
  'text-amber-600': { color: '#d97706' },
  'text-amber-700': { color: '#b45309' },
  'text-amber-800': { color: '#92400e' },
  'text-amber-900': { color: '#78350f' },
  
  // Colors - purple
  'text-purple-50': { color: '#faf5ff' },
  'text-purple-100': { color: '#f3e8ff' },
  'text-purple-200': { color: '#e9d5ff' },
  'text-purple-300': { color: '#d8b4fe' },
  'text-purple-400': { color: '#c084fc' },
  'text-purple-500': { color: '#a855f7' },
  'text-purple-600': { color: '#9333ea' },
  'text-purple-700': { color: '#7c3aed' },
  'text-purple-800': { color: '#6b21a8' },
  'text-purple-900': { color: '#581c87' },
  
  // Colors - green
  'text-green-50': { color: '#f0fdf4' },
  'text-green-100': { color: '#dcfce7' },
  'text-green-200': { color: '#bbf7d0' },
  'text-green-300': { color: '#86efac' },
  'text-green-400': { color: '#4ade80' },
  'text-green-500': { color: '#22c55e' },
  'text-green-600': { color: '#16a34a' },
  'text-green-700': { color: '#15803d' },
  'text-green-800': { color: '#166534' },
  'text-green-900': { color: '#14532d' },
  
  // Line heights
  'leading-none': { lineHeight: '1' },
  'leading-tight': { lineHeight: '1.25' },
  'leading-snug': { lineHeight: '1.375' },
  'leading-normal': { lineHeight: '1.5' },
  'leading-relaxed': { lineHeight: '1.625' },
  'leading-loose': { lineHeight: '2' },
  
  // Custom colors
  'text-[#222222]': { color: '#222222' },
  'text-[#CFAF5A]': { color: '#CFAF5A' },
  'text-[#4A90A9]': { color: '#4A90A9' },
  'text-[#B38938]': { color: '#B38938' },
};

function parseClassName(className) {
  const classes = className.split(/\s+/);
  const cssProps = {};
  
  classes.forEach(cls => {
    // Responsive: md:text-5xl
    if (cls.includes(':')) {
      return; // Processar depois
    }
    
    if (tailwindMap[cls]) {
      Object.assign(cssProps, tailwindMap[cls]);
    }
  });
  
  return cssProps;
}

function parseResponsiveClasses(className) {
  const classes = className.split(/\s+/);
  const responsive = {};
  
  classes.forEach(cls => {
    const match = cls.match(/^(sm|md|lg|xl|2xl):(.+)$/);
    if (match) {
      const [, breakpoint, tailwindClass] = match;
      if (tailwindMap[tailwindClass]) {
        if (!responsive[breakpoint]) {
          responsive[breakpoint] = {};
        }
        Object.assign(responsive[breakpoint], tailwindMap[tailwindClass]);
      }
    }
  });
  
  return responsive;
}

async function extractStylesFromPage(pageName) {
  console.log(`\n📄 Processando ${pageName}.tsx...`);
  
  try {
    // Buscar diff do Git
    const diff = execSync(`git diff HEAD src/pages/${pageName}.tsx`, { encoding: 'utf8' });
    
    const styles = [];
    const lines = diff.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Linhas removidas (com estilos originais)
      if (line.startsWith('-') && line.includes('className=') && line.includes('data-json-key=')) {
        // Extrair className e json-key
        const classMatch = line.match(/className="([^"]+)"/);
        const keyMatch = line.match(/data-json-key="([^"]+)"/);
        
        if (classMatch && keyMatch) {
          const className = classMatch[1];
          const jsonKey = keyMatch[1];
          
          // Parse classes base
          const cssProps = parseClassName(className);
          
          if (Object.keys(cssProps).length > 0) {
            styles.push({
              json_key: jsonKey,
              css_properties: cssProps
            });
          }
          
          // Parse classes responsivas
          const responsive = parseResponsiveClasses(className);
          
          Object.entries(responsive).forEach(([breakpoint, props]) => {
            styles.push({
              json_key: `${jsonKey}@${breakpoint}`,
              css_properties: props
            });
          });
        }
      }
    }
    
    return styles;
  } catch (error) {
    console.error(`❌ Erro ao processar ${pageName}:`, error.message);
    return [];
  }
}

async function restoreAllStyles() {
  console.log('🎨 Restaurando estilos de todas as páginas do Git...\n');
  
  let totalStyles = 0;
  
  for (const page of pages) {
    const styles = await extractStylesFromPage(page);
    
    if (styles.length === 0) {
      console.log(`  ⚠️ Nenhum estilo encontrado em ${page}`);
      continue;
    }
    
    console.log(`  📊 Encontrados ${styles.length} estilos em ${page}`);
    
    // Inserir no banco
    for (const style of styles) {
      try {
        const { error } = await supabase
          .from('style_entries')
          .upsert({
            page_id: page.toLowerCase(),
            json_key: style.json_key,
            css_properties: style.css_properties
          }, {
            onConflict: 'json_key'
          });
        
        if (error) {
          console.error(`    ❌ Erro ao inserir ${style.json_key}:`, error.message);
        } else {
          console.log(`    ✅ ${style.json_key}`);
          totalStyles++;
        }
      } catch (err) {
        console.error(`    ❌ Exceção ao inserir ${style.json_key}:`, err.message);
      }
    }
  }
  
  console.log(`\n📊 Total de estilos restaurados: ${totalStyles}`);
}

restoreAllStyles()
  .then(() => {
    console.log('\n✨ Todos os estilos restaurados!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
