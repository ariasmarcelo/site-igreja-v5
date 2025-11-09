import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileJson, Eye } from 'lucide-react';
import VisualPageEditor from '@/components/VisualPageEditor';
import BlogEditor from '@/components/BlogEditor';
import Index from './Index';
import QuemSomos from './QuemSomos';
import Contato from './Contato';
import Purificacao from './Purificacao';
import Artigos from './Artigos';
import Testemunhos from './Testemunhos';
import Tratamentos from './Tratamentos';
import indexTexts from '@/locales/pt-BR/Index.json';
import quemSomosTexts from '@/locales/pt-BR/QuemSomos.json';
import contatoTexts from '@/locales/pt-BR/Contato.json';
import purificacaoTexts from '@/locales/pt-BR/Purificacao.json';
import artigosTexts from '@/locales/pt-BR/Artigos.json';
import testemunhosTexts from '@/locales/pt-BR/Testemunhos.json';
import tratamentosTexts from '@/locales/pt-BR/Tratamentos.json';

export default function AdminConsole() {
  const pages = [
    { id: 'index', name: 'Homepage', file: 'Index.json', content: indexTexts, component: Index },
    { id: 'quemsomos', name: 'Quem Somos', file: 'QuemSomos.json', content: quemSomosTexts, component: QuemSomos },
    { id: 'contato', name: 'Contato', file: 'Contato.json', content: contatoTexts, component: Contato },
    { id: 'purificacao', name: 'Purificação', file: 'Purificacao.json', content: purificacaoTexts, component: Purificacao },
    { id: 'artigos', name: 'Artigos', file: 'Artigos.json', content: artigosTexts, component: Artigos },
    { id: 'testemunhos', name: 'Testemunhos', file: 'Testemunhos.json', content: testemunhosTexts, component: Testemunhos },
    { id: 'tratamentos', name: 'Tratamentos', file: 'Tratamentos.json', content: tratamentosTexts, component: Tratamentos },
  ];

  const initialContent: Record<string, string> = {};
  pages.forEach(page => {
    initialContent[page.id] = JSON.stringify(page.content, null, 2);
  });

  const [editorMode, setEditorMode] = useState<'visual' | 'json'>(() => {
    return (localStorage.getItem('adminConsole_editorMode') as 'visual' | 'json') || 'visual';
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminConsole_activeTab') || 'pages';
  });
  const [pageTab, setPageTab] = useState(() => {
    return localStorage.getItem('adminConsole_pageTab') || 'index';
  });
  const [jsonTab, setJsonTab] = useState(() => {
    return localStorage.getItem('adminConsole_jsonTab') || 'index';
  });
  const [editedContent, setEditedContent] = useState<Record<string, string>>(initialContent);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Salvar todos os estados de abas no localStorage
  useEffect(() => {
    localStorage.setItem('adminConsole_editorMode', editorMode);
  }, [editorMode]);

  useEffect(() => {
    localStorage.setItem('adminConsole_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminConsole_pageTab', pageTab);
  }, [pageTab]);

  useEffect(() => {
    localStorage.setItem('adminConsole_jsonTab', jsonTab);
  }, [jsonTab]);

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

  const handleSave = async (pageId: string) => {
    try {
      const content = editedContent[pageId];
      JSON.parse(content);
      
      const response = await fetch('http://localhost:3001/api/save-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: pageId,
          content: JSON.parse(content)
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar');
      
      setMessage({ type: 'success', text: `Salvo: ${pages.find(p => p.id === pageId)?.name}` });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `Erro: ${error}` });
    }
  };

  const handleDownload = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    const blob = new Blob([editedContent[pageId]], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = page.file;
    a.click();
  };

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

            <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'visual' | 'json')}>
              <TabsList>
                <TabsTrigger value="visual" className="min-w-[180px] px-6 py-3">
                  <Eye className="w-4 h-4 mr-2" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="json" className="min-w-[180px] px-6 py-3">
                  <FileJson className="w-4 h-4 mr-2" />
                  JSON
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="pages" className="min-w-[160px] px-6 py-2.5">Pages</TabsTrigger>
                    <TabsTrigger value="blog" className="min-w-[160px] px-6 py-2.5">Blog</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pages">
                    <Tabs value={pageTab} onValueChange={setPageTab}>
                      <TabsList className="flex-wrap">
                        {pages.map(page => (
                          <TabsTrigger key={page.id} value={page.id} className="min-w-[140px] px-5 py-2">{page.name}</TabsTrigger>
                        ))}
                      </TabsList>

                      {pages.map(page => (
                        <TabsContent key={page.id} value={page.id}>
                          <VisualPageEditor
                            pageId={page.id}
                            pageName={page.name}
                            pageComponent={page.component}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="blog">
                    <BlogEditor />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="json">
                <Tabs value={jsonTab} onValueChange={setJsonTab}>
                  <TabsList className="flex-wrap">
                    {pages.map(page => (
                      <TabsTrigger key={page.id} value={page.id} className="min-w-[140px] px-5 py-2">{page.name}</TabsTrigger>
                    ))}
                  </TabsList>

                  {pages.map(page => (
                    <TabsContent key={page.id} value={page.id}>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button onClick={() => handleSave(page.id)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => handleDownload(page.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        
                        <Textarea
                          rows={30}
                          value={editedContent[page.id]}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, [page.id]: e.target.value }))}
                          className="font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
