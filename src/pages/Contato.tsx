import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, MessageCircle, ShieldCheck, Phone } from 'lucide-react';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

interface ContatoTexts {
  header: { title: string; subtitle: string };
  whatsapp: { title: string; description: string; button: string };
  [key: string]: any;
}

export default function Contato() {
  usePageStyles('contato');
  const { texts } = useLocaleTexts<ContatoTexts>('contato');
  const handleWhatsAppClick = () => {
    const phoneNumber = '5511949555555';
    const message = encodeURIComponent('Olá! Quero saber mais sobre *O Trabalho de Resgate*!');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (!texts) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 via-emerald-50 to-cyan-50">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-linear-to-r from-teal-600 via-emerald-600 to-teal-600">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Mail Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 mb-8">
              <Mail className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" data-json-key="contato.header.title">
              {texts.header.title}
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md" data-json-key="contato.header.subtitle">
              {texts.header.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Sobre a Avaliação Inicial */}
            <div className="bg-linear-to-br from-white via-amber-50/30 to-yellow-50/20 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-amber-200/60 shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-amber-400/30 to-yellow-400/30 border border-amber-300/50 mb-4">
                  <Clock className="w-7 h-7 text-amber-700" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3" data-json-key="contato.initialAssessment.title">
                  {texts.initialAssessment.title}
                </h2>
              </div>
                
              <div className="grid md:grid-cols-2 gap-6">
                {/* O Que Esperar */}
                <div className="bg-white/60 rounded-2xl p-5 border border-amber-200/40">
                  <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-3" data-json-key="contato.initialAssessment.whatToExpect.title">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    {texts.initialAssessment.whatToExpect.title}
                  </h3>
                  <ul className="space-y-3">
                    {texts.initialAssessment.whatToExpect.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-amber-600 mt-1 font-bold">✦</span>
                        <span data-json-key={`contato.initialAssessment.whatToExpect.items[${idx}]`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nosso Compromisso */}
                <div className="bg-white/60 rounded-2xl p-5 border border-amber-200/40">
                  <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-3" data-json-key="contato.initialAssessment.commitment.title">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    {texts.initialAssessment.commitment.title}
                  </h3>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-7 h-7 text-amber-600 shrink-0 mt-1" />
                    <p className="text-gray-700 leading-relaxed text-sm" data-json-key="contato.initialAssessment.commitment.description">
                      {texts.initialAssessment.commitment.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAÇA CONTATO - DESTAQUE */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-linear-to-r from-green-300/20 via-green-400/30 to-green-300/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative bg-linear-to-br from-white via-green-50/50 to-emerald-50/30 rounded-3xl p-8 md:p-12 border-2 border-green-300/60 shadow-2xl">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 mb-6 shadow-lg shadow-green-400/50">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-green-700 via-emerald-600 to-green-700 bg-clip-text text-transparent" data-json-key="contato.contactCard.title">
                    {texts.contactCard.title}
                  </h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Entre em contato agora mesmo e dê o primeiro passo
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* WhatsApp Contact */}
                  <div className="bg-white/80 rounded-2xl p-6 border border-green-200/60 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-[#25D366]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600" data-json-key="contato.contactCard.whatsapp.label">
                          {texts.contactCard.whatsapp.label}
                        </p>
                        <p className="text-lg font-semibold text-gray-900" data-json-key="contato.contactCard.whatsapp.number">
                          {texts.contactCard.whatsapp.number}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span data-json-key="contato.contactCard.whatsappButton.text">
                        {texts.contactCard.whatsappButton.text}
                      </span>
                    </Button>

                    <p className="text-sm text-center text-gray-600 mt-4" data-json-key="contato.contactCard.whatsappButton.description">
                      {texts.contactCard.whatsappButton.description}
                    </p>
                  </div>

                  {/* Email & Hours */}
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="bg-white/80 rounded-2xl p-6 border border-violet-200/60 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-base font-semibold text-gray-900" data-json-key="contato.contactCard.email.address">
                            {texts.contactCard.email.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Horários */}
                    <div className="bg-white/80 rounded-2xl p-6 border border-slate-200/60 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2" data-json-key="contato.businessHours.title">
                            {texts.businessHours.title}
                          </p>
                          <p className="text-sm text-gray-700" data-json-key="contato.businessHours.hours.weekdays">
                            {texts.businessHours.hours.weekdays}
                          </p>
                          <p className="text-sm text-gray-700" data-json-key="contato.businessHours.hours.saturday">
                            {texts.businessHours.hours.saturday}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Perguntas Frequentes */}
            <div className="bg-linear-to-br from-white via-slate-50/30 to-gray-50/20 rounded-3xl p-8 md:p-12 border border-slate-200/60 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-900" data-json-key="contato.faq.title">
                {texts.faq.title}
              </h2>
              <div className="space-y-6 max-w-3xl mx-auto">
                {texts.faq.items.map((qa: { question: string; answer: string }, idx: number) => (
                  <div key={idx} className="bg-white/70 rounded-2xl p-6 border border-slate-200/40 shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3" data-json-key={`contato.faq.items[${idx}].question`}>
                      {qa.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed" data-json-key={`contato.faq.items[${idx}].answer`}>
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
