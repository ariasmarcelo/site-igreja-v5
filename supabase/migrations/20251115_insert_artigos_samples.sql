-- Dados de exemplo para artigos
-- Execute APÓS criar a tabela artigos

INSERT INTO artigos (title, slug, excerpt, content, author, category, tags, cover_image, published, published_at) VALUES

-- Artigo 1: Esotérico
(
  'A Jornada da Ascensão Espiritual',
  'jornada-ascensao-espiritual',
  'Compreenda os estágios fundamentais da elevação consciencial e como trilhar seu caminho de luz.',
  '<h2>Introdução</h2><p>A ascensão espiritual é um processo profundo de transformação interior que nos conecta com dimensões superiores de consciência.</p><h2>Os Três Pilares</h2><p><strong>1. Purificação:</strong> Libertar-se de padrões densos e energias dissonantes.</p><p><strong>2. Iluminação:</strong> Despertar para verdades universais e expandir a percepção.</p><p><strong>3. Integração:</strong> Ancorar a luz divina no cotidiano terreno.</p><h2>Práticas Diárias</h2><ul><li>Meditação matinal de 20 minutos</li><li>Limpeza energética com visualizações de luz violeta</li><li>Gratidão e serviço compassivo</li></ul><p>Lembre-se: o caminho é individual, mas nunca estamos sozinhos.</p>',
  'Igreja Metatron',
  'Desenvolvimento Espiritual',
  ARRAY['ascensão', 'espiritualidade', 'consciência', 'luz'],
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
  true,
  NOW() - INTERVAL '7 days'
),

-- Artigo 2: Científico
(
  'Neurociência da Meditação: Evidências Científicas',
  'neurociencia-meditacao-evidencias',
  'Pesquisas recentes demonstram como práticas meditativas alteram estruturas cerebrais e promovem bem-estar.',
  '<h2>Mudanças Neuroplásticas</h2><p>Estudos de neuroimagem revelam que a prática regular de meditação aumenta a densidade de massa cinzenta no córtex pré-frontal e hipocampo.</p><h2>Principais Descobertas</h2><p><strong>Redução do Estresse:</strong> Diminuição da atividade da amígdala, região associada à resposta de luta ou fuga.</p><p><strong>Foco Aprimorado:</strong> Aumento da conectividade na rede de atenção executiva.</p><p><strong>Regulação Emocional:</strong> Maior ativação do córtex cingulado anterior.</p><h2>Protocolo de 8 Semanas</h2><ol><li>Semanas 1-2: 10min/dia de atenção plena na respiração</li><li>Semanas 3-4: 15min/dia incluindo body scan</li><li>Semanas 5-8: 20min/dia com práticas variadas</li></ol><p><em>Referências: Davidson & Lutz (2008), Hölzel et al. (2011)</em></p>',
  'Instituto Metatron',
  'Conhecimento Esotérico',
  ARRAY['neurociência', 'meditação', 'pesquisa', 'cérebro'],
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
  true,
  NOW() - INTERVAL '5 days'
),

-- Artigo 3: Cura Interior
(
  'Liberando Traumas do Passado: A Técnica da Regressão',
  'liberando-traumas-regressao',
  'Explore como acessar memórias profundas pode desbloquear padrões limitantes e promover cura genuína.',
  '<h2>O Que É Regressão Terapêutica?</h2><p>A regressão é um processo guiado que permite acessar memórias armazenadas no inconsciente, incluindo experiências de vidas passadas.</p><h2>Quando Buscar Esta Técnica</h2><ul><li>Fobias inexplicáveis</li><li>Relacionamentos repetitivos disfuncionais</li><li>Bloqueios emocionais crônicos</li><li>Sensação de "missão incompleta"</li></ul><h2>Como Funciona</h2><p>Em estado de relaxamento profundo, a consciência expande além do tempo linear, acessando registros akáshicos e memórias celulares.</p><h2>Benefícios Relatados</h2><blockquote>Após minha sessão, consegui perdoar a mim mesma por escolhas que nem lembrava ter feito. Foi libertador." - Paciente M.S.</blockquote><p><strong>Importante:</strong> Este processo deve ser conduzido por terapeutas treinados em ambiente seguro.</p>',
  'Igreja Metatron',
  'Cura Interior',
  ARRAY['regressão', 'trauma', 'cura', 'terapia'],
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  true,
  NOW() - INTERVAL '3 days'
),

-- Artigo 4: Práticas
(
  'Rituais de Lua Nova: Manifestação e Recomeço',
  'rituais-lua-nova-manifestacao',
  'Aprenda a trabalhar com os ciclos lunares para potencializar suas intenções e iniciar novos projetos.',
  '<h2>A Energia da Lua Nova</h2><p>A Lua Nova representa o início de um novo ciclo, um momento poderoso para plantar sementes de intenção.</p><h2>Preparação do Espaço</h2><ol><li>Limpe o ambiente com defumação (alecrim, arruda ou palo santo)</li><li>Acenda velas brancas ou prateadas</li><li>Coloque cristais de quartzo claro ou selenita</li></ol><h2>Ritual Passo a Passo</h2><p><strong>1. Centragem (5min):</strong> Respire profundamente e conecte-se com seu coração.</p><p><strong>2. Gratidão (3min):</strong> Agradeça pelo ciclo que se encerra.</p><p><strong>3. Intenções (10min):</strong> Escreva até 10 desejos no tempo presente como se já realizados.</p><p><strong>4. Visualização (7min):</strong> Veja-se vivendo essas realidades com detalhes sensoriais.</p><p><strong>5. Encerramento:</strong> Queime ou guarde o papel em local sagrado.</p><h2>Dica Especial</h2><p>Repita afirmações durante 28 dias até a próxima Lua Nova para ancorar as energias.</p>',
  'Igreja Metatron',
  'Meditação e Práticas',
  ARRAY['lua nova', 'ritual', 'manifestação', 'astrologia'],
  'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800',
  true,
  NOW() - INTERVAL '1 day'
),

-- Artigo 5: Rascunho (não publicado)
(
  'Os 7 Chakras e Seu Equilíbrio',
  'sete-chakras-equilibrio',
  'Guia completo sobre os centros energéticos e como harmonizá-los.',
  '<h2>Introdução aos Chakras</h2><p>Os chakras são centros energéticos que regulam diferentes aspectos de nossa vida física, emocional e espiritual.</p><p><em>[Conteúdo em desenvolvimento...]</em></p>',
  'Instituto Metatron',
  'Desenvolvimento Espiritual',
  ARRAY['chakras', 'energia', 'equilíbrio'],
  '',
  false,
  NOW()
);

-- Atualizar contadores de visualizações para posts publicados
UPDATE artigos SET views = floor(random() * 500 + 50) WHERE published = true;
