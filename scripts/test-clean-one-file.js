import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Classes que devem ser MANTIDAS (layout, spacing, etc)
// Tudo que NÃO estiver aqui será removido
const layoutClasses = new Set([
  // Display & Positioning
  'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid',
  'hidden', 'relative', 'absolute', 'fixed', 'sticky',
  
  // Flex & Grid
  'flex-row', 'flex-col', 'flex-wrap', 'items-start', 'items-center', 'items-end',
  'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around',
  'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10',
  'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4',
  
  // Spacing (margin/padding)
  'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-auto',
  'mx-auto', 'my-auto', 'mt-0', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6', 'mt-8', 'mt-10',
  'mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mb-10', 'mb-12',
  'ml-0', 'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-8',
  'mr-0', 'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-6', 'mr-8',
  'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10',
  'px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10',
  'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10',
  'pt-0', 'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6', 'pt-8', 'pt-10',
  'pb-0', 'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-8', 'pb-10',
  'space-y-2', 'space-y-4', 'space-y-6', 'space-y-8',
  'space-x-2', 'space-x-4', 'space-x-6', 'space-x-8',
  
  // Width & Height
  'w-full', 'w-auto', 'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4',
  'h-full', 'h-auto', 'h-screen',
  'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 
  'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full',
  
  // Borders & Rounded
  'border', 'border-0', 'border-2', 'border-4',
  'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
  
  // Backgrounds (apenas estruturais, não cores)
  'bg-white', 'bg-transparent', 'bg-gradient-to-r', 'bg-gradient-to-br',
  'bg-linear-to-r', 'bg-linear-to-br',
  
  // Z-index
  'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
  
  // Overflow
  'overflow-hidden', 'overflow-auto', 'overflow-scroll',
  
  // Transform & Transition
  'transform', 'transition-all', 'transition-transform', 'transition-colors',
  'hover:scale-105', 'hover:scale-102', 'hover:shadow-md', 'hover:shadow-lg',
  'duration-200', 'duration-300', 'duration-500',
  
  // Shadow
  'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
  'drop-shadow', 'drop-shadow-md', 'drop-shadow-lg',
  
  // Backdrop
  'backdrop-blur-sm', 'backdrop-blur-md',
  
  // Outros estruturais
  'container', 'mx-auto', 'inset-0', 'shrink-0'
]);

/**
 * Verifica se uma classe deve ser mantida
 */
function shouldKeepClass(cls) {
  // Remover responsive prefixes para checagem
  const cleanClass = cls.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:)/, '');
  
  // Manter se estiver na lista de layout
  if (layoutClasses.has(cleanClass)) {
    return true;
  }
  
  // Manter classes complexas de background/border com cores
  if (cls.match(/^(bg|border)-(purple|blue|green|amber|gray|white)-/)) {
    return true;
  }
  
  // Manter classes arbitrárias de background
  if (cls.match(/^bg-\[|from-|via-|to-/)) {
    return true;
  }
  
  // REMOVER se for tipografia
  return false;
}

/**
 * Limpa className mantendo apenas classes de layout
 */
function cleanClassName(className) {
  if (!className) return '';
  
  const classes = className.split(/\s+/).filter(cls => {
    return shouldKeepClass(cls.trim());
  });
  
  return classes.join(' ');
}

/**
 * ABORDAGEM SIMPLIFICADA:
 * Encontra TODOS os elementos com data-json-key
 * e remove suas classes de tipografia
 */
function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Encontrar todas as ocorrências de elementos com data-json-key
  // Captura tudo entre < e >
  const elementRegex = /<([a-z][a-zA-Z0-9]*)\s+([^>]*data-json-key[^>]*)>/g;
  
  content = content.replace(elementRegex, (fullMatch, tagName, attributes) => {
    // Verificar se tem className
    const classNameMatch = attributes.match(/className=["']([^"']*)["']/);
    
    if (!classNameMatch) {
      return fullMatch; // Sem className, manter como está
    }
    
    const originalClassName = classNameMatch[1];
    const cleanedClassName = cleanClassName(originalClassName);
    
    if (cleanedClassName === originalClassName) {
      return fullMatch; // Nenhuma mudança necessária
    }
    
    // Substituir className
    let newAttributes = attributes;
    
    if (cleanedClassName.trim() === '') {
      // Remover atributo className completamente
      newAttributes = attributes.replace(/\s*className=["'][^"']*["']/, '');
    } else {
      // Substituir com className limpo
      newAttributes = attributes.replace(
        /className=["'][^"']*["']/,
        `className="${cleanedClassName}"`
      );
    }
    
    return `<${tagName} ${newAttributes}>`;
  });
  
  // Contar mudanças
  const changed = content !== originalContent;
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return changed;
}

// Testar em Purificacao.tsx primeiro
const testFile = path.resolve(__dirname, '../src/pages/Purificacao.tsx');
console.log('🧪 Testando limpeza em Purificacao.tsx...\n');

const changed = cleanFile(testFile);

if (changed) {
  console.log('✅ Arquivo limpo com sucesso!');
  console.log('⚠️  Revise o arquivo para garantir que está correto');
} else {
  console.log('ℹ️  Nenhuma mudança necessária');
}
