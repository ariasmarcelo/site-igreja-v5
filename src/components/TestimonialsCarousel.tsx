import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Quote, Star } from 'lucide-react';
import { usePageContent } from '@/hooks/useContent';
import '@/styles/components/testimonials-carousel.css';

interface TestemunhosTexts {
  header?: { title: string };
  testimonials: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;
}

export default function TestimonialsCarousel() {
  const { data: texts, loading } = usePageContent<TestemunhosTexts>('testemunhos');

  if (loading) {
    return (
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CFAF5A] mx-auto mb-4"></div>
            <p className="text-stone-600">Carregando testemunhos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!texts?.testimonials) {
    console.warn('[TestimonialsCarousel] No testimonials data loaded');
    return null;
  }

  // Pegar apenas os primeiros 5 testemunhos para o carrossel
  const testimonials = texts.testimonials.slice(0, 5);
  const headerTitle = texts.header?.title || 'Testemunhos de Transformação';

  return (
    <section className="py-12 bg-linear-to-br from-amber-900/90 via-yellow-800/85 to-amber-950/90 relative overflow-visible">
      {/* Textura de fundo sutil */}
      <div className="absolute inset-0 opacity-5 testimonials-texture"></div>
      
      {/* Efeitos de luz */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(217,119,6,0.12),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-amber-50 font-serif tracking-wide testimonials-title">
              Testemunhos de Transformação
            </h2>
            <p className="text-base text-amber-100/90 max-w-2xl mx-auto leading-relaxed font-light">
              Histórias reais de cura, crescimento e despertar espiritual
            </p>
          </div>

          {/* Carrossel */}
          <div className="relative mt-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full mb-6"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="relative pt-4 pb-2 px-2">
                      {/* Ícone de aspas decorativo - FORA do card */}
                      <div className="absolute top-0 left-1 w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-2xl z-30 border-2 border-amber-50">
                        <Quote className="w-5 h-5 text-amber-50" />
                      </div>
                      
                      <Card className="h-full bg-linear-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 border-2 border-amber-800/30 shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                        <CardContent className="p-4 pt-6 flex flex-col h-full">
                          {/* Conteúdo do testemunho */}
                          <div className="mb-3 grow">
                            <p className="text-gray-800 leading-relaxed text-base italic testimonial-text">
                              "{testimonial.content.substring(0, 200)}..."
                            </p>
                          </div>
                          
                          {/* Separador decorativo */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-px grow bg-amber-800/20"></div>
                            <Star className="w-3 h-3 fill-amber-600 text-amber-600" />
                            <div className="h-px grow bg-amber-800/20"></div>
                          </div>
                          
                          {/* Informações do autor */}
                          <div className="mt-auto">
                            <p className="font-bold text-amber-950 text-base mb-1">{testimonial.name}</p>
                            <p className="text-xs text-amber-800/80 mb-2">{testimonial.date}</p>
                            {testimonial.verified && (
                              <div className="inline-flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                                <Star className="w-3 h-3 fill-green-600 text-green-600" />
                                <span className="text-xs text-green-700 font-medium">
                                  Verificado
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-16 bg-amber-100 hover:bg-amber-200 border-2 border-amber-800/40 text-amber-900 w-12 h-12" />
              <CarouselNext className="hidden md:flex -right-16 bg-amber-100 hover:bg-amber-200 border-2 border-amber-800/40 text-amber-900 w-12 h-12" />
            </Carousel>
          </div>

          {/* Botão de ação */}
          <div className="text-center mt-4">
            <a
              href="/testemunhos"
              className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-50 text-amber-950 font-semibold text-lg px-10 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Star className="w-5 h-5 fill-amber-600 text-amber-600" />
              Ver Todos os Testemunhos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
