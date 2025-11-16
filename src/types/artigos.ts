// Types para o novo sistema hierárquico de categorias
// Classe = Organização (Igreja de Metatron ou Instituto Metatron)
// Categoria = Tema do artigo dentro da organização

export interface ArtigoClasse {
  id: string;
  nome: string; // "Igreja de Metatron" ou "Instituto Metatron"
  slug: string;
  descricao: string | null;
  ordem: number;
  created_at: string;
}

export interface ArtigoCategoria {
  id: string;
  classe_id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ordem: number;
  created_at: string;
  classe?: ArtigoClasse; // Populated via join
}

export interface ArtigoPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  cover_image: string;
  published_at: string | null; // NULL = rascunho, NOT NULL = publicado
  archived_at: string | null;  // NULL = ativo, NOT NULL = arquivado
  created_at: string;
  updated_at: string;
  views: number;
  
  // Relacionamentos (populated via joins)
  categorias?: ArtigoCategoria[];
  categorias_ids?: string[];
}

// Helper type para status computado
export type ArtigoStatus = 'draft' | 'published' | 'archived';

export interface ArtigoComStatus extends ArtigoPost {
  status: ArtigoStatus;
}

export interface ArtigoComCategorias extends ArtigoPost {
  categorias_nomes: string[];
  categorias_slugs: string[];
  classes_nomes: string[];
  classes_slugs: string[];
}

export interface CategoriaTree {
  classe: ArtigoClasse;
  categorias: ArtigoCategoria[];
}
