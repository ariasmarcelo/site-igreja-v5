import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import defaultTestimonialsData from '@/locales/pt-BR/Testemunhos.json';

export default function TestimonialsCarousel() {
  // Carregar textos do localStorage se disponível
  const [testimonialsData] = useState(() => {
    const savedContent = localStorage.getItem('admin_testemunhos');
    if (savedContent) {
      try {
        return JSON.parse(savedContent);
      } catch (error) {
        console.error('Erro ao carregar testemunhos do localStorage:', error);
      }
    }
    return defaultTestimonialsData;
  });

  // Pegar apenas os primeiros 5 testemunhos para o carrossel
  const testimonials = testimonialsData.testimonials.slice(0, 5);

  return (
    <section className="py-20 bg-linear-to-br from-amber-900/90 via-yellow-800/85 to-amber-950/90 relative overflow-visible">
      {/* Textura de fundo sutil */}
      <div className="absolute inset-0 opacity-5" 
           style={{ 
             backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.1) 10px, rgba(255, 255, 255, 0.1) 20px)` 
           }}>
      </div>
      
      {/* Efeitos de luz */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(217,119,6,0.12),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 text-amber-50 font-serif tracking-wide" 
                style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
              Testemunhos de Transformação
            </h2>
            <p className="text-xl text-amber-100/90 max-w-2xl mx-auto leading-relaxed font-light">
              Histórias reais de cura, crescimento e despertar espiritual
            </p>
          </div>

          {/* Carrossel */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full mb-12"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="relative pt-6 pb-2 px-2">
                      {/* Ícone de aspas decorativo - FORA do card */}
                      <div className="absolute top-3 left-5 w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center shadow-2xl z-20 border-4 border-amber-50">
                        <Quote className="w-7 h-7 text-amber-50" />
                      </div>
                      
                      <Card className="h-full bg-linear-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 border-2 border-amber-800/30 shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                        <CardContent className="p-8 pt-10 flex flex-col h-full">
                          {/* Conteúdo do testemunho */}
                          <div className="mb-6 flex-grow">
                            <p className="text-gray-800 leading-relaxed text-sm italic"
                               style={{ textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)' }}>
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
                                  {testimonialsData.badgeVerified}
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
              className="inline-flex items-center gap-3 bg-amber-100 hover:bg-amber-50 text-amber-950 font-bold text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 hover:scale-105 border-2 border-amber-800/30"
              style={{ letterSpacing: '0.02em' }}
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
