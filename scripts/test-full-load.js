// Test all menu pages with concurrent load - 2 cycles
// Pages: index, quemsomos, purificacao, tratamentos, artigos, testemunhos, contato

const API_BASE = 'http://localhost:3000';

const ALL_PAGES = [
  'index',
  'quemsomos', 
  'purificacao',
  'tratamentos',
  'artigos',
  'testemunhos',
  'contato'
];

async function fetchPage(pageId) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${API_BASE}/api/content-v2?pages=${pageId}`);
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      return { 
        page: pageId, 
        duration, 
        success: false, 
        error: `HTTP ${response.status}` 
      };
    }
    
    const data = await response.json();
    const source = data.sources?.[pageId] || 'unknown';
    
    return { 
      page: pageId, 
      duration, 
      success: true,
      source 
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return { 
      page: pageId, 
      duration, 
      success: false, 
      error: error.message 
    };
  }
}

async function runLoadTest(cycleNum) {
  console.log(`\n🚀 CYCLE ${cycleNum}: Starting concurrent load test for all ${ALL_PAGES.length} pages...`);
  
  const startTime = Date.now();
  
  // Execute all requests concurrently
  const promises = ALL_PAGES.map(pageId => fetchPage(pageId));
  const results = await Promise.all(promises);
  
  const totalTime = Date.now() - startTime;
  
  // Sort by duration
  results.sort((a, b) => a.duration - b.duration);
  
  // Display results
  console.log('');
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const sourceTag = result.source ? ` [${result.source}]` : '';
    console.log(`${icon} ${result.page.padEnd(15)} - ${result.duration}ms${sourceTag}`);
  });
  
  // Statistics
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const durations = results.filter(r => r.success).map(r => r.duration);
  const avgDuration = durations.length > 0 
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) 
    : 0;
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0;
  const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
  const throughput = successful > 0 ? (successful / (totalTime / 1000)).toFixed(2) : '0.00';
  
  // Count sources
  const cacheHits = results.filter(r => r.source === 'cache').length;
  const dbHits = results.filter(r => r.source === 'db').length;
  
  console.log('');
  console.log('============================================================');
  console.log(`📈 CYCLE ${cycleNum} RESULTS`);
  console.log('============================================================');
  console.log(`Total pages:        ${ALL_PAGES.length}`);
  console.log(`Successful:         ${successful} ✅`);
  console.log(`Failed:             ${failed} ❌`);
  console.log(`Total time:         ${totalTime}ms`);
  console.log(`Average duration:   ${avgDuration}ms`);
  console.log(`Min duration:       ${minDuration}ms`);
  console.log(`Max duration:       ${maxDuration}ms`);
  console.log(`Throughput:         ${throughput} req/s`);
  console.log(`Cache hits:         ${cacheHits}`);
  console.log(`DB hits:            ${dbHits}`);
  console.log('============================================================');
  
  return {
    cycleNum,
    totalTime,
    avgDuration,
    successful,
    failed,
    cacheHits,
    dbHits
  };
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   FULL MENU LOAD TEST - 2 CYCLES                          ║');
  console.log('║   Testing all pages with concurrent requests              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📋 Pages to test: ${ALL_PAGES.join(', ')}`);
  
  // Cycle 1
  const cycle1 = await runLoadTest(1);
  
  // Wait between cycles
  console.log('\n⏳ Waiting 2 seconds before Cycle 2...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Cycle 2
  const cycle2 = await runLoadTest(2);
  
  // Comparison
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   COMPARISON: CYCLE 1 vs CYCLE 2                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Total time:     ${cycle1.totalTime}ms → ${cycle2.totalTime}ms`);
  console.log(`Avg duration:   ${cycle1.avgDuration}ms → ${cycle2.avgDuration}ms`);
  console.log(`Cache hits:     ${cycle1.cacheHits} → ${cycle2.cacheHits}`);
  console.log(`DB hits:        ${cycle1.dbHits} → ${cycle2.dbHits}`);
  
  const speedup = (cycle1.avgDuration / cycle2.avgDuration).toFixed(2);
  const improvement = (((cycle1.avgDuration - cycle2.avgDuration) / cycle1.avgDuration) * 100).toFixed(1);
  
  if (cycle2.avgDuration < cycle1.avgDuration) {
    console.log(`\n🚀 Speedup:      ${speedup}x faster (${improvement}% improvement)`);
  } else if (cycle2.avgDuration > cycle1.avgDuration) {
    console.log(`\n⚠️  Slowdown:     ${(cycle2.avgDuration / cycle1.avgDuration).toFixed(2)}x slower`);
  } else {
    console.log(`\n➡️  No change in performance`);
  }
  
  console.log('');
}

main().catch(console.error);
