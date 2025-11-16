# REGRAS PÉTREAS - IMUTÁVEIS #

**Definição:** Estas regras não podem ser removidas ou modificadas sem autorização explícita do usuário.

## 1. Propósito do Projeto ##

Desenvolver site institucional para a Igreja de Metatron com sistema de edição dinâmica de conteúdo textual armazenado em banco de dados Supabase e acessível via interface React.

**Missão do conteúdo:** Expressar que a cura e realização espiritual completa requer, primeiramente, regulação homeostática e equilíbrio harmônico do sistema nervoso autônomo. Traumas intensos ativam excessivamente os sistemas de defesa, bloqueando canais internos e fixando padrões disfuncionais. O trabalho da Igreja foca em reverter essa condição como base para avanço espiritual verdadeiro.

## 2. Gestão de Documentação ##

**Ao iniciar sessão:**
- Ler este documento completamente
- Ler todos documentos (.md) do pacote
- Reler backups para compreender histórico e evolução
- Gerar resumo: projeto, stack, mudanças recentes, estado atual

**Ao modificar documentos:**
- Reler documento integralmente antes de modificar
- Reescrever do zero para evitar incoerências
- Manter estilo de escrita profissional
- Corrigir erros de digitação
- Evitar abreviações informais ou gírias
- Não usar nomes genéricos (dev, server), usar nomes descritivos
- Não inserir hardcoded lists (orientar conceitualmente onde buscar)
- Atualizar seção "DADOS BÁSICOS GERAIS" com novidades
- Manter cinco versões de backup de arquivos modificados

## 3. Gestão de Conteúdo do Site ##

**Proibições absolutas:**
- Modificar textos do site sem consulta ao usuário
- Apenas sugerir melhorias, nunca aplicar

**Obrigações:**
- Visualizar site e ler todo conteúdo para compreensão profunda
- Sugerir melhorias textuais quando apropriado

## 4. Padrões de Código ##

**Qualidade:**
- Código limpo e modular
- Comentários claros e consistentes
- Tratamento de erros completo
- Testes automatizados quando possível
- Documentação: comentários, API docs, guias, exemplos

**Performance e Segurança:**
- Otimização: complexidade algorítmica, recursos, cache, escalabilidade
- Segurança: validação/sanitização, HTTPS, autenticação, proteção XSS/CSRF/SQL Injection, senhas seguras, atualizações regulares, logging de atividades suspeitas

**Revisão:**
- Análise criteriosa: bugs, vulnerabilidades, ineficiências
- Questionar incoerências comportamentais
- Sugerir melhorias continuamente
- Buscar soluções definitivas, evitar soluções temporárias

## 5. Scripts e Automação ##

**Obrigações:**
- Localizar e analisar scripts existentes
- Usar scripts para iniciar/parar servidor (nunca manual, sempre background)
- Verificar caminhos antes de executar comandos
- Sugerir melhorias aos scripts
- Nunca inserir emojis ou caracteres especiais em scripts

## 6. Arquitetura CSS - ITCSS (IMUTÁVEL) ##

**Proibições absolutas:**
- Estilos inline (`style={{...}}`) em componentes React
- Arquivos CSS fora da estrutura ITCSS
- Caminhos de import incorretos

**Estrutura obrigatória:**
```
src/styles/
├── settings/    # 1. Variáveis CSS e design tokens
├── base/        # 2. Estilos HTML base (body, h1-h6)
├── components/  # 3. Componentes reutilizáveis
├── layouts/     # 4. Layouts e páginas
│   └── pages/   # Páginas individuais
└── utilities/   # 5. Classes utilitárias
```

**Ordem de especificidade:** Settings → Base → Components → Layouts → Utilities (genérico → específico)

**Ponto de entrada:** `src/styles.css` (importado em `main.tsx`)

**Padrões de import:**
```tsx
// Páginas
import '@/styles/layouts/pages/nome-pagina.css'

// Componentes
import '@/styles/components/nome-componente.css'
```

**Imports no styles.css:**
```css
@import "./styles/settings/design-tokens.css";
@import "./styles/base/elements.css";
```

**Nomenclatura:**
- Páginas: `layouts/pages/{nome}.css`
- Componentes: `components/{nome}.css`
- Classes: BEM ou utility (`.card-elevated`, `.btn-gold`)

**Checklist obrigatório ao adicionar CSS:**
1. Arquivo no diretório correto da estrutura ITCSS?
2. Importado em `styles.css` na ordem correta?
3. Usa variáveis CSS (`var(--gold-500)`)?
4. Import correto no componente React?
5. Sem estilos inline?
6. Nome de classe descritivo?

**Documentação:** Consultar `src/styles/README.md`, `QUICK-GUIDE.md`, `SUMMARY.md`

# FIM DAS REGRAS PÉTREAS #

---

## REFERÊNCIAS TÉCNICAS ##

### Stack Tecnológica ###
**Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + React Router  
**Backend:** Vercel Serverless Functions (Node.js, CommonJS)  
**Database:** Supabase PostgreSQL - tabela `text_entries` com JSON granular  

### Arquitetura do Sistema ###

**Sistema de Fallback Granular:**  
Três camadas de dados (Supabase → JSONs locais → defaults hardcoded).  
📄 **Documentação completa:** `docs/GRANULAR-FALLBACK-SYSTEM-V2.md`

**Fluxo de Dados:**  
Página carrega → `usePageContent` busca `GET /api/content/:pageId` → Supabase retorna dados → Renderiza → Sincronização automática em background salva JSONs granulares em `src/locales/pt-BR/`

**Editor Visual:**  
Ativado via Admin Console. Detecta `data-json-key` atributo. Edições salvam via `PUT /api/content/:pageId`.

**Conteúdo Compartilhado:**  
`page_id = "__shared__"` (ex: footer). API mescla automaticamente com conteúdo específico.

### Estrutura de Pastas ###
```
api/                    # Serverless Functions (Vercel)
src/
  components/           # Componentes React
  pages/                # Páginas do site
  hooks/useContent.ts      # Hook usePageContent para páginas
  styles/               # ITCSS (ver regras pétreas)
scripts/                # Automação
docs/                   # Documentação técnica
```

### Scripts de Automação ###
**Desenvolvimento:** `pnpm dev` (inicia Vite Dev Server em http://localhost:3000)  
**Deploy:** `vercel --prod` (deploy para produção no Vercel)  
**Backup:** `node scripts/backup-supabase.js` (backup do banco de dados)

### Convenções de Código ###
**JSON Keys:** `pagina.secao.campo` ou `secao.campo` (compartilhado)  
**Componentes:** Sempre usar `usePageContent` e `data-json-key` para conteúdo editável

---

**Última Atualização:** 14/11/2025  
**Status:** Sistema de fallback granular implementado, ITCSS CSS arquitetura ativa
