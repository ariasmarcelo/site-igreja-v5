# ✅ Configuração de Deploy Concluída!

## 📁 Arquivos Criados

### 1. `.github/workflows/deploy.yml`
- **GitHub Actions** para deploy automático do frontend
- Ativa a cada push na branch `main`
- Build + Deploy para GitHub Pages

### 2. `vercel.json` (atualizado)
- Configuração do **Vercel** para backend
- Roteamento de API
- Variáveis de ambiente

### 3. `src/config/api.ts`
- **Configuração centralizada** de URLs da API
- Detecta automaticamente ambiente (dev/prod)
- Facilita migração entre ambientes

### 4. `scripts/deploy.js`
- **Script automatizado** de deploy
- Simplifica o processo
- Suporta deploy parcial (só frontend ou só backend)

### 5. `DEPLOY_GUIDE.md`
- **Documentação completa** do processo de deploy
- Passo a passo detalhado
- Troubleshooting

---

## 🚀 Como Usar

### Deploy Completo (Frontend + Backend)
```bash
pnpm run deploy
```

### Deploy Apenas Frontend
```bash
pnpm run deploy:frontend
```

### Deploy Apenas Backend
```bash
pnpm run deploy:backend
# OU
pnpm run deploy:vercel
```

---

## 📋 Checklist de Deploy

### Antes do Primeiro Deploy

- [ ] Criar repositório no GitHub
- [ ] Fazer push do código
- [ ] Configurar **GitHub Secrets**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Habilitar **GitHub Pages** (Source: GitHub Actions)
- [ ] Instalar **Vercel CLI**: `npm install -g vercel`
- [ ] Fazer login no Vercel: `vercel login`
- [ ] Deploy backend: `pnpm run deploy:backend`
- [ ] Configurar **variáveis no Vercel**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
- [ ] Atualizar URL da API no código (se necessário)

### Atualizações Futuras

Simplesmente:
```bash
git add .
git commit -m "suas mudanças"
git push origin main
```

Deploy acontece automaticamente! 🎉

---

## 🔧 Próximos Passos

### 1. Atualizar URLs da API

Após fazer deploy do backend no Vercel, você receberá uma URL como:
`https://seu-projeto.vercel.app`

**Opção A: Usar variável de ambiente (recomendado)**

Adicionar no `.env.local`:
```
VITE_API_URL=https://seu-projeto.vercel.app
```

E fazer rebuild.

**Opção B: O arquivo `src/config/api.ts` já está preparado!**

Ele detecta automaticamente se está em dev ou prod.

### 2. Testar

- [ ] Frontend: `https://seu-usuario.github.io/seu-repo/`
- [ ] Backend: `https://seu-projeto.vercel.app/health`
- [ ] API: `https://seu-projeto.vercel.app/api/content/index`

### 3. Monitorar

- **GitHub Actions**: Ver builds do frontend
- **Vercel Dashboard**: Ver logs do backend
- **Supabase Dashboard**: Ver queries do banco

---

## 📚 Documentação Adicional

Consulte `DEPLOY_GUIDE.md` para:
- Guia passo a passo completo
- Troubleshooting
- Boas práticas
- Dicas de segurança

---

## 🎉 Pronto!

Seu projeto está configurado para deploy automático.
Qualquer push para `main` atualiza automaticamente frontend e backend!
