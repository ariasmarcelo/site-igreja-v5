-- Script para deletar tabela page_contents (LEGACY)
-- Data: 2025-11-15
-- Razão: Tabela obsoleta, apenas text_entries é usada

-- Deletar tabela
DROP TABLE IF EXISTS page_contents CASCADE;

-- Confirmar deleção
SELECT 'Tabela page_contents deletada com sucesso' AS status;
