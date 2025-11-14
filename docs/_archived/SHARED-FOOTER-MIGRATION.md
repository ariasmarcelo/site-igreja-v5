# 🔄 Migração: Footer Compartilhado

## ✅ Passo 1: Executar SQL no Supabase

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (ícone de banco de dados na lateral)
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `supabase/migrations/20251113_shared_content.sql`
6. Clique em **RUN** (ou pressione Ctrl+Enter)

**Resultado esperado:**
```
✅ Query executada com sucesso
📊 Verificação mostrará:
   🌐 COMPARTILHADO    ✅ TEM footer    ⚠️  SÓ footer
   index               ❌ SEM footer    ✅ TEM conteúdo
   purificacao         ❌ SEM footer    ✅ TEM conteúdo
   ... (outras páginas)
```

---

## ✅ Passo 2: Verificar migração

```bash
node scripts/check-footers.js
```

**Resultado esperado:**
```
📊 Páginas no Supabase:

   COMPARTILHADO   ✅ TEM footer
      Copyright: © 2025 Igreja de Metatron. Todos os direitos reservados.
      Trademark: Marcas registradas® protegidas por lei.
   index           ❌ SEM footer
   purificacao     ❌ SEM footer
   ...
```

---

## ✅ Passo 3: Atualizar o código (automático)

```bash
node scripts/implement-shared-footer.js
```

Este script irá:
1. Atualizar `useLocaleTexts.ts` para usar `.or()` e fazer merge
2. Remover footers hardcoded de 4 componentes
3. Adicionar `data-json-key` nos footers

---

## 🎯 Resultado Final

Todas as páginas terão o footer vindo do banco:
```tsx
<p data-json-key="footer.copyright">{texts.footer.copyright}</p>
<p data-json-key="footer.trademark">{texts.footer.trademark}</p>
```

**Para alterar o copyright no futuro:**
```bash
node scripts/update-shared-footer.js --year=2026
```

Ou direto no Supabase:
```sql
UPDATE page_contents 
SET content = jsonb_set(
  content, 
  '{footer,copyright}', 
  '"© 2026 Igreja de Metatron. Todos os direitos reservados."'
)
WHERE page_id IS NULL;
```

Uma mudança → todas as páginas atualizadas! ✨
