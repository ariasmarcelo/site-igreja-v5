# 🔄 Renomeação Completa: Blog → Artigos

## ✅ Mudanças Realizadas

### 📁 Arquivos Renomeados

| Antes | Depois |
|-------|--------|
| `src/components/BlogEditor.tsx` | `src/components/ArtigosEditor.tsx` |
| `supabase/migrations/20251115_create_blog_posts.sql` | `supabase/migrations/20251115_create_artigos.sql` |
| `supabase/migrations/20251115_insert_blog_posts_samples.sql` | `supabase/migrations/20251115_insert_artigos_samples.sql` |
| `docs/BLOG-SYSTEM-SETUP.md` | `docs/ARTIGOS-SYSTEM-SETUP.md` |

### 🗄️ Tabela do Supabase

**Antes:** `blog_posts`  
**Depois:** `artigos`

**Índices atualizados:**
- `idx_blog_posts_*` → `idx_artigos_*`

**Função/Trigger:**
- `update_blog_posts_updated_at()` → `update_artigos_updated_at()`

### 💻 Código TypeScript/React

#### Interfaces:
- `BlogPost` → `ArtigoPost`

#### Componentes:
- `BlogEditor` → `ArtigosEditor`
- Título do editor: "Editor de Blog" → "Editor de Artigos"

#### Admin Console (src/pages/AdminConsole.tsx):
- Import: `BlogEditor` → `ArtigosEditor`
- Aba: `value="blog"` → `value="artigos"`
- Label: "Blog" → "Artigos"

#### Storage Keys (localStorage):
- `blogEditor_draft_` → `artigosEditor_draft_`
- `blogEditor_scrollPos` → `artigosEditor_scrollPos`
- Comentários sobre "aba blog" → "aba artigos"
- `savedTab === 'blog'` → `savedTab === 'artigos'`
- `localStorage.setItem(STORAGE_KEYS.ADMIN_TAB, 'blog')` → `'artigos'`

#### Queries Supabase:
Todas as referências a `blog_posts` foram substituídas por `artigos`:
- `.from('blog_posts')` → `.from('artigos')`
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` queries

### 📝 Arquivos SQL

**20251115_create_artigos.sql:**
```sql
CREATE TABLE IF NOT EXISTS artigos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  ...
);

CREATE INDEX IF NOT EXISTS idx_artigos_slug ON artigos(slug);
CREATE INDEX IF NOT EXISTS idx_artigos_category ON artigos(category);
...

CREATE OR REPLACE FUNCTION update_artigos_updated_at()
...
```

**20251115_insert_artigos_samples.sql:**
```sql
INSERT INTO artigos (title, slug, excerpt, content, ...) VALUES
('A Jornada da Ascensão Espiritual', ...),
('Neurociência da Meditação', ...),
...

UPDATE artigos SET views = floor(random() * 500 + 50) WHERE published = true;
```

### 📄 Documentação

**docs/ARTIGOS-SYSTEM-SETUP.md:**
- Todas as referências de "blog" substituídas por "artigos"
- Instruções atualizadas para refletir nova nomenclatura
- Tabela, campos e exemplos renomeados

### 🎯 Consistência Mantida

✅ **Interface permanece idêntica** - apenas nomenclatura mudou  
✅ **Funcionalidades preservadas** - nada quebrou  
✅ **Sem erros de TypeScript** - tipos atualizados corretamente  
✅ **localStorage compatível** - novas keys não conflitam  
✅ **SQL executável** - pronto para rodar no Supabase  

## 🚀 Para Ativar

### 1. Executar SQL no Supabase:
```bash
# Copie o conteúdo de:
workspace/shadcn-ui/supabase/migrations/20251115_create_artigos.sql

# Execute no: Supabase Dashboard → SQL Editor
```

### 2. (Opcional) Inserir dados de exemplo:
```bash
# Copie o conteúdo de:
workspace/shadcn-ui/supabase/migrations/20251115_insert_artigos_samples.sql

# Execute no Supabase SQL Editor
```

### 3. Acessar o Editor:
```
http://localhost:3000/admin → Aba "Artigos"
```

## 🔍 Verificação

```bash
# No VS Code Terminal, verificar se não há erros:
cd workspace/shadcn-ui
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String -Pattern "blog_posts|BlogPost|BlogEditor"
```

Não deve retornar nenhum resultado (ou apenas em comentários/strings).

---

**Data:** 15/11/2025  
**Escopo:** Renomeação completa de "blog" para "artigos" em todo o sistema
