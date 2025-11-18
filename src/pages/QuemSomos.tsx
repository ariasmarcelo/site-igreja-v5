import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Microscope, Heart, HandHelping, ShieldCheck, BookOpen, FileText, Target, Waves } from "lucide-react";
import { Pentagram, Cuboctahedron } from "@/components/icons";
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
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg" data-json-key="quemsomos.header.title">{texts.header?.title || 'Quem Somos'}</h1>
            <p className="text-xl opacity-90 drop-shadow-md" data-json-key="quemsomos.header.subtitle">{texts.header?.subtitle || 'Nossa História e Valores'}</p>
          </div>
        </div>
      </section>

      {/* Valores e Princípios - Estilo Accordion (movido de Purificação) - LARGURA TOTAL */}
      <section className="bg-linear-to-br from-indigo-300 via-purple-200 to-violet-300 shadow-xl py-16 px-4 md:px-8 border-y border-indigo-400 relative overflow-hidden min-h-screen">
          {/* Fundo com brilho irradiante em 12 direções - ancorado no topo */}
          <div className="absolute inset-0 cuboctahedron-radial-glow-fullheight pointer-events-none opacity-80 z-20" />
          
          {/* Cuboctahedron - ancorado no topo */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30">
            <Cuboctahedron size={200} className="text-indigo-600" strokeWidth={6} />
          </div>
          
          {/* Container principal agrupando título, texto introdutório e cards */}
          <div className="max-w-5xl mx-auto pt-[250px] relative z-30 isolate">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl border-3 border-purple-300/60 p-8 md:p-12">
              {/* Efeito de brilho nas bordas da caixa principal */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-purple-300/30 via-transparent to-indigo-300/30 pointer-events-none"></div>
              
              <div className="text-center mb-12 relative z-30">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" data-json-key="quemsomos.valores.title">
                  {(texts as any)?.valores?.title || 'Valores e Princípios'}
                </h2>
                
                {/* Pergaminho com texto introdutório */}
            {(texts as any)?.valores?.intro && (
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
                  <p className="relative text-base md:text-lg text-amber-900/90 leading-relaxed text-center font-serif drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]" 
                     data-json-key="quemsomos.valores.intro">
                    {(texts as any).valores.intro}
                  </p>                      {/* Sombra interna para profundidade */}
                      <div className="absolute inset-0 rounded-lg shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] pointer-events-none"></div>
                    </div>
                    
                    {/* Sombra externa do pergaminho */}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-amber-900/5 to-amber-900/10 rounded-lg translate-y-1 -z-10"></div>
                  </div>
                )}
              </div>
              
              {/* Container agrupador dos cards em estilo pedra */}
              <div className="relative z-20">
                {!(texts as any)?.valores?.cards && (
                  <div className="text-center p-8 bg-red-100 border-2 border-red-400 rounded-xl">
                    <p className="text-red-800 font-bold">⚠️ DADOS NÃO ENCONTRADOS</p>
                    <p className="text-red-600 text-sm mt-2">Execute o SQL: workspace/scripts/restore-valores-data.sql no Supabase</p>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6 relative z-20">
                {(texts as any)?.valores?.cards && Array.isArray((texts as any).valores.cards) && (
                  (texts as any).valores.cards.map((card: { title: string; content: string }, idx: number) => {
                    return (
                    <div 
                      key={idx}
                      className="relative group"
                    >
                      {/* Card de pedra */}
                      <div className="relative bg-linear-to-br from-gray-300 via-gray-200 to-gray-400 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.2)] border-2 border-gray-400/50 p-6 md:p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-4px_8px_rgba(0,0,0,0.25)] isolate">
                        {/* Textura de pedra */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNSIgLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] opacity-60 rounded-xl pointer-events-none mix-blend-overlay"></div>
                        
                        {/* Conteúdo com número integrado */}
                        <div className="relative z-30 flex gap-4">
                          {/* Número gravado na pedra */}
                          <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-gray-400 via-gray-300 to-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center border border-gray-500/30">
                            <span className="text-2xl font-bold text-gray-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{idx + 1}</span>
                          </div>
                          
                          {/* Textos */}
                          <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]"
                                data-json-key={`quemsomos.valores.cards[${idx}].title`}>
                              {card.title}
                            </h3>
                            <p className="text-base text-gray-700 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" 
                               data-json-key={`quemsomos.valores.cards[${idx}].content`}>
                              {card.content}
                            </p>
                          </div>
                        </div>
                        
                        {/* Brilho na borda superior (luz ambiente) */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-white/20 to-transparent rounded-t-xl pointer-events-none"></div>
                        
                        {/* Sombra na borda inferior (profundidade) */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-linear-to-t from-black/20 to-transparent rounded-b-xl pointer-events-none"></div>
                      </div>
                    </div>
                  );
                  })
                )}
                </div>
              </div>
            </div>
          </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20 max-w-6xl relative">
        
        {/* Os Pilares da Instituição - Valores e Princípios Unificados */}
        {texts.principios?.items && Array.isArray(texts.principios.items) && texts.principios.items.length > 0 && (
        <section className="bg-linear-to-br from-violet-50 via-purple-50 to-violet-100 rounded-2xl shadow-xl p-8 md:p-12 border border-violet-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4" data-json-key="quemsomos.pilares.title">{texts.pilares?.title || 'Os Pilares da Instituição'}</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8" data-json-key="quemsomos.pilares.description">
              {texts.pilares?.description || 'Nossa instituição se fundamenta em valores éticos e princípios operacionais que guiam todas as nossas ações, criando uma base sólida para nosso trabalho de transformação espiritual e desenvolvimento humano.'}
            </p>
          </div>
          
          {/* Grid de Cards com Valores e Princípios */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {texts.principios.items.map((item: { title: string; content: string; tipo?: string }, index: number) => {
              const tipo = item.tipo || 'principio'; // fallback para 'principio' se não especificado
              const badgeClass = tipo === 'valor' ? 'badge-valor' : 'badge-principio';
              const badgeText = tipo === 'valor' ? 'Valor' : 'Princípio';
              
              return (
                <Card key={index} className="border-t-4 border-t-violet-600 pilar-card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className={badgeClass}>{badgeText}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-11 h-11 rounded-full bg-linear-to-br from-violet-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-md text-white relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_50%,transparent_70%)]"></div>
                        {PRINCIPIOS_ICONS[index % PRINCIPIOS_ICONS.length]}
                      </div>
                      <CardTitle className="text-lg text-gray-800" data-json-key={`quemsomos.principios.items[${index}].title`}>{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed text-sm" data-json-key={`quemsomos.principios.items[${index}].content`}>{item.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        )}

        {/* Histórico - Design Limpo com Elevação */}
        {texts.historico?.content && Array.isArray(texts.historico.content) && texts.historico.content.length > 0 && (
        <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center" data-json-key="quemsomos.historico.title">{texts.historico?.title || 'Histórico'}</h2>
          <div className="space-y-6">
            {texts.historico.content.map((paragraph: string, index: number) => (
              <div key={index} className="bg-linear-to-r from-gray-50 to-white p-6 rounded-lg border-l-4 border-[#5EA98D] shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.historico.content[${index}]`}>{paragraph}</p>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Princípios Herméticos - Estilo Papiro */}
        {texts.hermeticos?.items && Array.isArray(texts.hermeticos.items) && texts.hermeticos.items.length > 0 && (
        <section className="relative papiro-box p-12 rounded-lg border-4 border-amber-900/20 shadow-2xl bg-linear-to-br from-[#FAF9F7] via-[#F5F3F0] to-[#FAF9F7]">
                
                {/* Textura de papiro */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none papiro-texture"></div>
                
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
                  {/* Cuboctahedron e ícones acima do título */}
                  <div className="flex justify-center mb-6 relative">
                    {/* Fundo com brilho irradiante em 12 direções */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6000px] h-[6000px] cuboctahedron-radial-glow pointer-events-none" />
                    <Cuboctahedron size={200} className="text-indigo-600 relative z-10" strokeWidth={9} />
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="relative w-[66px] h-[66px] rounded-full bg-linear-to-br from-gray-200 via-gray-50 to-gray-300 shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center border border-gray-400/30">
                      <Pentagram size={66} className="text-blue-600 shield-blue-icon drop-shadow-md" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl font-bold text-center text-amber-950 font-serif" data-json-key="quemsomos.hermeticos.title">
                      {texts.hermeticos?.title || 'Os Sete Princípios Herméticos'}
                    </h2>
                    <div className="relative w-[66px] h-[66px] rounded-full bg-linear-to-br from-purple-700 via-purple-900 to-indigo-950 shadow-[0_12px_24px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(147,51,234,0.3),inset_0_-2px_8px_rgba(0,0,0,0.6)] flex items-center justify-center border border-purple-950/60">
                      <Pentagram size={66} className="text-red-600 shield-red-icon scale-y-[-1] drop-shadow-md" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  {/* Parágrafo introdutório */}
                  {texts.hermeticos?.subtitle && (
                  <div className="mb-12 max-w-4xl mx-auto">
                    <p className="text-lg text-amber-900 leading-relaxed text-center font-serif italic" data-json-key="quemsomos.hermeticos.subtitle">
                      {texts.hermeticos.subtitle}
                    </p>
                  </div>
                  )}
                  
                  {/* Cards dos 7 princípios */}
                  <div className="space-y-6">
                    {texts.hermeticos?.items && Array.isArray(texts.hermeticos.items) && texts.hermeticos.items.map((item: { number: string; title: string; quote?: string; description: string }, index: number) => (
                      <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border border-amber-200/40">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-2xl text-amber-900">
                            <span className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                              {item.number}
                            </span>
                            <span data-json-key={`quemsomos.hermeticos.items[${index}].title`}>{item.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {item.quote && (
                            <div className="pl-4 border-l-4 border-amber-500 italic text-amber-800 text-base mb-4" data-json-key={`quemsomos.hermeticos.items[${index}].quote`}>
                              "{item.quote}"
                            </div>
                          )}
                          <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.hermeticos.items[${index}].description`}>{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
        </section>
        )}
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
              {texts.cta?.title || 'Comece Sua Jornada'}
            </h2>
            <p className="text-lg mb-5 text-white text-shadow-medium whitespace-pre-line" data-json-key="quemsomos.cta.subtitle">
              {texts.cta?.subtitle || 'Entre em contato conosco'}
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
