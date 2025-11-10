# 🎯 Script de IDs Únicos (ids.js)

## 📋 O Script Definitivo

**UM ÚNICO SCRIPT** que faz tudo:
- ✅ Verifica elementos editáveis
- ✅ Detecta contexto de arrays (.map)
- ✅ Suporta nested structures complexas
- ✅ Corrige automaticamente
- ✅ Relatório detalhado
- ✅ Backups automáticos

## 🚀 Uso Rápido

```bash
# Verificar apenas (padrão)
node scripts/ids.js

# Corrigir automaticamente
node scripts/ids.js --fix

# Preview das correções
node scripts/ids.js --fix --dry-run

# Página específica
node scripts/ids.js --page=Tratamentos --fix

# Output detalhado
node scripts/ids.js --verbose --fix
```

## 📊 Output

### Modo CHECK (padrão)
```
╔═══════════════════════════════════════════════════════════════════╗
║  🎯 Script Definitivo - Verificação e Correção de IDs Únicos     ║
╚═══════════════════════════════════════════════════════════════════╝

🔧 Modo: 🔍 CHECK

📊 RELATÓRIO DETALHADO:

✅ Tratamentos.tsx
   Total de elementos: 45
   ✓ Todos com data-json-key correto

📈 RESUMO GERAL:
   📄 Páginas processadas: 8
   🔤 Total de elementos: 141
   ⚠️ Problemas encontrados: 0

✅ PERFEITO! Todas as páginas estão corretas!
```

### Modo FIX (com problemas)
```
🔧 Modo: 🔴 FIX

📊 RELATÓRIO DETALHADO:

🔧 Tratamentos.tsx
   Total de elementos: 45
   Problemas encontrados: 3
   ✅ Corrigidos: 3

📈 RESUMO GERAL:
   📄 Páginas processadas: 8
   🔤 Total de elementos: 141
   ✅ Problemas corrigidos: 3

✅ CONCLUÍDO! Arquivos modificados com backups.
   3 elementos agora têm data-json-key correto.
   Backups salvos com timestamp.
```

## 🎯 Recursos Avançados

### Detecção de Arrays
Detecta automaticamente quando elemento está dentro de `.map()`:

```tsx
{treatments.map((treatment, index) => (
  <div>
    <h2>{treatment.title}</h2>  
    {/* Script detecta e gera: data-json-key={`tratamentos.treatments[${index}].title`} */}
  </div>
))}
```

### Nested Structures
Suporta estruturas JSX complexas e aninhadas:

```tsx
<section>
  <div>
    <Card>
      <CardHeader>
        <h1>{texts.header.title}</h1>  
        {/* ✓ Encontra tag pai correta mesmo com nesting profundo */}
      </CardHeader>
    </Card>
  </div>
</section>
```

### Ignore de Tags
Ignora automaticamente tags de navegação que causariam conflitos:
- `<a>`
- `<Link>`
- `<Button>`
- `<nav>`
- `<NavLink>`

## 📝 Exemplos Práticos

### Verificação Pré-Commit
```bash
# No seu workflow
node scripts/ids.js || exit 1  # Falha se houver problemas
pnpm build
```

### Correção Rápida
```bash
# Encontrou problema? Corrige na hora
node scripts/ids.js --fix
```

### Debug de Página Específica
```bash
# Ver detalhes do processamento
node scripts/ids.js --page=Tratamentos --verbose
```

### Preview Seguro
```bash
# Ver exatamente o que seria mudado
node scripts/ids.js --fix --dry-run
```

## 🔧 Como Funciona

### 1. Detecção
- Busca todos os padrões `{texts.xxx}` ou `{texts?.xxx}`
- Analisa contexto de array (`.map()`)
- Encontra tag JSX pai mais próxima

### 2. Análise
- Verifica se tag já tem `data-json-key`
- Ignora tags de navegação
- Suporta self-closing tags

### 3. Correção
- Gera ID único: `{pagina}.{caminho.json}`
- Para arrays: `` {`${pagina}.items[${index}].campo`} ``
- Injeta atributo na posição correta

### 4. Backup
- Cria backup com timestamp antes de modificar
- Formato: `Arquivo.tsx.backup-2025-11-10T14-30-45`

## 🚨 Troubleshooting

### "Editei mas não salvou"
```bash
node scripts/ids.js --page=NomeDaPagina --fix
```

### "Elemento complexo não detectado"
```bash
# Ver processamento detalhado
node scripts/ids.js --page=NomeDaPagina --verbose
```

### "Quero ver antes de modificar"
```bash
# Sempre use dry-run primeiro
node scripts/ids.js --fix --dry-run
```

## 📈 Integração CI/CD

### GitHub Actions
```yaml
- name: Verificar IDs
  run: node scripts/ids.js || exit 1
  
- name: Build
  run: pnpm build
```

### Pre-commit Hook
```bash
#!/bin/bash
node scripts/ids.js || exit 1
```

## ✨ Vantagens

| Recurso | ids.js |
|---------|--------|
| **Verifica** | ✅ |
| **Corrige** | ✅ |
| **Arrays (.map)** | ✅ |
| **Nested JSX** | ✅ |
| **Backups** | ✅ |
| **Dry-run** | ✅ |
| **Verbose** | ✅ |
| **Relatório** | ✅ |
| **Tamanho** | 400 linhas |
| **Velocidade** | ~200ms |
| **Cobertura** | 100% |

## 🎓 Comparação com Scripts Anteriores

### Scripts Removidos ❌
- `verify-ids.js` - Só verificava
- `check-and-fix-ids.js` - Análise básica
- `assign-ids-final.js` - Muito complexo (561 linhas)

### Script Atual ⭐
- `ids.js` - **Melhor dos dois mundos**
  - Simples como verify-ids
  - Poderoso como assign-ids-final
  - Interface clara
  - Análise profunda
  - 400 linhas otimizadas

## 📞 Comandos Úteis

```bash
# Verificação rápida
node scripts/ids.js

# Corrigir tudo
node scripts/ids.js --fix

# Preview
node scripts/ids.js --fix --dry-run

# Página específica
node scripts/ids.js --page=Index --fix

# Debug completo
node scripts/ids.js --verbose

# Help (ver código)
cat scripts/ids.js | grep -A 20 "EXECUÇÃO:"
```

---

**Arquivo**: `scripts/ids.js` (400 linhas)  
**Última atualização**: 10/11/2025  
**Status**: ✅ Script Definitivo Único
