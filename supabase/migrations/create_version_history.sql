-- Tabela para armazenar histórico de versões de conteúdo
CREATE TABLE IF NOT EXISTS page_history (
  id BIGSERIAL PRIMARY KEY,
  page_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('json', 'css')),
  content JSONB,
  css TEXT,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT DEFAULT 'admin'
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_page_history_page_id ON page_history(page_id);
CREATE INDEX IF NOT EXISTS idx_page_history_saved_at ON page_history(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_history_lookup ON page_history(page_id, content_type, saved_at DESC);

-- Função para limpar versões antigas (mantém apenas as 5 mais recentes)
CREATE OR REPLACE FUNCTION cleanup_old_versions()
RETURNS TRIGGER AS $$
BEGIN
  -- Deletar versões antigas, mantendo apenas as 5 mais recentes para cada page_id + content_type
  DELETE FROM page_history
  WHERE id IN (
    SELECT id FROM page_history
    WHERE page_id = NEW.page_id AND content_type = NEW.content_type
    ORDER BY saved_at DESC
    OFFSET 5
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar a limpeza automaticamente após inserção
DROP TRIGGER IF EXISTS trigger_cleanup_versions ON page_history;
CREATE TRIGGER trigger_cleanup_versions
  AFTER INSERT ON page_history
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_versions();

-- Comentários para documentação
COMMENT ON TABLE page_history IS 'Histórico de versões de conteúdo das páginas (mantém 5 versões mais recentes)';
COMMENT ON COLUMN page_history.content_type IS 'Tipo de conteúdo: json ou css';
COMMENT ON COLUMN page_history.content IS 'Conteúdo JSON da página (quando content_type = json)';
COMMENT ON COLUMN page_history.css IS 'Estilos CSS da página (quando content_type = css)';
