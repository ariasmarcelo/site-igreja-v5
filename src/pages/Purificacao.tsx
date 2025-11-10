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
      <section className="py-16 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        {/* Efeitos de fundo místicos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-80 h-80 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-20 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Container Visual para as Três Fases - Elevado */}
            <div className="bg-linear-to-br from-white/90 via-amber-50/85 to-white/90 backdrop-blur-2xl p-8 pr-16 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-white/30 relative transform hover:scale-[1.01] transition-transform duration-500"
                 style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
              
              {/* Título da Seção - Elevado e Luminoso */}
              <div className="text-center mb-10 relative">
                {/* Glow de fundo sutil */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-[500px] h-40 bg-linear-to-r from-transparent via-amber-400/10 to-transparent blur-3xl"></div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-light bg-linear-to-r from-amber-700 via-amber-500 to-amber-700 bg-clip-text text-transparent relative z-10" 
                    style={{ 
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.08em',
                      textShadow: '0 2px 4px rgba(180,83,9,0.2)',
                      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15)) drop-shadow(0 4px 6px rgba(251,191,36,0.2))'
                    }}>
                  AS TRÊS FASES DO PROCESSO
                </h2>
                
                {/* Linha decorativa elegante */}
                <div className="flex items-center justify-center gap-3 mt-5">
                  <div className="h-px w-20 bg-linear-to-r from-transparent via-amber-400 to-amber-500"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-md shadow-amber-500/40"></div>
                  <div className="h-px w-20 bg-linear-to-l from-transparent via-amber-400 to-amber-500"></div>
                </div>
              </div>
              
              {/* Linha do Tempo Vertical com Conexões */}
              <div className="relative pr-8">
              
              {/* Linha Vertical bem à Direita */}
              <div className="absolute right-2 top-0 bottom-0 w-2 bg-linear-to-b from-red-500 via-cyan-500 to-amber-500 hidden md:block rounded-full shadow-lg"></div>

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
                            <ul className="space-y-2 text-gray-700">
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
                            <div className="space-y-4">
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
                            <ul className="space-y-2 text-gray-700">
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
      <section className="py-16 bg-linear-to-br from-purple-900 via-indigo-900 to-purple-950 relative overflow-hidden">
        {/* Efeitos de fundo místicos */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-2 border-purple-300/30 shadow-2xl">
              <CardHeader className="bg-linear-to-br from-purple-600/40 via-fuchsia-500/40 to-indigo-600/40 backdrop-blur-sm text-white pt-6 pb-6 px-8 relative overflow-hidden border-b-2 border-purple-300/30">
                {/* Padrões geométricos sagrados */}
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
                  <div className="inline-block mb-2" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                    <InfinityIcon className="w-24 h-24 mx-auto drop-shadow-2xl filter brightness-125" />
                  </div>
                  <CardTitle className="text-4xl md:text-5xl font-semibold mb-3 drop-shadow-lg" 
                    style={{ 
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.02em',
                      textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(167,139,250,0.4)'
                    }}
                    data-json-key="purificacao.psicodelicos.title">
                    {texts.psicodelicos.title}
                  </CardTitle>
                  <p className="text-xl font-light italic opacity-95 drop-shadow-md pb-2" 
                    style={{ letterSpacing: '0.05em' }}
                    data-json-key="purificacao.psicodelicos.subtitle">
                    {texts.psicodelicos.subtitle}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-10 bg-linear-to-br from-white/95 via-purple-50/90 to-white/95 backdrop-blur-sm">

                <div className="space-y-6 leading-relaxed mb-8" data-json-key="purificacao.psicodelicos.intro">
                  <p className="text-center text-lg text-gray-800 font-light" style={{ letterSpacing: '0.01em' }} data-json-key="purificacao.psicodelicos.intro" dangerouslySetInnerHTML={{ __html: texts.psicodelicos.intro }} />
                </div>

                <div className="bg-linear-to-br from-purple-100/80 via-fuchsia-50/70 to-indigo-100/80 p-8 rounded-2xl border-2 border-purple-300/50 shadow-xl backdrop-blur-sm relative overflow-hidden">
                  {/* Efeito de brilho de fundo */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.15),transparent_70%)]"></div>
                  
                  <h3 className="font-semibold text-2xl text-purple-900 mb-8 text-center relative z-10" style={{ letterSpacing: '0.03em' }} data-json-key="purificacao.psicodelicos.tripleProtection.title">{texts.psicodelicos.tripleProtection.title}</h3>
                  
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

                <div className="space-y-4 mt-10">
                  <h3 className="font-semibold text-2xl text-purple-900 text-center mb-6" style={{ letterSpacing: '0.02em' }} data-json-key="purificacao.psicodelicos.applications.title">{texts.psicodelicos.applications.title}</h3>
                  <ul className="space-y-4 max-w-3xl mx-auto">
                    {texts.psicodelicos.applications.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-md">
                        <span className="text-purple-600 mt-1 text-xl font-bold flex-shrink-0">✦</span>
                        <span className="text-gray-800 leading-relaxed" data-json-key={`purificacao.psicodelicos.applications.items[${idx}]`} dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-linear-to-br from-amber-100/80 via-yellow-50/70 to-amber-100/80 p-8 rounded-2xl border-2 border-amber-300/60 mt-10 shadow-xl backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_70%)]"></div>
                  <p className="text-center font-semibold text-amber-900 mb-4 text-xl relative z-10" style={{ letterSpacing: '0.02em' }} data-json-key="purificacao.psicodelicos.conclusion.title">
                    {texts.psicodelicos.conclusion.title}
                  </p>
                  <p className="text-center text-gray-800 leading-relaxed relative z-10" data-json-key="purificacao.psicodelicos.conclusion.content">
                    {texts.psicodelicos.conclusion.content}
                  </p>
                </div>

                <div className="text-center mt-10">
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

      {/* Critérios e Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#222222]" data-json-key="purificacao.valores.title">{texts.valores.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
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
