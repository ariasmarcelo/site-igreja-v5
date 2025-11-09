import { useEffect, useRef } from 'react';

/**
 * Hook para executar auto-atribuição de IDs únicos na primeira carga
 * 
 * FUNCIONAMENTO:
 * 1. Verifica flag no localStorage (já executou?)
 * 2. Se não executou, chama API para rodar script
 * 3. Marca como executado para não repetir
 * 
 * CONTROLE:
 * - localStorage: 'auto-assign-ids-executed' = timestamp
 * - Pode ser resetado manualmente via console: localStorage.removeItem('auto-assign-ids-executed')
 */
export function useAutoAssignIds() {
  const executedRef = useRef(false);
  
  useEffect(() => {
    // Executar apenas uma vez por sessão
    if (executedRef.current) return;
    executedRef.current = true;
    
    // Verificar se já foi executado (localStorage)
    const lastExecution = localStorage.getItem('auto-assign-ids-executed');
    
    // Se já executou nas últimas 24h, não executar novamente
    if (lastExecution) {
      const lastTime = parseInt(lastExecution);
      const now = Date.now();
      const hoursSinceLastExecution = (now - lastTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastExecution < 24) {
        console.log('✅ IDs únicos já foram atribuídos recentemente');
        return;
      }
    }
    
    // Executar script
    console.log('🔧 Executando auto-atribuição de IDs únicos...');
    
    fetch('http://localhost:3001/api/auto-assign-ids', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('✅ IDs únicos atribuídos automaticamente!');
          console.log(`   📊 ${data.totalProcessed} elementos processados`);
          console.log(`   🔄 ${data.totalReplaced} IDs substituídos`);
          console.log(`   🆔 ${data.totalNew} IDs novos`);
          
          // Marcar como executado
          localStorage.setItem('auto-assign-ids-executed', Date.now().toString());
          
          // Recarregar página para aplicar mudanças
          if (data.totalNew > 0 || data.totalReplaced > 0) {
            console.log('🔄 Recarregando página para aplicar mudanças...');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } else {
          console.error('❌ Erro ao atribuir IDs:', data.error);
        }
      })
      .catch(err => {
        console.error('❌ Erro ao executar auto-atribuição de IDs:', err);
      });
  }, []);
}

/**
 * Força reexecução do script (útil para desenvolvimento)
 */
export function forceReassignIds() {
  localStorage.removeItem('auto-assign-ids-executed');
  console.log('🔄 Flag removida. Recarregue a página para reexecutar.');
}

// Expor função global para facilitar uso no console
if (typeof window !== 'undefined') {
  interface WindowWithForce extends Window {
    forceReassignIds?: () => void;
  }
  (window as WindowWithForce).forceReassignIds = forceReassignIds;
}
