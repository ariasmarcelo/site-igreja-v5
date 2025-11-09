import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Sun, Star, Crown, Compass, Heart, Infinity as InfinityIcon, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import defaultTexts from '@/locales/pt-BR/Purificacao.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

export default function Purificacao() {
  usePageStyles('purificacao');
  const texts = useLocaleTexts('purificacao', defaultTexts);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-[#B8860B] via-[#7A5608] to-[#B8860B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.12)_60%,transparent_80%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_43%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.1)_57%,transparent_75%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_30%,transparent_65%)]"></div>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="20" fill="white" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.cos(angle) * 25;
              const y1 = 50 + Math.sin(angle) * 25;
              const x2 = 50 + Math.cos(angle) * 40;
              const y2 = 50 + Math.sin(angle) * 40;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <svg
                viewBox="0 0 100 100"
                className="w-24 h-24 animate-spin-slow"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="20" fill="white" />
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + Math.cos(angle) * 25;
                  const y1 = 50 + Math.sin(angle) * 25;
                  const x2 = 50 + Math.cos(angle) * 40;
                  const y2 = 50 + Math.sin(angle) * 40;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg" data-json-key="purificacao.header.title">{texts.header.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-md" data-json-key="purificacao.header.subtitle">{texts.header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8" data-json-key="purificacao.intro.mainText">
              {texts.intro.mainText}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed" data-json-key="purificacao.intro.description">
              {texts.intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Fase Inicial */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-2 border-red-400 border-opacity-30">
              <CardHeader className="bg-gradient-to-r from-red-700 to-red-800 text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.2),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.15),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(155deg,transparent_10%,rgba(255,255,255,0.12)_32%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.12)_68%,transparent_90%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(65deg,transparent_20%,rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.08)_62%,transparent_80%)]"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Sparkles className="w-10 h-10 text-red-700" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl mb-2 drop-shadow-md" data-json-key="purificacao.faseInicial.title">{texts.faseInicial.title}</CardTitle>
                    <p className="text-lg opacity-90 drop-shadow-sm" data-json-key="purificacao.faseInicial.subtitle">{texts.faseInicial.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-[#222222]" data-json-key="purificacao.faseInicial.objetivo.title">{texts.faseInicial.objetivo.title}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed" data-json-key="purificacao.faseInicial.objetivo.content">
                    {texts.faseInicial.objetivo.content}
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-6">
                  <h4 className="font-bold text-xl mb-3 text-red-700" data-json-key="purificacao.faseInicial.activities.title">{texts.faseInicial.activities.title}</h4>
                  <ul className="space-y-3 text-gray-700" data-json-key="purificacao.faseInicial.activities.items.map">
                    {texts.faseInicial.activities.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-1">•</span>
                        <span data-json-key={`purificacao.faseInicial.activities.items[${index}]`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#222222]" data-json-key="purificacao.faseInicial.duration.title">{texts.faseInicial.duration.title}</h4>
                  <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseInicial.duration.content">
                    {texts.faseInicial.duration.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fase Intermediária */}
      <section className="py-6 bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-2 border-[#4A90A9] border-opacity-30">
              <CardHeader className="bg-gradient-to-r from-[#4A90A9] to-[#5EA98D] text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <LineChart className="w-10 h-10 text-[#4A90A9]" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl mb-2" data-json-key="purificacao.faseIntermediaria.title">{texts.faseIntermediaria.title}</CardTitle>
                    <p className="text-lg opacity-90" data-json-key="purificacao.faseIntermediaria.subtitle">{texts.faseIntermediaria.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-[#222222]" data-json-key="purificacao.faseIntermediaria.requisito.title">{texts.faseIntermediaria.requisito.title}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4" data-json-key="purificacao.faseIntermediaria.requisito.content">{texts.faseIntermediaria.requisito.content}</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-[#4A90A9] p-6">
                  <h4 className="font-bold text-xl mb-3 text-[#4A90A9]" data-json-key="purificacao.faseIntermediaria.trabalhos.title">{texts.faseIntermediaria.trabalhos.title}</h4>
                  <div className="space-y-4" data-json-key="purificacao.faseIntermediaria.trabalhos.items.map">
                    {texts.faseIntermediaria.trabalhos.items.map((item, index) => (
                      <div key={index}>
                        <h5 className="font-semibold text-lg mb-2 text-[#222222]" data-json-key={`purificacao.faseIntermediaria.trabalhos.items[${index}].title`}>{item.title}</h5>
                        <p className="text-gray-700" data-json-key={`purificacao.faseIntermediaria.trabalhos.items[${index}].content`}>{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#222222]" data-json-key="purificacao.faseIntermediaria.integracao.title">{texts.faseIntermediaria.integracao.title}</h4>
                  <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseIntermediaria.integracao.content">{texts.faseIntermediaria.integracao.content}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fase Final */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-2 border-[#CFAF5A] border-opacity-30">
              <CardHeader className="bg-gradient-to-r from-[#CFAF5A] via-[#B38938] to-[#CFAF5A] text-white p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <Crown className="w-10 h-10 text-[#CFAF5A]" />
                  </div>
                    <div>
                    <CardTitle className="text-3xl mb-2" data-json-key="purificacao.faseFinal.title">{texts.faseFinal.title}</CardTitle>
                    <p className="text-lg opacity-90" data-json-key="purificacao.faseFinal.subtitle">{texts.faseFinal.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-[#222222]" data-json-key="purificacao.faseFinal.iniciacao.title">{texts.faseFinal.iniciacao.title}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4" data-json-key="purificacao.faseFinal.iniciacao.content">{texts.faseFinal.iniciacao.content}</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-[#CFAF5A] rounded-lg p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Sun className="w-12 h-12 text-[#CFAF5A]" />
                    <h4 className="font-bold text-2xl text-[#CFAF5A]" data-json-key="purificacao.faseFinal.evento.title">{texts.faseFinal.evento.title ?? 'O Evento Iniciático'}</h4>
                  </div>
                  {texts.faseFinal.evento.content.map((para: string, i: number) => (
                    <p key={i} className={`text-gray-700 leading-relaxed ${i === 0 ? 'text-lg mb-4' : ''}`}>
                      {para}
                    </p>
                  ))}
                </div>

                <div>
                  <h4 className="font-bold text-xl mb-3 text-[#222222]" data-json-key="purificacao.faseFinal.posIniciacao.title">{texts.faseFinal.posIniciacao.title}</h4>
                  <p className="text-gray-700 leading-relaxed mb-4" data-json-key="purificacao.faseFinal.posIniciacao.content">{texts.faseFinal.posIniciacao.content}</p>
                  <ul className="space-y-3 text-gray-700" data-json-key="purificacao.faseFinal.posIniciacao.items.map">
                    {texts.faseFinal.posIniciacao.items.map((it: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#CFAF5A] font-bold mt-1">✦</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                  <h4 className="font-bold text-xl mb-3 text-blue-800" data-json-key="purificacao.faseFinal.adepto.title">{texts.faseFinal.adepto.title}</h4>
                  <p className="text-blue-900 leading-relaxed" data-json-key="purificacao.faseFinal.adepto.content">{texts.faseFinal.adepto.content}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trabalhos Espirituais com Psicodélicos */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#FAF9F7] to-[#F5F3F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="border-purple-300 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white pt-4 pb-8 px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.25),transparent_55%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.2),transparent_55%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.15)_35%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.15)_65%,transparent_85%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(10deg,transparent_25%,rgba(255,255,255,0.1)_38%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.1)_62%,transparent_80%)]"></div>
                <div className="text-center relative z-10">
                  <div className="inline-block mb-1">
                    <InfinityIcon className="w-16 h-16 mx-auto drop-shadow-lg" />
                  </div>
                  <CardTitle className="text-3xl font-bold mb-4 drop-shadow-md" data-json-key="purificacao.psicodelicos.title">
                    {texts.psicodelicos.title}
                  </CardTitle>
                  <p className="text-lg font-semibold italic opacity-90 drop-shadow-sm" data-json-key="purificacao.psicodelicos.subtitle">
                    {texts.psicodelicos.subtitle}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-8">

                <div className="space-y-6 text-gray-700 leading-relaxed" data-json-key="purificacao.psicodelicos.intro">
                  <p className="text-center text-lg" data-json-key="purificacao.psicodelicos.intro" dangerouslySetInnerHTML={{ __html: texts.psicodelicos.intro }} />

                <div className="bg-gradient-to-r from-purple-50 via-amber-50 to-purple-50 p-6 rounded-lg border-2 border-purple-300">
                  <h3 className="font-bold text-xl text-purple-900 mb-4 text-center" data-json-key="purificacao.psicodelicos.tripleProtection.title">{texts.psicodelicos.tripleProtection.title}</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Compass className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2" data-json-key="purificacao.psicodelicos.tripleProtection.cards[0].title">{texts.psicodelicos.tripleProtection.cards[0].title}</h4>
                      <p className="text-sm" data-json-key="purificacao.psicodelicos.tripleProtection.cards[0].description">
                        {texts.psicodelicos.tripleProtection.cards[0].description}
                      </p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-10 h-10 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2" data-json-key="purificacao.psicodelicos.tripleProtection.cards[1].title">{texts.psicodelicos.tripleProtection.cards[1].title}</h4>
                      <p className="text-sm" data-json-key="purificacao.psicodelicos.tripleProtection.cards[1].description">
                        {texts.psicodelicos.tripleProtection.cards[1].description}
                      </p>
                    </div>
                    <div className="text-center">
                      <Sun className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                      <h4 className="font-semibold mb-2" data-json-key="purificacao.psicodelicos.tripleProtection.cards[2].title">{texts.psicodelicos.tripleProtection.cards[2].title}</h4>
                      <p className="text-sm" data-json-key="purificacao.psicodelicos.tripleProtection.cards[2].description">
                        {texts.psicodelicos.tripleProtection.cards[2].description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h3 className="font-bold text-xl text-gray-800 text-center mb-4" data-json-key="purificacao.psicodelicos.applications.title">{texts.psicodelicos.applications.title}</h3>
                  <ul className="space-y-3" data-json-key="purificacao.psicodelicos.applications.items.map">
                    {texts.psicodelicos.applications.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1 text-lg">•</span>
                        <span data-json-key={`purificacao.psicodelicos.applications.items[${idx}]`} dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-300 mt-6">
                  <p className="text-center font-bold text-amber-900 mb-3 text-lg" data-json-key="purificacao.psicodelicos.conclusion.title">
                    {texts.psicodelicos.conclusion.title}
                  </p>
                  <p className="text-center text-gray-700" data-json-key="purificacao.psicodelicos.conclusion.content">
                    {texts.psicodelicos.conclusion.content}
                  </p>
                </div>

                <div className="text-center mt-8">
                  <Link to="/contato">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 via-purple-500 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-xl text-lg px-8 py-6" data-json-key="purificacao.psicodelicos.ctaButton">
                      <Sparkles className="w-6 h-6 mr-3" />
                      {texts.psicodelicos.ctaButton}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Critérios e Valores */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#222222]" data-json-key="purificacao.valores.title">{texts.valores.title}</h2>
            <div className="grid md:grid-cols-2 gap-8" data-json-key="purificacao.valores.cards.map">
              {texts.valores.cards.map((card: { title: string; content: string }, idx: number) => (
                <Card key={idx} className="shadow-lg card-hover">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#CFAF5A]">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{card.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#CFAF5A] to-[#B38938] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-json-key="purificacao.cta.title">{texts.cta.title}</h2>
            <p className="text-xl mb-8 opacity-90" data-json-key="purificacao.cta.subtitle">{texts.cta.subtitle}</p>
            <Link to="/contato">
              <Button className="bg-white text-[#CFAF5A] font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="purificacao.cta.buttonText">
                {texts.cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}