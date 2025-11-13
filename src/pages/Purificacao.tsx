import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Sun, Star, Crown, Compass, Heart, Infinity as InfinityIcon, LineChart, ChevronDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

interface PurificacaoTexts {
  header: { title: string; subtitle: string };
  intro: { mainText: string; description: string };
  valores: { title: string; intro?: string; cards: any[] };
  [key: string]: any;
}

export default function Purificacao() {
  usePageStyles('purificacao');
  const { texts, loading } = useLocaleTexts<PurificacaoTexts>('purificacao');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const togglePhase = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };

  if (loading || !texts) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0]">
      {/* Header */}
      <section className="py-16 bg-linear-to-r from-[#D4AF37] via-[#C5A028] to-[#D4AF37] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_20%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.12)_60%,transparent_80%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_43%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.1)_57%,transparent_75%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_30%,transparent_65%)]"></div>
        <div className="absolute inset-0 opacity-20">
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
                style={{ filter: 'drop-shadow(0 4px 8px rgba(139, 90, 0, 0.7))' }}
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-[0_4px_12px_rgba(139,90,0,0.8)]" data-json-key="purificacao.header.title">{texts.header.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-[0_2px_8px_rgba(139,90,0,0.7)]" data-json-key="purificacao.header.subtitle">{texts.header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-6" data-json-key="purificacao.intro.mainText">
              {texts.intro.mainText}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed" data-json-key="purificacao.intro.description">
              {texts.intro.description}
            </p>
          </div>
        </div>
      </section>

      {/* Fluxo das Três Fases - Design Moderno e Leve */}
      <section className="py-10 bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Título da Seção */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-2 tracking-wide">
                AS TRÊS FASES DO PROCESSO
              </h2>
              <div className="flex items-center justify-center gap-3 mt-2">
                <div className="h-px w-20 bg-linear-to-r from-transparent via-amber-400 to-amber-500"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div className="h-px w-20 bg-linear-to-l from-transparent via-amber-400 to-amber-500"></div>
              </div>
            </div>

            {/* FASE 1 - INICIAL */}
            <div className="mb-6">
              <Card 
                className={`border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  expandedPhase === 1 ? 'ring-2 ring-red-300' : ''
                }`}
                onClick={() => togglePhase(1)}
              >
                <CardHeader className="bg-linear-to-r from-red-50 to-white py-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(239,68,68,0.15),transparent_70%)]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)]"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-linear-to-br from-red-400 via-red-500 to-red-700 flex items-center justify-center shadow-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)]"></div>
                        <Sparkles className="w-6 h-6 text-white relative z-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">FASE 1</span>
                        </div>
                        <CardTitle className="text-xl md:text-2xl text-gray-800" data-json-key="purificacao.faseInicial.title">{texts.faseInicial.title}</CardTitle>
                        <p className="text-sm text-gray-600" data-json-key="purificacao.faseInicial.subtitle">{texts.faseInicial.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-red-500 transition-transform duration-300 ${
                        expandedPhase === 1 ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedPhase === 1 ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800" data-json-key="purificacao.faseInicial.objetivo.title">{texts.faseInicial.objetivo.title}</h3>
                      <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseInicial.objetivo.content">
                        {texts.faseInicial.objetivo.content}
                      </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-4 text-red-700" data-json-key="purificacao.faseInicial.activities.title">{texts.faseInicial.activities.title}</h4>
                      <ul className="space-y-3 text-gray-700">
                        {texts.faseInicial.activities.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-red-500 font-bold mt-1">•</span>
                            <span data-json-key={`purificacao.faseInicial.activities.items[${index}]`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-gray-800" data-json-key="purificacao.faseInicial.duration.title">{texts.faseInicial.duration.title}</h4>
                      <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseInicial.duration.content">
                        {texts.faseInicial.duration.content}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* FASE 2 - INTERMEDIÁRIA */}
            <div className="mb-6">
              <Card 
                className={`border-l-4 border-cyan-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  expandedPhase === 2 ? 'ring-2 ring-cyan-300' : ''
                }`}
                onClick={() => togglePhase(2)}
              >
                <CardHeader className="bg-linear-to-r from-cyan-50 to-white py-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.15),transparent_70%)]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)]"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-linear-to-br from-cyan-400 via-cyan-500 to-cyan-700 flex items-center justify-center shadow-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)]"></div>
                        <LineChart className="w-6 h-6 text-white relative z-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full">FASE 2</span>
                        </div>
                        <CardTitle className="text-xl md:text-2xl text-gray-800" data-json-key="purificacao.faseIntermediaria.title">{texts.faseIntermediaria.title}</CardTitle>
                        <p className="text-sm text-gray-600" data-json-key="purificacao.faseIntermediaria.subtitle">{texts.faseIntermediaria.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-cyan-500 transition-transform duration-300 ${
                        expandedPhase === 2 ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedPhase === 2 ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800" data-json-key="purificacao.faseIntermediaria.requisito.title">{texts.faseIntermediaria.requisito.title}</h3>
                      <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseIntermediaria.requisito.content">{texts.faseIntermediaria.requisito.content}</p>
                    </div>

                    <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-4 text-cyan-700" data-json-key="purificacao.faseIntermediaria.trabalhos.title">{texts.faseIntermediaria.trabalhos.title}</h4>
                      <div className="space-y-4">
                        {texts.faseIntermediaria.trabalhos.items.map((item, index) => (
                          <div key={index}>
                            <h5 className="font-semibold text-base mb-2 text-gray-800" data-json-key={`purificacao.faseIntermediaria.trabalhos.items[${index}].title`}>{item.title}</h5>
                            <p className="text-gray-700" data-json-key={`purificacao.faseIntermediaria.trabalhos.items[${index}].content`}>{item.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-gray-800" data-json-key="purificacao.faseIntermediaria.integracao.title">{texts.faseIntermediaria.integracao.title}</h4>
                      <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseIntermediaria.integracao.content">{texts.faseIntermediaria.integracao.content}</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* FASE 3 - FINAL */}
            <div className="mb-6">
              <Card 
                className={`border-l-4 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  expandedPhase === 3 ? 'ring-2 ring-amber-300' : ''
                }`}
                onClick={() => togglePhase(3)}
              >
                <CardHeader className="bg-linear-to-r from-amber-50 to-white py-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.15),transparent_70%)]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)]"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)]"></div>
                        <Crown className="w-6 h-6 text-white relative z-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">FASE 3</span>
                        </div>
                        <CardTitle className="text-xl md:text-2xl text-gray-800" data-json-key="purificacao.faseFinal.title">{texts.faseFinal.title}</CardTitle>
                        <p className="text-sm text-gray-600" data-json-key="purificacao.faseFinal.subtitle">{texts.faseFinal.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-6 h-6 text-amber-500 transition-transform duration-300 ${
                        expandedPhase === 3 ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedPhase === 3 ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-800" data-json-key="purificacao.faseFinal.iniciacao.title">{texts.faseFinal.iniciacao.title}</h3>
                      <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseFinal.iniciacao.content">{texts.faseFinal.iniciacao.content}</p>
                    </div>

                    <div className="bg-linear-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Sun className="w-10 h-10 text-amber-600" />
                        <h4 className="font-semibold text-xl text-amber-700" data-json-key="purificacao.faseFinal.evento.title">{texts.faseFinal.evento.title ?? 'O Evento Iniciático'}</h4>
                      </div>
                      {texts.faseFinal.evento.content.map((para: string, i: number) => (
                        <p key={i} className={`text-gray-700 leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>
                          {para}
                        </p>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-gray-800" data-json-key="purificacao.faseFinal.posIniciacao.title">{texts.faseFinal.posIniciacao.title}</h4>
                      <p className="text-gray-700 leading-relaxed mb-4" data-json-key="purificacao.faseFinal.posIniciacao.content">{texts.faseFinal.posIniciacao.content}</p>
                      <ul className="space-y-3 text-gray-700">
                        {texts.faseFinal.posIniciacao.items.map((it: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-amber-500 font-bold mt-1">✦</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3 text-blue-800" data-json-key="purificacao.faseFinal.adepto.title">{texts.faseFinal.adepto.title}</h4>
                      <p className="text-blue-900 leading-relaxed" data-json-key="purificacao.faseFinal.adepto.content">{texts.faseFinal.adepto.content}</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Trabalhos Espirituais com Psicod├®licos */}
      <section className="py-16 bg-linear-to-br from-purple-900 via-indigo-900 to-purple-950 relative overflow-hidden">
        {/* Efeitos de fundo m├¡sticos */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-2 border-purple-300/30 shadow-2xl">
              <CardHeader className="bg-linear-to-br from-purple-600/40 via-fuchsia-500/40 to-indigo-600/40 backdrop-blur-sm text-white pt-6 pb-3 px-8 relative overflow-hidden border-b-2 border-purple-300/30">
                {/* Padr├Áes geom├®tricos sagrados */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
                  <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full transform rotate-45"></div>
                  <div className="absolute bottom-4 right-4 w-40 h-40 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-40 h-40 border-2 border-white rounded-full transform rotate-45"></div>
                </div>
                
                {/* Efeitos de luz */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.25),transparent_50%)]"></div>
                
                <div className="text-center relative z-10">
                  <div className="inline-block mb-2 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                    <InfinityIcon className="w-24 h-24 mx-auto drop-shadow-2xl filter brightness-125" />
                  </div>
                  <CardTitle className="text-4xl md:text-5xl font-semibold mb-3 drop-shadow-lg font-['Poppins',sans-serif] tracking-[0.02em] [text-shadow:0_0_30px_rgba(255,255,255,0.5),0_0_60px_rgba(167,139,250,0.4)]" 
                    data-json-key="purificacao.psicodelicos.title">
                    {texts.psicodelicos.title}
                  </CardTitle>
                  <p className="text-xl font-light italic opacity-95 drop-shadow-md pb-2 tracking-[0.05em]" 
                    data-json-key="purificacao.psicodelicos.subtitle">
                    {texts.psicodelicos.subtitle}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-8 bg-linear-to-br from-white/95 via-purple-50/90 to-white/95 backdrop-blur-sm">

                {/* Caixa Estilo Papiro Antigo - Texto Introdutório */}
                <div className="max-w-4xl mx-auto mb-12">
                  <div className="relative bg-linear-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 p-8 rounded-lg border-4 border-amber-900/20 shadow-2xl" 
                       style={{ 
                         backgroundImage: `linear-gradient(to bottom right, rgba(254, 243, 199, 0.95), rgba(254, 249, 195, 0.98), rgba(251, 191, 36, 0.15))`,
                         boxShadow: 'inset 0 2px 4px rgba(217, 119, 6, 0.1), 0 8px 24px rgba(0, 0, 0, 0.15)'
                       }}>
                    
                    {/* Textura de papiro */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ 
                           backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 53, 15, 0.4) 2px, rgba(120, 53, 15, 0.4) 3px)`,
                           mixBlendMode: 'multiply'
                         }}>
                    </div>
                    
                    {/* Bordas decorativas do papiro */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    
                    {/* Ornamentos nos cantos */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg"></div>
                    
                    {/* Texto em estilo manuscrito antigo */}
                    <div className="relative z-10 text-center space-y-6">
                      <p className="text-xl md:text-2xl text-amber-950 leading-relaxed font-serif italic" 
                         data-json-key="purificacao.psicodelicos.intro"
                         style={{ 
                           textShadow: '0 1px 2px rgba(217, 119, 6, 0.1)',
                           letterSpacing: '0.02em'
                         }}
                         dangerouslySetInnerHTML={{ __html: texts.psicodelicos.intro }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Tripla Proteção - MANTIDO INTACTO */}
                <div className="bg-linear-to-br from-purple-100/80 via-fuchsia-50/70 to-indigo-100/80 p-6 pt-4 rounded-2xl border-2 border-purple-300/50 shadow-xl backdrop-blur-sm relative overflow-hidden mb-12">
                  {/* Efeito de brilho de fundo */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.15),transparent_70%)]"></div>
                  
                  {/* Ícone de Escudo Dourado Metálico */}
                  <div className="flex justify-center mb-2">
                    <div className="relative w-16 h-16">
                      <Shield className="w-16 h-16 text-amber-500 relative z-10" style={{ 
                        filter: 'drop-shadow(0 4px 12px rgba(217, 119, 6, 0.5))',
                        fill: 'url(#goldGradient)'
                      }} />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fcd34d" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#b45309" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-2xl text-purple-900 mb-8 text-center relative z-10 tracking-[0.03em]" data-json-key="purificacao.psicodelicos.tripleProtection.title">{texts.psicodelicos.tripleProtection.title}</h3>
                  
                  <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Compass className="w-10 h-10 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-3 text-blue-900" data-json-key="purificacao.psicodelicos.tripleProtection.cards[0].title">{texts.psicodelicos.tripleProtection.cards[0].title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" data-json-key="purificacao.psicodelicos.tripleProtection.cards[0].description">
                        {texts.psicodelicos.tripleProtection.cards[0].description}
                      </p>
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Heart className="w-10 h-10 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-3 text-green-900" data-json-key="purificacao.psicodelicos.tripleProtection.cards[1].title">{texts.psicodelicos.tripleProtection.cards[1].title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" data-json-key="purificacao.psicodelicos.tripleProtection.cards[1].description">
                        {texts.psicodelicos.tripleProtection.cards[1].description}
                      </p>
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Sun className="w-10 h-10 text-amber-600" />
                      </div>
                      <h4 className="font-semibold text-lg mb-3 text-amber-900" data-json-key="purificacao.psicodelicos.tripleProtection.cards[2].title">{texts.psicodelicos.tripleProtection.cards[2].title}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" data-json-key="purificacao.psicodelicos.tripleProtection.cards[2].description">
                        {texts.psicodelicos.tripleProtection.cards[2].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aplicações Espirituais e Terapêuticas */}
                <div className="mt-16 mb-16">
                  <h3 className="font-semibold text-3xl text-purple-900 text-center mb-10 tracking-wide" 
                      data-json-key="purificacao.psicodelicos.applications.title">
                    {texts.psicodelicos.applications.title}
                  </h3>
                  <ul className="space-y-5 max-w-4xl mx-auto">
                    {texts.psicodelicos.applications.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-4 bg-white/70 backdrop-blur-sm p-5 rounded-xl border border-purple-200/60 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                        <span className="text-purple-600 mt-0.5 text-2xl font-bold shrink-0">✦</span>
                        <span className="text-gray-800 leading-relaxed text-base" 
                              data-json-key={`purificacao.psicodelicos.applications.items[${idx}]`} 
                              dangerouslySetInnerHTML={{ __html: item }} 
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Caixa Estilo Papiro - Conclusão */}
                <div className="max-w-4xl mx-auto mb-16">
                  <div className="relative bg-linear-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 p-10 rounded-lg border-4 border-amber-900/20 shadow-2xl" 
                       style={{ 
                         backgroundImage: `linear-gradient(to bottom right, rgba(254, 243, 199, 0.95), rgba(254, 249, 195, 0.98), rgba(251, 191, 36, 0.15))`,
                         boxShadow: 'inset 0 2px 4px rgba(217, 119, 6, 0.1), 0 8px 24px rgba(0, 0, 0, 0.15)'
                       }}>
                    
                    {/* Textura de papiro */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ 
                           backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 53, 15, 0.4) 2px, rgba(120, 53, 15, 0.4) 3px)`,
                           mixBlendMode: 'multiply'
                         }}>
                    </div>
                    
                    {/* Bordas decorativas do papiro */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
                    
                    {/* Ornamentos nos cantos */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg"></div>
                    
                    {/* Conteúdo */}
                    <div className="relative z-10 text-center space-y-6">
                      <h4 className="font-bold text-2xl md:text-3xl text-amber-950 tracking-wide font-serif" 
                          data-json-key="purificacao.psicodelicos.conclusion.title"
                          style={{ 
                            textShadow: '0 1px 2px rgba(217, 119, 6, 0.1)',
                            letterSpacing: '0.03em'
                          }}>
                        {texts.psicodelicos.conclusion.title}
                      </h4>
                      <p className="text-lg md:text-xl text-amber-950 leading-relaxed font-serif italic" 
                         data-json-key="purificacao.psicodelicos.conclusion.content"
                         style={{ 
                           textShadow: '0 1px 2px rgba(217, 119, 6, 0.1)',
                           letterSpacing: '0.02em'
                         }}>
                        {texts.psicodelicos.conclusion.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão CTA */}
                <div className="text-center mt-12">
                  <Link to="/contato">
                    <Button size="lg" className="bg-linear-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-700 hover:via-fuchsia-600 hover:to-indigo-700 text-white shadow-2xl text-lg px-10 py-7 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300" style={{ letterSpacing: '0.03em' }} data-json-key="purificacao.psicodelicos.ctaButton">
                      <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                      {texts.psicodelicos.ctaButton}
                    </Button>
                  </Link>
                </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* Crit├®rios e Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Caixa Estilo Papiro - Valores e Princípios */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-linear-to-br from-amber-50 via-yellow-50/95 to-amber-100/90 p-12 rounded-lg border-4 border-amber-900/20 shadow-2xl" 
                 style={{ 
                   backgroundImage: `linear-gradient(to bottom right, rgba(254, 243, 199, 0.95), rgba(254, 249, 195, 0.98), rgba(251, 191, 36, 0.15))`,
                   boxShadow: 'inset 0 2px 4px rgba(217, 119, 6, 0.1), 0 8px 24px rgba(0, 0, 0, 0.15)'
                 }}>
              
              {/* Textura de papiro */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ 
                     backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 53, 15, 0.4) 2px, rgba(120, 53, 15, 0.4) 3px)`,
                     mixBlendMode: 'multiply'
                   }}>
              </div>
              
              {/* Bordas decorativas do papiro */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-800/30 to-transparent"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-amber-800/30 to-transparent"></div>
              
              {/* Ornamentos nos cantos */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/40 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/40 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 rounded-br-lg"></div>
              
              {/* Conteúdo interno */}
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-center mb-8 text-amber-950 font-serif" data-json-key="purificacao.valores.title">{texts.valores.title}</h2>
                
                {/* Parágrafo introdutório */}
                {texts.valores.intro && (
                  <div className="mb-12 max-w-4xl mx-auto">
                    <p className="text-lg text-amber-900 leading-relaxed text-center font-serif italic" data-json-key="purificacao.valores.intro">
                      {texts.valores.intro}
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-8">
                  {texts.valores.cards.map((card: { title: string; content: string }, idx: number) => (
                    <Card key={idx} className="shadow-lg card-hover bg-white/80 backdrop-blur-sm border border-amber-200/40">
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
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Footer com horizonte terrestre */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Horizonte terrestre: céu acima, terra abaixo */}
        <div className="absolute inset-0 opacity-100">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <defs>
              {/* Gradiente do c├®u - AZUL vibrante */}
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9"/>
                <stop offset="50%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#7dd3fc"/>
              </linearGradient>
              
              {/* Gradiente da terra - marrom escuro */}
              <linearGradient id="earthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c"/>
                <stop offset="100%" stopColor="#44403c"/>
              </linearGradient>
            </defs>
            
            {/* C├ëU AZUL - com curvatura positiva na parte inferior */}
            <path 
              d="M0,0 L1200,0 L1200,260 Q600,180 0,260 Z" 
              fill="url(#skyGradient)"
            />
            
            {/* Efeitos met├ílicos difusos distribu├¡dos pelo c├®u */}
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
            
            {/* C├¡rculos de luz met├ílica difusa espalhados */}
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
            
            {/* ├üGUA - camadas animadas verde-├ígua com curvatura acentuada */}
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
              <mask id="crescentMaskPurificacao">
                <circle cx="50" cy="50" r="25" fill="white" />
                <circle cx="58" cy="50" r="22" fill="black" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="25" fill="#F3F4F6" mask="url(#crescentMaskPurificacao)" />
          </svg>
        </div>

        {/* CTA Content - posicionado no c├®u */}
        <div className="container mx-auto px-4 relative z-10 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-json-key="purificacao.cta.title">
              {texts.cta.title}
            </h2>
            <p className="text-xl mb-8 text-white drop-shadow-md" data-json-key="purificacao.cta.subtitle">
              {texts.cta.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="purificacao.cta.buttonText">
                {texts.cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright */}
        <div className="relative z-10 pt-8 pb-4 text-white">
          <div className="container mx-auto px-4">
            <div className="border-t border-emerald-700/50 mt-32 pt-4 pb-1 text-center text-emerald-100/70 text-sm max-w-4xl mx-auto">
              <p>┬® 2025 Igreja de Metatron. Todos os direitos reservados.</p>
              <p className="mt-2">Marcas registradas protegidas por lei.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
