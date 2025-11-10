import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, MessageCircle, ShieldCheck, Mic, PhoneCall, MessageSquare, MessagesSquare, MailOpen } from 'lucide-react';
import defaultTexts from '@/locales/pt-BR/Contato.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';
import { usePageStyles } from '@/hooks/usePageStyles';

export default function Contato() {
  const stylesLoaded = usePageStyles('contato');
  const texts = useLocaleTexts('contato', defaultTexts);
  const handleWhatsAppClick = () => {
    const phoneNumber = '5511949555555';
    const message = encodeURIComponent('Olá! Quero saber mais sobre **O Trabalho de Resgate!**');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0]" style={{ opacity: stylesLoaded ? 1 : 0, transition: 'opacity 0.2s ease-in' }}>
      {/* Header */}
      <section className="py-16 bg-linear-to-r from-[#60a5fa] via-[#2563eb] to-[#60a5fa] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,255,255,0.25),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_60%,rgba(255,255,255,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.15)_45%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.15)_55%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.1)_48%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.1)_52%,transparent_60%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block mb-6">
              <Mail className="w-16 h-16 mx-auto drop-shadow-lg text-[#CFAF5A]" style={{
                filter: 'drop-shadow(0 0 10px rgba(207, 175, 90, 0.5))'
              }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg" data-json-key="contato.header.title">{texts.header.title}</h1>
            <p className="text-xl opacity-90 drop-shadow-md" data-json-key="contato.header.subtitle">{texts.header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Nota sobre Avaliação Inicial */}
            <Card className="mb-8 shadow-lg border-2 border-amber-200 bg-linear-to-br from-amber-50/50 to-yellow-50/30">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center" data-json-key="contato.initialAssessment.title">
                  {texts.initialAssessment.title}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* O Que Esperar */}
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2" data-json-key="contato.initialAssessment.whatToExpect.title">
                      <Clock className="w-[23px] h-[23px]" />
                      {texts.initialAssessment.whatToExpect.title}
                    </h3>
                    <ul className="space-y-2">
                      {texts.initialAssessment.whatToExpect.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-amber-600 mt-1">•</span>
                          <span className="text-sm" data-json-key={`contato.initialAssessment.whatToExpect.items[${idx}]`}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nosso Compromisso */}
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2" data-json-key="contato.initialAssessment.commitment.title">
                      <ShieldCheck className="w-6 h-6" />
                      {texts.initialAssessment.commitment.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed" data-json-key="contato.initialAssessment.commitment.description">
                      {texts.initialAssessment.commitment.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Contato Direto */}
              <Card className="shadow-xl border-2 border-[#25D366]">
                <CardHeader className="bg-linear-to-r from-[#25D366] to-[#128C7E] text-white p-6">
                  <CardTitle className="flex items-center gap-3 text-[25px] leading-none">
                    <MessageCircle className="w-[30px] h-[30px] stroke-2 m-1.5" />
                    <span data-json-key="contato.contactCard.title">{texts.contactCard.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[16px]">
                      <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                      <span className="text-gray-700 font-semibold" data-json-key="contato.contactCard.whatsapp.label">{texts.contactCard.whatsapp.label}</span>
                      <span className="text-gray-700 font-semibold" data-json-key="contato.contactCard.whatsapp.number">{texts.contactCard.whatsapp.number}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[16px]">
                      <Mail className="w-5 h-5 text-[#4A90A9] shrink-0" />
                      <span className="text-gray-700" data-json-key="contato.contactCard.email.address">{texts.contactCard.email.address}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[21px] py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span data-json-key="contato.contactCard.whatsappButton.text">{texts.contactCard.whatsappButton.text}</span>
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 text-center pt-3" data-json-key="contato.contactCard.whatsappButton.description">{texts.contactCard.whatsappButton.description}</p>
                </CardContent>
              </Card>

              {/* Horários */}
              <Card className="shadow-xl border-2 border-[#C0C4C7]">
                <CardHeader className="bg-linear-to-r from-[#C0C4C7] to-[#9EA2A5] text-black p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent_70%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.25),transparent_70%)]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.2)_45%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.2)_55%,transparent_70%)]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.15)_48%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.15)_52%,transparent_60%)]"></div>
                  <CardTitle className="flex items-center gap-3 text-[25px] leading-none relative z-10">
                    <Clock className="w-8 h-8 stroke-2 m-0.5" />
                    <span data-json-key="contato.businessHours.title">{texts.businessHours.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2 text-[16px] text-gray-700">
                    <p data-json-key="contato.businessHours.hours.weekdays">{texts.businessHours.hours.weekdays}</p>
                    <p data-json-key="contato.businessHours.hours.saturday">{texts.businessHours.hours.saturday}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#222222]" data-json-key="contato.faq.title">
              {texts.faq.title}
            </h2>
            <div className="space-y-6">
              {texts.faq.items.map((qa: { question: string; answer: string }, idx: number) => (
                <Card className="shadow-lg" key={idx}>
                  <CardHeader>
                    <CardTitle className="text-xl text-[#CFAF5A]" data-json-key={`contato.faq.items[${idx}].question`}>{qa.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700" data-json-key={`contato.faq.items[${idx}].answer`}>{qa.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
