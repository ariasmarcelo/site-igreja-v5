import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, Tag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import defaultTexts from '@/locales/pt-BR/Artigos.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  cover_image: string;
  published: boolean;
  published_at: string;
  created_at: string;
  views: number;
}

export default function Artigos() {
  usePageStyles('artigos');
  const texts = useLocaleTexts('artigos', defaultTexts);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

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
      desenvolvimento: <BookOpen className="h-8 w-8" />,
      cura: <BookOpen className="h-8 w-8" />,
      meditacao: <BookOpen className="h-8 w-8" />,
      conhecimento: <BookOpen className="h-8 w-8" />
    };
    return icons[category] || <BookOpen className="h-8 w-8" />;
  };

  return (
    <div className="artigos-page">
      {/* Hero Section */}
      <section className="artigos-hero">
        <div className="container mx-auto px-4">
          <h1 data-json-key="hero.title">{texts.hero.title}</h1>
          <p className="subtitle" data-json-key="hero.subtitle">{texts.hero.subtitle}</p>
          <p className="description" data-json-key="hero.description">{texts.hero.description}</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4" data-json-key="intro.title">
            {texts.intro.title}
          </h2>
          <p className="text-lg text-gray-600" data-json-key="intro.description">
            {texts.intro.description}
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" data-json-key="categories.title">
            {texts.categories.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {texts.categories.items.map((category: { id: string; name: string; description: string }, index: number) => (
              <Card key={category.id} className="category-card">
                <CardHeader>
                  <div className="flex justify-center mb-4 text-[#CFAF5A]">
                    {getCategoryIcon(category.id)}
                  </div>
                  <CardTitle className="text-center" data-json-key={`categories.items[${index}].name`}>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center" data-json-key={`categories.items[${index}].description`}>
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {posts.length > 0 && (
        <section className="featured-section">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8" data-json-key="featured.title">
              {texts.featured.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 3).map((post) => (
                <Link to={`/artigos/${post.slug}`} key={post.id}>
                  <Card className="article-card">
                    {post.cover_image && (
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="article-image"
                      />
                    )}
                    <CardHeader>
                      <Badge className="article-category w-fit">
                        {post.category}
                      </Badge>
                      <CardTitle className="article-title">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="article-excerpt">{post.excerpt}</p>
                      <div className="article-meta">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          5 {texts.featured.minutesRead}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      <section className="recent-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8" data-json-key="recent.title">
            {texts.recent.title}
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Carregando artigos...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500" data-json-key="recent.noArticles">
              {texts.recent.noArticles}
            </p>
          ) : (
            <div className="max-w-4xl mx-auto">
              {posts.slice(3).map((post) => (
                <Link to={`/artigos/${post.slug}`} key={post.id}>
                  <div className="article-list-item">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <Badge className="mb-2">{post.category}</Badge>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                      </div>
                      {post.cover_image && (
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full md:w-48 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  <span data-json-key="recent.viewAll">{texts.recent.viewAll}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container mx-auto px-4">
          <h2 data-json-key="cta.title">{texts.cta.title}</h2>
          <p data-json-key="cta.description">{texts.cta.description}</p>
          <Link to="/contato">
            <Button size="lg" className="bg-[#CFAF5A] hover:bg-[#B89B4A]">
              <span data-json-key="cta.button">{texts.cta.button}</span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
