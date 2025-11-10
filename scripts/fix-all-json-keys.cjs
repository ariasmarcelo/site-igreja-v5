/**
 * Script Universal para Remover data-json-key Inválidos
 * 
 * Remove atributos data-json-key que apontam para:
 * - .map() - não são editáveis (arrays iterados)
 * - .replace() - não são editáveis (transformações)
 * - Ícones e elementos não textuais
 * 
 * Aplica correções em TODAS as páginas do projeto.
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');

console.log('🔧 Corrigindo data-json-key em todas as páginas...\n');

// Buscar todos os arquivos .tsx nas páginas
const files = [
  path.join(pagesDir, 'Index.tsx'),
  path.join(pagesDir, 'Purificacao.tsx'),
  path.join(pagesDir, 'QuemSomos.tsx'),
  path.join(pagesDir, 'Contato.tsx'),
  path.join(pagesDir, 'Tratamentos.tsx'),
  path.join(pagesDir, 'Testemunhos.tsx'),
  path.join(pagesDir, 'Artigos.tsx'),
];

let totalChanges = 0;

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileName = path.basename(filePath);
  console.log(`📄 Processando: ${fileName}`);

  let content = fs.readFileSync(filePath, 'utf-8');
  let fileChanges = 0;

  // CORREÇÃO 1: Remover atributos .map (não são editáveis)
  const regex1 = /\s*data-json-key=["'`][^"'`]*\.map["'`]/g;
  const matches1 = content.match(regex1);
  if (matches1) {
    console.log(`  ✓ Removendo ${matches1.length} atributo(s) .map`);
    content = content.replace(regex1, '');
    fileChanges += matches1.length;
  }

  // CORREÇÃO 2: Remover atributos .replace (não são editáveis)
  const regex2 = /\s*data-json-key=["'`][^"'`]*\.replace["'`]/g;
  const matches2 = content.match(regex2);
  if (matches2) {
    console.log(`  ✓ Removendo ${matches2.length} atributo(s) .replace`);
    content = content.replace(regex2, '');
    fileChanges += matches2.length;
  }

  // CORREÇÃO 3: Remover atributos section_* (nomenclatura antiga/incorreta)
  const regex3 = /\s*data-json-key=["'`][^"'`]*section_[^"'`]*["'`]/g;
  const matches3 = content.match(regex3);
  if (matches3) {
    console.log(`  ✓ Removendo ${matches3.length} atributo(s) section_* (nomenclatura incorreta)`);
    content = content.replace(regex3, '');
    fileChanges += matches3.length;
  }

  // CORREÇÃO 4: Remover atributos de ícones (não são editáveis)
  const regex4 = /\s*data-json-key=["'`][^"'`]*\.icon[^"'`]*["'`]/g;
  const matches4 = content.match(regex4);
  if (matches4) {
    console.log(`  ✓ Removendo ${matches4.length} atributo(s) .icon (não editáveis)`);
    content = content.replace(regex4, '');
    fileChanges += matches4.length;
  }

  // CORREÇÃO 5: Remover atributos de links (não são editáveis)
  const regex5 = /\s*data-json-key=["'`][^"'`]*\.link[^"'`]*["'`]/g;
  const matches5 = content.match(regex5);
  if (matches5) {
    console.log(`  ✓ Removendo ${matches5.length} atributo(s) .link (não editáveis)`);
    content = content.replace(regex5, '');
    fileChanges += matches5.length;
  }

  if (fileChanges > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${fileChanges} correções aplicadas\n`);
    totalChanges += fileChanges;
  } else {
    console.log(`  ⚪ Nenhuma correção necessária\n`);
  }
});

if (totalChanges > 0) {
  console.log(`\n🎉 Total de ${totalChanges} correções aplicadas em todas as páginas!`);
} else {
  console.log('\n⚠️ Nenhuma correção necessária em nenhuma página.');
}
