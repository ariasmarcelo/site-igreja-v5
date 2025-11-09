import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function WhatsAppButton() {
  const location = useLocation();
  
  // Esconder botão WhatsApp quando estiver no painel admin
  if (location.pathname === '/436F6E736F6C45') {
    return null;
  }
  
  return (
    <Link
      to="/contato"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-float"
      aria-label="Faça Contato"
    >
      <MessageCircle className="w-7 h-7" />
    </Link>
  );
}