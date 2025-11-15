# Arquitetura CSS - Igreja de Metatron

## 📐 Estrutura Baseada em ITCSS

Este projeto utiliza a metodologia **ITCSS (Inverted Triangle CSS)**, que organiza os estilos por **especificidade crescente**, do mais genérico ao mais específico.

## 📁 Estrutura de Diretórios

```
src/
├── styles.css                      # Arquivo principal (importa tudo)
├── tailwind.css                    # Configuração Tailwind
├── fonts.css                       # Fontes do projeto
│
└── styles/
    ├── settings/                   # 1️⃣ Variáveis e tokens
    │   └── design-tokens.css       # Cores, espaçamentos, fontes
    │
    ├── base/                       # 2️⃣ Estilos base HTML
    │   └── elements.css            # html, body, h1-h6, ProseMirror
    │
    ├── components/                 # 3️⃣ Componentes reutilizáveis
    │   ├── visual-editor.css       # Editor visual (botões flutuantes)
    │   └── testimonials-carousel.css # Carrossel de testemunhos
    │
    ├── layouts/                    # 4️⃣ Layouts e páginas
    │   ├── admin-console.css       # Admin Console
    │   └── pages/
    │       ├── index.css           # Homepage
    │       ├── quemsomos.css       # Quem Somos
    │       ├── contato.css         # Contato
    │       ├── purificacao.css     # Purificação
    │       ├── tratamentos.css     # Tratamentos
    │       ├── testemunhos.css     # Testemunhos
    │       └── artigos.css         # Artigos
    │
    └── utilities/                  # 5️⃣ Classes utilitárias
        └── helpers.css             # .metallic-gold, .btn-gold, etc.
```

## 🎯 Camadas (ITCSS)

### 1️⃣ Settings
**Localização:** `styles/settings/`
- Variáveis CSS (`:root`)
- Design tokens (cores, espaçamentos, tipografia)
- **Não gera CSS diretamente**

### 2️⃣ Base
**Localização:** `styles/base/`
- Estilos de elementos HTML sem classes
- `html`, `body`, `h1-h6`, `a`, `p`
- Resets e normalizações

### 3️⃣ Components
**Localização:** `styles/components/`
- Componentes reutilizáveis isolados
- Cada componente em arquivo separado
- Ex: carrosséis, modais, cards

### 4️⃣ Layouts
**Localização:** `styles/layouts/`
- Estruturas de página completas
- Admin console
- Páginas específicas (`layouts/pages/`)

### 5️⃣ Utilities
**Localização:** `styles/utilities/`
- Classes utilitárias de propósito único
- `.metallic-gold`, `.btn-gold`, `.card-elevated`
- Helpers e animações

## 🔄 Ordem de Importação

O arquivo `styles.css` importa tudo na ordem correta:

```css
/* 1. Settings (variáveis) */
@import "./settings/design-tokens.css";

/* 2. Generic (reset, normalize) */
@import "./tailwind.css";
@import "./fonts.css";

/* 3. Elements (HTML base) */
@import "./base/elements.css";

/* 4. Components (reutilizáveis) */
@import "./components/visual-editor.css";
@import "./components/testimonials-carousel.css";

/* 5. Layouts (páginas) */
@import "./layouts/admin-console.css";
@import "./layouts/pages/index.css";
@import "./layouts/pages/quemsomos.css";
/* ... */

/* 6. Utilities (helpers) */
@import "./utilities/helpers.css";
```

## ✅ Boas Práticas

### ✔️ O que fazer:
- **Um CSS por componente/página** isolado
- **Nomes de classes descritivos** e semânticos
- **Usar variáveis CSS** (`var(--gold-500)`)
- **Evitar !important** sempre que possível
- **Mobile-first** com media queries

### ❌ O que evitar:
- **Estilos inline** (`style={{...}}`)
- **Classes genéricas demais** (`.box`, `.item`)
- **CSS duplicado** entre arquivos
- **Especificidade excessiva** (`div.class#id`)

## 🎨 Classes Utilitárias Disponíveis

### Metallic Gradients
```css
.metallic-gold
.metallic-silver
.metallic-green
.metallic-blue
```

### Buttons
```css
.btn-gold
.btn-silver
```

### Cards
```css
.card-elevated
```

### Animations
```css
.fade-in
.slide-up
```

## 📝 Como Adicionar Novos Estilos

### 1. Novo Componente
Criar arquivo em `styles/components/nome-componente.css` e importar em `styles.css`

### 2. Nova Página
Criar arquivo em `styles/layouts/pages/nome-pagina.css` e importar em `styles.css`

### 3. Nova Utility
Adicionar em `styles/utilities/helpers.css`

### 4. Novo Token
Adicionar em `styles/settings/design-tokens.css`

## 🔍 Benefícios desta Arquitetura

✅ **Manutenibilidade:** Fácil encontrar e modificar estilos
✅ **Escalabilidade:** Estrutura clara para crescimento
✅ **Performance:** Imports otimizados, CSS organizado
✅ **Colaboração:** Desenvolvedores sabem onde procurar
✅ **Especificidade:** Controle natural da cascata CSS
✅ **Reutilização:** Componentes isolados e portáveis

## 📚 Referências

- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [CSS Architecture Best Practices](https://github.com/sturobson/BEM-resources)
