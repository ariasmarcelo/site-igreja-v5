import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VisualPageEditorProps {
  pageId: string;
  pageName: string;
  pageComponent: React.ComponentType;
}

interface EditField {
  id: string;           // ID único simples (edit-1, edit-2, etc.)
  jsonKey: string;      // Chave JSON original para API
  originalValue: string;
  currentValue: string;
  isModified: boolean;
}

interface HTMLElementWithHandlers extends HTMLElement {
  _hoverHandlers?: {
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
  };
}

interface WindowWithObserver extends Window {
  __editorObserver?: MutationObserver;
}

const VisualPageEditor = ({ pageId, pageComponent: PageComponent }: VisualPageEditorProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<EditField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    type: 'success' | 'confirm' | null;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, type: null, message: '', onConfirm: undefined });
  const activeEditorRef = useRef<HTMLDivElement | null>(null);
  const isEditModeRef = useRef(false);
  const idCounterRef = useRef(0);
  
  // Mapeamento ID -> Elemento DOM
  const elementMapRef = useRef<Map<string, { element: HTMLElement; jsonKey: string }>>(new Map());

  // 🔄 Função para recarregar elementos salvos do banco
  const refreshSavedElements = async (items: Array<{id: string; jsonKey: string}>) => {
    console.log(`🔄 Refreshing ${items.length} elements from database...`);
    
    try {
      const response = await fetch(`/api/content/${pageId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.content) {
        throw new Error('Invalid response format');
      }
      
      const pageData = data.content;
      
      console.log('📦 Page data received:', pageData);
      
      // Atualizar DOM com dados frescos do banco
      items.forEach(({id, jsonKey}) => {
        const element = document.querySelector(`[data-edit-id="${id}"]`);
        
        if (!element) {
          console.warn(`⚠️ Element not found for ID: ${id}, JSON Key: ${jsonKey}`);
          return;
        }
        
        // Remover prefixo pageId da jsonKey se presente
        let cleanKey = jsonKey;
        if (jsonKey.startsWith(`${pageId}.`)) {
          cleanKey = jsonKey.substring(pageId.length + 1);
          console.log(`🔧 Cleaned key: ${jsonKey} → ${cleanKey}`);
        }
        
        // Navegar pela estrutura do objeto para chaves aninhadas como "treatments[0].details"
        let value = pageData;
        const parts = cleanKey.split('.');
        
        for (const part of parts) {
          // Lidar com arrays: "treatments[0]" -> ["treatments", "0"]
          const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
          if (arrayMatch) {
            const [, arrayName, index] = arrayMatch;
            value = value?.[arrayName]?.[parseInt(index)];
          } else {
            value = value?.[part];
          }
          
          if (value === undefined) {
            console.warn(`⚠️ Value not found for JSON Key: ${jsonKey} (cleaned: ${cleanKey})`);
            return;
          }
        }
        
        if (typeof value === 'string') {
          element.textContent = value;
          
          // 🎨 REMOVER estilos de "modificado" e restaurar visual de edição normal
          const htmlElement = element as HTMLElement;
          htmlElement.style.background = '';
          htmlElement.style.outline = '3px dashed #CFAF5A';
          htmlElement.style.outlineOffset = '4px';
          
          console.log(`✅ Refreshed ID ${id} (${jsonKey}): "${value.substring(0, 100)}..."`);
        } else {
          console.warn(`⚠️ Value for ${jsonKey} is not a string:`, value);
        }
      });
      
      console.log('✅ All elements refreshed from database');
    } catch (error) {
      console.error('❌ Error refreshing elements:', error);
    }
  };

  // 🎨 Adicionar seleção visual a um elemento específico
  const addSelectionToElement = (htmlEl: HTMLElement) => {
    const jsonKey = htmlEl.getAttribute('data-json-key');
    if (!jsonKey) return;
    
    // Verificar se já tem ID (evitar duplicação)
    if (htmlEl.hasAttribute('data-edit-id')) return;
    
    // Atribuir ID único simples
    const uniqueId = `edit-${++idCounterRef.current}`;
    htmlEl.setAttribute('data-edit-id', uniqueId);
    
    // Salvar no mapeamento
    elementMapRef.current.set(uniqueId, { element: htmlEl, jsonKey });
    
    // Estilo de seleção visual destacado
    htmlEl.style.cursor = 'pointer';
    htmlEl.style.outline = '3px dashed #CFAF5A';
    htmlEl.style.outlineOffset = '4px';
    htmlEl.style.transition = 'all 0.2s ease';
    htmlEl.style.position = 'relative';

    const handleMouseEnter = () => {
      htmlEl.style.outline = '3px solid #CFAF5A';
      htmlEl.style.backgroundColor = 'rgba(207, 175, 90, 0.15)';
      htmlEl.style.transform = 'scale(1.01)';
    };

    const handleMouseLeave = () => {
      htmlEl.style.outline = '3px dashed #CFAF5A';
      htmlEl.style.backgroundColor = '';
      htmlEl.style.transform = 'scale(1)';
    };

    htmlEl.addEventListener('mouseenter', handleMouseEnter);
    htmlEl.addEventListener('mouseleave', handleMouseLeave);
    
    (htmlEl as HTMLElementWithHandlers)._hoverHandlers = { handleMouseEnter, handleMouseLeave };
  };

  // 🎨 Adicionar seleção visual aos elementos
  const addVisualSelection = useCallback(() => {
    const editables = document.querySelectorAll('[data-json-key]');
    
    // Limpar mapeamento anterior
    elementMapRef.current.clear();
    idCounterRef.current = 0;
    
    editables.forEach(el => addSelectionToElement(el as HTMLElement));

    console.log(`✨ Visual selection added to ${editables.length} elements`);
    
    // 👁️ OBSERVER: Detectar novos elementos adicionados ao DOM (accordions, tabs, etc)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Se o elemento adicionado tem data-json-key
            if (element.hasAttribute('data-json-key')) {
              console.log(`🆕 Novo elemento detectado: ${element.getAttribute('data-json-key')}`);
              addSelectionToElement(element);
            }
            
            // Se o elemento tem filhos com data-json-key
            const children = element.querySelectorAll('[data-json-key]');
            children.forEach(child => {
              console.log(`🆕 Novo elemento filho detectado: ${child.getAttribute('data-json-key')}`);
              addSelectionToElement(child as HTMLElement);
            });
          }
        });
      });
    });
    
    // Observar toda a página
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Salvar observer para limpar depois
    (window as unknown as WindowWithObserver).__editorObserver = observer;
    
    console.log('👁️ MutationObserver ativado - detectando novos elementos dinamicamente');
  }, []);

  // 🧹 Remover seleção visual
  const removeVisualSelection = () => {
    const editables = document.querySelectorAll('[data-edit-id]');
    
    editables.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      const handlers = (htmlEl as HTMLElementWithHandlers)._hoverHandlers;
      if (handlers) {
        htmlEl.removeEventListener('mouseenter', handlers.handleMouseEnter);
        htmlEl.removeEventListener('mouseleave', handlers.handleMouseLeave);
        delete (htmlEl as HTMLElementWithHandlers)._hoverHandlers;
      }
      
      htmlEl.style.cursor = '';
      htmlEl.style.outline = '';
      htmlEl.style.outlineOffset = '';
      htmlEl.style.backgroundColor = '';
      htmlEl.style.transform = '';
      htmlEl.removeAttribute('data-edit-id');
    });
    
    // 🛑 Desconectar MutationObserver
    const windowWithObserver = window as unknown as WindowWithObserver;
    const observer = windowWithObserver.__editorObserver;
    if (observer) {
      observer.disconnect();
      delete windowWithObserver.__editorObserver;
      console.log('🛑 MutationObserver desconectado');
    }
    
    elementMapRef.current.clear();
    console.log('🧹 Visual selection removed');
  };

  // 📝 Abrir editor para um elemento
  const openEditor = (editId: string) => {
    const mapped = elementMapRef.current.get(editId);
    if (!mapped) {
      console.error('❌ Element not found for ID:', editId);
      return;
    }
    
    const { element, jsonKey } = mapped;
    // Fechar editor anterior se existir
    if (activeEditorRef.current) {
      activeEditorRef.current.remove();
      const existingOverlay = document.getElementById('editor-overlay');
      existingOverlay?.remove();
    }

    const currentText = element.textContent?.trim() || '';
    const hasText = currentText.length > 0;
    
    // 🔍 LOG DETALHADO para debugging
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 EDITOR OPENED');
    console.log('Edit ID:', editId);
    console.log('JSON Key:', jsonKey);
    console.log('Element tag:', element.tagName);
    console.log('Element classes:', element.className);
    console.log('Current text preview:', currentText.substring(0, 100) + '...');
    console.log('Text length:', currentText.length);
    console.log('Has text:', hasText);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.id = 'editor-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 9998;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.2s;
    `;

    // Criar container do editor
    const editor = document.createElement('div');
    editor.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      padding: 32px;
      min-width: 600px;
      max-width: 800px;
      animation: slideIn 0.3s;
    `;

    // Adicionar animações
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translate(-50%, -45%); opacity: 0; }
        to { transform: translate(-50%, -50%); opacity: 1; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
      }
    `;
    document.head.appendChild(style);

    // Título
    const title = document.createElement('div');
    title.textContent = hasText ? '✏️ Editor de Texto' : '⚠️ Elemento Não Editável';
    title.style.cssText = `
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      color: ${hasText ? '#333' : '#ef4444'};
    `;

    // Subtítulo com a key
    const subtitle = document.createElement('div');
    subtitle.textContent = jsonKey;
    subtitle.style.cssText = `
      font-size: 15px;
      color: #666;
      margin-bottom: 24px;
      font-family: 'Courier New', monospace;
      background: #f5f5f5;
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 4px solid #CFAF5A;
    `;

    if (!hasText) {
      // Mensagem para elementos sem texto
      const message = document.createElement('div');
      message.textContent = '❌ Este elemento não possui texto editável';
      message.style.cssText = `
        padding: 20px;
        background: #fef2f2;
        border: 2px solid #ef4444;
        border-radius: 8px;
        color: #991b1b;
        font-weight: 600;
        text-align: center;
        margin-bottom: 24px;
      `;

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Fechar (ESC)';
      closeButton.style.cssText = `
        width: 100%;
        padding: 12px 24px;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
        transition: background 0.2s;
      `;
      closeButton.onmouseover = () => closeButton.style.background = '#4b5563';
      closeButton.onmouseout = () => closeButton.style.background = '#6b7280';
      closeButton.onclick = cleanup;

      editor.appendChild(title);
      editor.appendChild(subtitle);
      editor.appendChild(message);
      editor.appendChild(closeButton);
    } else {
      // Editor com textarea
      const textarea = document.createElement('textarea');
      textarea.value = currentText;
      textarea.style.cssText = `
        width: 100%;
        min-height: 300px;
        padding: 16px;
        border: 3px solid #CFAF5A;
        border-radius: 8px;
        font-size: 18px;
        font-family: inherit;
        resize: vertical;
        margin-bottom: 24px;
        line-height: 1.6;
        transition: border-color 0.2s;
      `;
      textarea.focus();
      textarea.select();

      // Container de botões
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      `;

      // Botão OK
      const okButton = document.createElement('button');
      okButton.textContent = '✓ OK';
      okButton.style.cssText = `
        padding: 14px 32px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        font-size: 18px;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      `;
      okButton.onmouseover = () => {
        okButton.style.background = '#059669';
        okButton.style.transform = 'translateY(-2px)';
        okButton.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
      };
      okButton.onmouseout = () => {
        okButton.style.background = '#10b981';
        okButton.style.transform = 'translateY(0)';
        okButton.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
      };

      // Botão Cancelar
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '✕ Cancelar (ESC)';
      cancelButton.style.cssText = `
        padding: 14px 32px;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 18px;
        transition: all 0.2s;
      `;
      cancelButton.onmouseover = () => {
        cancelButton.style.background = '#4b5563';
        cancelButton.style.transform = 'translateY(-2px)';
      };
      cancelButton.onmouseout = () => {
        cancelButton.style.background = '#6b7280';
        cancelButton.style.transform = 'translateY(0)';
      };

      // Função de salvamento
      const saveEdit = () => {
        const newText = textarea.value.trim();
        
        // ⛔ VALIDAÇÃO: Impedir campo vazio
        if (!newText) {
          textarea.style.borderColor = '#ef4444';
          textarea.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.2)';
          textarea.style.animation = 'shake 0.4s';
          
          const errorMsg = document.createElement('div');
          errorMsg.textContent = '⚠️ O campo não pode ficar vazio!';
          errorMsg.style.cssText = `
            color: #ef4444;
            font-size: 14px;
            font-weight: 700;
            margin-top: -16px;
            margin-bottom: 16px;
            padding: 12px;
            background: #fef2f2;
            border-radius: 6px;
            border-left: 4px solid #ef4444;
            animation: shake 0.4s;
          `;
          
          buttonContainer.parentElement?.insertBefore(errorMsg, buttonContainer);
          
          setTimeout(() => {
            errorMsg.remove();
            textarea.style.borderColor = '#CFAF5A';
            textarea.style.boxShadow = '';
            textarea.style.animation = '';
          }, 3000);
          
          return;
        }
        
        console.log(`💡 PRÉVIA: Atualizando DOM com novo texto ANTES de salvar`);
        console.log(`   Elemento ID: ${editId}`);
        console.log(`   JSON Key: ${jsonKey}`);
        console.log(`   Texto anterior: "${currentText.substring(0, 60)}..."`);
        console.log(`   Texto novo: "${newText.substring(0, 60)}..."`);
        
        // 🎨 ATUALIZAR DOM IMEDIATAMENTE - PRÉVIA VISUAL
        element.textContent = newText;
        
        // Adicionar indicador visual de "modificado mas não salvo"
        element.style.background = 'rgba(251, 191, 36, 0.15)';
        element.style.outline = '3px solid #fbbf24';
        element.style.outlineOffset = '4px';
        
        console.log(`✅ DOM atualizado - prévia visual aplicada`);
        
        // Atualizar estado
        setFields(prev => {
          const updated = [...prev];
          const fieldIndex = updated.findIndex(f => f.id === editId);
          
          if (fieldIndex >= 0) {
            updated[fieldIndex] = {
              ...updated[fieldIndex],
              currentValue: newText,
              isModified: updated[fieldIndex].originalValue !== newText
            };
          } else {
            updated.push({
              id: editId,
              jsonKey,
              originalValue: currentText,
              currentValue: newText,
              isModified: currentText !== newText
            });
          }
          
          console.log(`📝 Estado atualizado: ${updated.filter(f => f.isModified).length} campos modificados`);
          return updated;
        });
        
        cleanup();
      };

      // Event listeners
      okButton.onclick = saveEdit;
      cancelButton.onclick = cleanup;
      
      // Atalhos de teclado
      textarea.onkeydown = (e) => {
        if (e.key === 'Escape') {
          cleanup();
        } else if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          saveEdit();
        } else if (e.key === 'Enter' && e.shiftKey) {
          // Shift+Enter insere quebra de linha
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;
          textarea.value = value.substring(0, start) + '\n' + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      };

      // Montar estrutura
      buttonContainer.appendChild(okButton);
      buttonContainer.appendChild(cancelButton);
      
      editor.appendChild(title);
      editor.appendChild(subtitle);
      editor.appendChild(textarea);
      editor.appendChild(buttonContainer);
    }

    // Função de limpeza
    function cleanup() {
      overlay.remove();
      editor.remove();
      activeEditorRef.current = null;
    }

    // Fechar ao clicar no overlay
    overlay.onclick = cleanup;
    editor.onclick = (e) => e.stopPropagation();

    // ESC fecha o editor
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(overlay);
    document.body.appendChild(editor);
    
    activeEditorRef.current = editor;
  };

  // 🖱️ Click handler para elementos
  const handleElementClick = useCallback((e: Event) => {
    if (!isEditModeRef.current) return;

    const mouseEvent = e as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    
    const editable = target.closest('[data-edit-id]') as HTMLElement;
    
    if (editable) {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      
      const editId = editable.getAttribute('data-edit-id');
      
      if (editId) {
        const mapped = elementMapRef.current.get(editId);
        console.log(`🎯 Opening editor for ID: ${editId}, JSON Key: ${mapped?.jsonKey}`);
        openEditor(editId);
      }
    }
  }, []);

  // 🔓 Ativar modo de edição
  const enableEditMode = useCallback(() => {
    console.log('🔓 Enabling edit mode...');
    setIsEditMode(true);
    isEditModeRef.current = true;
    addVisualSelection();
    
    document.addEventListener('click', handleElementClick as EventListener, true);
    
    console.log('✅ Edit mode ENABLED');
  }, [handleElementClick, addVisualSelection]);

  // 🔒 Desativar modo de edição
  const disableEditMode = useCallback(() => {
    console.log('🔒 Disabling edit mode...');
    setIsEditMode(false);
    isEditModeRef.current = false;
    removeVisualSelection();
    
    document.removeEventListener('click', handleElementClick as EventListener, true);
    
    if (activeEditorRef.current) {
      activeEditorRef.current.remove();
      activeEditorRef.current = null;
      const existingOverlay = document.getElementById('editor-overlay');
      existingOverlay?.remove();
    }
    
    console.log('🔒 Edit mode DISABLED');
  }, [handleElementClick]);

  // 💾 Salvar mudanças no banco
  const saveChanges = async () => {
    const modifiedFields = fields.filter(f => f.isModified);
    
    if (modifiedFields.length === 0) {
      setDialogState({
        open: true,
        type: 'success',
        message: 'Nenhuma mudança para salvar',
      });
      return;
    }

    console.log(`💾 Saving ${modifiedFields.length} changes...`);
    setIsSaving(true);

    try {
      const edits = modifiedFields.reduce((acc, field) => {
        acc[field.jsonKey] = { newText: field.currentValue };
        return acc;
      }, {} as Record<string, { newText: string }>);

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💾 SAVING TO DATABASE');
      console.log('Page ID:', pageId);
      console.log('Number of edits:', Object.keys(edits).length);
      modifiedFields.forEach((field, i) => {
        console.log(`\nEdit ${i + 1}:`);
        console.log('  ID:', field.id);
        console.log('  JSON Key:', field.jsonKey);
        console.log('  Original:', field.originalValue.substring(0, 80) + '...');
        console.log('  New:', field.currentValue.substring(0, 80) + '...');
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 Sending payload:', { pageId, edits });

      const response = await fetch(`/api/content/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edits })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Changes saved successfully:', result);
        
        // 🔄 REFRESH: Recarregar dados do banco e atualizar DOM
        await refreshSavedElements(modifiedFields.map(f => ({ id: f.id, jsonKey: f.jsonKey })));
        
        // Atualizar originalValue dos campos salvos
        setFields(prev => prev.map(f => 
          f.isModified ? { ...f, originalValue: f.currentValue, isModified: false } : f
        ));
        
        setDialogState({
          open: true,
          type: 'success',
          message: `✅ ${modifiedFields.length} mudanças salvas com sucesso!`,
        });
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      setDialogState({
        open: true,
        type: 'success',
        message: '❌ Erro ao salvar mudanças. Verifique o console.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 🚫 Cancelar todas as mudanças
  const cancelAllChanges = async () => {
    const modifiedFields = fields.filter(f => f.isModified);
    
    if (modifiedFields.length === 0) {
      setDialogState({
        open: true,
        type: 'success',
        message: 'Nenhuma mudança para cancelar',
      });
      return;
    }
    
    setDialogState({
      open: true,
      type: 'confirm',
      message: `Descartar ${modifiedFields.length} modificações não salvas?`,
      onConfirm: async () => {
    
    console.log(`🚫 Cancelando ${modifiedFields.length} mudanças...`);
    console.log('🔄 Recarregando dados frescos do banco de dados...');
    
    try {
      // 🔄 RECARREGAR DO BANCO: Buscar dados atualizados via API
      await refreshSavedElements(modifiedFields.map(f => ({ id: f.id, jsonKey: f.jsonKey })));
      
      // Limpar estado de campos modificados
      setFields(prev => prev.filter(f => !f.isModified));
      
      console.log('✅ DOM recarregado do banco de dados');
      console.log('✅ Todas as mudanças foram descartadas');
      setDialogState({
        open: true,
        type: 'success',
        message: '✅ Mudanças descartadas e dados recarregados do banco!',
      });
    } catch (error) {
      console.error('❌ Erro ao recarregar do banco:', error);
      setDialogState({
        open: true,
        type: 'success',
        message: '❌ Erro ao recarregar dados. Verifique o console.',
      });
    }
      },
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableEditMode();
    };
  }, [disableEditMode]);

  const modifiedCount = fields.filter(f => f.isModified).length;

  return (
    <>
      <PageComponent />
      
      {/* 🟡 BOTÃO FLUTUANTE AMARELO - EDITAR TEXTOS */}
      <button
        onClick={isEditMode ? disableEditMode : enableEditMode}
        className={`visual-editor-main-btn ${isEditMode ? 'edit-mode-active' : 'edit-mode-inactive'}`}
      >
        {isEditMode ? '🔒 DESATIVAR EDIÇÃO' : '✏️ EDITAR TEXTOS'}
      </button>

      {/* 🟢 BOTÃO FLUTUANTE VERDE - SALVAR */}
      {isEditMode && modifiedCount > 0 && (
        <>
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className={`visual-editor-save-btn ${isSaving ? 'saving' : 'active'}`}
          >
            {isSaving ? '⏳ SALVANDO...' : `💾 SALVAR ${modifiedCount} MUDANÇA${modifiedCount !== 1 ? 'S' : ''}`}
          </button>

          {/* 🔴 BOTÃO FLUTUANTE VERMELHO - CANCELAR */}
          <button
            onClick={cancelAllChanges}
            disabled={isSaving}
            className={`visual-editor-cancel-btn ${isSaving ? 'disabled' : 'active'}`}
          >
            🚫 CANCELAR {modifiedCount} MUDANÇA{modifiedCount !== 1 ? 'S' : ''}
          </button>
        </>
      )}

      {/* Dialog centralizado para confirmações e mensagens */}
      <Dialog open={dialogState.open} onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[425px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === 'success' ? 'Sucesso' : 'Confirmação'}
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              {dialogState.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {dialogState.type === 'confirm' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setDialogState(prev => ({ ...prev, open: false }))}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDialogState(prev => ({ ...prev, open: false }));
                    dialogState.onConfirm?.();
                  }}
                >
                  Confirmar
                </Button>
              </>
            ) : (
              <Button onClick={() => setDialogState(prev => ({ ...prev, open: false }))}>
                OK
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualPageEditor;
