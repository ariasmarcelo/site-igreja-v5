import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

// Categorização dos ícones
const iconCategories = {
  'Espiritual & Religioso': [
    'Sparkles', 'Star', 'Sun', 'Moon', 'Flame', 'Heart', 'Eye', 'HandMetal',
    'Church', 'Cross', 'Feather', 'Infinity', 'Ghost', 'Zap', 'Gem'
  ],
  'Fogo & Energia': [
    'Flame', 'Fire', 'Zap', 'ZapOff', 'Bolt', 'Lightbulb', 'LightbulbOff',
    'Flashlight', 'FlashlightOff', 'Battery', 'BatteryCharging', 'BatteryFull',
    'BatteryLow', 'BatteryMedium', 'BatteryWarning', 'Power', 'PowerOff',
    'Radio', 'Waves', 'Activity', 'TrendingUp', 'Sunrise', 'Sunset'
  ],
  'Natureza & Elementos': [
    'Leaf', 'Trees', 'Flower', 'Flower2', 'Sprout', 'CloudRain', 'CloudSnow',
    'Wind', 'Waves', 'Mountain', 'Sunrise', 'Sunset', 'CloudSun', 'CloudMoon',
    'Droplet', 'Droplets', 'Snowflake', 'CloudDrizzle', 'CloudLightning'
  ],
  'Pessoas & Corpo': [
    'User', 'Users', 'UserCircle', 'UserCheck', 'UserPlus', 'Heart', 'Brain',
    'Activity', 'Smile', 'Frown', 'Meh', 'Hand', 'HandHeart', 'Baby'
  ],
  'Saúde & Medicina': [
    'Heart', 'HeartPulse', 'Stethoscope', 'Pill', 'Syringe', 'Activity',
    'Brain', 'Eye', 'Ear', 'Bandage', 'Shield', 'ShieldPlus', 'Cross'
  ],
  'Comunicação': [
    'Mail', 'Send', 'MessageCircle', 'MessageSquare', 'Phone', 'PhoneCall',
    'Video', 'Mic', 'Bell', 'BellRing', 'AtSign', 'Share2', 'MessageCircleHeart'
  ],
  'Navegação & Direção': [
    'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight', 'ChevronLeft',
    'ChevronUp', 'ChevronDown', 'ChevronsRight', 'ChevronsLeft', 'Navigation',
    'Compass', 'MapPin', 'Map', 'Route'
  ],
  'Interface & Ações': [
    'Menu', 'X', 'Plus', 'Minus', 'Check', 'CheckCircle', 'XCircle',
    'AlertCircle', 'AlertTriangle', 'Info', 'HelpCircle', 'Settings',
    'Edit', 'Edit2', 'Edit3', 'Trash', 'Trash2', 'Save', 'Download', 'Upload'
  ],
  'Mídia & Arquivos': [
    'Image', 'File', 'FileText', 'Folder', 'FolderOpen', 'Music',
    'Video', 'Camera', 'Mic', 'Film', 'Youtube', 'Instagram', 'Facebook'
  ],
  'Educação & Conhecimento': [
    'Book', 'BookOpen', 'BookMarked', 'GraduationCap', 'School', 'Library',
    'Lightbulb', 'Brain', 'Glasses', 'Pen', 'PenTool', 'Award', 'Trophy'
  ],
  'Tempo & Calendário': [
    'Clock', 'Calendar', 'CalendarDays', 'CalendarCheck', 'Timer',
    'Hourglass', 'History', 'AlarmClock', 'Watch'
  ],
  'Comércio & Dinheiro': [
    'DollarSign', 'CreditCard', 'Wallet', 'ShoppingCart', 'ShoppingBag',
    'Tag', 'Gift', 'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart'
  ],
  'Tecnologia': [
    'Laptop', 'Monitor', 'Smartphone', 'Tablet', 'Wifi', 'WifiOff',
    'Bluetooth', 'Battery', 'BatteryCharging', 'Cpu', 'HardDrive', 'Database'
  ],
  'Emoções & Sentimentos': [
    'Heart', 'HeartHandshake', 'HeartCrack', 'Smile', 'Frown', 'Laugh',
    'Angry', 'ThumbsUp', 'ThumbsDown', 'Sparkles', 'Star', 'PartyPopper'
  ],
  'Símbolos & Formas': [
    'Circle', 'Square', 'Triangle', 'Diamond', 'Star', 'Pentagon',
    'Hexagon', 'Octagon', 'Infinity', 'Hash', 'AtSign', 'Percent'
  ],
  'Casa & Localização': [
    'Home', 'Building', 'Building2', 'Store', 'Warehouse', 'MapPin',
    'MapPinned', 'Globe', 'Globe2', 'Flag', 'Tent', 'Castle'
  ]
};

export default function IconGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  // Função para copiar o nome do ícone
  const copyIconName = (iconName: string) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  // Filtrar ícones baseado na busca
  const filterIcons = (icons: string[]) => {
    if (!searchTerm) return icons;
    return icons.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="py-20 bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LucideIcons.Sparkles className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galeria de Ícones Lucide
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Explore mais de 1.000 ícones organizados por categoria
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <div className="relative">
                <LucideIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar ícones... (ex: heart, user, star)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg"
                />
              </div>
              {searchTerm && (
                <p className="mt-3 text-sm text-slate-600">
                  Buscando por: <span className="font-semibold">{searchTerm}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Icon Categories */}
      <div className="container mx-auto px-4 pb-16">
        <div className="space-y-12">
          {Object.entries(iconCategories).map(([category, icons]) => {
            const filteredIcons = filterIcons(icons);
            
            if (filteredIcons.length === 0 && searchTerm) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-purple-200">
                  {category}
                  <span className="ml-3 text-sm font-normal text-slate-500">
                    ({filteredIcons.length} {filteredIcons.length === 1 ? 'ícone' : 'ícones'})
                  </span>
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {filteredIcons.map((iconName) => {
                    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                    
                    if (!IconComponent) return null;

                    return (
                      <Card
                        key={iconName}
                        className="group hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-2 hover:border-purple-400"
                        onClick={() => copyIconName(iconName)}
                      >
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
                          <div className="mb-3 p-3 rounded-lg bg-linear-to-br from-purple-50 to-indigo-50 group-hover:from-purple-100 group-hover:to-indigo-100 transition-colors">
                            <IconComponent className="h-8 w-8 text-purple-600" />
                          </div>
                          <p className="text-xs font-medium text-slate-700 break-all">
                            {iconName}
                          </p>
                          {copiedIcon === iconName && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                              <LucideIcons.Check className="h-3 w-3" />
                              Copiado!
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Instructions */}
        <Card className="mt-16 border-2 border-purple-200 bg-linear-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <LucideIcons.Info className="h-5 w-5" />
              Como Usar os Ícones
            </CardTitle>
            <CardDescription>
              Instruções para importar e usar os ícones Lucide React no seu código
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">1. Importar o ícone:</h4>
              <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { Heart, Star, User } from 'lucide-react';`}</code>
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">2. Usar no componente:</h4>
              <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{`<Heart className="h-6 w-6 text-red-500" />
<Star className="h-8 w-8 text-yellow-400" />
<User className="h-5 w-5 text-blue-600" />`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2">3. Propriedades disponíveis:</h4>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li><code className="bg-white px-2 py-1 rounded">className</code> - Classes CSS para estilização</li>
                <li><code className="bg-white px-2 py-1 rounded">size</code> - Tamanho do ícone (número)</li>
                <li><code className="bg-white px-2 py-1 rounded">color</code> - Cor do ícone</li>
                <li><code className="bg-white px-2 py-1 rounded">strokeWidth</code> - Espessura da linha</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-purple-200">
              <p className="text-sm text-slate-600">
                <LucideIcons.MousePointerClick className="h-4 w-4 inline mr-1" />
                <strong>Dica:</strong> Clique em qualquer ícone acima para copiar seu nome automaticamente!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
