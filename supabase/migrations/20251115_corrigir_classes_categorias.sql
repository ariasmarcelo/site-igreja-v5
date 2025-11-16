-- Correção: Classes devem ser "Igreja de Metatron" e "Instituto Metatron"
-- Execute no Supabase SQL Editor

-- 1. Limpar dados antigos
DELETE FROM artigos_categorias_rel;
DELETE FROM artigos_categorias;
DELETE FROM artigos_classes;

-- 2. Inserir classes corretas
INSERT INTO artigos_classes (nome, slug, descricao, ordem) VALUES
('Igreja de Metatron', 'igreja-metatron', 'Artigos publicados pela Igreja de Metatron', 1),
('Instituto Metatron', 'instituto-metatron', 'Artigos publicados pelo Instituto Metatron', 2)
ON CONFLICT (slug) DO UPDATE SET 
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  ordem = EXCLUDED.ordem;

-- 3. Inserir categorias para Igreja de Metatron
INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Esoterismo', 'esoterismo', 'Conhecimentos esotéricos e espirituais', 1
FROM artigos_classes WHERE slug = 'igreja-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Ascensão Espiritual', 'ascensao-espiritual', 'Processos de elevação consciencial', 2
FROM artigos_classes WHERE slug = 'igreja-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Energias e Chakras', 'energias-chakras', 'Trabalho com centros energéticos', 3
FROM artigos_classes WHERE slug = 'igreja-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Práticas Espirituais', 'praticas-espirituais', 'Meditações, rituais e práticas', 4
FROM artigos_classes WHERE slug = 'igreja-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Ensinamentos', 'ensinamentos', 'Sabedoria e ensinamentos espirituais', 5
FROM artigos_classes WHERE slug = 'igreja-metatron'
ON CONFLICT DO NOTHING;

-- 4. Inserir categorias para Instituto Metatron
INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Neurociência', 'neurociencia', 'Estudos sobre cérebro e consciência', 1
FROM artigos_classes WHERE slug = 'instituto-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Psicologia', 'psicologia', 'Comportamento humano e processos mentais', 2
FROM artigos_classes WHERE slug = 'instituto-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Terapias', 'terapias', 'Técnicas terapêuticas e de cura', 3
FROM artigos_classes WHERE slug = 'instituto-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Desenvolvimento Pessoal', 'desenvolvimento-pessoal', 'Crescimento e autoconhecimento', 4
FROM artigos_classes WHERE slug = 'instituto-metatron'
ON CONFLICT DO NOTHING;

INSERT INTO artigos_categorias (classe_id, nome, slug, descricao, ordem)
SELECT id, 'Pesquisas', 'pesquisas', 'Estudos e evidências científicas', 5
FROM artigos_classes WHERE slug = 'instituto-metatron'
ON CONFLICT DO NOTHING;

-- 5. Verificar estrutura criada
SELECT 
  acl.nome as classe,
  ac.nome as categoria,
  ac.slug
FROM artigos_classes acl
LEFT JOIN artigos_categorias ac ON acl.id = ac.classe_id
ORDER BY acl.ordem, ac.ordem;
