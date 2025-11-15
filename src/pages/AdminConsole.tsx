import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VisualPageEditor from '@/components/VisualPageEditor';
import BlogEditor from '@/components/BlogEditor';
import Index from './Index';
import { API_ENDPOINTS } from '@/config/api';
import QuemSomos from './QuemSomos';
import Contato from './Contato';
import Purificacao from './Purificacao';
import Artigos from './Artigos';
import Testemunhos from './Testemunhos';
import Tratamentos from './Tratamentos';

export default function AdminConsole() {
  const pages = [
    { id: 'index', name: 'Homepage', component: Index },
    { id: 'quemsomos', name: 'Quem Somos', component: QuemSomos },
    { id: 'contato', name: 'Contato', component: Contato },
    { id: 'purificacao', name: 'Purificação', component: Purificacao },
    { id: 'artigos', name: 'Artigos', component: Artigos },
    { id: 'testemunhos', name: 'Testemunhos', component: Testemunhos },
    { id: 'tratamentos', name: 'Tratamentos', component: Tratamentos },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminConsole_activeTab') || 'pages';
  });
  const [pageTab, setPageTab] = useState(() => {
    return localStorage.getItem('adminConsole_pageTab') || 'index';
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  // Salvar estados de abas no localStorage
  useEffect(() => {
    localStorage.setItem('adminConsole_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminConsole_pageTab', pageTab);
  }, [pageTab]);

  useEffect(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('visual_') || key.startsWith('admin_') || key.startsWith('wysiwyg_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);





  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Console</h1>

            {message && (
              <Alert className="mb-4">
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pages" className="min-w-40 px-6 py-2.5">Pages</TabsTrigger>
                <TabsTrigger value="blog" className="min-w-40 px-6 py-2.5">Blog</TabsTrigger>
              </TabsList>

              <TabsContent value="pages">
                <div className="mb-6 p-4 bg-gradient-to-r from-gold-500/10 to-gold-700/10 border-2 border-gold-500 rounded-lg">
                  <h2 className="text-lg font-bold mb-3 text-gold-700 flex items-center gap-2">
                    📄 Selecione uma Página para Editar
                  </h2>
                  <Tabs value={pageTab} onValueChange={setPageTab}>
                    <TabsList className="flex-wrap gap-2 bg-white/50 p-2">
                      {pages.map(page => (
                        <TabsTrigger 
                          key={page.id} 
                          value={page.id} 
                          className="min-w-[160px] px-6 py-3 font-semibold text-base data-[state=active]:bg-gold-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                        >
                          {page.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {pages.map(page => (
                      <TabsContent key={page.id} value={page.id} className="mt-6">
                        <VisualPageEditor
                          pageId={page.id}
                          pageName={page.name}
                          pageComponent={page.component}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="blog">
                <BlogEditor />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
