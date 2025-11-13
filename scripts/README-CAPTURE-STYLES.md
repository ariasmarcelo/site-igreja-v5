# Captura e População de Estilos Originais

Este guia explica como capturar os estilos originais dos elementos editáveis e salvá-los no banco de dados.

## Passo 1: Preparação

1. Certifique-se que o reset CSS está **DESATIVADO** em `src/index.css`
2. Recarregue a página para ver os estilos originais do Tailwind
3. Abra o DevTools (F12) no navegador

## Passo 2: Capturar Estilos no Navegador

1. Abra o Console no DevTools
2. Copie e cole o conteúdo do arquivo `scripts/capture-original-styles.js`
3. Pressione Enter para executar
4. O script irá mostrar um JSON com todos os estilos capturados
5. **COPIE TODO O JSON** que aparecer (será uma array longa)

## Passo 3: Popular o Banco de Dados

1. Abra o arquivo `scripts/populate-original-styles.js`
2. Encontre a linha: `const capturedStyles = [];`
3. **Cole o JSON copiado** substituindo o array vazio `[]`
4. Salve o arquivo
5. Execute no terminal:

```powershell
cd C:\temp\Site_Igreja_Meta\site-igreja-v6\workspace\shadcn-ui
node scripts/populate-original-styles.js
```

## Passo 4: Reativar o Reset CSS

1. Abra `src/index.css`
2. Descomente o bloco de reset CSS (remova os `/*` e `*/`)
3. Salve o arquivo
4. Recarregue a página

## Resultado Esperado

- Todos os elementos com `data-json-key` terão seus estilos salvos no banco
- O reset CSS garante que apenas estilos do DB sejam aplicados
- Qualquer edição feita no Visual Editor será salva e aplicada corretamente

## Troubleshooting

### Erro: "Variáveis de ambiente não encontradas"
- Certifique-se que `.env.local` existe e contém:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Erro: "Nenhum estilo para processar"
- Você esqueceu de colar o JSON no arquivo `populate-original-styles.js`
- Execute novamente o Passo 2 e 3

### JSON muito grande
- É normal! A página index tem muitos elementos editáveis
- O JSON pode ter 10-20KB de tamanho
- Certifique-se de copiar TODO o conteúdo

## Observações

- Este processo precisa ser feito **UMA VEZ** para cada página
- Depois, os estilos ficam no banco e podem ser editados livremente
- Se adicionar novos elementos editáveis, repita o processo apenas para eles
