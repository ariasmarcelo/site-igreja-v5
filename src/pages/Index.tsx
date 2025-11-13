import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Sun, Users, BookOpen, Brain, Ghost, Database, Compass, HeartCrack, User, Sparkles, ArrowLeftRight, UserRound, Zap } from 'lucide-react';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

interface IndexTexts {
  header: { title: string; subtitle: string };
  [key: string]: any;
}

export default function Index() {
  const stylesLoaded = usePageStyles('index');
  const { texts, loading } = useLocaleTexts<IndexTexts>('index');
  
  if (loading || !texts) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  const benefitsIcons = [
    <Sun className="w-12 h-12 text-pink-600 mb-4" key="s" />,
    <Users className="w-12 h-12 text-[#5EA98D] mb-4" key="u" />,
    <BookOpen className="w-12 h-12 text-[#4A90A9] mb-4" key="b" />
  ];

  // Aguardar carregamento de textos e estilos antes de renderizar
  if (!texts || !stylesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CFAF5A] mx-auto mb-4"></div>
          <p className="text-[#222222] opacity-60">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Redesenhado */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #222222 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Sol Dourado - Redesenhado */}
            <div className="inline-block mb-8 relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative">
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24 animate-spin-slow"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
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
                        stroke="#CFAF5A"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            <h1 
              className="text-6xl md:text-7xl font-bold mb-6 text-[#222222] tracking-tight" 
              data-json-key="index.hero.title">
              {texts.hero.title}
            </h1>
            
            <p 
              className="text-2xl md:text-3xl mb-12 text-[#CFAF5A] font-semibold max-w-3xl mx-auto" 
              data-json-key="index.hero.subtitle">
              {texts.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/purificacao">
                <Button className="btn-gold text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[240px]">
                  <span data-json-key="index.hero.buttons.purification">{texts.hero.buttons.purification}</span>
                </Button>
              </Link>
              <Link to="/tratamentos">
                <Button className="bg-gradient-to-r from-[#4A90A9] to-[#5EA98D] text-white text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-[240px]">
                  <span data-json-key="index.hero.buttons.treatments">{texts.hero.buttons.treatments}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
            <path d="M0,0 Q300,60 600,40 T1200,20 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Igreja & Instituto - Redesenhado com Layout Moderno */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-slate-50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto space-y-32">
            
            {/* Igreja de Metatron */}
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Content Left */}
              <div className="lg:col-span-3 space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-linear-to-r from-amber-50 to-transparent rounded-full border border-amber-200/50">
                  <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      return (
                        <line key={i}
                          x1={50 + Math.cos(angle) * 25} y1={50 + Math.sin(angle) * 25}
                          x2={50 + Math.cos(angle) * 40} y2={50 + Math.sin(angle) * 40}
                          stroke="#CFAF5A" strokeWidth="3" strokeLinecap="round" />
                      );
                    })}
                  </svg>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#222222]" data-json-key="index.igreja.title">
                    {texts.igreja.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {texts.igreja.description.map((paragraph, index) => (
                    <p key={index} className="text-lg text-gray-700 leading-relaxed"
                      data-json-key={`index.igreja.description[${index}]`}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <Link to="/quem-somos">
                  <Button className="btn-gold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    data-json-key="index.igreja.knowMoreButton">
                    {texts.igreja.knowMoreButton}
                  </Button>
                </Link>
              </div>

              {/* Card Right */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden border-2 border-amber-200/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="bg-linear-to-br from-[#CFAF5A] to-[#B38938] p-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2" data-json-key="index.purification.title">
                      {texts.purification.title}
                    </h3>
                  </div>
                  <CardContent className="p-8 bg-linear-to-b from-white to-amber-50/30">
                    <div className="space-y-5">
                      {texts.purification.phases.map((phase, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-[#CFAF5A] to-[#B38938] text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform"
                            data-json-key={`index.purification.phases[${index}].number`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-[#222222] mb-1"
                              data-json-key={`index.purification.phases[${index}].title`}>
                              {phase.title}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed"
                              data-json-key={`index.purification.phases[${index}].description`}>
                              {phase.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Instituto Metatron */}
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Card Left */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <Card className="overflow-hidden border-2 border-teal-200/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="bg-linear-to-br from-[#4A90A9] to-[#5EA98D] p-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2" data-json-key="index.instituto.title">
                      {texts.instituto.title}
                    </h3>
                  </div>
                  <CardContent className="p-8 bg-linear-to-b from-white to-teal-50/30">
                    <div className="space-y-4">
                      {texts.instituto.description.map((paragraph: string, idx: number) => (
                        <p key={idx} className="text-base text-gray-700 leading-relaxed"
                          data-json-key={`index.instituto.description[${idx}]`}>
                          {paragraph}
                        </p>
                      ))}
                      <div className="pt-4 space-y-3 border-t border-teal-100">
                        {texts.instituto.treatments.map((treatment: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 group">
                            <Heart className="w-5 h-5 text-[#5EA98D] shrink-0 group-hover:scale-110 transition-transform"
                              data-json-key={`index.instituto.treatments_icon[${index}]`} />
                            <span className="text-sm text-gray-700"
                              data-json-key={`index.instituto.treatments[${index}]`}>
                              {treatment}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Right */}
              <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-linear-to-r from-teal-50 to-transparent rounded-full border border-teal-200/50">
                  <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="20" fill="#4A90A9" />
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30 * Math.PI) / 180;
                      return (
                        <line key={i}
                          x1={50 + Math.cos(angle) * 25} y1={50 + Math.sin(angle) * 25}
                          x2={50 + Math.cos(angle) * 40} y2={50 + Math.sin(angle) * 40}
                          stroke="#4A90A9" strokeWidth="3" strokeLinecap="round" />
                      );
                    })}
                  </svg>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#222222]" data-json-key="index.instituto.title">
                    {texts.instituto.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {texts.instituto.description.map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-lg text-gray-700 leading-relaxed"
                      data-json-key={`index.instituto.description[${idx}]`}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
                  <p className="text-sm text-amber-900" data-json-key="index.instituto.legalNotice">
                    <strong className="font-semibold">Aviso Legal:</strong> {texts.instituto.legalNotice}
                  </p>
                </div>

                <Link to="/tratamentos">
                  <Button className="bg-linear-to-r from-[#4A90A9] to-[#5EA98D] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    data-json-key="index.instituto.ctaButton">
                    {texts.instituto.ctaButton}
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefícios - Redesenhado */}
      <section className="py-24 bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#222222]" data-json-key="index.benefitsSection.title">
                {texts.benefitsSection.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-json-key="index.benefitsSection.subtitle">
                {texts.benefitsSection.subtitle}
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {texts.instituto.benefits.map((b: { title: string; description: string }, i: number) => (
                <Card key={i} className="group relative overflow-hidden border-2 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                    i === 0 ? 'bg-linear-to-br from-pink-500 to-pink-700' :
                    i === 1 ? 'bg-linear-to-br from-[#5EA98D] to-[#4A90A9]' :
                    'bg-linear-to-br from-[#4A90A9] to-blue-600'
                  }`}></div>

                  <CardContent className="p-8 text-center relative z-10">
                    {/* Icons */}
                    <div className="mb-6">
                      {i === 0 ? (
                        <div className="flex gap-3 justify-center items-center">
                          <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sun className="w-10 h-10 text-pink-600" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform delay-75">
                            <UserRound className="w-10 h-10 text-pink-600" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform delay-150">
                            <Sun className="w-10 h-10 text-pink-600" />
                          </div>
                        </div>
                      ) : i === 1 ? (
                        <div className="flex gap-3 justify-center items-center">
                          <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-10 h-10 text-[#5EA98D]" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform delay-75">
                            <ArrowLeftRight className="w-10 h-10 text-[#5EA98D]" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform delay-150">
                            <Users className="w-10 h-10 text-[#5EA98D]" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-center items-center">
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Brain className="w-10 h-10 text-[#4A90A9]" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform delay-75">
                            <Heart className="w-10 h-10 text-[#4A90A9]" />
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform delay-150">
                            <Sparkles className="w-10 h-10 text-[#4A90A9]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-[#222222]" data-json-key={`index.instituto.benefits[${i}].title`}>
                      {b.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-gray-700 leading-relaxed" data-json-key={`index.instituto.benefits[${i}].description`}>
                      {b.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Físico/Espiritual/Integrada - Redesenhado Completamente */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-8 relative">
                <div className="absolute inset-0 bg-purple-300/30 blur-3xl rounded-full animate-pulse"></div>
                <Sun className="w-20 h-20 text-amber-500 relative animate-spin-slow" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-amber-600 bg-clip-text text-transparent"
                data-json-key="index.fisicoEspiritual.title">
                {texts.fisicoEspiritual.title}
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
                data-json-key="index.fisicoEspiritual.subtitle">
                {texts.fisicoEspiritual.subtitle}
              </p>
            </div>

            {/* Two Column Cards */}
            <div className="grid lg:grid-cols-2 gap-10 mb-16">
              
              {/* Físico/Científico */}
              <Card className="group relative overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <CardContent className="p-10 relative z-10">
                  <div className="text-center mb-8">
                    <div className="inline-block p-5 bg-blue-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                      <Brain className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-blue-700 mb-3" data-json-key="index.fisicoEspiritual.fisico.title">
                      {texts.fisicoEspiritual.fisico.title}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold" data-json-key="index.fisicoEspiritual.fisico.subtitle">
                      {texts.fisicoEspiritual.fisico.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6" data-json-key="index.fisicoEspiritual.fisico.description">
                    {texts.fisicoEspiritual.fisico.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {texts.fisicoEspiritual.fisico.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                  </ul>

                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-blue-900 mb-3" data-json-key="index.fisicoEspiritual.fisico.abordagem.title">
                      {texts.fisicoEspiritual.fisico.abordagem.title}
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: texts.fisicoEspiritual.fisico.abordagem.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                      data-json-key="index.fisicoEspiritual.fisico.abordagem.description" />
                  </div>
                </CardContent>
              </Card>

              {/* Espiritual/Energético */}
              <Card className="group relative overflow-hidden border-2 border-amber-200 hover:border-amber-400 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                
                <CardContent className="p-10 relative z-10">
                  <div className="text-center mb-8">
                    <div className="inline-block p-5 bg-amber-100 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                      <Ghost className="w-16 h-16 text-amber-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-amber-700 mb-3" data-json-key="index.fisicoEspiritual.espiritual.title">
                      {texts.fisicoEspiritual.espiritual.title}
                    </h3>
                    <p className="text-lg text-amber-600 font-semibold" data-json-key="index.fisicoEspiritual.espiritual.subtitle">
                      {texts.fisicoEspiritual.espiritual.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6" data-json-key="index.fisicoEspiritual.espiritual.description">
                    {texts.fisicoEspiritual.espiritual.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {texts.fisicoEspiritual.espiritual.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                        <span className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                  </ul>

                  <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500">
                    <p className="text-sm font-semibold text-amber-900 mb-3" data-json-key="index.fisicoEspiritual.espiritual.abordagem.title">
                      {texts.fisicoEspiritual.espiritual.abordagem.title}
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: texts.fisicoEspiritual.espiritual.abordagem.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                      data-json-key="index.fisicoEspiritual.espiritual.abordagem.description" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Abordagem Integrada - Redesenhada */}
            <Card className="relative overflow-hidden border-2 border-purple-300 shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-amber-50 opacity-50"></div>
              
              <CardContent className="p-12 relative z-10">
                <div className="text-center mb-10">
                  <div className="flex justify-center gap-6 mb-8">
                    <div className="p-4 bg-blue-100 rounded-2xl">
                      <Brain className="w-14 h-14 text-blue-600" />
                    </div>
                    <div className="p-4 bg-purple-100 rounded-2xl">
                      <Zap className="w-14 h-14 text-purple-600" />
                    </div>
                    <div className="p-4 bg-amber-100 rounded-2xl">
                      <Sun className="w-14 h-14 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4" data-json-key="index.fisicoEspiritual.integrada.title">
                    {texts.fisicoEspiritual.integrada.title}
                  </h3>
                </div>

                <p className="text-center text-lg text-gray-700 leading-relaxed mb-10 max-w-4xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: texts.fisicoEspiritual.integrada.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  data-json-key="index.fisicoEspiritual.integrada.description" />

                <div className="bg-white p-8 rounded-2xl border-2 border-purple-200 shadow-lg">
                  <p className="font-semibold text-purple-900 mb-6 text-center text-lg" data-json-key="index.fisicoEspiritual.integrada.oferecemos.title">
                    {texts.fisicoEspiritual.integrada.oferecemos.title}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {texts.fisicoEspiritual.integrada.oferecemos.items.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-linear-to-r from-purple-50 to-transparent rounded-lg">
                        <Database className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center font-bold text-purple-800 text-xl mt-10" data-json-key="index.fisicoEspiritual.integrada.conclusao">
                  {texts.fisicoEspiritual.integrada.conclusao}
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Tripla Proteção - Redesenhado */}
      <section className="py-24 bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-json-key="index.triplaProtecao.title">
                {texts.triplaProtecao.title}
              </h2>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed" data-json-key="index.triplaProtecao.subtitle">
                {texts.triplaProtecao.subtitle}
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid lg:grid-cols-3 gap-10">
              {texts.triplaProtecao.items.map((item: { title: string; description: string }, idx: number) => {
                const icons = [Compass, Heart, Sun];
                const colors = [
                  { primary: 'blue-600', light: 'blue-100', border: 'blue-300', bg: 'blue-50' },
                  { primary: 'pink-600', light: 'pink-100', border: 'pink-300', bg: 'pink-50' },
                  { primary: 'amber-600', light: 'amber-100', border: 'amber-300', bg: 'amber-50' }
                ];
                const Icon = icons[idx];
                const colorScheme = colors[idx];

                return (
                  <Card key={idx} className="group relative overflow-hidden border-2 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-linear-to-br from-${colorScheme.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <CardContent className="p-10 text-center relative z-10">
                      {/* Icon Container */}
                      <div className="mb-8">
                        <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-${colorScheme.light} group-hover:scale-110 transition-transform duration-500 relative`}>
                          {idx === 1 ? (
                            <>
                              <div className="absolute inset-0 bg-pink-300/30 rounded-3xl blur-xl animate-pulse"></div>
                              <Heart className={`w-16 h-16 text-${colorScheme.primary} fill-${colorScheme.primary} relative animate-pulse`} />
                            </>
                          ) : idx === 2 ? (
                            <Icon className={`w-16 h-16 text-${colorScheme.primary} animate-spin-slow`} />
                          ) : (
                            <Icon className={`w-16 h-16 text-${colorScheme.primary}`} />
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl md:text-3xl font-bold mb-6 text-${colorScheme.primary}`}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed text-base"
                        dangerouslySetInnerHTML={{ __html: item.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Final Section + Footer Combined */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Horizonte terrestre: céu acima, terra abaixo */}
        <div className="absolute inset-0 opacity-50">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <defs>
              {/* Gradiente do céu - AZUL vibrante */}
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9"/>
                <stop offset="50%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#7dd3fc"/>
              </linearGradient>
              
              {/* Gradiente para raios de sol */}
              <linearGradient id="sunRay1" x1="20%" y1="0%" x2="20%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="sunRay2" x1="35%" y1="0%" x2="35%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="sunRay3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </linearGradient>
              
              {/* Gradiente da terra - marrom escuro */}
              <linearGradient id="earthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c"/>
                <stop offset="100%" stopColor="#44403c"/>
              </linearGradient>
            </defs>
            
            {/* CÉU AZUL - com curvatura positiva na parte inferior */}
            <path 
              d="M0,0 L1200,0 L1200,260 Q600,180 0,260 Z" 
              fill="url(#skyGradient)"
            />
            
            {/* Efeitos metálicos difusos distribuídos pelo céu */}
            <defs>
              <radialGradient id="glow1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow2">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow3">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* Círculos de luz metálica difusa espalhados */}
            <circle cx="150" cy="30" r="80" fill="url(#glow1)" opacity="0.4"/>
            <circle cx="280" cy="50" r="60" fill="url(#glow3)" opacity="0.35"/>
            <circle cx="420" cy="25" r="90" fill="url(#glow2)" opacity="0.45"/>
            <circle cx="550" cy="45" r="70" fill="url(#glow1)" opacity="0.4"/>
            <circle cx="680" cy="35" r="85" fill="url(#glow3)" opacity="0.38"/>
            <circle cx="820" cy="55" r="65" fill="url(#glow2)" opacity="0.42"/>
            <circle cx="950" cy="40" r="75" fill="url(#glow1)" opacity="0.37"/>
            <circle cx="1080" cy="30" r="70" fill="url(#glow3)" opacity="0.4"/>
            
            {/* Segunda camada de brilhos menores */}
            <circle cx="200" cy="70" r="50" fill="url(#glow2)" opacity="0.3"/>
            <circle cx="360" cy="80" r="45" fill="url(#glow1)" opacity="0.28"/>
            <circle cx="500" cy="90" r="55" fill="url(#glow3)" opacity="0.32"/>
            <circle cx="640" cy="75" r="48" fill="url(#glow2)" opacity="0.3"/>
            <circle cx="780" cy="85" r="52" fill="url(#glow1)" opacity="0.29"/>
            <circle cx="920" cy="95" r="47" fill="url(#glow3)" opacity="0.31"/>
            <circle cx="1060" cy="80" r="50" fill="url(#glow2)" opacity="0.28"/>
            
            {/* Terceira camada - brilhos muito sutis */}
            <circle cx="100" cy="60" r="35" fill="url(#glow3)" opacity="0.25"/>
            <circle cx="320" cy="110" r="40" fill="url(#glow1)" opacity="0.22"/>
            <circle cx="480" cy="65" r="38" fill="url(#glow2)" opacity="0.24"/>
            <circle cx="720" cy="105" r="42" fill="url(#glow3)" opacity="0.23"/>
            <circle cx="880" cy="70" r="36" fill="url(#glow1)" opacity="0.25"/>
            <circle cx="1020" cy="100" r="39" fill="url(#glow2)" opacity="0.22"/>
            
            {/* TERRA - com curvatura positiva na parte superior */}
            <path 
              d="M0,260 Q600,180 1200,260 L1200,400 L0,400 Z" 
              fill="url(#earthGradient)"
            />
            
            {/* LINHA DO HORIZONTE - curvatura mais pronunciada */}
            <path 
              d="M0,260 Q600,180 1200,260" 
              stroke="#d6d3d1" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.6"
            />
            
            {/* ÁGUA - camadas animadas verde-água com curvatura acentuada */}
            <path 
              className="animate-[wave_3s_ease-in-out_infinite]" 
              d="M0,340 Q600,280 1200,340 L1200,400 L0,400 Z" 
              fill="#2dd4bf" 
              opacity="0.4"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_0.5s]" 
              d="M0,360 Q600,300 1200,360 L1200,400 L0,400 Z" 
              fill="#14b8a6" 
              opacity="0.35"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_1s]" 
              d="M0,380 Q600,320 1200,380 L1200,400 L0,400 Z" 
              fill="#0d9488" 
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Sol Dourado - posicionado absolutamente, independente do fundo */}
        <div className="absolute top-8 left-8 w-32 h-32 z-10">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="20" fill="#CFAF5A" />
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
                  stroke="#CFAF5A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        {/* Lua Crescente - posicionada no canto superior direito */}
        <div className="absolute top-8 right-8 w-32 h-32 z-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="crescentMask">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMask)" />
          </svg>
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-10 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-json-key="index.cta.title">
              {texts.cta.title}
            </h2>
            <p className="text-xl mb-8 text-white drop-shadow-md" data-json-key="index.cta.subtitle">
              {texts.cta.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="index.cta.buttonText">
                {texts.cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright */}
        <div className="relative z-10 pt-8 pb-4 text-white">
          <div className="container mx-auto px-4">
            <div className="border-t border-emerald-700/50 mt-32 pt-4 pb-1 text-center text-emerald-100/70 text-sm max-w-4xl mx-auto">
              <p data-json-key="index.footer.copyright">{texts.footer.copyright}</p>
              <p className="mt-2" data-json-key="index.footer.trademark">{texts.footer.trademark}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
