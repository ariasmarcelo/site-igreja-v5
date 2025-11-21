/**
 * Script para migrar testemunhos para __shared__
 * Atualiza page_id de 'testemunhos' para '__shared__' no banco Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateTestimonials() {
  console.log('\n🔄 Iniciando migração de testemunhos para __shared__...\n');

  try {
    // 1. Buscar todos os registros de testemunhos
    const { data: testimonialRecords, error: fetchError } = await supabase
      .from('text_entries')
      .select('*')
      .eq('page_id', 'testemunhos');

    if (fetchError) throw fetchError;

    console.log(`📊 Encontrados ${testimonialRecords.length} registros para migrar\n`);

    if (testimonialRecords.length === 0) {
      console.log('✅ Nenhum registro para migrar');
      return;
    }

    // 2. Mapear novos json_keys
    const updates = testimonialRecords.map(record => {
      let newJsonKey = record.json_key;
      
      // Atualizar prefixos
      if (record.json_key.startsWith('testemunhos.testimonials[')) {
        newJsonKey = record.json_key.replace('testemunhos.testimonials[', 'testimonials[');
      } else if (record.json_key.startsWith('testemunhos.')) {
        newJsonKey = 'testimonialsPage.' + record.json_key.replace('testemunhos.', '');
      }

      return {
        id: record.id,
        oldKey: record.json_key,
        newKey: newJsonKey
      };
    });

    console.log('📝 Mapeamento de chaves:\n');
    updates.forEach(({ oldKey, newKey }) => {
      console.log(`  ${oldKey} \t\t\t→ ${newKey}`);
    });

    console.log('\n⚠️  Confirme a migração:');
    console.log(`  - ${updates.length} registros serão atualizados`);
    console.log(`  - page_id: 'testemunhos' → '__shared__'`);
    console.log(`  - json_key será atualizado conforme mapeamento acima\n`);

    // 3. Executar updates
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      const { error } = await supabase
        .from('text_entries')
        .update({
          page_id: '__shared__',
          json_key: update.newKey
        })
        .eq('id', update.id);

      if (error) {
        console.error(`❌ Erro ao atualizar ${update.oldKey}:`, error.message);
        errorCount++;
      } else {
        successCount++;
      }
    }

    console.log('\n✅ Migração concluída!');
    console.log(`  - Sucesso: ${successCount}`);
    console.log(`  - Erros: ${errorCount}\n`);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    process.exit(1);
  }
}

migrateTestimonials().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
