import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Event emitter global para sincronização de dados entre componentes
const refreshEvents = new Map<string, Set<() => void>>();

// Flag global para bloquear atualizações enquanto há edições pendentes
const editLocks = new Map<string, boolean>();

export const triggerRefresh = (pageId: string) => {
  const normalizedPageId = pageId.toLowerCase();
  const listeners = refreshEvents.get(normalizedPageId);
  console.log(`🔄 triggerRefresh(${pageId}) - listeners: ${listeners?.size || 0}`);
  if (listeners) {
    listeners.forEach(callback => {
      console.log(`  → Calling refresh callback for ${pageId}`);
      callback();
    });
  }
};

export const setEditLock = (pageId: string, locked: boolean) => {
  editLocks.set(pageId.toLowerCase(), locked);
  console.log(`🔒 Edit lock for ${pageId}: ${locked}`);
};

export const isEditLocked = (pageId: string): boolean => {
  return editLocks.get(pageId.toLowerCase()) || false;
};

/**
 * Hook personalizado para carregar textos EXCLUSIVAMENTE do Supabase
 * Busca dados diretamente do banco de dados PostgreSQL
 * Suporta refresh automático quando triggerRefresh() é chamado
 * 
 * @param pageId - ID da página (index, quemsomos, contato, etc)
 * @param fallbackData - Dados de fallback (opcional, para tipagem TypeScript)
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
  // Tentar usar cache primeiro, depois fallback
  const getCachedContent = () => {
    try {
      const cacheKey = `page_cache_${pageId}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    } catch (err) {
      console.warn(`⚠️ Failed to load cache for ${pageId}:`, err);
    }
    return fallbackData || null;
  };
  
  const [texts, setTexts] = useState<T | null>(getCachedContent);
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
    const loadFromSupabase = async () => {
      const locked = isEditLocked(pageId);
      console.log(`🔍 useLocaleTexts.loadFromSupabase(${pageId}) - locked: ${locked}, refreshTrigger: ${refreshTrigger}`);
      
      // NÃO atualizar se há edições pendentes (lock ativo)
      if (locked) {
        console.log(`⏸️ Skipping Supabase load for ${pageId} (edit lock active)`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`📡 Fetching from Supabase for ${pageId}...`);
        const { data, error: supabaseError } = await supabase
          .from('page_contents')
          .select('content')
          .eq('page_id', pageId.toLowerCase())
          .single();
        
        if (supabaseError) {
          const errorMsg = `Erro ao carregar conteúdo: ${supabaseError.message}`;
          console.warn(`⚠️ Supabase error for ${pageId}:`, supabaseError);
          setError(errorMsg);
          setLoading(false);
          return;
        }
        
        if (data && data.content) {
          console.log(`✅ Supabase data received for ${pageId}`);
          setTexts(data.content as T);
          setError(null);
          
          // Salvar no localStorage para cache
          try {
            const cacheKey = `page_cache_${pageId}`;
            localStorage.setItem(cacheKey, JSON.stringify(data.content));
            console.log(`💾 Cache updated in localStorage for ${pageId}`);
          } catch (err) {
            console.warn(`⚠️ Failed to update localStorage cache for ${pageId}:`, err);
          }
          
          // Atualizar histórico de fallback JSON (5 versões)
          try {
            const historyKey = `page_history_${pageId}`;
            const historyStr = localStorage.getItem(historyKey);
            const history: Array<{ timestamp: string; content: T }> = historyStr ? JSON.parse(historyStr) : [];
            
            // Verificar se conteúdo mudou
            const latestContent = history[0]?.content;
            const newContentStr = JSON.stringify(data.content);
            const latestContentStr = latestContent ? JSON.stringify(latestContent) : '';
            
            if (newContentStr !== latestContentStr) {
              // Conteúdo diferente - adicionar ao histórico
              history.unshift({
                timestamp: new Date().toISOString(),
                content: data.content as T
              });
              
              // Manter apenas últimas 5 versões
              if (history.length > 5) {
                history.splice(5);
              }
              
              localStorage.setItem(historyKey, JSON.stringify(history));
              console.log(`📝 History updated for ${pageId} (${history.length} versions)`);
            } else {
              console.log(`✓ Content unchanged for ${pageId} - history not updated`);
            }
          } catch (err) {
            console.warn(`⚠️ Failed to update history for ${pageId}:`, err);
          }
        } else {
          const errorMsg = `Nenhum conteúdo encontrado para a página: ${pageId}`;
          console.warn(`⚠️ ${errorMsg}`);
          setError(errorMsg);
        }
      } catch (error) {
        const errorMsg = `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}`;
        console.error(`❌ Error loading from Supabase for ${pageId}:`, error);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadFromSupabase();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}
