# 📝 Sistema de BLOG/BLOG - Guia de Ativação

## 🔍 Diagnóstico

O **BLOGEditor existe e está funcional**, mas a tabela `BLOG` não foi criada no Supabase.

### O que já funciona:
- ✅ Interface completa de edição (BLOGEditor.tsx - 805 linhas)
- ✅ Editor rico TipTap (formatação, imagens, links, highlights)
- ✅ Sistema de rascunhos com auto-save no localStorage
- ✅ Filtros por categoria, status e busca
- ✅ Páginas públicas: `/BLOG`, `/BLOG/:categoria`, `/BLOG/:slug`
- ✅ Integração com Admin Console (aba "BLOG")

### O que falta:
- ❌ Tabela `BLOG` no Supabase

---

## 🚀 Ativação em 2 Passos

### **Passo 1: Criar Tabela**

Acesse: **Supabase Dashboard → SQL Editor**

Cole e execute:

```sql
-- Criação da tabela BLOG
CREATE TABLE IF NOT EXISTS BLOG (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Igreja Metatron',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_BLOG_slug ON BLOG(slug);
CREATE INDEX IF NOT EXISTS idx_BLOG_category ON BLOG(category);
CREATE INDEX IF NOT EXISTS idx_BLOG_published ON BLOG(published);
CREATE INDEX IF NOT EXISTS idx_BLOG_published_at ON BLOG(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_BLOG_tags ON BLOG USING GIN(tags);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_BLOG_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_BLOG_updated_at
  BEFORE UPDATE ON BLOG
  FOR EACH ROW
  EXECUTE FUNCTION update_BLOG_updated_at();

-- RLS (Row Level Security)
ALTER TABLE BLOG ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON BLOG FOR SELECT
  USING (published = true);

CREATE POLICY "Allow all operations for now"
  ON BLOG FOR ALL
  USING (true) WITH CHECK (true);
```

---

### **Passo 2: Inserir Dados de Exemplo (Opcional)**

4 BLOG publicados + 1 rascunho:

**Ver arquivo completo:** `supabase/migrations/20251115_insert_BLOG_samples.sql`

Ou executar resumido:

```sql
INSERT INTO BLOG (title, slug, excerpt, content, author, category, tags, published) VALUES
('A Jornada da Ascensão Espiritual', 'jornada-ascensao-espiritual', 
 'Compreenda os estágios fundamentais da elevação consciencial.', 
 '<h2>Introdução</h2><p>A ascensão espiritual é um processo profundo...</p>', 
 'Igreja Metatron', 'Desenvolvimento Espiritual', 
 ARRAY['ascensão', 'espiritualidade'], true),

('Neurociência da Meditação', 'neurociencia-meditacao', 
 'Evidências científicas sobre práticas meditativas.', 
 '<h2>Mudanças Neuroplásticas</h2><p>Estudos de neuroimagem...</p>', 
 'Instituto Metatron', 'Conhecimento Esotérico', 
 ARRAY['neurociência', 'meditação'], true);
```

---

## 📍 Como Acessar

### Admin (Edição):
1. Acesse: `http://localhost:3000/admin`
2. Clique na aba **"BLOG"**
3. Funcionalidades:
   - ➕ **Novo Post**: Criar artigo do zero
   - ✏️ **Editar**: Modificar posts existentes
   - 🗑️ **Deletar**: Remover posts
   - 👁️ **Preview**: Visualizar antes de publicar
   - 🔍 **Filtros**: Por categoria, status (publicado/rascunho)
   - 💾 **Auto-save**: Rascunhos salvos automaticamente

### Público (Leitura):
- **Lista geral**: `http://localhost:3000/BLOG`
- **Por categoria**: `http://localhost:3000/BLOG/cura-interior`
- **Post individual**: `http://localhost:3000/BLOG/cura-interior/jornada-ascensao-espiritual`

---

## 🎨 Recursos do Editor

### Formatação:
- Cabeçalhos (H1, H2, H3)
- Negrito, itálico, sublinhado
- Listas (ordenadas e não ordenadas)
- Citações (blockquote)
- Links
- Imagens
- Highlight de texto
- Alinhamento (esquerda, centro, direita, justificado)

### Metadata:
- Título e slug (URL)
- Categoria predefinida
- Tags múltiplas
- Autor (Igreja ou Instituto Metatron)
- Imagem de capa (URL)
- Data de publicação
- Status: Rascunho ou Publicado

### Funcionalidades Avançadas:
- 📝 **Rascunhos persistentes**: Salvos no localStorage, sobrevivem a refresh
- 🔄 **Undo completo**: Desfaz todas mudanças não salvas
- ⚠️ **Alertas de saída**: Avisa sobre mudanças não salvas
- 🔍 **Busca em tempo real**: Filtra por título/conteúdo
- 📊 **Contador de views**: Rastreia visualizações

---

## 🗂️ Estrutura de Arquivos

```
src/
  components/
    BLOGEditor.tsx          # Editor completo (805 linhas)
    TiptapEditor.tsx        # Editor rico de texto
  pages/
    AdminConsole.tsx        # Console admin com aba "BLOG"
    BLOG.tsx             # Listagem pública de BLOG
    BLOGCategoria.tsx    # BLOG por categoria
    ArtigoDetalhes.tsx      # Página individual do artigo

supabase/
  migrations/
    20251115_create_BLOG.sql        # Criação da tabela
    20251115_insert_BLOG_samples.sql # Dados de exemplo
```

---

## 📊 Schema da Tabela

| Campo          | Tipo         | Descrição                        |
|----------------|--------------|----------------------------------|
| id             | UUID         | Chave primária                   |
| title          | TEXT         | Título do artigo                 |
| slug           | TEXT (UNIQUE)| URL-friendly identifier          |
| excerpt        | TEXT         | Resumo para cards                |
| content        | TEXT         | Conteúdo HTML completo           |
| author         | TEXT         | Igreja/Instituto Metatron        |
| category       | TEXT         | Categoria do artigo              |
| tags           | TEXT[]       | Array de tags                    |
| cover_image    | TEXT         | URL da imagem de capa            |
| published      | BOOLEAN      | true = publicado, false = rascunho |
| published_at   | TIMESTAMPTZ  | Data de publicação               |
| created_at     | TIMESTAMPTZ  | Data de criação                  |
| updated_at     | TIMESTAMPTZ  | Última modificação (auto)        |
| views          | INTEGER      | Contador de visualizações        |

---

## ✅ Checklist de Ativação

- [ ] Executar SQL de criação da tabela no Supabase
- [ ] (Opcional) Inserir dados de exemplo
- [ ] Acessar `http://localhost:3000/admin`
- [ ] Clicar na aba "BLOG"
- [ ] Testar criação de novo artigo
- [ ] Verificar se rascunhos são salvos automaticamente
- [ ] Publicar um artigo de teste
- [ ] Acessar `/BLOG` e confirmar visualização pública

---

## 🐛 Troubleshooting

### "Erro ao carregar posts"
➜ Tabela `BLOG` não existe. Execute o SQL do Passo 1.

### "Permission denied for table BLOG"
➜ RLS muito restritivo. Execute a policy "Allow all operations for now" do SQL.

### Editor não aparece na aba BLOG
➜ Verifique se o servidor está rodando na porta 3000.

### Rascunhos não salvam
➜ Verifique se localStorage está habilitado no navegador.

---

## 🎯 Próximos Passos

Após ativar o sistema:
1. Criar BLOG reais
2. Configurar autenticação (substituir policy "Allow all")
3. Adicionar upload de imagens (Supabase Storage)
4. Implementar comentários
5. SEO: meta tags e Open Graph
6. RSS feed

---

**Criado em:** 15/11/2025  
**Versão:** v2.0.0 (sem cache)
