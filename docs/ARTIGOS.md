# Sistema de Artigos

## 📚 Estrutura Atual (Novembro 2025)

O sistema de artigos possui **12 artigos** organizados em **3 literaturas** com **4 categorias temáticas**:

### 📖 Literaturas (Abas)

#### 🔮 Literatura Esotérica (4 artigos)
- **Categorias mostradas**: Espiritualidade e Misticismo, Práticas Terapêuticas
- Artigos focados em sabedoria ancestral e práticas espirituais

#### 🔬 Literatura Científica (4 artigos)  
- **Categorias mostradas**: Ciência e Consciência, Práticas Terapêuticas
- Artigos baseados em evidências científicas e pesquisas

#### ⚛️ Literatura Unificada (4 artigos)
- **Categorias mostradas**: Todas as 4 categorias
- Artigos que integram ciência e espiritualidade

### 🗂️ Categorias Temáticas

1. **Espiritualidade e Misticismo**
   - Sabedoria ancestral e práticas espirituais
   - Aparece em: Esotérica, Unificada

2. **Ciência e Consciência**
   - Neurociência, física quântica e pesquisas
   - Aparece em: Científica, Unificada

3. **Práticas Terapêuticas**
   - Meditação, respiração e técnicas de cura
   - Aparece em: Todas as 3 literaturas

4. **Integração Mente-Corpo**
   - União entre ciência e espiritualidade
   - Aparece em: Unificada

## 📋 Lista de Artigos

### Literatura Esotérica
1. **Os Sete Princípios Herméticos e a Transformação Interior** (Espiritualidade e Misticismo)
2. **Xamanismo e Estados Ampliados de Consciência** (Espiritualidade e Misticismo)
3. **Meditação Vipassana: O Caminho da Observação Pura** (Práticas Terapêuticas)
4. **Mantras e Geometria Sagrada: A Ciência do Som Divino** (Práticas Terapêuticas)

### Literatura Científica
5. **Neurociência da Meditação: Como o Cérebro se Transforma** (Ciência e Consciência)
6. **A Física Quântica e a Consciência: Novas Perspectivas** (Ciência e Consciência)
7. **Respiração Holotrópica: Base Científica e Aplicações** (Práticas Terapêuticas)
8. **Epigenética e Trauma: A Ciência da Cura Geracional** (Ciência e Consciência)

### Literatura Unificada
9. **Onde a Ciência Encontra o Espírito: A Natureza da Consciência** (Integração Mente-Corpo)
10. **Chakras e o Sistema Nervoso: Uma Perspectiva Integrativa** (Integração Mente-Corpo)
11. **Estados de Flow e Samadhi: Neurociência e Meditação** (Práticas Terapêuticas)
12. **A Glândula Pineal: Ponte entre Matéria e Espírito** (Integração Mente-Corpo)

## 🛣️ Rotas

### Página Principal de Artigos
```
/artigos
```
Exibe três abas (Esotérica, Científica, Unificada):
- **Esotérica**: 2 categorias clicáveis + 4 artigos
- **Científica**: 2 categorias clicáveis + 4 artigos  
- **Unificada**: 4 categorias clicáveis + 4 artigos

### Artigo Individual
```
/artigos/:slug
```
Exemplo: `/artigos/sete-principios-hermeticos-transformacao`

### Artigos por Categoria
```
/artigos/categoria/:categoria
```
Exemplos:
- `/artigos/categoria/espiritualidade` - Espiritualidade e Misticismo
- `/artigos/categoria/ciencia` - Ciência e Consciência
- `/artigos/categoria/praticas` - Práticas Terapêuticas
- `/artigos/categoria/integracao` - Integração Mente-Corpo

## 🔄 Sincronização

Para sincronizar os artigos do JSON com o banco de dados:

```powershell
.\scripts\sync-artigos.ps1
```

## 🎨 Design

- **Tema de Cores**: Amarelo/Âmbar (conhecimento, sabedoria, estudo)
- **Ícones por Literatura**:
  - Esotérica: Scroll (pergaminho)
  - Científica: Microscope (microscópio)
  - Unificada: Atom (átomo)
- **Ícones por Categoria**:
  - Espiritualidade: Sparkles
  - Ciência: Lightbulb
  - Práticas: Infinity
  - Integração: Heart

## 📝 Estrutura de Dados do Artigo

```typescript
{
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string; // "Desenvolvimento Espiritual" | "Meditação" | "Cura e Terapia" | "Conhecimento"
  author: string;
  date: string; // "YYYY-MM-DD"
  readTime: number; // minutos
  type: "esoterica" | "cientifica" | "unificada"
}
```

## 🚀 Próximos Passos

1. ✅ Estrutura de dados criada
2. ✅ Páginas implementadas
3. ✅ Rotas configuradas
4. ⏳ Sincronização com Supabase (pendente conexão)
5. ⏳ Expandir conteúdo dos artigos (atualmente usando template)
6. ⏳ Adicionar funcionalidade de busca
7. ⏳ Implementar sistema de tags
8. ⏳ Adicionar compartilhamento social
