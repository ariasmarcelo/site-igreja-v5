import { useEffect } from 'react';

/**
 * Hook para mapear elementos do DOM para chaves do JSON
 * Adiciona data-json-key em elementos que usam useLocaleTexts
 */
export function useJsonMapping(pageId: string, textsObject: Record<string, unknown>) {
  useEffect(() => {
    console.log(`📌 Mapping JSON keys for page: ${pageId}`);
    
    // Função recursiva para criar mapeamento de valores para chaves
    const valueToKeyMap = new Map<string, string>();
    
    const mapValues = (obj: Record<string, unknown>, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'string') {
          // Mapear texto para chave
          valueToKeyMap.set(value.trim(), fullKey);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string') {
              valueToKeyMap.set(item.trim(), `${fullKey}[${index}]`);
            } else if (typeof item === 'object' && item !== null) {
              mapValues(item, `${fullKey}[${index}]`);
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          mapValues(value as Record<string, unknown>, fullKey);
        }
      }
    };
    
    mapValues(textsObject);
    console.log(`✓ Created ${valueToKeyMap.size} value-to-key mappings`);
    
    // Adicionar data-json-key em elementos que contêm esses textos
    const addJsonKeys = () => {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
      let mappedCount = 0;
      
      elements.forEach(el => {
        const htmlEl = el as HTMLElement;
        const text = htmlEl.textContent?.trim();
        
        if (!text || htmlEl.hasAttribute('data-json-key')) {
          return;
        }
        
        // Ignorar elementos de controle/UI
        if (htmlEl.closest('button, input, textarea, [role="navigation"], .bg-gradient, .bg-amber-50')) {
          return;
        }
        
        // Procurar chave correspondente no mapa
        const jsonKey = valueToKeyMap.get(text);
        if (jsonKey) {
          htmlEl.setAttribute('data-json-key', jsonKey);
          htmlEl.setAttribute('data-page-id', pageId);
          mappedCount++;
          console.log(`✓ Mapped: "${text.substring(0, 40)}..." → ${jsonKey}`);
        }
      });
      
      console.log(`📊 Total elements mapped: ${mappedCount}`);
    };
    
    // Executar mapeamento após DOM estar pronto
    setTimeout(addJsonKeys, 100);
    setTimeout(addJsonKeys, 500);
    setTimeout(addJsonKeys, 1000);
    
  }, [pageId, textsObject]);
}
