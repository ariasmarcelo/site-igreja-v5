# Site Igreja de Metatron

> **Portal de Purificação e Ascensão Espiritual**

Site institucional desenvolvido com React 19, TypeScript 5.7, Tailwind CSS 4 e Supabase PostgreSQL.

**🌐 Produção:** https://ariasmarcelo.github.io/site-igreja-v6/

---

## 🚀 Stack Tecnológica

### Frontend
- **Vite 7.2** - Build tool e dev server ultrarrápido
- **React 19** - Framework UI moderno
- **TypeScript 5.7** - Tipagem estática forte
- **Tailwind CSS 4** - Framework de estilização moderno
- **Shadcn/UI** - Componentes acessíveis e customizáveis
- **React Router 7** - Navegação SPA (basename: `/site-igreja-v6`)
- **TipTap** - Editor de texto rico para blog

### Backend
- **Vercel Serverless Functions** - APIs em Node.js
- **Supabase PostgreSQL** - Database cloud (única fonte da verdade)
- **Sistema de Fallback Granular** - Auto-sincronização DB → JSONs locais

### Ferramentas
- **pnpm** - Package manager rápido
- **Node.js v24.11.0** - Runtime
- **PowerShell** - Scripts de automação

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/ariasmarcelo/site-igreja-v6.git
cd site-igreja-v6/workspace/shadcn-ui

# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase
```

### Variáveis de Ambiente

Crie `.env.local` na raiz do projeto:

```env
# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon

# Supabase Service Role (para scripts admin)
SUPABASE_SERVICE_KEY=sua_service_key

# Base URL (produção)
VITE_BASE_URL=/site-igreja-v6/
```

**⚠️ Não commite `.env.local`!** Use `.env.example` como template.

---

## 🛠️ Desenvolvimento Local

### Iniciar Servidor

O projeto usa **Vercel Dev** que serve frontend E APIs em **uma única porta (3000)**, simulando o ambiente de produção.

```bash
# Método 1: Script automatizado (recomendado)
.\start-dev.ps1

# Método 2: Direto
vercel dev
```

**URLs disponíveis:**
- 🌐 Frontend: http://localhost:3000/
- 🔌 APIs: http://localhost:3000/api/*
- 🛠️ Admin Console: http://localhost:3000/436F6E736F6C45

### Parar Servidor

```bash
.\stop-dev.ps1
```

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Alias para vercel dev

# Build
pnpm build            # Gera dist/ para produção
pnpm preview          # Preview do build local

# Deploy
pnpm deploy           # Deploy para GitHub Pages

# Manutenção
pnpm backup           # Backup completo do Supabase
pnpm list-backups     # Listar backups disponíveis
pnpm restore:latest   # Restaurar último backup
```

---

## 🏗️ Arquitetura

### Fonte Única: Supabase PostgreSQL

Todo conteúdo do site é carregado **exclusivamente do Supabase**. Estrutura granular:

**Tabela:** `text_entries`
```sql
CREATE TABLE text_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,           -- 'Index', 'Purificacao', ou '__shared__'
  json_key TEXT UNIQUE NOT NULL,   -- 'Index.hero.title' ou 'footer.copyright'
  content JSONB NOT NULL,          -- {"pt-BR": "texto"}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Conceitos importantes:**
- `page_id = "__shared__"` → Conteúdo compartilhado (ex: footer em todas as páginas)
- `json_key` com prefixo → Conteúdo específico da página (ex: `Index.hero.title`)
- `json_key` sem prefixo → Conteúdo compartilhado (ex: `footer.copyright`)

### Sistema de Fallback Granular

Sistema de três camadas com **auto-sincronização transparente**:

1. **Supabase** - Fonte primária sempre consultada primeiro
2. **JSONs Granulares** - Backup/cache em `src/locales/pt-BR/` (um arquivo por campo)
3. **Props Defaults** - Valores hardcoded nos componentes (último recurso)

**Fluxo:**
```
Usuário acessa página
    ↓
API busca Supabase (text_entries)
    ↓
Frontend renderiza com dados do DB
    ↓
BACKGROUND: POST /api/sync-fallbacks
    ↓
Cria/atualiza JSONs individuais
    (ex: Index.hero.title.json)
```

**Benefícios:**
- ✅ Cache automático zero-config
- ✅ Desenvolvimento offline possível
- ✅ Histórico granular no git (diff por campo)
- ✅ Performance (comparação inteligente, só escreve se mudou)

**Documentação completa:** [docs/GRANULAR-FALLBACK-SYSTEM-V2.md](./docs/GRANULAR-FALLBACK-SYSTEM-V2.md)

### APIs Serverless

**Localização:** `/api` folder

| API | Método | Propósito |
|-----|--------|-----------|
| `/api/content-v2/[pageId]` | GET | Buscar conteúdo de página + shared |
| `/api/save-visual-edits` | POST | Salvar edições do editor visual |
| `/api/sync-fallbacks` | POST | Sincronizar JSONs granulares |

### Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Shadcn/UI components
│   ├── PageLoader.tsx   # Loading/error states
│   ├── SharedFooter.tsx # Footer compartilhado
│   └── ...
├── pages/               # 10 páginas React
│   ├── Index.tsx
│   ├── Purificacao.tsx
│   ├── QuemSomos.tsx
│   └── ...
├── hooks/
│   ├── useLocaleTexts.ts   # Hook para carregar conteúdo
│   └── ...
├── lib/
│   └── supabase.ts      # Cliente Supabase
└── locales/pt-BR/       # JSONs granulares (auto-gerados)
    ├── Index.hero.title.json
    ├── Purificacao.psicodelicos.title.json
    └── ...

api/
├── content-v2/[pageId].js    # GET conteúdo
├── save-visual-edits.js      # POST edições
└── sync-fallbacks.js         # POST fallbacks

scripts/
├── start-dev.ps1        # Iniciar servidor
├── stop-dev.ps1         # Parar servidor
├── deploy.ps1           # Deploy GitHub Pages
└── ...
```

---

## 🎨 Admin Console

**URL:** http://localhost:3000/436F6E736F6C45

Editor visual de conteúdo que permite editar todos os textos do site diretamente no navegador.

**Como usar:**
1. Inicie servidor: `.\start-dev.ps1`
2. Acesse Admin Console
3. Ative modo de edição
4. Clique nos textos para editar
5. Salve (atualiza Supabase automaticamente)
6. Página recarrega com novo conteúdo

**Requisitos:**
- ✅ Servidor rodando (`vercel dev`)
- ✅ Variáveis de ambiente configuradas
- ✅ Conexão com Supabase

---

## 🌐 Deploy

### GitHub Pages (Automático)

O projeto possui GitHub Actions que faz deploy automaticamente após push para `main`.

**Deploy manual:**
```bash
# Build + commit + push
pnpm deploy

# Ou passo a passo:
pnpm build
git add dist/
git commit -m "Deploy: nova versão"
git push origin main
```

**⚠️ Após deploy:** CTRL+F5 (hard refresh) para limpar cache do navegador!

**URL de Produção:** https://ariasmarcelo.github.io/site-igreja-v6/

### Vercel (Backend API - Opcional)

Veja instruções detalhadas em: [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)

```bash
vercel --prod
```

---

## 🔧 Troubleshooting

| Problema | Solução |
|----------|---------|
| Conteúdo antigo após deploy | **CTRL+F5** (hard refresh) |
| Página em branco | Verificar `basename` no Router = `/site-igreja-v6` |
| JSONs não sincronizam | Verificar logs do console, API `/api/sync-fallbacks` |
| Servidor não inicia | Verificar porta 3000 livre: `netstat -ano \| findstr :3000` |
| Warnings `UV_HANDLE_CLOSING` | **Ignorar** (bug conhecido do Node v24 no Windows) |

---

## 📚 Documentação

- **[COPILOT-INSTRUCTIONS.md](./COPILOT-INSTRUCTIONS.md)** - Instruções completas do projeto (LEIA PRIMEIRO!)
- **[docs/GRANULAR-FALLBACK-SYSTEM-V2.md](./docs/GRANULAR-FALLBACK-SYSTEM-V2.md)** - Sistema de fallback detalhado
- **[DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)** - Deploy do backend na Vercel
- **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)** - Configuração do Supabase
- **[DATA_JSON_KEY_NAMING_CONVENTION.md](./DATA_JSON_KEY_NAMING_CONVENTION.md)** - Convenções

---

## 🌟 Recursos

- ✅ **Editor visual de conteúdo** - Edite textos diretamente no site
- ✅ **Sistema de fallback granular** - Auto-sincronização DB → JSONs
- ✅ **Conteúdo compartilhado** - Footer e elementos comuns (sistema `__shared__`)
- ✅ **Blog integrado** - Sistema completo de artigos com TipTap
- ✅ **Responsivo** - Design mobile-first
- ✅ **SEO otimizado** - Meta tags e robots.txt
- ✅ **Deploy automático** - CI/CD com GitHub Actions
- ✅ **TypeScript strict** - Tipagem forte em todo o projeto
- ✅ **Zero inline styles** - 100% CSS externo (Tailwind)

---

## 🌟 Conceito Espiritual

**Igreja de Metatron** - Portal de transformação espiritual através de 3 fases:

1. **Purificação** - Limpeza energética, traumas, padrões limitantes
2. **Aprofundamento** - Intensificação, expansão de consciência
3. **Iniciação Final** - Ativação do Antahkarana (ponte de luz)

**Antahkarana (अन्तःकरण):**  
Canal espiritual entre personalidade e Eu Superior. Construído através da meditação, purificação e evolução consciente. Regulação do sistema nervoso autônomo é pré-requisito para avanço espiritual verdadeiro.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adicionar funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra Pull Request

**Padrão de commits:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` atualização de documentação
- `refactor:` refatoração de código
- `chore:` tarefas de manutenção

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

© 2025 Igreja de Metatron. Todos os direitos reservados.

---

## 🔗 Links

- **Site:** https://ariasmarcelo.github.io/site-igreja-v6/
- **Repositório:** https://github.com/ariasmarcelo/site-igreja-v6
- **Supabase:** https://laikwxajpcahfatiybnb.supabase.co

---

**Última atualização:** 14 de novembro de 2025

**Desenvolvido com ❤️ para a Igreja de Metatron 🕉️**

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
