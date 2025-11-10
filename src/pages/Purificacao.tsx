import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Sun, Star, Crown, Compass, Heart, Infinity as InfinityIcon, LineChart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import defaultTexts from '@/locales/pt-BR/Purificacao.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

export default function Purificacao() {
  const stylesLoaded = usePageStyles('purificacao');
  const texts = useLocaleTexts('purificacao', defaultTexts);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const togglePhase = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0]" style={{ opacity: stylesLoaded ? 1 : 0, transition: 'opacity 0.2s ease-in' }}>
      {/* Header */}
      <section className="py-16 bg-linear-to-r from-[#B8860B] via-[#7A5608] to-[#B8860B] text-white relative overflow-hidden">
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
                className="w-16 h-16 animate-spin-slow"
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
      <section className="py-16">
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

      {/* Fluxo das Três Fases - Design Interativo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Título da Seção */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">As Três Fases do Processo</h2>
              <p className="text-lg text-gray-600">Clique em cada fase para ver os detalhes</p>
            </div>

            {/* Container Visual para as Três Fases */}
            <div className="bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200">
              {/* Linha do Tempo Vertical com Conexões */}
              <div className="relative">
              {/* Linha Vertical Flutuando à Direita (fora do container) */}
              <div className="absolute -right-8 top-0 bottom-0 w-2 bg-linear-to-b from-red-500 via-blue-500 to-amber-500 hidden md:block rounded-full shadow-lg"></div>

              {/* FASE 1 - INICIAL */}
              <div className="mb-8 relative">
                <div className="md:flex md:items-center gap-8">
                  
                  {/* Card da Fase */}
                  <div className="md:w-full">
                    <Card 
                      className={`shadow-xl border-2 border-red-400 cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                        expandedPhase === 1 ? 'ring-4 ring-red-300' : ''
                      }`}
                      onClick={() => togglePhase(1)}
                    >
                      <CardHeader className="bg-linear-to-r from-red-700 to-red-800 text-white py-4 px-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.35),transparent_55%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_60%,rgba(255,255,255,0.25),transparent_65%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.15)_60%,transparent_80%)]"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                              <Sparkles className="w-8 h-8 text-red-700" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl md:text-3xl mb-1 drop-shadow-md" data-json-key="purificacao.faseInicial.title">{texts.faseInicial.title}</CardTitle>
                              <p className="text-base md:text-lg opacity-90 drop-shadow-sm" data-json-key="purificacao.faseInicial.subtitle">{texts.faseInicial.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 mt-1">
                            {/* Círculo Numerado com Elevação */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.35),0_6px_12px_rgba(0,0,0,0.25)] border-2 md:border-4 border-white relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                              <div className="absolute inset-0 bg-linear-to-r from-red-700 to-red-800"></div>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.25),transparent_50%)]"></div>
                                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.5)_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)]"></div>
                {/* Number */}
                <span className="text-xl md:text-2xl font-bold text-white relative z-10 drop-shadow-lg">1</span>
                            </div>
                            <ChevronDown 
                              className={`w-8 h-8 transition-transform duration-300 ${
                                expandedPhase === 1 ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      
                      {/* Conteúdo Expansível */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ${
                          expandedPhase === 1 ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <CardContent className="p-6 space-y-6 bg-red-50">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800" data-json-key="purificacao.faseInicial.objetivo.title">{texts.faseInicial.objetivo.title}</h3>
                            <p className="text-base text-gray-700 leading-relaxed" data-json-key="purificacao.faseInicial.objetivo.content">
                              {texts.faseInicial.objetivo.content}
                            </p>
                          </div>

                          <div className="bg-white border-l-4 border-red-600 p-5 rounded-r-lg shadow-md">
                            <h4 className="font-bold text-lg mb-3 text-red-700" data-json-key="purificacao.faseInicial.activities.title">{texts.faseInicial.activities.title}</h4>
                            <ul className="space-y-2 text-gray-700" data-json-key="purificacao.faseInicial.activities.items.map">
                              {texts.faseInicial.activities.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <span className="text-red-600 font-bold mt-1">•</span>
                                  <span data-json-key={`purificacao.faseInicial.activities.items[${index}]`}>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-bold text-lg mb-3 text-gray-800" data-json-key="purificacao.faseInicial.duration.title">{texts.faseInicial.duration.title}</h4>
                            <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseInicial.duration.content">
                              {texts.faseInicial.duration.content}
                            </p>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* FASE 2 - INTERMEDIÁRIA */}
              <div className="mb-8 relative">
                <div className="md:flex md:items-center gap-8">
                  
                  {/* Card da Fase */}
                  <div className="md:w-full">
                    <Card 
                      className={`shadow-xl border-2 border-blue-400 cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                        expandedPhase === 2 ? 'ring-4 ring-blue-300' : ''
                      }`}
                      onClick={() => togglePhase(2)}
                    >
                      <CardHeader className="bg-linear-to-r from-[#0891b2] via-[#06b6d4] to-[#0284c7] text-white py-4 px-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.35),transparent_55%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_60%,rgba(255,255,255,0.25),transparent_65%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.15)_60%,transparent_80%)]"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                              <LineChart className="w-8 h-8 text-cyan-600" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl md:text-3xl mb-1 drop-shadow-md" data-json-key="purificacao.faseIntermediaria.title">{texts.faseIntermediaria.title}</CardTitle>
                              <p className="text-base md:text-lg opacity-90 drop-shadow-sm" data-json-key="purificacao.faseIntermediaria.subtitle">{texts.faseIntermediaria.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 mt-1">
                            {/* Círculo Numerado com Elevação */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.35),0_6px_12px_rgba(0,0,0,0.25)] border-2 md:border-4 border-white relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                              <div className="absolute inset-0 bg-linear-to-r from-[#0891b2] via-[#06b6d4] to-[#0284c7]"></div>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.4),transparent_50%)]"></div>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)]"></div>
                              <span className="text-xl md:text-2xl font-bold text-white relative z-10 drop-shadow-lg">2</span>
                            </div>
                            <ChevronDown 
                              className={`w-8 h-8 transition-transform duration-300 ${
                                expandedPhase === 2 ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      
                      {/* Conteúdo Expansível */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ${
                          expandedPhase === 2 ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <CardContent className="p-6 space-y-6 bg-blue-50">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800" data-json-key="purificacao.faseIntermediaria.requisito.title">{texts.faseIntermediaria.requisito.title}</h3>
                            <p className="text-base text-gray-700 leading-relaxed" data-json-key="purificacao.faseIntermediaria.requisito.content">{texts.faseIntermediaria.requisito.content}</p>
                          </div>

                          <div className="bg-white border-l-4 border-[#4A90A9] p-5 rounded-r-lg shadow-md">
                            <h4 className="font-bold text-lg mb-3 text-[#4A90A9]" data-json-key="purificacao.faseIntermediaria.trabalhos.title">{texts.faseIntermediaria.trabalhos.title}</h4>
                            <div className="space-y-4" data-json-key="purificacao.faseIntermediaria.trabalhos.items.map">
                              {texts.faseIntermediaria.trabalhos.items.map((item, index) => (
                                <div key={index}>
                                  <h5 className="font-semibold text-base mb-2 text-gray-800" data-json-key={`purificacao.faseIntermediaria.trabalhos.items[${index}].title`}>{item.title}</h5>
                                  <p className="text-gray-700 text-sm" data-json-key={`purificacao.faseIntermediaria.trabalhos.items[${index}].content`}>{item.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-lg mb-3 text-gray-800" data-json-key="purificacao.faseIntermediaria.integracao.title">{texts.faseIntermediaria.integracao.title}</h4>
                            <p className="text-gray-700 leading-relaxed" data-json-key="purificacao.faseIntermediaria.integracao.content">{texts.faseIntermediaria.integracao.content}</p>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              {/* FASE 3 - FINAL */}
              <div className="relative">
                <div className="md:flex md:items-center gap-8">
                  
                  {/* Card da Fase */}
                  <div className="md:w-full">
                    <Card 
                      className={`shadow-xl border-2 border-amber-400 cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                        expandedPhase === 3 ? 'ring-4 ring-amber-300' : ''
                      }`}
                      onClick={() => togglePhase(3)}
                    >
                      <CardHeader className="bg-linear-to-r from-[#CFAF5A] via-[#B38938] to-[#CFAF5A] text-white py-4 px-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.35),transparent_55%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_60%,rgba(255,255,255,0.25),transparent_65%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.15)_60%,transparent_80%)]"></div>
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                              <Crown className="w-8 h-8 text-[#CFAF5A]" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl md:text-3xl mb-1 drop-shadow-md" data-json-key="purificacao.faseFinal.title">{texts.faseFinal.title}</CardTitle>
                              <p className="text-base md:text-lg opacity-90 drop-shadow-sm" data-json-key="purificacao.faseFinal.subtitle">{texts.faseFinal.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 mt-1">
                            {/* Círculo Numerado com Elevação */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.35),0_6px_12px_rgba(0,0,0,0.25)] border-2 md:border-4 border-white relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                              <div className="absolute inset-0 bg-linear-to-r from-[#CFAF5A] via-[#B38938] to-[#CFAF5A]"></div>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.3),transparent_50%)]"></div>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.25),transparent_50%)]"></div>
                              <span className="text-xl md:text-2xl font-bold text-white relative z-10 drop-shadow-lg">3</span>
                            </div>
                            <ChevronDown 
                              className={`w-8 h-8 transition-transform duration-300 ${
                                expandedPhase === 3 ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      
                      {/* Conteúdo Expansível */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ${
                          expandedPhase === 3 ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <CardContent className="p-6 space-y-6 bg-amber-50">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800" data-json-key="purificacao.faseFinal.iniciacao.title">{texts.faseFinal.iniciacao.title}</h3>
                            <p className="text-base text-gray-700 leading-relaxed" data-json-key="purificacao.faseFinal.iniciacao.content">{texts.faseFinal.iniciacao.content}</p>
                          </div>

                          <div className="bg-linear-to-r from-amber-100 to-yellow-100 border-2 border-[#CFAF5A] rounded-lg p-6 shadow-md">
                            <div className="flex items-center gap-4 mb-4">
                              <Sun className="w-10 h-10 text-[#CFAF5A]" />
                              <h4 className="font-bold text-xl text-[#CFAF5A]" data-json-key="purificacao.faseFinal.evento.title">{texts.faseFinal.evento.title ?? 'O Evento Iniciático'}</h4>
                            </div>
                            {texts.faseFinal.evento.content.map((para: string, i: number) => (
                              <p key={i} className={`text-gray-700 leading-relaxed ${i === 0 ? 'text-base mb-3' : 'text-sm'}`}>
                                {para}
                              </p>
                            ))}
                          </div>

                          <div>
                            <h4 className="font-bold text-lg mb-3 text-gray-800" data-json-key="purificacao.faseFinal.posIniciacao.title">{texts.faseFinal.posIniciacao.title}</h4>
                            <p className="text-gray-700 leading-relaxed mb-4" data-json-key="purificacao.faseFinal.posIniciacao.content">{texts.faseFinal.posIniciacao.content}</p>
                            <ul className="space-y-2 text-gray-700" data-json-key="purificacao.faseFinal.posIniciacao.items.map">
                              {texts.faseFinal.posIniciacao.items.map((it: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <span className="text-[#CFAF5A] font-bold mt-1">✦</span>
                                  <span className="text-sm">{it}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-md">
                            <h4 className="font-bold text-lg mb-3 text-blue-800" data-json-key="purificacao.faseFinal.adepto.title">{texts.faseFinal.adepto.title}</h4>
                            <p className="text-blue-900 leading-relaxed text-sm" data-json-key="purificacao.faseFinal.adepto.content">{texts.faseFinal.adepto.content}</p>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            {/* Fim do Container Visual */}
            </div>
          </div>
        </div>
      </section>

      {/* Trabalhos Espirituais com Psicodélicos */}
      <section className="py-16 bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="border-purple-300 shadow-2xl">
              <CardHeader className="bg-linear-to-r from-[#7C3AED] to-[#A855F7] text-white pt-4 pb-8 px-8 relative overflow-hidden">
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

                <div className="bg-linear-to-r from-purple-50 via-amber-50 to-purple-50 p-6 rounded-lg border-2 border-purple-300">
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
                    <Button size="lg" className="bg-linear-to-r from-purple-600 via-purple-500 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-xl text-lg px-8 py-6" data-json-key="purificacao.psicodelicos.ctaButton">
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
      <section className="py-16 bg-white">
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
      <section className="py-20 bg-linear-to-r from-[#CFAF5A] to-[#B38938] text-white">
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
