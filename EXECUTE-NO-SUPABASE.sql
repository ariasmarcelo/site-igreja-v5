-- ============================================
-- MIGRATION: Estrutura Granular
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. Tabela para textos individuais
CREATE TABLE text_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  json_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_text_entries_page_id ON text_entries(page_id);
CREATE INDEX idx_text_entries_json_key ON text_entries(json_key);

-- 2. Tabela para estilos individuais
CREATE TABLE style_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  json_key TEXT NOT NULL UNIQUE,
  css_properties JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_style_entries_page_id ON style_entries(page_id);
CREATE INDEX idx_style_entries_json_key ON style_entries(json_key);

-- 3. Função para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Triggers
CREATE TRIGGER update_text_entries_updated_at
  BEFORE UPDATE ON text_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_entries_updated_at
  BEFORE UPDATE ON style_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CONCLUÍDO! 
-- Após executar, volte ao terminal e rode:
-- node scripts/migrate-to-granular.js
-- ============================================
