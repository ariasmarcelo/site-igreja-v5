import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Quote } from 'lucide-react';
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
    <section className="py-16 bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#222222]">
              Testemunhos de Transformação
            </h2>
            <p className="text-lg text-gray-600">
              Veja o que nossos participantes têm a dizer sobre suas jornadas
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100">
                      <CardContent className="p-6 flex flex-col h-full">
                        <Quote className="w-8 h-8 text-[#CFAF5A] mb-4" />
                        
                        <p className="text-gray-700 mb-6 flex-grow line-clamp-6 text-sm leading-relaxed">
                          "{testimonial.content.substring(0, 200)}..."
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-200">
                          <p className="font-semibold text-[#222222]">{testimonial.name}</p>
                          <p className="text-xs text-gray-500">{testimonial.date}</p>
                          {testimonial.verified && (
                            <p className="text-xs text-green-600 mt-1">
                              {testimonialsData.badgeVerified}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          <div className="text-center mt-8">
            <a
              href="/testemunhos"
              className="inline-block bg-[#CFAF5A] hover:bg-[#B38938] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ver Todos os Testemunhos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
