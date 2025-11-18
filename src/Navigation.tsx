import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { Menu, X } from 'lucide-react';
import Index from './pages/Index';
import QuemSomos from './pages/QuemSomos';
import Tratamentos from './pages/Tratamentos';
import Purificacao from './pages/Purificacao';
import Artigos from './pages/Artigos';
import ArtigoDetalhes from './pages/ArtigoDetalhes';
import ArtigosCategoria from './pages/ArtigosCategoria';
import Contato from './pages/Contato';
import Testemunhos from './pages/Testemunhos';
import IconGallery from './pages/IconGallery';
import WhatsAppButton from './components/WhatsAppButton';
import NotFound from './pages/NotFound';

// Lazy load heavy components (Admin Console)
const AdminConsole = lazy(() => import('./pages/AdminConsole'));

// Componente para gerenciar scroll: mantém posição no refresh (editor), reseta ao navegar (site)
const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isEditor = location.pathname === '/436F6E736F6C45';
    
    // Desabilitar scroll restoration automático do navegador sempre
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    if (isEditor) {
      // Restaurar scroll no editor
      const savedScroll = sessionStorage.getItem('editor_scroll');
      if (savedScroll) {
        const scrollPos = parseInt(savedScroll, 10);
        // Usar setTimeout 0 para executar após o render
        setTimeout(() => window.scrollTo(0, scrollPos), 0);
      }
      
      // Salvar ao sair
      const save = () => sessionStorage.setItem('editor_scroll', window.scrollY.toString());
      window.addEventListener('beforeunload', save);
      return () => window.removeEventListener('beforeunload', save);
    } else {
      // Site: reset ao topo APENAS quando navegar entre páginas
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
};

const NavigationMenu = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Esconder Navigation no painel de administração
  if (location.pathname === '/436F6E736F6C45') {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Quem Somos', href: '/quemsomos' },
    { name: 'Purificação e Ascensão', href: '/purificacao' },
    { name: 'Tratamentos Associados', href: '/tratamentos' },
    { name: 'Testemunhos', href: '/testemunhos' },
    { name: 'Artigos', href: '/artigos' },
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
            <div>
              <div className="text-base md:text-xl font-bold text-[#CFAF5A]">Igreja de Metatron</div>
              <div className="text-sm md:text-xs text-gray-600">O Trabalho de Resgate</div>
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
});

const Navigation = () => {
  // Vercel serve na raiz
  const basename = '/';
  
  return (
    <BrowserRouter basename={basename}>
      <ScrollManager />
      <NavigationMenu />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quemsomos" element={<QuemSomos />} />
          <Route path="/tratamentos" element={<Tratamentos />} />
          <Route path="/purificacao" element={<Purificacao />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/artigos/categoria/:categoria" element={<ArtigosCategoria />} />
          <Route path="/artigos/:slug" element={<ArtigoDetalhes />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/testemunhos" element={<Testemunhos />} />
          <Route path="/icones" element={<IconGallery />} />
          <Route 
            path="/436F6E736F6C45" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando Admin Console...</div>}>
                <AdminConsole />
              </Suspense>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* WhatsApp Button */}
        <WhatsAppButton />
      </BrowserRouter>
  );
};

export default Navigation;
