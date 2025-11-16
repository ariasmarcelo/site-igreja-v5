import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePageContent } from '@/hooks/useContent';
import PageLoader from '@/components/PageLoader';

interface ArtigosTexts {
  articles: { esoterica?: Array<Record<string, string>>; cientifica?: Array<Record<string, string>>; unificada?: Array<Record<string, string>> };
  sections?: {
    intro_title?: string;
    development_title?: string;
    applications_title?: string;
    conclusion_title?: string;
    related_title?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function ArtigoDetalhes() {
  const { data: pageLabels } = usePageContent<ArtigoLabels>('artigo-template');
  const { slug } = useParams<{ slug: string }>();
  const { data: texts, loading: textsLoading } = usePageContent<ArtigosTexts>('artigos');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Buscar artigo em todas as categorias
  const allArticles = [
    ...(texts?.articles?.esoterica || []),
    ...(texts?.articles?.cientifica || []),
    ...(texts?.articles?.unificada || [])
  ];

  const article = allArticles.find(a => a.slug === slug);

  // Mostrar loading enquanto carrega
  if (textsLoading) {
    return <PageLoader />;
  }

  // Se terminou de carregar e não encontrou, redireciona
  if (!article) {
    return <Navigate to="/artigos" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-linear-to-r from-yellow-500 via-yellow-400 to-amber-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <Link 
            to="/artigos" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Voltar para Artigos
          </Link>
          
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              {article.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{article.readTime} min de leitura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-yellow-200/40">
            <div className="prose prose-lg max-w-none">
              <div className="text-slate-700 leading-relaxed space-y-6">
                <p className="text-xl font-medium text-slate-800 border-l-4 border-yellow-500 pl-6 py-2 bg-yellow-50/50">
                  {article.excerpt}
                </p>

                {/* Conteúdo do artigo - Aqui você pode expandir com campos adicionais no JSON */}
                <div className="mt-8 space-y-6">
                  <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-4" data-json-key="artigo-template.sections.intro_title">{pageLabels?.sections?.intro_title || 'Introdução'}</h2>
                  <p>
                    Este artigo explora {article.title.toLowerCase()}, apresentando uma perspectiva 
                    {article.type === 'esoterica' ? ' espiritual e tradicional' : 
                     article.type === 'cientifica' ? ' científica e baseada em evidências' : 
                     ' integrativa que une ciência e espiritualidade'} sobre o tema.
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-4" data-json-key="artigo-template.sections.development_title">{pageLabels?.sections?.development_title || 'Desenvolvimento'}</h2>
                  <p>
                    {article.type === 'esoterica' && 
                      'A sabedoria ancestral nos ensina que o conhecimento verdadeiro transcende a mera compreensão intelectual. Através das práticas espirituais milenares, podemos acessar dimensões mais profundas da consciência e da realidade.'
                    }
                    {article.type === 'cientifica' && 
                      'Estudos científicos recentes têm demonstrado evidências cada vez mais robustas sobre os mecanismos fisiológicos e neurológicos envolvidos nestes processos. A pesquisa contemporânea oferece novas perspectivas sobre fenômenos tradicionalmente considerados apenas místicos.'
                    }
                    {article.type === 'unificada' && 
                      'A integração entre a sabedoria ancestral e a ciência moderna revela que estas duas formas de conhecimento não são opostas, mas complementares. Juntas, oferecem uma compreensão mais completa da natureza humana e do universo.'
                    }
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-4" data-json-key="artigo-template.sections.applications_title">{pageLabels?.sections?.applications_title || 'Aplicações Práticas'}</h2>
                  <p>
                    O conhecimento apresentado neste artigo pode ser aplicado de diversas formas no dia a dia, 
                    contribuindo para o desenvolvimento pessoal, a cura e a transformação interior. 
                    É importante abordar estas práticas com respeito, disciplina e orientação adequada.
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-12 mb-4" data-json-key="artigo-template.sections.conclusion_title">{pageLabels?.sections?.conclusion_title || 'Conclusão'}</h2>
                  <p>
                    Ao explorar {article.title.toLowerCase()}, abrimos portas para uma compreensão mais 
                    profunda de nós mesmos e do universo. Este conhecimento, quando integrado adequadamente, 
                    tem o poder de transformar nossa experiência de vida e contribuir para nossa evolução 
                    como seres humanos.
                  </p>
                </div>

                {/* Call to Action */}
                <div className="mt-12 p-8 bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200/50">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Quer saber mais?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Entre em contato conosco para agendar uma consulta ou conhecer nossos tratamentos associados.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/contato" 
                      className="inline-flex items-center px-6 py-3 bg-linear-to-r from-yellow-500 to-amber-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      Entre em Contato
                    </Link>
                    <Link 
                      to="/tratamentos" 
                      className="inline-flex items-center px-6 py-3 bg-white text-slate-700 rounded-full font-semibold border-2 border-yellow-200 hover:border-yellow-400 transition-all hover:-translate-y-0.5"
                    >
                      Conheça os Tratamentos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-8" data-json-key="artigo-template.sections.related_title">{pageLabels?.sections?.related_title || 'Artigos Relacionados'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allArticles
                .filter(a => a.type === article.type && a.id !== article.id)
                .slice(0, 3)
                .map(relatedArticle => (
                  <Link 
                    to={`/artigos/${relatedArticle.slug}`} 
                    key={relatedArticle.id}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl p-6 border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all hover:shadow-xl hover:-translate-y-1">
                      <Badge className="mb-3 bg-yellow-500 text-slate-900">
                        {relatedArticle.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {relatedArticle.readTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
