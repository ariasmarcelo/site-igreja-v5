/**
 * Script para capturar estilos originais de elementos editáveis
 * 
 * Este script deve ser executado NO NAVEGADOR (console DevTools) ANTES
 * de aplicar o reset CSS para elementos com data-json-key.
 * 
 * Ele irá:
 * 1. Encontrar todos os elementos com data-json-key
 * 2. Capturar seus estilos computados
 * 3. Gerar comandos SQL para inserir no banco de dados
 */

function captureOriginalStyles() {
  const elements = document.querySelectorAll('[data-json-key]');
  const styles = [];
  
  // Propriedades CSS que queremos capturar
  const cssProperties = [
    'fontSize',
    'fontWeight',
    'fontFamily',
    'color',
    'backgroundColor',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'textTransform',
    'textDecoration',
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'border',
    'borderRadius',
    'display',
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'minWidth',
    'minHeight',
  ];
  
  elements.forEach(element => {
    const jsonKey = element.getAttribute('data-json-key');
    const computedStyle = window.getComputedStyle(element);
    const tagName = element.tagName.toLowerCase();
    
    const capturedStyles = {};
    
    cssProperties.forEach(prop => {
      const value = computedStyle[prop];
      
      // Filtrar valores padrão/irrelevantes
      if (value && 
          value !== 'normal' && 
          value !== 'none' && 
          value !== 'auto' && 
          value !== '0px' &&
          value !== 'rgba(0, 0, 0, 0)' &&
          !value.startsWith('rgb(0, 0, 0)') // cor preta padrão
      ) {
        capturedStyles[prop] = value;
      }
    });
    
    if (Object.keys(capturedStyles).length > 0) {
      styles.push({
        jsonKey,
        tagName,
        styles: capturedStyles
      });
    }
  });
  
  console.log('📊 Estilos capturados:', styles.length, 'elementos');
  console.log('\n=== COPIE O JSON ABAIXO ===\n');
  console.log(JSON.stringify(styles, null, 2));
  
  return styles;
}

// Executar
captureOriginalStyles();
