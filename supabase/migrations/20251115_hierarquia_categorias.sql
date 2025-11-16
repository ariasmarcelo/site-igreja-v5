-- Migração: Sistema Hierárquico de Categorização de Artigos
-- Execute no Supabase SQL Editor

-- 1. Criar tabela de classes (nível superior)
CREATE TABLE IF NOT EXISTS artigos_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar tabela de categorias (pertence a uma classe)
CREATE TABLE IF NOT EXISTS artigos_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classe_id UUID NOT NULL REFERENCES artigos_classes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  slug TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(classe_id, slug)
);

-- 3. Criar tabela de relacionamento (artigo pode ter múltiplas categorias)
CREATE TABLE IF NOT EXISTS artigos_categorias_rel (
  artigo_id UUID NOT NULL REFERENCES artigos(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES artigos_categorias(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (artigo_id, categoria_id)
);

-- 4. Remover coluna category antiga (se existir)
-- ALTER TABLE artigos DROP COLUMN IF EXISTS category;

-- 5. Adicionar coluna de busca full-text
ALTER TABLE artigos ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 6. Criar índice de busca full-text
CREATE INDEX IF NOT EXISTS idx_artigos_search ON artigos USING GIN(search_vector);

-- 7. Função para atualizar search_vector automaticamente
CREATE OR REPLACE FUNCTION update_artigos_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('portuguese', coalesce(NEW.author, '')), 'D') ||
    setweight(to_tsvector('portuguese', coalesce(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger para atualizar search_vector
DROP TRIGGER IF EXISTS trigger_artigos_search_vector ON artigos;
CREATE TRIGGER trigger_artigos_search_vector
  BEFORE INSERT OR UPDATE ON artigos
  FOR EACH ROW
  EXECUTE FUNCTION update_artigos_search_vector();

-- 9. Índices para performance
CREATE INDEX IF NOT EXISTS idx_artigos_categorias_classe ON artigos_categorias(classe_id);
CREATE INDEX IF NOT EXISTS idx_artigos_cat_rel_artigo ON artigos_categorias_rel(artigo_id);
CREATE INDEX IF NOT EXISTS idx_artigos_cat_rel_categoria ON artigos_categorias_rel(categoria_id);

-- 10. RLS Policies
ALTER TABLE artigos_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE artigos_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE artigos_categorias_rel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read classes" ON artigos_classes FOR SELECT USING (true);
CREATE POLICY "Public can read categorias" ON artigos_categorias FOR SELECT USING (true);
CREATE POLICY "Public can read categorias_rel" ON artigos_categorias_rel FOR SELECT USING (true);

CREATE POLICY "Allow all on classes" ON artigos_classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categorias" ON artigos_categorias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categorias_rel" ON artigos_categorias_rel FOR ALL USING (true) WITH CHECK (true);

-- 11. Inserir classes padrão
INSERT INTO artigos_classes (nome, slug, descricao, ordem) VALUES
('Esoterismo', 'esoterismo', 'Conhecimentos esotéricos, espirituais e místicos', 1),
('Ciência', 'ciencia', 'Artigos científicos, pesquisas e evidências', 2),
('Práticas', 'praticas', 'Rituais, meditações e exercícios práticos', 3),
('Desenvolvimento', 'desenvolvimento', 'Crescimento pessoal e espiritual', 4)
ON CONFLICT (slug) DO NOTHING;

-- 12. Inserir categorias para cada classe
-- Esoterismo
INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Ascensão Espiritual', 'ascensao-espiritual', 'Processos de elevação consciencial', 1
FROM artigos_classes WHERE slug = 'esoterismo'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Conhecimento Esotérico', 'conhecimento-esoterico', 'Sabedoria oculta e ensinamentos místicos', 2
FROM artigos_classes WHERE slug = 'esoterismo'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Energias e Chakras', 'energias-chakras', 'Trabalho com centros energéticos', 3
FROM artigos_classes WHERE slug = 'esoterismo'
ON CONFLICT DO NOTHING;

-- Ciência
INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Neurociência', 'neurociencia', 'Estudos sobre cérebro e consciência', 1
FROM artigos_classes WHERE slug = 'ciencia'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Psicologia', 'psicologia', 'Comportamento humano e processos mentais', 2
FROM artigos_classes WHERE slug = 'ciencia'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Pesquisas', 'pesquisas', 'Estudos e evidências científicas', 3
FROM artigos_classes WHERE slug = 'ciencia'
ON CONFLICT DO NOTHING;

-- Práticas
INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Meditação', 'meditacao', 'Técnicas de meditação e mindfulness', 1
FROM artigos_classes WHERE slug = 'praticas'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Rituais', 'rituais', 'Cerimônias e práticas ritualísticas', 2
FROM artigos_classes WHERE slug = 'praticas'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Exercícios', 'exercicios', 'Práticas para desenvolvimento pessoal', 3
FROM artigos_classes WHERE slug = 'praticas'
ON CONFLICT DO NOTHING;

-- Desenvolvimento
INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Cura Interior', 'cura-interior', 'Processos de cura emocional e espiritual', 1
FROM artigos_classes WHERE slug = 'desenvolvimento'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Autoconhecimento', 'autoconhecimento', 'Jornada de descoberta pessoal', 2
FROM artigos_classes WHERE slug = 'desenvolvimento'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Transformação', 'transformacao', 'Mudanças profundas e evolução', 3
FROM artigos_classes WHERE slug = 'desenvolvimento'
ON CONFLICT DO NOTHING;

-- 13. Comentários
COMMENT ON TABLE artigos_classes IS 'Classes principais de categorização (nível superior)';
COMMENT ON TABLE artigos_categorias IS 'Categorias que pertencem a uma classe específica';
COMMENT ON TABLE artigos_categorias_rel IS 'Relacionamento N:N entre artigos e categorias';
COMMENT ON COLUMN artigos.search_vector IS 'Vetor de busca full-text em português';

-- 14. View auxiliar para consultas com categorias
CREATE OR REPLACE VIEW artigos_com_categorias AS
SELECT 
  a.*,
  array_agg(DISTINCT ac.nome) FILTER (WHERE ac.nome IS NOT NULL) as categorias_nomes,
  array_agg(DISTINCT ac.slug) FILTER (WHERE ac.slug IS NOT NULL) as categorias_slugs,
  array_agg(DISTINCT acl.nome) FILTER (WHERE acl.nome IS NOT NULL) as classes_nomes,
  array_agg(DISTINCT acl.slug) FILTER (WHERE acl.slug IS NOT NULL) as classes_slugs
FROM artigos a
LEFT JOIN artigos_categorias_rel acr ON a.id = acr.artigo_id
LEFT JOIN artigos_categorias ac ON acr.categoria_id = ac.id
LEFT JOIN artigos_classes acl ON ac.classe_id = acl.id
GROUP BY a.id;

COMMENT ON VIEW artigos_com_categorias IS 'View com artigos e suas categorias/classes agregadas';
