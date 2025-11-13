import { useEffect, useState } from 'react';

// Event emitter global para sincronização de dados entre componentes
const refreshEvents = new Map<string, Set<() => void>>();

// Flag global para bloquear atualizações enquanto há edições pendentes
const editLocks = new Map<string, boolean>();

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
 * Hook para carregar textos via API local (estrutura granular)
 * A API reconstrói o objeto a partir de text_entries do Supabase
 * Usa fallback APENAS durante loading inicial (para evitar página em branco)
 * 
 * @param pageId - ID da página (index, quemsomos, contato, etc)
 * @param fallbackData - Usado APENAS durante loading (opcional)
 * @returns { texts, loading, error } - Dados da página, estado de loading e erro
 */
export function useLocaleTexts<T = Record<string, unknown>>(
  pageId: string,
  fallbackData?: T
): {
  texts: T | null;
  loading: boolean;
  error: string | null;
} {
  // Usar fallback APENAS como estado inicial para evitar página em branco
  const [texts, setTexts] = useState<T | null>(fallbackData || null);
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
    const loadFromAPI = async () => {
      const locked = isEditLocked(pageId);
      
      // NÃO atualizar se há edições pendentes (lock ativo)
      if (locked) {
        console.log(`🔒 Skipping load for ${pageId} - edit lock active`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // console.log(`📥 Loading ${pageId} from API (GRANULAR)`);
        
        // Buscar via API local (que reconstrói o objeto a partir de entries granulares)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/content/${pageId.toLowerCase()}`);
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.content) {
          setTexts(data.content as T);
          setError(null);
          console.log(`✅ Loaded ${pageId} from API (${Object.keys(data.content).length} keys)`);
          // console.log(`✅ Loaded ${pageId} from API (GRANULAR):`, {
          //   keys: Object.keys(data.content).length,
          //   hasPsicodelicos: 'psicodelicos' in data.content
          // });
        } else {
          throw new Error(`No content found for page: ${pageId}`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error loading ${pageId}:`, errorMsg);
        setError(errorMsg);
        // Manter fallback se disponível, em vez de setar null
        if (!texts && fallbackData) {
          setTexts(fallbackData);
          console.log(`⚠️  Using fallback data for ${pageId}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadFromAPI();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}
