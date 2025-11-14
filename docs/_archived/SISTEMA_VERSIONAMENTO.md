# 🕐 Sistema de Versionamento - Implementação

## ✅ Implementado

Sistema completo de versionamento que mantém **5 versões anteriores** de cada página (JSON e CSS).

---

## 📋 Estrutura

### Tabela: `page_history`

```sql
- id (BIGSERIAL PRIMARY KEY)
- page_id (TEXT) - ID da página
- content_type (TEXT) - 'json' ou 'css'
- content (JSONB) - Conteúdo JSON (se content_type = 'json')
- css (TEXT) - Estilos CSS (se content_type = 'css')
- created_at (TIMESTAMPTZ) - Data de criação do backup
- created_by (TEXT) - Usuário que criou (padrão: 'admin')
```

### Trigger Automático

- **Função:** `cleanup_old_versions()`
- **Trigger:** Executa após cada INSERT
- **Comportamento:** Remove versões antigas, mantendo apenas as 5 mais recentes

---

## 🔧 Como Funciona

### 1. Backup Automático

Sempre que você salva:
- **JSON** (conteúdo da página)
- **CSS** (estilos da página)
- **Edições visuais** (textos modificados)

O sistema **cria automaticamente um backup** da versão anterior antes de salvar a nova.

### 2. Limpeza Automática

Após criar cada backup, o trigger remove automaticamente versões antigas, mantendo apenas as **5 mais recentes**.

### 3. Restauração

Você pode restaurar qualquer uma das 5 versões anteriores através dos endpoints da API.

---

## 🌐 Endpoints da API

### Listar Versões

```http
GET /api/history/:pageId/:contentType
```

**Parâmetros:**
- `pageId` - ID da página (ex: "home", "about")
- `contentType` - Tipo: "json" ou "css"

**Resposta:**
```json
{
  "success": true,
  "versions": [
    {
      "id": 123,
      "created_at": "2025-11-08T21:30:00Z",
      "created_by": "admin"
    }
  ]
}
```

### Obter Versão Específica

```http
GET /api/history/:pageId/:contentType/:versionId
```

**Resposta:**
```json
{
  "success": true,
  "version": {
    "id": 123,
    "content": {...},
    "css": "...",
    "created_at": "2025-11-08T21:30:00Z",
    "created_by": "admin"
  }
}
```

### Restaurar Versão

```http
POST /api/restore-version
Content-Type: application/json

{
  "pageId": "home",
  "contentType": "json",
  "versionId": 123
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Versão restaurada com sucesso!",
  "restored_version": 123
}
```

---

## 🚀 Configuração no Supabase

### 1. Executar SQL

No Supabase Dashboard:
1. Vá em **SQL Editor**
2. Cole o conteúdo de `supabase/migrations/create_version_history.sql`
3. Execute

### 2. Verificar Tabela

```sql
SELECT * FROM page_history ORDER BY created_at DESC LIMIT 10;
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Ver histórico da Home

```bash
curl http://localhost:3001/api/history/home/json
```

### Exemplo 2: Restaurar versão anterior

```bash
curl -X POST http://localhost:3001/api/restore-version \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "home",
    "contentType": "json",
    "versionId": 123
  }'
```

---

## ✅ Benefícios

- ✅ **Backup automático** antes de cada edição
- ✅ **Mantém 5 versões** mais recentes
- ✅ **Limpeza automática** de versões antigas
- ✅ **Restauração fácil** via API
- ✅ **Histórico auditável** com timestamps
- ✅ **Zero configuração** - funciona automaticamente

---

## 📊 Monitoramento

### Verificar quantidade de backups

```sql
SELECT 
  page_id, 
  content_type, 
  COUNT(*) as total_versions
FROM page_history
GROUP BY page_id, content_type
ORDER BY page_id, content_type;
```

### Ver últimos backups criados

```sql
SELECT 
  page_id, 
  content_type, 
  created_at,
  created_by
FROM page_history
ORDER BY created_at DESC
LIMIT 20;
```

---

## 🔒 Segurança

- Backups são criados **antes** de salvar nova versão
- Impossível perder dados mesmo em caso de erro
- Trigger garante que nunca acumulam mais de 5 versões
- Timestamps permitem auditoria completa
