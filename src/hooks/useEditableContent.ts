import { useEffect } from 'react';

// Hook para tornar elementos de texto editáveis no modo visual
export function useEditableContent(pageId: string) {
  useEffect(() => {
    // Verificar se há conteúdo editado salvo
    const saved = localStorage.getItem(`visual_${pageId}`);
    const editedTexts: Record<string, string> = saved ? JSON.parse(saved) : {};

    // Adicionar data-editable automaticamente em elementos de texto
    const addEditableAttributes = () => {
      // Selecionar elementos comuns de texto
      const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span:not(.lucide)', 'a', 'li',
        '[class*="text-"]', '[class*="title"]', '[class*="description"]'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const htmlEl = el as HTMLElement;
          
          // Ignorar se já tem data-editable ou se está dentro de um botão/input
          if (htmlEl.hasAttribute('data-editable') || 
              htmlEl.closest('button, input, textarea, select, nav, [role="navigation"]')) {
            return;
          }

          // Ignorar se é apenas um ícone ou não tem texto
          const textContent = htmlEl.textContent?.trim();
          if (!textContent || textContent.length < 2) {
            return;
          }

          // Criar ID único baseado no seletor e conteúdo
          const elementId = `${pageId}_${selector.replace(/[^a-z0-9]/gi, '_')}_${index}`;
          htmlEl.setAttribute('data-editable', elementId);

          // Aplicar texto editado se existir
          if (editedTexts[elementId]) {
            htmlEl.textContent = editedTexts[elementId];
          }
        });
      });
    };

    // Executar quando o componente montar
    const timer = setTimeout(addEditableAttributes, 100);

    return () => clearTimeout(timer);
  }, [pageId]);
}
