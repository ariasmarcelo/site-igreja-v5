#!/usr/bin/env node
/**
 * Script para analisar e organizar todo o conteúdo do site por página
 */

const fs = require('fs');
const path = require('path');

// Ler arquivo de backup
const backupPath = path.join(__dirname, '..', 'backups', 'supabase', '2025-11-16T20-49-16', 'text_entries.json');
const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

// Organizar por página
const pagesByPageId = {};
data.forEach(entry => {
  const pageId = entry.page_id;
  if (!pagesByPageId[pageId]) {
    pagesByPageId[pageId] = [];
  }
  pagesByPageId[pageId].push({
    key: entry.json_key,
    content: entry.content['pt-BR']
  });
});

// Ordenar páginas
const sortedPages = Object.keys(pagesByPageId).sort();

// Exibir conteúdo organizado
console.log('='.repeat(80));
console.log('CONTEÚDO COMPLETO DO SITE - ANÁLISE POR PÁGINA');
console.log('='.repeat(80));
console.log(`Total de páginas: ${sortedPages.length}`);
console.log(`Total de entradas: ${data.length}`);
console.log('='.repeat(80));

sortedPages.forEach(pageId => {
  const entries = pagesByPageId[pageId];
  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`PÁGINA: ${pageId.toUpperCase()} (${entries.length} entradas)`);
  console.log('='.repeat(80));
  
  entries.forEach(entry => {
    console.log(`\n[${entry.key}]`);
    
    // Formatar conteúdo
    const content = entry.content;
    if (typeof content === 'string') {
      // Quebrar linhas longas
      const maxLength = 100;
      if (content.length > maxLength) {
        const lines = [];
        let remaining = content;
        while (remaining.length > 0) {
          let chunk = remaining.substring(0, maxLength);
          // Tentar quebrar em espaço
          if (remaining.length > maxLength) {
            const lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace > maxLength * 0.7) {
              chunk = chunk.substring(0, lastSpace);
            }
          }
          lines.push(chunk);
          remaining = remaining.substring(chunk.length).trim();
        }
        lines.forEach((line, i) => {
          console.log(`  ${i === 0 ? '→' : ' '} ${line}`);
        });
      } else {
        console.log(`  → ${content}`);
      }
    } else {
      console.log(`  → ${JSON.stringify(content, null, 2).split('\n').join('\n    ')}`);
    }
  });
});

console.log(`\n\n${'='.repeat(80)}`);
console.log('FIM DA ANÁLISE');
console.log('='.repeat(80));
