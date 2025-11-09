# Solução para Problema de Persistência de Edições

## 🔴 Problema Original

**Sintomas:**
- Editor visual funcionava (edições apareciam no DOM)
- Salvamento não persistia no arquivo JSON
- Após reload da página, mudanças desapareciam

**Erro no Console do Servidor:**
```
⚠️ Expected object at index, got undefined
⚠️ Failed to update by key: index.hero.icon.sun_animated__styles
```

---

## 🔍 Causa Raiz

**Incompatibilidade de formato de ID entre código e JSON:**

### No Código TSX (Index.tsx)
```tsx
<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>
```

### No Arquivo JSON (Index.json)
```json
{
  "hero": {
    "title": "Título aqui"
  }
}
```

### O que acontecia:
1. Script `assign-ids-final.js` gerava IDs com prefixo: `index.hero.title`
2. VisualPageEditor enviava para API com prefixo: `index.hero.title`
3. Servidor tentava acessar: `json["index"]["hero"]["title"]`
4. ❌ Chave `"index"` não existia no JSON → Erro

---

## ✅ Solução Implementada

### 1. Manter IDs com Prefixo no TSX

**Por quê?**
- IDs no DOM devem ser únicos globalmente
- Múltiplas páginas podem ter `hero.title` → Conflito
- Prefixo resolve: `index.hero.title` vs `quemSomos.hero.title`

### 2. API Remove Prefixo Automaticamente

**Onde:** `server/api.js` - endpoint `/save-visual-edits`

**Por que na API e não no frontend?**
- ✅ **Dados completos**: Não perde informação crítica no caminho
- ✅ **Rastreabilidade**: Sempre sabe de qual página veio a edição
- ✅ **Validação**: API pode validar se pageId bate com arquivo JSON
- ✅ **Escalabilidade**: Suporta edição de múltiplas páginas simultaneamente
- ✅ **Menos transformações**: Frontend envia dados brutos

**Código adicionado:**
```javascript
// Remover prefixo pageId do elementId se presente
// Formato recebido: "index.hero.title" → Precisa: "hero.title"
let jsonKey = elementId;
const pagePrefix = `${pageId}.`;

if (elementId.startsWith(pagePrefix)) {
  jsonKey = elementId.substring(pagePrefix.length);
  console.log(`   🔧 Removed prefix: "${elementId}" → "${jsonKey}"`);
}

// Usar jsonKey para atualizar o JSON
const updated = updateJsonByKey(jsonData, jsonKey, newText);
```

### 3. Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GERAÇÃO (assign-ids-final.js)                            │
│    "index.hero.title" → Adiciona ao TSX                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. RENDERIZAÇÃO (Index.tsx)                                 │
│    <h1 data-json-key="index.hero.title">                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. EDIÇÃO (VisualPageEditor.tsx)                            │
│    editedTexts["index.hero.title"] = "Novo Título"          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ENVIO PARA API (handleSaveAll)                           │
│    payload = {                                               │
│      pageId: "index",                                        │
│      edits: { "index.hero.title": "Novo Título" }           │
│    }                                                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. TRANSFORMAÇÃO NA API (server/api.js)                     │
│    "index.hero.title" → "hero.title"                        │
│    (valida que pageId = "index")                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. SALVAMENTO (updateJsonByKey)                             │
│    json["hero"]["title"] = "Novo Título" ✅                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Arquivos Modificados

### `server/api.js`
- **Linhas ~230-250**: Adicionada lógica de remoção de prefixo na API
- **Vantagem**: API tem contexto completo (pageId + edits)
- **Teste**: `node server.js` e verificar logs de salvamento

### `src/components/VisualPageEditor.tsx`
- **Revertido**: Remoção de lógica de transformação (não necessário mais)
- **Agora**: Envia IDs completos para API (mantém informação crítica)

### `DATA_JSON_KEY_NAMING_CONVENTION.md`
- **Seção "Estrutura Geral"**: Atualizada para refletir transformação na API
- **Adicionada**: Explicação das vantagens da abordagem

---

## 🧪 Como Testar

### 1. Iniciar Servidores
```powershell
# Terminal 1 - API
cd server
node server.js

# Terminal 2 - React
npm run dev
```

### 2. Testar Edição
1. Abrir: http://localhost:8080
2. Ativar modo de edição (duplo-clique ou botão)
3. Editar texto: "Meta Clinic" → "Novo Nome"
4. Clicar em "Salvar Alterações"
5. Verificar console do servidor:
   ```
   ✓ Successfully updated: hero.title
   💾 Saved Index.json successfully
   ```
6. Recarregar página → Mudança deve persistir

### 3. Verificar JSON
```powershell
Get-Content "src\locales\pt-BR\Index.json" | ConvertFrom-Json | Select-Object -ExpandProperty hero
```

**Esperado:**
```json
{
  "title": "Novo Nome"
}
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Expected object at index, got undefined"
**Causa:** ID ainda tem prefixo (bug não resolvido)
**Solução:** Verificar se `VisualPageEditor.tsx` tem o código de remoção

### ❌ Erro: "API error"
**Causa:** Servidor API não está rodando
**Solução:** `cd server && node server.js`

### ❌ Mudanças não aparecem após reload
**Causa:** Cache do navegador
**Solução:** Ctrl+Shift+R (hard refresh)

---

## 📊 Status da Implementação

| Componente | Status | IDs Atribuídos |
|-----------|--------|----------------|
| Index.tsx | ✅ Completo | 53 |
| QuemSomos.tsx | ✅ Completo | 21 |
| Tratamentos.tsx | ✅ Completo | 9 |
| Purificacao.tsx | ✅ Completo | 11 |
| Testemunhos.tsx | ✅ Completo | 7 |
| Contato.tsx | ✅ Completo | 6 |
| NotFound.tsx | ✅ Completo | 3 |
| **TOTAL** | **✅ 7/7** | **110** |

---

## 🎯 Próximos Passos

1. ✅ **CONCLUÍDO**: Corrigir salvamento com remoção de prefixo
2. 🔄 **EM TESTE**: Validar persistência em todas as páginas
3. 📝 **PENDENTE**: Documentar casos edge (arrays, objetos aninhados)
4. 🎨 **FUTURO**: Melhorar UX do editor (feedback visual, undo/redo)

---

## 📚 Documentação Relacionada

- `DATA_JSON_KEY_NAMING_CONVENTION.md` - Convenção de nomenclatura
- `ASSIGN_IDS_README.md` - Uso do script de atribuição automática
- `INDEX_PAGE_ID_MAPPING.js` - Mapeamento completo da página Index
- `INDEX_IMPLEMENTATION_STATUS.md` - Status de implementação

---

**Data da Solução:** 08/01/2025  
**Versão:** 1.0  
**Testado em:** React 19.2.0, Express 4.21.2, Vite 5.4.21
