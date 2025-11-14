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

### Arquitetura do Sistema ###

**Fluxo de Dados:**
1. Frontend carrega página → hook `useLocaleTexts` busca dados via `/api/content-v2/[pageId]`
2. API busca `text_entries` com `page_id IN (pageId, '__shared__')` do Supabase
3. API reconstrói objeto JSON a partir das entradas granulares
4. Frontend renderiza componente com dados

**Editor Visual:**
- Modo de edição ativado via Admin Console
- Detecta elementos com `data-json-key` atributo
- Edições enviadas via `/api/save-visual-edits` (POST)
- Salva individualmente cada campo modificado como entrada granular

**Conteúdo Compartilhado:**
- Footer presente em todas as páginas
- Salvo com `page_id = "__shared__"` e `json_key = "footer.copyright"` / `"footer.trademark"`
- API de leitura mescla automaticamente conteúdo compartilhado com conteúdo da página

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
- CSS externo em arquivos `*-page.css` (nunca inline styles)

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
- Implementado sistema de conteúdo compartilhado (`page_id = "__shared__"`)
- Footer agora é compartilhado entre todas as páginas e editável pelo editor visual
- Removidos backups antigos e arquivos obsoletos
- Adicionada sombra projetada no botão WhatsApp flutuante
- Corrigida mensagem do botão WhatsApp na página Contato
- Logs de debug reduzidos nas APIs

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

