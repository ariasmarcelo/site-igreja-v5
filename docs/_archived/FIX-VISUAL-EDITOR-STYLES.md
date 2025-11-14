# Correção do VisualPageEditor - Salvamento de Estilos

## 🐛 Problema Identificado

O VisualPageEditor não conseguia salvar estilos editados no banco de dados porque estava enviando CSS no formato incorreto.

### Formato Enviado (ERRADO):
```javascript
// styleEdits = { "index.hero.title": "font-size: 3rem; color: #222;" }
const cssString = Object.entries(styleEdits)
  .map(([selector, styles]) => `${selector} { ${styles} }`)
  .join('\n');

// Resultado:
// index.hero.title { font-size: 3rem; color: #222; }
//                  ↑ Falta o seletor [data-json-key="..."]
```

### Formato Esperado pela API (CORRETO):
```css
[data-json-key="index.hero.title"] { font-size: 3rem; color: #222; }
```

## ✅ Solução Aplicada

**Arquivo:** `src/components/VisualPageEditor.tsx`  
**Linha:** ~1653

### Antes:
```typescript
const cssString = Object.entries(styleEdits)
  .map(([selector, styles]) => `${selector} { ${styles} }`)
  .join('\n');
```

### Depois:
```typescript
const cssString = Object.entries(styleEdits)
  .map(([jsonKey, styles]) => `[data-json-key="${jsonKey}"] { ${styles} }`)
  .join('\n');
```

## 🔍 Como a API Processa

**Arquivo:** `server-local/index.js` - Rota `POST /api/save-styles`

1. **Recebe CSS como string:**
   ```css
   [data-json-key="index.hero.title"] { font-size: 3rem; color: #222222; }
   ```

2. **Extrai blocos com regex:**
   ```javascript
   const blockRegex = /\[data-json-key="([^"]+)"\]\s*\{([^}]+)\}/g;
   ```

3. **Parse de propriedades:**
   ```javascript
   const propRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
   // font-size: 3rem; → { fontSize: "3rem" }
   ```

4. **Salva no banco:**
   ```javascript
   await supabase.from('style_entries').upsert({
     page_id: 'index',
     json_key: 'index.hero.title',
     css_properties: { fontSize: '3rem', color: '#222222' }
   }, { onConflict: 'json_key' });
   ```

## 🧪 Teste de Validação

**Script:** `scripts/test-css-regex.js`

Valida que o regex do servidor funciona corretamente:

```javascript
const css = `[data-json-key="index.hero.title"] { font-size: 3rem; color: #222222; }`;
// ✅ Parse bem-sucedido
// ✅ Converte kebab-case → camelCase
// ✅ Extrai todas as propriedades
```

## 📝 Próximos Passos

1. ✅ Correção aplicada no VisualPageEditor
2. ⏳ Testar no Admin Console (http://localhost:8080/436F6E736F6C45)
3. ⏳ Editar estilo de um elemento
4. ⏳ Verificar se salva corretamente no banco
5. ⏳ Verificar se o estilo aplicado aparece na página

## 🎯 Resultado Esperado

Ao editar um estilo no Admin Console:
- ✅ Envio correto: `[data-json-key="..."] { props }`
- ✅ Parse correto no servidor
- ✅ Upsert bem-sucedido na tabela `style_entries`
- ✅ Recarga da página mostra o novo estilo aplicado
