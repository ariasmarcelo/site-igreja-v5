/**
 * CAPTURE ALL STYLES - Script para Browser (DevTools Console)
 * 
 * Captura estilos originais de TODOS os elementos editáveis:
 * - Textos (data-json-key)
 * - Seções (data-section-id)  
 * - Blocos (data-block-id)
 * 
 * Execute no Console do navegador ANTES de aplicar o reset CSS.
 */

(function captureAllStyles() {
  console.log('🎯 CAPTURA COMPLETA DE ESTILOS ORIGINAIS');
  console.log('==========================================\n');
  
  // Buscar TODOS os elementos editáveis
  const textElements = document.querySelectorAll('[data-json-key]');
  const sectionElements = document.querySelectorAll('[data-section-id]');
  const blockElements = document.querySelectorAll('[data-block-id]');
  
  console.log('📋 Elementos encontrados:');
  console.log(`   • Textos (data-json-key): ${textElements.length}`);
  console.log(`   • Seções (data-section-id): ${sectionElements.length}`);
  console.log(`   • Blocos (data-block-id): ${blockElements.length}`);
  console.log(`   Total: ${textElements.length + sectionElements.length + blockElements.length}\n`);
  
  const allCapturedStyles = [];
  
  // Propriedades CSS relevantes
  const cssProperties = [
    // Typography
    'fontSize', 'fontWeight', 'fontFamily', 'fontStyle',
    'lineHeight', 'letterSpacing', 'textAlign', 'textTransform', 
    'textDecoration', 'textIndent',
    // Colors
    'color', 'backgroundColor',
    // Spacing
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    // Borders
    'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'borderRadius', 'borderWidth', 'borderColor', 'borderStyle',
    // Layout
    'display', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
    // Flexbox/Grid
    'flexDirection', 'alignItems', 'justifyContent', 'alignContent',
    'gap', 'rowGap', 'columnGap',
    'gridTemplateColumns', 'gridTemplateRows', 'gridGap'
  ];
  
  /**
   * Captura estilos de um elemento
   */
  function captureElement(element, identifier, identifierType) {
    const computed = window.getComputedStyle(element);
    const tagName = element.tagName.toLowerCase();
    const capturedStyles = {};
    
    cssProperties.forEach(prop => {
      const value = computed[prop];
      
      // Filtrar valores padrão/irrelevantes
      if (value && 
          value !== 'normal' && 
          value !== 'none' && 
          value !== 'auto' && 
          value !== '0px' &&
          value !== 'rgba(0, 0, 0, 0)' &&
          value !== 'transparent' &&
          !value.startsWith('rgb(0, 0, 0)')) {
        capturedStyles[prop] = value;
      }
    });
    
    // Adicionar apenas se houver estilos capturados
    if (Object.keys(capturedStyles).length > 0) {
      allCapturedStyles.push({
        identifier: identifier,
        identifierType: identifierType,
        tagName: tagName,
        styles: capturedStyles
      });
    }
  }
  
  // Processar elementos de TEXTO
  console.log('📝 Capturando estilos de TEXTOS...');
  let count = 0;
  textElements.forEach((el) => {
    captureElement(el, el.getAttribute('data-json-key'), 'json-key');
    count++;
    if (count % 20 === 0) console.log(`   • Processados: ${count}/${textElements.length}`);
  });
  console.log(`   ✅ Concluído: ${count} textos\n`);
  
  // Processar SEÇÕES
  console.log('📦 Capturando estilos de SEÇÕES...');
  count = 0;
  sectionElements.forEach((el) => {
    captureElement(el, el.getAttribute('data-section-id'), 'section-id');
    count++;
    if (count % 10 === 0) console.log(`   • Processadas: ${count}/${sectionElements.length}`);
  });
  console.log(`   ✅ Concluído: ${count} seções\n`);
  
  // Processar BLOCOS
  console.log('🧱 Capturando estilos de BLOCOS...');
  count = 0;
  blockElements.forEach((el) => {
    captureElement(el, el.getAttribute('data-block-id'), 'block-id');
    count++;
    if (count % 20 === 0) console.log(`   • Processados: ${count}/${blockElements.length}`);
  });
  console.log(`   ✅ Concluído: ${count} blocos\n`);
  
  // Resumo
  const textCount = allCapturedStyles.filter(s => s.identifierType === 'json-key').length;
  const sectionCount = allCapturedStyles.filter(s => s.identifierType === 'section-id').length;
  const blockCount = allCapturedStyles.filter(s => s.identifierType === 'block-id').length;
  
  console.log('==========================================');
  console.log('✅ CAPTURA CONCLUÍDA!');
  console.log('==========================================');
  console.log('📊 Elementos com estilos capturados:');
  console.log(`   • Textos: ${textCount}`);
  console.log(`   • Seções: ${sectionCount}`);
  console.log(`   • Blocos: ${blockCount}`);
  console.log(`   TOTAL: ${allCapturedStyles.length}\n`);
  
  // Gerar JSON
  const jsonOutput = JSON.stringify(allCapturedStyles, null, 2);
  const jsonSize = (jsonOutput.length / 1024).toFixed(2);
  
  console.log(`📦 Tamanho do JSON: ${jsonSize} KB\n`);
  console.log('==========================================');
  console.log('📋 JSON GERADO (copie abaixo):');
  console.log('==========================================\n');
  console.log(jsonOutput);
  console.log('\n==========================================');
  console.log('📌 PRÓXIMOS PASSOS:');
  console.log('   1. Copie o JSON acima');
  console.log('   2. Abra scripts/populate-all-styles.js');
  console.log('   3. Cole no array capturedStyles');
  console.log('   4. Execute: node scripts/populate-all-styles.js');
  console.log('==========================================\n');
  
  // Tentar copiar para clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonOutput)
      .then(() => console.log('✨ JSON copiado para a área de transferência!'))
      .catch(() => console.log('⚠️  Não foi possível copiar automaticamente. Copie manualmente.'));
  }
  
  return allCapturedStyles;
})();
