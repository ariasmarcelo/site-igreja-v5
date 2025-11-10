# Site Igreja Meta# Site Igreja Meta



Site institucional desenvolvido com React, TypeScript, Tailwind CSS 4 e Supabase.Site institucional desenvolvido com React, TypeScript, Tailwind CSS 4 e Supabase.



## 🌐 Demo## 🌐 Demo



**Site:** https://ariasmarcelo.github.io/site-igreja-v6/**Site:** https://ariasmarcelo.github.io/site-igreja-v6/



## 🚀 Tecnologias## 🚀 Tecnologias



- **Vite 7.2** - Build tool ultrarrápido- **Vite 7.2** - Build tool ultrarrápido

- **React 19** - Framework UI- **React 19** - Framework UI

- **TypeScript 5** - Tipagem estática- **TypeScript 5** - Tipagem estática

- **Tailwind CSS 4** - Estilização moderna- **Tailwind CSS 4** - Estilização moderna

- **Shadcn/UI** - Componentes acessíveis- **Shadcn/UI** - Componentes acessíveis

- **Lucide React** - Ícones- **Lucide React** - Ícones

- **React Router 7** - Navegação- **React Router 7** - Navegação

- **Tiptap** - Editor de texto rico- **Tiptap** - Editor de texto rico

- **Supabase** - Backend (PostgreSQL)- **Supabase** - Backend (PostgreSQL)



## 📦 Instalação## 📦 Instalação



```bash```bash

pnpm installpnpm install

``````



## 🛠️ Desenvolvimento## 🛠️ Desenvolvimento



```bash```bash

# Servidor de desenvolvimento (frontend)# Servidor de desenvolvimento (frontend)

pnpm devpnpm dev

# Acesse: http://localhost:8080# Acesse: http://localhost:8080



# Backend API (opcional)# Backend API (opcional)

pnpm serverpnpm server

# Acesse: http://localhost:3001# Acesse: http://localhost:3001

``````



## 🏗️ Build## 🏗️ Build



```bash```bash

pnpm buildpnpm build

``````



Os arquivos de produção serão gerados na pasta `dist/`Os arquivos de produção serão gerados na pasta `dist/`



## 🌐 Deploy## 🌐 Deploy



### GitHub Pages (Automático)### GitHub Pages (Recomendado)



**Opção 1: Deploy em background (recomendado)**Veja instruções completas no arquivo [DEPLOY.md](./DEPLOY.md)

```bash

pnpm deploy:bg

```

Deploy roda em segundo plano, você pode continuar trabalhando.```bash**Resumo:**



**Opção 2: Deploy síncrono**pnpm build1. Crie um repositório no GitHub

```bash

pnpm deploy```2. Configure o Git e faça push

```

Aguarda conclusão do deploy e mostra progresso no terminal.3. Execute `pnpm run deploy`



**Deploy manual:**Os arquivos de produção serão gerados na pasta `dist/`4. Ative GitHub Pages nas configurações do repositório

```bash

pnpm build

git add .

git commit -m "feat: nova funcionalidade"## 🌐 Deploy## 📁 Estrutura

git push

```



O GitHub Actions faz deploy automaticamente após o push!### GitHub Pages (Frontend)```



Veja instruções completas em [DEPLOY.md](./DEPLOY.md)src/



### Vercel (Backend API - Opcional)Veja instruções completas em: [DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md)├── components/     # Componentes React



```bash│   ├── ui/        # Componentes shadcn/ui

vercel --prod

```**Resumo:**│   └── ...



## 📁 Estrutura```bash├── pages/         # Páginas da aplicação



```git add .├── locales/       # Arquivos de tradução

src/

├── components/        # Componentes Reactgit commit -m "Deploy"├── hooks/         # React hooks customizados

│   ├── ui/           # Componentes Shadcn/UI

│   ├── BlogEditor.tsxgit push└── lib/           # Utilitários

│   ├── TestimonialsCarousel.tsx

│   └── ...``````

├── pages/            # Páginas da aplicação

│   ├── Index.tsx

│   ├── QuemSomos.tsx

│   ├── Tratamentos.tsxO GitHub Actions faz deploy automaticamente!## 🎨 Personalização

│   └── ...

├── hooks/            # Custom hooks

│   ├── useEditableContent.ts

│   ├── useJsonMapping.ts### Vercel (Backend API)- Estilos globais: `src/index.css`

│   └── ...

├── lib/              # Utilitários- Configuração Tailwind: `tailwind.config.ts`

│   ├── supabase.ts

│   └── utils.ts```bash- Temas: Componentes shadcn/ui são totalmente customizáveisshell

├── locales/          # Traduções (i18n)

│   └── pt-BR/pnpm deploy:vercelpnpm add some_new_dependency

├── config/           # Configurações

│   └── api.ts```

└── styles/           # Estilos CSS

**Start Preview**

server/

├── express-server.js      # Servidor Express## 📁 Estrutura

└── supabase-routes.js     # Rotas API Supabase

```shell

scripts/

├── deploy.ps1             # Deploy síncrono (PowerShell)```pnpm run dev

├── deploy-background.ps1  # Deploy em background (PowerShell)

├── ids.js                 # Gerenciamento de IDs únicossrc/```

├── fix-all-keys.cjs       # Correção de data-json-key

└── ...├── components/      # Componentes React



supabase/│   ├── ui/         # Componentes Shadcn**To build**

└── migrations/            # Migrações SQL

    └── create_version_history.sql│   └── ...



logs/├── pages/          # Páginas da aplicação```shell

└── deploy-*.log          # Logs de deploy (últimos 10)

```├── hooks/          # Custom hookspnpm run build



## ✨ Recursos├── lib/            # Utilitários```



- ✅ **Editor visual de conteúdo** - Edite textos diretamente no site├── locales/        # Traduções (i18n)

- ✅ **Sistema de versionamento** - 5 versões mantidas automaticamente├── config/         # Configurações

- ✅ **Blog integrado** - Sistema completo de artigos└── styles/         # Estilos CSS

- ✅ **Modo escuro** - Tema claro/escuro automático

- ✅ **Responsivo** - Mobile-first designserver/

- ✅ **SEO otimizado** - Meta tags e robots.txt├── express-server.js      # Servidor Express

- ✅ **PWA ready** - Funciona offline└── supabase-routes.js     # Rotas API

- ✅ **Deploy automático** - CI/CD com GitHub Actions

scripts/

## 🔧 Configuração├── deploy.js              # Script de deploy

└── ...

### Variáveis de Ambiente

supabase/

Crie um arquivo `.env.local`:└── migrations/            # Migrações SQL

```

```env

VITE_SUPABASE_URL=https://seu-projeto.supabase.co## ✨ Recursos

VITE_SUPABASE_ANON_KEY=sua-chave-anon

SUPABASE_SERVICE_KEY=sua-service-key- ✅ Editor visual de conteúdo

```- ✅ Sistema de versionamento (5 versões)

- ✅ Blog integrado

### Supabase (Opcional)- ✅ Modo escuro

- ✅ Responsivo

1. Execute as migrações SQL em `supabase/migrations/`- ✅ SEO otimizado

2. Configure as variáveis de ambiente- ✅ PWA ready

3. Inicie o servidor: `pnpm server`

## 🔧 Configuração

## 📜 Scripts Disponíveis

### Variáveis de Ambiente

```bash

# DesenvolvimentoCrie um arquivo `.env.local`:

pnpm dev              # Inicia servidor de desenvolvimento

pnpm build            # Build de produção```env

pnpm preview          # Preview do buildVITE_SUPABASE_URL=https://seu-projeto.supabase.co

VITE_SUPABASE_ANON_KEY=sua-chave-anon

# DeploySUPABASE_SERVICE_KEY=sua-service-key

pnpm deploy           # Deploy síncrono```

pnpm deploy:bg        # Deploy em background

### Supabase

# Backend

pnpm server           # Inicia servidor Express/Supabase1. Execute as migrações SQL em `supabase/migrations/`

2. Configure as variáveis de ambiente

# Manutenção3. Inicie o servidor: `pnpm server`

pnpm assign-ids       # Verifica IDs únicos

pnpm assign-ids:fix   # Corrige IDs automaticamente## 📚 Documentação

pnpm fix-keys         # Corrige data-json-key

pnpm clean-backups    # Remove backups antigos- [Deploy GitHub Pages](./DEPLOY_GITHUB_PAGES.md) - Guia completo de deploy

- [Sistema de Versionamento](./SISTEMA_VERSIONAMENTO.md) - Backup e restauração

# Qualidade- [Integração Supabase](./SUPABASE_INTEGRATION.md) - Configuração do backend

pnpm lint             # ESLint

```## 🤝 Contribuindo



## 📚 Documentação1. Fork o projeto

2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`

- **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy no GitHub Pages3. Commit: `git commit -m 'Adiciona nova funcionalidade'`

- **[DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md)** - Configuração detalhada do GitHub Pages4. Push: `git push origin feature/nova-funcionalidade`

- **[DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)** - Deploy do backend na Vercel5. Abra um Pull Request

- **[scripts/README.md](./scripts/README.md)** - Documentação dos scripts de automação

- **[scripts/README-IDS.md](./scripts/README-IDS.md)** - Sistema de IDs únicos (ids.js)## 📄 Licença

- **[SISTEMA_VERSIONAMENTO.md](./SISTEMA_VERSIONAMENTO.md)** - Sistema de backup e restauração

- **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** - Integração com SupabaseEste projeto está sob a licença MIT.

- **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)** - Configuração do Supabase

- **[DATA_JSON_KEY_NAMING_CONVENTION.md](./DATA_JSON_KEY_NAMING_CONVENTION.md)** - Convenções de nomenclatura---



## 🤝 Contribuindo⭐ Se este projeto te ajudou, considere dar uma estrela!


1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📊 Estatísticas

- **8 páginas** editáveis
- **141+ elementos** com data-json-key
- **96 elementos** atualmente em uso
- **5 versões** mantidas por página
- **10 logs** de deploy mantidos

## 📄 Licença

Este projeto está sob a licença MIT.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!
