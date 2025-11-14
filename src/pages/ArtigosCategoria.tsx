import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import PageLoader from '@/components/PageLoader';

interface ArtigosTexts {
  articles: { [key: string]: Array<Record<string, string>> };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function ArtigosCategoria() {
  const { categoria } = useParams<{ categoria: string }>();
  const { texts, loading: textsLoading } = useLocaleTexts<ArtigosTexts>('artigos');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Mapear categorias
  const categoryMap: { [key: string]: string } = {
    'espiritualidade': 'Espiritualidade e Misticismo',
    'ciencia': 'Ciência e Consciência',
    'praticas': 'Práticas Terapêuticas',
    'integracao': 'Integração Mente-Corpo',
  };

  const categoryName = categoryMap[categoria || ''];

  // Mostrar loading enquanto carrega
  if (textsLoading) {
    return <PageLoader />;
  }

  if (!categoryName) {
    return <Navigate to="/artigos" replace />;
  }

  // Buscar artigos da categoria em todas as tabs
  const allArticles = [
    ...(texts?.articles?.esoterica || []),
    ...(texts?.articles?.cientifica || []),
    ...(texts?.articles?.unificada || [])
  ];

  const filteredArticles = allArticles.filter(a => a.category === categoryName);

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {categoryName}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <Link 
                  to={`/artigos/${article.slug}`} 
                  key={article.id}
                  className="group"
                >
                  <div className="h-full bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="p-6">
                      <Badge className="mb-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                        {article.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(article.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-yellow-200/40 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Nenhum artigo encontrado
                </h2>
                <p className="text-slate-600 mb-8">
                  Não há artigos disponíveis nesta categoria no momento.
                </p>
                <Link 
                  to="/artigos" 
                  className="inline-flex items-center px-6 py-3 bg-linear-to-r from-yellow-500 to-amber-500 text-white rounded-full font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Ver Todos os Artigos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
