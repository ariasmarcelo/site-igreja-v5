import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useLayoutEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Index from './pages/Index';
import QuemSomos from './pages/QuemSomos';
import Tratamentos from './pages/Tratamentos';
import Purificacao from './pages/Purificacao';
import Artigos from './pages/Artigos';
import Contato from './pages/Contato';
import Testemunhos from './pages/Testemunhos';
import AdminConsole from './pages/AdminConsole';
import WhatsAppButton from './components/WhatsAppButton';
import NotFound from './pages/NotFound';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Scroll suave mas rápido
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Esconder Navigation no painel de administração
  if (location.pathname === '/436F6E736F6C45') {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Quem Somos', href: '/quem-somos' },
    { name: 'Purificação e Ascensão', href: '/purificacao' },
    { name: 'Tratamentos Associados', href: '/tratamentos' },
    { name: 'Artigos', href: '/artigos' },
    { name: 'Testemunhos', href: '/testemunhos' },
    { name: 'Contato', href: '/contato' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12"
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
            <div className="hidden md:block">
              <div className="text-xl font-bold text-[#CFAF5A]">Igreja de Metatron</div>
              <div className="text-xs text-gray-600">O Trabalho de Resgate</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.href)
                    ? 'text-gray-50 bg-linear-to-br from-[#B38938] to-[#8B6914] font-semibold shadow-lg shadow-[#CFAF5A]/40 -translate-y-0.5'
                    : 'text-gray-700 hover:text-[#CFAF5A] hover:bg-gray-50 hover:shadow-md hover:-translate-y-px'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.href)
                    ? 'text-gray-50 bg-linear-to-br from-[#B38938] to-[#8B6914] font-semibold shadow-md shadow-[#CFAF5A]/30'
                    : 'text-gray-700 hover:text-[#CFAF5A] hover:bg-gray-50 hover:shadow-sm'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  // Use basename apenas em produção
  const basename = import.meta.env.MODE === 'production' ? '/site-igreja-v6' : '/';
  
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <Navigation />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/tratamentos" element={<Tratamentos />} />
          <Route path="/purificacao" element={<Purificacao />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/testemunhos" element={<Testemunhos />} />
          <Route path="/436F6E736F6C45" element={<AdminConsole />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
