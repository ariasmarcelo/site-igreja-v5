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

# Backup e Recuperação
pnpm backup              # Backup local simples
pnpm backup:commit       # Backup versionado no Git + GitHub
pnpm backup:email        # Backup via email (Gmail)
pnpm backup:list         # Listar backups disponíveis
pnpm restore:latest      # Restaurar último backup

# 📖 Ver documentação completa: docs/BACKUP-SYSTEM.md
# ⚡ Guia rápido: docs/BACKUP-QUICK-GUIDE.md
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

### Carregamento de Conteúdo

**Fonte única de verdade:** Supabase PostgreSQL

Todo conteúdo do site é carregado diretamente do Supabase através da API `/api/content-v2/[pageId]`.

**Fluxo simplificado:**
```
Usuário acessa página
    ↓
usePageContent() hook
    ↓
GET /api/content-v2/[pageId]
    ↓
API busca Supabase + cache LMDB
    ↓
Frontend renderiza com dados do DB
```

**Cache LMDB:**
- Cache em memória ultra-rápido (Lightning Memory-Mapped Database)
- Localização: `.cache/content-lmdb/`
- TTL: 5 minutos
- Reduz carga no Supabase em 90%+

**Benefícios:**
- ✅ Performance: cache local com validação automática
- ✅ Confiabilidade: dados sempre sincronizados com DB
- ✅ Escalabilidade: menos queries no Supabase
- ✅ Zero-config: cache gerenciado automaticamente

### APIs Serverless

**Localização:** `/api` folder

| API | Método | Propósito |
|-----|--------|-----------|
| `/api/content-v2` | GET | Buscar conteúdo de páginas + cache LMDB |
| `/api/save-visual-edits` | POST | Salvar edições do editor visual no Supabase |

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
│   ├── usePageContent.ts   # Hook para carregar conteúdo
│   ├── usePageStyles.ts    # Hook para carregar estilos
│   └── ...
└── lib/
    └── supabase.ts      # Cliente Supabase

api/
├── content-v2/
│   └── index.js         # GET conteúdo + cache LMDB
└── save-visual-edits.js # POST edições

scripts/
├── start-dev.ps1        # Iniciar servidor
├── stop-dev.ps1         # Parar servidor
├── deploy.ps1           # Deploy GitHub Pages
├── sync-*.js            # Scripts de sincronização DB
└── backup-supabase.js   # Backup completo do DB
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
| Conteúdo não carrega | Verificar `.env.local` com credenciais Supabase |
| Servidor não inicia | Verificar porta 3000 livre: `netstat -ano \| findstr :3000` |
| Cache LMDB corrompido | Remover pasta `.cache/content-lmdb/` |
| Rota 404 ao acessar diretamente | Verificar `vercel.json` rewrites e `public/404.html` desabilitado |

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
- ✅ **Cache LMDB** - Performance ultra-rápida com cache local
- ✅ **Conteúdo compartilhado** - Footer e elementos comuns (sistema `__shared__`)
- ✅ **Blog integrado** - Sistema completo de artigos com TipTap
- ✅ **Responsivo** - Design mobile-first
- ✅ **SEO otimizado** - Meta tags e robots.txt
- ✅ **Deploy automático** - CI/CD com GitHub Actions
- ✅ **TypeScript strict** - Tipagem forte em todo o projeto
- ✅ **Zero inline styles** - 100% CSS externo (Tailwind)
- ✅ **SPA routing** - BrowserRouter com fallback para todas as rotas

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

### Histórico de Mudanças

**v6.2 (14/11/2025):**
- ✅ Sistema de cache LMDB implementado (performance +90%)
- ✅ Fix crash LMDB com async/await pattern
- ✅ Rota `/quemsomos` padronizada (sem hífen)
- ✅ Desabilitado `public/404.html` que interferia com SPA routing
- ✅ Removido sistema de fallback granular (simplificação)
- ✅ Limpeza: 600+ arquivos JSON granulares desnecessários removidos
- ✅ Limpeza: 40+ scripts `.useless` de migrações antigas removidos

**Desenvolvido com ❤️ para a Igreja de Metatron 🕉️**

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
