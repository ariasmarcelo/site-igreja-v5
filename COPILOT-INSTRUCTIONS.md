# SEÇÃO PÉTREA #

Neste documento, criado pelo usuário, existem seções chamadas PÉTREAS, as quais não podem ser removidas ou modificadas. Elas devem ser respeitadas até o ponto em que você pergunte ao usuário se aquilo pode ser quebrado em algum contexto atual ou futuro.

Este documento deve ser lido, compreendido e atualizado durante o trabalho com informações de ordem estrutural sobre o projeto e o estado atual do desenvolvimento, como: Em que ponto se está na modificação ou implementação em curso. Desta forma, até que se estabilize uma versão, estes textos de status devem estar na seção "STATUS INTERNO", mais ao final deste documento.

## Propósito ##

Desenvolver site institucional para a Igreja de Metatron, que se descreve em seu conteúdo, junto de um sistema de edição dinâmica de todos os textos. Para isso, esses dados ficam em banco de dados e são acessíveis por um sistema de edição destes dados que precisa ser encontrado e compreendido. Este sistema, da forma como hoje foi implementado, é uma interface gráfica React que abre em si a página a editar e permite acessar e atualizar os dados editáveis (conteúdo textual armazenado em JSONs).

O que buscamos expressar e esclarecer no conteúdo do site é que compreendemos que não pode haver cura e realização espiritual final e completa enquanto, em primeiro lugar, não houver regulação completa homeostática e equilíbrio dinâmico e harmônico do sistema nervoso autônomo. Isso ocorre porque, tendo o indivíduo passado por experiências muito traumatizantes, o sistema de defesa do corpo se ativa de forma excessivamente intensa e crônica; assim, fechando canais de informação entre as partes internas de si e fixando formas socialmente e espiritualmente disfuncionais, de ser e estar a cada momento. Reverter essa situação, para que então possa haver avanço espiritual real, é o foco e objetivo principal do trabalho da Igreja de Metatron. A partir disso, o site deve expressar os conceitos e práticas que levem a esta regulação, que é a base para qualquer avanço espiritual verdadeiro e duradouro.

## FIM Propósito ##

## Instruções Gerais ##

> **Visualizar site e ler TODO o conteúdo atual do site de Frontend para melhor compreensão de seus propósitos humanos e do que pode ser melhorado nos textos.**

> **Sempre que iniciar uma sessão, leia este documento por completo.**

> **Leia e compreenda todos os documentos (.md) deste pacote.**

> **Sempre sugerir melhorias para o conteúdo dos textos do site. Mas NUNCA modificar os textos do site sem consultar o editor, o usuário.**

> **Sempre avalie todo o conteúdo deste documento de forma a melhorá-lo, mas sem adicionar conteúdo irrelevante.**

> **Sempre que aprender algo novo, atualize este documento com as novas informações.**

> **Nunca liste documentos ou instruções HARDCODED neste documento. Oriente conceitualmente sobre o que e onde procurar a informação dentro do pacote físico real. Isso inclui, mas não se limita a, nomes de arquivos, caminhos de diretórios e estruturas de pastas.**

> **Encontre todos os scripts de automação existentes, analise suas funções e mantenha-os em mente para quando for necessário usá-los.**

> **Com seu contexto interno restaurado, faça: "Escreva um resumo para o usuário sobre o projeto, stack tecnológica, últimas mudanças importantes e estado atual do desenvolvimento."**

> **Sempre que possível, sugira melhorias para os scripts de automação existentes.**

> **Sempre que iniciar uma sessão, releia todos os backups dos arquivos do projeto por completo. Isto serve para que suas novas ações possam compreender melhor o histórico e a direção em que tudo evoluiu.**

> **Escreva sempre backups de todos os arquivos locais modificados, especialmente quando forem de conteúdo proprietário deste pacote. Mantenha cinco versões anteriores em histórico. Caso algo dê errado, possamos restaurar uma versão anterior do arquivo.**

> **Nunca remova ou modifique as seções PÉTREAS deste documento. Sempre pergunte ao usuário se pode quebrar alguma delas, em algum contexto atual ou futuro.**

> **Ao escrever código, sempre siga as boas práticas de desenvolvimento, incluindo: código limpo, modularidade, comentários claros e consistentes, tratamento de erros adequado e completo e testes quando aplicável.**

> **Quando for atualizar um documento deste projeto, seja qual for, releia integralmente o documento a ser modificado e o reescreva todo do zero para evitar incoerências e duplicidades. Sempre mantenha o melhor estilo de escrita.**

> **Mantenha sempre atualizado o bloco "DADOS BÁSICOS GERAIS" mais abaixo neste documento.**

> **Sempre que possível, escreva testes automatizados para o código que você escrever.**

> **Sempre que possível, utilize e recomende o uso de boas práticas de segurança, incluindo, mas não se limitando a: validação e sanitização de entradas, uso de HTTPS, autenticação e autorização adequadas, proteção contra ataques comuns (XSS, CSRF, SQL Injection), gerenciamento seguro de senhas e dados sensíveis, atualizações regulares de dependências e bibliotecas, monitoramento e logging de atividades suspeitas.**

> **Sempre que possível, escreva documentação clara e concisa para o código que você escrever, incluindo comentários no código, documentação de API, guias de uso e exemplos práticos.**

> **Sempre que possível, escreva código otimizado para desempenho e escalabilidade, considerando aspectos como complexidade algorítmica, uso eficiente de recursos, cacheamento, balanceamento de carga e arquitetura escalável.**

> **Seja extremamente criterioso ao revisar o código existente, procurando por bugs, vulnerabilidades de segurança, ineficiências e oportunidades de melhoria. Sempre sugira melhorias quando encontrar algo que possa ser aprimorado.**

> **Seja extremamente criterioso ao analisar causalidades, não permitindo passar incoerências nos comportamentos do sistema. Sempre que encontrar algo incoerente, questione o usuário sobre o que fazer a respeito.**

> **Sempre corrija erros de digitação em todos os documentos deste pacote.**

> **Nunca use abreviações informais ou gírias em documentos técnicos. Sempre escreva de forma clara, formal e profissional.**

> **Nunca use nomes "padrão" destes ambientes, mas use nomes DESCRITIVOS do que aquilo faz para alguém que não conheça os tais padrões, do tipo: "dev", "server" e essas coisas.**

> **Devemos SEMPRE buscar soluções definitivas e duradouras para os problemas, evitando "gambiarras" ou soluções temporárias que possam comprometer a qualidade e a manutenção do código a longo prazo.**

> **SEMPRE verifique o caminho do comando que deseja executar e USE esse caminho para a execução.**

> **Para que possamos iniciar e matar o servidor web local de desenvolvimento corretamente, SEMPRE use os scripts de automação existentes. Nunca inicie ou pare o servidor manualmente. Faça com que esses scripts lancem o servidor em background.**

> **NUNCA insira 'emojis' ou caracteres 'especiais' nos scripts e comandos.**

## FIM Instruções Gerais ##

# FIM DA SEÇÃO PÉTREA #

---

## DADOS BÁSICOS GERAIS ##

### Stack Tecnológica ###

**Frontend:**
- React 19 + TypeScript 5.7
- Vite 7.2 (build tool e dev server)
- Tailwind CSS 4 (styling framework)
- React Router 7 (navegação SPA)
- TipTap (rich text editor para blog)

**Backend/APIs:**
- Vercel Serverless Functions (Node.js, CommonJS)
- APIs em `/api` folder servidas pelo Vercel Dev local e Vercel Cloud em produção

**Database:**
- Supabase (PostgreSQL)
- Tabela `text_entries` com estrutura granular:
  - `id` (UUID)
  - `page_id` (TEXT) - nome da página ou "__shared__" para conteúdo compartilhado
  - `json_key` (TEXT UNIQUE) - chave completa tipo "pagina.secao.campo" ou "footer.copyright"
  - `content` (JSONB) - objeto multi-idioma `{"pt-BR": "texto"}`

**Hospedagem:**
- Vercel (frontend + serverless APIs)
- GitHub (repositório: ariasmarcelo/site-igreja-v6)
- Branch principal: `main`

**Ferramentas:**
- pnpm (package manager)
- Node v24.11.0 (desenvolvimento local)
- PowerShell (scripts de automação)

---

### Sistema de Fallback Granular JSON ###

**Propósito:**
Criar resiliência e cache automático mantendo três camadas de dados:
1. **Supabase (fonte primária)** - Database cloud sempre consultado primeiro
2. **JSONs granulares locais (fallback ativo)** - Um arquivo por campo em `src/locales/pt-BR/`
3. **Props defaults (último recurso)** - Valores hardcoded nos componentes React

**Fluxo de Auto-Sincronização:**

```
PASSO 1: Usuário acessa página (ex: /purificacao)
    ↓
PASSO 2: Hook useLocaleTexts executa
    ↓
PASSO 3: Chama GET /api/content-v2/Purificacao
    ↓
PASSO 4: API consulta Supabase
         SELECT * FROM text_entries 
         WHERE page_id IN ('Purificacao', '__shared__')
    ↓
PASSO 5: API reconstrói objeto JSON a partir das entradas granulares
         Exemplo: { hero: { title: "Purificação", subtitle: "..." }, footer: { ... } }
    ↓
PASSO 6: API retorna objeto completo para frontend
    ↓
PASSO 7: Frontend renderiza página COM DADOS DO DB (estado loading → loaded)
    ↓
PASSO 8: Em BACKGROUND (async, não bloqueia UI):
         useLocaleTexts chama POST /api/sync-fallbacks
         Envia objeto completo da página
    ↓
PASSO 9: API sync-fallbacks percorre objeto recursivamente
         Para cada campo cria/atualiza arquivo JSON individual
    ↓
PASSO 10: Comparação inteligente antes de escrever:
          - Lê arquivo existente (se houver)
          - Compara JSON.stringify(novo) === JSON.stringify(existente)
          - Se diferente: atualiza arquivo
          - Se igual: ignora (evita writes desnecessários)
```

**Nomenclatura de Arquivos:**

| Tipo de Dado | Chave JSON | Nome do Arquivo |
|--------------|------------|-----------------|
| Campo simples | `hero.title` | `PageName.hero.title.json` |
| Campo aninhado | `hero.cta.text` | `PageName.hero.cta.text.json` |
| Item de array | `testimonials[0].name` | `PageName.testimonials[0].name.json` |
| Objeto complexo | `sections[1].content.text` | `PageName.sections[1].content.text.json` |
| Conteúdo compartilhado | `footer.copyright` | `Footer.copyright.json` |

**Exemplo Prático:**

Database retorna:
```json
{
  "hero": {
    "title": "Purificação",
    "subtitle": "Ritual sagrado de limpeza"
  },
  "testimonials": [
    { "name": "Maria", "text": "Transformador!" },
    { "name": "João", "text": "Incrível!" }
  ]
}
```

API sync-fallbacks cria:
```
src/locales/pt-BR/
  Purificacao.hero.title.json          → "Purificação"
  Purificacao.hero.subtitle.json       → "Ritual sagrado de limpeza"
  Purificacao.testimonials[0].name.json → "Maria"
  Purificacao.testimonials[0].text.json → "Transformador!"
  Purificacao.testimonials[1].name.json → "João"
  Purificacao.testimonials[1].text.json → "Incrível!"
```

**Diretório de Fallbacks:**
- Caminho absoluto: `c:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui\src\locales\pt-BR\`
- Caminho relativo (workspace): `src/locales/pt-BR/`
- Todos os arquivos commitados no git para histórico completo

**Benefícios:**
- ✅ **Cache automático** - Sem configuração, funciona out-of-the-box
- ✅ **Desenvolvimento offline** - Se DB cair, carregar dos JSONs locais (fallback)
- ✅ **Backup incremental** - Cada edição gera arquivo versionado no git
- ✅ **Histórico granular** - Git diff mostra exatamente qual campo mudou
- ✅ **Performance** - Só escreve quando conteúdo realmente muda (comparação inteligente)
- ✅ **Debugging facilitado** - Ver valor de campo específico sem consultar DB
- ✅ **Resiliência** - Três camadas de dados (DB → JSON → defaults)

**Arquivos do Sistema:**
- `/api/sync-fallbacks.js` - Serverless function que cria/atualiza JSONs
- `src/hooks/useLocaleTexts.ts` - Hook que dispara sincronização após leitura DB
- `src/locales/pt-BR/*.json` - Arquivos de fallback (gerados automaticamente)

**Documentação Completa:**
- 📄 `docs/GRANULAR-FALLBACK-SYSTEM-V2.md` - Documentação detalhada com fluxogramas, exemplos práticos, troubleshooting e changelog completo

---

### Arquitetura do Sistema ###

**Fluxo de Dados com Fallback Granular:**
1. **Frontend carrega página** → hook `useLocaleTexts` busca dados via `/api/content-v2/[pageId]`
2. **API busca Supabase** → `text_entries` com `page_id IN (pageId, '__shared__')`
3. **API reconstrói objeto** → a partir das entradas granulares
4. **Frontend renderiza** → componente com dados do DB
5. **Sincronização automática** → API `/api/sync-fallbacks` salva JSONs granulares locais em background

**Sistema de Fallback Granular:**

Cada campo editável do site é armazenado em três locais:
1. **Supabase (fonte primária)** - Database PostgreSQL cloud
2. **JSONs granulares locais (fallback)** - Um arquivo JSON por campo em `src/locales/pt-BR/`
3. **Props defaults hardcoded (último recurso)** - Valores padrão nos componentes

**Comportamento:**
- Sempre tenta carregar do Supabase primeiro
- Se DB retorna dados, dispara sincronização em background dos JSONs granulares
- Sincronização compara valor do DB com JSON local: se igual ignora, se diferente atualiza
- JSONs granulares servem como cache offline e backup
- Estrutura: `PageName.caminho.do.campo.json` (ex: `Index.hero.title.json`)

**Exemplo de Sincronização:**
```
Supabase retorna: { hero: { title: "Igreja de Metatron", subtitle: "..." } }
↓
API sync-fallbacks cria/atualiza:
- src/locales/pt-BR/Index.hero.title.json → "Igreja de Metatron"
- src/locales/pt-BR/Index.hero.subtitle.json → "..."
```

**Editor Visual:**
- Modo de edição ativado via Admin Console
- Detecta elementos com `data-json-key` atributo
- Edições enviadas via `/api/save-visual-edits` (POST)
- Salva individualmente cada campo modificado como entrada granular no Supabase
- Após salvar, sincronização automática atualiza JSONs locais correspondentes

**Conteúdo Compartilhado:**
- Footer e outros elementos comuns presentes em todas as páginas
- Salvo com `page_id = "__shared__"` e `json_key` sem prefixo de página (ex: `"footer.copyright"`)
- API de leitura mescla automaticamente conteúdo compartilhado com conteúdo específico da página
- JSONs de fallback seguem mesmo padrão: `Footer.copyright.json`, `Footer.trademark.json`

### Estrutura de Pastas Relevante ###

```
workspace/shadcn-ui/
├── api/                          # Serverless Functions (Vercel)
│   ├── content-v2/[pageId].js   # GET endpoint para conteúdo de página
│   ├── save-visual-edits.js     # POST endpoint para salvar edições
│   └── test.js                  # Test endpoint
├── src/
│   ├── components/              # Componentes React
│   │   ├── SharedFooter.tsx    # Footer compartilhado
│   │   ├── WhatsAppButton.tsx  # Botão flutuante WhatsApp
│   │   ├── VisualPageEditor.tsx # Editor visual de conteúdo
│   │   └── ui/                 # Componentes Shadcn UI
│   ├── pages/                   # Páginas do site
│   │   ├── Index.tsx           # Página inicial
│   │   ├── Purificacao.tsx     # Página Purificação e Ascensão
│   │   ├── QuemSomos.tsx       # Página Quem Somos
│   │   ├── Tratamentos.tsx     # Página Tratamentos
│   │   ├── Testemunhos.tsx     # Página Testemunhos
│   │   ├── Contato.tsx         # Página Contato
│   │   └── AdminConsole.tsx    # Painel administrativo
│   ├── hooks/
│   │   └── useLocaleTexts.ts   # Hook para carregar textos do DB
│   ├── config/
│   │   └── api.ts              # Configuração de endpoints da API
│   ├── styles/                  # CSS files
│   │   ├── purificacao-page.css
│   │   ├── quemsomos-page.css
│   │   ├── tratamentos-page.css
│   │   └── design-tokens.css
│   ├── Navigation.tsx           # Navegação principal
│   └── main.tsx                 # Entry point
├── scripts/                     # Scripts de automação e migração
├── docs/                        # Documentação técnica
│   └── API-SERVERLESS-CONFIG.md
├── .env                         # Variáveis de ambiente (Vercel Dev)
├── .env.local                   # Variáveis de ambiente (Vite)
├── start-dev.ps1               # Script para iniciar servidor local
└── stop-dev.ps1                # Script para parar servidor local
```

### Variáveis de Ambiente ###

**Arquivo `.env` (para Vercel Dev - APIs serverless):**
```
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=<chave_anonima>
SUPABASE_SERVICE_KEY=<chave_service_role>
```

**Arquivo `.env.local` (para Vite - Frontend):**
```
VITE_SUPABASE_URL=https://laikwxajpcahfatiybnb.supabase.co
VITE_SUPABASE_ANON_KEY=<chave_anonima>
VITE_API_URL=
```

**Importante:** `VITE_API_URL` deve estar **vazio** (`''`) para usar caminhos relativos, permitindo que APIs funcionem tanto local quanto em produção sem mudanças.

### Scripts de Automação ###

**`start-dev.ps1`** - Inicia servidor de desenvolvimento:
- Limpa processos Node antigos
- Inicia Vercel Dev (porta 3000 por padrão)
- Serve frontend + APIs serverless no mesmo origin

**`stop-dev.ps1`** - Para servidor de desenvolvimento:
- Mata processos Vercel Dev e Node relacionados

**Uso:**
```powershell
.\start-dev.ps1
.\stop-dev.ps1
```

### Padrões e Convenções ###

**Naming de JSON Keys:**
- Páginas: `pagina.secao.campo` (ex: `purificacao.hero.title`)
- Compartilhado: `secao.campo` (ex: `footer.copyright`)
- Arrays: `pagina.items[0].campo` (ex: `tratamentos.items[0].title`)

**Componentes de Página:**
- Sempre importar `useLocaleTexts` para carregar dados
- Sempre usar `data-json-key` para campos editáveis
- CSS externo seguindo estrutura ITCSS (nunca inline styles)

**⚠️ REGRA PÉTREA - ARQUITETURA CSS ITCSS ⚠️**

**NUNCA VIOLE ESTAS REGRAS:**

1. **Proibido estilos inline:** JAMAIS use `style={{...}}` em componentes React
2. **Estrutura ITCSS obrigatória:** Todos os CSS devem seguir a organização abaixo
3. **Ponto de entrada único:** `src/styles.css` (importado em `main.tsx`)

**Estrutura de Diretórios (IMUTÁVEL):**
```
src/styles/
├── settings/       # 1️⃣ Variáveis CSS e design tokens
│   └── design-tokens.css
├── base/          # 2️⃣ Estilos HTML base (body, h1-h6, etc)
│   └── elements.css
├── components/    # 3️⃣ Componentes reutilizáveis
│   ├── visual-editor.css
│   └── testimonials-carousel.css
├── layouts/       # 4️⃣ Layouts e páginas
│   ├── admin-console.css
│   └── pages/
│       ├── index.css
│       ├── quemsomos.css
│       ├── contato.css
│       ├── purificacao.css
│       ├── tratamentos.css
│       ├── testemunhos.css
│       └── artigos.css
└── utilities/     # 5️⃣ Classes utilitárias
    └── helpers.css
```

**Ordem de Especificidade (Cascata):**
Settings → Base → Components → Layouts → Utilities (genérico → específico)

**Como Importar CSS em Componentes:**
```tsx
// ✅ CORRETO - Páginas
import '@/styles/layouts/pages/nome-da-pagina.css'

// ✅ CORRETO - Componentes
import '@/styles/components/nome-do-componente.css'

// ❌ ERRADO - Caminhos antigos
import '@/styles/nome-page.css'
```

**Caminhos dos Imports no styles.css:**
```css
/* ✅ CORRETO */
@import "./styles/settings/design-tokens.css";
@import "./styles/base/elements.css";

/* ❌ ERRADO */
@import "./settings/design-tokens.css";
```

**Nomenclatura:**
- Páginas: `layouts/pages/{nome-pagina}.css`
- Componentes: `components/{nome-componente}.css`
- Classes: Use BEM ou utility classes (`.card-elevated`, `.btn-gold`)

**Documentação CSS Completa:**
- `src/styles/README.md` - Arquitetura ITCSS completa
- `src/styles/QUICK-GUIDE.md` - Guia rápido de uso
- `src/styles/SUMMARY.md` - Resumo executivo

**CHECKLIST ao Adicionar CSS:**
- [ ] Arquivo criado no diretório correto da estrutura ITCSS?
- [ ] Importado em `styles.css` na ordem correta?
- [ ] Usa variáveis CSS (`var(--gold-500)`)?
- [ ] Import correto no componente React?
- [ ] Sem estilos inline (`style={{...}}`)?
- [ ] Nome de classe descritivo (BEM)?

**EM CASO DE DÚVIDA:**
1. Consulte `src/styles/QUICK-GUIDE.md`
2. Veja fluxograma de decisão no guia
3. Nunca quebre a estrutura ITCSS

**APIs Serverless:**
- CommonJS (`require/module.exports`)
- CORS habilitado
- Error handling completo
- Logs informativos (mas não excessivos)

### Estado Atual do Desenvolvimento ###

**Última Atualização: 14/11/2025**

**Funcionalidades Implementadas:**
- ✅ Sistema de conteúdo granular com Supabase
- ✅ Editor visual de conteúdo inline
- ✅ Footer compartilhado entre páginas (`__shared__`)
- ✅ APIs serverless funcionando local e produção
- ✅ Todas as páginas principais criadas e estilizadas
- ✅ Botão flutuante WhatsApp com animação e sombra
- ✅ Remoção completa de inline styles (CSS externo)
- ✅ Sistema de navegação SPA com React Router

**Últimas Mudanças:**
- **Sistema de fallback granular implementado:** Auto-sincronização de DB para JSONs individuais por campo
  - Cada leitura do DB dispara sincronização em background via `/api/sync-fallbacks`
  - JSONs salvos em `src/locales/pt-BR/` com nomenclatura `PageName.field.subfield.json`
  - Comparação inteligente: só atualiza se conteúdo mudou
  - Suporta arrays com notação `[index]` no nome do arquivo
- Implementado sistema de conteúdo compartilhado (`page_id = "__shared__"`)
  - API detecta campos `footer.*` e roteia para `page_id = "__shared__"`
  - API de leitura mescla conteúdo compartilhado com página específica
- Footer agora é compartilhado entre todas as páginas e editável pelo editor visual
- Removidos backups antigos e arquivos obsoletos (13 arquivos, 7.737 linhas)
- Adicionada sombra projetada no botão WhatsApp flutuante com animação dinâmica
- Corrigida mensagem do botão WhatsApp na página Contato
- Logs de debug reduzidos nas APIs para melhor legibilidade

**Problemas Conhecidos:**
- Node v24.11.0 gera warning `UV_HANDLE_CLOSING` no Windows (bug do Node, não afeta funcionalidade)
- Warning pode ser ignorado com segurança

**Próximos Passos Sugeridos:**
- Implementar autenticação para Admin Console
- Adicionar sistema de versionamento de conteúdo
- Criar mais páginas de conteúdo (Artigos, Blog)
- Implementar SEO tags dinâmicas
- Adicionar analytics

## FIM DADOS BÁSICOS GERAIS ##

---

