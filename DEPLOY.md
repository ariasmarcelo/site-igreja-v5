# Deploy para GitHub Pages

## Passos para hospedar o site no GitHub Pages

### 1. Criar repositório no GitHub
1. Acesse https://github.com/new
2. Nome do repositório: `V2_ Site` (ou outro nome de sua preferência)
3. Deixe como **público**
4. **NÃO** inicialize com README, .gitignore ou licença
5. Clique em "Create repository"

### 2. Configurar Git localmente

Abra o terminal no diretório `workspace/shadcn-ui` e execute:

```powershell
# Inicializar repositório Git (se ainda não foi inicializado)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Site Igreja Meta"

# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/V2_ Site.git

# Renomear branch para main
git branch -M main

# Fazer push para o GitHub
git push -u origin main
```

### 3. Deploy para GitHub Pages

Após fazer o push inicial, execute:

```powershell
pnpm run deploy
```

Este comando irá:
1. Compilar o projeto (vite build)
2. Criar/atualizar a branch `gh-pages`
3. Fazer push da pasta `dist` para essa branch

### 4. Ativar GitHub Pages no repositório

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Pages**
3. Em **Source**, selecione:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Clique em **Save**

### 5. Acessar o site

Após alguns minutos, seu site estará disponível em:

```
https://SEU_USUARIO.github.io/V2_ Site/
```

**Nota**: O nome do repositório `V2_ Site` já está configurado no `vite.config.ts` como `base: '/V2_ Site/'`. Se você escolher outro nome, atualize essa linha no arquivo.

## Atualizações futuras

Para atualizar o site após fazer alterações:

```powershell
git add .
git commit -m "Descrição das alterações"
git push
pnpm run deploy
```

## Verificação da configuração

- ✅ `base: '/V2_ Site/'` configurado no `vite.config.ts`
- ✅ Script `deploy` adicionado no `package.json`
- ✅ Arquivo `.nojekyll` criado em `public/` para evitar problemas com arquivos que começam com `_`
- ✅ Pacote `gh-pages` instalado como devDependency
