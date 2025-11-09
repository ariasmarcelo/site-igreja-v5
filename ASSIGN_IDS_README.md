# Sistema de IDs Únicos Automático

## 🎯 Objetivo

Garantir que **todos os elementos JSX** que referenciam textos do JSON (`{texts.xxx}`) tenham IDs únicos (`data-json-key`) para evitar duplicações no editor visual.

## 🔧 Como Funciona

### 1. **Execução Automática**

O script roda **automaticamente** na primeira vez que você inicia o servidor de desenvolvimento:

```bash
pnpm run dev
```

**O que acontece:**
1. Script `init-assign-ids.js` verifica flag `.ids-assigned`
2. Se não executou nas últimas 24h, roda `assign-ids-final.js`
3. Atribui/substitui IDs únicos em todos os arquivos TSX
4. Cria backups (`.backup`) antes de modificar
5. Marca como executado (não roda novamente nas próximas 24h)

### 2. **Execução Manual**

```bash
# Executar script normalmente
pnpm run assign-ids

# Executar mesmo que já tenha rodado nas últimas 24h
pnpm run assign-ids:force
```

## 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `init-assign-ids.js` | Verifica e executa automaticamente (usado no `predev`) |
| `assign-ids-final.js` | Script principal que atribui IDs únicos |
| `assign-ids-smart.js` | Versão alternativa (regex simples) |
| `assign-unique-ids.js` | Versão com Babel AST (completa mas lenta) |

## 🔍 Convenção de IDs

Os IDs seguem o padrão estruturado:

```
pageId.sectionId.jsonPath[arrayIndex]
```

### Exemplos:

```tsx
// Elemento simples
<h1 data-json-key="index.hero.title">
  {texts.hero.title}
</h1>

// Elemento em array
{items.map((item, index) => (
  <p data-json-key={`index.section.description[${index}]`}>
    {texts.section.description[index]}
  </p>
))}

// Elemento com seção específica
<h2 data-json-key="index.section_igreja.title">
  {texts.igreja.title}
</h2>
```

## 📊 Relatórios

Após execução, você verá:

```
======================================================================
📊 RELATÓRIO FINAL
======================================================================

✅ Arquivos processados: 7
🆔 IDs novos: 15
🔄 IDs substituídos: 95
📝 Total de elementos: 110
⚠️  Avisos: 0
```

## 🛡️ Segurança

- ✅ **Backups automáticos** - Cria `.backup` antes de modificar
- ✅ **Dry-run** - Teste sem modificar: `node scripts/assign-ids-final.js --dry-run`
- ✅ **Validação JSON** - Verifica se paths existem nos arquivos JSON
- ✅ **Idempotente** - Pode ser executado múltiplas vezes com segurança

## 🔄 Resetar Flag

Se precisar forçar reexecução:

```bash
# Remover flag (Windows PowerShell)
Remove-Item .ids-assigned

# Ou simplesmente
pnpm run assign-ids:force
```

## 📝 Logs

O script detecta automaticamente:
- 📍 **Seções** via comentários: `{/* Hero Section */}`
- 🔍 **Usos de texts.xxx** em todo o código
- 🏷️ **Tags JSX** que precisam de IDs
- 📊 **Arrays** com `.map()` para gerar IDs dinâmicos

## ⚙️ Configuração

### Desabilitar Execução Automática

Edite `package.json` e remova a linha:

```json
"predev": "node scripts/init-assign-ids.js",
```

### Alterar Intervalo de Reexecução

Edite `scripts/init-assign-ids.js` linha ~22:

```javascript
// Mudar de 24h para outro valor
if (hoursSince < 24) {  // ← Alterar este número
```

## 🐛 Troubleshooting

### Script não executa automaticamente

1. Verifique se `.ids-assigned` existe e delete-o
2. Execute `pnpm run assign-ids` manualmente
3. Reinicie `pnpm run dev`

### IDs duplicados ainda aparecem

1. Execute com força: `pnpm run assign-ids:force`
2. Verifique console do navegador para erros
3. Limpe cache do navegador (Ctrl+F5)

### Erro ao executar script

1. Verifique se Node.js está atualizado (v18+)
2. Execute `pnpm install` para garantir dependências
3. Verifique logs em `scripts/output/` (modo dry-run)

## 📚 Arquivos Relacionados

- `/scripts/init-assign-ids.js` - Script de inicialização automática
- `/scripts/assign-ids-final.js` - Script principal de atribuição
- `/.ids-assigned` - Flag de controle (timestamp)
- `/src/pages/*.tsx.backup` - Backups dos arquivos modificados
- `/scripts/output/*.tsx` - Preview em modo dry-run

## 🎯 Próximos Passos

Após a primeira execução automática:
1. ✅ Todos os elementos terão IDs únicos
2. ✅ Não haverá mais duplicações no console
3. ✅ Editor visual funcionará corretamente
4. ✅ Script só roda novamente após 24h ou manualmente

---

**💡 Dica:** Para ver o script em ação com detalhes:
```bash
node scripts/assign-ids-final.js --dry-run --page=Index --verbose
```
