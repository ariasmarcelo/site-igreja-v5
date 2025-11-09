import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultTexts from '@/locales/pt-BR/Testemunhos.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

export default function Testemunhos() {
  usePageStyles('testemunhos');
  const texts = useLocaleTexts('testemunhos', defaultTexts);
  const testimonials = texts.testimonials;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.2)_55%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.15)_48%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.15)_52%,transparent_60%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg" data-json-key="testemunhos.header.title">{texts.header.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-md" data-json-key="testemunhos.header.subtitle">{texts.header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed" data-json-key="testemunhos.intro.description">{texts.intro.description}</p>
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section className="py-12 bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="shadow-xl border-2 border-[#CFAF5A] border-opacity-20 bg-gradient-to-br from-white to-[#FFFEF8] hover:shadow-2xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CFAF5A] to-[#B38938] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-[#CFAF5A]" data-json-key={`testemunhos.testimonials[${index}].name`}>{testimonial.name}</h3>
                          {testimonial.date && (
                            <p className="text-sm text-gray-500" data-json-key={`testemunhos.testimonials[${index}].date`}>{testimonial.date}</p>
                          )}
                        </div>
                        {testimonial.verified && (
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold" data-json-key="testemunhos.badgeVerified">
                            {texts.badgeVerified}
                          </div>
                        )}
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed italic" data-json-key={`testemunhos.testimonials[${index}].content`}>
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nota Importante */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-amber-900" data-json-key="testemunhos.disclaimer.title">{texts.disclaimer.title}</h3>
              <p className="text-amber-800 text-sm leading-relaxed" data-json-key="testemunhos.disclaimer.content">{texts.disclaimer.content}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-[#222222]" data-json-key="testemunhos.cta.title">{texts.cta.title}</h2>
            <p className="text-xl text-gray-600 mb-8" data-json-key="testemunhos.cta.subtitle">{texts.cta.subtitle}</p>
            <Link to="/contato">
              <Button className="btn-gold text-lg px-8 py-6" data-json-key="testemunhos.cta.buttonText">{texts.cta.buttonText}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}