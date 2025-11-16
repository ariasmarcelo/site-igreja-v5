-- Atualizar artigos existentes para usar novo sistema de categorias
-- Execute APÓS a migração de hierarquia

-- Artigo 1: Ascensão Espiritual (Esoterismo > Ascensão + Conhecimento)
DO $$
DECLARE
  artigo_id UUID;
  cat_ascensao UUID;
  cat_conhecimento UUID;
BEGIN
  -- Buscar artigo
  SELECT id INTO artigo_id FROM artigos WHERE slug = 'jornada-ascensao-espiritual';
  
  IF artigo_id IS NOT NULL THEN
    -- Buscar categorias
    SELECT ac.id INTO cat_ascensao 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'ascensao-espiritual' AND acl.slug = 'esoterismo';
    
    SELECT ac.id INTO cat_conhecimento 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'conhecimento-esoterico' AND acl.slug = 'esoterismo';
    
    -- Associar categorias
    INSERT INTO artigos_categorias_rel (artigo_id, categoria_id) 
    VALUES (artigo_id, cat_ascensao), (artigo_id, cat_conhecimento)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Artigo 2: Neurociência da Meditação (Ciência > Neurociência + Práticas > Meditação)
DO $$
DECLARE
  artigo_id UUID;
  cat_neuro UUID;
  cat_med UUID;
BEGIN
  SELECT id INTO artigo_id FROM artigos WHERE slug = 'neurociencia-meditacao-evidencias';
  
  IF artigo_id IS NOT NULL THEN
    SELECT ac.id INTO cat_neuro 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'neurociencia' AND acl.slug = 'ciencia';
    
    SELECT ac.id INTO cat_med 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'meditacao' AND acl.slug = 'praticas';
    
    INSERT INTO artigos_categorias_rel (artigo_id, categoria_id) 
    VALUES (artigo_id, cat_neuro), (artigo_id, cat_med)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Artigo 3: Regressão (Desenvolvimento > Cura Interior)
DO $$
DECLARE
  artigo_id UUID;
  cat_cura UUID;
BEGIN
  SELECT id INTO artigo_id FROM artigos WHERE slug = 'liberando-traumas-regressao';
  
  IF artigo_id IS NOT NULL THEN
    SELECT ac.id INTO cat_cura 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'cura-interior' AND acl.slug = 'desenvolvimento';
    
    INSERT INTO artigos_categorias_rel (artigo_id, categoria_id) 
    VALUES (artigo_id, cat_cura)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Artigo 4: Lua Nova (Práticas > Rituais + Esoterismo > Conhecimento)
DO $$
DECLARE
  artigo_id UUID;
  cat_rituais UUID;
  cat_conhecimento UUID;
BEGIN
  SELECT id INTO artigo_id FROM artigos WHERE slug = 'rituais-lua-nova-manifestacao';
  
  IF artigo_id IS NOT NULL THEN
    SELECT ac.id INTO cat_rituais 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'rituais' AND acl.slug = 'praticas';
    
    SELECT ac.id INTO cat_conhecimento 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'conhecimento-esoterico' AND acl.slug = 'esoterismo';
    
    INSERT INTO artigos_categorias_rel (artigo_id, categoria_id) 
    VALUES (artigo_id, cat_rituais), (artigo_id, cat_conhecimento)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Artigo 5: Chakras (Esoterismo > Energias e Chakras)
DO $$
DECLARE
  artigo_id UUID;
  cat_energia UUID;
BEGIN
  SELECT id INTO artigo_id FROM artigos WHERE slug = 'sete-chakras-equilibrio';
  
  IF artigo_id IS NOT NULL THEN
    SELECT ac.id INTO cat_energia 
    FROM artigos_categorias ac 
    JOIN artigos_classes acl ON ac.classe_id = acl.id
    WHERE ac.slug = 'energias-chakras' AND acl.slug = 'esoterismo';
    
    INSERT INTO artigos_categorias_rel (artigo_id, categoria_id) 
    VALUES (artigo_id, cat_energia)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Atualizar search_vector de todos os artigos
UPDATE artigos SET updated_at = NOW();

-- Verificar resultado
SELECT 
  a.title,
  array_agg(DISTINCT acl.nome || ' > ' || ac.nome) as categorias
FROM artigos a
JOIN artigos_categorias_rel acr ON a.id = acr.artigo_id
JOIN artigos_categorias ac ON acr.categoria_id = ac.id
JOIN artigos_classes acl ON ac.classe_id = acl.id
GROUP BY a.id, a.title
ORDER BY a.title;
