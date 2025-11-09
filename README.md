# Site Igreja de Metatron# Site Igreja Meta



Site institucional desenvolvido com React, TypeScript, Tailwind CSS 4 e Supabase.Site institucional desenvolvido com React, TypeScript e Tailwind CSS.



## 🌐 Demo## 🚀 Tecnologias



**Site:** https://SEU_USUARIO.github.io/site-igreja-metatron/- **Vite** - Build tool

- **React 19** - Framework UI

## 🚀 Tecnologias- **TypeScript** - Tipagem estática

- **Tailwind CSS** - Estilização

- **Vite 7** - Build tool- **Shadcn/UI** - Componentes

- **React 19** - Framework UI- **Lucide React** - Ícones

- **TypeScript 5** - Tipagem estática- **React Router** - Navegação

- **Tailwind CSS 4** - Estilização moderna- **Framer Motion** - Animações

- **Shadcn/UI** - Componentes

- **Supabase** - Backend (PostgreSQL)## 📦 Instalação

- **Lucide React** - Ícones

- **React Router 7** - Navegação```bash

- **Tiptap** - Editor de texto ricopnpm install

```

## 📦 Instalação

## 🛠️ Desenvolvimento

```bash

# Instalar dependências```bash

pnpm installpnpm dev

``````



## 🛠️ DesenvolvimentoO servidor estará disponível em `http://localhost:8080`



```bash## 🏗️ Build

# Servidor de desenvolvimento

pnpm dev```bash

# Acesse: http://localhost:8080pnpm build

```

# Backend API (Supabase)

pnpm serverOs arquivos de produção serão gerados na pasta `dist/`

# Acesse: http://localhost:3001

```## 🌐 Deploy para GitHub Pages



## 🏗️ BuildVeja instruções completas no arquivo [DEPLOY.md](./DEPLOY.md)



```bash**Resumo:**

pnpm build1. Crie um repositório no GitHub

```2. Configure o Git e faça push

3. Execute `pnpm run deploy`

Os arquivos de produção serão gerados na pasta `dist/`4. Ative GitHub Pages nas configurações do repositório



## 🌐 Deploy## 📁 Estrutura



### GitHub Pages (Frontend)```

src/

Veja instruções completas em: [DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md)├── components/     # Componentes React

│   ├── ui/        # Componentes shadcn/ui

**Resumo:**│   └── ...

```bash├── pages/         # Páginas da aplicação

git add .├── locales/       # Arquivos de tradução

git commit -m "Deploy"├── hooks/         # React hooks customizados

git push└── lib/           # Utilitários

``````



O GitHub Actions faz deploy automaticamente!## 🎨 Personalização



### Vercel (Backend API)- Estilos globais: `src/index.css`

- Configuração Tailwind: `tailwind.config.ts`

```bash- Temas: Componentes shadcn/ui são totalmente customizáveisshell

pnpm deploy:vercelpnpm add some_new_dependency

```

**Start Preview**

## 📁 Estrutura

```shell

```pnpm run dev

src/```

├── components/      # Componentes React

│   ├── ui/         # Componentes Shadcn**To build**

│   └── ...

├── pages/          # Páginas da aplicação```shell

├── hooks/          # Custom hookspnpm run build

├── lib/            # Utilitários```

├── locales/        # Traduções (i18n)
├── config/         # Configurações
└── styles/         # Estilos CSS

server/
├── express-server.js      # Servidor Express
└── supabase-routes.js     # Rotas API

scripts/
├── deploy.js              # Script de deploy
└── ...

supabase/
└── migrations/            # Migrações SQL
```

## ✨ Recursos

- ✅ Editor visual de conteúdo
- ✅ Sistema de versionamento (5 versões)
- ✅ Blog integrado
- ✅ Modo escuro
- ✅ Responsivo
- ✅ SEO otimizado
- ✅ PWA ready

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_KEY=sua-service-key
```

### Supabase

1. Execute as migrações SQL em `supabase/migrations/`
2. Configure as variáveis de ambiente
3. Inicie o servidor: `pnpm server`

## 📚 Documentação

- [Deploy GitHub Pages](./DEPLOY_GITHUB_PAGES.md) - Guia completo de deploy
- [Sistema de Versionamento](./SISTEMA_VERSIONAMENTO.md) - Backup e restauração
- [Integração Supabase](./SUPABASE_INTEGRATION.md) - Configuração do backend

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
