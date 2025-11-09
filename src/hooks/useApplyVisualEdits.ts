import { useEffect } from 'react';

/**
 * Hook DESATIVADO - Não aplicamos mais edições de arquivos separados
 * As edições agora são feitas diretamente nos arquivos JSON originais
 * Este hook existe apenas para manter compatibilidade, mas não faz nada
 */
export function useApplyVisualEdits(pageId: string) {
  useEffect(() => {
    console.log(`ℹ️ useApplyVisualEdits is disabled for ${pageId} - edits now go directly to source JSON files`);
    // Hook desativado - edições agora vão direto pros arquivos JSON originais
  }, [pageId]);
}
