/**
 * Script para Corrigir data-json-key na página Index.tsx
 * 
 * PROBLEMAS IDENTIFICADOS:
 * 1. Chaves com prefixos incorretos: section_igreja, purification_card, instituto_card
 * 2. Chaves que não correspondem à estrutura JSON real
 * 3. Chaves com sufixos inválidos (.map, .replace)
 * 
 * CORREÇÕES:
 * - index.section_igreja.description[${index}] → index.igreja.description[${index}]
 * - index.section_igreja.icon.sun_white → index.igreja.icon (remove, não existe no JSON)
 * - index.purification_card.phase[${index}] → index.purification.phases[${index}]
 * - index.instituto_card.treatment[${index}] → index.instituto.treatments[${index}]
 * - index.instituto.benefits.map → (remove, não é editável)
 * - index.fisicoEspiritual.fisico.items.map → (remove, não é editável)
 * - index.fisicoEspiritual.*.abordagem.description.replace → .description (sem .replace)
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/Index.tsx');

console.log('🔧 Corrigindo data-json-key na página Index.tsx...\n');

let content = fs.readFileSync(filePath, 'utf-8');
let changes = 0;

// CORREÇÃO 1: section_igreja → igreja
const regex1 = /data-json-key=["'`]index\.section_igreja\.description\[/g;
const matches1 = content.match(regex1);
if (matches1) {
  console.log(`✓ Corrigindo ${matches1.length} ocorrência(s): section_igreja.description → igreja.description`);
  content = content.replace(regex1, 'data-json-key="index.igreja.description[');
  changes += matches1.length;
}

// CORREÇÃO 2: Remover ícones que não existem no JSON (não são editáveis)
const regex2 = /data-json-key=["'`]index\.section_igreja\.icon\.sun_white["'`]/g;
const matches2 = content.match(regex2);
if (matches2) {
  console.log(`✓ Removendo ${matches2.length} ocorrência(s): ícones não editáveis (section_igreja.icon)`);
  // Remove o atributo data-json-key completamente
  content = content.replace(
    /\s*data-json-key=["'`]index\.section_igreja\.icon\.sun_white["'`]/g,
    ''
  );
  changes += matches2.length;
}

// CORREÇÃO 3: section_instituto.icon → Remove (não é editável)
const regex3 = /\s*data-json-key=["'`]index\.section_instituto\.icon\.sun_white["'`]/g;
const matches3 = content.match(regex3);
if (matches3) {
  console.log(`✓ Removendo ${matches3.length} ocorrência(s): ícones não editáveis (section_instituto.icon)`);
  content = content.replace(regex3, '');
  changes += matches3.length;
}

// CORREÇÃO 4: section_instituto.link → Remove (não é editável)
const regex4 = /\s*data-json-key=["'`]index\.section_instituto\.link\.treatments["'`]/g;
const matches4 = content.match(regex4);
if (matches4) {
  console.log(`✓ Removendo ${matches4.length} ocorrência(s): links não editáveis (section_instituto.link)`);
  content = content.replace(regex4, '');
  changes += matches4.length;
}

// CORREÇÃO 5: purification_card.phase → purification.phases
const regex5 = /data-json-key={`index\.purification_card\.phase\[/g;
const matches5 = content.match(regex5);
if (matches5) {
  console.log(`✓ Corrigindo ${matches5.length} ocorrência(s): purification_card.phase → purification.phases`);
  content = content.replace(regex5, 'data-json-key={`index.purification.phases[');
  changes += matches5.length;
}

// CORREÇÃO 6: instituto_card.treatment → instituto.treatments
const regex6 = /data-json-key={`index\.instituto_card\.treatment(_icon)?\[/g;
const matches6 = content.match(regex6);
if (matches6) {
  console.log(`✓ Corrigindo ${matches6.length} ocorrência(s): instituto_card.treatment → instituto.treatments`);
  content = content.replace(
    /data-json-key={`index\.instituto_card\.treatment\[/g,
    'data-json-key={`index.instituto.treatments['
  );
  content = content.replace(
    /data-json-key={`index\.instituto_card\.treatment_icon\[/g,
    'data-json-key={`index.instituto.treatments_icon['
  );
  changes += matches6.length;
}

// CORREÇÃO 7: Remover atributos .map (não são editáveis)
const regex7 = /\s*data-json-key=["'`]index\.[^"'`]*\.map["'`]/g;
const matches7 = content.match(regex7);
if (matches7) {
  console.log(`✓ Removendo ${matches7.length} ocorrência(s): atributos .map (não editáveis)`);
  content = content.replace(regex7, '');
  changes += matches7.length;
}

// CORREÇÃO 8: Remover .replace dos data-json-key
const regex8 = /data-json-key=["'`]index\.(fisicoEspiritual\.[^"'`]*)\.replace["'`]/g;
const matches8 = content.match(regex8);
if (matches8) {
  console.log(`✓ Corrigindo ${matches8.length} ocorrência(s): remover .replace dos atributos`);
  content = content.replace(regex8, 'data-json-key="index.$1"');
  changes += matches8.length;
}

// CORREÇÃO 9: Remover data-json-key duplicado em legalNotice
const regex9 = /<strong data-json-key=["'`]index\.instituto\.legalNotice["'`]>Aviso Legal:<\/strong> {safeTexts\.instituto\.legalNotice}/g;
const matches9 = content.match(regex9);
if (matches9) {
  console.log(`✓ Corrigindo ${matches9.length} ocorrência(s): legalNotice duplicado`);
  content = content.replace(regex9, '<strong>Aviso Legal:</strong> {safeTexts.instituto.legalNotice}');
  changes += matches9.length;
}

// Salvar arquivo corrigido
if (changes > 0) {
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`\n✅ Total de ${changes} correções aplicadas com sucesso!`);
  console.log(`📄 Arquivo: ${filePath}`);
} else {
  console.log('\n⚠️ Nenhuma correção necessária.');
}
