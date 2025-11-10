# Correção Completa dos data-json-key

## Problema Identificado

O editor visual não estava salvando mudanças porque os atributos `data-json-key` estavam **incorretos** ou apontando para elementos **não editáveis**.

## Correções Aplicadas

### Total: **35 correções** em 6 arquivos

### Por Página:

1. **Index.tsx** - 23 correções
   - ❌ `index.section_igreja.description[${index}]` → ✅ `index.igreja.description[${index}]`
   - ❌ `index.section_igreja.icon.sun_white` → ✅ Removido (ícone não editável)
   - ❌ `index.section_instituto.icon.sun_white` → ✅ Removido (ícone não editável)
   - ❌ `index.section_instituto.link.treatments` → ✅ Removido (link não editável)
   - ❌ `index.purification_card.phase[${index}]` → ✅ `index.purification.phases[${index}]`
   - ❌ `index.instituto_card.treatment[${index}]` → ✅ `index.instituto.treatments[${index}]`
   - ❌ `index.*.*.map` → ✅ Removido (9 ocorrências - arrays não editáveis)
   - ❌ `index.*.*.replace` → ✅ Removido (4 ocorrências - transformações não editáveis)
   - ❌ `index.instituto.legalNotice` duplicado → ✅ Removido duplicata

2. **Purificacao.tsx** - 5 correções
   - ❌ `purificacao.faseInicial.activities.items.map`
   - ❌ `purificacao.faseIntermediaria.trabalhos.items.map`
   - ❌ `purificacao.faseFinal.posIniciacao.items.map`
   - ❌ `purificacao.psicodelicos.applications.items.map`
   - ❌ `purificacao.valores.cards.map`

3. **QuemSomos.tsx** - 4 correções
   - ❌ `quemsomos.historico.content.map`
   - ❌ `quemsomos.principios.items.map`
   - ❌ `quemsomos.magia.paragraphs.map`
   - ❌ `quemsomos.hermeticos.items.map`

4. **Contato.tsx** - 2 correções
   - ❌ `contato.initialAssessment.whatToExpect.items.map`
   - ❌ `contato.faq.items.map`

5. **Tratamentos.tsx** - ✅ Sem erros
6. **Testemunhos.tsx** - ✅ Sem erros
7. **Artigos.tsx** - ✅ Sem erros

## Scripts Criados

### 1. `scripts/fix-index-json-keys.cjs`
Script específico para correção da página Index.tsx com 9 tipos de correções.

### 2. `scripts/fix-all-json-keys.cjs`
Script universal para correção de todas as páginas com 5 tipos de correções:
- Remoção de atributos `.map`
- Remoção de atributos `.replace`
- Remoção de atributos `section_*`
- Remoção de atributos `.icon`
- Remoção de atributos `.link`

## Regras de data-json-key

### ✅ CORRETO
```tsx
<h2 data-json-key="index.fisicoEspiritual.title">
  {texts.fisicoEspiritual.title}
</h2>

<p data-json-key={`index.igreja.description[${index}]`}>
  {paragraph}
</p>
```

### ❌ INCORRETO
```tsx
<!-- Atributo .map (não editável) -->
<ul data-json-key="index.instituto.benefits.map">

<!-- Atributo .replace (transformação não editável) -->
<div data-json-key="index.fisicoEspiritual.integrada.description.replace">

<!-- Nomenclatura incorreta (section_) -->
<p data-json-key="index.section_igreja.description[${index}]">

<!-- Ícones não editáveis -->
<svg data-json-key="index.section_igreja.icon.sun_white">

<!-- Links não editáveis -->
<Link data-json-key="index.section_instituto.link.treatments">
```

## Validação Final

✅ **Nenhum erro restante** em nenhuma página!

Comando usado:
```bash
grep -r "data-json-key=[\"'\`][^\"'\`]*(\\.map|\\.replace|section_|\\.icon|\\.link)[\"'\`]" src/pages/
```

Resultado: **0 matches**

## Commit

- **SHA**: `4847883`
- **Mensagem**: "fix: corrigir 35 data-json-key incorretos em todas as páginas"
- **Arquivos alterados**: 6 files changed, 261 insertions(+), 35 deletions(-)

## Próximo Passo

**Teste do editor visual:**
1. Abra a página Index no navegador
2. Ative o modo de edição
3. Edite o texto "Naquilo que nos acomete, o que é físico e o que é espiritual?"
4. Salve as alterações
5. Recarregue a página
6. Verifique se a mudança persistiu

**Teste em outras páginas:**
- Purificacao: editar títulos das fases
- QuemSomos: editar princípios
- Contato: editar FAQ

Se o salvamento funcionar, o problema está **100% resolvido**! 🎉
