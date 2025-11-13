// Teste do regex usado no servidor para parse de CSS

const css = `[data-json-key="index.hero.title"] { font-size: 3rem; color: #222222; font-weight: 700; }
[data-json-key="index.hero.subtitle"] { font-size: 1.5rem; color: #CFAF5A; }`;

console.log('📝 CSS de entrada:');
console.log(css);
console.log('\n🔍 Testando parse...\n');

// Regex do servidor
const blockRegex = /\[data-json-key="([^"]+)"\]\s*\{([^}]+)\}/g;
let match;
const entries = [];

while ((match = blockRegex.exec(css)) !== null) {
  const jsonKey = match[1];
  const cssBlock = match[2];
  
  console.log(`✅ Bloco encontrado: ${jsonKey}`);
  console.log(`   CSS bruto: ${cssBlock.trim()}`);
  
  // Parse propriedades CSS
  const properties = {};
  const propRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
  let propMatch;
  
  while ((propMatch = propRegex.exec(cssBlock)) !== null) {
    const propName = propMatch[1].trim();
    const propValue = propMatch[2].trim();
    
    // Converter kebab-case para camelCase
    const camelCaseName = propName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    properties[camelCaseName] = propValue;
    
    console.log(`   - ${propName} → ${camelCaseName}: ${propValue}`);
  }
  
  entries.push({
    json_key: jsonKey,
    css_properties: properties
  });
  
  console.log('');
}

console.log('📊 Resultado final:');
console.log(JSON.stringify(entries, null, 2));
