import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, Wind, Route, Flower2, Sparkles, AlertTriangle, Users, Infinity as InfinityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import defaultTexts from '@/locales/pt-BR/Tratamentos.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

export default function Tratamentos() {
  usePageStyles('tratamentos');
  const texts = useLocaleTexts('tratamentos', defaultTexts);
  const icons = [
    <Users className="w-12 h-12" />,
    <Brain className="w-12 h-12" />,
    <Wind className="w-12 h-12" />,
    <Route className="w-12 h-12" />,
    <Heart className="w-12 h-12 fill-red-500" />,
    <Flower2 className="w-12 h-12" />,
    <InfinityIcon className="w-12 h-12" />,
    <Sparkles className="w-12 h-12" />
  ];

  const treatments = texts?.treatments || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-[#1e40af] via-[#1e40af] to-[#2563eb] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.18)_38%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.18)_62%,transparent_80%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(10deg,transparent_25%,rgba(255,255,255,0.12)_42%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.12)_58%,transparent_75%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Brain className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">{texts?.header?.title || 'Tratamentos'}</h1>
            <p className="text-xl opacity-90 drop-shadow-md">{texts?.header?.subtitle || ''}</p>
          </div>
        </div>
      </section>

      {/* Aviso Legal */}
      <section className="py-8 bg-amber-50">
        <div className="container mx-auto px-4">
          <Alert className="max-w-5xl mx-auto border-amber-500 bg-white">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-900 ml-2">
              <strong>{texts?.legal?.title || ''}</strong> {texts?.legal?.notice || ''}
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">{texts?.intro?.p1 || ''}</p>
            <p className="text-lg text-gray-600 leading-relaxed">{texts?.intro?.p2 || ''}</p>
          </div>
        </div>
      </section>

      {/* Tratamentos Grid */}
      <div>
        {treatments.map((treatment, index) => (
          <section 
            key={index} 
            className={`py-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]'}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Card className="shadow-2xl card-hover border-2 border-gray-100 bg-white">
                  <CardHeader 
                    className="text-white p-8 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to right, ${treatment.color.split(' ')[0].replace('from-[', '').replace(']', '')}, ${treatment.color.split(' ')[1].replace('to-[', '').replace(']', '')})`
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_40%,rgba(255,255,255,0.2),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_60%,rgba(255,255,255,0.15),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.12)_48%,rgba(255,255,255,0.16)_60%,rgba(255,255,255,0.12)_72%,transparent_90%)]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(10deg,transparent_35%,rgba(255,255,255,0.08)_52%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.08)_68%,transparent_85%)]"></div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      {icons[index]}
                      <CardTitle className="text-3xl">
                        {treatment.title.includes('(supervisão geral integrada)') 
                          ? <>
                              {treatment.title.split('(')[0]}
                              <span className="text-xl italic">({treatment.title.split('(')[1]}</span>
                            </>
                          : treatment.title
                        }
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white text-lg opacity-90 relative z-10">
                      {treatment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6 bg-white">
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-[#222222]">{texts?.labels?.about || 'Sobre'}</h4>
                      <p className="text-gray-700 leading-relaxed">{treatment.details}</p>
                    </div>

                    {treatment.indications && (
                      <div>
                        <h4 className="font-bold text-lg mb-2 text-[#222222]">{texts?.labels?.indications || 'Indicações'}</h4>
                        <p className="text-gray-700 leading-relaxed">{treatment.indications}</p>
                      </div>
                    )}

                    {treatment.benefits && (
                      <div>
                        <h4 className="font-bold text-lg mb-2 text-[#222222]">{texts?.labels?.benefits || 'Benefícios'}</h4>
                        <p className="text-gray-700 leading-relaxed">{treatment.benefits}</p>
                      </div>
                    )}

                    {treatment.contraindications && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <h4 className="font-bold text-lg mb-2 text-red-800">{texts?.labels?.contraindications || 'Contraindicações'}</h4>
                        <p className="text-red-700 leading-relaxed">{treatment.contraindications}</p>
                      </div>
                    )}

                    {treatment.duration && (
                      <div>
                        <h4 className="font-bold text-lg mb-2 text-[#222222]">{texts?.labels?.duration || 'Duração'}</h4>
                        <p className="text-gray-700 leading-relaxed">{treatment.duration}</p>
                      </div>
                    )}

                    {treatment.professional && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <h4 className="font-bold text-lg mb-2 text-blue-800">{texts?.labels?.professional || 'Profissional'}</h4>
                        <p className="text-blue-700 leading-relaxed">{treatment.professional}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4A90A9] to-[#5EA98D] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{texts?.cta?.title || ''}</h2>
            <p className="text-xl mb-8 opacity-90">{texts?.cta?.subtitle || ''}</p>
            <Link to="/contato">
              <Button className="bg-white text-[#4A90A9] font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {texts?.cta?.buttonText || 'Entre em Contato'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
