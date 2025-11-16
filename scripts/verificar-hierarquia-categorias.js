// Verificar sistema hierárquico de categorias
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verificarHierarquia() {
  console.log('\n=== VERIFICAÇÃO DO SISTEMA DE CATEGORIAS ===\n');

  // 1. Verificar classes
  console.log('1️⃣  CLASSES:');
  const { data: classes, error: classesError } = await supabase
    .from('artigos_classes')
    .select('*')
    .order('ordem');

  if (classesError) {
    console.error('❌ Erro ao buscar classes:', classesError);
  } else {
    console.log(`   Total: ${classes.length} classes`);
    classes.forEach(c => console.log(`   - ${c.nome} (${c.slug})`));
  }

  // 2. Verificar categorias por classe
  console.log('\n2️⃣  CATEGORIAS POR CLASSE:');
  const { data: categorias, error: catError } = await supabase
    .from('artigos_categorias')
    .select('*, artigos_classes(nome, slug)')
    .order('ordem');

  if (catError) {
    console.error('❌ Erro ao buscar categorias:', catError);
  } else {
    console.log(`   Total: ${categorias.length} categorias\n`);
    
    // Agrupar por classe
    const porClasse = {};
    categorias.forEach(cat => {
      const classe = cat.artigos_classes.nome;
      if (!porClasse[classe]) porClasse[classe] = [];
      porClasse[classe].push(cat);
    });

    Object.entries(porClasse).forEach(([classe, cats]) => {
      console.log(`   📁 ${classe}:`);
      cats.forEach(cat => console.log(`      └─ ${cat.nome} (${cat.slug})`));
      console.log('');
    });
  }

  // 3. Verificar artigos com categorias
  console.log('3️⃣  ARTIGOS COM CATEGORIAS:');
  const { data: artigos, error: artigosError } = await supabase
    .from('artigos')
    .select('*');

  if (artigosError) {
    console.error('❌ Erro ao buscar artigos:', artigosError);
  } else {
    console.log(`   Total: ${artigos.length} artigos\n`);

    for (const artigo of artigos) {
      // Buscar categorias do artigo
      const { data: rels } = await supabase
        .from('artigos_categorias_rel')
        .select(`
          artigos_categorias (
            nome,
            slug,
            artigos_classes (
              nome,
              slug
            )
          )
        `)
        .eq('artigo_id', artigo.id);

      const categoriasTexto = rels && rels.length > 0
        ? rels.map(r => `${r.artigos_categorias.artigos_classes.nome} > ${r.artigos_categorias.nome}`).join(', ')
        : '❌ SEM CATEGORIAS';

      console.log(`   📄 ${artigo.title}`);
      console.log(`      Categorias: ${categoriasTexto}`);
      console.log(`      Search Vector: ${artigo.search_vector ? '✅ Configurado' : '❌ Não configurado'}`);
      console.log('');
    }
  }

  // 4. Testar view artigos_com_categorias
  console.log('4️⃣  VIEW ARTIGOS_COM_CATEGORIAS:');
  const { data: view, error: viewError } = await supabase
    .from('artigos_com_categorias')
    .select('title, categorias_nomes, classes_nomes');

  if (viewError) {
    console.error('❌ Erro ao buscar view:', viewError);
  } else {
    console.log(`   Total: ${view.length} artigos na view\n`);
    view.forEach(v => {
      console.log(`   📄 ${v.title}`);
      console.log(`      Classes: ${v.classes_nomes?.join(', ') || 'nenhuma'}`);
      console.log(`      Categorias: ${v.categorias_nomes?.join(', ') || 'nenhuma'}`);
      console.log('');
    });
  }

  // 5. Verificar índices e search_vector
  console.log('5️⃣  VERIFICAÇÃO DE BUSCA FULL-TEXT:');
  const artigosComSearch = artigos.filter(a => a.search_vector);
  console.log(`   Artigos com search_vector: ${artigosComSearch.length}/${artigos.length}`);
  
  if (artigosComSearch.length < artigos.length) {
    console.log('   ⚠️  Alguns artigos não têm search_vector configurado');
    console.log('   Execute: UPDATE artigos SET updated_at = NOW();');
  } else {
    console.log('   ✅ Todos os artigos têm busca full-text configurada');
  }

  console.log('\n=== VERIFICAÇÃO CONCLUÍDA ===\n');
}

verificarHierarquia().catch(console.error);
