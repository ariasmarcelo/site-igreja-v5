# 📦 Documentação Arquivada

Esta pasta contém documentos de **processos já concluídos** ou **sistemas substituídos**, mantidos apenas como **histórico**.

---

## ⚠️ Importante

**Não use estes documentos como referência para o sistema atual!**

Eles refletem estados anteriores do projeto e podem conter informações desatualizadas ou incorretas para a implementação atual.

---

## 📋 Documentos Arquivados

### Migrações Concluídas

| Documento | Data | Descrição |
|-----------|------|-----------|
| `SHARED-FOOTER-MIGRATION.md` | Nov 2025 | Processo de migração do footer para sistema compartilhado (`__shared__`) |
| `SHARED-FOOTER-MIGRATION-COMPLETE.md` | Nov 2025 | Resumo da conclusão da migração de footer |
| `MIGRATION-GRANULAR.md` | Nov 2025 | Migração de estrutura monolítica para granular |

### Otimizações Aplicadas

| Documento | Data | Descrição |
|-----------|------|-----------|
| `OPTIMIZATION-SUMMARY.md` | Nov 2025 | Otimizações de performance aplicadas (code splitting, memoization) |

### Sistemas Descontinuados

| Documento | Data | Descrição |
|-----------|------|-----------|
| `SISTEMA_VERSIONAMENTO.md` | 2024 | Sistema antigo de versionamento com `page_history` table (não mais usado) |
| `GRANULAR-FALLBACK-SYSTEM-V1.md` | Nov 2025 | Versão 1 do sistema de fallback (substituída pela V2) |

### Limpeza de Estilos

| Documento | Data | Descrição |
|-----------|------|-----------|
| `INLINE-STYLES-CLEANUP-PLAN.md` | Nov 2025 | Plano de remoção de estilos inline (✅ concluído) |
| `STYLES-RESTORATION-SUMMARY.md` | Nov 2025 | Resumo da restauração de estilos do Git (✅ concluído) |
| `FIX-VISUAL-EDITOR-STYLES.md` | Nov 2025 | Correção do salvamento de estilos no editor visual (✅ concluído) |

### Scripts Obsoletos

| Documento | Data | Descrição |
|-----------|------|-----------|
| `README-CAPTURE-STYLES.md` | 2024 | Captura manual de estilos via DevTools (não mais necessário) |
| `README-CAPTURE-ALL-STYLES.md` | 2024 | Captura em lote de estilos (script descontinuado) |

### Procedimentos Antigos

| Documento | Data | Descrição |
|-----------|------|-----------|
| `SPLIT_TEXTS.md` | 2024 | Procedimento para dividir campos de texto (não mais usado com sistema atual) |

---

## 🔍 Por Que Arquivar?

Documentos são arquivados quando:

1. **✅ Processo Concluído**
   - Migrações de dados finalizadas
   - Refatorações completadas
   - Features implementadas

2. **🔄 Sistema Substituído**
   - Nova versão implementada (ex: V1 → V2)
   - Arquitetura mudou
   - Abordagem diferente adotada

3. **📦 Feature Removida**
   - Funcionalidade descontinuada
   - Script não mais necessário
   - Processo automatizado

## 📚 Documentação Atual

Para informações atualizadas, consulte:

- **README.md** - Setup e comandos principais
- **COPILOT-INSTRUCTIONS.md** - Contexto completo do projeto
- **docs/INDEX.md** - Índice completo da documentação
- **docs/GRANULAR-FALLBACK-SYSTEM-V2.md** - Sistema de dados atual

---

## 🗄️ Política de Arquivamento

### Quando Arquivar

✅ Arquive quando:
- Processo descrito foi 100% concluído
- Sistema foi substituído por versão mais nova
- Feature não existe mais no projeto

❌ Não arquive se:
- Ainda pode ser útil como referência
- Contém informações técnicas relevantes
- Pode ser necessário no futuro

### Como Arquivar

1. Mova arquivo para `docs/_archived/`
2. Adicione nota no topo do documento:
   ```markdown
   > **⚠️ DOCUMENTO ARQUIVADO**
   > Este documento foi arquivado em [data] porque [motivo].
   > Ver [documento atual] para informações atualizadas.
   ```
3. Atualize `docs/INDEX.md` listando o documento arquivado

---

**Última atualização:** 14 de novembro de 2025
