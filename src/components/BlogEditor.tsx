import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TiptapEditor from '@/components/TiptapEditor';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X,
  Calendar,
  Tag,
  User,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  cover_image: string;
  published: boolean;
  published_at: string;
  created_at: string;
  views: number;
}

type EditorState = 'VIEWING' | 'EDITING' | 'SAVING' | 'CREATING';

const STORAGE_KEYS = {
  ADMIN_TAB: 'adminConsole_activeTab',  // Aba do AdminConsole (pages/blog/styles)
  DRAFT_PREFIX: 'blogEditor_draft_',
  SCROLL_POSITION: 'blogEditor_scrollPos'
};

export default function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [editorState, setEditorState] = useState<EditorState>('VIEWING');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const isSaving = useRef(false);
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const manualStateChange = useRef(false); // Flag para operações manuais

  // Computed: tem mudanças pendentes?
  const hasChanges = editorState === 'EDITING' || editorState === 'CREATING';

  const categories = [
    'Desenvolvimento Espiritual',
    'Cura Interior',
    'Meditação e Práticas',
    'Conhecimento Esotérico'
  ];

  const authors = ['Igreja Metatron', 'Instituto Metatron'];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      showMessage('error', 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  // Carregar posts e restaurar estado do localStorage
  useEffect(() => {
    loadPosts();
    
    // Restaurar aba ativa após refresh
    const savedTab = localStorage.getItem(STORAGE_KEYS.ADMIN_TAB);
    if (savedTab === 'blog') {
      console.log('📂 Verificando rascunhos salvos...');
      // Tentar restaurar rascunho
      const draftKeys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEYS.DRAFT_PREFIX));
      
      if (draftKeys.length > 0) {
        // Pegar o rascunho mais recente
        const drafts = draftKeys.map(key => ({
          key,
          data: JSON.parse(localStorage.getItem(key) || '{}')
        })).filter(d => d.data.post);
        
        if (drafts.length > 0) {
          // Ordenar por timestamp e pegar o mais recente
          drafts.sort((a, b) => (b.data.timestamp || 0) - (a.data.timestamp || 0));
          const latestDraft = drafts[0].data;
          
          console.log('✅ Rascunho encontrado:', latestDraft.post.title);
          console.log('⏰ Salvo em:', new Date(latestDraft.timestamp).toLocaleString());
          
          manualStateChange.current = true;
          setEditingPost(latestDraft.post);
          setOriginalPost(latestDraft.original);
          setEditorState(latestDraft.post.id ? 'EDITING' : 'CREATING');
          
          showMessage('success', `📝 Rascunho restaurado: "${latestDraft.post.title}"`);
        }
      } else {
        console.log('ℹ️ Nenhum rascunho encontrado');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detectar mudanças e atualizar estado
  useEffect(() => {
    // Se foi uma mudança manual (UNDO, Salvar, etc), não interferir
    if (manualStateChange.current) {
      manualStateChange.current = false;
      return;
    }

    if (!editingPost || !originalPost) {
      setEditorState('VIEWING');
      return;
    }

    const changed = JSON.stringify(editingPost) !== JSON.stringify(originalPost);
    
    if (changed) {
      setEditorState(editingPost.id ? 'EDITING' : 'CREATING');
      // Salvar rascunho no localStorage
      saveDraft(editingPost, originalPost);
    } else {
      setEditorState('VIEWING');
      // Limpar rascunho se não há mudanças
      clearDraft(editingPost.id);
    }
  }, [editingPost, originalPost]);

  // Funções de persistência
  const saveDraft = (post: BlogPost, original: BlogPost) => {
    const draftKey = `${STORAGE_KEYS.DRAFT_PREFIX}${post.id || 'new'}`;
    localStorage.setItem(draftKey, JSON.stringify({ post, original, timestamp: Date.now() }));
    localStorage.setItem(STORAGE_KEYS.ADMIN_TAB, 'blog');
  };

  const clearDraft = (postId: string) => {
    const draftKey = `${STORAGE_KEYS.DRAFT_PREFIX}${postId || 'new'}`;
    localStorage.removeItem(draftKey);
  };

  const clearAllDrafts = () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_KEYS.DRAFT_PREFIX))
      .forEach(k => localStorage.removeItem(k));
    // Não remove ADMIN_TAB aqui - deixa o usuário na aba blog
  };

  const handleNewPost = () => {
    // Verificar se há mudanças não salvas
    if (editorState === 'EDITING' || editorState === 'CREATING') {
      if (!confirm('Descartar alterações não salvas?')) {
        return;
      }
    }
    
    const newPost: BlogPost = {
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Igreja Metatron',
      category: 'Desenvolvimento Espiritual',
      tags: [],
      cover_image: '',
      published: false,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      views: 0
    };
    
    setEditingPost(newPost);
    setOriginalPost(JSON.parse(JSON.stringify(newPost)));
    setEditorState('CREATING');
  };

  const handleEditPost = (post: BlogPost) => {
    // Verificar se há mudanças não salvas
    if (editorState === 'EDITING' || editorState === 'CREATING') {
      if (!confirm('Descartar alterações não salvas?')) {
        return;
      }
    }
    
    setEditingPost(post);
    setOriginalPost(JSON.parse(JSON.stringify(post)));
    setEditorState('VIEWING');
    localStorage.setItem(STORAGE_KEYS.ADMIN_TAB, 'blog');
  };

  const handleCancelEdit = () => {
    if (!editingPost) return;
    
    // Marcar como mudança manual para o useEffect não interferir
    manualStateChange.current = true;
    
    // Se está criando novo post, fechar o editor
    if (editorState === 'CREATING') {
      clearDraft('');
      setEditingPost(null);
      setOriginalPost(null);
      setEditorState('VIEWING');
      // Manter na aba blog mesmo ao fechar
      return;
    }
    
    // Se está editando, fazer UNDO: restaurar dados originais e voltar para VIEWING
    if (editorState === 'EDITING') {
      // Restaurar dados originais
      const restored = JSON.parse(JSON.stringify(originalPost));
      setEditingPost(restored);
      clearDraft(editingPost.id);
      setEditorState('VIEWING');
      showMessage('success', 'Alterações descartadas');
      return;
    }
    
    // Se está em VIEWING (clicou "Voltar"), apenas fechar o editor
    clearAllDrafts();
    setEditingPost(null);
    setOriginalPost(null);
    setEditorState('VIEWING');
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      showMessage('success', 'Artigo excluído com sucesso!');
      loadPosts();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      showMessage('error', 'Erro ao excluir artigo');
    }
  };

  const handleSavePost = async () => {
    if (!editingPost) return;

    // Guard: prevenir execução duplicada
    if (editorState === 'SAVING') {
      return;
    }

    setEditorState('SAVING');
    isSaving.current = true;

    // Validações
    if (!editingPost.title.trim()) {
      showMessage('error', 'Título é obrigatório');
      setEditorState(editingPost.id ? 'EDITING' : 'CREATING');
      isSaving.current = false;
      return;
    }

    // Gerar slug do título se estiver vazio
    if (!editingPost.slug.trim()) {
      editingPost.slug = editingPost.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    try {
      if (editingPost.id) {
        // Atualizar post existente via API (tem permissão service_role)
        const updateData = {
          title: editingPost.title,
          slug: editingPost.slug,
          excerpt: editingPost.excerpt,
          content: editingPost.content,
          author: editingPost.author,
          category: editingPost.category,
          tags: editingPost.tags,
          cover_image: editingPost.cover_image,
          published: editingPost.published,
          published_at: editingPost.published ? new Date().toISOString() : editingPost.published_at
        };

        const response = await fetch(`http://localhost:3001/api/blog-posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao salvar');
        }
        
        // Sucesso: sincronizar editingPost e originalPost com os dados salvos
        manualStateChange.current = true; // Prevenir useEffect de interferir
        const savedPost = JSON.parse(JSON.stringify(editingPost));
        setEditingPost(savedPost);  // Atualizar também o editingPost
        setOriginalPost(savedPost);
        clearDraft(editingPost.id);
        setEditorState('VIEWING');
        showMessage('success', '✓ Artigo atualizado com sucesso!');
        
        // Recarregar posts em background (sem fechar editor)
        loadPosts();
      } else {
        // Criar novo post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title: editingPost.title,
            slug: editingPost.slug,
            excerpt: editingPost.excerpt,
            content: editingPost.content,
            author: editingPost.author,
            category: editingPost.category,
            tags: editingPost.tags,
            cover_image: editingPost.cover_image,
            published: editingPost.published,
            published_at: editingPost.published ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;
        
        // Sucesso: atualizar post com ID e mudar para VIEWING
        manualStateChange.current = true; // Prevenir useEffect de interferir
        if (data) {
          const newPost = { ...editingPost, id: data.id };
          setEditingPost(newPost);
          setOriginalPost(JSON.parse(JSON.stringify(newPost)));
          clearDraft('');
          setEditorState('VIEWING');
        }
        showMessage('success', '✓ Artigo criado com sucesso!');
        
        // Recarregar posts em background
        loadPosts();
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      showMessage('error', '✗ Erro ao salvar artigo');
      // Voltar para estado de edição em caso de erro
      setEditorState(editingPost.id ? 'EDITING' : 'CREATING');
    } finally {
      // Liberar lock após delay
      setTimeout(() => {
        isSaving.current = false;
      }, 1000);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && post.published) ||
                         (filterStatus === 'draft' && !post.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Message Alert - Floating Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-[10000] animate-in slide-in-from-top duration-500">
          <Alert className={`${
            message.type === 'success' 
              ? 'bg-green-500 border-green-600 text-white shadow-2xl' 
              : 'bg-red-500 border-red-600 text-white shadow-2xl'
          } min-w-[400px] max-w-[600px]`}>
            <AlertDescription className="text-white font-semibold text-base flex items-center gap-2">
              {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {message.text}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Floating Action Buttons */}
      {editingPost && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {/* Botão Salvar - Só aparece quando há mudanças ou está salvando */}
          {(editorState === 'EDITING' || editorState === 'CREATING' || editorState === 'SAVING') && (
            <button
              onClick={handleSavePost}
              disabled={editorState === 'SAVING'}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 ${
                editorState === 'SAVING'
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer hover:scale-105'
              }`}
              title={editorState === 'SAVING' ? 'Salvando...' : (editorState === 'CREATING' ? 'Criar Artigo' : 'Salvar Mudanças')}
            >
              <Save className="w-5 h-5" />
              <span>{editorState === 'SAVING' ? 'Salvando...' : (editorState === 'CREATING' ? 'Criar' : 'Salvar')}</span>
              {editorState !== 'SAVING' && (
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              )}
            </button>
          )}
          
          {/* Botão Cancelar (quando editando) ou Voltar (quando viewing) */}
          <button
            onClick={handleCancelEdit}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            title={editorState === 'VIEWING' ? 'Voltar para Lista' : 'Cancelar Edição'}
          >
            <X className="w-5 h-5" />
            <span>{editorState === 'VIEWING' ? 'Voltar' : 'Cancelar'}</span>
          </button>
        </div>
      )}

      {/* Warning Badge - Unsaved Changes */}
      {hasChanges && editingPost && (
        <div className="fixed top-4 left-4 z-[9999]">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm animate-pulse">
            ⚠️ Alterações não salvas
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Editor de Blog</h2>
          <p className="text-gray-500 mt-1">Gerencie os artigos da Igreja e do Instituto</p>
          
          {/* Aviso de rascunho disponível */}
          {!editingPost && (() => {
            const draftKeys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEYS.DRAFT_PREFIX));
            if (draftKeys.length > 0) {
              const drafts = draftKeys.map(key => ({
                key,
                data: JSON.parse(localStorage.getItem(key) || '{}')
              })).filter(d => d.data.post);
              
              if (drafts.length > 0) {
                drafts.sort((a, b) => (b.data.timestamp || 0) - (a.data.timestamp || 0));
                const latestDraft = drafts[0].data;
                
                return (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-orange-600 font-semibold">
                      💾 Rascunho disponível: "{latestDraft.post.title}"
                    </span>
                    <button
                      onClick={() => {
                        manualStateChange.current = true;
                        setEditingPost(latestDraft.post);
                        setOriginalPost(latestDraft.original);
                        setEditorState(latestDraft.post.id ? 'EDITING' : 'CREATING');
                        showMessage('success', 'Rascunho restaurado');
                      }}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Restaurar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Descartar este rascunho?')) {
                          clearAllDrafts();
                          showMessage('success', 'Rascunho descartado');
                          window.location.reload(); // Forçar atualização
                        }
                      }}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Descartar
                    </button>
                  </div>
                );
              }
            }
            return null;
          })()}
        </div>
        <Button onClick={handleNewPost} className="bg-[#CFAF5A] hover:bg-[#B89B4A]">
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List - Only show when not editing */}
      {!editingPost && loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Carregando artigos...</p>
          </CardContent>
        </Card>
      ) : !editingPost && filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum artigo encontrado</p>
          </CardContent>
        </Card>
      ) : !editingPost ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map(post => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={post.published ? 'default' : 'secondary'}>
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                      <Badge variant="outline">{post.author}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views} visualizações
                      </span>
                      {post.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {post.tags.length} tags
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Editor Form */}
      {editingPost && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPost?.id ? 'Editar Artigo' : 'Novo Artigo'}
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo para {editingPost?.id ? 'atualizar' : 'criar'} o artigo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label>Título *</Label>
                <Input
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="Título do artigo"
                />
              </div>

              {/* Slug */}
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  placeholder="url-do-artigo"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label>Resumo</Label>
                <Textarea
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Breve descrição do artigo"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div>
                <Label>Conteúdo do Artigo</Label>
                <TiptapEditor
                  content={editingPost.content}
                  onChange={(content) => {
                    setEditingPost(prev => {
                      if (!prev) return prev;
                      return { ...prev, content };
                    });
                  }}
                />
              </div>

              {/* Author and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Autor</Label>
                  <Select 
                    value={editingPost.author} 
                    onValueChange={(value) => setEditingPost({ ...editingPost, author: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map(author => (
                        <SelectItem key={author} value={author}>{author}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select 
                    value={editingPost.category} 
                    onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={editingPost.tags.join(', ')}
                  onChange={(e) => setEditingPost({ 
                    ...editingPost, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              {/* Cover Image */}
              <div>
                <Label>URL da Imagem de Capa</Label>
                <Input
                  value={editingPost.cover_image || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Published */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingPost.published}
                  onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                  className="w-4 h-4"
                  aria-label="Publicar artigo"
                />
                <Label htmlFor="published">Publicar artigo</Label>
              </div>

              {/* Info sobre salvamento */}
              <div className="text-sm text-gray-500 italic pt-2 border-t">
                💡 Use os botões flutuantes no canto inferior direito para salvar ou cancelar
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
