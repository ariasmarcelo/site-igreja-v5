# Procedimento: Quebrar um campo de texto em 2-3 linhas (Passo-a-passo)

Esse documento descreve o fluxo seguro e repetível para dividir um campo de texto longo em múltiplos campos editáveis (ex.: `intro` → `intro1`, `intro2`, `intro3`). Use esse processo sempre que precisar fazer essa mudança em qualquer página.

Resumo rápido:
- Atualizar JSON de fallback (`src/locales/.../*.json`) criando novas chaves (intro1, intro2, ...)
- Atualizar o componente React para usar as novas chaves e `data-json-key` únicos
- Limpar cache local do app (localStorage / Vite cache) e forçar rebuild/reload
- (Opcional) Sincronizar com Supabase usando script quando a rede estiver disponível
- Validar no navegador e no Admin Console

## 1) Planejamento
- Decida o nome das chaves (p.ex. `intro1`, `intro2`, `intro3`).
- **IDs únicos garantidos automaticamente:** Como cada `data-json-key` começa com `pageName.`, não há risco de duplicação entre páginas diferentes.
- **Valide apenas duplicatas na mesma página:** Use `node scripts/fix-ids.js --page=NomeDaPagina` após modificar.
- Faça backup do JSON atual antes de editar (ex.: copie `Purificacao.json` para `backups/Purificacao-TIMESTAMP.json`).

## 2) Atualizar o JSON de fallback (local)
1. Abra `src/locales/pt-BR/Purificacao.json` (ou o arquivo correspondente).
2. Substitua a única chave `intro` por várias chaves:

Exemplo antes:

```json
"psicodelicos": {
  "intro": "Frase longa que será quebrada em duas partes..."
}
```

Exemplo depois:

```json
"psicodelicos": {
  "intro1": "Primeira frase curta.",
  "intro2": "Segunda frase curta.",
  // ... restante do objeto
}
```

3. Salve o arquivo.

> Observação: o TypeScript infere tipos do JSON importado (`type PurificacaoTexts = typeof fallbackTexts;`). Após mudar o JSON, você pode precisar reiniciar o processo de dev para a inferência de tipos atualizar corretamente.

## 3) Atualizar o componente React
1. Localize o componente (ex.: `src/pages/Purificacao.tsx`).
2. Substitua o uso `texts.psicodelicos.intro` por `texts.psicodelicos.intro1` e `texts.psicodelicos.intro2` em locais distintos.
3. Em cada elemento HTML adicione/atualize o `data-json-key` correspondente (esse é o mapeamento que o Admin Console usa). Exemplo:

```tsx
<p data-json-key="purificacao.psicodelicos.intro1" dangerouslySetInnerHTML={{ __html: texts.psicodelicos.intro1 }} />
<p data-json-key="purificacao.psicodelicos.intro2" dangerouslySetInnerHTML={{ __html: texts.psicodelicos.intro2 }} />
```

4. Salve o arquivo.

## 4) Validar localmente (dev)
Siga esta sequência de verificações e comandos (PowerShell):

1) Limpar cache do Vite (forçar rebuild)

```powershell
cd C:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui
# Remover cache do Vite (se existir)
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
```

2) Reiniciar o dev server (scripts no `package.json`):

```powershell
pnpm stop
pnpm start
```

Se o `pnpm start` chamar um script PowerShell (`start-dev.ps1`) o servidor será iniciado. Se houver erros de rede ao entrar em contato com o Supabase, prossiga — temos fallback local.

3) Limpar cache do browser / localStorage e forçar reload
- Abra DevTools no navegador (F12) → Console e execute:

```javascript
// Limpa apenas chaves de cache usadas pela app
Object.keys(localStorage).forEach(k => { if (k.startsWith('page_cache_') || k.startsWith('page_history_')) localStorage.removeItem(k) });
// Recarregar a página
location.reload();
```

Ou, para forçar tudo:

```javascript
localStorage.clear(); location.reload();
```

4) Verifique o console do navegador por logs relevantes. O hook `useLocaleTexts` foi alterado para imprimir `"📦 Usando fallback local para <page>"` quando o Supabase falhar — isso confirma que o fallback está em uso.

## 5) Sincronizar com o Supabase (quando a rede estiver OK)
Se você tem acesso ao Supabase e deseja que a base de dados reflita as novas chaves, use o script existente `scripts/sync-purificacao-to-db.js` (ou o script personalizado `scripts/update-purificacao-intro.js` criado nesta sessão).

Exemplo de uso (PowerShell):

```powershell
cd C:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui
node scripts/update-purificacao-intro.js
```

Se houver erro `fetch failed`:
- Verifique regras de firewall/proxy
- Verifique se há servidor backend local exigido (alguns scripts sincronizam via um backend proxy em `localhost:3001`) — o script de sincronização pode pedir para iniciar o serviço local:

```powershell
pnpm server
# ou
node server/express-server.js
```

## 6) Rollback (se algo der errado)
- Substitua `src/locales/pt-BR/Purificacao.json` com o backup criado em `backups/`.
- Refaça os passos de restart/clear-cache.

## 7) Boas práticas e dicas
- Sempre crie backup antes de modificar JSONs com conteúdo crítico.
- Use chaves curtas e sem acentos (ex.: `intro1`, `intro2`).
- Mantenha `data-json-key` único por página; ele é usado pelo Admin Console para mapear o campo editável.
- Automatize no futuro: criar um script CLI que receba uma chave e quebre o texto em N partes e aplique mudanças no JSON e gere um diff para revisão.

## 8) Checklist rápido (para repetir)
- [ ] Backup do JSON
- [ ] Editar JSON: add intro1/intro2
- [ ] Atualizar componente TSX com `data-json-key` e `texts.*`
- [ ] Limpar cache do Vite + reiniciar dev server
- [ ] Limpar `localStorage` e reload no browser
- [ ] Verificar console: confirmar fallback/local ou Supabase data
- [ ] Sincronizar com Supabase quando possível

---
Se quiser, eu crio um pequeno script CLI que automatize a quebra do campo em N partes e atualize o JSON por você (gera backup e um diff). Quer que eu implemente isso agora?