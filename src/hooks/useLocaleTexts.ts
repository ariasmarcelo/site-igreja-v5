import { useEffect, useState } from 'react';

// Event emitter global para sincronização de dados entre componentes
const refreshEvents = new Map<string, Set<() => void>>();

// Flag global para bloquear atualizações enquanto há edições pendentes
const editLocks = new Map<string, boolean>();

/**
 * Sincroniza JSONs granulares de fallback com dados do DB
 * Envia dados para API que salva cada campo como arquivo JSON separado
 */
async function syncGranularFallbacks(pageId: string, content: Record<string, unknown>): Promise<void> {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiBaseUrl}/api/sync-fallbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, content })
    });
    
    if (response.ok) {
      console.log(`📝 Fallbacks sincronizados: ${pageId}`);
    }
  } catch (error) {
    // Silencioso - sincronização de fallback não é crítica
    console.warn(`⚠️ Falha ao sincronizar fallbacks: ${pageId}`);
  }
}

export const triggerRefresh = (pageId: string) => {
  const normalizedPageId = pageId.toLowerCase();
  const listeners = refreshEvents.get(normalizedPageId);
  if (listeners) {
    listeners.forEach(callback => callback());
  }
};

export const setEditLock = (pageId: string, locked: boolean) => {
  editLocks.set(pageId.toLowerCase(), locked);
};

export const isEditLocked = (pageId: string): boolean => {
  return editLocks.get(pageId.toLowerCase()) || false;
};

/**
 * Hook para carregar textos do Supabase via API content-v2
 * 
 * @param pageId - ID da página (index, quem-somos, contato, etc)
 * @returns { texts, loading, error } - Dados da página, estado de loading e erro
 */
export function useLocaleTexts<T = Record<string, unknown>>(
  pageId: string
): {
  texts: T | null;
  loading: boolean;
  error: string | null;
} {
  const [texts, setTexts] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Registrar listener para refresh manual
    const normalizedPageId = pageId.toLowerCase();
    if (!refreshEvents.has(normalizedPageId)) {
      refreshEvents.set(normalizedPageId, new Set());
    }
    
    const callback = () => setRefreshTrigger(prev => prev + 1);
    refreshEvents.get(normalizedPageId)?.add(callback);
    
    return () => {
      refreshEvents.get(normalizedPageId)?.delete(callback);
    };
  }, [pageId]);

  useEffect(() => {
    const loadWithFallback = async () => {
      const locked = isEditLocked(pageId);
      
      if (locked) {
        console.log(`🔒 Skipping load for ${pageId} - edit lock active`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // STEP 1: Buscar do DB (sempre tenta primeiro)
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const url = `${apiBaseUrl}/api/content-v2/${pageId.toLowerCase()}`;
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.content) {
          setTexts(data.content as T);
          setError(null);
          console.log(`✅ Carregado do Supabase: ${pageId}`);
          
          // STEP 2: Sincronizar JSONs granulares em background (não bloqueia)
          syncGranularFallbacks(pageId, data.content).catch(err => 
            console.warn('Erro ao sincronizar fallbacks:', err)
          );
        } else {
          throw new Error(`No content found in API response`);
        }
      } catch (apiError) {
        const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
        setError(`Failed to load ${pageId}: ${errorMsg}`);
        console.error(`❌ Erro ao carregar ${pageId}:`, errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadWithFallback();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}
