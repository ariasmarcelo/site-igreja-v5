/**
 * Teste de Carga - Local vs Produção
 * Executa 4 ciclos de requisições para cada página
 */

const pages = ['index', 'quemsomos', 'artigos', 'eventos', 'contato'];

async function testEndpoint(url, pageName) {
  const start = performance.now();
  try {
    const response = await fetch(url);
    const duration = performance.now() - start;
    
    if (!response.ok) {
      return { page: pageName, duration, status: response.status, error: `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    const hasContent = data && data.content && Object.keys(data.content).length > 0;
    
    return { 
      page: pageName, 
      duration: Math.round(duration), 
      status: response.status,
      contentKeys: hasContent ? Object.keys(data.content).length : 0
    };
  } catch (error) {
    const duration = performance.now() - start;
    return { page: pageName, duration: Math.round(duration), status: 'ERROR', error: error.message };
  }
}

async function runCycle(baseUrl, cycleNumber, environment) {
  console.log(`\n🔄 ${environment} - Ciclo ${cycleNumber}`);
  
  // Executa todas as páginas em paralelo (simultaneamente)
  const promises = pages.map(page => {
    const url = `${baseUrl}/api/content/${page}`;
    return testEndpoint(url, page);
  });
  
  const results = await Promise.all(promises);
  
  // Exibe resultados
  results.forEach(result => {
    const status = result.error ? `❌ ${result.error}` : `✅ ${result.status}`;
    const keys = result.contentKeys ? ` (${result.contentKeys} keys)` : '';
    console.log(`  ${result.page.padEnd(12)} ${result.duration}ms ${status}${keys}`);
  });
  
  return results;
}

async function runLoadTest(baseUrl, environment) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Teste de Carga - ${environment.toUpperCase()}`);
  console.log(`🌐 URL Base: ${baseUrl}`);
  console.log(`📄 Páginas: ${pages.join(', ')}`);
  console.log(`🔁 Ciclos: 10`);
  console.log(`⚡ Modo: Requisições simultâneas (paralelas)`);
  console.log(`${'='.repeat(60)}`);
  
  const allResults = [];
  
  // 10 ciclos
  for (let i = 1; i <= 10; i++) {
    const cycleResults = await runCycle(baseUrl, i, environment);
    allResults.push(...cycleResults);
    
    // Pequena pausa entre ciclos
    if (i < 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  // Análise de resultados
  console.log(`\n📈 Estatísticas - ${environment}`);
  console.log(`${'─'.repeat(60)}`);
  
  const byPage = {};
  pages.forEach(page => {
    byPage[page] = allResults.filter(r => r.page === page).map(r => r.duration);
  });
  
  console.log('\n📄 Por Página (10 ciclos):');
  pages.forEach(page => {
    const times = byPage[page];
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    const std = Math.round(Math.sqrt(times.map(t => Math.pow(t - avg, 2)).reduce((a, b) => a + b) / times.length));
    
    console.log(`  ${page.padEnd(12)} Média: ${String(avg).padStart(5)}ms  Min: ${String(min).padStart(5)}ms  Max: ${String(max).padStart(5)}ms  σ: ${String(std).padStart(4)}ms`);
  });
  
  const allTimes = allResults.map(r => r.duration);
  const totalAvg = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length);
  const totalMin = Math.min(...allTimes);
  const totalMax = Math.max(...allTimes);
  const totalStd = Math.round(Math.sqrt(allTimes.map(t => Math.pow(t - totalAvg, 2)).reduce((a, b) => a + b) / allTimes.length));
  
  console.log(`\n📊 Geral (${allResults.length} requisições):`);
  console.log(`  Média: ${totalAvg}ms`);
  console.log(`  Mínimo: ${totalMin}ms`);
  console.log(`  Máximo: ${totalMax}ms`);
  console.log(`  Desvio Padrão: ${totalStd}ms`);
  
  const errors = allResults.filter(r => r.error);
  if (errors.length > 0) {
    console.log(`\n⚠️  Erros: ${errors.length}/${allResults.length}`);
    errors.forEach(e => console.log(`  ${e.page}: ${e.error}`));
  }
  
  return {
    environment,
    stats: {
      byPage,
      total: { avg: totalAvg, min: totalMin, max: totalMax, std: totalStd },
      errors: errors.length
    }
  };
}

async function compareResults(localStats, prodStats) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`⚖️  COMPARAÇÃO LOCAL vs PRODUÇÃO`);
  console.log(`${'='.repeat(60)}`);
  
  console.log(`\n📄 Comparação por Página (Média dos 10 ciclos):`);
  console.log(`${'─'.repeat(60)}`);
  console.log(`Página       Local      Produção   Diferença   Fator`);
  console.log(`${'─'.repeat(60)}`);
  
  pages.forEach(page => {
    const localTimes = localStats.byPage[page];
    const prodTimes = prodStats.byPage[page];
    
    const localAvg = Math.round(localTimes.reduce((a, b) => a + b, 0) / localTimes.length);
    const prodAvg = Math.round(prodTimes.reduce((a, b) => a + b, 0) / prodTimes.length);
    const diff = prodAvg - localAvg;
    const factor = (prodAvg / localAvg).toFixed(2);
    
    const diffStr = diff > 0 ? `+${diff}ms` : `${diff}ms`;
    const arrow = diff > 0 ? '🔴' : '🟢';
    
    console.log(`${page.padEnd(12)} ${String(localAvg).padStart(6)}ms  ${String(prodAvg).padStart(6)}ms  ${diffStr.padStart(9)}  ${factor}x ${arrow}`);
  });
  
  console.log(`${'─'.repeat(60)}`);
  const localTotal = localStats.total.avg;
  const prodTotal = prodStats.total.avg;
  const totalDiff = prodTotal - localTotal;
  const totalFactor = (prodTotal / localTotal).toFixed(2);
  const totalDiffStr = totalDiff > 0 ? `+${totalDiff}ms` : `${totalDiff}ms`;
  
  console.log(`${'GERAL'.padEnd(12)} ${String(localTotal).padStart(6)}ms  ${String(prodTotal).padStart(6)}ms  ${totalDiffStr.padStart(9)}  ${totalFactor}x`);
  
  console.log('\n📊 Resumo:');
  console.log(`  Local:    ${localTotal}ms ± ${localStats.total.std}ms (${localStats.total.min}-${localStats.total.max}ms)`);
  console.log(`  Produção: ${prodTotal}ms ± ${prodStats.total.std}ms (${prodStats.total.min}-${prodStats.total.max}ms)`);
  console.log(`  Diferença: ${totalDiffStr} (${totalFactor}x ${totalDiff > 0 ? 'mais lento' : 'mais rápido'} em produção)`);
  
  if (localStats.errors > 0 || prodStats.errors > 0) {
    console.log(`\n⚠️  Erros:`);
    console.log(`  Local: ${localStats.errors}`);
    console.log(`  Produção: ${prodStats.errors}`);
  }
  
  console.log(`\n${'='.repeat(60)}`);
}

async function main() {
  const localUrl = 'http://localhost:5173';
  const prodUrl = 'https://shadcn-k5ike2up4-marcelo-arias-projects-172831c7.vercel.app';
  
  console.log('🚀 Iniciando Teste de Carga Comparativo');
  console.log(`⏰ ${new Date().toLocaleString('pt-BR')}`);
  
  try {
    // Teste Local
    const localResult = await runLoadTest(localUrl, 'Local');
    
    // Pausa entre ambientes
    console.log('\n⏳ Aguardando 2s antes do teste de produção...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Teste Produção
    const prodResult = await runLoadTest(prodUrl, 'Produção');
    
    // Comparação
    compareResults(localResult.stats, prodResult.stats);
    
    console.log('\n✅ Teste de carga concluído com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro durante teste de carga:', error.message);
    process.exit(1);
  }
}

main();
