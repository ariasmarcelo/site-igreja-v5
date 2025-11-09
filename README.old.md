# Site Igreja Meta

Site institucional desenvolvido com React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Vite** - Build tool
- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes
- **Lucide React** - Ícones
- **React Router** - Navegação
- **Framer Motion** - Animações

## 📦 Instalação

```bash
pnpm install
```

## 🛠️ Desenvolvimento

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:8080`

## 🏗️ Build

```bash
pnpm build
```

Os arquivos de produção serão gerados na pasta `dist/`

## 🌐 Deploy para GitHub Pages

Veja instruções completas no arquivo [DEPLOY.md](./DEPLOY.md)

**Resumo:**
1. Crie um repositório no GitHub
2. Configure o Git e faça push
3. Execute `pnpm run deploy`
4. Ative GitHub Pages nas configurações do repositório

## 📁 Estrutura

```
src/
├── components/     # Componentes React
│   ├── ui/        # Componentes shadcn/ui
│   └── ...
├── pages/         # Páginas da aplicação
├── locales/       # Arquivos de tradução
├── hooks/         # React hooks customizados
└── lib/           # Utilitários
```

## 🎨 Personalização

- Estilos globais: `src/index.css`
- Configuração Tailwind: `tailwind.config.ts`
- Temas: Componentes shadcn/ui são totalmente customizáveisshell
pnpm add some_new_dependency

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```
