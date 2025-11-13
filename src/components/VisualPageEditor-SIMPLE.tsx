import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, Edit3, Save, X } from 'lucide-react';
import { triggerRefresh, setEditLock } from '@/hooks/useLocaleTexts';
import { API_ENDPOINTS } from '@/config/api';

interface VisualPageEditorProps {
  pageComponent: React.ComponentType;
  pageName: string;
  pageId: string;
}

interface EditableField {
  key: string;
  originalValue: string;
  currentValue: string;
  isModified: boolean;
}

export default function VisualPageEditor({ 
  pageComponent: PageComponent, 
  pageName, 
  pageId
}: VisualPageEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<EditableField[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const isSaving = useRef(false);
  
  const localEdits = useRef<Map<string, string>>(new Map());
  const hasChanges = fields.some(f => f.isModified);
  
  useEffect(() => {
    const savedMessage = sessionStorage.getItem('visualEditorMessage');
    if (savedMessage) {
      try {
        const parsedMessage = JSON.parse(savedMessage);
        setMessage(parsedMessage);
        sessionStorage.removeItem('visualEditorMessage');
        setTimeout(() => setMessage(null), 8000);
      } catch (e) {
        console.error('Error parsing saved message:', e);
      }
    }
  }, []);

  useEffect(() => {
    setFields([]);
    localEdits.current.clear();
    setEditLock(pageId, false);
  }, [pageId]);

  useEffect(() => {
    return () => {
      setEditLock(pageId, false);
    };
  }, [pageId]);

  useEffect(() => {
    if (!isEditMode) return;

    const styleId = 'visual-editor-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        [data-editable] {
          box-sizing: border-box !important;
        }
        [data-editable]:hover {
          position: relative;
          z-index: 1;
        }
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .toast-notification {
          animation: slideInFromTop 0.5s ease-out;
        }
      `;
      document.head.appendChild(style);
    }

    const addEditableAttributes = () => {
      let pageContainer = document.querySelector('.border-4.border-dashed.border-amber-400');
      
      if (!pageContainer) {
        const allCards = Array.from(document.querySelectorAll('.space-y-4 > *'));
        pageContainer = allCards[allCards.length - 1] as HTMLElement;
      }
      
      if (!pageContainer) {
        console.error('❌ Page container not found');
        return;
      }

      const processedIds = new Set<string>();
      let editableCount = 0;
      
      const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label'];

      selectors.forEach(selector => {
        const elements = pageContainer.querySelectorAll(selector);
        
        elements.forEach((el, index) => {
          const htmlEl = el as HTMLElement;
          
          if (htmlEl.hasAttribute('data-editable')) return;
          if (htmlEl.closest('input, textarea, select, [role="navigation"]')) return;
          
          const computedStyle = window.getComputedStyle(htmlEl);
          if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') return;
          
          const rect = htmlEl.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const textContent = htmlEl.textContent?.trim() || '';
          let elementId = htmlEl.getAttribute('data-json-key');
          
          if (elementId && processedIds.has(elementId)) {
            elementId = `${elementId}_dup_${index}`;
          }
          
          if (!elementId) {
            const contentHash = textContent.substring(0, 30).replace(/[^a-z0-9]/gi, '_');
            elementId = `${pageId}_${htmlEl.tagName.toLowerCase()}_${contentHash}_${index}`;
          }
          
          processedIds.add(elementId);
          htmlEl.setAttribute('data-editable', elementId);
          editableCount++;

          const field = fields.find(f => f.key === elementId);
          if (field && field.currentValue) {
            htmlEl.textContent = field.currentValue;
          }
        });
      });
      
      console.log(`📝 Total editable elements found: ${editableCount}`);
      
      if (fields.length === 0) {
        const capturedFields: EditableField[] = [];
        document.querySelectorAll('[data-editable]').forEach((el) => {
          const key = el.getAttribute('data-editable');
          if (key) {
            const textValue = (el as HTMLElement).textContent || '';
            capturedFields.push({
              key,
              originalValue: textValue,
              currentValue: textValue,
              isModified: false
            });
          }
        });
        setFields(capturedFields);
      }
    };

    setTimeout(() => addEditableAttributes(), 500);
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (document.querySelector('.visual-editor-textarea')) return;
      
      let currentElement: HTMLElement | null = target;
      const editableCandidates: HTMLElement[] = [];
      
      while (currentElement && currentElement !== document.body) {
        if (currentElement.hasAttribute('data-editable')) {
          editableCandidates.push(currentElement);
        }
        currentElement = currentElement.parentElement;
      }
      
      let editableElement = editableCandidates[0];
      
      if (editableCandidates.length > 1) {
        const withJsonKey = editableCandidates.find(el => el.hasAttribute('data-json-key'));
        if (withJsonKey) editableElement = withJsonKey;
      }
      
      if (editableElement) {
        e.preventDefault();
        e.stopPropagation();
        
        const elementId = editableElement.getAttribute('data-editable');
        if (!elementId) return;

        setSelectedElement(elementId);
        const currentText = editableElement.textContent || '';
        
        const overlay = document.createElement('div');
        overlay.className = 'visual-editor-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9998;backdrop-filter:blur(2px)';
        
        const rect = editableElement.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        const editorContainer = document.createElement('div');
        editorContainer.className = 'visual-editor-container';
        editorContainer.style.cssText = `position:absolute;top:${rect.top + scrollY - 60}px;left:${rect.left + scrollX}px;width:${Math.max(rect.width, 300)}px;z-index:9999;background:white;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.3);padding:12px`;
        
        const title = document.createElement('div');
        title.textContent = `Editor: ${editableElement.tagName.toLowerCase()}`;
        title.style.cssText = 'font-size:14px;font-weight:bold;color:#333;margin-bottom:12px;border-bottom:2px solid #CFAF5A;padding-bottom:8px';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'visual-editor-textarea';
        const field = fields.find(f => f.key === elementId);
        textarea.value = field?.currentValue || currentText;
        textarea.style.cssText = `width:100%;min-height:${Math.max(rect.height, 80)}px;padding:8px;font-size:13px;font-family:inherit;border:2px solid #CFAF5A;border-radius:4px;resize:vertical;outline:none`;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:12px';
        
        const okButton = document.createElement('button');
        okButton.textContent = '✓ OK';
        okButton.style.cssText = 'padding:6px 16px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '✕ Cancelar';
        cancelButton.style.cssText = 'padding:6px 12px;background:#6b7280;color:white;border:none;border-radius:4px;cursor:pointer';
        
        const saveEdit = () => {
          const newText = textarea.value;
          let saveKey = elementId.replace(/_dup_\d+$/, '');
          
          editableElement.textContent = newText;
          localEdits.current.set(saveKey, newText);
          setEditLock(pageId, true);
          
          setFields(prev => {
            const updated = [...prev];
            const fieldIndex = updated.findIndex(f => f.key === saveKey);
            if (fieldIndex >= 0) {
              updated[fieldIndex] = {
                ...updated[fieldIndex],
                currentValue: newText,
                isModified: updated[fieldIndex].originalValue !== newText
              };
            }
            return updated;
          });
          
          cleanup();
        };
        
        const cancelEdit = () => cleanup();
        
        const cleanup = () => {
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          if (document.body.contains(editorContainer)) document.body.removeChild(editorContainer);
          setSelectedElement(null);
        };
        
        okButton.addEventListener('click', saveEdit);
        cancelButton.addEventListener('click', cancelEdit);
        overlay.addEventListener('click', cancelEdit);
        
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
          } else if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            saveEdit();
          }
        });
        
        const hint = document.createElement('div');
        hint.textContent = 'Ctrl+Enter para salvar | Esc para cancelar';
        hint.style.cssText = 'font-size:10px;color:#999;margin-top:8px;text-align:center';
        
        buttonContainer.appendChild(okButton);
        buttonContainer.appendChild(cancelButton);
        editorContainer.appendChild(title);
        editorContainer.appendChild(textarea);
        editorContainer.appendChild(buttonContainer);
        editorContainer.appendChild(hint);
        
        document.body.appendChild(overlay);
        document.body.appendChild(editorContainer);
        
        textarea.focus();
        textarea.select();
      }
    };

    const addEditableHighlights = () => {
      const editables = document.querySelectorAll('[data-editable]');
      
      editables.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.cssText += ';cursor:pointer;outline:1px dashed rgba(207,175,90,0.5);transition:all 0.2s';
        
        const handleMouseEnter = () => {
          htmlEl.style.outline = '2px solid rgba(207,175,90,0.9)';
          htmlEl.style.backgroundColor = 'rgba(207,175,90,0.15)';
        };
        
        const handleMouseLeave = () => {
          htmlEl.style.outline = '1px dashed rgba(207,175,90,0.5)';
          htmlEl.style.backgroundColor = 'transparent';
        };
        
        htmlEl.addEventListener('mouseenter', handleMouseEnter);
        htmlEl.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    document.addEventListener('click', handleClick, true);
    
    setTimeout(() => addEditableHighlights(), 100);
    setTimeout(() => addEditableHighlights(), 500);
    setTimeout(() => addEditableHighlights(), 1000);

    return () => {
      document.removeEventListener('click', handleClick, true);
      
      const style = document.getElementById('visual-editor-styles');
      if (style) style.remove();
      
      const overlay = document.querySelector('.visual-editor-overlay');
      const container = document.querySelector('.visual-editor-container');
      if (overlay && document.body.contains(overlay)) document.body.removeChild(overlay);
      if (container && document.body.contains(container)) document.body.removeChild(container);
      
      const editables = document.querySelectorAll('[data-editable]');
      editables.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.cursor = '';
        htmlEl.style.outline = '';
        htmlEl.style.backgroundColor = '';
        htmlEl.removeAttribute('data-editable');
      });
    };
  }, [isEditMode, fields, pageId]);

  const handleSave = async () => {
    if (isSaving.current) return;
    isSaving.current = true;
    
    try {
      const modifiedFields = fields.filter(f => f.isModified);
      const textEdits: Record<string, { newText: string }> = {};
      
      modifiedFields.forEach(field => {
        textEdits[field.key] = { newText: field.currentValue };
      });
      
      if (Object.keys(textEdits).length > 0) {
        const response = await fetch(API_ENDPOINTS.saveVisualEdits, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId, edits: textEdits })
        });
        
        if (!response.ok) {
          throw new Error(`API retornou status ${response.status}`);
        }
      }
      
      localEdits.current.clear();
      setEditLock(pageId, false);
      triggerRefresh(pageId);
      
      setMessage({ type: 'success', text: `✓ ${Object.keys(textEdits).length} alterações salvas!` });
      
      setTimeout(() => {
        setFields(prev => prev.map(f => ({
          ...f,
          originalValue: f.currentValue,
          isModified: false
        })));
        setMessage(null);
        setIsEditMode(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: '✗ Erro ao salvar' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      isSaving.current = false;
    }
  };

  const handleCancelClick = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      performCancel();
    }
  };

  const performCancel = () => {
    localEdits.current.clear();
    
    fields.forEach(field => {
      const element = document.querySelector(`[data-editable="${field.key}"]`) as HTMLElement;
      if (element && element.textContent !== field.originalValue) {
        element.textContent = field.originalValue;
      }
    });
    
    setFields(prev => prev.map(f => ({ ...f, currentValue: f.originalValue, isModified: false })));
    setIsEditMode(false);
    setSelectedElement(null);
    setShowCancelDialog(false);
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="fixed top-4 right-4 z-10000 toast-notification">
          <Alert className={`${
            message.type === 'success' 
              ? 'bg-green-500 border-green-600 text-white shadow-2xl' 
              : 'bg-red-500 border-red-600 text-white shadow-2xl'
          } min-w-[400px] max-w-[600px]`}>
            <AlertDescription className="text-white font-semibold text-base">
              {message.text}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#CFAF5A] hover:bg-[#B38938] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Edit3 className="w-5 h-5" />
            <span>Ativar Edição</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg transition-all ${
                hasChanges 
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-5 h-5" />
              <span>Salvar</span>
            </button>
            <button
              onClick={handleCancelClick}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full shadow-lg transition-all"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </button>
          </>
        )}
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
            <h3 className="text-xl font-bold mb-4">Descartar Alterações?</h3>
            <p className="text-gray-600 mb-6">
              Você tem {fields.filter(f => f.isModified).length} alteração(ões) não salvas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-6 py-2.5 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200"
              >
                Continuar Editando
              </button>
              <button
                onClick={performCancel}
                className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={isEditMode ? 'border-4 border-dashed border-amber-400 rounded-lg' : ''}>
        <PageComponent />
      </div>
    </div>
  );
}
