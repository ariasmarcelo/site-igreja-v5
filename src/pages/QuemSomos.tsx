import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Microscope, Heart, HandHelping, ShieldCheck, BookOpen, FileText, Target, Waves, Shield } from "lucide-react";
import { usePageContent } from '@/hooks/useContent';
import { usePageStyles } from '@/hooks/usePageStyles';
import { SharedFooter } from '@/components/SharedFooter';
import { FooterBackground } from '@/components/FooterBackground';
import { PageLoading, PageError } from '@/components/PageLoading';
import '@/styles/layouts/pages/quemsomos.css';
import '@/styles/waves.css';

interface QuemSomosTexts {
  header: { title: string; subtitle: string };
  sections: {
    historico_title: string;
    principios_title: string;
    hermeticos_title: string;
  };
  mission: { title: string; text: string };
  footer?: { copyright: string; trademark: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Constantes movidas para FORA do componente para evitar re-criação a cada render
const PRINCIPIOS_ICONS = [
  <Sparkles className="h-6 w-6" key="sparkles" />,
  <Microscope className="h-6 w-6" key="microscope" />,
  <Heart className="h-6 w-6" key="heart" />,
  <HandHelping className="h-6 w-6" key="handhelping" />,
  <ShieldCheck className="h-6 w-6" key="shieldcheck" />,
  <FileText className="h-6 w-6" key="filetext" />
];

const HERMETICOS_CORES = [
  // Mentalismo - Prata violeta (mente, consciência)
  { from: 'from-violet-200', via: 'via-purple-300', to: 'to-slate-300', border: 'border-violet-300', shine: 'shadow-[0_0_20px_rgba(167,139,250,0.4)]' },
  // Correspondência - Ouro rosa (reflexão, espelhamento)
  { from: 'from-pink-200', via: 'via-rose-300', to: 'to-amber-200', border: 'border-rose-300', shine: 'shadow-[0_0_20px_rgba(251,207,232,0.4)]' },
  // Vibração - Cobre laranja (energia, movimento)
  { from: 'from-orange-200', via: 'via-amber-300', to: 'to-yellow-200', border: 'border-orange-300', shine: 'shadow-[0_0_20px_rgba(253,186,116,0.4)]' },
  // Polaridade - Platina azul-prata (opostos, dualidade)
  { from: 'from-slate-200', via: 'via-blue-300', to: 'to-cyan-200', border: 'border-slate-300', shine: 'shadow-[0_0_20px_rgba(148,163,184,0.4)]' },
  // Ritmo - Turquesa metálico (ciclos, fluxos)
  { from: 'from-teal-200', via: 'via-cyan-300', to: 'to-emerald-200', border: 'border-teal-300', shine: 'shadow-[0_0_20px_rgba(153,246,228,0.4)]' },
  // Gênero - Rosa-ouro (masculino/feminino)
  { from: 'from-pink-300', via: 'via-fuchsia-300', to: 'to-rose-300', border: 'border-pink-400', shine: 'shadow-[0_0_20px_rgba(244,114,182,0.4)]' },
  // Causa e Efeito - Bronze dourado (transformação)
  { from: 'from-amber-300', via: 'via-yellow-300', to: 'to-orange-300', border: 'border-amber-400', shine: 'shadow-[0_0_20px_rgba(252,211,77,0.4)]' }
];

export default function QuemSomos() {
  usePageStyles('quemsomos');
  const { data: texts, loading, error } = usePageContent<QuemSomosTexts>('quemsomos');

  if (loading) {
    return (
      <PageLoading
        icon={BookOpen}
        text="Carregando sobre nós..."
        bgColor="bg-gradient-to-b from-violet-50 to-purple-50"
        iconColor="text-violet-600"
        textColor="text-violet-900"
      />
    );
  }
  
  if (error) {
    return (
      <PageError
        message={error}
        bgColor="bg-gradient-to-b from-red-50 to-rose-50"
        textColor="text-red-700"
      />
    );
  }
  
  if (!texts) return <div className="flex items-center justify-center min-h-screen">Sem dados</div>;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header Moderno */}
      <section className="bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <BookOpen className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg" data-json-key="quemsomos.header.title">{texts.header.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-md" data-json-key="quemsomos.header.subtitle">{texts.header.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20 max-w-6xl">
        
        {/* Histórico - Design Limpo com Elevação */}
        <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center" data-json-key="quemsomos.historico.title">{texts.historico.title}</h2>
          <div className="space-y-6">
            {texts.historico.content.map((paragraph: string, index: number) => (
              <div key={index} className="bg-linear-to-r from-gray-50 to-white p-6 rounded-lg border-l-4 border-[#5EA98D] shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.historico.content[${index}]`}>{paragraph}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Princípios da Instituição - Fundo Suave com Elevação */}
        <section className="bg-linear-to-br from-violet-50 via-purple-50 to-violet-100 rounded-2xl shadow-xl p-8 md:p-12 border border-violet-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4" data-json-key="quemsomos.principios.title">{texts.principios.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-json-key="quemsomos.principios.subtitle">{texts.principios.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {texts.principios.items.map((item: { title: string; content: string }, index: number) => (
              <Card key={index} className="border-t-4 border-t-violet-600 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-violet-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-md text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)]"></div>
                      {PRINCIPIOS_ICONS[index]}
                    </div>
                    <CardTitle className="text-lg text-gray-800" data-json-key={`quemsomos.principios.items[${index}].title`}>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-sm" data-json-key={`quemsomos.principios.items[${index}].content`}>{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Princípios Herméticos - Accordion Design com Fundo Índigo */}
        <section className="bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 md:p-12 border border-indigo-100">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative w-14 h-14">
                <Shield className="w-14 h-14 text-blue-600 shield-blue-icon" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800" data-json-key="quemsomos.hermeticos.title">{texts.hermeticos.title}</h2>
              <div className="relative w-14 h-14">
                <Shield className="w-14 h-14 text-red-600 shield-red-icon" />
              </div>
            </div>
            {/* Pergaminho com texto introdutório */}
            <div className="max-w-4xl mx-auto my-8 relative">
              {/* Bordas decorativas do pergaminho */}
              <div className="relative bg-linear-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-lg shadow-2xl border-4 border-amber-800/30 p-8 md:p-10">
                {/* Textura de papel antigo */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 rounded-lg pointer-events-none"></div>
                
                {/* Cantos decorativos */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-700/40 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-700/40 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-700/40 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-700/40 rounded-br-lg"></div>
                
                {/* Texto do pergaminho */}
                <p className="relative text-base md:text-lg text-amber-900/90 leading-relaxed text-justify font-serif drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]" 
                   data-json-key="quemsomos.hermeticos.subtitle">
                  {texts.hermeticos.subtitle}
                </p>
                
                {/* Sombra interna para profundidade */}
                <div className="absolute inset-0 rounded-lg shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] pointer-events-none"></div>
              </div>
              
              {/* Sombra externa do pergaminho */}
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-amber-900/5 to-amber-900/10 rounded-lg translate-y-1 -z-10"></div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto space-y-4">
            {texts.hermeticos.items.map((item: { number: string; title: string; quote?: string; description: string }, index: number) => {
              const cores = HERMETICOS_CORES[index];
              return (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className={`border-l-4 ${cores.border} rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden border-b-0 ${cores.shine}`}
              >
                <AccordionTrigger className={`px-6 py-4 hover:no-underline bg-linear-to-r ${cores.from} ${cores.via} ${cores.to} relative`}>
                  {/* Efeito metálico brilhante */}
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.6)_45%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.6)_55%,transparent_100%)] opacity-40"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.5),transparent_50%)]"></div>
                  
                  <div className="flex items-center gap-4 w-full relative z-10">
                    <div className={`w-12 h-12 rounded-full bg-linear-to-br ${cores.from} ${cores.via} ${cores.to} flex items-center justify-center shadow-xl text-gray-700 text-xl font-bold relative overflow-hidden shrink-0 border-2 border-white/50`}>
                      {/* Reflexo metálico no número */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_60%)]"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.4)_50%,transparent_70%)]"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/10 to-transparent"></div>
                      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">{item.number}</span>
                    </div>
                    <span className="text-xl font-semibold text-gray-800 text-left drop-shadow-sm" data-json-key={`quemsomos.hermeticos.items[${index}].title`}>{item.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-4">
                  {item.quote && (
                    <div className="mb-4 pl-4 border-l-2 border-gray-300 italic text-gray-600 text-lg" data-json-key={`quemsomos.hermeticos.items[${index}].quote`}>
                      "{item.quote}"
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.hermeticos.items[${index}].description`}>{item.description}</p>
                </AccordionContent>
              </AccordionItem>
            );
            })}
          </Accordion>
        </section>

        {/* A Magia Divina - Destaque Dourado com Elevação */}
        <section className="bg-linear-to-br from-amber-50/50 via-yellow-50/50 to-orange-50/50 rounded-2xl shadow-2xl p-8 md:p-12 border border-amber-200">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-linear-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                  <Waves className="w-16 h-16 text-amber-600 waves-amber-icon" />
                </div>
                <CardTitle className="text-3xl text-amber-800" data-json-key="quemsomos.magia.title">{texts.magia.title}</CardTitle>
                <div className="relative w-16 h-16">
                  <Target className="w-16 h-16 text-amber-600 target-amber-icon" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {/* Introdução */}
              <div className="space-y-4">
                {texts.magia.introducao && texts.magia.introducao.map((paragraph: string, index: number) => (
                  <div key={index} className="bg-white/60 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="text-gray-800 leading-relaxed" data-json-key={`quemsomos.magia.introducao[${index}]`}>{paragraph}</p>
                  </div>
                ))}
              </div>

              {/* Características e Funções */}
              {texts.magia.caracteristicas && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center" data-json-key="quemsomos.magia.caracteristicas.title">
                    {texts.magia.caracteristicas.title}
                  </h3>
                  <div className="grid gap-4">
                    {texts.magia.caracteristicas.items && texts.magia.caracteristicas.items.map((item: { title: string; content: string }, index: number) => (
                      <div key={index} className="bg-white/80 border-l-4 border-amber-600 p-5 rounded-r-lg hover:bg-white transition-colors">
                        <h4 className="font-bold text-lg text-amber-900 mb-2" data-json-key={`quemsomos.magia.caracteristicas.items[${index}].title`}>
                          {item.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.magia.caracteristicas.items[${index}].content`}>
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </section>
      </div>

      {/* Footer CTA Section com fundo céu, água, sol e lua */}
      <section className="relative overflow-hidden mt-16">
        {/* Fundo com transição céu-água */}
        <FooterBackground gradientId="skyGradient" />

        {/* Sol Dourado - posicionado absolutamente, independente do fundo */}
        <div className="absolute top-4 left-8 w-20 h-20 z-10">
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
        <div className="absolute top-4 right-8 w-20 h-20 z-20">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="crescentMaskQuemSomos">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMaskQuemSomos)" />
          </svg>
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong whitespace-pre-line" data-json-key="quemsomos.cta.title">
              {texts.cta.title}
            </h2>
            <p className="text-lg mb-5 text-white text-shadow-medium whitespace-pre-line" data-json-key="quemsomos.cta.subtitle">
              {texts.cta.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105" data-json-key="quemsomos.cta.buttonText">
                {texts.cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright (do DB: compartilhado) */}
        <SharedFooter 
          copyright={texts?.footer?.copyright}
          trademark={texts?.footer?.trademark}
        />
      </section>
    </div>
  );
}
