import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Sun, Users, Brain, Ghost, Database, Compass, ArrowLeftRight, ArrowUpDown, Sparkles } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { PageLoading } from '@/components/PageLoading';
import { FooterBackground } from '@/components/FooterBackground';
import { SharedFooter } from '@/components/SharedFooter';

const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));


interface IndexTexts {
  header: { title: string; subtitle: string };
  [key: string]: any;
}

export default function Index() {
  const stylesLoaded = usePageStyles('index');
  const { data: texts, loading } = usePageContent<IndexTexts>('index');

  // Aguardar carregamento
  if (!texts || !stylesLoaded || loading) {
    return (
      <PageLoading
        icon={Sun}
        text="Carregando página inicial..."
        bgColor="bg-gradient-to-b from-stone-50 to-stone-100"
        iconColor="text-amber-500"
        textColor="text-stone-800"
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-stone-100 via-stone-50 to-white border-b-2 border-stone-200">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 hero-pattern"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Sol Dourado */}
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-3xl"></div>
              <svg viewBox="0 0 100 100" className="w-20 h-20 animate-spin-slow relative" fill="none">
                <circle cx="50" cy="50" r="18" fill="#CFAF5A" />
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  return (
                    <line key={i}
                      x1={50 + Math.cos(angle) * 24} y1={50 + Math.sin(angle) * 24}
                      x2={50 + Math.cos(angle) * 38} y2={50 + Math.sin(angle) * 38}
                      stroke="#CFAF5A" strokeWidth="2.5" strokeLinecap="round" />
                  );
                })}
              </svg>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-stone-800" data-json-key="index.hero.title">
              {texts.hero.title}
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-[#CFAF5A] font-semibold" data-json-key="index.hero.subtitle">
              {texts.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/purificacao">
                <Button className="bg-linear-to-r from-[#CFAF5A] to-[#B38938] text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <span data-json-key="index.hero.buttons.purification">{texts.hero.buttons.purification}</span>
                </Button>
              </Link>
              <Link to="/tratamentos">
                <Button className="bg-linear-to-r from-[#0d9488] to-[#14b8a6] text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <span data-json-key="index.hero.buttons.treatments">{texts.hero.buttons.treatments}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Igreja & Instituto */}
      <section className="py-12 bg-linear-to-b from-white via-stone-50 to-white border-b-2 border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Bloco violeta metálico envolvendo as seções */}
            <div className="bg-linear-to-br from-violet-50/30 via-purple-50/20 to-violet-50/30 border-2 border-violet-200/40 rounded-3xl p-6 shadow-lg">
              <div className="space-y-0">
            
                {/* Igreja de Metatron + Purificação - CAIXA UNIFICADA */}
                <Card className="border-2 border-amber-200/50 shadow-2xl overflow-hidden bg-linear-to-br from-white via-amber-50/20 to-white">
              <CardContent className="p-10 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-100 rounded-xl shadow-md">
                        <Sun className="w-10 h-10 text-[#CFAF5A]" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-stone-800" data-json-key="index.igreja.title">
                        {texts.igreja.title}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {texts.igreja.description.map((p: string, i: number) => (
                        <p key={i} className="text-lg text-stone-600 leading-relaxed" data-json-key={`index.igreja.description[${i}]`}>
                          {p}
                        </p>
                      ))}
                    </div>

                    <Link to="/quemsomos">
                      <Button className="bg-linear-to-r from-[#CFAF5A] to-[#B38938] text-white px-8 py-5 text-base rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105" data-json-key="index.igreja.knowMoreButton">
                        {texts.igreja.knowMoreButton}
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-amber-200/70 shadow-xl">
                    <div className="bg-linear-to-br from-[#CFAF5A] to-[#B38938] p-6 text-white rounded-t-xl">
                      <h3 className="text-2xl font-bold" data-json-key="index.purification.title">{texts.purification.title}</h3>
                    </div>
                    <div className="p-8 bg-linear-to-b from-white to-amber-50/30">
                      <div className="space-y-5">
                        {texts.purification.phases.map((phase: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#CFAF5A] to-[#B38938] text-white flex items-center justify-center font-bold shrink-0 shadow-md">{i + 1}</div>
                            <div>
                              <h4 className="font-semibold text-stone-800 mb-1" data-json-key={`index.purification.phases[${i}].title`}>{phase.title}</h4>
                              <p className="text-sm text-stone-600" data-json-key={`index.purification.phases[${i}].description`}>{phase.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Separador com ícone ArrowUpDown */}
            <div className="flex items-center justify-center -my-6 relative z-20">
              <div className="bg-white rounded-full p-4 shadow-2xl border-2 border-stone-300">
                <ArrowUpDown className="w-8 h-8 text-violet-400" />
              </div>
            </div>

            {/* Instituto Metatron + Tratamentos - CAIXA UNIFICADA */}
            <Card className="border-2 border-teal-200/50 shadow-2xl overflow-hidden bg-linear-to-br from-white via-teal-50/20 to-white">
              <CardContent className="p-10 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-10 items-start">
                  <div className="bg-white rounded-2xl border-2 border-teal-200/70 shadow-xl lg:order-1">
                    <div className="bg-linear-to-br from-[#0d9488] to-[#14b8a6] p-6 text-white rounded-t-xl">
                      <h3 className="text-2xl font-bold" data-json-key="index.treatments.title">{texts.treatments?.title || texts.instituto.title}</h3>
                    </div>
                    <div className="p-8 bg-linear-to-b from-white to-teal-50/30">
                      <div className="space-y-4">
                        {(texts.treatments?.description || texts.instituto.treatments.slice(0, 3)).map((p: string, i: number) => (
                          <p key={i} className="text-sm text-stone-600 leading-relaxed" data-json-key={`index.treatments.description[${i}]`}>{p}</p>
                        ))}
                        <div className="pt-3 space-y-2 border-t border-teal-100">
                          {texts.instituto.treatments.slice(0, 6).map((t: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-stone-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                              <span data-json-key={`index.treatments.items[${i}]`}>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 lg:order-2">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-100 rounded-xl shadow-md">
                        <Brain className="w-10 h-10 text-teal-600" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-stone-800" data-json-key="index.instituto.title">
                        {texts.instituto.title}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {texts.instituto.description.map((p: string, i: number) => (
                        <p key={i} className="text-lg text-stone-600 leading-relaxed" data-json-key={`index.instituto.description[${i}]`}>
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r shadow-sm">
                      <p className="text-sm text-amber-900" data-json-key="index.instituto.legalNotice">
                        <strong>Aviso Legal:</strong> {texts.instituto.legalNotice}
                      </p>
                    </div>

                    <Link to="/tratamentos">
                      <Button className="bg-linear-to-r from-[#0d9488] to-[#14b8a6] text-white px-8 py-5 text-base rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105" data-json-key="index.instituto.ctaButton">
                        {texts.instituto.ctaButton}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-linear-to-b from-white to-stone-100 border-b-2 border-stone-300">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-stone-800" data-json-key="index.benefitsSection.title">
                {texts.benefitsSection.title}
              </h2>
              <p className="text-xl text-stone-600" data-json-key="index.benefitsSection.subtitle">
                {texts.benefitsSection.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {texts.instituto.benefits.map((b: any, i: number) => (
                <Card key={i} className="border-2 border-stone-200 hover:border-stone-300 hover:shadow-xl transition-all bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      {i === 0 && <Sun className="w-12 h-12 text-[#CFAF5A] mx-auto" />}
                      {i === 1 && <ArrowLeftRight className="w-12 h-12 text-teal-600 mx-auto" />}
                      {i === 2 && <Sparkles className="w-12 h-12 text-stone-600 mx-auto" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-stone-800" data-json-key={`index.instituto.benefits[${i}].title`}>
                      {b.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed" data-json-key={`index.instituto.benefits[${i}].description`}>
                      {b.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Físico/Espiritual */}
      <section className="py-20 bg-linear-to-b from-stone-100 via-white to-stone-50 border-b-2 border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-stone-800" data-json-key="index.fisicoEspiritual.title">
                {texts.fisicoEspiritual.title}
              </h2>
              <p className="text-xl text-stone-600" data-json-key="index.fisicoEspiritual.subtitle">
                {texts.fisicoEspiritual.subtitle}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Físico */}
              <Card className="border-2 border-teal-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-teal-100 rounded-xl mb-4">
                      <Brain className="w-12 h-12 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-teal-700 mb-2" data-json-key="index.fisicoEspiritual.fisico.title">
                      {texts.fisicoEspiritual.fisico.title}
                    </h3>
                    <p className="text-teal-600 font-semibold" data-json-key="index.fisicoEspiritual.fisico.subtitle">
                      {texts.fisicoEspiritual.fisico.subtitle}
                    </p>
                  </div>
                  <p className="text-stone-600 mb-4" data-json-key="index.fisicoEspiritual.fisico.description">
                    {texts.fisicoEspiritual.fisico.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {texts.fisicoEspiritual.fisico.items.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                        <span className="text-sm text-stone-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                    <p className="text-sm font-semibold text-teal-900 mb-2" data-json-key="index.fisicoEspiritual.fisico.abordagem.title">
                      {texts.fisicoEspiritual.fisico.abordagem.title}
                    </p>
                    <p className="text-sm text-teal-800" data-json-key="index.fisicoEspiritual.fisico.abordagem.description">
                      {texts.fisicoEspiritual.fisico.abordagem.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Espiritual */}
              <Card className="border-2 border-amber-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-amber-100 rounded-xl mb-4">
                      <Ghost className="w-12 h-12 text-[#CFAF5A]" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-700 mb-2" data-json-key="index.fisicoEspiritual.espiritual.title">
                      {texts.fisicoEspiritual.espiritual.title}
                    </h3>
                    <p className="text-amber-600 font-semibold" data-json-key="index.fisicoEspiritual.espiritual.subtitle">
                      {texts.fisicoEspiritual.espiritual.subtitle}
                    </p>
                  </div>
                  <p className="text-stone-600 mb-4" data-json-key="index.fisicoEspiritual.espiritual.description">
                    {texts.fisicoEspiritual.espiritual.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {texts.fisicoEspiritual.espiritual.items.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                        <span className="text-sm text-stone-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                    <p className="text-sm font-semibold text-amber-900 mb-2" data-json-key="index.fisicoEspiritual.espiritual.abordagem.title">
                      {texts.fisicoEspiritual.espiritual.abordagem.title}
                    </p>
                    <p className="text-sm text-amber-800" data-json-key="index.fisicoEspiritual.espiritual.abordagem.description">
                      {texts.fisicoEspiritual.espiritual.abordagem.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integrada */}
            <Card className="border-2 border-stone-300 shadow-xl">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <div className="flex justify-center gap-2 mb-6 items-center">
                    <div className="p-3 bg-teal-100 rounded-xl">
                      <Brain className="w-10 h-10 text-teal-600" />
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowLeftRight className="w-6 h-6 text-stone-600" />
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Sun className="w-10 h-10 text-[#CFAF5A]" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-stone-800 mb-4" data-json-key="index.fisicoEspiritual.integrada.title">
                    {texts.fisicoEspiritual.integrada.title}
                  </h3>
                </div>
                <p className="text-center text-lg text-stone-600 mb-8" data-json-key="index.fisicoEspiritual.integrada.description">
                  {texts.fisicoEspiritual.integrada.description}
                </p>
                <div className="bg-stone-50 p-6 rounded-xl border-2 border-stone-200">
                  <p className="font-semibold text-stone-800 mb-4 text-center" data-json-key="index.fisicoEspiritual.integrada.oferecemos.title">
                    {texts.fisicoEspiritual.integrada.oferecemos.title}
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {texts.fisicoEspiritual.integrada.oferecemos.items.map((item: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-white rounded-lg">
                        <Database className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-stone-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center font-bold text-stone-800 mt-8" data-json-key="index.fisicoEspiritual.integrada.conclusao">
                  {texts.fisicoEspiritual.integrada.conclusao}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Suspense fallback={
        <section className="py-20 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CFAF5A] mx-auto mb-4"></div>
              <p className="text-stone-600">Carregando testemunhos...</p>
            </div>
          </div>
        </section>
      }>
        <TestimonialsCarousel />
      </Suspense>

      {/* CTA Final */}
      <section className="relative overflow-hidden bg-stone-800">
        <div className="absolute inset-0 opacity-30 z-0">
          <FooterBackground gradientId="skyGradIndex" />
        </div>

        <div className="absolute top-4 left-8 w-20 h-20 z-10 drop-shadow-lg">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.cos(angle) * 25;
              const y1 = 50 + Math.sin(angle) * 25;
              const x2 = 50 + Math.cos(angle) * 40;
              const y2 = 50 + Math.sin(angle) * 40;
              return (
                <line key={i}
                  x1={x1} y1={y1}
                  x2={x2} y2={y2}
                  stroke="#CFAF5A" strokeWidth="3" strokeLinecap="round" />
              );
            })}
          </svg>
        </div>

        {/* Lua Crescente - posicionada no canto superior direito */}
        <div className="absolute top-4 right-8 w-20 h-20 z-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="crescentMaskIndex">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMaskIndex)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white index-cta-title" data-json-key="index.cta.title">
              {(texts.cta || texts.testimonialsCta)?.title || 'Comece Sua Jornada'}
            </h2>
            <p className="text-lg mb-5 text-white/90 index-cta-subtitle whitespace-pre-line" data-json-key="index.cta.subtitle">
              {(texts.cta || texts.testimonialsCta)?.subtitle || 'Entre em contato conosco'}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] hover:bg-[#B38938] text-white px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all hover:scale-105" data-json-key="index.cta.buttonText">
                {(texts.cta || texts.testimonialsCta)?.buttonText || 'Fale Conosco'}
              </Button>
            </Link>
          </div>
        </div>

        <SharedFooter />
      </section>
    </div>
  );
}
