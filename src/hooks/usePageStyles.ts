import { useEffect, useState } from 'react';

// Sistema de refresh para estilos (similar ao useLocaleTexts)
const refreshTriggers: Record<string, number> = {};

export function triggerStylesRefresh(pageId: string) {
  refreshTriggers[pageId] = (refreshTriggers[pageId] || 0) + 1;
  window.dispatchEvent(new CustomEvent('styles-refresh', { detail: { pageId } }));
}

/**
 * Hook para carregar estilos CSS customizados de uma página
 * 
 * ⚠️ TEMPORARIAMENTE DESABILITADO:
 * Os estilos do DB estavam com !important em todas as propriedades,
 * quebrando os layouts flex e grid do Tailwind CSS.
 * 
 * Agora os estilos vêm APENAS do Tailwind CSS inline nos componentes TSX.
 * 
 * @returns {boolean} stylesLoaded - sempre retorna true (compatibilidade)
 */
export function usePageStyles(pageId: string): boolean {
  const [stylesLoaded, setStylesLoaded] = useState(true); // Sempre true agora

  useEffect(() => {
    // Apenas log informativo
    console.log(`🎨 [usePageStyles] DESABILITADO para ${pageId} - usando apenas Tailwind CSS`);
  }, [pageId]);

  return stylesLoaded;
}
