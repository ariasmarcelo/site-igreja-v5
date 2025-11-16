import { usePageContent } from '@/hooks/useContent';
import { SharedFooter } from '@/components/SharedFooter';
import { FooterBackground } from '@/components/FooterBackground';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Star, Sun } from 'lucide-react';
import { PageLoading, PageError } from '@/components/PageLoading';
import '@/styles/waves.css';

// Adicionar keyframe para batimento cardíaco
const heartbeatStyle = `
  @keyframes heartbeat {
    0%, 100% { transform: scale(0.95); }
    50% { transform: scale(1.25); }
  }
`;

interface Testimonial {
  name: string;
  date: string;
  content: string;
}

interface TestemunhosTexts {
  header?: { title: string; subtitle: string };
  intro?: { description: string };
  testimonials?: Testimonial[];
  disclaimer?: { title: string; content: string };
  cta?: { title: string; subtitle: string; buttonText: string };
  footer?: { copyright: string; trademark: string };
}

const Testemunhos = () => {
  const { data: texts, loading, error } = usePageContent<TestemunhosTexts>('testemunhos');

  if (loading) {
    return (
      <PageLoading
        icon={Heart}
        text="Carregando testemunhos..."
        bgColor="bg-gradient-to-b from-rose-50 to-pink-100"
        iconColor="text-rose-600"
        textColor="text-rose-900"
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
  
  if (!texts) return null;

  const testimonials = texts.testimonials || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heartbeatStyle }} />
      <div className="min-h-screen bg-linear-to-b from-rose-50 via-sky-100 to-sky-300">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-pink-400">
        {/* Animated Metallic Gold Background Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-yellow-300/60 rounded-full blur-3xl animate-pulse orb-1" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-amber-400/50 rounded-full blur-3xl animate-pulse orb-2" />
          <div className="absolute bottom-20 left-[20%] w-[400px] h-[400px] bg-yellow-400/55 rounded-full blur-3xl animate-pulse orb-3" />
          <div className="absolute top-60 right-[30%] w-80 h-80 bg-amber-300/45 rounded-full blur-3xl animate-pulse orb-4" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Main Heart Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-white/20 overflow-visible">
                <Heart className="h-18 w-18 text-yellow-400/60 fill-red-500 stroke-[2.5] animate-[heartbeat_3s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              {texts.header?.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/95 opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              {texts.header?.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-3 max-w-6xl">
        
        {/* Intro Card */}
        <div className="max-w-3xl mx-auto bg-linear-to-br from-white/80 via-rose-50/80 to-pink-50/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-rose-200/60 shadow-xl shadow-rose-200/30">
          <p className="text-lg text-rose-950/85 leading-relaxed">
            {texts.intro?.description}
          </p>
        </div>
      </div>

      {/* Testimonials Grid - 2 COLUMNS */}
      <section className="pb-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial: Testimonial, index: number) => (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="h-full bg-linear-to-br from-white/90 via-rose-50/80 to-pink-50/70 backdrop-blur-md rounded-2xl p-8 border border-rose-200/50 hover:border-rose-300/70 shadow-xl hover:shadow-2xl hover:shadow-rose-300/40 transition-all duration-500">
                    
                    {/* Star Icon */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-rose-400/30 to-pink-400/30 border border-rose-300/50 flex items-center justify-center group-hover:from-rose-400/40 group-hover:to-pink-400/40 transition-all">
                        <Star className="w-5 h-5 text-rose-600 fill-amber-400/70" />
                      </div>
                      
                      {/* Name & Date */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h3 className="text-xl font-semibold text-rose-900">
                            {testimonial.name}
                          </h3>
                          <span className="text-sm text-rose-700/70">{testimonial.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-rose-950/80 leading-relaxed">
                      {testimonial.content}
                    </p>

                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-rose-300/0 via-pink-200/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-white/80 via-rose-50/70 to-pink-50/60 backdrop-blur-md rounded-2xl p-8 border border-rose-200/60 shadow-lg shadow-rose-200/20">
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-rose-500 shrink-0 mt-1 fill-rose-400/50" />
                <div>
                  <h3 className="text-xl font-semibold text-rose-900 mb-3">
                    {texts.disclaimer?.title}
                  </h3>
                  <p className="text-rose-950/80 leading-relaxed">
                    {texts.disclaimer?.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - Céu-Terra-Água */}
      <section className="relative overflow-hidden mt-16">
        {/* Fundo com transição céu-água */}
        <FooterBackground gradientId="skyGradientTestemunhos" />

        {/* Sol Dourado - posicionado absolutamente no canto superior esquerdo */}
        <div className="absolute top-4 left-8 w-20 h-20 z-10 drop-shadow-lg">
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

        {/* Heart Icon - posicionado no canto superior direito */}
        <div className="absolute top-4 right-8 z-20">
          <Heart className="w-14 h-14 text-[#CFAF5A] fill-rose-300/80 stroke-[2.5] drop-shadow-lg" />
        </div>

        {/* CTA Content - posicionado no céu */}
        <div className="container mx-auto px-4 relative z-50 pt-6 pb-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-strong" data-json-key="testemunhos.cta.title">
              {texts.cta?.title}
            </h2>
            <p className="text-lg mb-5 text-white text-shadow-medium" data-json-key="testemunhos.cta.subtitle">
              {texts.cta?.subtitle}
            </p>
            <Link to="/contato">
              <Button className="bg-[#CFAF5A] text-white font-semibold px-6 py-4 text-base rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105" data-json-key="testemunhos.cta.buttonText">
                {texts.cta?.buttonText}
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
    </>
  );
};

export default Testemunhos;
