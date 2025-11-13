# Migração de Estilos para Banco de Dados

## 📋 Visão Geral

Este guia documenta o processo de migração de estilos Tailwind para o banco de dados Supabase para **TODOS** os elementos editáveis do site:

- **Textos** (`data-json-key`)
- **Seções** (`data-section-id`)
- **Blocos** (`data-block-id`)

## 🎯 Objetivo

Garantir que todos os elementos editáveis usem **APENAS** estilos vindos do banco de dados, eliminando conflitos com CSS do Tailwind.

## 🔧 Ferramentas

### 1. `capture-all-styles.js`
Script para executar no **Console do navegador** (DevTools F12).

**Função:** Captura os estilos computados de todos os elementos editáveis e gera um JSON.

### 2. `populate-all-styles.js`
Script Node.js para executar no **terminal**.

**Função:** Recebe o JSON capturado e popula o banco de dados Supabase.

## 📝 Processo de Migração (Passo a Passo)

### **PASSO 1: Verificar Reset CSS Desabilitado**

✅ O reset CSS já está comentado em `src/index.css` (linhas 39-64).

Se por algum motivo estiver ativo, comente o bloco:

```css
/* *[data-json-key], *[data-section-id], *[data-block-id] { ... } */
```

### **PASSO 2: Capturar Estilos Originais**

1. **Abra o site no navegador:**
   ```
   http://localhost:8080
   ```

2. **Abra o DevTools:**
   - Pressione `F12` ou `Ctrl+Shift+I`
   - Vá para a aba **Console**

3. **Copie o script de captura:**
   - Abra `workspace/shadcn-ui/scripts/capture-all-styles.js`
   - Selecione **TODO** o conteúdo (Ctrl+A)
   - Copie (Ctrl+C)

4. **Execute no Console:**
   - Cole o script no Console do navegador
   - Pressione `Enter`

5. **Aguarde a captura:**
   ```
   🎯 CAPTURA COMPLETA DE ESTILOS ORIGINAIS
   ==========================================
   
   📋 Elementos encontrados:
      • Textos (data-json-key): 45
      • Seções (data-section-id): 12
      • Blocos (data-block-id): 28
      Total: 85
   
   📝 Capturando estilos de TEXTOS...
      ✅ Concluído: 45 textos
   
   📦 Capturando estilos de SEÇÕES...
      ✅ Concluído: 12 seções
   
   🧱 Capturando estilos de BLOCOS...
      ✅ Concluído: 28 blocos
   
   ✅ CAPTURA CONCLUÍDA!
   📊 Elementos com estilos capturados: 85
   ```

6. **Copie o JSON gerado:**
   - O JSON será exibido no console
   - Se tiver sido copiado automaticamente, pule para o próximo passo
   - Caso contrário, **selecione TODO o JSON** e copie

### **PASSO 3: Popular Banco de Dados**

1. **Abra o script de população:**
   ```
   workspace/shadcn-ui/scripts/populate-all-styles.js
   ```

2. **Cole o JSON capturado:**
   - Encontre a linha:
     ```javascript
     const capturedStyles = [];
     ```
   - Substitua `[]` pelo JSON copiado do navegador:
     ```javascript
     const capturedStyles = [
       {
         "identifier": "index.hero.title",
         "identifierType": "json-key",
         "tagName": "h1",
         "styles": {
           "fontSize": "72px",
           "fontWeight": "700",
           ...
         }
       },
       ...
     ];
     ```

3. **Execute o script:**
   ```powershell
   cd workspace\shadcn-ui
   node scripts/populate-all-styles.js
   ```

4. **Aguarde a população:**
   ```
   🚀 POPULAÇÃO DE ESTILOS NO BANCO DE DADOS
   ==========================================
   
   📊 Total de elementos: 85
   📄 Página: index
   
   ✅ Inserido [json-key  ]: index.hero.title
   ✅ Inserido [json-key  ]: index.hero.subtitle
   ✅ Inserido [section-id]: section-hero
   ✅ Inserido [block-id  ]: block-services-1
   ...
   
   ==========================================
   📊 RESUMO FINAL
   ==========================================
   ✅ Sucessos: 85
      • Textos (json-key): 45
      • Seções (section-id): 12
      • Blocos (block-id): 28
   ❌ Erros: 0
   📋 Total: 85
   ==========================================
   
   🎉 Migração concluída com sucesso!
   ```

### **PASSO 4: Ativar Reset CSS**

1. **Abra `src/index.css`**

2. **Descomente o bloco de reset** (linhas 39-64):

   **ANTES:**
   ```css
   /* ============================================
      RESET CSS PARA ELEMENTOS EDITÁVEIS
      ============================================ */
   /*
   *[data-json-key],
   *[data-section-id],
   *[data-block-id] {
     all: unset;
     ...
   }
   */
   ```

   **DEPOIS:**
   ```css
   /* ============================================
      RESET CSS PARA ELEMENTOS EDITÁVEIS
      ============================================ */
   *[data-json-key],
   *[data-section-id],
   *[data-block-id] {
     all: unset;
     display: revert;
     font-family: inherit;
   }
   
   *[data-json-key],
   *[data-section-id],
   *[data-block-id] {
     color: inherit;
     text-align: inherit;
     line-height: inherit;
   }
   ```

3. **Salve o arquivo** (Ctrl+S)

### **PASSO 5: Testar e Verificar**

1. **Recarregue a página com cache limpo:**
   ```
   Ctrl+Shift+R
   ```

2. **Verifique visualmente:**
   - Os elementos devem manter a aparência original
   - Estilos agora vêm **APENAS** do banco de dados

3. **Teste edição de estilos:**
   - Abra o Visual Editor
   - Edite um estilo (ex: fontSize de um título)
   - Salve
   - Recarregue a página
   - ✅ O estilo deve persistir corretamente

## 🐛 Troubleshooting

### Erro: "Nenhum elemento encontrado"
**Causa:** A página não carregou completamente ou os elementos não têm os atributos corretos.

**Solução:** Recarregue a página e aguarde o carregamento completo antes de executar o script.

---

### Erro: "Variáveis de ambiente não encontradas"
**Causa:** Arquivo `.env.local` não existe ou não tem as credenciais Supabase.

**Solução:** Verifique se `.env.local` contém:
```env
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

### Erro: "JSON muito grande" no Console
**Causa:** O JSON capturado pode ter 50-100KB ou mais.

**Solução:** 
1. Role o console até o final do JSON
2. Clique com botão direito → "Copy object"
3. Ou use a cópia automática para clipboard

---

### Estilos não aparecem após reset
**Causa:** Provavelmente o banco de dados não foi populado corretamente.

**Solução:**
1. Verifique os logs do `populate-all-styles.js`
2. Confirme se não houve erros
3. Execute uma query no Supabase:
   ```sql
   SELECT COUNT(*) FROM style_entries WHERE page_id = 'index';
   ```
4. Deve retornar o número de elementos capturados

---

### Alguns elementos perderam estilos
**Causa:** Esses elementos podem ter valores CSS padrão que foram filtrados na captura.

**Solução:**
1. Edite o elemento no Visual Editor
2. Configure os estilos manualmente
3. Salve - agora ficará no banco de dados

## 📊 Estrutura do Banco de Dados

### Tabela: `style_entries`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `page_id` | TEXT | ID da página (`index`, `artigos`, etc.) |
| `json_key` | TEXT | Identificador único (json-key, section-id, ou block-id) |
| `css_properties` | JSONB | Objeto com propriedades CSS em camelCase |
| `updated_at` | TIMESTAMP | Data/hora da última atualização |

### Exemplo de Entrada:

```json
{
  "page_id": "index",
  "json_key": "index.hero.title",
  "css_properties": {
    "fontSize": "72px",
    "fontWeight": "700",
    "fontFamily": "Playfair Display, serif",
    "color": "rgb(255, 215, 0)",
    "lineHeight": "1.2"
  },
  "updated_at": "2025-11-12T15:30:00.000Z"
}
```

## 🔄 Migração para Outras Páginas

Para migrar estilos de outras páginas (ex: `artigos`, `tratamentos`):

1. Navegue para a página desejada
2. Execute `capture-all-styles.js` no Console
3. Cole o JSON em `populate-all-styles.js`
4. **IMPORTANTE:** Altere o `pageId` no script:
   ```javascript
   const pageId = 'artigos'; // ou 'tratamentos', etc.
   ```
5. Execute `node scripts/populate-all-styles.js`

## ✅ Checklist Final

- [ ] Reset CSS desabilitado temporariamente
- [ ] Estilos capturados no navegador
- [ ] JSON copiado com sucesso
- [ ] JSON colado em `populate-all-styles.js`
- [ ] Script executado sem erros
- [ ] Todos os elementos foram populados no DB
- [ ] Reset CSS descomentado em `src/index.css`
- [ ] Página recarregada e aparência preservada
- [ ] Edição de estilos testada e funcionando

## 🎉 Sucesso!

Após completar todos os passos, seus elementos editáveis usarão **EXCLUSIVAMENTE** estilos do banco de dados, eliminando conflitos com Tailwind CSS e garantindo persistência perfeita! 🚀
