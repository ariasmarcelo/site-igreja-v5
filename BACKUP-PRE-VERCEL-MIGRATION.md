# Backup: Estado Antes da Migração 100% Vercel
**Data:** 2025-11-11
**Branch:** main
**Commit:** (será preenchido)

## URLs Ativas

### GitHub Pages (A SER REMOVIDO)
- **URL Principal:** https://ariasmarcelo.github.io/site-igreja-v6/
- **Status:** Ativo (apenas frontend estático)
- **Limitações:** Sem API, Admin Console não funciona

### Vercel (PRODUÇÃO ATUAL)
- **URL Principal:** https://shadcn-ui-seven-olive.vercel.app
- **Admin Console:** https://shadcn-ui-seven-olive.vercel.app/436F6E736F6C45
- **API Endpoints:** https://shadcn-ui-seven-olive.vercel.app/api/*
- **Status:** ✅ Funcionando completamente

### Servidores Locais
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3001
- **Admin Local:** http://localhost:8080/436F6E736F6C45

---

## Configurações Atuais

### package.json - Scripts Relacionados ao GitHub Pages
```json
"deploy": "powershell -File scripts/deploy.ps1",
"deploy:bg": "powershell -File scripts/deploy.ps1 -Background"
```

### vite.config.ts - Base Path
```typescript
base: '/' // Já estava correto para Vercel
```

### Arquivos de Deploy
- `scripts/deploy.ps1` - Script de deploy para GitHub Pages
- `scripts/deploy-vercel.ps1` - Script novo para Vercel

---

## Variáveis de Ambiente (Vercel)

### Production
1. `VITE_SUPABASE_URL` - URL do Supabase
2. `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase
3. `SUPABASE_SERVICE_KEY` - Chave de serviço (service_role)
4. `VITE_API_URL` - https://shadcn-ui-seven-olive.vercel.app

---

## Estrutura de Serverless Functions (Vercel)

```
api/
├── package.json (type: commonjs)
├── save-json.js (POST /api/save-json)
├── save-visual-edits.js (POST /api/save-visual-edits)
├── save-styles.js (POST /api/save-styles)
├── content/[pageId].js (GET /api/content/:pageId)
└── styles/[pageId].js (GET /api/styles/:pageId)
```

---

## Estrutura Local (Express - A SER REFATORADO)

```
server/
├── express-server.js (Express com todas as rotas)
└── vite-server.js (Alternativo)
```

---

## Dependências a Remover

### package.json
- `gh-pages` (devDependencies)

---

## Como Restaurar Este Estado

### 1. Restaurar código
```bash
git checkout pre-vercel-migration
```

### 2. Reativar GitHub Pages
- Ir em Settings → Pages
- Source: Deploy from a branch
- Branch: gh-pages / (root)

### 3. Reinstalar dependência
```bash
pnpm add -D gh-pages
```

### 4. Deploy para GitHub Pages
```bash
pnpm deploy
```

---

## Motivo da Migração

- ✅ Vercel oferece tudo que GitHub Pages oferece + API serverless
- ✅ Admin Console só funciona no Vercel (precisa de API)
- ✅ Eliminar duplicação de deployments
- ✅ Código local idêntico ao produção (serverless)
- ✅ Deployment previews automáticos
- ✅ Rollback fácil
- ✅ Domínio customizado grátis

---

## Riscos e Mitigações

### Risco 1: Perder acesso ao site GitHub Pages
**Mitigação:** Git tag + este documento permitem restauração completa

### Risco 2: Vercel free tier insuficiente
**Mitigação:** Limite de 100GB/mês bandwidth é suficiente para sites pequenos/médios

### Risco 3: Bugs na refatoração do servidor local
**Mitigação:** Servidor Express original mantido como backup (`express-server-backup.js`)

---

## Contatos e Recursos

- **Vercel Dashboard:** https://vercel.com/marcelo-arias-projects-172831c7/shadcn-ui
- **GitHub Repo:** https://github.com/ariasmarcelo/site-igreja-v6
- **Supabase Project:** (URL nas variáveis de ambiente)

---

**Status:** ✅ Backup criado, pronto para migração
