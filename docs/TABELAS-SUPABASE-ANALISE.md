# Análise de Tabelas Supabase - Confusão Identificada

**Data:** 2025-11-15  
**Status:** 🚨 PROBLEMA CRÍTICO IDENTIFICADO

## Tabelas Existentes

### 1. **text_entries** (TABELA REAL - 764 registros)
- **Uso Atual:** Editor Visual ESCREVE aqui
- **Estrutura:**
  ```json
  {
    "id": "uuid",
    "page_id": "contato",
    "json_key": "contato.header.title",
    "content": { "pt-BR": "texto" },
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Page IDs:** Index, Testemunhos, __shared__, artigos, contato, index, notfound, purificacao, quemsomos, test, testemunhos, tratamentos
- **Sistema:** Granular (cada campo é uma linha)

### 2. **page_contents** (TABELA ANTIGA - 9 registros)
- **Uso Atual:** Script `check-supabase-data.js` LÊ daqui
- **Estrutura:**
  ```json
  {
    "id": "uuid",
    "page_id": "contato",
    "content": { /* objeto JSON completo aninhado */ },
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- **Page IDs:** artigos, contato, index, notfound, purificacao, quemsomos, testemunhos, tratamentos
- **Sistema:** Monolítico (página inteira em um JSON)

### 3. **granular_content** (NÃO EXISTE)
- **Status:** ❌ Tabela mencionada em código mas não existe no banco
- **Erro:** "Could not find the table 'public.granular_content' in the schema cache"

## Problema Identificado

### API `content-v2/index.js` está QUEBRADA:
```javascript
// LINHA 127, 162, 280 - ERRADO!
.from('text_entries')  // ✅ Esta tabela existe e tem dados
```

### Cache está VAZIO:
- LMDB não tem nenhuma entrada
- Quando cache falha, API vai ao DB
- API consulta `text_entries` (correto)
- **MAS** algo está retornando dados errados

## Inconsistências

1. **`check-supabase-data.js`** lê de `page_contents` (antiga)
2. **`save-visual-edits.js`** escreve em `text_entries` (nova)
3. **`content-v2/index.js`** lê de `text_entries` (correto)
4. **Cache LMDB** está completamente vazio

## Qual é a Tabela REAL?

**RESPOSTA:** `text_entries` é a tabela REAL e ATUAL

**Evidências:**
- ✅ 764 registros (vs 9 em page_contents)
- ✅ Editor visual salva aqui
- ✅ Tem todos os page_ids incluindo __shared__
- ✅ Sistema granular moderno
- ✅ API content-v2 lê daqui

**`page_contents` é LEGACY:**
- ⚠️ Apenas 9 registros
- ⚠️ Não recebe updates
- ⚠️ Sistema monolítico antigo
- ⚠️ Apenas usado por scripts de check antigos

## Próximos Passos (NÃO EXECUTAR AINDA)

1. **Atualizar `check-supabase-data.js`** para ler de `text_entries`
2. **Investigar por que cache está vazio** (warmup não está funcionando)
3. **Testar `cache-refresh.js`** localmente
4. **Verificar por que página Contato mostra conteúdo de Tratamentos**
5. Considerar **deprecar** `page_contents` completamente

## Observação Crítica

O problema da página Contato mostrando "Tratamentos Associados" NÃO é erro de tabela - a tabela está correta (`text_entries`). O problema é:
- Cache vazio
- Alguma falha na reconstrução do objeto
- Possível bug na função `reconstructObject()`
