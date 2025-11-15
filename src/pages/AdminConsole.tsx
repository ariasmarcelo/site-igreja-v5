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
    <div className="admin-console-container">
      <div className="admin-console-wrapper">
        <Card>
          <CardContent className="admin-console-card-content">
            <h1 className="admin-console-title">Admin Console</h1>

            {message && (
              <Alert className="admin-console-alert">
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pages" className="admin-console-main-tab">Pages</TabsTrigger>
                <TabsTrigger value="blog" className="admin-console-main-tab">Blog</TabsTrigger>
              </TabsList>

              <TabsContent value="pages">
                <div className="admin-console-page-selector">
                  <h2 className="admin-console-page-selector-title">
                    📄 Selecione uma Página para Editar
                  </h2>
                  <Tabs value={pageTab} onValueChange={setPageTab}>
                    <TabsList className="admin-console-page-tabs-list">
                      {pages.map(page => (
                        <TabsTrigger 
                          key={page.id} 
                          value={page.id} 
                          className="admin-console-page-tab"
                        >
                          {page.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {pages.map(page => (
                      <TabsContent key={page.id} value={page.id} className="admin-console-page-content">
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
