# 📚 Documentação Completa dos Scripts

Este documento detalha **todos os scripts** desenvolvidos para o sistema de edição visual do site.

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Scripts de Atribuição de IDs](#scripts-de-atribuição-de-ids)
3. [Scripts de Correção](#scripts-de-correção)
4. [Scripts de Manutenção](#scripts-de-manutenção)
5. [Fluxo de Trabalho Recomendado](#fluxo-de-trabalho-recomendado)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral do Sistema

### O Que São os Scripts?

Os scripts automatizam a atribuição e manutenção de **`data-json-key`** em elementos JSX. Esses atributos conectam cada elemento visual do site ao seu conteúdo editável nos arquivos JSON.

### Como Funciona?

```jsx
// ANTES (texto hard-coded)
<h1>{texts.hero.title}</h1>

// DEPOIS (editável visualmente)
<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>
```

Com o `data-json-key`, o **Admin Panel** (`/436F6E736F6C45`) pode:
- ✅ Identificar o elemento na tela
- ✅ Localizar o texto correspondente no JSON
- ✅ Permitir edição inline
- ✅ Salvar mudanças automaticamente

### Estrutura de Dados

```
src/
├── pages/
│   ├── Index.tsx          → Usa {texts.hero.title}
│   ├── QuemSomos.tsx      → Usa {texts.mission.title}
│   └── ...
└── locales/pt-BR/
    ├── Index.json         → {"hero": {"title": "Bem-vindo"}}
    ├── QuemSomos.json     → {"mission": {"title": "Nossa Missão"}}
    └── ...
```

**Convenção de IDs**:
```
data-json-key = "pageId.sectionId.propertyPath"

Exemplos:
- "index.hero.title"
- "quemSomos.mission.description"
- "purificacao.faseInicial.items[0].title"
```

---

## 🔧 Scripts de Atribuição de IDs

### 1. `init-assign-ids.js` ⚡

**O QUE FAZ**: Script de inicialização automática que roda antes do dev server.

**QUANDO RODAR**: 
- ✅ Automático via `pnpm dev` (configurado no `predev` do package.json)
- 🔄 Executa a cada 24h (ou quando arquivo `.ids-assigned` não existe)

**POR QUE RODAR**: 
- Garante que todos os IDs estejam corretos antes de iniciar desenvolvimento
- Evita bugs de elementos não-editáveis
- Execução inteligente (não roda se foi executado recentemente)

**COMO USAR**:
```bash
# Automático ao rodar:
pnpm dev

# Forçar reexecução:
npm run assign-ids
```

**O QUE FAZ INTERNAMENTE**:
1. Verifica flag `.ids-assigned` (timestamp da última execução)
2. Se passou 24h, executa `assign-ids-final.js`
3. Atualiza timestamp
4. Não bloqueia o dev server (roda em background)

**SAÍDA ESPERADA**:
```
🔍 Verificando IDs únicos...
✅ IDs únicos já atribuídos (último: 08/11/2025 07:00:00)
   Para forçar reexecução: npm run assign-ids
```

---

### 2. `assign-ids-final.js` 🎯 (PRINCIPAL)

**O QUE FAZ**: Script **MAIS AVANÇADO** que atribui IDs únicos de forma inteligente.

**QUANDO RODAR**:
- 🆕 Após criar uma nova página
- 🔄 Após modificar estrutura JSX (adicionar novos elementos)
- 🐛 Quando elementos não aparecem no editor visual
- ✅ Periodicamente para garantir consistência

**POR QUE RODAR**:
- **Busca reversa**: Encontra o elemento JSX pai MAIS PRÓXIMO de cada `{texts.xxx}`
- **Multi-linha**: Suporta elementos JSX complexos (várias linhas, atributos)
- **Arrays**: Detecta `.map()` e adiciona índices `[0]`, `[1]`, etc.
- **Validação**: Confere se JSON path existe no arquivo correspondente
- **Preservação**: Mantém IDs corretos, evita duplicatas

**COMO USAR**:
```bash
# Modo produção (modifica arquivos)
node scripts/assign-ids-final.js

# Preview sem modificar (recomendado primeiro)
node scripts/assign-ids-final.js --dry-run

# Processar apenas uma página
node scripts/assign-ids-final.js --page=Index

# Modo detalhado (debug)
node scripts/assign-ids-final.js --verbose
```

**O QUE FAZ INTERNAMENTE**:
1. **Escaneamento**: Varre todas as páginas em `src/pages/`
2. **Detecção**: Encontra `{texts.xxx}` em JSX
3. **Busca Reversa**: Localiza elemento pai mais próximo (tag HTML/JSX)
4. **Validação**: Verifica se path existe em `src/locales/pt-BR/PageName.json`
5. **Geração de ID**: Cria `pageId.sectionId.jsonPath`
6. **Injeção**: Adiciona `data-json-key="..."` no elemento (preservando atributos existentes)
7. **Backup**: Cria cópia de segurança antes de modificar

**EXEMPLO DE TRANSFORMAÇÃO**:

```jsx
// ANTES
<section>
  <h1 className="text-4xl">
    {texts.hero.title}
  </h1>
  <p>{texts.hero.subtitle}</p>
</section>

// DEPOIS
<section>
  <h1 className="text-4xl" data-json-key="index.hero.title">
    {texts.hero.title}
  </h1>
  <p data-json-key="index.hero.subtitle">{texts.hero.subtitle}</p>
</section>
```

**SAÍDA ESPERADA**:
```
🎯 Script FINAL - Atribuição Inteligente de IDs
================================================
🔧 Modo: 🔴 PRODUÇÃO (vai modificar arquivos!)

📄 Processando: Index.tsx
   ✅ index.hero.title → <h1>
   ✅ index.hero.subtitle → <p>
   ✅ index.services.items[0].title → <h3>
   ✅ index.services.items[0].description → <p>
   📝 4 IDs atribuídos

📊 RESUMO FINAL:
   📄 Páginas processadas: 8
   ✅ Total de IDs: 171
   🔄 IDs atualizados: 23
   ⏭️  IDs ignorados: 148 (já corretos)
```

---

### 3. `assign-ids-smart.js` 🧠

**O QUE FAZ**: Versão intermediária (menos usada atualmente).

**QUANDO RODAR**: 
- ⚠️ **Raramente** - `assign-ids-final.js` é superior
- 🔧 Apenas para debugging ou comparação

**POR QUE FOI CRIADO**: 
- Detectava seções via comentários HTML
- Tentativa inicial de contexto semântico
- Substituído pelo `assign-ids-final.js` (mais robusto)

**DIFERENÇAS vs assign-ids-final.js**:
- ❌ Não faz busca reversa eficiente
- ❌ Menos suporte para multi-linha
- ❌ Menos inteligente com arrays

**COMO USAR**:
```bash
node scripts/assign-ids-smart.js --dry-run
```

**RECOMENDAÇÃO**: **Use `assign-ids-final.js` ao invés deste.**

---

### 4. `assign-unique-ids.js` 📝

**O QUE FAZ**: Versão inicial/básica (histórica).

**QUANDO RODAR**: 
- ❌ **Não usar** - Obsoleto
- 📚 Mantido apenas para referência histórica

**POR QUE EXISTE**: 
- Primeira tentativa de automatização
- Lógica simples (regex básico)
- Substituído por versões mais avançadas

**RECOMENDAÇÃO**: **Ignore este script - use `assign-ids-final.js`.**

---

## 🔨 Scripts de Correção

### 5. `fix-all-keys.cjs` 🚀 (SCRIPT MESTRE)

**O QUE FAZ**: Executa **TODOS** os scripts de correção em sequência.

**QUANDO RODAR**:
- 🚨 Após grandes mudanças no código
- 🔄 Quando muitos elementos não aparecem no editor
- ✅ Manutenção mensal/trimestral
- 🐛 Troubleshooting de problemas de edição

**POR QUE RODAR**:
- **All-in-one**: Executa `fix-all-texts.js` + `fix-all-maps.js` automaticamente
- **Garante consistência**: Processa 100% dos elementos
- **Reporta tudo**: Mostra estatísticas completas

**COMO USAR**:
```bash
# Modo padrão (com saída detalhada)
node scripts/fix-all-keys.cjs

# Modo silencioso (apenas resultado final)
node scripts/fix-all-keys.cjs --silent
```

**O QUE FAZ INTERNAMENTE**:
1. Executa `fix-all-texts.js` (elementos simples)
2. Executa `fix-all-maps.js` (arrays)
3. Reporta estatísticas consolidadas

**SAÍDA ESPERADA**:
```
🚀 Script Mestre - Fix All Data-Json-Keys
======================================================================

▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶
▶  Corrigindo elementos simples (texts.)
▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶

[Saída do fix-all-texts.js...]

▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶
▶  Corrigindo arrays (.map)
▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶▶

[Saída do fix-all-maps.js...]

✅ Todos os scripts executados com sucesso!
```

---

### 6. `fix-all-texts.js` 📝

**O QUE FAZ**: Corrige **TODOS** os elementos simples com `{texts.xxx}`.

**QUANDO RODAR**:
- 🔧 Após modificar componentes
- 🆕 Após adicionar novos textos
- 🐛 Quando elementos não são editáveis
- ⚠️ Raramente manual (use `fix-all-keys.cjs`)

**POR QUE RODAR**:
- **100% de cobertura**: Varre TODAS as páginas
- **Sempre atualiza**: Remove IDs antigos, cria novos
- **Múltiplos padrões**: Detecta `{texts.xxx}`, `dangerouslySetInnerHTML`, atributos

**COMO USAR**:
```bash
# Aplicar mudanças
node scripts/fix-all-texts.js

# Preview sem modificar
node scripts/fix-all-texts.js --dry-run
```

**PADRÕES DETECTADOS**:
```jsx
// Padrão 1: Interpolação JSX
<h1>{texts.hero.title}</h1>

// Padrão 2: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: texts.content.html }} />

// Padrão 3: Atributos
<input value={texts.form.placeholder} />
<img alt={texts.image.alt} />
```

**SAÍDA ESPERADA**:
```
🎯 Script COMPLETO - Fix TODOS os texts.
======================================================================
🔧 Modo: 🔴 APLICAR MUDANÇAS

📄 Index.tsx
   ✅ ATUALIZADO: <h1> → index.hero.title
   ✅ ATUALIZADO: <p> → index.hero.subtitle
   ✅ ADICIONADO: <span> → index.stats.visitors
   📝 3 elementos processados

📊 RESUMO GERAL:
   📄 Páginas: 8
   ✅ Total processado: 127
   🆕 Novos: 5
   🔄 Atualizados: 122
```

---

### 7. `fix-all-maps.js` 🗺️

**O QUE FAZ**: Corrige **TODOS** os arrays com `.map()`.

**QUANDO RODAR**:
- 🔧 Após criar listas dinâmicas
- 🆕 Após adicionar novos arrays
- 🐛 Quando itens de lista não são editáveis
- ⚠️ Raramente manual (use `fix-all-keys.cjs`)

**POR QUE RODAR**:
- **Detecta arrays**: Identifica todos os `.map()` no código
- **Gera índices**: Adiciona `[0]`, `[1]`, `[2]` automaticamente
- **Objetos vs strings**: Inteligente para detectar tipo de dado

**COMO USAR**:
```bash
# Aplicar mudanças
node scripts/fix-all-maps.js

# Preview sem modificar
node scripts/fix-all-maps.js --dry-run
```

**EXEMPLOS DE TRANSFORMAÇÃO**:

```jsx
// ARRAY DE STRINGS
// ANTES
{texts.items.map((item, i) => (
  <li key={i}>{item}</li>
))}

// DEPOIS
{texts.items.map((item, i) => (
  <li key={i} data-json-key={`index.items[${i}]`}>{item}</li>
))}

// ARRAY DE OBJETOS
// ANTES
{texts.services.map((service, i) => (
  <div key={i}>
    <h3>{service.title}</h3>
    <p>{service.description}</p>
  </div>
))}

// DEPOIS
{texts.services.map((service, i) => (
  <div key={i}>
    <h3 data-json-key={`index.services[${i}].title`}>{service.title}</h3>
    <p data-json-key={`index.services[${i}].description`}>{service.description}</p>
  </div>
))}
```

**SAÍDA ESPERADA**:
```
🎯 Script: Fix TODOS os Arrays .map() - VERSÃO 2 (SEMPRE ATUALIZA)
======================================================================
🔧 Modo: 🔴 APLICAR MUDANÇAS

📄 Index.tsx
   🗺️  Array: texts.services.map
      ✅ Atualizado: <h3> → index.services[${i}].title
      ✅ Atualizado: <p> → index.services[${i}].description
      📝 2 elementos por item

📊 RESUMO GERAL:
   🗺️  Arrays processados: 15
   ✅ Elementos atualizados: 44
```

---

### 8. `fix-map-arrays.js` 📋

**O QUE FAZ**: Versão inicial de correção de arrays (histórica).

**QUANDO RODAR**: 
- ❌ **Não usar** - Substituído por `fix-all-maps.js`
- 📚 Mantido para referência

**DIFERENÇAS vs fix-all-maps.js**:
- ❌ Lógica mais simples
- ❌ Menos casos cobertos
- ❌ Não suporta objetos complexos

**RECOMENDAÇÃO**: **Use `fix-all-maps.js` ao invés deste.**

---

## 🧹 Scripts de Manutenção

### 9. `clean-all-backups.cjs` 🗑️

**O QUE FAZ**: Limpa backups antigos de JSONs e CSS, mantendo apenas os 5 mais recentes.

**QUANDO RODAR**:
- 🗓️ Mensalmente para economia de espaço
- 🚨 Quando disco estiver cheio
- 🔍 Após muitas edições no Admin Panel

**POR QUE RODAR**:
- **Economia de espaço**: Remove backups desnecessários
- **Organização**: Mantém apenas histórico relevante
- **Segurança**: Preserva os 5 backups mais recentes (rollback)

**COMO USAR**:
```bash
node scripts/clean-all-backups.cjs
```

**O QUE FAZ INTERNAMENTE**:
1. Varre `src/locales/pt-BR/` (backups de JSON)
2. Varre `src/styles/pages/` (backups de CSS)
3. Agrupa por arquivo base
4. Ordena por data de modificação
5. Remove arquivos mais antigos que os 5 últimos

**FORMATO DE BACKUP**:
```
Index_2025-11-08_07-30-00.json     ← Backup mais antigo (DELETADO)
Index_2025-11-08_08-15-00.json     
Index_2025-11-08_09-00-00.json     
Index_2025-11-08_10-30-00.json     
Index_2025-11-08_11-15-00.json     
Index_2025-11-08_12-00-00.json     ← Backup mais recente (MANTIDO)
```

**SAÍDA ESPERADA**:
```
🗑️  Script de Limpeza Manual de Backups
======================================================================
Mantendo apenas 5 backups mais recentes de cada arquivo

📁 Processando: pt-BR/
──────────────────────────────────────────────────────────────────────
   Index.json: 8 backups encontrados
      🗑️  Removido: Index_2025-11-08_07-30-00.json
      🗑️  Removido: Index_2025-11-08_08-15-00.json
      🗑️  Removido: Index_2025-11-08_09-00-00.json
      ✅ Mantidos: 5 backups mais recentes

📊 RESUMO GERAL:
   📂 Diretórios: 2
   📄 Arquivos base: 16
   🗑️  Backups removidos: 47
   💾 Espaço liberado: ~2.3 MB
```

---

## 🔄 Fluxo de Trabalho Recomendado

### Situação 1: Desenvolvimento Normal
```bash
# 1. Iniciar desenvolvimento (IDs são verificados automaticamente)
pnpm dev

# Se quiser forçar atualização:
npm run assign-ids
```

### Situação 2: Criar Nova Página
```bash
# 1. Criar arquivo src/pages/NovaPage.tsx
# 2. Criar arquivo src/locales/pt-BR/NovaPage.json
# 3. Atribuir IDs automaticamente
node scripts/assign-ids-final.js --page=NovaPage

# OU processar tudo de uma vez
node scripts/fix-all-keys.cjs
```

### Situação 3: Grande Refatoração
```bash
# 1. Fazer mudanças no código
# 2. Executar correção completa
node scripts/fix-all-keys.cjs

# 3. Verificar no browser (Admin Panel)
# http://localhost:8080/436F6E736F6C45

# 4. Testar edição de elementos
```

### Situação 4: Elementos Não-Editáveis
```bash
# 1. Identificar a página problemática
# 2. Executar correção completa
node scripts/fix-all-keys.cjs

# 3. Se ainda não funcionar, verificar:
# - JSON existe em src/locales/pt-BR/?
# - Path está correto? (texts.section.property)
# - Elemento JSX tem {texts.xxx}?

# 4. Forçar reprocessamento com dry-run primeiro
node scripts/assign-ids-final.js --page=ProblemPage --dry-run
node scripts/assign-ids-final.js --page=ProblemPage
```

### Situação 5: Limpeza de Backups
```bash
# Mensalmente ou quando necessário
node scripts/clean-all-backups.cjs
```

---

## 📊 Comparação Rápida

| Script | Uso | Frequência | Automático? |
|--------|-----|------------|-------------|
| `init-assign-ids.js` | Verificação inicial | Diário | ✅ Sim (predev) |
| `assign-ids-final.js` | Atribuição inteligente | Semanal | ❌ Manual |
| `assign-ids-smart.js` | Versão antiga | Nunca | ❌ Obsoleto |
| `assign-unique-ids.js` | Versão inicial | Nunca | ❌ Obsoleto |
| `fix-all-keys.cjs` | Correção completa | Mensal | ❌ Manual |
| `fix-all-texts.js` | Correção de textos | Raro | ⚠️ Via fix-all-keys |
| `fix-all-maps.js` | Correção de arrays | Raro | ⚠️ Via fix-all-keys |
| `fix-map-arrays.js` | Versão antiga | Nunca | ❌ Obsoleto |
| `clean-all-backups.cjs` | Limpeza | Mensal | ❌ Manual |

---

## 🐛 Troubleshooting

### Problema: Elemento não aparece no Admin Panel

**Solução**:
```bash
# 1. Verificar console do browser (F12)
# 2. Executar correção completa
node scripts/fix-all-keys.cjs

# 3. Verificar manualmente o arquivo
# - Abrir src/pages/Page.tsx
# - Procurar o elemento
# - Verificar se tem data-json-key
# - Verificar se JSON path existe
```

### Problema: Edição não salva

**Causa Comum**: JSON path incorreto ou JSON não existe

**Solução**:
```bash
# 1. Verificar src/locales/pt-BR/PageName.json
# 2. Verificar estrutura do JSON corresponde ao path
# 3. Reexecutar atribuição
node scripts/assign-ids-final.js --page=PageName --verbose
```

### Problema: IDs duplicados

**Solução**:
```bash
# Os scripts são idempotentes - sempre geram IDs consistentes
node scripts/fix-all-keys.cjs
```

### Problema: Muitos backups ocupando espaço

**Solução**:
```bash
node scripts/clean-all-backups.cjs
```

### Problema: Script não executa

**Possíveis Causas**:
1. **Node.js não instalado** → Instalar Node.js 18+
2. **Permissões** → Executar como administrador
3. **Arquivo com BOM** → Recriar arquivo sem BOM

**Solução**:
```bash
# Verificar Node.js
node --version

# Deve retornar: v18.x.x ou superior
```

---

## 📝 Convenções e Boas Práticas

### Nomenclatura de IDs
```
✅ CORRETO:
- "index.hero.title"
- "quemSomos.mission.description"
- "purificacao.faseInicial.items[0].title"

❌ ERRADO:
- "Index.hero.title" (primeira letra maiúscula)
- "quem-somos.mission" (hífen ao invés de camelCase)
- "purificacao.items.0.title" (sem colchetes no índice)
```

### Estrutura de JSON
```json
{
  "section": {
    "title": "Título",
    "description": "Descrição",
    "items": [
      {
        "title": "Item 1",
        "description": "Descrição 1"
      }
    ]
  }
}
```

### Estrutura JSX
```jsx
// ✅ CORRETO: Elemento pai tem data-json-key
<h1 data-json-key="index.hero.title">
  {texts.hero.title}
</h1>

// ❌ ERRADO: data-json-key dentro de expressão
<h1>
  <span data-json-key="index.hero.title">{texts.hero.title}</span>
</h1>
```

---

## 🚀 Comandos Rápidos (Cheat Sheet)

```bash
# Desenvolvimento normal
pnpm dev

# Forçar atualização de IDs
npm run assign-ids

# Correção completa de tudo
node scripts/fix-all-keys.cjs

# Preview antes de modificar
node scripts/assign-ids-final.js --dry-run

# Processar apenas uma página
node scripts/assign-ids-final.js --page=Index

# Modo verbose (debug)
node scripts/assign-ids-final.js --verbose

# Limpeza de backups
node scripts/clean-all-backups.cjs

# Admin Panel
# http://localhost:8080/436F6E736F6C45
```

---

## 📚 Recursos Adicionais

- **Admin Panel**: `/436F6E736F6C45` (hex de "ConsolE")
- **JSONs**: `src/locales/pt-BR/*.json`
- **CSS**: `src/styles/pages/*.css`
- **Backups**: Automáticos (5 mais recentes mantidos)

---

## 🔄 Histórico de Versões

| Versão | Script | Status |
|--------|--------|--------|
| v3 | `assign-ids-final.js` | ✅ **ATUAL** (Recomendado) |
| v2 | `assign-ids-smart.js` | ⚠️ Funcional (Não usar) |
| v1 | `assign-unique-ids.js` | ❌ Obsoleto |
| - | `fix-all-keys.cjs` | ✅ **ATUAL** (Mestre) |
| v2 | `fix-all-maps.js` | ✅ **ATUAL** |
| v1 | `fix-map-arrays.js` | ⚠️ Funcional (Não usar) |
| - | `fix-all-texts.js` | ✅ **ATUAL** |
| - | `clean-all-backups.cjs` | ✅ **ATUAL** |
| - | `init-assign-ids.js` | ✅ **ATUAL** (Auto) |

---

## ✅ Checklist de Manutenção

**Diário**:
- [ ] `pnpm dev` (atualização automática via init-assign-ids.js)

**Semanal** (após mudanças no código):
- [ ] `node scripts/assign-ids-final.js --dry-run` (preview)
- [ ] `node scripts/assign-ids-final.js` (aplicar)

**Mensal**:
- [ ] `node scripts/fix-all-keys.cjs` (correção completa)
- [ ] `node scripts/clean-all-backups.cjs` (limpeza)

**Após criar página nova**:
- [ ] Criar `src/pages/PageName.tsx`
- [ ] Criar `src/locales/pt-BR/PageName.json`
- [ ] `node scripts/assign-ids-final.js --page=PageName`
- [ ] Testar no Admin Panel

**Antes de deploy**:
- [ ] `node scripts/fix-all-keys.cjs`
- [ ] Testar edição no Admin Panel local
- [ ] Build: `pnpm build`
- [ ] Deploy: `npm run deploy`

---

**📝 Última Atualização**: 08/11/2025  
**✅ Status**: Documentação completa e atualizada  
**🎯 Total de Scripts**: 9 (3 ativos principais, 6 utilitários/históricos)
