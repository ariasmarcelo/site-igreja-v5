import React from 'react';
import { useContent } from '@/hooks/useContent';

interface FooterProps {
  className?: string;
}

interface SharedContent {
  footer?: {
    copyright?: string;
    trademark?: string;
  };
}

/**
 * Componente de Footer compartilhado
 * Exibe copyright e trademark vindos do conteúdo compartilhado (page_id = '__shared__')
 */
export const SharedFooter: React.FC<FooterProps> = ({ className = '' }) => {
  const { data } = useContent<{ __shared__: SharedContent }>({ pages: ['__shared__'] });
  
  const footer = data?.['__shared__']?.footer;
  const copyright = footer?.copyright || '© 2025 Igreja de Metatron. Todos os direitos reservados.';
  const trademark = footer?.trademark || 'Marcas registradas® protegidas por lei.';

  return (
    <div className={`relative z-10 pt-4 pb-2 text-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mt-16 pt-3 pb-1 text-center text-emerald-100/70 text-sm max-w-4xl mx-auto">
          <p data-json-key="__shared__.footer.copyright">{copyright}</p>
          <p className="mt-2" data-json-key="__shared__.footer.trademark">{trademark}</p>
        </div>
      </div>
    </div>
  );
};
