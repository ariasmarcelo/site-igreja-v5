# Convenção de Nomenclatura para data-json-key

## Estrutura Geral

```
data-json-key="{pageId}.{jsonPath}"
```

### Componentes do ID:

1. **pageId**: Nome da página (index, quemSomos, tratamentos, etc)
2. **jsonPath**: Caminho exato no arquivo JSON (hero.title, benefits[0].description, etc)

### 🔄 FLUXO COMPLETO

**1. No código TSX/JSX:**
```tsx
<h1 data-json-key="index.hero.title">
```

**2. Enviado para API (VisualPageEditor):**
```json
{
  "pageId": "index",
  "edits": {
    "index.hero.title": "Novo Título"
  }
}
```

**3. API remove o prefixo automaticamente (server/api.js):**
```javascript
// "index.hero.title" → "hero.title"
const jsonKey = elementId.substring(pagePrefix.length);
```

**4. Salvo no JSON (Index.json):**
```json
{
  "hero": {
    "title": "Novo Título"
  }
}
```

### ✅ Vantagens desta Abordagem

- **Rastreabilidade**: Sempre sabe de qual página veio a edição
- **Validação**: API valida se pageId bate com arquivo JSON
- **Sem perda de informação**: Dados completos em todo o fluxo
- **Escalável**: Suporta edição de múltiplas páginas simultaneamente
- **Unicidade no DOM**: IDs únicos globalmente (evita conflitos)

---

## Regras de Formatação

### 1. Separadores
- **Ponto (.)** para hierarquia: `index.hero.title`
- **Underscore (_)** para palavras compostas: `triple_protection`
- **Hífen (-)** para variações: `button-primary`
- **Colchetes ([n])** para arrays: `benefits[0].title`

### 2. Case Sensitivity
- **camelCase** para IDs compostos: `heroSection`, `mainTitle`
- **snake_case** para seções longas: `physical_spiritual_section`

### 3. Tipos de Componentes Padrão
| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `title` | Título principal (h1, h2) | `hero.title` |
| `subtitle` | Subtítulo (h3, h4) | `hero.subtitle` |
| `text` | Parágrafo de texto | `intro.text` |
| `description` | Descrição detalhada | `service.description` |
| `button` | Botão clicável | `cta.button` |
| `link` | Link de navegação | `nav.link` |
| `icon` | Ícone SVG | `hero.icon` |
| `label` | Etiqueta/rótulo | `form.label` |
| `item` | Item genérico | `list.item` |

---

## Padrões por Contexto

### A. Elementos Únicos (aparecem 1 vez)
```tsx
// Formato: pageId.sectionId.componentType
<h1 data-json-key="index.hero.title">Título</h1>
<p data-json-key="index.hero.subtitle">Subtítulo</p>
```

### B. Elementos em Arrays (lista de itens)
```tsx
// Formato: pageId.sectionId.componentType[index].property
{benefits.map((item, i) => (
  <div key={i}>
    <h3 data-json-key={`index.benefits.item[${i}].title`}>{item.title}</h3>
    <p data-json-key={`index.benefits.item[${i}].description`}>{item.description}</p>
  </div>
))}
```

### C. Elementos Repetidos (mesmo conteúdo, contextos diferentes)
```tsx
// Formato: pageId.sectionId_context.componentType
<h2 data-json-key="index.section1_instituto.title">Instituto</h2>
<h2 data-json-key="index.section2_instituto.title">Instituto</h2>
<h2 data-json-key="index.footer_instituto.title">Instituto</h2>
```

### D. Ícones SVG
```tsx
// Formato: pageId.sectionId.icon.iconName
<svg data-json-key="index.hero.icon.sun_animated">...</svg>
<Sun data-json-key="index.benefits.icon.sun" />
<Heart data-json-key="index.testimonials.icon.heart[0]" />
```

### E. Elementos de Navegação
```tsx
// Formato: pageId.nav.position.link
<a data-json-key="index.nav.header.link[0]">Home</a>
<a data-json-key="index.nav.footer.link[2]">Contato</a>
```

### F. Cards/Blocos de Conteúdo
```tsx
// Formato: pageId.sectionId.card[index].componentType
<Card>
  <CardTitle data-json-key="index.services.card[0].title">Serviço 1</CardTitle>
  <CardDescription data-json-key="index.services.card[0].description">Desc</CardDescription>
</Card>
```

---

## Mapeamento para JSON

### Estrutura JSON correspondente:
```json
{
  "index": {
    "hero": {
      "title": "Título Hero",
      "subtitle": "Subtítulo Hero",
      "icon": {
        "sun_animated": {
          "styles": "{\"fill\":\"#CFAF5A\"}"
        }
      }
    },
    "benefits": {
      "item": [
        {
          "title": "Benefício 1",
          "description": "Descrição 1"
        }
      ]
    },
    "section1_instituto": {
      "title": "Instituto Metatron"
    }
  }
}
```

### Regras de Salvamento:
1. **Texto**: Salva em `{key}` + estilos em `{key}__styles`
2. **SVG**: Salva apenas estilos em `{key}.styles`
3. **Arrays**: Acessa via bracket notation `item[0].title`

---

## Exemplos Práticos por Seção

### Hero Section
```tsx
<section>
  <svg data-json-key="index.hero.icon.sun_animated">...</svg>
  <h1 data-json-key="index.hero.title">{texts.hero.title}</h1>
  <p data-json-key="index.hero.subtitle">{texts.hero.subtitle}</p>
  <Button data-json-key="index.hero.button.primary">CTA</Button>
</section>
```

### Benefits Section (com array)
```tsx
<section>
  <h2 data-json-key="index.benefits.section.title">{texts.benefits.title}</h2>
  <p data-json-key="index.benefits.section.subtitle">{texts.benefits.subtitle}</p>
  {benefits.map((benefit, i) => (
    <Card key={i}>
      <Sun data-json-key={`index.benefits.icon[${i}]`} />
      <h3 data-json-key={`index.benefits.item[${i}].title`}>{benefit.title}</h3>
      <p data-json-key={`index.benefits.item[${i}].description`}>{benefit.description}</p>
    </Card>
  ))}
</section>
```

### Footer (elementos repetidos de outras seções)
```tsx
<footer>
  <h2 data-json-key="index.footer_church.title">{texts.igreja.title}</h2>
  <p data-json-key="index.footer_church.description">{texts.igreja.description}</p>
  <nav>
    {links.map((link, i) => (
      <a key={i} data-json-key={`index.footer.nav.link[${i}]`}>{link}</a>
    ))}
  </nav>
</footer>
```

---

## Checklist de Validação

Antes de adicionar um `data-json-key`, pergunte:

- [ ] O ID é único na página inteira?
- [ ] O ID reflete a hierarquia lógica (página → seção → tipo)?
- [ ] Se é array, usei colchetes `[index]`?
- [ ] Se é conteúdo repetido, adicionei sufixo de contexto?
- [ ] O nome é auto-explicativo sem comentários?
- [ ] Corresponde à estrutura do JSON em `locales/pt-BR/`?

---

## Anti-Padrões (NÃO FAZER)

❌ **IDs genéricos**: `data-json-key="text1"`
✅ **IDs descritivos**: `data-json-key="index.hero.subtitle"`

❌ **IDs duplicados**: Dois elementos com `data-json-key="title"`
✅ **IDs contextualizados**: `section1.title` e `section2.title`

❌ **IDs desconectados do JSON**: `data-json-key="random.path"`
✅ **IDs mapeados**: Refletem estrutura real do JSON

❌ **Misturar português/inglês**: `data-json-key="secao.title"`
✅ **Consistência**: Tudo em inglês ou tudo em português

---

## Convenção de Estilo Adotada

Para este projeto, usamos:
- **Inglês** para estrutura (section, title, button)
- **Snake_case** para nomes longos (triple_protection)
- **CamelCase** para nomes curtos (heroTitle)
- **Colchetes** para arrays ([0], [1])
