import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook personalizado para carregar textos do Supabase
 * Busca dados diretamente do banco de dados PostgreSQL
 * 
 * @param pageId - ID da página (index, quemsomos, contato, etc)
 * @param defaultTexts - Conteúdo JSON padrão como fallback
 * @returns Textos da página (sempre atualizados do DB)
 */
export function useLocaleTexts<T = Record<string, unknown>>(pageId: string, defaultTexts: T): T {
  // Sempre usar defaultTexts como estado inicial
  const [texts, setTexts] = useState<T>(defaultTexts);

  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('page_contents')
          .select('content')
          .eq('page_id', pageId.toLowerCase())
          .single();
        
        if (error) {
          console.warn(`⚠️ Supabase error for ${pageId}:`, error);
          console.log(`📄 Using default texts for ${pageId}`);
          return;
        }
        
        if (data && data.content) {
          setTexts(data.content as T);
          console.log(`✅ Loaded from Supabase: ${pageId}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error loading from Supabase for ${pageId}:`, error);
        // Manter defaultTexts em caso de erro
      }
    };

    loadFromSupabase();
  }, [pageId]);

  return texts;
}
