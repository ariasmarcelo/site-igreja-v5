import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook para carregar estilos CSS customizados de uma página do Supabase
 * Os estilos são editados através do Editor Visual e salvos no banco de dados
 */
export function usePageStyles(pageId: string) {
  useEffect(() => {
    const loadStylesFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('page_styles')
          .select('css')
          .eq('page_id', pageId.toLowerCase())
          .single();
        
        if (error) {
          console.warn(`⚠️ No custom styles in Supabase for: ${pageId}`);
          return;
        }
        
        if (data && data.css) {
          // Criar elemento <style> e injetar CSS
          const styleId = `page-styles-${pageId}`;
          let styleElement = document.getElementById(styleId) as HTMLStyleElement;
          
          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
          }
          
          styleElement.textContent = data.css;
          console.log(`✅ Loaded custom styles from Supabase: ${pageId}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error loading styles from Supabase for ${pageId}:`, error);
      }
    };

    loadStylesFromSupabase();
    
    // Cleanup ao desmontar o componente
    return () => {
      const styleElement = document.getElementById(`page-styles-${pageId}`);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [pageId]);
}
