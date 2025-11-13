import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Heart, Wind, Route, Flower2, Sparkles, AlertTriangle, Users, Infinity as InfinityIcon, Activity, Stethoscope, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

interface TratamentosTexts {
  header: { title: string; subtitle: string };
  intro: { p1: string; p2: string };
  legal: { title: string; notice: string };
  treatments: any[];
  [key: string]: any;
}

export default function Tratamentos() {
  usePageStyles('tratamentos');
  const { texts, loading, error } = useLocaleTexts<TratamentosTexts>('tratamentos');
  
  if (loading || !texts) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;

  const icons = [
    <Users className="w-12 h-12" />,
    <Brain className="w-12 h-12" />,
    <Wind className="w-12 h-12" />,
    <Route className="w-12 h-12" />,
    <Heart className="w-12 h-12" />,
    <Flower2 className="w-12 h-12" />,
    <InfinityIcon className="w-12 h-12" />,
    <Sparkles className="w-12 h-12" />
  ];

  const treatments = texts.treatments;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-blue-50">
      {/* Header - Altura padrão */}
      <section className="py-20 bg-linear-to-r from-cyan-600 via-blue-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,white,transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Stethoscope className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg" data-json-key="tratamentos.header.title">{texts.header.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-md" data-json-key="tratamentos.header.subtitle">{texts.header.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-3 pb-16 space-y-6 max-w-6xl">
        
        {/* Aviso Legal - Card Elevado */}
        <div className="bg-amber-50 rounded-2xl shadow-lg p-5 border-l-4 border-amber-500">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2" data-json-key="tratamentos.legal.title">{texts.legal.title}</h3>
              <p className="text-amber-800 text-sm leading-relaxed" data-json-key="tratamentos.legal.notice">{texts.legal.notice}</p>
            </div>
          </div>
        </div>

        {/* Introdução - Destaque Premium */}
        <div className="relative bg-linear-to-br from-blue-50 via-cyan-50/90 to-teal-50/80 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-200/60 overflow-hidden">
          {/* Efeitos decorativos de fundo */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-cyan-300 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200 rounded-full blur-3xl"></div>
          </div>
          
          {/* Padrão de linhas sutis */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, #0891b2 0px, transparent 1px, transparent 20px),
                             repeating-linear-gradient(90deg, #0891b2 0px, transparent 1px, transparent 20px)`
          }}></div>
          
          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 relative z-10 drop-shadow-sm">
            Introdução
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-5 relative z-10">
            {/* Primeiro parágrafo com destaque */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-blue-100/50">
              <div className="flex gap-4">
                <div className="shrink-0 pt-1">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium" data-json-key="tratamentos.intro.p1">{texts.intro.p1}</p>
              </div>
            </div>
            
            {/* Segundo parágrafo com destaque */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-cyan-100/50">
              <div className="flex gap-4">
                <div className="shrink-0 pt-1">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium" data-json-key="tratamentos.intro.p2">{texts.intro.p2}</p>
              </div>
            </div>
          </div>
          
          {/* Linha decorativa inferior */}
          <div className="relative z-10 mt-6 flex justify-center">
            <div className="h-1 w-32 bg-linear-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Tratamentos - Accordion em Box Agrupado */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-200">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-slate-800 drop-shadow-sm">Modalidades Terapêuticas</h2>
          
          <Accordion type="multiple" className="max-w-5xl mx-auto space-y-4">
            {treatments.map((treatment, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-slate-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden"
              >
                <AccordionTrigger 
                  className="px-6 py-5 hover:no-underline relative [&>svg]:h-10 [&>svg]:w-10 [&>svg]:text-slate-700 [&>svg]:relative [&>svg]:z-20"
                  style={{
                    background: `linear-gradient(to right, ${treatment.color.split(' ')[0].replace('from-[', '').replace(']', '')}, ${treatment.color.split(' ')[1].replace('to-[', '').replace(']', '')})`
                  }}
                >
                  <div className="absolute inset-0 bg-white/75"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.3),transparent_60%)]"></div>
                  
                  <div className="flex items-center gap-4 w-full relative z-10">
                    <div className="shrink-0 text-slate-700 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
                      {icons[index]}
                    </div>
                    <div className="flex-1 text-left pr-4">
                      <div className="text-xl md:text-2xl font-semibold text-slate-800 mb-1" data-json-key={`tratamentos.treatments[${index}].title`}>
                        {treatment.title.includes('(supervisão geral integrada)') 
                          ? <>
                              {treatment.title.split('(')[0]}
                              <span className="text-base md:text-lg italic block md:inline">({treatment.title.split('(')[1]}</span>
                            </>
                          : treatment.title
                        }
                      </div>
                      <div className="text-slate-700 text-sm md:text-base" data-json-key={`tratamentos.treatments[${index}].description`}>
                        {treatment.description}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6 pt-4 bg-linear-to-br from-white to-slate-50">
                  <div className="space-y-4">
                    {/* Sobre o Tratamento */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400 shadow-sm">
                      <h4 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span data-json-key="tratamentos.labels.about">{texts.labels.about}</span>
                      </h4>
                      <p className="text-slate-700 text-sm leading-relaxed" data-json-key={`tratamentos.treatments[${index}].details`}>{treatment.details}</p>
                    </div>

                    {/* Indicações */}
                    {treatment.indications && (
                      <div className="bg-teal-50 rounded-lg p-4 border-l-4 border-teal-400">
                        <h4 className="text-sm font-semibold text-teal-900 mb-2" data-json-key="tratamentos.labels.indications">{texts.labels.indications}</h4>
                        <p className="text-teal-800 text-sm leading-relaxed" data-json-key={`tratamentos.treatments[${index}].indications`}>{treatment.indications}</p>
                      </div>
                    )}

                    {/* Benefícios */}
                    {treatment.benefits && (
                      <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-400">
                        <h4 className="text-sm font-semibold text-emerald-900 mb-2" data-json-key="tratamentos.labels.benefits">{texts.labels.benefits}</h4>
                        <p className="text-emerald-800 text-sm leading-relaxed" data-json-key={`tratamentos.treatments[${index}].benefits`}>{treatment.benefits}</p>
                      </div>
                    )}

                    {/* Contraindicações */}
                    {treatment.contraindications && (
                      <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                        <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span data-json-key="tratamentos.labels.contraindications">{texts.labels.contraindications}</span>
                        </h4>
                        <p className="text-red-800 text-sm leading-relaxed" data-json-key={`tratamentos.treatments[${index}].contraindications`}>{treatment.contraindications}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-3">
                      {/* Duração */}
                      {treatment.duration && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-900 mb-1" data-json-key="tratamentos.labels.duration">{texts.labels.duration}</h4>
                          <p className="text-blue-800 text-xs" data-json-key={`tratamentos.treatments[${index}].duration`}>{treatment.duration}</p>
                        </div>
                      )}

                      {/* Profissional */}
                      {treatment.professional && (
                        <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                          <h4 className="text-xs font-semibold text-cyan-900 mb-1" data-json-key="tratamentos.labels.professional">{texts.labels.professional}</h4>
                          <p className="text-cyan-800 text-xs" data-json-key={`tratamentos.treatments[${index}].professional`}>{treatment.professional}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Footer CTA Section com fundo céu, terra e água */}
      <section className="relative overflow-hidden mt-16">
        {/* Fundo com transição céu-terra-água */}
        <div className="absolute inset-0 z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente do céu - AZUL vibrante */}
              <linearGradient id="skyGradientTratamentos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9"/>
                <stop offset="50%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#7dd3fc"/>
              </linearGradient>
              
              {/* Gradiente da terra - marrom escuro */}
              <linearGradient id="earthGradientTratamentos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78716c"/>
                <stop offset="100%" stopColor="#44403c"/>
              </linearGradient>
              
              {/* Efeitos metálicos difusos */}
              <radialGradient id="glow1Tratamentos">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow2Tratamentos">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="glow3Tratamentos">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* CÉU AZUL - com curvatura positiva na parte inferior */}
            <path 
              d="M0,0 L1200,0 L1200,260 Q600,180 0,260 Z" 
              fill="url(#skyGradientTratamentos)"
            />
            
            {/* Círculos de luz metálica difusa espalhados */}
            <circle cx="150" cy="30" r="80" fill="url(#glow1Tratamentos)" opacity="0.4"/>
            <circle cx="280" cy="50" r="60" fill="url(#glow3Tratamentos)" opacity="0.35"/>
            <circle cx="420" cy="25" r="90" fill="url(#glow2Tratamentos)" opacity="0.45"/>
            <circle cx="550" cy="45" r="70" fill="url(#glow1Tratamentos)" opacity="0.4"/>
            <circle cx="680" cy="35" r="85" fill="url(#glow3Tratamentos)" opacity="0.38"/>
            <circle cx="820" cy="55" r="65" fill="url(#glow2Tratamentos)" opacity="0.42"/>
            <circle cx="950" cy="40" r="75" fill="url(#glow1Tratamentos)" opacity="0.37"/>
            <circle cx="1080" cy="30" r="70" fill="url(#glow3Tratamentos)" opacity="0.4"/>
            
            {/* Segunda camada de brilhos menores */}
            <circle cx="200" cy="70" r="50" fill="url(#glow2Tratamentos)" opacity="0.3"/>
            <circle cx="360" cy="80" r="45" fill="url(#glow1Tratamentos)" opacity="0.28"/>
            <circle cx="500" cy="90" r="55" fill="url(#glow3Tratamentos)" opacity="0.32"/>
            <circle cx="640" cy="75" r="48" fill="url(#glow2Tratamentos)" opacity="0.3"/>
            <circle cx="780" cy="85" r="52" fill="url(#glow1Tratamentos)" opacity="0.29"/>
            <circle cx="920" cy="95" r="47" fill="url(#glow3Tratamentos)" opacity="0.31"/>
            <circle cx="1060" cy="80" r="50" fill="url(#glow2Tratamentos)" opacity="0.28"/>
            
            {/* Terceira camada - brilhos muito sutis */}
            <circle cx="100" cy="60" r="35" fill="url(#glow3Tratamentos)" opacity="0.25"/>
            <circle cx="320" cy="110" r="40" fill="url(#glow1Tratamentos)" opacity="0.22"/>
            <circle cx="480" cy="65" r="38" fill="url(#glow2Tratamentos)" opacity="0.24"/>
            <circle cx="720" cy="105" r="42" fill="url(#glow3Tratamentos)" opacity="0.23"/>
            <circle cx="880" cy="70" r="36" fill="url(#glow1Tratamentos)" opacity="0.25"/>
            <circle cx="1020" cy="100" r="39" fill="url(#glow2Tratamentos)" opacity="0.22"/>
            
            {/* TERRA - com curvatura positiva na parte superior */}
            <path 
              d="M0,260 Q600,180 1200,260 L1200,400 L0,400 Z" 
              fill="url(#earthGradientTratamentos)"
            />
            
            {/* LINHA DO HORIZONTE - curvatura mais pronunciada */}
            <path 
              d="M0,260 Q600,180 1200,260" 
              stroke="#d6d3d1" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.6"
            />
            
            {/* ÁGUA - camadas animadas verde-água mais escuras com curvatura acentuada */}
            <path 
              className="animate-[wave_3s_ease-in-out_infinite]" 
              d="M0,340 Q600,280 1200,340 L1200,400 L0,400 Z" 
              fill="#0d9488" 
              opacity="0.4"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_0.5s]" 
              d="M0,360 Q600,300 1200,360 L1200,400 L0,400 Z" 
              fill="#0f766e" 
              opacity="0.35"
            />
            <path 
              className="animate-[wave_3s_ease-in-out_infinite_1s]" 
              d="M0,380 Q600,320 1200,380 L1200,400 L0,400 Z" 
              fill="#115e59" 
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Activity Icon - posicionado absolutamente no canto superior esquerdo */}
        <div className="absolute top-8 left-8 z-10">
          <Activity className="w-32 h-32 text-[#CFAF5A] stroke-[1.5]" />
        </div>

        {/* Waves Icon - posicionado no canto superior direito */}
        <div className="absolute top-8 right-8 z-20">
          <Waves className="w-32 h-32 text-[#CFAF5A] stroke-[1.5]" />
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-10 pt-12 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-json-key="tratamentos.cta.title">
              {texts.cta.title}
            </h2>
            <p className="text-xl mb-8 text-white drop-shadow-md" data-json-key="tratamentos.cta.subtitle">
              {texts.cta.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" data-json-key="tratamentos.cta.buttonText">
                {texts.cta.buttonText}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Content - Copyright */}
        <div className="relative z-10 pt-8 pb-4 text-white">
          <div className="container mx-auto px-4">
            <div className="border-t border-emerald-700/50 mt-32 pt-4 pb-1 text-center text-emerald-100/70 text-sm max-w-4xl mx-auto">
              <p>© 2025 Igreja de Metatron. Todos os direitos reservados.</p>
              <p className="mt-2">Marcas registradas protegidas por lei.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
