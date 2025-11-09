# Deploy Guide - Igreja de Metatron

## 📦 Estrutura do Deploy

- **Frontend**: GitHub Pages (arquivos estáticos)
- **Backend**: Vercel (API Node.js)
- **Banco de Dados**: Supabase (já configurado)

---

## 🚀 Deploy Inicial

### 1. Configurar GitHub Repository

```bash
# Se ainda não tem repositório
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 2. Configurar GitHub Secrets

No repositório GitHub, vá em:
- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Adicione:
- `VITE_SUPABASE_URL` = sua URL do Supabase
- `VITE_SUPABASE_ANON_KEY` = sua chave anon do Supabase

### 3. Habilitar GitHub Pages

No repositório:
- **Settings** → **Pages**
- **Source**: GitHub Actions
- Salvar

### 4. Deploy do Backend no Vercel

```bash
# Instalar Vercel CLI (uma vez)
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? [seu usuário]
# - Link to existing project? No
# - Project name? [aceitar sugestão]
# - Directory? ./
# - Override settings? No
```

### 5. Configurar Variáveis no Vercel

No dashboard Vercel:
- **Settings** → **Environment Variables**

Adicionar:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (service role key, não a anon)

### 6. Deploy em Produção

```bash
vercel --prod
```

Anote a URL do backend (ex: `https://seu-projeto.vercel.app`)

### 7. Atualizar URLs da API no Frontend

No código, trocar `http://localhost:3001` pela URL do Vercel.

---

## 🔄 Atualizações Futuras

### Deploy Automático

Após configuração inicial, qualquer push para `main` faz deploy automático:

```bash
# Fazer mudanças
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# GitHub Actions faz deploy do frontend automaticamente
# Vercel faz deploy do backend automaticamente (se configurado)
```

### Deploy Manual do Backend

```bash
vercel --prod
```

---

## 🔧 Configurações Criadas

### ✅ `.github/workflows/deploy.yml`
- Build automático do frontend
- Deploy para GitHub Pages
- Usa secrets do repositório

### ✅ `vercel.json`
- Configuração para Vercel
- Roteamento de API
- Variáveis de ambiente

---

## 📝 URLs Finais

Após deploy:
- **Frontend**: `https://SEU_USUARIO.github.io/SEU_REPO/`
- **Backend**: `https://SEU_PROJETO.vercel.app`
- **Banco**: Supabase (já configurado)

---

## ⚠️ Importante

1. **Nunca commitar** arquivos `.env` ou `.env.local`
2. **Usar secrets** para credenciais sensíveis
3. **Testar localmente** antes de fazer push
4. **Verificar logs** no GitHub Actions se houver erro

---

## 🆘 Troubleshooting

### Build falha no GitHub Actions
- Verificar se secrets estão configurados
- Checar logs no Actions tab

### API não responde no Vercel
- Verificar variáveis de ambiente
- Checar logs no Vercel dashboard

### CORS errors
- Backend já tem CORS configurado
- Verificar se URL da API está correta no frontend
