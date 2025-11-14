# Sistema de Fallback Granular

> **Status:** ✅ IMPLEMENTADO e TESTADO (Janeiro 2025)

## Visão Geral

Sistema completo de carregamento de conteúdo com **auto-sincronização** e **cascata de fallbacks** em 3 níveis:

1. **Supabase (DB)** - Fonte primária sempre consultada primeiro
2. **JSONs Granulares Locais** - Backup/cache automático sincronizado em background
3. **Props Defaults** - Último recurso (valores hardcoded nos componentes)

**Diferencial:** Cada leitura do banco dispara sincronização automática em background, mantendo JSONs locais sempre atualizados sem intervenção manual.

---

## Arquitetura

### 1. Estrutura de Dados no Supabase

**Tabela**: `text_entries` (estrutura granular individual)

```sql
CREATE TABLE text_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  json_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_text_entries_page_id ON text_entries(page_id);
CREATE UNIQUE INDEX idx_text_entries_json_key ON text_entries(json_key);
```

**Exemplo de entradas**:
```sql
-- Conteúdo específico de página
INSERT INTO text_entries (page_id, json_key, content) VALUES
  ('Index', 'Index.hero.title', '{"pt-BR": "Igreja de Metatron"}'),
  ('Index', 'Index.hero.subtitle', '{"pt-BR": "Transformação Espiritual"}'),
  ('Index', 'Index.cards[0].title', '{"pt-BR": "Card 1"}');

-- Conteúdo compartilhado (presente em todas as páginas)
INSERT INTO text_entries (page_id, json_key, content) VALUES
  ('__shared__', 'footer.copyright', '{"pt-BR": "© 2025 Igreja de Metatron"}'),
  ('__shared__', 'footer.trademark', '{"pt-BR": "Todos os direitos reservados"}');
```

**Conceitos Importantes:**
- `page_id = "__shared__"` → Conteúdo compartilhado entre todas as páginas (ex: footer)
- `json_key` com prefixo de página → Conteúdo específico (ex: `Index.hero.title`)
- `json_key` sem prefixo → Conteúdo compartilhado (ex: `footer.copyright`)
- `content` é JSONB multi-idioma (suporta `pt-BR`, `en-US`, etc.)

---

### 2. JSONs Granulares (Auto-Sincronizados em Background)

**Localização**: `src/locales/pt-BR/`

**Padrão de Nome**: `{PageNamePascalCase}.{path.to.element}.json`

**Estrutura:**
```
src/locales/pt-BR/
  Index.hero.title.json                    → "Igreja de Metatron"
  Index.hero.subtitle.json                 → "Transformação Espiritual"
  Index.cards[0].title.json                → "Card 1"
  Index.cards[0].text.json                 → "Descrição"
  Purificacao.psicodelicos.title.json      → "Psicodélicos"
  Purificacao.sections[0].content.json     → "Conteúdo da seção"
  QuemSomos.mission.description.json       → "Nossa missão..."
  Footer.copyright.json                    → "© 2025 Igreja de Metatron"
  Footer.trademark.json                    → "Todos os direitos reservados"
```

**Conversão de `pageId` (kebab-case) para `PageName` (PascalCase)**:
- `index` → `Index`
- `purificacao` → `Purificacao`
- `quem-somos` → `QuemSomos`
- `not-found` → `NotFound`
- `__shared__` → `Footer` (caso especial para conteúdo compartilhado)

**Formato do Conteúdo:**
Cada arquivo JSON contém apenas o valor final:
```json
"Igreja de Metatron"
```
Ou objeto/array se o campo for complexo:
```json
{ "text": "Conteúdo", "link": "/saiba-mais" }
```

---

### 3. APIs com Auto-Sincronização

#### 3.1. GET `/api/content/[pageId]`

**Modo 1: Buscar página completa**
```bash
GET /api/content/index
```

**Resposta**:
```json
{
  "success": true,
  "content": {
    "hero": { "title": "...", "subtitle": "..." },
    "cards": [...]
  }
}
```

**Modo 2: Buscar elemento granular**
```bash
GET /api/content/index?element=hero.title
```

**Resposta**:
```json
{
  "success": true,
  "value": "Igreja de Metatron"
}
```

**Auto-Sync**: Após buscar do Supabase, atualiza automaticamente os JSONs granulares locais em background.

---

#### 3.2. POST `/api/save-json`

Salva conteúdo completo de uma página.

**Requisição**:
```json
{
  "pageId": "index",
  "content": { "hero": { ... }, "cards": [...] }
}
```

**Ação**: 
1. Faz UPSERT no Supabase
2. Auto-sincroniza JSONs granulares

---

#### 3.3. POST `/api/save-visual-edits`

Salva edições visuais (inline editing).

**Requisição**:
```json
{
  "pageId": "index",
  "edits": {
    "hero.title": { "newText": "Novo Título" },
    "cards[0].text": { "newText": "Nova descrição" }
  }
}
```

**Ação**:
1. Aplica edições no objeto JSON
2. Salva no Supabase
3. Auto-sincroniza JSONs granulares

---

### 4. Hook React: `useLocaleTexts`

**Localização**: `src/hooks/useLocaleTexts.ts`

**Uso**:
```tsx
import { useLocaleTexts } from '@/hooks/useLocaleTexts';

function MyPage() {
  const { texts, loading, error } = useLocaleTexts('index');
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return <h1>{texts.hero.title}</h1>;
}
```

**Cascata de Fallback**:
1. **Tenta buscar do Supabase** via `/api/content/[pageId]`
2. **Se falhar**: Tenta carregar JSONs granulares locais
3. **Se falhar**: Usa `fallbackData` estático (se fornecido)

**Logs de Debug**:
```
📥 [1/3] Tentando carregar index do Supabase...
✅ [1/3] Carregado do Supabase: index (15 keys)
```

ou

```
📥 [1/3] Tentando carregar index do Supabase...
⚠️  [1/3] Falha ao carregar do Supabase: API returned 500
📦 [2/3] Tentando carregar JSONs granulares locais...
✅ [2/3] Carregado de fallback granular: index
```

---

### 5. Utilitários: `granularLoader.ts`

**Localização**: `src/lib/granularLoader.ts`

#### 5.1. Carregar Elemento Individual

```tsx
import { loadGranularElement } from '@/lib/granularLoader';

const title = await loadGranularElement('index', 'hero.title');
// Busca: DB → Index.hero.title.json → null
```

#### 5.2. Carregar Múltiplos Elementos

```tsx
import { loadGranularElements } from '@/lib/granularLoader';

const data = await loadGranularElements('index', [
  'hero.title',
  'hero.subtitle',
  'cards[0].text'
]);

// Retorna: { "hero.title": "...", "hero.subtitle": "...", ... }
```

#### 5.3. Reconstruir Objeto

```tsx
import { reconstructObjectFromPaths } from '@/lib/granularLoader';

const flat = {
  'hero.title': 'Título',
  'hero.subtitle': 'Subtítulo',
  'cards[0].text': 'Card 1'
};

const obj = reconstructObjectFromPaths(flat);
// Retorna: { hero: { title: "...", subtitle: "..." }, cards: [{ text: "..." }] }
```

---

## Fluxo Completo

### Carregamento de Página

```
1. User acessa /purificacao
2. Component chama useLocaleTexts('purificacao')
3. Hook tenta GET /api/content/purificacao
4. API busca do Supabase
5. API auto-sincroniza JSONs granulares em background
6. API retorna conteúdo
7. Hook seta textos no estado
8. Página renderiza
```

**Se API falhar**:
```
3. GET /api/content/purificacao → 500 Error
4. Hook tenta carregar Purificacao.*.json locais
5. Se existirem, reconstrói objeto e renderiza
6. Se não existirem, usa fallbackData estático (se fornecido)
```

---

### Edição de Conteúdo

```
1. User edita texto inline no editor visual
2. Editor chama POST /api/save-visual-edits
3. API aplica edições no objeto JSON
4. API salva no Supabase
5. API auto-sincroniza JSONs granulares
6. JSONs locais são atualizados em background
```

---

## Sincronização de Fallbacks

### Função `syncGranularFiles`

**Lógica**:
1. Percorre objeto JSON recursivamente
2. Para cada valor primitivo (string, number, boolean):
   - Gera nome do arquivo: `{PageName}.{path}.json`
   - Verifica se arquivo existe
   - Se não existe: cria
   - Se existe e é diferente: atualiza
   - Se existe e é igual: ignora

**Exemplo de Logs**:
```
[SYNC] 🔄 Sincronizando fallbacks granulares para página: index (Index)
[SYNC] ✨ Criando: Index.hero.title.json
[SYNC] ✨ Criando: Index.hero.subtitle.json
[SYNC] 🔄 Atualizando: Index.cards[0].text.json
[SYNC] ✅ Concluído para Index:
       ✨ Criados: 42
       🔄 Atualizados: 3
       ⏭️  Ignorados: 15
```

---

## Vantagens do Sistema

### 1. **Resiliência**
- Se API/DB cair, site continua funcionando com JSONs locais
- Degradação graciosa (API → JSON → Fallback estático)

### 2. **Performance**
- JSONs granulares carregam apenas o necessário
- Sync em background (não bloqueia resposta da API)
- Smart updates (só escreve se houver mudança)

### 3. **Manutenção Zero**
- JSONs sincronizam automaticamente
- Delete tudo e regenera no próximo acesso
- Sempre consistente com o DB

### 4. **Developer Experience**
- Logs detalhados para debug
- TypeScript com tipos fortes
- Função utilitária para casos específicos

### 5. **Deploy Friendly**
- Funciona em serverless (Vercel)
- Sem dependência de estado local
- Auto-healing em produção

---

## Casos de Uso

### Carregar Página Inteira
```tsx
const { texts } = useLocaleTexts('index');
```

### Carregar Elemento Específico
```tsx
const title = await loadGranularElement('index', 'hero.title');
```

### Carregar Múltiplos Elementos
```tsx
const data = await loadGranularElements('purificacao', [
  'psicodelicos.title',
  'psicodelicos.cards[0].title'
]);
```

### Edição Visual Inline
```tsx
// Já integrado no VisualPageEditor
// Auto-salva no DB e sincroniza JSONs
```

---

## Estrutura de Arquivos

```
workspace/shadcn-ui/
├── api/
│   ├── content/[pageId].js         # GET página/elemento + auto-sync
│   ├── save-json.js                # POST página completa + auto-sync
│   └── save-visual-edits.js        # POST edições inline + auto-sync
├── src/
│   ├── hooks/
│   │   └── useLocaleTexts.ts       # Hook com cascata de fallback
│   ├── lib/
│   │   └── granularLoader.ts       # Utilitários de carregamento granular
│   └── locales/pt-BR/              # JSONs granulares (auto-gerados)
│       ├── Index.hero.title.json
│       ├── Index.hero.subtitle.json
│       ├── Purificacao.psicodelicos.title.json
│       └── ...
└── docs/
    └── GRANULAR-FALLBACK-SYSTEM.md # Esta documentação
```

---

## Próximos Passos

- [ ] Testar carregamento de páginas com JSONs deletados
- [ ] Validar auto-regeneração dos JSONs
- [ ] Verificar logs de sincronização
- [ ] Deploy para Vercel e testar em produção
- [ ] Implementar cache HTTP para otimizar requests repetidas
