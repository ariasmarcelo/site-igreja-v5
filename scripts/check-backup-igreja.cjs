const fs = require('fs');

const backup = JSON.parse(fs.readFileSync('backups/supabase/2025-11-16T20-49-16/text_entries.json', 'utf8'));

const igrejaDescriptions = backup.filter(item => item.json_key.startsWith('igreja.description'));

console.log('\n=== TEXTOS ORIGINAIS DA IGREJA (BACKUP) ===\n');
igrejaDescriptions.forEach(item => {
  console.log(`Key: ${item.json_key}`);
  console.log(`Content: ${JSON.stringify(item.content, null, 2)}`);
  console.log('---\n');
});
