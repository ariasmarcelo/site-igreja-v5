# 📚 Scripts de Automação# 📚 Scripts de Automação# 📚 Scripts de Automação# 📚 Scripts de Automação# 📚 Scripts de Automação do Sistema de Edição Visual



Scripts essenciais para desenvolvimento, deploy e backup do projeto.



> 📖 Documentação detalhada:Scripts essenciais para desenvolvimento, deploy e backup do projeto.

> - **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Sistema de IDs únicos

> - **[README-DEPLOY.md](./README-DEPLOY.md)** - Deploy GitHub Pages  

> - **[README-BACKUP.md](./README-BACKUP.md)** - Backup/Restore Supabase

> 📖 Documentação detalhada:Scripts essenciais para desenvolvimento, deploy e backup do projeto.

---

> - **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Sistema de IDs únicos

## 🚀 Quick Start

> - **[README-DEPLOY.md](./README-DEPLOY.md)** - Deploy GitHub Pages  

```bash

# Desenvolvimento normal (IDs verificados automaticamente)> - **[README-BACKUP.md](./README-BACKUP.md)** - Backup/Restore Supabase

pnpm dev

> 📖 Documentação detalhada:Scripts essenciais para desenvolvimento e deploy do projeto.Este diretório contém scripts automatizados para gerenciar os atributos `data-json-key` que conectam elementos visuais ao conteúdo editável.

# Verificar IDs únicos

pnpm fix-ids---



# Corrigir IDs automaticamente> - **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Sistema de IDs únicos

pnpm fix-ids:fix

## 🚀 Quick Start

# Backup do banco de dados

pnpm backup> - **[README-DEPLOY.md](./README-DEPLOY.md)** - Deploy GitHub Pages



# Restaurar último backup```bash

pnpm restore:latest

# Desenvolvimento normal (IDs verificados automaticamente)> - **[README-BACKUP.md](./README-BACKUP.md)** - Backup/Restore Supabase

# Deploy

.\scripts\deploy.ps1 "msg"      # Síncronopnpm dev

.\scripts\deploy.ps1 -b "msg"   # Background

```---> 📖 Veja também: **[README-IDS.md](./README-IDS.md)** - Documentação detalhada do script fix-ids.js



---# Verificar IDs únicos



## 📋 Scripts Ativospnpm fix-ids---



| Script | Comando | Descrição | Frequência |

|--------|---------|-----------|------------|

| **fix-ids.js** ⭐ | `pnpm fix-ids` | Verificação e correção de IDs | Automático + Manual |# Corrigir IDs automaticamente

| **deploy.ps1** ⭐ | `.\scripts\deploy.ps1 [-b] "msg"` | Deploy síncrono ou background | Por deploy |

| **backup-supabase.js** 💾 | `pnpm backup` | Backup completo do Supabase | Manual/Agendado |pnpm fix-ids:fix

| **restore-supabase.js** 🔄 | `pnpm restore:latest` | Restaura backup do Supabase | Manual |

## 🚀 Quick Start

---

# Backup do banco de dados

## 🎯 O Que São os Scripts?

pnpm backup## 🚀 Quick Start---

### fix-ids.js - Sistema de IDs Únicos



**Problema:**

```jsx# Restaurar último backup```bash

// Elemento não-editável (sem data-json-key)

<h1>{texts.hero.title}</h1>pnpm restore:latest

```

# Desenvolvimento normal (IDs verificados automaticamente)

**Solução:**

```jsx# Deploy

// Elemento editável no Admin Panel

<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>.\scripts\deploy.ps1 "msg"      # Síncronopnpm dev

```

.\scripts\deploy.ps1 -b "msg"   # Background

**Como Funciona:**

1. Scripts detectam `{texts.xxx}` no código``````bash## 🚀 Quick Start

2. Encontram o elemento JSX pai

3. Validam se path existe no JSON correspondente

4. Injetam `data-json-key="pageName.section.property"`

5. Admin Panel usa esse atributo para permitir edição inline---# Verificar IDs únicos



**Resultado**: **96 elementos editáveis** em 6 páginas 🎉



---## 📋 Scripts Ativospnpm fix-ids# Desenvolvimento



### deploy.ps1 - Deploy GitHub Pages



**Recursos:**| Script | Comando | Descrição | Frequência |

- ✅ Deploy síncrono (padrão) ou background

- ✅ Logs limpos sem códigos ANSI|--------|---------|-----------|------------|

- ✅ Mantém últimos 10 logs automaticamente

- ✅ Alias curto: `-b` para `-Background`| **fix-ids.js** ⭐ | `pnpm fix-ids` | Verificação e correção de IDs | Automático + Manual |# Corrigir IDs automaticamentepnpm dev                    # Inicia dev server (verifica IDs automaticamente)```bash



**Processo:**| **deploy.ps1** ⭐ | `.\scripts\deploy.ps1 [-b] "msg"` | Deploy síncrono ou background | Por deploy |

1. Build (`pnpm build`)

2. Git add| **backup-supabase.js** 💾 | `pnpm backup` | Backup completo do Supabase | Manual/Agendado |pnpm fix-ids:fix

3. Git commit

4. Git push| **restore-supabase.js** 🔄 | `pnpm restore:latest` | Restaura backup do Supabase | Manual |



**Monitorar deploy background:**# Desenvolvimento normal (IDs verificados automaticamente)

```bash

Get-Content logs\deploy-YYYYMMDD-HHMMSS.log -Tail 20 -Wait---

```

# Backup do banco de dados

---

## 🎯 O Que São os Scripts?

### backup-supabase.js - Backup do Banco

pnpm backup# IDspnpm dev

**O que faz:**

- 📥 Baixa todos os dados de todas as tabelas (3 tabelas)### fix-ids.js - Sistema de IDs Únicos

- 💾 Salva em arquivos JSON individuais

- 📊 Cria arquivo de metadados

- 🧹 Mantém apenas últimos 10 backups

**Problema:**

**Comandos:**

```bash```jsx# Restaurar último backuppnpm fix-ids               # Verifica IDs

# Backup padrão

pnpm backup// Elemento não-editável (sem data-json-key)



# Com log detalhado<h1>{texts.hero.title}</h1>pnpm restore:latest

pnpm backup:verbose

```

# Tabela específica

node scripts/backup-supabase.js --table=page_stylespnpm fix-ids:fix           # Verifica e corrige IDs# Verificar IDs únicos

```

**Solução:**

**Tabelas incluídas:**

- `page_contents` (8 registros - 57 KB)```jsx# Deploy

- `page_styles` (7 registros - 5 KB)

- `page_history` (17 registros - 93 KB)// Elemento editável no Admin Panel



---<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>.\scripts\deploy.ps1 "msg"      # Síncronopnpm fix-ids



### restore-supabase.js - Restauração```



**O que faz:**.\scripts\deploy.ps1 -b "msg"   # Background

- 🔄 Restaura dados de um backup específico

- ⚠️ Deleta dados atuais antes de restaurar**Como Funciona:**

- 🛡️ Solicita confirmação

- 🔍 Modo dry-run disponível1. Scripts detectam `{texts.xxx}` no código```# Deploy



**Comandos:**2. Encontram o elemento JSX pai

```bash

# Restaurar último backup3. Validam se path existe no JSON correspondente

pnpm restore:latest

4. Injetam `data-json-key="pageName.section.property"`

# Preview sem alterar

pnpm restore:dry5. Admin Panel usa esse atributo para permitir edição inline---.\scripts\deploy.ps1 "msg"      # Deploy síncrono# Corrigir IDs automaticamente



# Backup específico

node scripts/restore-supabase.js --backup=2025-11-10T08-49-23

**Resultado**: **96 elementos editáveis** em 6 páginas 🎉

# Sem confirmação

node scripts/restore-supabase.js --latest --force

```

---## 📋 Scripts Ativos.\scripts\deploy.ps1 -b "msg"   # Deploy backgroundpnpm fix-ids:fix

---



## 📁 Estrutura

### deploy.ps1 - Deploy GitHub Pages

```

scripts/

├── fix-ids.js              ⭐ Script único de IDs

├── deploy.ps1              ⭐ Script único de deploy**Recursos:**| Script | Comando | Descrição | Frequência |```

├── backup-supabase.js      💾 Backup do Supabase

├── restore-supabase.js     🔄 Restauração do Supabase- ✅ Deploy síncrono (padrão) ou background

├── README.md               📖 Este arquivo

├── README-FIX-IDS.md       📖 Documentação detalhada de IDs- ✅ Logs limpos sem códigos ANSI|--------|---------|-----------|------------|

├── README-DEPLOY.md        📖 Documentação detalhada de deploy

└── README-BACKUP.md        📖 Documentação detalhada de backup- ✅ Mantém últimos 10 logs automaticamente

```

- ✅ Alias curto: `-b` para `-Background`| **fix-ids.js** ⭐ | `pnpm fix-ids` | Verificação e correção de IDs | Automático + Manual |# Correção completa de data-json-key

---



## 🔄 Fluxo de Trabalho

**Processo:**| **deploy.ps1** ⭐ | `.\scripts\deploy.ps1 [-b] "msg"` | Deploy síncrono ou background | Por deploy |

### Desenvolvimento Diário

1. Build (`pnpm build`)

```bash

pnpm dev    # IDs verificados automaticamente2. Git add| **backup-supabase.js** 💾 | `pnpm backup` | Backup completo do Supabase | Manual/Agendado |---pnpm fix-keys

```

3. Git commit

### Após Adicionar Elementos Editáveis

4. Git push| **restore-supabase.js** 🔄 | `pnpm restore:latest` | Restaura backup do Supabase | Manual |

```bash

pnpm fix-ids:fix

```

**Monitorar deploy background:**

### Antes de Mudanças Grandes

```bash

```bash

# Fazer backup antesGet-Content logs\deploy-YYYYMMDD-HHMMSS.log -Tail 20 -Wait---

pnpm backup:verbose

```

# Fazer as mudanças...

## 📋 Scripts Disponíveis# Limpeza de backups antigos

# Se algo der errado, restaurar

pnpm restore:latest---

```

## 🎯 O Que São os Scripts?

### Deploy

### backup-supabase.js - Backup do Banco

```bash

# Modo síncrono (ver progresso)pnpm clean-backups

.\scripts\deploy.ps1 "mensagem do commit"

**O que faz:**

# Modo background (liberar terminal)

.\scripts\deploy.ps1 -b "mensagem do commit"- 📥 Baixa todos os dados de todas as tabelas (3 tabelas)### fix-ids.js - Sistema de IDs Únicos

```

- 💾 Salva em arquivos JSON individuais

---

- 📊 Cria arquivo de metadados### 1. **fix-ids.js** ⭐```

## 📊 Estatísticas

- 🧹 Mantém apenas últimos 10 backups

- **96 elementos editáveis** distribuídos em 6 páginas

- **4 scripts essenciais** (fix-ids.js, deploy.ps1, backup-supabase.js, restore-supabase.js)**Problema:**

- **100% cobertura** - todos elementos têm data-json-key

- **3 tabelas no banco** - 32 registros, 155.53 KB**Comandos:**

- **Admin Panel**: `/436F6E736F6C45`

```bash```jsx

---

# Backup padrão

## 📚 Documentação Completa

pnpm backup// Elemento não-editável (sem data-json-key)

- **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Detalhes do sistema de IDs

- **[README-DEPLOY.md](./README-DEPLOY.md)** - Detalhes do sistema de deploy

- **[README-BACKUP.md](./README-BACKUP.md)** - Detalhes do sistema de backup

# Com log detalhado<h1>{texts.hero.title}</h1>Script único para gerenciar IDs de elementos editáveis.---

---

pnpm backup:verbose

**Última Atualização:** 10/11/2025  

**Status:** ✅ Todos os scripts funcionais e testados  ```

**Complexidade:** Simplificado ao máximo

# Tabela específica

node scripts/backup-supabase.js --table=page_styles

```

**Solução:**

**Tabelas incluídas:**

- `page_contents` (8 registros - 57 KB)```jsx**O que faz:**## 📋 Scripts Ativos

- `page_styles` (7 registros - 5 KB)

- `page_history` (17 registros - 93 KB)// Elemento editável no Admin Panel



---<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>- Verifica todos os elementos `{texts.xxx}` no código



### restore-supabase.js - Restauração```



**O que faz:**- Garante que cada elemento tenha `data-json-key` único| Script | Comando | Descrição | Frequência |

- 🔄 Restaura dados de um backup específico

- ⚠️ Deleta dados atuais antes de restaurar**Como Funciona:**

- 🛡️ Solicita confirmação

- 🔍 Modo dry-run disponível1. Scripts detectam `{texts.xxx}` no código- Detecta contexto de arrays (`.map()`)|--------|---------|-----------|------------|



**Comandos:**2. Encontram o elemento JSX pai

```bash

# Restaurar último backup3. Validam se path existe no JSON correspondente- Corrige automaticamente quando necessário| **fix-ids.js** ⭐ | `pnpm fix-ids` | Verificação e correção de IDs | Automático + Manual |

pnpm restore:latest

4. Injetam `data-json-key="pageName.section.property"`

# Preview sem alterar

pnpm restore:dry5. Admin Panel usa esse atributo para permitir edição inline- Cria backups antes de modificar| **deploy.ps1** ⭐ | `.\scripts\deploy.ps1 [-b] "msg"` | Deploy síncrono ou background | Por deploy |



# Backup específico

node scripts/restore-supabase.js --backup=2025-11-10T08-49-23

**Resultado**: **96 elementos editáveis** em 6 páginas 🎉

# Sem confirmação

node scripts/restore-supabase.js --latest --force

```

---**Comandos:****Comandos disponíveis:**

---



## 📁 Estrutura

### deploy.ps1 - Deploy GitHub Pages```bash```bash

```

scripts/

├── fix-ids.js              ⭐ Script único de IDs

├── deploy.ps1              ⭐ Script único de deploy**Recursos:**pnpm fix-ids              # Verifica apenas# IDs

├── backup-supabase.js      💾 Backup do Supabase

├── restore-supabase.js     🔄 Restauração do Supabase- ✅ Deploy síncrono (padrão) ou background

├── README.md               📖 Este arquivo

├── README-FIX-IDS.md       📖 Documentação detalhada de IDs- ✅ Logs limpos sem códigos ANSIpnpm fix-ids:check        # Verifica apenaspnpm fix-ids          # Verifica apenas

├── README-DEPLOY.md        📖 Documentação detalhada de deploy

└── README-BACKUP.md        📖 Documentação detalhada de backup- ✅ Mantém últimos 10 logs automaticamente

```

- ✅ Alias curto: `-b` para `-Background`pnpm fix-ids:fix          # Verifica e corrigepnpm fix-ids:check    # Verifica apenas

---



## 🔄 Fluxo de Trabalho

**Processo:**pnpm fix-ids:fix      # Verifica e corrige

### Desenvolvimento Diário

1. Build (`pnpm build`)

```bash

pnpm dev    # IDs verificados automaticamente2. Git add# Opções avançadas

```

3. Git commit

### Após Adicionar Elementos Editáveis

4. Git pushnode scripts/fix-ids.js --page=NomeDaPagina --fix# Deploy

```bash

pnpm fix-ids:fix

```

**Monitorar deploy background:**node scripts/fix-ids.js --fix --dry-run.\scripts\deploy.ps1 "mensagem"       # Síncrono

### Antes de Mudanças Grandes

```bash

```bash

# Fazer backup antesGet-Content logs\deploy-YYYYMMDD-HHMMSS.log -Tail 20 -Waitnode scripts/fix-ids.js --verbose.\scripts\deploy.ps1 -b "mensagem"    # Background

pnpm backup:verbose

```

# Fazer as mudanças...

``````

# Se algo der errado, restaurar

pnpm restore:latest---

```



### Deploy

### backup-supabase.js - Backup do Banco

```bash

# Modo síncrono (ver progresso)**Quando usar:**---

.\scripts\deploy.ps1 "mensagem do commit"

**O que faz:**

# Modo background (liberar terminal)

.\scripts\deploy.ps1 -b "mensagem do commit"- 📥 Baixa todos os dados de todas as tabelas- Executa automaticamente no `pnpm dev` (modo check)

```

- 💾 Salva em arquivos JSON individuais

---

- 📊 Cria arquivo de metadados- Execute `fix-ids:fix` após adicionar novos elementos editáveis## 🎯 O Que São os Scripts?

## 📊 Estatísticas

- 🧹 Mantém apenas últimos 10 backups

- **96 elementos editáveis** distribuídos em 6 páginas

- **4 scripts essenciais** (fix-ids.js, deploy.ps1, backup-supabase.js, restore-supabase.js)- Execute após refatorações grandes

- **100% cobertura** - todos elementos têm data-json-key

- **3 tabelas no banco** - 32 registros, 155.53 KB**Comandos:**

- **Admin Panel**: `/436F6E736F6C45`

```bash### Problema

---

# Backup padrão

## 📚 Documentação Completa

pnpm backup---```jsx

- **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Detalhes do sistema de IDs

- **[README-DEPLOY.md](./README-DEPLOY.md)** - Detalhes do sistema de deploy

- **[README-BACKUP.md](./README-BACKUP.md)** - Detalhes do sistema de backup

# Com log detalhado// Elemento não-editável (sem data-json-key)

---

pnpm backup:verbose

**Última Atualização:** 10/11/2025  

**Status:** Todos os scripts funcionais e testados  ### 2. **deploy.ps1** ⭐<h1>{texts.hero.title}</h1>

**Complexidade:** Simplificado ao máximo

# Tabela específica

node scripts/backup-supabase.js --table=page_texts```

```

Script único para deploy no GitHub Pages.

---

### Solução

### restore-supabase.js - Restauração

**Recursos:**```jsx

**O que faz:**

- 🔄 Restaura dados de um backup específico- Deploy síncrono (padrão) ou background// Elemento editável no Admin Panel (/436F6E736F6C45)

- ⚠️ Deleta dados atuais antes de restaurar

- 🛡️ Solicita confirmação- Logs limpos sem códigos ANSI<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>

- 🔍 Modo dry-run disponível

- Mantém últimos 10 logs automaticamente```

**Comandos:**

```bash- Alias curto: `-b` para `-Background`

# Restaurar último backup

pnpm restore:latest### Como Funciona



# Preview sem alterar**Comandos:**1. Scripts detectam `{texts.xxx}` no código

pnpm restore:dry

```bash2. Encontram o elemento JSX pai

# Backup específico

node scripts/restore-supabase.js --backup=2025-11-10T10-30-00# Síncrono (bloqueia terminal, mostra progresso)3. Validam se path existe no JSON correspondente



# Sem confirmação.\scripts\deploy.ps1 "feat: nova funcionalidade"4. Injetam `data-json-key="pageName.section.property"`

node scripts/restore-supabase.js --latest --force

```5. Admin Panel usa esse atributo para permitir edição inline



---# Background (libera terminal)



## 📁 Estrutura.\scripts\deploy.ps1 -b "fix: correcao"**Resultado**: **141+ elementos editáveis** em 8 páginas 🎉



```.\scripts\deploy.ps1 -Background "fix: correcao"

scripts/

├── fix-ids.js              ⭐ Script único de IDs```---

├── deploy.ps1              ⭐ Script único de deploy

├── backup-supabase.js      💾 Backup do Supabase

├── restore-supabase.js     🔄 Restauração do Supabase

├── README.md               📖 Este arquivo**Processo:**## 📖 Documentação Detalhada

├── README-FIX-IDS.md       📖 Documentação detalhada de IDs

├── README-DEPLOY.md        📖 Documentação detalhada de deploy1. Build (`pnpm build`)

└── README-BACKUP.md        📖 Documentação detalhada de backup

```2. Git add### 1. **fix-ids.js** ⭐ (Script Definitivo)



---3. Git commit



## 🔄 Fluxo de Trabalho4. Git pushO script principal que substitui todos os anteriores.



### Desenvolvimento Diário



```bash**Monitorar deploy background:****Funcionalidades:**

pnpm dev    # IDs verificados automaticamente

``````bash- 🧠 Verificação inteligente de IDs únicos



### Após Adicionar Elementos EditáveisGet-Content logs\deploy-YYYYMMDD-HHMMSS.log -Tail 20 -Wait- 🔢 Detecta contexto de arrays com `.map()`



```bash```- 🗂️ Suporta estruturas JSX aninhadas

pnpm fix-ids:fix

```- ✅ Validação contra arquivos JSON



### Antes de Mudanças Grandes---- 🔒 Correção automática segura



```bash- 💾 Backups automáticos com timestamp

# Fazer backup antes

pnpm backup:verbose## 🎯 Como Funciona o Sistema de IDs



# Fazer as mudanças...**Uso:**



# Se algo der errado, restaurar### Problema```bash

pnpm restore:latest

``````jsx# Verificar apenas



### Deploy// ❌ Elemento não-editávelpnpm fix-ids



```bash<h1>{texts.hero.title}</h1>

# Modo síncrono (ver progresso)

.\scripts\deploy.ps1 "mensagem do commit"```# Corrigir automaticamente



# Modo background (liberar terminal)pnpm fix-ids:fix

.\scripts\deploy.ps1 -b "mensagem do commit"

```### Solução



---```jsx# Página específica



## 📊 Estatísticas// ✅ Elemento editável no Admin Panelnode scripts/fix-ids.js --page=Tratamentos --fix



- **96 elementos editáveis** distribuídos em 6 páginas<h1 data-json-key="index.hero.title">{texts.hero.title}</h1>

- **4 scripts essenciais** (fix-ids.js, deploy.ps1, backup-supabase.js, restore-supabase.js)

- **100% cobertura** - todos elementos têm data-json-key```# Preview das correções

- **Admin Panel**: `/436F6E736F6C45`

node scripts/fix-ids.js --fix --dry-run

---

### Fluxo```

## 📚 Documentação Completa

1. `fix-ids.js` detecta `{texts.xxx}` no código

- **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Detalhes do sistema de IDs

- **[README-DEPLOY.md](./README-DEPLOY.md)** - Detalhes do sistema de deploy2. Encontra elemento JSX paiVeja documentação completa em **[README-IDS.md](./README-IDS.md)**

- **[README-BACKUP.md](./README-BACKUP.md)** - Detalhes do sistema de backup

3. Valida se path existe no JSON

---

4. Injeta `data-json-key` correto### 2. **init-assign-fix-ids.js** (Automático)

**Última Atualização:** 10/11/2025  

**Status:** Todos os scripts funcionais e otimizados  5. Admin Panel usa isso para edição inline- ✅ Roda automaticamente via `pnpm dev`

**Complexidade:** Simplificado ao máximo

- � Executa verificação inicial

**Resultado:** 96 elementos editáveis em 6 páginas- ⚡ Não bloqueia dev server



---### 3. **fix-all-keys.cjs**

- 🚀 Correção completa de data-json-key

## 📁 Estrutura- 📊 Relatório consolidado

- 🔧 Executa junto com `pnpm dev`

```- 🔧 Use quando muitos elementos não aparecem no editor

scripts/

├── fix-ids.js           ⭐ Script único de IDs### 4. **fix-all-texts.js**

├── deploy.ps1           ⭐ Script único de deploy- 🔍 Detecta: `{texts.xxx}`, `dangerouslySetInnerHTML`, atributos

├── README.md            📖 Este arquivo- ✅ Sempre atualiza (garante consistência total)

├── README-FIX-IDS.md    📖 Documentação detalhada de IDs- 📦 Cobertura: 127 elementos

└── README-DEPLOY.md     📖 Documentação detalhada de deploy

```### 5. **fix-all-maps.js**

- 🗺️ Detecta arrays com `.map()`

---- 🔢 Gera índices dinâmicos `[${i}]`

- 🎯 Distingue objetos vs strings

## 🔄 Fluxo de Trabalho- 📦 Cobertura: 44 elementos em arrays



### Desenvolvimento Diário### 6. **clean-all-backups.cjs**

```bash- 🗑️ Remove backups antigos

pnpm dev    # IDs verificados automaticamente- 💾 Mantém 5 mais recentes

```- 📂 Processa `src/locales/pt-BR/` e `src/styles/pages/`



### Após Adicionar Elementos Editáveis---

```bash

pnpm fix-ids:fix## 🔄 Integração Automática

```

```bash

### Deploy# Ao rodar pnpm dev:

```bashpnpm dev

# Modo síncrono (ver progresso)  ↓

.\scripts\deploy.ps1 "mensagem do commit"predev (package.json)

  ↓

# Modo background (liberar terminal)init-assign-fix-ids.js

.\scripts\deploy.ps1 -b "mensagem do commit"  ↓ (se passou 24h)

```assign-ids-final.js

  ↓

---vite (dev server)

```

## 📊 Estatísticas

---

- **96 elementos editáveis** distribuídos em 6 páginas

- **2 scripts essenciais** (fix-ids.js, deploy.ps1)## ✅ Recursos Comuns

- **100% cobertura** - todos elementos têm data-json-key

- **Admin Panel**: `/436F6E736F6C45`- ✅ **Idempotentes**: Podem rodar múltiplas vezes sem problemas

- 🔒 **Backups**: Criados automaticamente antes de modificações

---- 👁️ **Dry-run**: Preview sem modificar (`--dry-run`)

- 🐛 **Verbose**: Modo debug (`--verbose`)

## 📚 Documentação Completa- 🎯 **Filtros**: Processar páginas específicas (`--page=Name`)



- **[README-FIX-IDS.md](./README-FIX-IDS.md)** - Detalhes do sistema de IDs---

- **[README-DEPLOY.md](./README-DEPLOY.md)** - Detalhes do sistema de deploy

## � Quando Executar Manualmente

---

**Situações que requerem execução manual**:

**Última Atualização:** 10/11/2025  

**Status:** Todos os scripts funcionais e otimizados  | Situação | Script | Comando |

**Complexidade:** Simplificado ao máximo|----------|--------|---------|

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

## 🚀 Deploy para GitHub Pages

### deploy.ps1 (Script Unificado)

Script único que suporta execução **síncrona** (padrão) ou **em background**.

#### Modo Síncrono (Padrão)
Bloqueia o terminal e mostra progresso em tempo real:

```bash
# Diretamente
.\scripts\deploy.ps1 "feat: nova funcionalidade"

# Via package.json (conflito com pnpm - use direto)
# pnpm deploy "mensagem"  # ⚠️ Não funciona (conflito pnpm)
```

#### Modo Background
Libera o terminal imediatamente, deploy continua em segundo plano:

```bash
# Forma longa
.\scripts\deploy.ps1 "fix: correcao" -Background

# Alias curto (recomendado)
.\scripts\deploy.ps1 "fix: correcao" -b

# Via package.json (mesmo problema)
# pnpm deploy:bg  # ⚠️ Não funciona (conflito pnpm)
```

#### Parâmetros

| Parâmetro | Tipo | Padrão | Alias | Descrição |
|-----------|------|--------|-------|-----------|
| `Message` | string | "deploy: atualizacao DD/MM/YYYY HH:mm" | - | Mensagem do commit |
| `-Background` | switch | false | `-b` | Executa em background |

#### Recursos

- ✅ Logs limpos sem códigos ANSI
- ✅ Encoding ASCII para compatibilidade
- ✅ Logs com timestamp: `deploy-YYYYMMDD-HHMMSS.log`
- ✅ Mantém apenas últimos 10 logs
- ✅ Feedback colorido no terminal (modo síncrono)
- ✅ Comandos úteis após execução (modo background)

#### Processo de Deploy

1. **Build**: `pnpm build` → Gera dist/
2. **Git Add**: `git add .` → Adiciona alterações
3. **Git Commit**: `git commit -m "mensagem"` → Cria commit
4. **Git Push**: `git push` → Envia para GitHub

#### Monitorar Deploy Background

```bash
# Ver progresso em tempo real
Get-Content logs\deploy-YYYYMMDD-HHMMSS.log -Tail 20 -Wait

# Ver log completo
Get-Content logs\deploy-YYYYMMDD-HHMMSS.log

# Listar todos os logs
Get-ChildItem logs\deploy-*.log
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
