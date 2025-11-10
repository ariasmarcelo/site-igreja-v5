import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Microscope, Heart, HandHelping, ShieldCheck, BookOpen, FileText, Target, Triangle, Waves } from "lucide-react";
import defaultTexts from '@/locales/pt-BR/QuemSomos.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

export default function QuemSomos() {
  const stylesLoaded = usePageStyles('quemsomos');
  const texts = useLocaleTexts('quemsomos', defaultTexts);

  const principiosIcons = [
    <Sparkles className="h-8 w-8" />,
    <Microscope className="h-8 w-8" />,
    <Heart className="h-8 w-8" />,
    <HandHelping className="h-8 w-8" />,
    <ShieldCheck className="h-8 w-8" />,
    <FileText className="h-8 w-8" />
  ];

  // Cores simbólicas para cada Princípio Hermético
  const hermeticosCores = [
    { gradient: 'from-violet-500 to-purple-600', border: 'border-violet-500', badge: 'bg-violet-500' }, // 1. Mentalismo - Violeta (mente, consciência superior)
    { gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-500', badge: 'bg-blue-500' }, // 2. Correspondência - Azul (espelho, reflexão)
    { gradient: 'from-orange-500 to-amber-500', border: 'border-orange-500', badge: 'bg-orange-500' }, // 3. Vibração - Laranja (energia, movimento)
    { gradient: 'from-slate-700 to-slate-500', border: 'border-slate-600', badge: 'bg-slate-600' }, // 4. Polaridade - Cinza (dualidade, opostos)
    { gradient: 'from-teal-500 to-cyan-600', border: 'border-teal-500', badge: 'bg-teal-500' }, // 5. Ritmo - Turquesa (fluxo, ondas)
    { gradient: 'from-pink-500 to-rose-500', border: 'border-pink-500', badge: 'bg-pink-500' }, // 6. Gênero - Rosa/Pink (união, criação)
    { gradient: 'from-[#CFAF5A] to-[#B89B4A]', border: 'border-[#CFAF5A]', badge: 'bg-[#CFAF5A]' } // 7. Causa e Efeito - Dourado (karma, lei universal)
  ];
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50" style={{ opacity: stylesLoaded ? 1 : 0, transition: 'opacity 0.2s ease-in' }}>
      {/* Header with Animated Book Icon */}
      <section className="bg-linear-to-r from-[#4A90A9] to-[#5EA98D] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rounded-full animate-pulse delay-75"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full shadow-2xl animate-pulse">
              <BookOpen className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-center mb-4" data-json-key="quemsomos.header.title">{texts.header.title}</h1>
          <p className="text-xl text-center text-white/90 max-w-3xl mx-auto" data-json-key="quemsomos.header.subtitle">
            {texts.header.subtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Timeline - Histórico */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-json-key="quemsomos.historico.title">{texts.historico.title}</h2>
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-[#4A90A9] via-[#5EA98D] to-[#CFAF5A]"></div>
            
            <div className="space-y-1">
              {texts.historico.content.map((paragraph: string, index: number) => (
                <div key={index} className={`flex items-center gap-2 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Card className="inline-block max-w-lg shadow-lg hover:shadow-xl transition-shadow bg-white/95 backdrop-blur">
                      <CardContent className="p-6">
                        <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.historico.content[${index}]`}>{paragraph}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="shrink-0 w-6 h-6 bg-linear-to-r from-[#4A90A9] to-[#5EA98D] rounded-full border-4 border-white shadow-lg z-10 relative">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Princípios - Cards com Ícones */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-json-key="quemsomos.principios.title">{texts.principios.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-json-key="quemsomos.principios.subtitle">{texts.principios.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {texts.principios.items.map((item: { title: string; content: string }, index: number) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-[#5EA98D]">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-linear-to-r from-[#4A90A9] to-[#5EA98D] rounded-lg text-white group-hover:scale-110 transition-transform">
                      {principiosIcons[index]}
                    </div>
                    <CardTitle className="text-xl text-[#4A90A9]" data-json-key={`quemsomos.principios.items[${index}].title`}>{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.principios.items[${index}].content`}>{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Magia Divina - Destaque com Gradiente Dourado */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-[#CFAF5A]/10 to-[#B89B4A]/10 rounded-3xl blur-3xl"></div>
          <Card className="relative bg-linear-to-br from-[#CFAF5A] via-[#B89B4A] to-[#8B7635] text-white border-none shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Waves className="h-12 w-12" />
                </div>
                <CardTitle className="text-4xl text-center" data-json-key="quemsomos.magia.title">{texts.magia.title}</CardTitle>
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Target className="h-12 w-12" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {texts.magia.paragraphs.map((paragraph: string, index: number) => (
                <div key={index} className="pl-6 border-l-4 border-white/40">
                  <p className="text-lg leading-relaxed text-white/95" data-json-key={`quemsomos.magia.paragraphs[${index}]`}>{paragraph}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Princípios Herméticos - Layout Circular/Fluido */}
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Triangle className="w-14 h-14 text-[#4A7BA7] fill-white stroke-[3]" style={{ stroke: '#4A7BA7' }} />
              <h2 className="text-4xl font-bold text-gray-900" data-json-key="quemsomos.hermeticos.title">{texts.hermeticos.title}</h2>
              <Triangle className="w-14 h-14 text-[#B44C4C] fill-white stroke-[3] rotate-180" style={{ stroke: '#B44C4C' }} />
            </div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto" data-json-key="quemsomos.hermeticos.subtitle">{texts.hermeticos.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {texts.hermeticos.items.map((item: { number: string; title: string; description: string }, index: number) => (
              <div
                key={item.number}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-linear-to-r ${hermeticosCores[index].gradient} rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity`}></div>
                <div className={`relative flex gap-6 items-start p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-l-4 ${hermeticosCores[index].border} group-hover:border-[#CFAF5A]`}>
                  <div className="shrink-0">
                    <div className="relative">
                      <div className={`w-16 h-16 bg-linear-to-br ${hermeticosCores[index].gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl font-bold text-white">{item.number}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#4A90A9] transition-colors" data-json-key={`quemsomos.hermeticos.items[${index}].title`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed" data-json-key={`quemsomos.hermeticos.items[${index}].description`}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
