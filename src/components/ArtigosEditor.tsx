import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TiptapEditor from '@/components/TiptapEditor';
import { API_ENDPOINTS } from '@/config/api';

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
import type { ArtigoPost, ArtigoClasse, ArtigoCategoria, CategoriaTree } from '@/types/artigos';

type EditorState = 'VIEWING' | 'EDITING' | 'SAVING' | 'CREATING';

const STORAGE_KEYS = {
  ADMIN_TAB: 'adminConsole_activeTab',  // Aba do AdminConsole (pages/artigos/styles)
  DRAFT_PREFIX: 'artigosEditor_draft_',
  SCROLL_POSITION: 'artigosEditor_scrollPos'
};

export default function ArtigosEditor() {
  const [posts, setPosts] = useState<ArtigoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClasse, setFilterClasse] = useState<string>('all');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingPost, setEditingPost] = useState<ArtigoPost | null>(null);
  const [originalPost, setOriginalPost] = useState<ArtigoPost | null>(null);
  const [editorState, setEditorState] = useState<EditorState>('VIEWING');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Novo: classes e categorias do banco
  const [classesTree, setClassesTree] = useState<CategoriaTree[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  
  const isSaving = useRef(false);
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const manualStateChange = useRef(false);

  // Computed: tem mudanças pendentes?
  const hasChanges = editorState === 'EDITING' || editorState === 'CREATING';

  const authors = ['Igreja Metatron', 'Instituto Metatron'];

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Carregar árvore de classes e categorias
  const loadClassesTree = async () => {
    try {
      const { data: classes, error: classesError } = await supabase
        .from('artigos_classes')
        .select('*')
        .order('ordem', { ascending: true });

      if (classesError) throw classesError;

      const { data: categorias, error: categoriasError } = await supabase
        .from('artigos_categorias')
        .select('*')
        .order('ordem', { ascending: true });

      if (categoriasError) throw categoriasError;

      // Montar árvore
      const tree: CategoriaTree[] = (classes || []).map(classe => ({
        classe,
        categorias: (categorias || []).filter(cat => cat.classe_id === classe.id)
      }));

      setClassesTree(tree);
    } catch (error) {
      console.error('Erro ao carregar classes/categorias:', error);
      showMessage('error', 'Erro ao carregar categorias');
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      // Carregar artigos com suas categorias (modificação mais recente primeiro)
      const { data: artigos, error: artigosError } = await supabase
        .from('artigos')
        .select('*')
        .order('updated_at', { ascending: false });

      if (artigosError) throw artigosError;

      // Para cada artigo, buscar suas categorias
      const artigosComCategorias = await Promise.all(
        (artigos || []).map(async (artigo) => {
          const { data: relacoes } = await supabase
            .from('artigos_categorias_rel')
            .select(`
              categoria_id,
              artigos_categorias (
                id,
                nome,
                slug,
                classe_id,
                artigos_classes (
                  id,
                  nome,
                  slug
                )
              )
            `)
            .eq('artigo_id', artigo.id);

          const categorias = relacoes?.map(r => r.artigos_categorias).filter(Boolean) || [];
          const categorias_ids = relacoes?.map(r => r.categoria_id) || [];

          return {
            ...artigo,
            categorias,
            categorias_ids
          };
        })
      );

      setPosts(artigosComCategorias);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      showMessage('error', 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  // Carregar posts, classes e restaurar estado do localStorage
  useEffect(() => {
    loadClassesTree();
    loadPosts();
    
    // Restaurar aba ativa após refresh
    const savedTab = localStorage.getItem(STORAGE_KEYS.ADMIN_TAB);
    if (savedTab === 'artigos') {
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

    // Comparar post E categorias selecionadas
    const postChanged = JSON.stringify(editingPost) !== JSON.stringify(originalPost);
    const categoriasChanged = JSON.stringify(selectedCategorias.sort()) !== JSON.stringify((originalPost.categorias_ids || []).sort());
    const changed = postChanged || categoriasChanged;
    
    if (changed) {
      setEditorState(editingPost.id ? 'EDITING' : 'CREATING');
      // Salvar rascunho no localStorage
      saveDraft(editingPost, originalPost);
    } else {
      setEditorState('VIEWING');
      // Limpar rascunho se não há mudanças
      clearDraft(editingPost.id);
    }
  }, [editingPost, originalPost, selectedCategorias]);

  // Funções de persistência
  const saveDraft = (post: ArtigoPost, original: ArtigoPost) => {
    const draftKey = `${STORAGE_KEYS.DRAFT_PREFIX}${post.id || 'new'}`;
    localStorage.setItem(draftKey, JSON.stringify({ post, original, timestamp: Date.now() }));
    localStorage.setItem(STORAGE_KEYS.ADMIN_TAB, 'artigos');
  };

  const clearDraft = (postId: string) => {
    const draftKey = `${STORAGE_KEYS.DRAFT_PREFIX}${postId || 'new'}`;
    localStorage.removeItem(draftKey);
  };

  const clearAllDrafts = () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_KEYS.DRAFT_PREFIX))
      .forEach(k => localStorage.removeItem(k));
    // Não remove ADMIN_TAB aqui - deixa o usuário na aba artigos
  };

  const handleNewPost = () => {
    // Verificar se há mudanças não salvas
    if (editorState === 'EDITING' || editorState === 'CREATING') {
      if (!confirm('Descartar alterações não salvas?')) {
        return;
      }
    }
    
    const newPost: ArtigoPost = {
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Igreja Metatron',
      tags: [],
      cover_image: '',
      published_at: null, // Rascunho por padrão
      archived_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      categorias: [],
      categorias_ids: []
    };
    
    setEditingPost(newPost);
    setOriginalPost(JSON.parse(JSON.stringify(newPost)));
    setSelectedCategorias([]);
    setEditorState('CREATING');
  };

  const handleEditPost = (post: ArtigoPost) => {
    // Verificar se há mudanças não salvas
    if (editorState === 'EDITING' || editorState === 'CREATING') {
      if (!confirm('Descartar alterações não salvas?')) {
        return;
      }
    }
    
    setEditingPost(post);
    setOriginalPost(JSON.parse(JSON.stringify(post)));
    setSelectedCategorias(post.categorias_ids || []);
    setEditorState('VIEWING');
    localStorage.setItem(STORAGE_KEYS.ADMIN_TAB, 'artigos');
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
      setSelectedCategorias([]);
      setEditorState('VIEWING');
      // Manter na aba artigos mesmo ao fechar
      return;
    }
    
    // Se está editando, fazer UNDO: restaurar dados originais e voltar para VIEWING
    if (editorState === 'EDITING') {
      // Restaurar dados originais
      const restored = JSON.parse(JSON.stringify(originalPost));
      setEditingPost(restored);
      setSelectedCategorias(restored.categorias_ids || []);
      clearDraft(editingPost.id);
      setEditorState('VIEWING');
      showMessage('success', 'Alterações descartadas');
      return;
    }
    
    // Se está em VIEWING (clicou "Voltar"), apenas fechar o editor
    clearAllDrafts();
    setEditingPost(null);
    setSelectedCategorias([]);
    setOriginalPost(null);
    setEditorState('VIEWING');
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    try {
      const { error } = await supabase
        .from('artigos')
        .delete()
        .eq('id', id);

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

    if (selectedCategorias.length === 0) {
      showMessage('error', 'Selecione pelo menos uma categoria');
      setEditorState(editingPost.id ? 'EDITING' : 'CREATING');
      isSaving.current = false;
      return;
    }

    // Validação: artigo não pode ser publicado sem categorias
    if (editingPost.published_at !== null && selectedCategorias.length === 0) {
      showMessage('error', 'Artigo não pode ser publicado sem categorias. Marque como Rascunho ou adicione categorias.');
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
        // Atualizar post existente
        const updateData = {
          title: editingPost.title,
          slug: editingPost.slug,
          excerpt: editingPost.excerpt,
          content: editingPost.content,
          author: editingPost.author,
          tags: editingPost.tags,
          cover_image: editingPost.cover_image,
          published_at: editingPost.published_at,
          archived_at: editingPost.archived_at,
          updated_at: new Date().toISOString()
        };

        // Atualizar artigo no Supabase
        const { error: updateError } = await supabase
          .from('artigos')
          .update(updateData)
          .eq('id', editingPost.id);

        if (updateError) throw updateError;

        // Atualizar categorias: deletar antigas e inserir novas
        const { error: deleteError } = await supabase
          .from('artigos_categorias_rel')
          .delete()
          .eq('artigo_id', editingPost.id);

        if (deleteError) throw deleteError;

        const categoriasRel = selectedCategorias.map(catId => ({
          artigo_id: editingPost.id,
          categoria_id: catId
        }));

        const { error: insertError } = await supabase
          .from('artigos_categorias_rel')
          .insert(categoriasRel);

        if (insertError) throw insertError;
        
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
          .from('artigos')
          .insert({
            title: editingPost.title,
            slug: editingPost.slug,
            excerpt: editingPost.excerpt,
            content: editingPost.content,
            author: editingPost.author,
            tags: editingPost.tags,
            cover_image: editingPost.cover_image,
            published_at: editingPost.published_at,
            archived_at: editingPost.archived_at
          })
          .select()
          .single();

        if (error) throw error;

        // Inserir categorias no relacionamento N:N
        if (data) {
          const categoriasRel = selectedCategorias.map(catId => ({
            artigo_id: data.id,
            categoria_id: catId
          }));

          const { error: insertCatError } = await supabase
            .from('artigos_categorias_rel')
            .insert(categoriasRel);

          if (insertCatError) throw insertCatError;
        }
        
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

  // Recomputar filteredPosts quando filtros ou posts mudarem
  const filteredPosts = React.useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por classe
      const matchesClasse = filterClasse === 'all' || 
                           post.categorias?.some(cat => cat.classe_id === filterClasse);
      
      // Filtro por categoria
      const matchesCategoria = filterCategoria === 'all' || 
                              post.categorias_ids?.includes(filterCategoria);
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'published' && post.published_at !== null && post.archived_at === null) ||
                           (filterStatus === 'draft' && post.published_at === null) ||
                           (filterStatus === 'archived' && post.archived_at !== null);
      
      return matchesSearch && matchesClasse && matchesCategoria && matchesStatus;
    });
  }, [posts, searchTerm, filterClasse, filterCategoria, filterStatus]);

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
        <div className="fixed top-4 right-4 z-10000 animate-in slide-in-from-top duration-500">
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
        <div className="fixed top-4 left-4 z-9999">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm animate-pulse">
            ⚠️ Alterações não salvas
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Editor de Artigos</h2>
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
              <Label>Organização</Label>
              <Select value={filterClasse} onValueChange={setFilterClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as organizações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as organizações</SelectItem>
                  {classesTree.map(tree => (
                    <SelectItem key={tree.classe.id} value={tree.classe.id}>{tree.classe.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={filterCategoria} onValueChange={setFilterCategoria} disabled={filterClasse === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {classesTree
                    .find(tree => tree.classe.id === filterClasse)
                    ?.categorias.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
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
                  <SelectItem value="archived">Arquivados</SelectItem>
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
                      <Badge className={
                        post.archived_at !== null 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : post.published_at !== null 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      }>
                        {post.archived_at !== null ? 'Arquivado' : post.published_at !== null ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      {(!post.categorias || post.categorias.length === 0) && (
                        <Badge variant="destructive" className="text-xs">⚠️ Sem categoria</Badge>
                      )}
                      {post.categorias?.map(cat => (
                        <Badge key={cat.id} variant="outline">{cat.nome}</Badge>
                      ))}
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

      {/* Editor Form - Modal */}
      <Dialog open={!!editingPost} onOpenChange={(open) => {
        if (!open) {
          handleCancelEdit();
        }
      }}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingPost?.id ? 'Editar Artigo' : 'Novo Artigo'}
              </DialogTitle>
              <DialogDescription className="text-base">
                Preencha os campos abaixo para {editingPost?.id ? 'atualizar' : 'criar'} o artigo
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {editingPost && (
            <div className="space-y-6 px-6 py-4">
              {/* Primeira linha: Informações Básicas + Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Esquerda: Informações Básicas (2/3) */}
                <div className="lg:col-span-2 border rounded-lg p-4 bg-gray-50/50">
                  <h3 className="font-semibold text-sm text-gray-700 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Informações Básicas
                  </h3>
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <Label>Título *</Label>
                      <Input
                        value={editingPost.title || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        placeholder="Título do artigo"
                        className="bg-white"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <Label>Slug (URL)</Label>
                      <Input
                        value={editingPost.slug || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        placeholder="url-do-artigo"
                        className="bg-white"
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
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Status do Artigo (1/3) */}
                <div className="lg:col-span-1 border rounded-lg p-4 bg-gray-50/50">
                  <h3 className="font-semibold text-sm text-gray-700 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Status do Artigo
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                      <input
                        type="radio"
                        name="articleStatus"
                        checked={editingPost.published_at === null && editingPost.archived_at === null}
                        onChange={() => setEditingPost({ ...editingPost, published_at: null, archived_at: null })}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-yellow-500 text-black text-xs">Rascunho</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Visível apenas para editores</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                      <input
                        type="radio"
                        name="articleStatus"
                        checked={editingPost.published_at !== null && editingPost.archived_at === null}
                        onChange={() => setEditingPost({ 
                          ...editingPost, 
                          published_at: new Date().toISOString(), 
                          archived_at: null 
                        })}
                        className="w-4 h-4 mt-1"
                        disabled={selectedCategorias.length === 0}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-green-600 text-white text-xs">Publicado</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Visível para todos</p>
                        {selectedCategorias.length === 0 && (
                          <p className="text-xs text-red-500 mt-1">⚠️ Requer categoria</p>
                        )}
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                      <input
                        type="radio"
                        name="articleStatus"
                        checked={editingPost.archived_at !== null}
                        onChange={() => setEditingPost({ 
                          ...editingPost, 
                          archived_at: new Date().toISOString()
                        })}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-gray-600 text-white text-xs">Arquivado</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Oculto das listagens</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Metadados: Autor, Categorias, Tags, Imagem */}
              <div className="border rounded-lg p-4 bg-blue-50/30">
                <h3 className="font-semibold text-sm text-gray-700 mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Metadados e Categorização
                </h3>
                <div className="space-y-4">
                  {/* Author */}
                  <div>
                    <Label>Autor</Label>
                    <Select 
                      value={editingPost.author} 
                      onValueChange={(value) => setEditingPost({ ...editingPost, author: value })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map(author => (
                          <SelectItem key={author} value={author}>{author}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Categorias (múltiplas) */}
                  <div>
                    <Label>Categorias por Organização (selecione uma ou mais)</Label>
                    <p className="text-xs text-gray-500 mb-2">As categorias são organizadas por instituição. Selecione apenas categorias de UMA organização.</p>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-4 bg-white">
                      {classesTree.map(tree => (
                        <div key={tree.classe.id}>
                          <h4 className="font-semibold text-sm mb-2 text-[#CFAF5A]">{tree.classe.nome}</h4>
                          <div className="space-y-2 pl-4">
                            {tree.categorias.map(cat => {
                              // Verificar se já há categorias selecionadas de outra organização
                              const selectedClasseId = selectedCategorias.length > 0
                                ? classesTree.find(t => 
                                    t.categorias.some(c => selectedCategorias.includes(c.id))
                                  )?.classe.id
                                : null;
                              
                              const isDisabled = selectedClasseId && selectedClasseId !== tree.classe.id;
                              
                              return (
                                <label 
                                  key={cat.id} 
                                  className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedCategorias.includes(cat.id)}
                                    disabled={isDisabled}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCategorias([...selectedCategorias, cat.id]);
                                      } else {
                                        setSelectedCategorias(selectedCategorias.filter(id => id !== cat.id));
                                      }
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">{cat.nome}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedCategorias.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">Selecione pelo menos uma categoria</p>
                    )}
                  </div>

                  {/* Tags e Cover Image em grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="bg-white"
                      />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <Label>URL da Imagem de Capa</Label>
                      <Input
                        value={editingPost.cover_image || ''}
                        onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                        placeholder="https://..."
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="border rounded-lg p-4 bg-purple-50/30">
                <h3 className="font-semibold text-sm text-gray-700 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Conteúdo do Artigo
                </h3>
                <div className="bg-white rounded-lg">
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
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t bg-white -mx-6 px-6 pb-6 sticky bottom-0">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={editorState === 'SAVING'}
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSavePost}
                  disabled={editorState === 'SAVING'}
                  className="bg-[#CFAF5A] hover:bg-[#B89B4A]"
                  size="lg"
                >
                  {editorState === 'SAVING' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Artigo
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
