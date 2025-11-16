-- Criação da tabela artigos para o sistema de artigos/artigos
-- Execute este SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS artigos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Igreja Metatron',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_artigos_slug ON artigos(slug);
CREATE INDEX IF NOT EXISTS idx_artigos_category ON artigos(category);
CREATE INDEX IF NOT EXISTS idx_artigos_published ON artigos(published);
CREATE INDEX IF NOT EXISTS idx_artigos_published_at ON artigos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_artigos_tags ON artigos USING GIN(tags);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_artigos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_artigos_updated_at
  BEFORE UPDATE ON artigos
  FOR EACH ROW
  EXECUTE FUNCTION update_artigos_updated_at();

-- RLS (Row Level Security) - Permitir leitura pública, escrita autenticada
ALTER TABLE artigos ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode ler posts publicados
CREATE POLICY "Public can read published posts"
  ON artigos
  FOR SELECT
  USING (published = true);

-- Política: Permitir todas operações (temporário - ajustar depois com auth)
CREATE POLICY "Allow all operations for now"
  ON artigos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comentários para documentação
COMMENT ON TABLE artigos IS 'Armazena os artigos/posts do artigos da Igreja Metatron';
COMMENT ON COLUMN artigos.slug IS 'URL-friendly identifier único para o post';
COMMENT ON COLUMN artigos.excerpt IS 'Resumo curto para cards e listagens';
COMMENT ON COLUMN artigos.tags IS 'Array de tags para categorização adicional';
COMMENT ON COLUMN artigos.published IS 'Se false, post é rascunho';
COMMENT ON COLUMN artigos.views IS 'Contador de visualizações do post';
