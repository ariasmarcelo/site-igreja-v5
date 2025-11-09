# 🚀 Deploy para GitHub Pages

## Guia Completo de Deploy

### 📋 Pré-requisitos

1. **Conta GitHub**
2. **Git instalado**
3. **Projeto buildando localmente** (`pnpm build` funciona)

---

## 🔧 Configuração Inicial

### 1. Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `site-igreja-metatron` (ou outro nome)
3. **Deixe PÚBLICO** (necessário para GitHub Pages gratuito)
4. **NÃO** inicialize com README
5. Clique em "Create repository"

### 2. Atualizar `vite.config.ts`

Abra `vite.config.ts` e **atualize a linha do `base`**:

```typescript
base: mode === 'production' ? '/NOME-DO-SEU-REPOSITORIO/' : '/',
```

Substitua `NOME-DO-SEU-REPOSITORIO` pelo nome exato do repositório que você criou.

**Exemplo:**
```typescript
base: mode === 'production' ? '/site-igreja-metatron/' : '/',
```

### 3. Configurar Variáveis de Ambiente no GitHub

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione os seguintes secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://seu-projeto.supabase.co` (pegue do .env.local)

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `sua-chave-anon-aqui` (pegue do .env.local)

### 4. Ativar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione: **GitHub Actions**
3. Salvar

---

## 📤 Fazer o Deploy

### Primeira vez (Conectar ao GitHub)

Execute os comandos no PowerShell:

```powershell
# 1. Inicializar Git (se ainda não foi)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "Initial commit"

# 4. Renomear branch para main
git branch -M main

# 5. Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/NOME-DO-REPO.git

# 6. Fazer push
git push -u origin main
```

**Substitua:**
- `SEU_USUARIO` pelo seu usuário do GitHub
- `NOME-DO-REPO` pelo nome do repositório criado

### Deploys Futuros

Depois da primeira vez, para fazer novos deploys:

```powershell
git add .
git commit -m "Atualizações do site"
git push
```

---

## ✅ Verificar Deploy

1. Vá em **Actions** no GitHub
2. Aguarde o workflow terminar (⚙️ → ✅)
3. Acesse: `https://SEU_USUARIO.github.io/NOME-DO-REPO/`

---

## 🔍 Verificação Rápida

**Checklist antes do primeiro deploy:**

- [ ] Repositório criado no GitHub
- [ ] `vite.config.ts` atualizado com nome correto do repo
- [ ] Secrets configurados no GitHub (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
- [ ] GitHub Pages configurado para usar GitHub Actions
- [ ] `pnpm build` funciona localmente sem erros

---

## 🐛 Troubleshooting

### Build falha no GitHub Actions

**Problema:** Erro de variáveis de ambiente
- **Solução:** Verifique se os secrets foram configurados corretamente

**Problema:** `Module not found`
- **Solução:** Delete `node_modules` e `pnpm-lock.yaml`, rode `pnpm install` novamente

### Site não carrega corretamente

**Problema:** Página em branco ou erro 404
- **Solução:** Verifique se o `base` no `vite.config.ts` está correto

**Problema:** CSS não carrega
- **Solução:** Verifique o `base` no vite.config.ts - deve terminar com `/`

### Supabase não funciona

**Problema:** Dados não carregam
- **Solução:** Verifique se os secrets estão corretos no GitHub

---

## 📝 Scripts Úteis

```bash
# Testar build localmente
pnpm build

# Testar build em modo produção localmente
pnpm preview

# Ver status do git
git status

# Ver histórico de commits
git log --oneline
```

---

## 🔄 Atualizar Site

Workflow completo:

1. Faça alterações no código
2. Teste localmente: `pnpm dev`
3. Teste build: `pnpm build`
4. Commit e push:
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```
5. GitHub Actions faz deploy automaticamente
6. Aguarde 2-3 minutos
7. Site atualizado!

---

## 🌐 URL Final

Seu site estará disponível em:

```
https://SEU_USUARIO.github.io/NOME-DO-REPO/
```

**Exemplo:**
```
https://joaosilva.github.io/site-igreja-metatron/
```

---

## ⚡ Deploy Rápido (Resumo)

```bash
# Apenas uma vez
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main

# Sempre que quiser atualizar
git add .
git commit -m "Update"
git push
```

✅ **Pronto!** O GitHub Actions cuida do resto automaticamente!
