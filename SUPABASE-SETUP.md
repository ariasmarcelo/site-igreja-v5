# 🗄️ Configuração do Supabase

> **⚠️ DOCUMENTO PARCIALMENTE DESATUALIZADO**
> 
> Este documento refere-se ao sistema antigo que usava tabelas `page_contents` e `page_styles`.
> 
> **Sistema atual (2025):** Usa tabela `text_entries` com estrutura granular (um registro por campo).
> 
> Para informações atualizadas sobre a arquitetura, veja:
> - **COPILOT-INSTRUCTIONS.md** - Seção "Arquitetura do Sistema"
> - **docs/GRANULAR-FALLBACK-SYSTEM-V2.md** - Sistema completo de dados
> 
> Manter este documento apenas como referência histórica para a estrutura SQL básica.

---

## 1. Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado)
4. Crie um novo projeto:
   - **Name**: `igreja-metatron` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: São Paulo (mais próximo do Brasil)
5. Aguarde ~2 minutos (criando infraestrutura)

---

## 2. Criar Tabelas

Após o projeto criado, vá em **SQL Editor** e execute:

```sql
-- Tabela para armazenar JSONs (textos das páginas)
CREATE TABLE page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para armazenar CSS (estilos das páginas)
CREATE TABLE page_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT UNIQUE NOT NULL,
  css TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_page_contents_page_id ON page_contents(page_id);
CREATE INDEX idx_page_styles_page_id ON page_styles(page_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_contents_updated_at
    BEFORE UPDATE ON page_contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_styles_updated_at
    BEFORE UPDATE ON page_styles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. Configurar Políticas de Segurança (RLS)

Por padrão, o Supabase bloqueia acesso. Vamos liberar para seu domínio:

```sql
-- Habilitar Row Level Security
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_styles ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode LER (para exibir no site)
CREATE POLICY "Allow public read access"
  ON page_contents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access"
  ON page_styles FOR SELECT
  TO public
  USING (true);

-- Política: Apenas requisições autenticadas podem ESCREVER
-- (vamos configurar autenticação depois)
CREATE POLICY "Allow authenticated write access"
  ON page_contents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated write access"
  ON page_styles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

---

## 4. Obter Credenciais

Vá em **Settings** → **API**:

Você vai precisar de:
- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (chave longa)
- **service_role key**: (para admin panel - mantenha secreta!)

---

## 5. Adicionar ao Projeto

Copie essas variáveis e anote:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_KEY=sua_chave_service_role_aqui
```

---

## 6. Popular Dados Iniciais (Opcional)

Execute este script para importar seus JSONs atuais:

```sql
-- Exemplo: Inserir página Index
INSERT INTO page_contents (page_id, content)
VALUES ('Index', '{"seu": "json", "aqui": "..."}');

-- Exemplo: Inserir CSS da página Index
INSERT INTO page_styles (page_id, css)
VALUES ('Index', '/* seu CSS aqui */');
```

Ou vamos criar um script Node.js para fazer isso automaticamente!

---

## ✅ Pronto!

Depois de seguir esses passos, me informe e eu vou:
1. Instalar o cliente Supabase no projeto
2. Modificar a API para usar o Supabase
3. Modificar o frontend para buscar do Supabase
4. Criar script de migração dos dados atuais

---

## 📝 Resumo

**O que você precisa fazer AGORA**:
1. ✅ Criar conta no Supabase (2 min)
2. ✅ Criar projeto (2 min espera)
3. ✅ Executar SQL das tabelas (1 min)
4. ✅ Executar SQL das políticas (1 min)
5. ✅ Copiar as 3 chaves (1 min)

**Total**: ~7 minutos de trabalho

**Depois eu faço**:
- Integrar tudo no código
- Migrar dados existentes
- Testar funcionamento

Bora começar? 🚀
