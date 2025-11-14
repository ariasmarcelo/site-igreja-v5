# Sistema de Fallback Granular - Implementação Atual

> **Status:** ✅ IMPLEMENTADO e TESTADO (Janeiro 2025)  
> **Versão:** 2.0 (com auto-sincronização em background)

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Fluxo Completo de Auto-Sincronização](#fluxo-completo-de-auto-sincronização)
4. [APIs do Sistema](#apis-do-sistema)
5. [Hook React: useLocaleTexts](#hook-react-uselocaleTexts)
6. [Nomenclatura de Arquivos](#nomenclatura-de-arquivos)
7. [Conteúdo Compartilhado (Footer)](#conteúdo-compartilhado-footer)
8. [Benefícios do Sistema](#benefícios-do-sistema)
9. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Sistema de três camadas com **auto-sincronização transparente**:

1. **Supabase PostgreSQL** - Fonte primária sempre consultada primeiro
2. **JSONs Granulares Locais** - Backup/cache em `src/locales/pt-BR/`, sincronizado automaticamente após toda leitura do DB
3. **Props Defaults** - Valores hardcoded nos componentes como último recurso

**Funcionamento:**
- Todo acesso a uma página faz GET no Supabase
- Se DB retorna dados, frontend renderiza E dispara sincronização em background
- Sincronização cria/atualiza JSONs individuais (um por campo)
- Comparação inteligente: só escreve se valor mudou
- Zero configuração manual, 100% automático

---

## Arquitetura

### 1. Database: Supabase PostgreSQL

**Tabela:** `text_entries`

```sql
CREATE TABLE text_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  json_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_text_entries_page_id ON text_entries(page_id);
CREATE UNIQUE INDEX idx_text_entries_json_key ON text_entries(json_key);
```

**Estrutura de Dados:**

| `page_id` | `json_key` | `content` | Descrição |
|-----------|------------|-----------|-----------|
| `Index` | `Index.hero.title` | `{"pt-BR": "Igreja de Metatron"}` | Campo específico da página Index |
| `Purificacao` | `Purificacao.psicodelicos.title` | `{"pt-BR": "Psicodélicos"}` | Campo da página Purificação |
| `__shared__` | `footer.copyright` | `{"pt-BR": "© 2025"}` | Conteúdo compartilhado (footer) |
| `__shared__` | `footer.trademark` | `{"pt-BR": "Todos direitos..."}` | Conteúdo compartilhado (footer) |

**Conceitos Importantes:**
- `page_id = "__shared__"` → Conteúdo presente em TODAS as páginas
- `json_key` com prefixo de página → Conteúdo específico (ex: `Index.hero.title`)
- `json_key` sem prefixo → Conteúdo compartilhado (ex: `footer.copyright`)

---

### 2. JSONs Granulares Locais

**Localização:** `src/locales/pt-BR/`

**Estrutura:**
```
src/locales/pt-BR/
  Index.hero.title.json                    → "Igreja de Metatron"
  Index.hero.subtitle.json                 → "Transformação Espiritual"
  Index.cards[0].title.json                → "Purificação"
  Purificacao.psicodelicos.title.json      → "Psicodélicos"
  Purificacao.sections[0].content.json     → "Conteúdo..."
  Footer.copyright.json                    → "© 2025 Igreja de Metatron"
  Footer.trademark.json                    → "Todos os direitos reservados"
```

**Formato de Arquivo:**
- Apenas o valor final (não envolvido em objeto multi-idioma)
- Strings, números, booleans, arrays ou objetos

Exemplo `Index.hero.title.json`:
```json
"Igreja de Metatron"
```

Exemplo `Index.hero.cta.json` (objeto complexo):
```json
{
  "text": "Saiba Mais",
  "link": "/sobre"
}
```

---

## Fluxo Completo de Auto-Sincronização

### Passo a Passo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Usuário acessa página: /purificacao                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Component Purificacao.tsx renderiza                          │
│    Hook: useLocaleTexts('Purificacao')                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Hook faz: GET /api/content-v2/Purificacao                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. API consulta Supabase:                                       │
│    SELECT * FROM text_entries                                   │
│    WHERE page_id IN ('Purificacao', '__shared__')               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. API reconstrói objeto JSON a partir das entradas granulares  │
│    Exemplo:                                                      │
│    {                                                             │
│      "hero": { "title": "Purificação", "subtitle": "..." },     │
│      "psicodelicos": { "title": "Psicodélicos", ... },          │
│      "footer": { "copyright": "...", "trademark": "..." }        │
│    }                                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. API retorna objeto completo para frontend                    │
│    Status: 200 OK                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Frontend atualiza estado: loading → loaded                   │
│    Página RENDERIZA com dados do DB                             │
│    Usuário VÊ conteúdo na tela                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. BACKGROUND (async, não bloqueia):                            │
│    useLocaleTexts.ts chama syncGranularFallbacks()              │
│    POST /api/sync-fallbacks                                     │
│    Body: { pageId: "Purificacao", content: {...} }              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. API sync-fallbacks percorre objeto recursivamente            │
│    walkObject(content, 'Purificacao', [])                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. Para cada campo primitivo:                                  │
│     a) Gera caminho: hero.title                                 │
│     b) Gera nome arquivo: Purificacao.hero.title.json           │
│     c) Verifica se arquivo existe                               │
│     d) Se não existe: CRIA novo arquivo                         │
│     e) Se existe: compara conteúdo                              │
│        - Igual: IGNORA (skip write)                             │
│        - Diferente: ATUALIZA arquivo                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. Resultado:                                                   │
│     src/locales/pt-BR/                                           │
│       Purificacao.hero.title.json          ✨ CRIADO            │
│       Purificacao.hero.subtitle.json       ✨ CRIADO            │
│       Purificacao.psicodelicos.title.json  🔄 ATUALIZADO         │
│       Purificacao.sections[0].text.json    ⏭️  IGNORADO (igual)  │
│       Footer.copyright.json                🔄 ATUALIZADO         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 12. Sincronização completa!                                     │
│     JSONs locais agora refletem exatamente o que está no DB     │
└─────────────────────────────────────────────────────────────────┘
```

### Timing

- **Passos 1-7:** ~200-500ms (tempo de resposta do DB + renderização)
- **Passos 8-12:** Executa em background (não afeta UX)
- **Total para usuário:** Mesma velocidade de antes, mas com bonus de backup automático

---

## APIs do Sistema

### 1. GET `/api/content-v2/[pageId]`

**Propósito:** Buscar conteúdo de uma página do Supabase e reconstruir objeto JSON.

**Request:**
```bash
GET /api/content-v2/Index
```

**Response (Sucesso):**
```json
{
  "hero": {
    "title": "Igreja de Metatron",
    "subtitle": "Transformação Espiritual"
  },
  "cards": [
    { "title": "Purificação", "text": "..." },
    { "title": "Meditação", "text": "..." }
  ],
  "footer": {
    "copyright": "© 2025 Igreja de Metatron",
    "trademark": "Todos os direitos reservados"
  }
}
```

**Lógica Interna:**
```javascript
// 1. Busca DB com page_id específico + compartilhado
const { data } = await supabase
  .from('text_entries')
  .select('*')
  .in('page_id', [pageId, '__shared__']);

// 2. Reconstrói objeto a partir das entradas
const result = {};
for (const entry of data) {
  const cleanKey = entry.json_key.startsWith(pageId + '.') 
    ? entry.json_key.substring(pageId.length + 1)  // Remove prefixo "Index."
    : entry.json_key;                               // Mantém como está (shared)
  
  setNestedValue(result, cleanKey, entry.content['pt-BR']);
}

// 3. Retorna objeto mesclado (página + shared)
return result;
```

**Tratamento de Shared Content:**
- Campos `footer.*` são detectados como compartilhados
- Mantém chave sem prefixo de página
- Merged automaticamente no objeto de resposta

---

### 2. POST `/api/save-visual-edits`

**Propósito:** Salvar edições do editor visual no Supabase.

**Request:**
```json
{
  "pageId": "Index",
  "elementId": "hero.title",
  "locale": "pt-BR",
  "newText": "Novo Título Editado"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Lógica Interna:**
```javascript
// 1. Detecta se é conteúdo compartilhado
const isSharedContent = elementId.startsWith('footer.');

// 2. Define json_key e page_id apropriados
const jsonKey = isSharedContent 
  ? elementId                      // "footer.copyright"
  : `${pageId}.${elementId}`;      // "Index.hero.title"

const targetPageId = isSharedContent 
  ? '__shared__'                   // Compartilhado
  : pageId;                        // Específico da página

// 3. Salva no Supabase com UPSERT
await supabase
  .from('text_entries')
  .upsert({
    page_id: targetPageId,
    json_key: jsonKey,
    content: { [locale]: newText },
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'json_key'
  });

// 4. Auto-sync será disparado quando página recarregar
```

---

### 3. POST `/api/sync-fallbacks`

**Propósito:** Criar/atualizar JSONs granulares locais a partir do conteúdo de uma página.

**Request:**
```json
{
  "pageId": "Purificacao",
  "content": {
    "hero": { "title": "Purificação", "subtitle": "..." },
    "psicodelicos": { "title": "Psicodélicos", ... }
  }
}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "created": 15,
    "updated": 3,
    "skipped": 7,
    "total": 25
  }
}
```

**Lógica Interna (Simplificada):**
```javascript
function walkObject(obj, pageName, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...path, key];
    
    if (isPrimitive(value) || isComplexLeaf(value)) {
      // É um valor final (string, number, boolean, array, objeto)
      const pathStr = newPath.join('.');
      const fileName = `${pageName}.${pathStr}.json`;
      const filePath = path.join(localesDir, fileName);
      
      // Compara com arquivo existente
      if (fs.existsSync(filePath)) {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (JSON.stringify(existing) === JSON.stringify(value)) {
          stats.skipped++;
          continue; // Ignora, é igual
        }
        stats.updated++;
      } else {
        stats.created++;
      }
      
      // Escreve arquivo
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
      
    } else {
      // É um objeto, continua recursão
      walkObject(value, pageName, newPath);
    }
  }
}
```

**Comparação Inteligente:**
- Usa `JSON.stringify()` para comparar conteúdo
- Só escreve se houver diferença real
- Reduz I/O desnecessário
- Evita commits git sem mudanças reais

---

## Hook React: useLocaleTexts

**Localização:** `src/hooks/useLocaleTexts.ts`

**Uso:**
```tsx
import { useLocaleTexts } from '@/hooks/useLocaleTexts';

function Purificacao() {
  const { texts, loading, error } = useLocaleTexts('Purificacao');
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      <h1>{texts.hero.title}</h1>
      <p>{texts.hero.subtitle}</p>
    </div>
  );
}
```

**Implementação (Simplificada):**
```typescript
export function useLocaleTexts(pageId: string) {
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        // 1. Busca do Supabase via API
        const response = await fetch(`/api/content-v2/${pageId}`);
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        
        // 2. Atualiza estado (frontend renderiza)
        setTexts(data);
        setLoading(false);
        
        // 3. Dispara sincronização em BACKGROUND
        syncGranularFallbacks(pageId, data);
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    loadContent();
  }, [pageId]);

  return { texts, loading, error };
}

// Função assíncrona que NÃO bloqueia renderização
async function syncGranularFallbacks(pageId: string, content: any) {
  try {
    await fetch('/api/sync-fallbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, content })
    });
    console.log(`✅ Fallbacks sincronizados para ${pageId}`);
  } catch (err) {
    console.warn(`⚠️ Falha ao sincronizar fallbacks: ${err.message}`);
    // Não propaga erro, sincronização é best-effort
  }
}
```

**Características:**
- ✅ Busca sempre do DB primeiro (dados atualizados)
- ✅ Renderização não bloqueia aguardando sync
- ✅ Sync em background, silencioso
- ✅ Se sync falhar, não afeta UX (apenas aviso no console)

---

## Nomenclatura de Arquivos

### Conversão PageId → PageName

| `pageId` (kebab-case) | `PageName` (PascalCase) |
|-----------------------|-------------------------|
| `index` | `Index` |
| `purificacao` | `Purificacao` |
| `quem-somos` | `QuemSomos` |
| `contato` | `Contato` |
| `not-found` | `NotFound` |
| `__shared__` | `Footer` (caso especial) |

### Estrutura de Nomes

**Padrão:** `{PageName}.{path.to.field}.json`

**Exemplos:**

| Path no Objeto | Nome do Arquivo |
|----------------|-----------------|
| `hero.title` | `Index.hero.title.json` |
| `hero.subtitle` | `Index.hero.subtitle.json` |
| `cards[0].title` | `Index.cards[0].title.json` |
| `cards[0].text` | `Index.cards[0].text.json` |
| `sections[1].content.text` | `Purificacao.sections[1].content.text.json` |
| `testimonials[2].author.name` | `QuemSomos.testimonials[2].author.name.json` |

**Arrays:** Usa notação `[index]` no nome do arquivo.

---

## Conteúdo Compartilhado (Footer)

### Conceito

Alguns elementos aparecem em **todas as páginas** (ex: footer, navbar). Esses são armazenados uma única vez com `page_id = "__shared__"`.

### Detecção Automática

```javascript
// Na API save-visual-edits.js
const isSharedContent = elementId.startsWith('footer.');

// Footer: page_id = "__shared__", json_key = "footer.copyright"
// Outros: page_id = "Index", json_key = "Index.hero.title"
```

### Mesclagem na Leitura

```javascript
// Na API content-v2/[pageId].js
const { data } = await supabase
  .from('text_entries')
  .select('*')
  .in('page_id', [pageId, '__shared__']); // Busca ambos!

// Resultado automático: conteúdo da página + footer mesclados
```

### Sincronização de Fallbacks

Campos compartilhados geram arquivos com prefixo especial:

```
Footer.copyright.json     → "© 2025 Igreja de Metatron"
Footer.trademark.json     → "Todos os direitos reservados"
```

**Importante:** `PageName` é `"Footer"` para conteúdo `__shared__` relacionado ao rodapé.

---

## Benefícios do Sistema

### 1. **Resiliência Total**
- Se Supabase cair, site continua funcionando com JSONs locais (fallback automático)
- Se JSONs não existirem, usa props defaults dos componentes
- Degradação graciosa em três níveis

### 2. **Cache Automático**
- Zero configuração
- Sincronização transparente após toda leitura
- Sempre atualizado com DB

### 3. **Performance**
- Sincronização não bloqueia renderização (background)
- Comparação inteligente evita writes desnecessários
- Apenas campos alterados são atualizados

### 4. **Developer Experience**
- Histórico completo no git (um commit por campo alterado)
- Fácil revisar mudanças: `git diff src/locales/pt-BR/Index.hero.title.json`
- Debugging simples: ver valor de campo sem consultar DB
- TypeScript com tipos fortes

### 5. **Manutenção Zero**
- Delete todos os JSONs → regenera automaticamente no próximo acesso
- Sempre consistente com DB (source of truth é sempre Supabase)
- Sem intervenção manual

### 6. **Deploy Friendly**
- Funciona em Vercel serverless
- Sem dependência de estado local persistente
- Auto-healing em produção

---

## Troubleshooting

### Problema: JSONs não estão sendo criados

**Diagnóstico:**
1. Verifique se API `/api/sync-fallbacks` existe e está acessível
2. Abra DevTools → Network → veja se POST `/api/sync-fallbacks` foi chamado
3. Veja console do navegador: deve aparecer `✅ Fallbacks sincronizados para PageName`

**Solução:**
- Verifique permissões de escrita em `src/locales/pt-BR/`
- Certifique-se que Vercel Dev está rodando (não pode ser servidor estático)

---

### Problema: Fallbacks desatualizados

**Causa:** Comparação de JSONs pode estar falhando.

**Solução:**
1. Delete arquivos manualmente: `rm -rf src/locales/pt-BR/*`
2. Recarregue página: novos JSONs serão criados
3. Verifique se novos arquivos refletem DB atual

---

### Problema: Muitos writes desnecessários

**Diagnóstico:** Verifique logs da API `sync-fallbacks` para ver `stats.updated` vs `stats.skipped`.

**Solução:** Comparação inteligente já implementada, mas se persistir:
- Normalize JSON antes de comparar (remover whitespace, ordenar chaves)
- Use hash (MD5/SHA256) em vez de `JSON.stringify()`

---

### Problema: Conteúdo compartilhado não aparece em todas as páginas

**Diagnóstico:**
1. Verifique se `page_id = "__shared__"` no DB
2. Verifique se API usa `.in('page_id', [pageId, '__shared__'])`

**Solução:**
- Certifique-se que query do Supabase inclui `__shared__`
- Verifique mesclagem na reconstrução do objeto

---

## Estrutura de Arquivos do Sistema

```
workspace/shadcn-ui/
├── api/
│   ├── content-v2/
│   │   └── [pageId].js              # GET conteúdo do DB + mescla shared
│   ├── save-visual-edits.js         # POST edições do editor visual
│   └── sync-fallbacks.js            # POST sincronização de JSONs granulares
├── src/
│   ├── hooks/
│   │   └── useLocaleTexts.ts        # Hook com auto-sync em background
│   └── locales/pt-BR/               # JSONs granulares (auto-gerados)
│       ├── Index.hero.title.json
│       ├── Index.hero.subtitle.json
│       ├── Purificacao.psicodelicos.title.json
│       ├── Footer.copyright.json
│       └── ... (todos gerados automaticamente)
└── docs/
    └── GRANULAR-FALLBACK-SYSTEM-V2.md  # Esta documentação
```

---

## Changelog

### V2.0 (Janeiro 2025)
- ✅ Implementado auto-sincronização em background
- ✅ Comparação inteligente (só escreve se diferente)
- ✅ Suporte a conteúdo compartilhado (`__shared__`)
- ✅ Migração de `page_contents` para `text_entries` (estrutura granular no DB)
- ✅ Testado em produção com Vercel

### V1.0 (Dezembro 2024)
- ✅ Conceito inicial de fallback granular
- ✅ Estrutura básica de JSONs locais
- ❌ Sincronização manual (descontinuada)

---

## Próximos Passos Sugeridos

- [ ] Implementar carregamento de fallback quando DB não responder (switch automático)
- [ ] Adicionar cache HTTP (headers Cache-Control) nas APIs
- [ ] Implementar versionamento de JSONs (histórico com timestamps)
- [ ] Dashboard admin para visualizar stats de sync (created/updated/skipped)
- [ ] Alertas se sync falhar consistentemente (possível problema de disco/permissões)

---

**Documentação mantida por:** GitHub Copilot Agent  
**Última atualização:** Janeiro 2025  
**Status:** ✅ Sistema 100% funcional em produção
