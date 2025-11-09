# Sistema de IDs Únicos para Edição Visual

## 🎯 Problema Resolvido

Anteriormente, o sistema tentava encontrar textos no JSON fazendo busca por conteúdo, o que era frágil e impreciso. Agora cada elemento possui um **ID único** que mapeia diretamente para sua chave no JSON.

## 🔑 Como Funciona

### 1. Mapeamento Automático (useJsonMapping)

Quando uma página é carregada, o hook `useJsonMapping` cria um mapa entre:
- **Textos renderizados** no DOM
- **Chaves correspondentes** no arquivo JSON

Exemplo:
```
Texto: "O Trabalho de Resgate Espiritual"
  ↓
Chave JSON: "hero.title"
  ↓
Elemento HTML: <h1 data-json-key="hero.title">O Trabalho de Resgate Espiritual</h1>
```

### 2. Edição com ID Único

Quando você edita um elemento no modo visual:
- O sistema usa o `data-json-key` como identificador
- Envia para a API: `{ "hero.title": "Novo Título" }`
- A API atualiza **diretamente** a chave no JSON

### 3. Atualização Precisa na API

A API recebe o ID (chave JSON) e:
1. Parseia a chave (ex: `"hero.title"` → `["hero", "title"]`)
2. Navega pelo objeto JSON até a chave específica
3. Atualiza **apenas** aquele valor
4. Cria backup antes de salvar

## 📁 Arquivos Modificados

### Frontend
- **`src/hooks/useJsonMapping.ts`** (NOVO)
  - Mapeia textos para chaves JSON
  - Adiciona `data-json-key` nos elementos

- **`src/pages/Index.tsx`**
  - Usa `useJsonMapping('index', texts)`
  - Garante que elementos tenham IDs únicos

- **`src/components/VisualPageEditor.tsx`**
  - Prioriza `data-json-key` como ID
  - Fallback para IDs baseados em conteúdo
  - Envia chave JSON para a API

### Backend
- **`server/api.js`**
  - Função `updateJsonByKey()` (NOVA)
    - Atualiza JSON usando chave direta
  - Função `updateJsonValues()` (FALLBACK)
    - Para elementos sem `data-json-key`
  - Endpoint `/api/save-visual-edits` melhorado
    - Tenta atualizar por chave JSON primeiro
    - Fallback para busca por texto

## 🔄 Fluxo Completo

```
1. PÁGINA CARREGA
   └─> useJsonMapping cria mapeamento
   └─> Adiciona data-json-key em elementos

2. USUÁRIO ATIVA EDIÇÃO
   └─> VisualPageEditor detecta elementos com data-json-key
   └─> Torna elementos editáveis

3. USUÁRIO EDITA TEXTO
   └─> Salva com ID = data-json-key (ex: "hero.title")

4. CLICK EM "SALVAR MUDANÇAS"
   └─> Envia: { edits: { "hero.title": "Novo Texto" } }

5. API RECEBE REQUISIÇÃO
   └─> Identifica que "hero.title" é uma chave JSON
   └─> Chama updateJsonByKey(jsonData, "hero.title", "Novo Texto")
   └─> Navega: jsonData["hero"]["title"] = "Novo Texto"
   └─> Salva arquivo com backup

6. RESULTADO
   └─> Arquivo JSON físico modificado
   └─> Backup criado automaticamente
   └─> Mudança persiste permanentemente
```

## ✅ Vantagens

1. **Precisão Absoluta**: Não depende de busca por texto
2. **Performance**: Atualização direta, sem varrer todo o JSON
3. **Confiável**: IDs únicos garantem que o elemento certo seja editado
4. **Manutenível**: Fácil debugar (ID = chave JSON)
5. **Escalável**: Funciona com JSONs complexos e aninhados

## 🔍 Exemplo Prático

### JSON Original (Index.json)
```json
{
  "hero": {
    "title": "O Trabalho de Resgate Espiritual",
    "subtitle": "Libertação através da fé"
  },
  "benefits": [
    {
      "title": "Cura Espiritual",
      "description": "Alívio e paz interior"
    }
  ]
}
```

### Elementos Mapeados
```html
<h1 data-json-key="hero.title">O Trabalho de Resgate Espiritual</h1>
<h2 data-json-key="hero.subtitle">Libertação através da fé</h2>
<h3 data-json-key="benefits[0].title">Cura Espiritual</h3>
<p data-json-key="benefits[0].description">Alívio e paz interior</p>
```

### Após Editar "hero.title" para "Nova Mensagem"
```javascript
// API recebe:
{
  pageId: "index",
  edits: {
    "hero.title": "Nova Mensagem"
  }
}

// API executa:
updateJsonByKey(jsonData, "hero.title", "Nova Mensagem")

// Resultado no JSON:
{
  "hero": {
    "title": "Nova Mensagem",  // ✓ ATUALIZADO
    "subtitle": "Libertação através da fé"
  }
}
```

## 🚀 Próximos Passos

1. ✅ Aplicar `useJsonMapping` em todas as páginas:
   - QuemSomos.tsx
   - Contato.tsx
   - Purificacao.tsx
   - Testemunhos.tsx
   - Tratamentos.tsx

2. ✅ Testar edições complexas:
   - Arrays aninhados
   - Objetos profundos
   - Textos com caracteres especiais

3. ✅ Adicionar validação:
   - Verificar se chave JSON existe antes de salvar
   - Alertar usuário se houver erro

## 📝 Notas Técnicas

### Parseamento de Chaves JSON
```javascript
"hero.title"           → ["hero", "title"]
"benefits[0].title"    → ["benefits", "0", "title"]
"data.users[2].name"   → ["data", "users", "2", "name"]
```

### Fallback para Elementos Não Mapeados
Se um elemento não tiver `data-json-key`, o sistema ainda funciona:
- Cria ID baseado em conteúdo
- Usa busca por texto (método antigo)
- Menos preciso, mas funciona
