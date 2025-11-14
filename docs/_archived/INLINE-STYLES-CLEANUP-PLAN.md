# Migração Completa: Estilos 100% no Banco de Dados

## ✅ O que JÁ foi feito

1. **Migração de dados**: 455 textos + 127 estilos no banco
2. **Estrutura granular**: `text_entries` e `style_entries` funcionando
3. **APIs atualizadas**: Endpoints reconstr

óem objetos a partir de entries granulares
4. **Hook atualizado**: `useLocaleTexts` carrega via API granular

## 🎯 O que FALTA fazer

### Problema Atual
Ainda temos classes Tailwind inline nos TSX:
```tsx
// ❌ ERRADO (atual)
<h1 className="text-4xl font-bold text-purple-900" data-json-key="index.hero.title">
  {texts.hero.title}
</h1>

// ✅ CORRETO (objetivo)
<h1 data-json-key="index.hero.title">
  {texts.hero.title}
</h1>
```

### Solução: 2 Etapas

#### Etapa 1: Migrar estilos para DB ✅ CONCLUÍDO
Script: `scripts/migrate-all-inline-styles.js`
- Escaneou 10 arquivos TSX
- Extraiu 112 elementos com estilos
- Salvou no banco: **127 style_entries total**

#### Etapa 2: Limpar TSX ⏳ PENDENTE
Script: `scripts/clean-inline-styles.js`
- Removerá classes de tipografia dos TSX
- Manterá apenas classes de layout (flex, grid, spacing)
- **REVERSÍVEL**: Temos backup dos dados

## 📋 Classes que serão REMOVIDAS

### Tipografia (vai pro DB):
- `text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-2xl`, etc
- `font-bold`, `font-semibold`, `font-light`, etc
- `text-gray-900`, `text-purple-700`, etc (cores de texto)
- `tracking-wide`, `leading-relaxed`, etc
- `italic`, `uppercase`, etc

### Layout (fica no TSX):
- `flex`, `grid`, `block`, `inline-block`
- `m-4`, `p-6`, `mx-auto`, `space-y-4`
- `w-full`, `max-w-3xl`, `h-screen`
- `rounded-lg`, `border`, `shadow-xl`
- `bg-gradient-to-r`, `from-purple-600` (backgrounds de containers)
- `transform`, `transition-all`, `hover:scale-105`

## ⚠️ RISCOS

1. **Regex pode falhar**: Script usa regex complexo, pode não pegar todos os casos
2. **Classes mistas**: Elementos com layout E tipografia precisam separação cuidadosa
3. **Responsividade**: Classes como `md:text-xl` precisam tratamento especial
4. **Revisão manual**: Após script, CADA arquivo precisa ser revisado

## 🔧 Como Proceder (RECOMENDAÇÃO)

### Opção A: Automática (RÁPIDA mas ARRISCADA)
```bash
# 1. Backup completo (já feito)
# 2. Limpar TODOS os TSX automaticamente
node scripts/clean-inline-styles.js

# 3. Revisar CADA arquivo manualmente
# 4. Testar site completamente
# 5. Se der errado, restaurar do git
```

### Opção B: Manual/Semi-automática (SEGURA mas DEMORADA) ⭐ RECOMENDADA
```bash
# 1. Testar em UM arquivo primeiro
node scripts/test-clean-one-file.js  # Testa em Purificacao.tsx

# 2. Revisar resultado
code src/pages/Purificacao.tsx

# 3. Se OK, fazer arquivo por arquivo
# 4. Commit a cada arquivo limpo
# 5. Testar a cada commit
```

### Opção C: Híbrida (EQUILIBRADA)
```bash
# 1. Limpar arquivos SIMPLES automaticamente
#    (NotFound, Admin, etc - poucos elementos)

# 2. Limpar arquivos COMPLEXOS manualmente
#    (Index, Purificacao, Tratamentos - muitos elementos)

# 3. Usar Visual Studio Code Find & Replace
#    Regex: className="([^"]*)(text-\w+|font-\w+)([^"]*)"
#    Replace: className="$1$3"  (remove text-* e font-*)
```

## 📊 Arquivos e Complexidade

| Arquivo | Elementos | Complexidade | Recomendação |
|---------|-----------|--------------|--------------|
| Admin.tsx | 0 | Baixa | Automático |
| AdminConsole.tsx | 0 | Baixa | Automático |
| NotFound.tsx | 2 | Baixa | Automático |
| Artigos.tsx | 6 | Média | Semi-automático |
| QuemSomos.tsx | 8 | Média | Semi-automático |
| Testemunhos.tsx | 10 | Média | Semi-automático |
| Contato.tsx | 11 | Média | Semi-automático |
| Tratamentos.tsx | 14 | Alta | Manual |
| Index.tsx | 29 | Alta | Manual |
| Purificacao.tsx | 32 | Alta | Manual |

## 🎯 Decisão Necessária

**Você prefere:**
- A) Executar script automático agora e revisar depois?
- B) Fazer manual/semi-automático (mais seguro)?
- C) Começar testando em 1-2 arquivos para avaliar?

**Minha recomendação: Opção C** - Testar primeiro, ganhar confiança, depois escalar.

## 📝 Próximos Passos (Aguardando Sua Decisão)

1. [ ] Decidir abordagem (A, B ou C)
2. [ ] Executar limpeza conforme abordagem escolhida
3. [ ] Testar site completamente
4. [ ] Ajustar casos especiais manualmente
5. [ ] Documentar padrões para futuras páginas
