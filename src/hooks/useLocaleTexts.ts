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
 * Converte pageId para PascalCase (ex: "quem-somos" → "QuemSomos")
 */
function toPascalCase(pageId: string): string {
  return pageId
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Carrega JSONs granulares locais e reconstrói objeto completo
 * Exemplo: Index.hero.title.json + Index.hero.subtitle.json → { hero: { title: "...", subtitle: "..." } }
 */
async function loadGranularFallback<T>(pageId: string): Promise<T | null> {
  try {
    const pageName = toPascalCase(pageId);
    const basePath = `/src/locales/pt-BR`;
    
    // Lista todos os arquivos .json que começam com o nome da página
    // Nota: Em produção, precisaríamos de um manifest ou glob pattern
    // Por enquanto, vamos tentar carregar dinamicamente baseado em paths conhecidos
    
    const reconstructed: any = {};
    
    // Tentar carregar arquivo consolidado primeiro (compatibilidade)
    try {
      const module = await import(`../../locales/pt-BR/${pageName}.json`);
      console.log(`📦 Loaded consolidated fallback: ${pageName}.json`);
      return module.default as T;
    } catch {
      // Arquivo consolidado não existe, continuar com granular
    }
    
    // TODO: Implementar carregamento granular quando necessário
    // Por enquanto, retornar null para forçar busca no DB
    console.log(`⚠️  No fallback files found for ${pageName}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Error loading granular fallback for ${pageId}:`, error);
    return null;
  }
}

/**
 * Hook para carregar textos com fallback em cascata:
 * 1. Tenta buscar do Supabase via API
 * 2. Se falhar, carrega JSONs granulares locais
 * 3. Se falhar, usa fallbackData (opcional)
 * 
 * @param pageId - ID da página (index, quem-somos, contato, etc)
 * @param fallbackData - Fallback estático opcional (usado apenas se tudo falhar)
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
        console.log(`📥 [1/3] Tentando carregar ${pageId} do Supabase...`);
        
        // STEP 1: Tentar buscar do Supabase via API (conteúdo da página + compartilhado)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Tentar content-v2 primeiro (produção), fallback para content (local)
        let response = await fetch(`${apiUrl}/api/content-v2/${pageId.toLowerCase()}`);
        
        // Se content-v2 não existir (404), tentar API antiga
        if (!response.ok && response.status === 404) {
          console.log(`⚠️ content-v2 não encontrado, tentando API antiga...`);
          response = await fetch(`${apiUrl}/api/content/${pageId.toLowerCase()}`);
        }
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.content) {
          // O backend já faz merge do conteúdo compartilhado (NULL) + página específica
          setTexts(data.content as T);
          setError(null);
          console.log(`✅ [1/3] Carregado do Supabase: ${pageId} (${Object.keys(data.content).length} keys)`);
          return; // Sucesso - não precisa de fallback
        } else {
          throw new Error(`No content found in API response`);
        }
      } catch (apiError) {
        const errorMsg = apiError instanceof Error ? apiError.message : 'Unknown error';
        console.warn(`⚠️  [1/3] Falha ao carregar do Supabase: ${errorMsg}`);
        
        try {
          console.log(`📦 [2/3] Tentando carregar JSONs granulares locais...`);
          
          // STEP 2: Tentar carregar JSONs granulares locais
          const granularData = await loadGranularFallback<T>(pageId);
          
          if (granularData) {
            setTexts(granularData);
            setError(null);
            console.log(`✅ [2/3] Carregado de fallback granular: ${pageId}`);
            return; // Sucesso com fallback granular
          } else {
            throw new Error('No granular fallback files found');
          }
        } catch (fallbackError) {
          console.warn(`⚠️  [2/3] Falha ao carregar fallback granular:`, fallbackError);
          
          // STEP 3: Usar fallbackData estático (se fornecido)
          if (fallbackData) {
            setTexts(fallbackData);
            setError(null);
            console.log(`✅ [3/3] Usando fallback estático para ${pageId}`);
          } else {
            setError(`Failed to load ${pageId} from all sources`);
            console.error(`❌ [3/3] Todas as fontes falharam para ${pageId}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadFromAPI();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}
