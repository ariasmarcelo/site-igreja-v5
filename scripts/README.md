# 📚 Scripts de Automação do Sistema de Edição Visual

Este diretório contém **9 scripts** automatizados para gerenciar os atributos `data-json-key` que conectam elementos visuais ao conteúdo editável.

> � **[DOCUMENTAÇÃO COMPLETA](./DOCUMENTACAO_SCRIPTS.md)** ← Guia detalhado com:
> - Explicação completa de cada script
> - Quando e por que rodar cada um
> - Exemplos práticos e casos de uso
> - Troubleshooting e solução de problemas
> - Fluxos de trabalho recomendados

---

## 🚀 Quick Start

```bash
# Desenvolvimento normal (IDs verificados automaticamente a cada 24h)
pnpm dev

# Correção completa manual (textos + arrays)
node scripts/fix-all-keys.cjs

# Atribuir IDs em nova página
node scripts/assign-ids-final.js --page=NovaPage --dry-run  # Preview
node scripts/assign-ids-final.js --page=NovaPage            # Aplicar

# Limpeza de backups antigos (mantém 5 mais recentes)
node scripts/clean-all-backups.cjs
```

---

## � Scripts Principais (Resumo)

| Script | Descrição | Uso | Frequência |
|--------|-----------|-----|------------|
| **init-assign-ids.js** | Verificação automática de IDs | Automático (`pnpm dev`) | Diário |
| **assign-ids-final.js** ⭐ | Atribuição inteligente de IDs | Manual ou via init | Semanal |
| **fix-all-keys.cjs** | Script mestre (textos + arrays) | Manual | Mensal |
| **fix-all-texts.js** | Corrige elementos `{texts.xxx}` | Via fix-all-keys | Raro |
| **fix-all-maps.js** | Corrige arrays `.map()` | Via fix-all-keys | Raro |
| **clean-all-backups.cjs** | Limpa backups antigos | Manual | Mensal |

**Scripts Históricos** (não usar):
- `assign-ids-smart.js` (v2 - obsoleto)
- `assign-unique-ids.js` (v1 - obsoleto)
- `fix-map-arrays.js` (v1 - obsoleto)

---

## 🎯 O Que São os Scripts?

### Problema
```jsx
// Elemento não-editável (sem data-json-key)
<h1>{texts.hero.title}</h1>
```

### Solução
```jsx
// Elemento editável no Admin Panel (/436F6E736F6C45)
<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>
```

### Como Funciona
1. Scripts detectam `{texts.xxx}` no código
2. Encontram o elemento JSX pai
3. Validam se path existe no JSON correspondente
4. Injetam `data-json-key="pageName.section.property"`
5. Admin Panel usa esse atributo para permitir edição inline

**Resultado**: **171 elementos editáveis** em 8 páginas 🎉

---

## 📖 Documentação Por Script

### 1. **init-assign-ids.js** (Automático)
- ✅ Roda automaticamente via `pnpm dev`
- 🕐 Executa a cada 24h (ou quando `.ids-assigned` não existe)
- 🎯 Chama `assign-ids-final.js` se necessário
- ⚡ Não bloqueia dev server

### 2. **assign-ids-final.js** ⭐ (Principal)
- 🧠 Busca reversa inteligente (encontra elemento pai mais próximo)
- 🗂️ Suporta multi-linha e atributos complexos
- 🔢 Detecta arrays com `.map()` e adiciona índices `[0]`, `[1]`
- ✅ Valida paths contra arquivos JSON
- 🔒 Idempotente (pode rodar múltiplas vezes)

**Opções**:
```bash
--dry-run       # Preview sem modificar
--page=Name     # Processar apenas uma página
--verbose       # Modo debug detalhado
```

### 3. **fix-all-keys.cjs** (Script Mestre)
- 🚀 Executa `fix-all-texts.js` + `fix-all-maps.js`
- 📊 Relatório consolidado
- 🔧 Use quando muitos elementos não aparecem no editor

### 4. **fix-all-texts.js**
- 🔍 Detecta: `{texts.xxx}`, `dangerouslySetInnerHTML`, atributos
- ✅ Sempre atualiza (garante consistência total)
- 📦 Cobertura: 127 elementos

### 5. **fix-all-maps.js**
- 🗺️ Detecta arrays com `.map()`
- 🔢 Gera índices dinâmicos `[${i}]`
- 🎯 Distingue objetos vs strings
- 📦 Cobertura: 44 elementos em arrays

### 6. **clean-all-backups.cjs**
- 🗑️ Remove backups antigos
- 💾 Mantém 5 mais recentes
- 📂 Processa `src/locales/pt-BR/` e `src/styles/pages/`

---

## 🔄 Integração Automática

```bash
# Ao rodar pnpm dev:
pnpm dev
  ↓
predev (package.json)
  ↓
init-assign-ids.js
  ↓ (se passou 24h)
assign-ids-final.js
  ↓
vite (dev server)
```

---

## ✅ Recursos Comuns

- ✅ **Idempotentes**: Podem rodar múltiplas vezes sem problemas
- 🔒 **Backups**: Criados automaticamente antes de modificações
- 👁️ **Dry-run**: Preview sem modificar (`--dry-run`)
- 🐛 **Verbose**: Modo debug (`--verbose`)
- 🎯 **Filtros**: Processar páginas específicas (`--page=Name`)

---

## � Quando Executar Manualmente

**Situações que requerem execução manual**:

| Situação | Script | Comando |
|----------|--------|---------|
| Nova página criada | assign-ids-final.js | `node scripts/assign-ids-final.js --page=Nome` |
| Elementos não-editáveis | fix-all-keys.cjs | `node scripts/fix-all-keys.cjs` |
| Grande refatoração | fix-all-keys.cjs | `node scripts/fix-all-keys.cjs` |
| Limpeza de espaço | clean-all-backups.cjs | `node scripts/clean-all-backups.cjs` |
| Forçar verificação | assign-ids-final.js | `node scripts/assign-ids-final.js` |

---

## � Estatísticas do Projeto

**171 elementos editáveis** distribuídos em:

| Página | Elementos Simples | Arrays | Total |
|--------|------------------|--------|-------|
| Index.tsx | 23 | 12 | 35 |
| QuemSomos.tsx | 18 | 8 | 26 |
| Purificacao.tsx | 31 | 6 | 37 |
| Testemunhos.tsx | 15 | 4 | 19 |
| Tratamentos.tsx | 22 | 7 | 29 |
| Contato.tsx | 12 | 5 | 17 |
| Admin.tsx | 6 | 2 | 8 |
| **TOTAL** | **127** | **44** | **171** |

---

## 📝 Convenção de IDs

### Elementos Diretos
```jsx
<h1 data-json-key="pageName.section.property">
  {texts.section.property}
</h1>
```

### Arrays de Strings
```jsx
{texts.items.map((item, i) => (
  <li data-json-key={`pageName.items[${i}]`}>{item}</li>
))}
```

### Arrays de Objetos
```jsx
{texts.cards.map((card, i) => (
  <div key={i}>
    <h3 data-json-key={`pageName.cards[${i}].title`}>{card.title}</h3>
    <p data-json-key={`pageName.cards[${i}].description`}>{card.description}</p>
  </div>
))}
```

---

## 🎯 Objetivos Alcançados

✅ Todos os elementos editáveis têm `data-json-key`  
✅ Scripts idempotentes (execução segura)  
✅ Integração automática na subida dos servidores  
✅ Relatórios detalhados e informativos  
✅ Backups automáticos  
✅ Cobertura completa do projeto (171 elementos)  

---

## 💡 Dicas

1. **Modo silencioso**: Use `--silent` para execução rápida sem output detalhado
2. **Verificação rápida**: Execute `npm run fix-keys` após grandes mudanças
3. **Logs completos**: Execute sem `--silent` para debug e análise
4. **Backups**: Os backups são sobrescritos a cada execução - não se acumulam

---

## 🚨 Solução de Problemas

### Script não encontra elementos
- Verifique se o padrão `texts.` está sendo usado
- Confirme que não há typos no código

### Muitas alterações mesmo após múltiplas execuções
- Verifique se há conflitos com outros processos
- Execute com debug ativado para ver comparações

### Backups acumulando
- Normal - são sobrescritos a cada execução
- Pode apagar manualmente: `rm src/pages/*.backup*`

---

**Última atualização**: Novembro 2025  
**Versão**: 2.0 (Idempotente)

---

##  Troubleshooting

### Problema: Elemento n�o aparece no Admin Panel
```bash
# 1. Verificar console do browser (F12)
# 2. Executar corre��o completa
node scripts/fix-all-keys.cjs

# 3. Se persistir, processar p�gina espec�fica com verbose
node scripts/assign-ids-final.js --page=PageName --verbose
```

### Problema: Edi��o n�o salva
**Causa**: JSON path incorreto ou arquivo n�o existe
```bash
# Verificar se JSON existe em src/locales/pt-BR/PageName.json
# Reprocessar com valida��o
node scripts/assign-ids-final.js --page=PageName
```

### Problema: Muitos backups ocupando espa�o
```bash
node scripts/clean-all-backups.cjs
```

---

##  Recursos Adicionais

-  **[DOCUMENTACAO_SCRIPTS.md](./DOCUMENTACAO_SCRIPTS.md)** - Guia completo detalhado
-  **Admin Panel**: http://localhost:8080/436F6E736F6C45
-  **JSONs**: `src/locales/pt-BR/*.json`
-  **CSS**: `src/styles/pages/*.css`
-  **Backups**: Autom�ticos (5 mais recentes)

---

##  Checklist de Uso

**Di�rio**:
- [x] `pnpm dev` (autom�tico)

**Semanal** (ap�s mudan�as):
- [ ] `node scripts/assign-ids-final.js --dry-run`
- [ ] `node scripts/assign-ids-final.js`

**Mensal**:
- [ ] `node scripts/fix-all-keys.cjs`
- [ ] `node scripts/clean-all-backups.cjs`

**Ap�s criar p�gina**:
- [ ] Criar `src/pages/PageName.tsx`
- [ ] Criar `src/locales/pt-BR/PageName.json`
- [ ] `node scripts/assign-ids-final.js --page=PageName`
- [ ] Testar no Admin Panel

---

** �ltima Atualiza��o**: 08/11/2025  
** Status**: Todos os scripts funcionais  
** Cobertura**: 171/171 elementos (100%)  
** Admin Panel**: /436F6E736F6C45
