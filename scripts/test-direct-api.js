// Direct API call test - bypass HTTP entirely
import 'dotenv/config';
import handler from '../api/content-v2/index.js';

// Load .env.local
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

async function test() {
  const req = {
    method: 'GET',
    query: { pages: 'index,purificacao,artigos' }
  };
  
  let responseData = null;
  let statusCode = 200;
  
  const res = {
    setHeader: () => {},
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    end: () => res
  };
  
  console.log('\n🚀 Testing DIRECT API call (no HTTP overhead)...\n');
  
  for (let i = 1; i <= 5; i++) {
    const start = Date.now();
    await handler(req, res);
    const duration = Date.now() - start;
    
    console.log(`Call ${i}: ${duration}ms (server reports: ${responseData?.timings?.total}ms)`);
  }
}

test().catch(console.error);
