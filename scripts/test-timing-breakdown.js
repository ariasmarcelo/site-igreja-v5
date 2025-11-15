// Detailed timing breakdown test
// Measures: network, API processing, serialization for each page

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

async function fetchPageWithTiming(pageId) {
  const timingBreakdown = { page: pageId };
  
  // 1. Network request start
  const requestStart = Date.now();
  
  try {
    const response = await fetch(`${API_BASE}/api/content-v2?pages=${pageId}`);
    
    // 2. Network complete (TTFB - Time To First Byte)
    const networkTime = Date.now() - requestStart;
    timingBreakdown.network = networkTime;
    
    if (!response.ok) {
      return { 
        ...timingBreakdown,
        success: false, 
        error: `HTTP ${response.status}` 
      };
    }
    
    // 3. JSON parsing start
    const parseStart = Date.now();
    const data = await response.json();
    const parseTime = Date.now() - parseStart;
    timingBreakdown.jsonParse = parseTime;
    
    // 4. Total client time
    const totalTime = Date.now() - requestStart;
    timingBreakdown.clientTotal = totalTime;
    
    // 5. Server-side timing from API
    if (data.timings) {
      timingBreakdown.serverTotal = data.timings.total;
      timingBreakdown.serverOperations = data.timings.operations;
      
      // Calculate overhead (network + parse + other)
      timingBreakdown.overhead = totalTime - data.timings.total;
    }
    
    timingBreakdown.source = data.sources?.[pageId] || 'unknown';
    timingBreakdown.success = true;
    
    return timingBreakdown;
    
  } catch (error) {
    const totalTime = Date.now() - requestStart;
    return { 
      ...timingBreakdown,
      clientTotal: totalTime,
      success: false, 
      error: error.message 
    };
  }
}

async function runTimingTest(cycleNum) {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║   CYCLE ${cycleNum}: DETAILED TIMING BREAKDOWN                     ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
  
  const cycleStart = Date.now();
  
  // Execute all requests concurrently
  const promises = ALL_PAGES.map(pageId => fetchPageWithTiming(pageId));
  const results = await Promise.all(promises);
  
  const cycleTime = Date.now() - cycleStart;
  
  // Sort by total time
  results.sort((a, b) => (b.clientTotal || 0) - (a.clientTotal || 0));
  
  // Display results
  console.log('┌─────────────┬────────┬─────────┬──────────┬──────────┬──────────┐');
  console.log('│ Page        │ Source │ Network │ Server   │ Overhead │ Total    │');
  console.log('├─────────────┼────────┼─────────┼──────────┼──────────┼──────────┤');
  
  results.forEach(result => {
    if (!result.success) {
      console.log(`│ ${result.page.padEnd(11)} │ ERROR  │ ${result.error.padEnd(42)} │`);
      return;
    }
    
    const page = result.page.padEnd(11);
    const source = (result.source || '?').padEnd(6);
    const network = `${result.network || 0}ms`.padEnd(7);
    const server = `${result.serverTotal || 0}ms`.padEnd(8);
    const overhead = `${result.overhead || 0}ms`.padEnd(8);
    const total = `${result.clientTotal || 0}ms`.padEnd(8);
    
    console.log(`│ ${page} │ ${source} │ ${network} │ ${server} │ ${overhead} │ ${total} │`);
  });
  
  console.log('└─────────────┴────────┴─────────┴──────────┴──────────┴──────────┘');
  
  // Detailed server operations for each page
  console.log('\n📊 SERVER-SIDE OPERATIONS BREAKDOWN:\n');
  
  results.forEach(result => {
    if (!result.success || !result.serverOperations) return;
    
    console.log(`\n🔹 ${result.page.toUpperCase()} (${result.source}):`);
    
    const ops = result.serverOperations;
    ops.forEach(op => {
      const opName = op.op.padEnd(30);
      const time = `${op.time}ms`.padEnd(8);
      const resultTag = op.result ? ` [${op.result}]` : '';
      console.log(`   ${opName} ${time}${resultTag}`);
    });
  });
  
  // Statistics
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  const clientTotals = results.filter(r => r.success).map(r => r.clientTotal);
  const serverTotals = results.filter(r => r.success && r.serverTotal).map(r => r.serverTotal);
  const networkTimes = results.filter(r => r.success).map(r => r.network);
  const overheads = results.filter(r => r.success && r.overhead).map(r => r.overhead);
  
  const avg = (arr) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const min = (arr) => arr.length > 0 ? Math.min(...arr) : 0;
  const max = (arr) => arr.length > 0 ? Math.max(...arr) : 0;
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║   CYCLE ${cycleNum} STATISTICS                                     ║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`Cycle completed in:     ${cycleTime}ms`);
  console.log(`Successful:             ${successful}/${ALL_PAGES.length} pages`);
  console.log(`Failed:                 ${failed} pages`);
  console.log('');
  console.log('CLIENT TOTAL (end-to-end):');
  console.log(`  Average:              ${avg(clientTotals)}ms`);
  console.log(`  Min:                  ${min(clientTotals)}ms`);
  console.log(`  Max:                  ${max(clientTotals)}ms`);
  console.log('');
  console.log('SERVER PROCESSING:');
  console.log(`  Average:              ${avg(serverTotals)}ms`);
  console.log(`  Min:                  ${min(serverTotals)}ms`);
  console.log(`  Max:                  ${max(serverTotals)}ms`);
  console.log('');
  console.log('NETWORK TIME:');
  console.log(`  Average:              ${avg(networkTimes)}ms`);
  console.log(`  Min:                  ${min(networkTimes)}ms`);
  console.log(`  Max:                  ${max(networkTimes)}ms`);
  console.log('');
  console.log('OVERHEAD (network + parse + queue):');
  console.log(`  Average:              ${avg(overheads)}ms`);
  console.log(`  Min:                  ${min(overheads)}ms`);
  console.log(`  Max:                  ${max(overheads)}ms`);
  console.log('');
  
  // Cache analysis
  const cacheHits = results.filter(r => r.source === 'cache').length;
  const dbHits = results.filter(r => r.source === 'db').length;
  
  console.log('DATA SOURCE:');
  console.log(`  Cache hits:           ${cacheHits}`);
  console.log(`  DB hits:              ${dbHits}`);
  console.log('════════════════════════════════════════════════════════════');
  
  return {
    cycleNum,
    cycleTime,
    avgClient: avg(clientTotals),
    avgServer: avg(serverTotals),
    avgNetwork: avg(networkTimes),
    avgOverhead: avg(overheads),
    cacheHits,
    dbHits,
    results
  };
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   FULL TIMING BREAKDOWN - 2 CYCLES                        ║');
  console.log('║   Network vs Server vs Cache vs DB                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📋 Pages: ${ALL_PAGES.join(', ')}`);
  
  // Cycle 1
  const cycle1 = await runTimingTest(1);
  
  // Wait between cycles
  console.log('\n⏳ Waiting 2 seconds before Cycle 2...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Cycle 2
  const cycle2 = await runTimingTest(2);
  
  // Comparison
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   COMPARISON: CYCLE 1 vs CYCLE 2                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log('CLIENT TOTAL:');
  console.log(`  ${cycle1.avgClient}ms → ${cycle2.avgClient}ms (${((cycle1.avgClient - cycle2.avgClient) / cycle1.avgClient * 100).toFixed(1)}% change)`);
  
  console.log('\nSERVER PROCESSING:');
  console.log(`  ${cycle1.avgServer}ms → ${cycle2.avgServer}ms (${((cycle1.avgServer - cycle2.avgServer) / cycle1.avgServer * 100).toFixed(1)}% change)`);
  
  console.log('\nNETWORK TIME:');
  console.log(`  ${cycle1.avgNetwork}ms → ${cycle2.avgNetwork}ms (${((cycle1.avgNetwork - cycle2.avgNetwork) / cycle1.avgNetwork * 100).toFixed(1)}% change)`);
  
  console.log('\nOVERHEAD:');
  console.log(`  ${cycle1.avgOverhead}ms → ${cycle2.avgOverhead}ms (${((cycle1.avgOverhead - cycle2.avgOverhead) / cycle1.avgOverhead * 100).toFixed(1)}% change)`);
  
  console.log('\nDATA SOURCE:');
  console.log(`  Cache: ${cycle1.cacheHits} → ${cycle2.cacheHits}`);
  console.log(`  DB: ${cycle1.dbHits} → ${cycle2.dbHits}`);
  
  // Find bottleneck
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎯 BOTTLENECK ANALYSIS                                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  const serverPercent = (cycle2.avgServer / cycle2.avgClient * 100).toFixed(1);
  const networkPercent = (cycle2.avgNetwork / cycle2.avgClient * 100).toFixed(1);
  const overheadPercent = (cycle2.avgOverhead / cycle2.avgClient * 100).toFixed(1);
  
  console.log('Time distribution (Cycle 2):');
  console.log(`  Server processing:    ${serverPercent}%`);
  console.log(`  Network latency:      ${networkPercent}%`);
  console.log(`  Other overhead:       ${overheadPercent}%`);
  console.log('');
  
  if (cycle2.avgServer > cycle2.avgClient * 0.5) {
    console.log('🔴 PRIMARY BOTTLENECK: Server processing');
    console.log('   → Optimize cache reads, DB queries, or data reconstruction');
  } else if (cycle2.avgNetwork > cycle2.avgClient * 0.5) {
    console.log('🔴 PRIMARY BOTTLENECK: Network latency');
    console.log('   → Consider HTTP/2, compression, or connection pooling');
  } else {
    console.log('🟡 DISTRIBUTED LOAD: No single bottleneck');
    console.log('   → Optimize all areas incrementally');
  }
  
  console.log('');
}

main().catch(console.error);
