/**
 * Componente de Background padronizado para footers
 * Baseado no design de QuemSomos.tsx
 */

interface FooterBackgroundProps {
  gradientId?: string;
}

export const FooterBackground = ({ gradientId = "skyGradient" }: FooterBackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 370"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* GRADIENTE CÉU: azul-escuro (noite) -> azul-claro (horizonte) */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect width="1200" height="370" fill={`url(#${gradientId})`} />
        
        {/* HORIZONTE DE TERRA - atrás das ondas */}
        <path
          d="M0,251 Q600,161 1200,251 L1200,400 L0,400 Z"
          fill="#4a3f2e"
        />
        
        {/* ÁGUA - camadas animadas verde-água com movimentos entrelaçados */}
        <path 
          className="animate-wave-1"
          d="M-100,318 Q600,198 1300,318 L1300,380 L-100,380 Z" 
          fill="#14b8a6" 
          opacity="0.25"
        />
        <path 
          className="animate-wave-2"
          d="M-100,330 Q600,210 1300,330 L1300,380 L-100,380 Z" 
          fill="#0d9488" 
          opacity="0.25"
        />
        <path 
          className="animate-wave-3"
          d="M-100,338 Q600,218 1300,338 L1300,380 L-100,380 Z" 
          fill="#0f766e" 
          opacity="0.25"
        />
      </svg>
    </div>
  );
};
