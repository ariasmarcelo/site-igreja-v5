// LMDB Connection Pool Manager - Singleton com controle de concorrência
const { open } = require('lmdb');
const path = require('path');

class LMDBConnectionPool {
  constructor() {
    if (LMDBConnectionPool.instance) {
      return LMDBConnectionPool.instance;
    }

    this.dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    this.pool = [];
    this.maxConnections = 10;
    this.activeConnections = 0;
    this.waitingQueue = [];
    this.initialized = false;
    
    console.log(`[POOL] 🏊 Initializing LMDB Connection Pool at ${this.dbPath}`);
    console.log(`[POOL] 📊 Max connections: ${this.maxConnections}`);
    
    LMDBConnectionPool.instance = this;
  }

  /**
   * Inicializa o pool criando conexões
   */
  initialize() {
    if (this.initialized) {
      console.log('[POOL] ⚠️  Already initialized');
      return;
    }

    console.log('[POOL] 🔧 Creating initial connections...');
    
    // Criar conexão base compartilhada
    this.sharedDB = open({
      path: this.dbPath,
      compression: true,
      noSubdir: false,
      maxReaders: 126,
      maxDbs: 1
    });

    this.initialized = true;
    console.log('[POOL] ✅ Pool initialized successfully');
  }

  /**
   * Pega uma conexão do pool (ou espera se não houver disponível)
   * @returns {Promise<{db: any, releaseToken: string}>}
   */
  async acquire() {
    const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`[POOL] 🔒 [${requestId}] Requesting connection (active: ${this.activeConnections}/${this.maxConnections})`);

    if (!this.initialized) {
      this.initialize();
    }

    // Se há conexões disponíveis no pool
    if (this.pool.length > 0) {
      const connection = this.pool.pop();
      this.activeConnections++;
      console.log(`[POOL] ✅ [${requestId}] Connection acquired from pool (${Date.now() - startTime}ms, active: ${this.activeConnections})`);
      return {
        db: connection.db,
        releaseToken: requestId
      };
    }

    // Se ainda podemos criar mais conexões
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      console.log(`[POOL] 🆕 [${requestId}] Using shared connection (${Date.now() - startTime}ms, active: ${this.activeConnections})`);
      return {
        db: this.sharedDB,
        releaseToken: requestId
      };
    }

    // Precisa esperar - enfileirar
    console.log(`[POOL] ⏳ [${requestId}] All connections busy, waiting in queue (position: ${this.waitingQueue.length + 1})`);
    
    return new Promise((resolve) => {
      this.waitingQueue.push({
        requestId,
        startTime,
        resolve
      });
    });
  }

  /**
   * Devolve uma conexão ao pool
   * @param {string} releaseToken - Token recebido no acquire
   */
  release(releaseToken) {
    const startTime = Date.now();
    console.log(`[POOL] 🔓 [${releaseToken}] Releasing connection (active: ${this.activeConnections})`);

    this.activeConnections--;

    // Se há requisições esperando, servir imediatamente
    if (this.waitingQueue.length > 0) {
      const waiting = this.waitingQueue.shift();
      const waitTime = Date.now() - waiting.startTime;
      
      console.log(`[POOL] 🎯 [${waiting.requestId}] Serving from queue after ${waitTime}ms wait`);
      
      this.activeConnections++;
      waiting.resolve({
        db: this.sharedDB,
        releaseToken: waiting.requestId
      });
    }

    console.log(`[POOL] ✅ [${releaseToken}] Released (${Date.now() - startTime}ms, active: ${this.activeConnections}, queued: ${this.waitingQueue.length})`);
  }

  /**
   * Retorna estatísticas do pool
   */
  getStats() {
    return {
      available: this.pool.length,
      active: this.activeConnections,
      queued: this.waitingQueue.length,
      maxConnections: this.maxConnections,
      initialized: this.initialized
    };
  }

  /**
   * Fecha todas as conexões (usar apenas em shutdown)
   */
  async shutdown() {
    console.log('[POOL] 🛑 Shutting down connection pool...');
    
    if (this.sharedDB) {
      await this.sharedDB.close();
    }

    for (const conn of this.pool) {
      await conn.db.close();
    }

    this.pool = [];
    this.activeConnections = 0;
    this.waitingQueue = [];
    this.initialized = false;

    console.log('[POOL] ✅ Pool shutdown complete');
  }
}

// Export singleton instance
const poolInstance = new LMDBConnectionPool();

module.exports = {
  getPool: () => poolInstance,
  acquire: () => poolInstance.acquire(),
  release: (token) => poolInstance.release(token),
  getStats: () => poolInstance.getStats()
};
