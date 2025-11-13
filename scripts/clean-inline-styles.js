import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Classes que devem ser REMOVIDAS (tipografia/cores)
const typographyClasses = [
  // Font size
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 
  'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl',
  
  // Font weight
  'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 
  'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
  
  // Font style
  'italic', 'not-italic',
  
  // Text align
  'text-left', 'text-center', 'text-right', 'text-justify',
  
  // Text color (todas as variações)
  'text-white', 'text-black',
  'text-gray-50', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400',
  'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
  'text-purple-50', 'text-purple-100', 'text-purple-200', 'text-purple-300', 'text-purple-400',
  'text-purple-500', 'text-purple-600', 'text-purple-700', 'text-purple-800', 'text-purple-900',
  'text-blue-50', 'text-blue-100', 'text-blue-200', 'text-blue-300', 'text-blue-400',
  'text-blue-500', 'text-blue-600', 'text-blue-700', 'text-blue-800', 'text-blue-900',
  'text-green-50', 'text-green-100', 'text-green-200', 'text-green-300', 'text-green-400',
  'text-green-500', 'text-green-600', 'text-green-700', 'text-green-800', 'text-green-900',
  'text-amber-50', 'text-amber-100', 'text-amber-200', 'text-amber-300', 'text-amber-400',
  'text-amber-500', 'text-amber-600', 'text-amber-700', 'text-amber-800', 'text-amber-900',
  'text-red-50', 'text-red-100', 'text-red-200', 'text-red-300', 'text-red-400',
  'text-red-500', 'text-red-600', 'text-red-700', 'text-red-800', 'text-red-900',
  'text-yellow-50', 'text-yellow-100', 'text-yellow-200', 'text-yellow-300', 'text-yellow-400',
  'text-yellow-500', 'text-yellow-600', 'text-yellow-700', 'text-yellow-800', 'text-yellow-900',
  'text-indigo-50', 'text-indigo-100', 'text-indigo-200', 'text-indigo-300', 'text-indigo-400',
  'text-indigo-500', 'text-indigo-600', 'text-indigo-700', 'text-indigo-800', 'text-indigo-900',
  
  // Letter spacing
  'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 
  'tracking-wider', 'tracking-widest',
  
  // Line height
  'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 
  'leading-relaxed', 'leading-loose',
  
  // Opacity
  'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20', 'opacity-25', 'opacity-30',
  'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80',
  'opacity-90', 'opacity-95', 'opacity-100',
  
  // Text decoration
  'underline', 'line-through', 'no-underline',
  
  // Text transform
  'uppercase', 'lowercase', 'capitalize', 'normal-case'
];

/**
 * Remove classes de tipografia de uma className string
 * Mantém apenas classes de layout (flex, grid, spacing, etc)
 */
function removeTypographyClasses(className) {
  if (!className) return '';
  
  const classes = className.split(/\s+/).filter(cls => {
    // Remover responsive prefixes para checagem
    const cleanClass = cls.replace(/^(sm:|md:|lg:|xl:|2xl:)/, '');
    
    // Manter se NÃO for classe de tipografia
    if (typographyClasses.includes(cleanClass)) {
      return false; // Remover
    }
    
    // Remover tracking-[...] arbitrário
    if (cls.match(/tracking-\[/)) {
      return false;
    }
    
    return true; // Manter
  });
  
  return classes.join(' ');
}

/**
 * Processa um arquivo TSX removendo classes de tipografia
 */
function cleanTSXFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesCount = 0;
  
  // Regex para encontrar elementos com data-json-key e className
  const regex = /(data-json-key=["'][^"']+["'][^>]*className=["'])([^"']+)(["']|className=["'])([^"']+)(["'][^>]*data-json-key=["'][^"']+["'])/g;
  
  content = content.replace(regex, (match, before, className1, middle, className2, after) => {
    let cleanedClassName;
    let isFirstPattern = middle === '"';
    
    if (isFirstPattern) {
      // Padrão: data-json-key="..." className="..."
      cleanedClassName = removeTypographyClasses(className1);
      changesCount++;
      
      if (cleanedClassName.trim() === '') {
        // Se não sobrou nenhuma classe, remover o atributo className completamente
        return before.replace(' className="', '') + after;
      }
      
      return before + cleanedClassName + middle + after;
    } else {
      // Padrão: className="..." data-json-key="..."
      cleanedClassName = removeTypographyClasses(className2);
      changesCount++;
      
      if (cleanedClassName.trim() === '') {
        // Se não sobrou nenhuma classe, remover o atributo className completamente
        return after.replace(' className="', before.replace('className="', ''));
      }
      
      return before + className1 + middle + cleanedClassName + after;
    }
  });
  
  // Salvar apenas se houve mudanças
  if (changesCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return changesCount;
}

/**
 * Limpa todos os arquivos TSX em src/pages
 */
function cleanAllPages() {
  console.log('═══════════════════════════════════════════');
  console.log('🧹 LIMPEZA DE ESTILOS INLINE');
  console.log('   Removendo classes de tipografia dos TSX');
  console.log('═══════════════════════════════════════════\n');
  
  const pagesDir = path.resolve(__dirname, '../src/pages');
  const files = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(pagesDir, f));
  
  let totalChanges = 0;
  
  files.forEach(file => {
    const fileName = path.basename(file);
    console.log(`📄 ${fileName}`);
    
    const changes = cleanTSXFile(file);
    
    if (changes > 0) {
      console.log(`   ✅ ${changes} elementos limpos`);
      totalChanges += changes;
    } else {
      console.log(`   ⏭️  Nenhuma mudança necessária`);
    }
  });
  
  console.log('\n═══════════════════════════════════════════');
  console.log(`✅ Limpeza concluída!`);
  console.log(`   Total de elementos processados: ${totalChanges}`);
  console.log('═══════════════════════════════════════════');
  console.log('\n⚠️  IMPORTANTE: Revise os arquivos alterados antes de commit!');
}

cleanAllPages();
