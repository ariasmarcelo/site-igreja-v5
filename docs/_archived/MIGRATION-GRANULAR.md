# Migração para Estrutura Granular

## 📋 Resumo

Esta migração transforma a estrutura de dados de **monolítica** (JSON completo por página) para **granular** (uma linha por texto/estilo).

### Estrutura Antiga
```sql
page_contents (page_id, content JSONB)  -- JSON inteiro da página
page_styles (page_id, css TEXT)         -- CSS inteiro da página
```

### Estrutura Nova
```sql
text_entries (json_key UNIQUE, page_id, content JSONB)          -- Um texto por linha
style_entries (json_key UNIQUE, page_id, css_properties JSONB)  -- Um estilo por linha
```

## 🎯 Benefícios

✅ **Isolamento Total**: Alterar um texto/estilo não afeta outros  
✅ **Auto-Discovery**: Sistema detecta automaticamente novas keys no código  
✅ **Manutenibilidade**: Refatorações de TSX não "perdem" dados do DB  
✅ **Performance**: Queries mais rápidas (busca apenas o necessário)  
✅ **Versionamento**: Histórico granular de mudanças  

## 📦 Arquivos da Migração

```
scripts/
  ├── backup-before-migration.js      # 1. Backup dos dados atuais
  ├── run-migration.js                # 2. Executar SQL no Supabase
  └── migrate-to-granular.js          # 3. Migrar dados para nova estrutura

supabase/migrations/
  └── 20251112_create_granular_tables.sql  # Schema das novas tabelas

backups/migration-granular/
  ├── page_contents_[timestamp].json       # Backup de page_contents
  ├── page_styles_[timestamp].json         # Backup de page_styles
  └── migration-summary.json               # Resumo da migração
```

## 🚀 Processo de Migração

### Passo 1: Backup (✅ CONCLUÍDO)
```bash
node scripts/backup-before-migration.js
```
- Baixa todos os dados de `page_contents` e `page_styles`
- Salva em `backups/migration-granular/` com timestamp
- 8 páginas backupeadas com sucesso

### Passo 2: Criar Tabelas no Supabase (⏳ PENDENTE)

**IMPORTANTE**: O Supabase JS client não executa SQL DDL diretamente.

**Opção A - Via Dashboard (Recomendado):**
1. Acesse: https://laikwxajpcahfatiybnb.supabase.co
2. Vá em **SQL Editor**
3. Abra `supabase/migrations/20251112_create_granular_tables.sql`
4. Cole e execute o SQL
5. Verifique que as tabelas `text_entries` e `style_entries` foram criadas

**Opção B - Via CLI (se tiver Supabase CLI instalado):**
```bash
supabase db push
```

### Passo 3: Migrar Dados (⏳ AGUARDANDO PASSO 2)
```bash
node scripts/migrate-to-granular.js
```

Este script:
- Lê dados das tabelas antigas (`page_contents`, `page_styles`)
- **Flatten JSON**: Converte estrutura aninhada em keys planas
  - `{ psicodelicos: { title: "texto" } }` → `"purificacao.psicodelicos.title"`
- **Parse CSS**: Extrai blocos CSS e converte em propriedades JSONB
  - `[data-json-key="x"] { font-size: 2rem; }` → `{ "fontSize": "2rem" }`
- Insere em `text_entries` e `style_entries`
- Gera relatório em `migration-summary.json`

### Passo 4: Atualizar Código (⏳ APÓS PASSO 3)

Arquivos que precisam ser atualizados:
- `server-local/index.js` - APIs para trabalhar com entries granulares
- `src/hooks/useLocaleTexts.ts` - Carregar e reconstruir objeto a partir de entries
- `src/components/VisualPageEditor.tsx` - Salvar cada edição individualmente

## 📊 Exemplo de Transformação

### Antes (Monolítico)
```json
// page_contents
{
  "page_id": "purificacao",
  "content": {
    "psicodelicos": {
      "title": "Trabalhos com Psicodélicos",
      "subtitle": "Jornadas de Expansão Consciencial",
      "intro1": "A Igreja de Metatron oferece..."
    }
  }
}

// page_styles (CSS como string)
{
  "page_id": "purificacao",
  "css": "[data-json-key=\"purificacao.psicodelicos.title\"] { font-size: 2.25rem; }"
}
```

### Depois (Granular)
```json
// text_entries (3 linhas separadas)
{ "json_key": "purificacao.psicodelicos.title", "content": { "pt-BR": "Trabalhos com Psicodélicos" } }
{ "json_key": "purificacao.psicodelicos.subtitle", "content": { "pt-BR": "Jornadas de Expansão..." } }
{ "json_key": "purificacao.psicodelicos.intro1", "content": { "pt-BR": "A Igreja de..." } }

// style_entries (1 linha)
{ 
  "json_key": "purificacao.psicodelicos.title", 
  "css_properties": { "fontSize": "2.25rem", "color": "#ffffff" } 
}
```

## 🔄 Rollback (se necessário)

Se algo der errado, os dados originais estão em:
```
backups/migration-granular/
  ├── page_contents_2025-11-12T19-51-16-429Z.json
  └── page_styles_2025-11-12T19-51-16-429Z.json
```

Para restaurar:
1. Deletar dados das novas tabelas: `DELETE FROM text_entries; DELETE FROM style_entries;`
2. Usar script de restore (a criar se necessário)

## 📝 Notas

- **Compatibilidade**: As tabelas antigas (`page_contents`, `page_styles`) serão mantidas inicialmente
- **Testes**: Testar completamente antes de deletar tabelas antigas
- **Performance**: Indexes criados em `page_id` e `json_key` para queries rápidas
- **Updated_at**: Triggers automáticos atualizam timestamp em cada UPDATE

## ❓ Perguntas Frequentes

**P: E se eu refatorar o TSX e mudar o `data-json-key`?**  
R: A entry antiga fica no DB (órfã). Um script de cleanup pode detectar e listar keys órfãs.

**P: Como adicionar novo texto ao código?**  
R: Basta adicionar `data-json-key` no TSX. O Visual Editor criará a entry automaticamente ao salvar.

**P: Arrays funcionam?**  
R: Sim! `items[0]`, `items[1]` viram keys separadas: `"purificacao.items[0]"`, `"purificacao.items[1]"`
