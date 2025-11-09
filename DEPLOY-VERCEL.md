# 🚀 Guia de Deploy - Vercel

## 📋 O que foi preparado

✅ **vercel.json** - Configuração do Vercel  
✅ **api/index.js** - API como Serverless Function  
✅ **package.json** - Scripts de deploy atualizados

---

## 🌐 Deploy para Vercel

### Opção 1: Via Interface Web (Mais Fácil)

1. **Acesse**: https://vercel.com
2. **Crie conta** (pode usar GitHub)
3. **Clique em "Add New Project"**
4. **Importe seu repositório** do GitHub
5. **Configure**:
   - Framework Preset: `Vite`
   - Build Command: `pnpm build` ou `npm run build`
   - Output Directory: `dist`
6. **Deploy!** 🚀

### Opção 2: Via CLI (Linha de Comando)

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login no Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# Primeiro deploy (modo desenvolvimento)
vercel

# Deploy para produção
vercel --prod
```

Ou use o script já configurado:
```bash
npm run deploy
```

---

## ⚙️ Configuração do Projeto

### Arquivos Criados/Modificados:

#### 1. `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 2. `api/index.js`
- Serverless function com todos os endpoints da API
- Suporta: save-json, save-visual-edits, save-styles, backups
- Inclui sistema de backup automático (mantém 5 mais recentes)

#### 3. `package.json`
- `"vercel-build": "vite build"` - Build para Vercel
- `"deploy": "vercel --prod"` - Deploy para produção

---

## 🔧 Como Funciona

### Frontend
- Build estático do Vite em `/dist`
- Servido pelo CDN da Vercel
- Rápido e com HTTPS automático

### Backend (API)
- Convertido para Serverless Functions
- Roda na infraestrutura da Vercel
- Escalável automaticamente
- **Rotas disponíveis**:
  - `POST /api/save-json`
  - `POST /api/save-visual-edits`
  - `POST /api/save-styles`
  - `GET /api/backups/:pageId`

---

## 📝 Passo a Passo Completo

### 1. Preparar GitHub (se ainda não tiver)

```bash
# Inicializar Git (se não tiver)
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Criar repo no GitHub e adicionar remote
git remote add origin https://github.com/seu-usuario/seu-repo.git

# Push
git push -u origin main
```

### 2. Deploy no Vercel

**Opção A - Interface Web**:
1. Vá para https://vercel.com/new
2. Conecte seu GitHub
3. Selecione o repositório
4. Clique em "Deploy"

**Opção B - CLI**:
```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Após o Deploy

O Vercel vai gerar uma URL tipo:
```
https://seu-projeto.vercel.app
```

Acesso admin:
```
https://seu-projeto.vercel.app/436F6E736F6C45
```

---

## ⚠️ Importante: Limitações do Serverless

### Sistema de Arquivos
As Serverless Functions da Vercel são **efêmeras** (reiniciam frequentemente).

**Problema**: Salvar arquivos JSON/CSS localmente não vai persistir.

**Solução**: Você tem 3 opções:

#### Opção 1: GitHub como Database (Simples)
- Usar GitHub API para salvar diretamente no repo
- Cada save faz um commit automático
- Gratuito e funciona bem

#### Opção 2: Database Real (Recomendado)
- **Supabase** (PostgreSQL grátis)
- **MongoDB Atlas** (NoSQL grátis)
- **Firebase** (NoSQL do Google)
- Salvar JSON como texto no banco

#### Opção 3: Vercel KV (Pago após limite)
- Key-Value storage da Vercel
- Rápido mas tem limite no plano grátis

### Recomendação
Para seu projeto, sugiro **Supabase**:
- ✅ Grátis até 500MB
- ✅ PostgreSQL robusto
- ✅ Fácil de integrar
- ✅ Inclui autenticação

---

## 🔐 Variáveis de Ambiente

Se usar banco de dados, configure no Vercel:

1. Vá em **Project Settings** → **Environment Variables**
2. Adicione:
   ```
   DATABASE_URL=sua_connection_string
   API_SECRET=algum_secret_para_api
   ```

---

## 📊 Monitoramento

Após deploy, você pode:
- Ver logs em tempo real
- Monitorar performance
- Ver analytics de uso
- Configurar domínio customizado

---

## 🆘 Troubleshooting

### Build Falha
```bash
# Testar build localmente primeiro
npm run build
```

### API não funciona
- Verifique logs no dashboard da Vercel
- Confirme que `api/index.js` existe
- Verifique rotas em `vercel.json`

### Arquivos não salvam
- **Normal!** Serverless é efêmero
- Precisa integrar com banco de dados
- Ver seção "Limitações do Serverless"

---

## ✅ Checklist de Deploy

- [ ] Código commitado no Git
- [ ] Repositório no GitHub
- [ ] Build local funciona (`npm run build`)
- [ ] Conta criada no Vercel
- [ ] Projeto importado/deployado
- [ ] Site acessível na URL gerada
- [ ] Admin panel funcionando (`/436F6E736F6C45`)
- [ ] API testada (se usar banco, verificar saves)

---

## 🎯 Próximos Passos

1. **Deploy básico** - Colocar online
2. **Domínio customizado** - Adicionar seu domínio
3. **Database** - Integrar Supabase para persistência
4. **Autenticação** - Proteger admin com senha
5. **Analytics** - Adicionar Google Analytics

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Comunidade**: https://github.com/vercel/vercel/discussions

---

**Seu projeto está pronto para deploy!** 🚀

Execute `npm run deploy` ou acesse https://vercel.com para começar!
