import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Mapeia classes Tailwind para propriedades CSS
 */
const tailwindToCSS = {
  // Font Size
  'text-xs': { fontSize: '0.75rem', lineHeight: '1rem' },
  'text-sm': { fontSize: '0.875rem', lineHeight: '1.25rem' },
  'text-base': { fontSize: '1rem', lineHeight: '1.5rem' },
  'text-lg': { fontSize: '1.125rem', lineHeight: '1.75rem' },
  'text-xl': { fontSize: '1.25rem', lineHeight: '1.75rem' },
  'text-2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  'text-3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  'text-4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
  'text-5xl': { fontSize: '3rem', lineHeight: '1' },
  'text-6xl': { fontSize: '3.75rem', lineHeight: '1' },
  'text-7xl': { fontSize: '4.5rem', lineHeight: '1' },
  'text-8xl': { fontSize: '6rem', lineHeight: '1' },
  'text-9xl': { fontSize: '8rem', lineHeight: '1' },
  
  // Font Weight
  'font-thin': { fontWeight: '100' },
  'font-extralight': { fontWeight: '200' },
  'font-light': { fontWeight: '300' },
  'font-normal': { fontWeight: '400' },
  'font-medium': { fontWeight: '500' },
  'font-semibold': { fontWeight: '600' },
  'font-bold': { fontWeight: '700' },
  'font-extrabold': { fontWeight: '800' },
  'font-black': { fontWeight: '900' },
  
  // Font Style
  'italic': { fontStyle: 'italic' },
  'not-italic': { fontStyle: 'normal' },
  
  // Text Align
  'text-left': { textAlign: 'left' },
  'text-center': { textAlign: 'center' },
  'text-right': { textAlign: 'right' },
  'text-justify': { textAlign: 'justify' },
  
  // Text Color (principais)
  'text-white': { color: '#ffffff' },
  'text-black': { color: '#000000' },
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
  
  'text-purple-50': { color: '#faf5ff' },
  'text-purple-100': { color: '#f3e8ff' },
  'text-purple-200': { color: '#e9d5ff' },
  'text-purple-300': { color: '#d8b4fe' },
  'text-purple-400': { color: '#c084fc' },
  'text-purple-500': { color: '#a855f7' },
  'text-purple-600': { color: '#9333ea' },
  'text-purple-700': { color: '#7e22ce' },
  'text-purple-800': { color: '#6b21a8' },
  'text-purple-900': { color: '#581c87' },
  
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
  
  'text-green-900': { color: '#14532d' },
  'text-amber-900': { color: '#78350f' },
  
  // Letter Spacing
  'tracking-tighter': { letterSpacing: '-0.05em' },
  'tracking-tight': { letterSpacing: '-0.025em' },
  'tracking-normal': { letterSpacing: '0em' },
  'tracking-wide': { letterSpacing: '0.025em' },
  'tracking-wider': { letterSpacing: '0.05em' },
  'tracking-widest': { letterSpacing: '0.1em' },
  
  // Line Height
  'leading-none': { lineHeight: '1' },
  'leading-tight': { lineHeight: '1.25' },
  'leading-snug': { lineHeight: '1.375' },
  'leading-normal': { lineHeight: '1.5' },
  'leading-relaxed': { lineHeight: '1.625' },
  'leading-loose': { lineHeight: '2' },
  
  // Opacity
  'opacity-0': { opacity: '0' },
  'opacity-5': { opacity: '0.05' },
  'opacity-10': { opacity: '0.1' },
  'opacity-20': { opacity: '0.2' },
  'opacity-25': { opacity: '0.25' },
  'opacity-30': { opacity: '0.3' },
  'opacity-40': { opacity: '0.4' },
  'opacity-50': { opacity: '0.5' },
  'opacity-60': { opacity: '0.6' },
  'opacity-70': { opacity: '0.7' },
  'opacity-75': { opacity: '0.75' },
  'opacity-80': { opacity: '0.8' },
  'opacity-90': { opacity: '0.9' },
  'opacity-95': { opacity: '0.95' },
  'opacity-100': { opacity: '1' },
};

/**
 * Extrai classes Tailwind de tipografia de uma className string
 */
function extractTypographyClasses(className) {
  if (!className) return {};
  
  const classes = className.split(/\s+/);
  const cssProps = {};
  
  classes.forEach(cls => {
    // Remover responsive prefixes (md:, lg:, etc)
    const cleanClass = cls.replace(/^(sm:|md:|lg:|xl:|2xl:)/, '');
    
    if (tailwindToCSS[cleanClass]) {
      Object.assign(cssProps, tailwindToCSS[cleanClass]);
    }
    
    // Tratar classes arbitrárias como tracking-[0.02em]
    const arbitraryMatch = cls.match(/tracking-\[([^\]]+)\]/);
    if (arbitraryMatch) {
      cssProps.letterSpacing = arbitraryMatch[1];
    }
  });
  
  return cssProps;
}

/**
 * Escaneia arquivo TSX e extrai elementos com data-json-key e suas classes
 */
function scanTSXFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const entries = [];
  
  // Regex para encontrar elementos com data-json-key e className
  // Captura: data-json-key="..." e className="..."
  const regex = /data-json-key=["']([^"']+)["'][^>]*className=["']([^"']+)["']|className=["']([^"']+)["'][^>]*data-json-key=["']([^"']+)["']/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const jsonKey = match[1] || match[4];
    const className = match[2] || match[3];
    
    const cssProps = extractTypographyClasses(className);
    
    if (Object.keys(cssProps).length > 0) {
      entries.push({
        json_key: jsonKey,
        css_properties: cssProps,
        source_file: path.basename(filePath)
      });
    }
  }
  
  return entries;
}

/**
 * Escaneia todos os arquivos TSX em src/pages
 */
function scanAllPages() {
  const pagesDir = path.resolve(__dirname, '../src/pages');
  const allEntries = [];
  
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(pagesDir, f));
  
  console.log(`📂 Escaneando ${files.length} arquivos...\n`);
  
  files.forEach(file => {
    const fileName = path.basename(file);
    console.log(`📄 ${fileName}`);
    
    const entries = scanTSXFile(file);
    console.log(`   ✅ ${entries.length} elementos com estilos encontrados`);
    
    allEntries.push(...entries);
  });
  
  return allEntries;
}

async function migrateAllStyles() {
  console.log('═══════════════════════════════════════════');
  console.log('🎨 MIGRAÇÃO COMPLETA DE ESTILOS INLINE');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Escanear todos os arquivos
    const entries = scanAllPages();
    
    console.log(`\n📊 Total de elementos encontrados: ${entries.length}`);
    
    // Agrupar por página
    const byPage = {};
    entries.forEach(entry => {
      const pageId = entry.json_key.split('.')[0];
      if (!byPage[pageId]) byPage[pageId] = [];
      byPage[pageId].push(entry);
    });
    
    console.log(`📄 Páginas afetadas: ${Object.keys(byPage).join(', ')}\n`);
    
    // Perguntar confirmação
    console.log('⚠️  ATENÇÃO: Isso irá criar/atualizar entries em style_entries');
    console.log('   para TODOS os textos com estilos inline.\n');
    
    // Salvar no banco
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const entry of entries) {
      try {
        const pageId = entry.json_key.split('.')[0];
        
        const { error } = await supabase
          .from('style_entries')
          .upsert({
            page_id: pageId,
            json_key: entry.json_key,
            css_properties: entry.css_properties
          }, {
            onConflict: 'json_key'
          });
        
        if (error) {
          console.error(`❌ Erro ao salvar ${entry.json_key}:`, error.message);
          errorCount++;
          errors.push({ key: entry.json_key, error: error.message });
        } else {
          successCount++;
          if (successCount % 50 === 0) {
            console.log(`   ... ${successCount} salvos`);
          }
        }
      } catch (err) {
        console.error(`❌ Exceção ao salvar ${entry.json_key}:`, err.message);
        errorCount++;
        errors.push({ key: entry.json_key, error: err.message });
      }
    }
    
    console.log('\n═══════════════════════════════════════════');
    console.log(`✅ Migração concluída!`);
    console.log(`   Sucesso: ${successCount}`);
    console.log(`   Erros: ${errorCount}`);
    console.log('═══════════════════════════════════════════');
    
    if (errors.length > 0) {
      console.log('\n❌ Erros:');
      errors.forEach(e => console.log(`   ${e.key}: ${e.error}`));
    }
    
    // Salvar resumo
    const summary = {
      timestamp: new Date().toISOString(),
      totalEntries: entries.length,
      successCount,
      errorCount,
      byPage: Object.entries(byPage).map(([page, entries]) => ({
        page,
        count: entries.length
      })),
      errors
    };
    
    const summaryFile = path.resolve(__dirname, '../backups/migration-granular/all-styles-migration-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Resumo salvo em: ${summaryFile}`);
    
  } catch (error) {
    console.error('\n❌ Erro geral:', error);
    process.exit(1);
  }
}

migrateAllStyles();
