import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, Tag, User, Sparkles, Book, Heart, Infinity as InfinityIcon, Lightbulb, Scroll, Microscope, Atom } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';

import { supabase } from '@/lib/supabase';
import PageLoader from '@/components/PageLoader';

interface ArtigosTexts {
  header: { title: string; subtitle: string };
  tabs: { esoterica: string; cientifica: string; all: string };
  sections: {
    esoterica_wisdom_title: string;
    esoterica_wisdom_subtitle: string;
    esoterica_categories_title: string;
    esoterica_articles_title: string;
    cientifica_wisdom_title: string;
    cientifica_wisdom_subtitle: string;
    cientifica_categories_title: string;
    cientifica_articles_title: string;
    unificada_wisdom_title: string;
    unificada_wisdom_subtitle: string;
    unificada_categories_title: string;
    unificada_articles_title: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ArtigoPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  cover_image: string;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  views: number;
}

export default function Artigos() {
  usePageStyles('artigos');
  const { data: texts, loading: textsLoading, error: textsError } = usePageContent<ArtigosTexts>('artigos');
  const [posts, setPosts] = useState<ArtigoPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('esoterica');

  // Usar artigos do JSON em vez do Supabase
  const articlesFromJSON = texts?.articles || { esoterica: [], cientifica: [], unificada: [] };
  const currentArticles = articlesFromJSON[activeTab as keyof typeof articlesFromJSON] || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactElement> = {
      espiritualidade: <Sparkles className="h-8 w-8" />,
      ciencia: <Lightbulb className="h-8 w-8" />,
      praticas: <InfinityIcon className="h-8 w-8" />,
      integracao: <Heart className="h-8 w-8" />
    };
    return icons[category] || <BookOpen className="h-8 w-8" />;
  };

  if (!texts) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-yellow-50">
      {/* Hero Section */}
      <section className="py-20 bg-linear-to-r from-yellow-500 via-yellow-400 to-amber-500 text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,white,transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg" data-json-key="artigos.hero.title">{texts.hero.title}</h1>
            <p className="text-2xl opacity-90 drop-shadow-md mb-2" data-json-key="artigos.hero.subtitle">{texts.hero.subtitle}</p>
            <p className="text-lg opacity-80 drop-shadow-md" data-json-key="artigos.hero.description">{texts.hero.description}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-3 pb-16 max-w-6xl">
        
        {/* Tabs Section */}
        <Tabs defaultValue="esoterica" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-8 h-auto p-1 bg-white/80 backdrop-blur-sm border-2 border-yellow-300/60 shadow-xl rounded-2xl">
            <TabsTrigger 
              value="esoterica" 
              className="data-[state=active]:bg-linear-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-amber-500 data-[state=active]:text-slate-900 text-slate-700 font-bold text-sm md:text-base py-4 rounded-xl transition-all duration-300 data-[state=active]:shadow-lg"
            >
              <Scroll className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="hidden md:inline">Literatura </span>Esotérica
            </TabsTrigger>
            <TabsTrigger 
              value="cientifica" 
              className="data-[state=active]:bg-linear-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-amber-500 data-[state=active]:text-slate-900 text-slate-700 font-bold text-sm md:text-base py-4 rounded-xl transition-all duration-300 data-[state=active]:shadow-lg"
            >
              <Microscope className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="hidden md:inline">Literatura </span>Científica
            </TabsTrigger>
            <TabsTrigger 
              value="unificada" 
              className="data-[state=active]:bg-linear-to-br data-[state=active]:from-yellow-400 data-[state=active]:to-amber-500 data-[state=active]:text-slate-900 text-slate-700 font-bold text-sm md:text-base py-4 rounded-xl transition-all duration-300 data-[state=active]:shadow-lg"
            >
              <Atom className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="hidden md:inline">Literatura </span>Unificada
            </TabsTrigger>
          </TabsList>

          {/* Tab Content - Literatura Esotérica */}
          <TabsContent value="esoterica" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-yellow-300/40 shadow-2xl space-y-8">
            
            {/* Intro Section */}
            <div className="relative bg-linear-to-br from-yellow-50 via-yellow-100/90 to-amber-100/80 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-300/60 overflow-hidden">
              {/* Efeitos decorativos de fundo */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-yellow-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 relative z-10 drop-shadow-sm" data-json-key="artigos.sections.esoterica_wisdom_title">
                {texts.sections?.esoterica_wisdom_title || 'Sabedoria Ancestral'}
              </h2>
              <p className="text-lg md:text-xl text-center text-slate-700 max-w-3xl mx-auto relative z-10 leading-relaxed" data-json-key="artigos.sections.esoterica_wisdom_subtitle">
                {texts.sections?.esoterica_wisdom_subtitle || 'Explore ensinamentos milenares, práticas espirituais e conhecimentos sagrados que transcendem o tempo.'}
              </p>
            </div>

            {/* Categories Section - Esotérica */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-200/40">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 drop-shadow-sm" data-json-key="artigos.sections.esoterica_categories_title">
                {texts.sections?.esoterica_categories_title || 'Categorias Esotéricas'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {texts.categories.items.filter((cat: { id: string }) => ['espiritualidade', 'praticas'].includes(cat.id)).map((category: { id: string; name: string; description: string }, index: number) => (
                  <Link to={`/artigos/categoria/${category.id}`} key={category.id}>
                    <div className="group relative bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <div className="text-slate-900">
                            {getCategoryIcon(category.id)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-center mb-3 text-slate-800">
                        {category.name}
                      </h3>
                      <p className="text-center text-slate-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Articles - Esotérica */}
            {currentArticles.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-200/40">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 drop-shadow-sm" data-json-key="artigos.sections.esoterica_articles_title">
                  {texts.sections?.esoterica_articles_title || 'Artigos Esotéricos'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((post: { id: string; title: string; slug: string; excerpt: string; category: string; author: string; date: string; readTime: number }) => (
                    <Link to={`/artigos/${post.slug}`} key={post.id}>
                      <div className="group h-full bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="p-6">
                          <Badge className="mb-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {post.readTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            </div>
          </TabsContent>

          {/* Tab Content - Literatura Científica */}
          <TabsContent value="cientifica" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-yellow-300/40 shadow-2xl space-y-8">
            
            {/* Intro Section */}
            <div className="relative bg-linear-to-br from-yellow-50 via-yellow-100/90 to-amber-100/80 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-300/60 overflow-hidden">
              {/* Efeitos decorativos de fundo */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-yellow-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 relative z-10 drop-shadow-sm" data-json-key="artigos.sections.cientifica_wisdom_title">
                {texts.sections?.cientifica_wisdom_title || 'Conhecimento Científico'}
              </h2>
              <p className="text-lg md:text-xl text-center text-slate-700 max-w-3xl mx-auto relative z-10 leading-relaxed" data-json-key="artigos.sections.cientifica_wisdom_subtitle">
                {texts.sections?.cientifica_wisdom_subtitle || 'Descubra pesquisas, estudos e evidências científicas sobre consciência, cura e transformação humana.'}
              </p>
            </div>

            {/* Categories Section - Científica */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-200/40">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 drop-shadow-sm" data-json-key="artigos.sections.cientifica_categories_title">
                {texts.sections?.cientifica_categories_title || 'Categorias Científicas'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {texts.categories.items.filter((cat: { id: string }) => ['ciencia', 'praticas'].includes(cat.id)).map((category: { id: string; name: string; description: string }, index: number) => (
                  <Link to={`/artigos/categoria/${category.id}`} key={category.id}>
                    <div className="group relative bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <div className="text-slate-900">
                            {getCategoryIcon(category.id)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-center mb-3 text-slate-800">
                        {category.name}
                      </h3>
                      <p className="text-center text-slate-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Articles - Científica */}
            {currentArticles.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-200/40">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 drop-shadow-sm" data-json-key="artigos.sections.cientifica_articles_title">
                  {texts.sections?.cientifica_articles_title || 'Artigos Científicos'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((post: { id: string; title: string; slug: string; excerpt: string; category: string; author: string; date: string; readTime: number }) => (
                    <Link to={`/artigos/${post.slug}`} key={post.id}>
                      <div className="group h-full bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="p-6">
                          <Badge className="mb-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {post.readTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            </div>
          </TabsContent>

          {/* Tab Content - Literatura Unificada */}
          <TabsContent value="unificada" className="mt-0">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-yellow-300/40 shadow-2xl space-y-8">
            
            {/* Intro Section */}
            <div className="relative bg-linear-to-br from-yellow-50 via-yellow-100/90 to-amber-100/80 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-300/60 overflow-hidden">
              {/* Efeitos decorativos de fundo */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-yellow-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300 rounded-full blur-3xl"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 relative z-10 drop-shadow-sm" data-json-key="artigos.sections.unificada_wisdom_title">
                {texts.sections?.unificada_wisdom_title || 'Ponte entre Ciência e Espírito'}
              </h2>
              <p className="text-lg md:text-xl text-center text-slate-700 max-w-3xl mx-auto relative z-10 leading-relaxed" data-json-key="artigos.sections.unificada_wisdom_subtitle">
                {texts.sections?.unificada_wisdom_subtitle || 'Explore a integração entre conhecimento científico e sabedoria espiritual, compreendendo como corpo e consciência se conectam em uma dança harmoniosa de transformação.'}
              </p>
            </div>

            {/* Categories Section - Unificada */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-200/40">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 drop-shadow-sm" data-json-key="artigos.sections.unificada_categories_title">
                {texts.sections?.unificada_categories_title || 'Categorias Integradas'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {texts.categories.items.map((category: { id: string; name: string; description: string }, index: number) => (
                  <Link to={`/artigos/categoria/${category.id}`} key={category.id}>
                    <div className="group relative bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <div className="text-slate-900">
                            {getCategoryIcon(category.id)}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-center mb-3 text-slate-800">
                        {category.name}
                      </h3>
                      <p className="text-center text-slate-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Articles - Unificada */}
            {currentArticles.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-yellow-200/40">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 drop-shadow-sm" data-json-key="artigos.sections.unificada_articles_title">
                  {texts.sections?.unificada_articles_title || 'Artigos Unificados'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((post: { id: string; title: string; slug: string; excerpt: string; category: string; author: string; date: string; readTime: number }) => (
                    <Link to={`/artigos/${post.slug}`} key={post.id}>
                      <div className="group h-full bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden border-2 border-yellow-200/50 hover:border-yellow-400/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <div className="p-6">
                          <Badge className="mb-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">{post.title}</h3>
                          <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(post.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {post.readTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            </div>
          </TabsContent>

        </Tabs>

        {/* CTA Section - Fora das tabs */}
        <div className="relative bg-linear-to-br from-yellow-500 via-yellow-400 to-amber-500 rounded-3xl shadow-2xl p-10 md:p-14 text-slate-900 text-center overflow-hidden mt-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white,transparent_70%)]"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg" data-json-key="artigos.cta.title">{texts.cta.title}</h2>
            <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto" data-json-key="artigos.cta.description">{texts.cta.description}</p>
            <Link to="/contato">
              <Button size="lg" className="bg-slate-900 text-yellow-400 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold">
                <span data-json-key="artigos.cta.button">{texts.cta.button}</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
