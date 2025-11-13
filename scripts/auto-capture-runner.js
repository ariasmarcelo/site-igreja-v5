/**
 * AUTO CAPTURE RUNNER - Node.js + Puppeteer
 * 
 * Captura automaticamente os estilos de todos os elementos editáveis
 * usando um headless browser.
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = 'http://localhost:8080';

console.log('🎯 Iniciando captura automática de estilos...\n');

(async () => {
  let browser;
  
  try {
    // Iniciar browser
    console.log('🌐 Iniciando navegador headless...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navegar para a página
    console.log(`📄 Acessando ${URL}...`);
    await page.goto(URL, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('✅ Página carregada!\n');
    
    // Aguardar elementos renderizarem
    console.log('⏳ Aguardando elementos renderizarem...');
    await page.waitForTimeout(2000);
    
    // Executar captura de estilos
    console.log('📊 Capturando estilos...\n');
    
    const capturedStyles = await page.evaluate(() => {
      const allCapturedStyles = [];
      
      // Buscar TODOS os elementos editáveis
      const textElements = document.querySelectorAll('[data-json-key]');
      const sectionElements = document.querySelectorAll('[data-section-id]');
      const blockElements = document.querySelectorAll('[data-block-id]');
      
      console.log('📋 Elementos encontrados:');
      console.log(`   • Textos: ${textElements.length}`);
      console.log(`   • Seções: ${sectionElements.length}`);
      console.log(`   • Blocos: ${blockElements.length}`);
      
      // Propriedades CSS relevantes
      const cssProperties = [
        'fontSize', 'fontWeight', 'fontFamily', 'fontStyle',
        'lineHeight', 'letterSpacing', 'textAlign', 'textTransform',
        'textDecoration', 'textIndent',
        'color', 'backgroundColor',
        'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
        'borderRadius', 'borderWidth', 'borderColor', 'borderStyle',
        'display', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
        'flexDirection', 'alignItems', 'justifyContent', 'alignContent',
        'gap', 'rowGap', 'columnGap',
        'gridTemplateColumns', 'gridTemplateRows', 'gridGap'
      ];
      
      function captureElement(element, identifier, identifierType) {
        const computed = window.getComputedStyle(element);
        const tagName = element.tagName.toLowerCase();
        const capturedStyles = {};
        
        cssProperties.forEach(prop => {
          const value = computed[prop];
          
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
        
        if (Object.keys(capturedStyles).length > 0) {
          allCapturedStyles.push({
            identifier: identifier,
            identifierType: identifierType,
            tagName: tagName,
            styles: capturedStyles
          });
        }
      }
      
      // Capturar textos
      textElements.forEach(el => {
        captureElement(el, el.getAttribute('data-json-key'), 'json-key');
      });
      
      // Capturar seções
      sectionElements.forEach(el => {
        captureElement(el, el.getAttribute('data-section-id'), 'section-id');
      });
      
      // Capturar blocos
      blockElements.forEach(el => {
        captureElement(el, el.getAttribute('data-block-id'), 'block-id');
      });
      
      return allCapturedStyles;
    });
    
    // Estatísticas
    const textCount = capturedStyles.filter(s => s.identifierType === 'json-key').length;
    const sectionCount = capturedStyles.filter(s => s.identifierType === 'section-id').length;
    const blockCount = capturedStyles.filter(s => s.identifierType === 'block-id').length;
    
    console.log('========================================');
    console.log('✅ CAPTURA CONCLUÍDA!');
    console.log('========================================');
    console.log('📊 Elementos com estilos capturados:');
    console.log(`   • Textos: ${textCount}`);
    console.log(`   • Seções: ${sectionCount}`);
    console.log(`   • Blocos: ${blockCount}`);
    console.log(`   TOTAL: ${capturedStyles.length}\n`);
    
    // Salvar JSON
    const outputPath = join(__dirname, 'captured-styles.json');
    writeFileSync(outputPath, JSON.stringify(capturedStyles, null, 2), 'utf-8');
    
    const jsonSize = (JSON.stringify(capturedStyles).length / 1024).toFixed(2);
    console.log(`💾 Arquivo salvo: ${outputPath}`);
    console.log(`📦 Tamanho: ${jsonSize} KB\n`);
    
    await browser.close();
    
    console.log('========================================');
    console.log('📌 PRÓXIMO PASSO:');
    console.log('   Execute: node scripts/populate-all-styles.js');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
