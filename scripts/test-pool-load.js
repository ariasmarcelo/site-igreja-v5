// Test LMDB Connection Pool under load
// Simulates 20 concurrent requests to validate pool behavior

const baseUrl = 'http://localhost:3000';
const pages = ['index', 'testemunhos', 'purificacao', 'artigos'];

async function makeRequest(id, page) {
  const start = Date.now();
  try {
    const response = await fetch(`${baseUrl}/api/content-v2?pages=${page}`);
    const data = await response.json();
    const duration = Date.now() - start;
    console.log(`✅ [REQ-${id}] ${page} - ${duration}ms - Success: ${data.success}`);
    return { id, page, duration, success: true };
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ [REQ-${id}] ${page} - ${duration}ms - Error: ${error.message}`);
    return { id, page, duration, success: false, error: error.message };
  }
}

async function runLoadTest() {
  console.log('\n🚀 Starting LMDB Pool Load Test...\n');
  console.log('📊 Simulating 20 concurrent requests across 4 pages\n');
  
  const startTime = Date.now();
  const requests = [];
  
  // Generate 20 concurrent requests
  for (let i = 1; i <= 20; i++) {
    const page = pages[i % pages.length];
    requests.push(makeRequest(i, page));
  }
  
  // Wait for all to complete
  const results = await Promise.all(requests);
  
  const totalDuration = Date.now() - startTime;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const minDuration = Math.min(...results.map(r => r.duration));
  const maxDuration = Math.max(...results.map(r => r.duration));
  
  console.log('\n' + '='.repeat(60));
  console.log('📈 LOAD TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total requests:     ${results.length}`);
  console.log(`Successful:         ${successful} ✅`);
  console.log(`Failed:             ${failed} ❌`);
  console.log(`Total time:         ${totalDuration}ms`);
  console.log(`Average duration:   ${avgDuration.toFixed(0)}ms`);
  console.log(`Min duration:       ${minDuration}ms`);
  console.log(`Max duration:       ${maxDuration}ms`);
  console.log(`Throughput:         ${(results.length / (totalDuration / 1000)).toFixed(2)} req/s`);
  console.log('='.repeat(60) + '\n');
  
  // Group by page
  const byPage = {};
  results.forEach(r => {
    if (!byPage[r.page]) byPage[r.page] = [];
    byPage[r.page].push(r);
  });
  
  console.log('📊 Results by Page:');
  Object.entries(byPage).forEach(([page, reqs]) => {
    const avg = reqs.reduce((sum, r) => sum + r.duration, 0) / reqs.length;
    console.log(`  ${page.padEnd(15)} ${reqs.length} requests, avg ${avg.toFixed(0)}ms`);
  });
  console.log('');
}

runLoadTest().catch(console.error);
