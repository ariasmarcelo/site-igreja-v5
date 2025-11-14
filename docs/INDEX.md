# 📚 Índice da Documentação - Site Igreja de Metatron

> **Última atualização:** 14 de novembro de 2025

---

## 📖 Documentação Ativa

### Essencial (Leia Primeiro)

| Documento | Descrição | Localização |
|-----------|-----------|-------------|
| **README.md** | Setup inicial, instalação, comandos principais | `./` |
| **COPILOT-INSTRUCTIONS.md** | Instruções completas do projeto, contexto para IA | `./` |
| **GRANULAR-FALLBACK-SYSTEM-V2.md** | Sistema de fallback granular com auto-sincronização | `./docs/` |

### Configuração e Setup

| Documento | Descrição | Localização |
|-----------|-----------|-------------|
| **SUPABASE-SETUP.md** | Configuração do Supabase (⚠️ DESATUALIZADO - ver abaixo) | `./` |
| **DEPLOY-VERCEL.md** | Deploy de APIs serverless no Vercel | `./` |
| **DATA_JSON_KEY_NAMING_CONVENTION.md** | Convenções de nomenclatura para `data-json-key` | `./` |

### Scripts e Ferramentas

| Documento | Descrição | Localização |
|-----------|-----------|-------------|
| **scripts/README.md** | Documentação dos scripts de automação | `./scripts/` |
| **scripts/README-FIX-IDS.md** | Script para verificar/corrigir IDs únicos | `./scripts/` |

### Páginas e Recursos

| Documento | Descrição | Localização |
|-----------|-----------|-------------|
| **docs/ARTIGOS.md** | Sistema de blog e artigos | `./docs/` |
| **docs/API-SERVERLESS-CONFIG.md** | Configuração das APIs serverless | `./docs/` |

---

## 🗄️ Documentação Arquivada

Documentos de processos já concluídos, mantidos apenas como histórico:

| Documento | Motivo do Arquivamento | Localização |
|-----------|------------------------|-------------|
| **SHARED-FOOTER-MIGRATION.md** | Migração de footer compartilhado ✅ CONCLUÍDA | `./docs/_archived/` |
| **SHARED-FOOTER-MIGRATION-COMPLETE.md** | Resumo da migração ✅ CONCLUÍDA | `./docs/_archived/` |
| **OPTIMIZATION-SUMMARY.md** | Otimizações aplicadas ✅ CONCLUÍDAS | `./docs/_archived/` |
| **SISTEMA_VERSIONAMENTO.md** | Sistema antigo de versionamento (não mais usado) | `./docs/_archived/` |
| **INLINE-STYLES-CLEANUP-PLAN.md** | Remoção de estilos inline ✅ CONCLUÍDA | `./docs/_archived/` |
| **STYLES-RESTORATION-SUMMARY.md** | Restauração de estilos ✅ CONCLUÍDA | `./docs/_archived/` |
| **FIX-VISUAL-EDITOR-STYLES.md** | Correção do editor visual ✅ CONCLUÍDA | `./docs/_archived/` |
| **MIGRATION-GRANULAR.md** | Migração para estrutura granular ✅ CONCLUÍDA | `./docs/_archived/` |
| **SPLIT_TEXTS.md** | Procedimento para dividir textos (não mais necessário) | `./docs/_archived/` |
| **GRANULAR-FALLBACK-SYSTEM-V1.md** | Versão antiga do sistema de fallback (substituída pela V2) | `./docs/_archived/` |
| **README-CAPTURE-STYLES.md** | Captura de estilos (script descontinuado) | `./docs/_archived/` |
| **README-CAPTURE-ALL-STYLES.md** | Captura de estilos em lote (script descontinuado) | `./docs/_archived/` |

---

## ⚠️ Documentos que Precisam Atualização

### SUPABASE-SETUP.md

**Problema:** Refere-se a tabelas antigas (`page_contents`, `page_styles`) que não existem mais.

**Estado atual:** Sistema usa `text_entries` com estrutura granular.

**Solução:** Documento precisa ser reescrito com:
- Estrutura da tabela `text_entries`
- Schema atualizado (page_id, json_key, content JSONB)
- Migrations SQL atualizadas
- Sistema de conteúdo compartilhado (`__shared__`)

### DATA_JSON_KEY_NAMING_CONVENTION.md

**Problema:** Referências ao sistema antigo de salvamento (JSONs locais como fonte primária).

**Estado atual:** Sistema usa Supabase como fonte única da verdade, JSONs locais são apenas fallback auto-sincronizado.

**Ação:** Adicionar nota no topo explicando o contexto atual:
- Supabase é fonte primária
- Convenções ainda se aplicam para `data-json-key` nos componentes
- Sistema de fallback granular funciona em background

---

## 🎯 Prioridade de Leitura

Para novos desenvolvedores entrando no projeto:

### 1. Setup Inicial
1. `README.md` - Instalação e comandos básicos
2. `COPILOT-INSTRUCTIONS.md` - Contexto completo do projeto
3. ⚠️ **NÃO USE** `SUPABASE-SETUP.md` (desatualizado) - Ver estrutura diretamente no código ou em COPILOT-INSTRUCTIONS.md

### 2. Entendimento da Arquitetura
1. `docs/GRANULAR-FALLBACK-SYSTEM-V2.md` - Sistema de dados (CRÍTICO)
2. `DATA_JSON_KEY_NAMING_CONVENTION.md` - Convenções de código
3. `docs/API-SERVERLESS-CONFIG.md` - APIs serverless

### 3. Desenvolvimento
1. `scripts/README.md` - Scripts disponíveis
2. `scripts/README-FIX-IDS.md` - Validação de IDs únicos
3. `DEPLOY-VERCEL.md` - Deploy em produção

---

## 📝 Convenções de Documentação

### Quando Criar Novo Documento

✅ **Criar documento quando:**
- Implementar novo sistema/feature complexo
- Processo que será repetido por outras pessoas
- Decisões arquiteturais importantes

❌ **NÃO criar documento para:**
- Mudanças pontuais (use commit messages)
- Correções de bugs simples
- Refatorações internas

### Estrutura Padrão

```markdown
# Título do Documento

> **Status:** ✅ Implementado / 🚧 Em Progresso / ⚠️ Desatualizado
> **Última atualização:** DD/MM/YYYY

## Resumo
[Descrição curta do propósito]

## Contexto
[Por que isso foi necessário]

## Implementação
[Como foi feito, passo a passo]

## Resultado
[Estado final, o que ficou funcionando]

## Próximos Passos (opcional)
[O que pode ser melhorado]
```

### Quando Arquivar Documento

Mova para `docs/_archived/` quando:
- ✅ Processo/migração concluída e não será mais executada
- 🔄 Sistema substituído por outro (manter histórico)
- 📦 Feature removida do projeto

**Importante:** SEMPRE adicione nota no topo explicando por que foi arquivado:
```markdown
> **⚠️ DOCUMENTO ARQUIVADO**
> Este documento refere-se a [processo X] que foi concluído em [data].
> Ver [documento Y] para informações atualizadas.
```

---

## 🔗 Links Úteis

- **Repositório:** https://github.com/ariasmarcelo/site-igreja-v6
- **Produção:** https://ariasmarcelo.github.io/site-igreja-v6/
- **Supabase:** https://laikwxajpcahfatiybnb.supabase.co
- **Vercel Dev Docs:** https://vercel.com/docs/cli

---

**Mantenha este índice atualizado sempre que criar, atualizar ou arquivar documentação!**
