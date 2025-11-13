import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function backupData() {
  console.log('📦 Iniciando backup dos dados atuais...\n');

  try {
    // Backup page_contents
    console.log('📄 Baixando page_contents...');
    const { data: contents, error: contentsError } = await supabase
      .from('page_contents')
      .select('*');

    if (contentsError) throw contentsError;
    console.log(`✅ ${contents.length} registros de conteúdo baixados`);

    // Backup page_styles
    console.log('🎨 Baixando page_styles...');
    const { data: styles, error: stylesError } = await supabase
      .from('page_styles')
      .select('*');

    if (stylesError) throw stylesError;
    console.log(`✅ ${styles.length} registros de estilos baixados`);

    // Create backups directory
    const backupDir = path.resolve(__dirname, '../backups/migration-granular');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save to files with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const contentsFile = path.join(backupDir, `page_contents_${timestamp}.json`);
    const stylesFile = path.join(backupDir, `page_styles_${timestamp}.json`);

    fs.writeFileSync(contentsFile, JSON.stringify(contents, null, 2));
    fs.writeFileSync(stylesFile, JSON.stringify(styles, null, 2));

    console.log('\n💾 Arquivos salvos:');
    console.log(`   📄 ${contentsFile}`);
    console.log(`   🎨 ${stylesFile}`);

    console.log('\n✅ Backup concluído com sucesso!');
    
    return { contents, styles };
  } catch (error) {
    console.error('❌ Erro no backup:', error.message);
    process.exit(1);
  }
}

backupData();
