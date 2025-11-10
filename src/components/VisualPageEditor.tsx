import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Eye, Edit3, Save, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { triggerRefresh, setEditLock } from '@/hooks/useLocaleTexts';

interface VisualPageEditorProps {
  pageComponent: React.ComponentType;
  pageName: string;
  pageId: string;
}

interface EditableField {
  key: string;           // data-editable attribute
  originalValue: string; // Valor original do DB/DOM
  currentValue: string;  // Valor atual (pode estar editado)
  isModified: boolean;   // Flag de modificação
}

export default function VisualPageEditor({ 
  pageComponent: PageComponent, 
  pageName, 
  pageId
}: VisualPageEditorProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [fields, setFields] = useState<EditableField[]>([]); // Nova estrutura de dados
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const isSaving = useRef(false);
  
  // Mapa de valores locais editados (sobrescreve valores do React até salvar)
  const localEdits = useRef<Map<string, string>>(new Map());
  
  // Computed: verificar se há mudanças
  const hasChanges = fields.some(f => f.isModified);
  
  useEffect(() => {
    // Recuperar mensagem do sessionStorage (se houver)
    const savedMessage = sessionStorage.getItem('visualEditorMessage');
    if (savedMessage) {
      try {
        const parsedMessage = JSON.parse(savedMessage);
        setMessage(parsedMessage);
        sessionStorage.removeItem('visualEditorMessage'); // Limpar após exibir
        setTimeout(() => setMessage(null), 8000); // Auto-ocultar após 8s (mais tempo)
      } catch (e) {
        console.error('Error parsing saved message:', e);
      }
    }

    // Verificar se deve retornar para a página anterior após reload
    const returnUrl = sessionStorage.getItem('visualEditorReturnUrl');
    if (returnUrl && returnUrl !== window.location.pathname) {
      sessionStorage.removeItem('visualEditorReturnUrl');
      // Só redirecionar se não estamos na página correta
      window.location.href = returnUrl;
    }
  }, []);

  useEffect(() => {
    // NÃO carregar edições do localStorage - sempre partir do zero
    // Isso garante que você vê as mudanças salvas nos arquivos JSON
    // console.log('🔄 Clearing any cached edits for fresh start');
    setFields([]);
    localEdits.current.clear(); // Limpar edições locais ao mudar de página
    setEditLock(pageId, false); // Garantir que lock está desativado ao trocar de página
  }, [pageId]);

  // Cleanup: desativar lock ao desmontar componente
  useEffect(() => {
    return () => {
      setEditLock(pageId, false);
      console.log('🧹 Cleanup: lock desativado');
    };
  }, [pageId]);

  useEffect(() => {
    // console.log('📌 useEffect triggered - isEditMode:', isEditMode);
    
    // Injetar CSS para outline não quebrar layout + animação de toast
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
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .toast-notification {
          animation: slideInFromTop 0.5s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
    
    if (!isEditMode) {
      // console.log('⏸️ Edit mode is OFF, skipping...');
      return;
    }

    // console.log('🚀 Edit mode is ON, starting setup...');

    // Adicionar data-editable automaticamente em elementos de texto
    const addEditableAttributes = () => {
      // console.log('🔍 Scanning for editable elements...');
      
      // Primeiro, tentar encontrar o container da página
      let pageContainer = document.querySelector('.border-4.border-dashed.border-amber-400');
      
      // Se não encontrar, buscar o container principal da página (após as toolbars)
      if (!pageContainer) {
        // console.log('Border container not found, trying main content...');
        // Pegar todos os elementos depois dos Cards de controle
        const allCards = Array.from(document.querySelectorAll('.space-y-4 > *'));
        // O último elemento é a página renderizada
        pageContainer = allCards[allCards.length - 1] as HTMLElement;
      }
      
      if (!pageContainer) {
        console.error('❌ Page container not found - cannot make elements editable');
        return;
      }

      // console.log('✓ Found page container:', pageContainer.tagName, pageContainer.className);

      const processedIds = new Set<string>();
      let editableCount = 0;
      const svgCounters: Record<string, number> = {}; // Contador para SVGs duplicados
      const jsonKeyCounters: Record<string, number> = {}; // Contador para data-json-key duplicados
      
      // Selecionar TODOS os elementos visíveis (não apenas texto)
      // Incluindo divs, sections, buttons, SVGs, etc.
      const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span', 'a', 'button',
        'div', 'section', 'article', 'header', 'footer', 'nav',
        'li', 'label', 'td', 'th',
        'svg' // TODOS os SVGs (incluindo Lucide-react)
      ];

      selectors.forEach(selector => {
        // Buscar apenas dentro do container da página
        const elements = pageContainer.querySelectorAll(selector);
        
        elements.forEach((el, index) => {
          const htmlEl = el as HTMLElement;
          
          // Ignorar se já tem data-editable
          if (htmlEl.hasAttribute('data-editable')) {
            return;
          }

          // REGRAS DE EXCLUSÃO
          // 1. Não está dentro de controles interativos (EXCETO se tem data-json-key explícito)
          // Permitir edição de spans com data-json-key dentro de buttons
          const hasExplicitJsonKey = htmlEl.hasAttribute('data-json-key');
          if (!hasExplicitJsonKey && htmlEl.closest('input, textarea, select, [role="navigation"]')) {
            return;
          }
          
          // 2. Não está dentro dos Cards de controle do editor (verificar ancestrais)
          // NOVO: verificar se está dentro de elementos com classe específica do editor (não apenas gradientes)
          let isInEditorUI = false;
          let parent = htmlEl.parentElement;
          let depth = 0;
          while (parent && depth < 10) {
            const parentClass = parent.className || '';
            // Verificar APENAS os cards específicos do editor (não elementos da página)
            // Cards do editor têm "space-y-4" E cores específicas
            const isEditorCard = (
              (parentClass.includes('space-y-4') && (
                (parentClass.includes('bg-amber-50') && parentClass.includes('border-amber-200')) ||
                (parentClass.includes('bg-green-50') && parentClass.includes('border-green-300')) ||
                (parentClass.includes('bg-blue-50') && parentClass.includes('border-blue-200'))
              )) ||
              // Ou contém classe específica do editor visual
              parentClass.includes('visual-editor-container') ||
              parentClass.includes('visual-editor-overlay')
            );
            
            if (isEditorCard) {
              isInEditorUI = true;
              break;
            }
            parent = parent.parentElement;
            depth++;
          }
          
          if (isInEditorUI) {
            // console.log('⊘ Skipping (in editor UI):', htmlEl.textContent?.substring(0, 30));
            return;
          }

          // 3. Elemento deve ser visível (não display:none, não hidden)
          const computedStyle = window.getComputedStyle(htmlEl);
          if (computedStyle.display === 'none' || 
              computedStyle.visibility === 'hidden' ||
              computedStyle.opacity === '0') {
            return;
          }

          // 4. Elemento deve ter algum tamanho (não pode ser 0x0)
          const rect = htmlEl.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            return;
          }

          // 5. Pegar texto (pode ser vazio para divs vazios)
          const textContent = htmlEl.textContent?.trim() || '';
          const elTagName = htmlEl.tagName.toLowerCase(); // Definir uma vez

          // USAR data-json-key SE EXISTIR, senão criar ID baseado em conteúdo
          let elementId = htmlEl.getAttribute('data-json-key');
          
          // 6. REGRA ESPECIAL: Divs/sections SEM data-json-key não devem ser editáveis
          // (são apenas containers visuais, não conteúdo editável)
          if (!elementId && (elTagName === 'div' || elTagName === 'section' || elTagName === 'article' || elTagName === 'header' || elTagName === 'footer')) {
            return; // Pular containers sem data-json-key
          }
          
          // DEBUG: Log elementos com "subtitle" no data-json-key
          if (elementId && elementId.includes('subtitle')) {
            // console.log('🔍 Found subtitle element:', {
            //   tag: elTagName,
            //   key: elementId,
            //   text: textContent.substring(0, 50),
            //   visible: rect.width > 0 && rect.height > 0
            // });
          }
          
          // Se tem data-json-key MAS já foi usado, adicionar sufixo
          if (elementId && processedIds.has(elementId)) {
            const baseKey = elementId;
            jsonKeyCounters[baseKey] = (jsonKeyCounters[baseKey] || 1) + 1;
            elementId = `${baseKey}_dup_${jsonKeyCounters[baseKey]}`;
            console.log(`🔄 Duplicate JSON key detected: "${baseKey}" → "${elementId}"`);
          }
          
          if (!elementId) {
            
            // Para SVGs, usar data-icon-name ou classe Lucide como ID
            if (elTagName === 'svg') {
              const iconName = htmlEl.getAttribute('data-icon-name');
              if (iconName) {
                // Usar dot notation para salvar no JSON: icons.{nome}
                const iconHash = iconName.replace(/[^a-z0-9]/gi, '_');
                const baseId = `icons.${iconHash}`;
                
                // Verificar se já existe e adicionar contador
                if (processedIds.has(baseId)) {
                  svgCounters[baseId] = (svgCounters[baseId] || 1) + 1;
                  elementId = `${baseId}_${svgCounters[baseId]}`;
                } else {
                  elementId = baseId;
                }
              } else {
                // Tentar detectar ícone Lucide pela classe
                const svgElement = htmlEl as unknown as SVGElement;
                const classes = svgElement.className;
                const classString = typeof classes === 'string' ? classes : classes.baseVal || '';
                const lucideMatch = classString.match(/lucide-([a-z-]+)/);
                if (lucideMatch) {
                  const lucideId = lucideMatch[1].replace(/-/g, '_');
                  const baseId = `icons.lucide_${lucideId}`;
                  
                  // Verificar se já existe e adicionar contador
                  if (processedIds.has(baseId)) {
                    svgCounters[baseId] = (svgCounters[baseId] || 1) + 1;
                    elementId = `${baseId}_${svgCounters[baseId]}`;
                  } else {
                    elementId = baseId;
                  }
                } else {
                  // SVG genérico
                  elementId = `icons.svg_${index}`;
                }
              }
            } else {
              // Fallback: criar ID baseado em conteúdo (para elementos não mapeados)
              const contentHash = textContent.substring(0, 30).replace(/[^a-z0-9]/gi, '_');
              elementId = `${pageId}_${elTagName}_${contentHash}_${index}`;
            }
          }
          
          // Adicionar ID ao conjunto (já tratamos duplicatas acima)
          processedIds.add(elementId);

          // MARCAR COMO EDITÁVEL
          htmlEl.setAttribute('data-editable', elementId);
          editableCount++;

          // Aplicar texto editado (texto puro) se existir
          const field = fields.find(f => f.key === elementId);
          if (field && field.currentValue) {
            htmlEl.textContent = field.currentValue;
          }
          
          // Para SVGs, aplicar estilos salvos
          if (elTagName === 'svg') {
            // Tentar ambos os formatos: .styles (novo) e __styles (legado)
            const stylesKeyNew = `${elementId}.styles`;
            const stylesKeyOld = `${elementId}__styles`;
            const styleField = fields.find(f => f.key === stylesKeyNew || f.key === stylesKeyOld);
            const stylesData = styleField?.currentValue;
            
            if (stylesData) {
              try {
                const styles = JSON.parse(stylesData as string);
                Object.entries(styles).forEach(([prop, value]) => {
                  htmlEl.style.setProperty(prop, value as string);
                });
                console.log(`🎨 Applied saved SVG styles to:`, elementId, styles);
              } catch (e) {
                console.error('Error parsing SVG styles:', e);
              }
            }
          }
          
          console.log(`✓ Made editable [${editableCount}]:`, elTagName, '→', textContent.substring(0, 50), '| JSON key:', elementId);
        });
      });
      
      console.log(`📝 Total editable elements found: ${editableCount}`);
      
      // CAPTURAR CAMPOS EDITÁVEIS (logo após marcar os elementos)
      // APENAS se o array de fields ainda estiver vazio
      if (fields.length === 0) {
        // console.log('💾 Capturando campos editáveis do DOM...');
        const capturedFields: EditableField[] = [];
        document.querySelectorAll('[data-editable]').forEach((el) => {
          const key = el.getAttribute('data-editable');
          if (key) {
            const htmlEl = el as HTMLElement;
            
            // 1. Capturar CONTEÚDO DE TEXTO
            const textValue = htmlEl.textContent || '';
            capturedFields.push({
              key,
              originalValue: textValue,
              currentValue: textValue,
              isModified: false
            });
            
            // 2. Capturar ESTILOS CSS (para SVGs e outros elementos)
            const inlineStyles = htmlEl.getAttribute('style');
            if (inlineStyles && inlineStyles.trim() !== '') {
              // Parsear estilos inline para objeto
              const styleObj: Record<string, string> = {};
              inlineStyles.split(';').forEach(rule => {
                const [prop, value] = rule.split(':').map(s => s.trim());
                if (prop && value) {
                  styleObj[prop] = value;
                }
              });
              
              const stylesJson = JSON.stringify(styleObj);
              // Usar __styles para consistência com o código de salvamento
              const stylesKey = `${key}__styles`;
              
              console.log(`  🎨 Capturando estilos para [${key}]:`, styleObj);
              
              capturedFields.push({
                key: stylesKey,
                originalValue: stylesJson,
                currentValue: stylesJson,
                isModified: false
              });
            }
          }
        });
        // console.log('✅ Campos capturados:', capturedFields.length, 'campos (texto + estilos)');
        setFields(capturedFields);
      } else {
        // console.log('⏭️ Campos já capturados anteriormente, pulando...');
      }
    };

    // console.log('⏱️ Calling addEditableAttributes with delay to ensure render...');
    // Dar tempo para React renderizar completamente antes de adicionar atributos
    setTimeout(() => {
      addEditableAttributes();
    }, 500); // Aumentar delay para garantir render completo
    
    // console.log('⏱️ Setting up click handler...');
    // console.log('📦 Fields disponíveis no handleClick:', fields.length);
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // console.log('🖱️ Click detectado, fields disponíveis:', fields.length);
      
      // Se já existe um textarea aberto, ignorar
      if (document.querySelector('.visual-editor-textarea')) {
        return;
      }
      
      // Encontrar TODOS os elementos editáveis na hierarquia (do mais específico ao mais genérico)
      let currentElement: HTMLElement | null = target;
      const editableCandidates: HTMLElement[] = [];
      
      while (currentElement && currentElement !== document.body) {
        if (currentElement.hasAttribute('data-editable')) {
          editableCandidates.push(currentElement);
        }
        currentElement = currentElement.parentElement;
      }
      
      // Debug: mostrar todos os candidatos encontrados
      if (editableCandidates.length > 0) {
        console.log(`🎯 Found ${editableCandidates.length} editable candidates:`, 
          editableCandidates.map(el => ({
            tag: el.tagName,
            id: el.getAttribute('data-editable'),
            jsonKey: el.getAttribute('data-json-key'),
            text: el.textContent?.substring(0, 30)
          }))
        );
      }
      
      // PRIORIZAR: elementos com data-json-key sobre elementos sem
      // Isso garante que clicamos no elemento correto, não no container pai
      let editableElement = editableCandidates[0];
      
      if (editableCandidates.length > 1) {
        // Se há múltiplos candidatos, preferir o que tem data-json-key
        const withJsonKey = editableCandidates.find(el => el.hasAttribute('data-json-key'));
        if (withJsonKey) {
          editableElement = withJsonKey;
          // console.log('✨ Prioritizing element with data-json-key:', editableElement.getAttribute('data-json-key'));
        }
      }
      
      if (editableElement) {
        e.preventDefault();
        e.stopPropagation();
        
        const elementId = editableElement.getAttribute('data-editable');
        if (!elementId) return;

        // console.log('✏️ Editando elemento:', elementId, '| Tag:', editableElement.tagName);
        // console.log('📦 Fields disponíveis para edição:', fields.length);
        const field = fields.find(f => f.key === elementId);
        // console.log('🔍 Campo encontrado:', field ? `✓ (${field.currentValue.substring(0, 30)}...)` : '✗ NÃO ENCONTRADO');
        
        setSelectedElement(elementId);
        
        // SEMPRE pegar texto atual do DOM (já reflete o JSON original)
        // Não usar editedTexts pois pode ter valor antigo em cache
        const currentText = editableElement.textContent || '';
        // console.log('Current text from DOM:', currentText);
        
        // Criar overlay escuro
        const overlay = document.createElement('div');
        overlay.className = 'visual-editor-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9998';
        overlay.style.backdropFilter = 'blur(2px)';
        
        // Criar container para o editor
        const rect = editableElement.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        const editorContainer = document.createElement('div');
        editorContainer.className = 'visual-editor-container';
        editorContainer.style.position = 'absolute';
        editorContainer.style.top = `${rect.top + scrollY - 60}px`;
        editorContainer.style.left = `${rect.left + scrollX}px`;
        editorContainer.style.width = `${Math.max(rect.width, 300)}px`;
        editorContainer.style.zIndex = '9999';
        editorContainer.style.backgroundColor = 'white';
        editorContainer.style.borderRadius = '8px';
        editorContainer.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
        editorContainer.style.padding = '12px';
        
        // Obter todas as propriedades CSS computadas
        const computedStyle = window.getComputedStyle(editableElement);
        const relevantProps = [
          'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
          'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
          'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
          'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing',
          'color', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius',
          'display', 'position', 'top', 'right', 'bottom', 'left',
          'textAlign', 'textDecoration', 'textTransform',
          'opacity', 'zIndex', 'cursor'
        ];
        
        // Detectar se é um SVG/ícone
        const isSVG = editableElement.tagName.toLowerCase() === 'svg';
        let iconName = editableElement.getAttribute('data-icon-name');
        let iconType = editableElement.getAttribute('data-icon-type');
        
        // Se não tem nome definido, tentar inferir do Lucide-react
        if (isSVG && !iconName) {
          // Lucide-react adiciona classes como "lucide lucide-sun"
          const svgElement = editableElement as unknown as SVGElement;
          const classes = typeof svgElement.className === 'string' 
            ? svgElement.className 
            : svgElement.className.baseVal;
          const lucideMatch = classes.match(/lucide-([a-z-]+)/);
          if (lucideMatch) {
            const iconId = lucideMatch[1];
            // Converter "heart-crack" -> "Heart Crack"
            iconName = iconId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            iconType = 'lucide-icon';
          } else {
            iconName = 'Ícone SVG';
            iconType = 'custom-svg';
          }
        }
        
        // Criar título com abas
        const title = document.createElement('div');
        title.style.fontSize = '14px';
        title.style.fontWeight = 'bold';
        title.style.color = '#333';
        title.style.marginBottom = '12px';
        title.style.borderBottom = '2px solid #CFAF5A';
        title.style.paddingBottom = '8px';
        
        if (isSVG && iconName) {
          title.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>🎨 Ícone: ${iconName}</span>
              ${iconType ? `<span style="font-size: 11px; color: #666;">(${iconType})</span>` : ''}
            </div>
          `;
        } else {
          title.textContent = `Editor Completo: ${editableElement.tagName.toLowerCase()}`;
        }
        
        // Container com tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.style.display = 'flex';
        tabsContainer.style.gap = '4px';
        tabsContainer.style.marginBottom = '12px';
        
        const createTab = (label: string, active = false) => {
          const tab = document.createElement('button');
          tab.textContent = label;
          tab.style.padding = '6px 12px';
          tab.style.border = 'none';
          tab.style.borderRadius = '4px';
          tab.style.cursor = 'pointer';
          tab.style.fontSize = '11px';
          tab.style.fontWeight = '600';
          tab.style.backgroundColor = active ? '#CFAF5A' : '#e5e7eb';
          tab.style.color = active ? 'white' : '#666';
          return tab;
        };
        
        const textTab = createTab('Texto', true);
        const styleTab = createTab('Estilo');
        const layoutTab = createTab('Layout');
        const advancedTab = createTab('Avançado');
        
        tabsContainer.appendChild(textTab);
        tabsContainer.appendChild(styleTab);
        tabsContainer.appendChild(layoutTab);
        tabsContainer.appendChild(advancedTab);
        
        // Container de conteúdo das tabs
        const contentContainer = document.createElement('div');
        contentContainer.style.maxHeight = '400px';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.marginBottom = '12px';
        
        // TAB 1: Texto (ou Informações do Ícone para SVGs)
        const textContent = document.createElement('div');
        
        let textarea: HTMLTextAreaElement;
        
        if (isSVG && iconName) {
          // Para SVGs: mostrar informações do ícone
          const svgElement = editableElement as unknown as SVGElement;
          const viewBox = svgElement.getAttribute('viewBox') || 'Não definido';
          const currentWidth = computedStyle.width;
          const currentHeight = computedStyle.height;
          const currentFill = computedStyle.fill || 'none';
          const currentStroke = computedStyle.stroke || 'none';
          
          const infoDiv = document.createElement('div');
          infoDiv.style.padding = '12px';
          infoDiv.style.backgroundColor = '#f9fafb';
          infoDiv.style.borderRadius = '4px';
          infoDiv.style.border = '1px solid #e5e7eb';
          infoDiv.innerHTML = `
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">📦 Tipo:</strong> Ícone SVG
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">🏷️ Nome:</strong> ${iconName}
            </div>
            ${iconType ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #374151;">🔖 Categoria:</strong> ${iconType}
              </div>
            ` : ''}
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">📏 Dimensões Atuais:</strong> ${currentWidth} × ${currentHeight}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">🎨 Fill:</strong> <span style="background: ${currentFill}; padding: 2px 8px; border-radius: 3px; border: 1px solid #ccc;">${currentFill}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">✏️ Stroke:</strong> <span style="background: ${currentStroke}; padding: 2px 8px; border-radius: 3px; border: 1px solid #ccc;">${currentStroke}</span>
            </div>
            <div style="padding: 8px; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 4px; font-size: 12px; color: #92400e;">
              ℹ️ <strong>Nota:</strong> Ícones SVG não possuem texto editável. 
              Use as abas <strong>Estilo</strong> e <strong>Layout</strong> para modificar cor, tamanho e posicionamento.
            </div>
          `;
          textContent.appendChild(infoDiv);
          
          // Criar textarea vazio (necessário para o código de salvamento)
          textarea = document.createElement('textarea');
          textarea.style.display = 'none';
        } else {
          // Verificar se é um container com filhos editáveis REAIS (não componentes internos)
          // Pegar apenas filhos diretos com data-json-key diferente do pai
          const ownJsonKey = editableElement.getAttribute('data-json-key');
          const childrenWithDifferentKeys = Array.from(editableElement.querySelectorAll('[data-json-key]'))
            .filter(child => {
              const childKey = child.getAttribute('data-json-key');
              return child !== editableElement && childKey !== ownJsonKey;
            });
          
          // CORREÇÃO: Se o elemento TEM data-json-key próprio, NÃO é container (é editável direto)
          // Só é container se NÃO tiver data-json-key E tiver filhos editáveis
          const isContainer = !ownJsonKey && childrenWithDifferentKeys.length > 0;
          
          // console.log('🔍 Container check:', {
          //   tag: editableElement.tagName,
          //   ownKey: ownJsonKey,
          //   childrenWithDifferentKeys: childrenWithDifferentKeys.length,
          //   isContainer
          // });
          
          if (isContainer) {
            // Container: mostrar aviso e desabilitar edição de texto
            const containerInfo = document.createElement('div');
            containerInfo.style.padding = '12px';
            containerInfo.style.backgroundColor = '#fef3c7';
            containerInfo.style.borderRadius = '4px';
            containerInfo.style.border = '1px solid #f59e0b';
            containerInfo.innerHTML = `
              <div style="margin-bottom: 12px;">
                <strong style="color: #92400e;">📦 Container Detectado</strong>
              </div>
              <div style="font-size: 12px; color: #78350f; line-height: 1.6;">
                Este elemento contém <strong>${childrenWithDifferentKeys.length}</strong> elemento(s) filho(s) editável(is).<br><br>
                ⚠️ <strong>Não é possível editar o texto de um container diretamente.</strong><br><br>
                Para editar o conteúdo, clique nos elementos individuais dentro deste container.<br><br>
                💡 Você ainda pode editar os <strong>estilos</strong> (cor de fundo, padding, etc.) nas outras abas.
              </div>
            `;
            textContent.appendChild(containerInfo);
            
            // Criar textarea oculto (necessário para o código de salvamento)
            textarea = document.createElement('textarea');
            textarea.style.display = 'none';
            textarea.value = ''; // Container não tem texto próprio
          } else {
            // Elemento de texto normal: mostrar textarea
            textarea = document.createElement('textarea');
            textarea.className = 'visual-editor-textarea';
            
            // Buscar valor atual do campo no array fields
            const field = fields.find(f => f.key === elementId);
            textarea.value = field ? field.currentValue : (editableElement.textContent || '');
            
            textarea.style.width = '100%';
            textarea.style.minHeight = `${Math.max(rect.height, 80)}px`;
            textarea.style.padding = '8px';
            textarea.style.fontSize = '13px';
            textarea.style.fontFamily = 'inherit';
            textarea.style.border = '2px solid #CFAF5A';
            textarea.style.borderRadius = '4px';
            textarea.style.resize = 'vertical';
            textarea.style.outline = 'none';
            textContent.appendChild(textarea);
          }
        }
        
        // Detectar se o SVG tem animação (antes de criar as tabs)
        const hasAnimation = isSVG && editableElement.classList.contains('animate-spin-slow');
        
        // TAB 2: Estilo (Cores, Fontes ou SVG)
        const styleContent = document.createElement('div');
        styleContent.style.display = 'none';
        styleContent.style.gap = '8px';
        styleContent.style.flexDirection = 'column';
        
        // Adicionar nota explicativa para SVGs
        if (isSVG) {
          const svgNote = document.createElement('div');
          svgNote.style.padding = '8px';
          svgNote.style.backgroundColor = '#eff6ff';
          svgNote.style.borderLeft = '3px solid #3b82f6';
          svgNote.style.borderRadius = '4px';
          svgNote.style.fontSize = '11px';
          svgNote.style.color = '#1e40af';
          svgNote.style.marginBottom = '12px';
          
          if (hasAnimation) {
            svgNote.innerHTML = `
              � <strong>Ícone Animado!</strong> Este SVG possui animação CSS.<br>
              Use <code>animationDuration</code> para controlar a velocidade (ex: "10s" = 10 segundos, "5s" = mais rápido).<br>
              💡 <code>fill</code> e <code>stroke</code> afetam a cor do ícone.
            `;
          } else {
            svgNote.innerHTML = `
              �💡 <strong>Dica:</strong> As propriedades <code>fill</code> e <code>stroke</code> 
              afetarão todos os elementos internos do SVG que não têm cores definidas explicitamente.
            `;
          }
          styleContent.appendChild(svgNote);
        }
        
        // Propriedades diferentes para SVG vs elementos normais (hasAnimation já declarado acima)
        let styleProps: string[];
        if (isSVG) {
          styleProps = ['fill', 'stroke', 'strokeWidth', 'opacity'];
          // Adicionar propriedades de animação se houver
          if (hasAnimation) {
            styleProps.push('animationDuration', 'animationTimingFunction', 'animationIterationCount');
          }
          styleProps.push('filter', 'transform');
        } else {
          styleProps = ['fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'color', 'backgroundColor', 'opacity'];
        }
        styleProps.forEach(prop => {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.marginBottom = '8px';
          
          const label = document.createElement('label');
          // Labels mais amigáveis com emojis
          const labelMap: Record<string, string> = {
            // Animação
            'animationDuration': '⏱️ Duração',
            'animationTimingFunction': '📈 Timing',
            'animationIterationCount': '🔁 Repetições',
            // SVG
            'fill': '🎨 Preenchimento',
            'stroke': '✏️ Contorno',
            'strokeWidth': '📏 Espessura',
            'opacity': '👻 Opacidade',
            'filter': '🔍 Filtro',
            'transform': '🔄 Transformação',
            // Texto
            'fontSize': '📐 Tamanho Fonte',
            'fontWeight': '💪 Peso Fonte',
            'fontFamily': '🔤 Família Fonte',
            'lineHeight': '📊 Altura Linha',
            'letterSpacing': '↔️ Espaçamento',
            'color': '🎨 Cor Texto',
            'backgroundColor': '🖌️ Cor Fundo',
            'textAlign': '⬅️ Alinhamento',
            'textDecoration': '✨ Decoração',
            'textTransform': '🔠 Transformar'
          };
          label.textContent = labelMap[prop] || prop;
          label.style.fontSize = '11px';
          label.style.fontWeight = '600';
          label.style.color = '#555';
          label.style.width = '140px';
          label.style.flexShrink = '0';
          
          const input = document.createElement('input');
          const isColorField = prop === 'color' || prop === 'backgroundColor' || prop === 'fill' || prop === 'stroke';
          input.type = isColorField ? 'color' : 'text';
          
          const cssProperty = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          let currentValue = computedStyle.getPropertyValue(cssProperty);
          
          // Verificar se há estilo inline no elemento (tem prioridade)
          const inlineStyle = editableElement.style.getPropertyValue(cssProperty);
          if (inlineStyle) {
            currentValue = inlineStyle;
          }
          
          // Para campos de cor: converter RGB para HEX
          if (isColorField && currentValue) {
            // Converter rgb(r, g, b) ou rgba(r, g, b, a) para #RRGGBB
            const rgbMatch = currentValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]);
              const g = parseInt(rgbMatch[2]);
              const b = parseInt(rgbMatch[3]);
              currentValue = '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
              }).join('');
            }
            // Se for cor nomeada (ex: "black"), manter como está
            // Se não é hexadecimal e não é transparent, deixar vazio para não forçar preto
            else if (currentValue !== 'transparent' && !currentValue.startsWith('#')) {
              // Manter valor original para cores nomeadas ou deixar vazio
              if (!['transparent', 'inherit', 'initial'].includes(currentValue.toLowerCase())) {
                // Converter cores nomeadas conhecidas
                const namedColors: Record<string, string> = {
                  'black': '#000000',
                  'white': '#ffffff',
                  'red': '#ff0000',
                  'green': '#008000',
                  'blue': '#0000ff',
                  'yellow': '#ffff00',
                  'cyan': '#00ffff',
                  'magenta': '#ff00ff',
                  'gray': '#808080',
                  'grey': '#808080'
                };
                currentValue = namedColors[currentValue.toLowerCase()] || currentValue;
              }
            }
          }
          
          input.value = currentValue;
          input.dataset.originalValue = currentValue; // Guardar valor original para detectar mudanças
          
          // Placeholders e tooltips com informações
          const fieldInfo: Record<string, { placeholder: string; title: string }> = {
            'animationDuration': {
              placeholder: '10s, 5s, 2s',
              title: 'Tipo: Tempo | Valores: Xs (segundos), Xms (milissegundos) | Ex: 5s (5 segundos), 500ms (meio segundo)'
            },
            'animationTimingFunction': {
              placeholder: 'linear, ease, ease-in-out',
              title: 'Tipo: Função | Valores: linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier()'
            },
            'animationIterationCount': {
              placeholder: 'infinite, 3, 5',
              title: 'Tipo: Número ou Palavra | Valores: infinite (infinito), 1, 2, 3, etc'
            },
            'fontSize': {
              placeholder: '16px, 1.5rem, 2em',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, Xem, X% | Ex: 16px, 1.5rem, 120%'
            },
            'fontWeight': {
              placeholder: '400, 700, bold',
              title: 'Tipo: Peso | Valores: 100-900 (incrementos de 100), normal, bold, bolder, lighter'
            },
            'fontFamily': {
              placeholder: 'Arial, sans-serif',
              title: 'Tipo: Nome da Fonte | Valores: "Nome da Fonte", família genérica | Ex: "Arial", sans-serif'
            },
            'lineHeight': {
              placeholder: '1.5, 24px',
              title: 'Tipo: Número ou Tamanho | Valores: número (multiplicador), Xpx, Xrem | Ex: 1.5, 24px'
            },
            'strokeWidth': {
              placeholder: '2, 3, 5',
              title: 'Tipo: Número | Valores: números positivos | Ex: 1, 2, 3, 5'
            },
            'opacity': {
              placeholder: '0.5, 0.8, 1',
              title: 'Tipo: Número | Valores: 0 (transparente) a 1 (opaco) | Ex: 0.5 (50%), 0.8 (80%)'
            },
            'filter': {
              placeholder: 'blur(5px), brightness(1.2)',
              title: 'Tipo: Função | Valores: blur(Xpx), brightness(X), contrast(X), grayscale(X), etc'
            },
            'fill': {
              placeholder: '#CFAF5A',
              title: 'Tipo: Cor | Valores: #hex, rgb(), rgba(), nome | Ex: #ff0000, rgb(255,0,0), red'
            },
            'stroke': {
              placeholder: '#000000',
              title: 'Tipo: Cor | Valores: #hex, rgb(), rgba(), nome | Ex: #ff0000, rgb(255,0,0), black'
            },
            'color': {
              placeholder: '#000000',
              title: 'Tipo: Cor | Valores: #hex, rgb(), rgba(), nome | Ex: #333333, rgb(51,51,51), black'
            },
            'backgroundColor': {
              placeholder: '#ffffff',
              title: 'Tipo: Cor | Valores: #hex, rgb(), rgba(), nome, transparent | Ex: #ffffff, white'
            }
          };
          
          if (fieldInfo[prop]) {
            input.placeholder = fieldInfo[prop].placeholder;
            input.title = fieldInfo[prop].title;
          }
          input.style.flex = '1';
          input.style.padding = '4px 8px';
          input.style.border = '1px solid #ccc';
          input.style.borderRadius = '4px';
          input.style.fontSize = '11px';
          input.dataset.cssProp = prop;
          
          row.appendChild(label);
          row.appendChild(input);
          styleContent.appendChild(row);
        });
        
        // TAB 3: Layout (Dimensões, Margens, Padding)
        const layoutContent = document.createElement('div');
        layoutContent.style.display = 'none';
        layoutContent.style.gap = '8px';
        layoutContent.style.flexDirection = 'column';
        
        const layoutProps = ['width', 'height', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
                             'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderRadius'];
        layoutProps.forEach(prop => {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.marginBottom = '8px';
          
          const label = document.createElement('label');
          // Labels amigáveis para Layout
          const layoutLabelMap: Record<string, string> = {
            'width': '↔️ Largura',
            'height': '↕️ Altura',
            'marginTop': '⬆️ Margem Topo',
            'marginRight': '➡️ Margem Direita',
            'marginBottom': '⬇️ Margem Baixo',
            'marginLeft': '⬅️ Margem Esquerda',
            'paddingTop': '📦⬆️ Padding Topo',
            'paddingRight': '📦➡️ Padding Direita',
            'paddingBottom': '📦⬇️ Padding Baixo',
            'paddingLeft': '📦⬅️ Padding Esquerda',
            'borderRadius': '⭕ Arredondamento'
          };
          label.textContent = layoutLabelMap[prop] || prop;
          label.style.fontSize = '11px';
          label.style.fontWeight = '600';
          label.style.color = '#555';
          label.style.width = '120px';
          label.style.flexShrink = '0';
          
          const input = document.createElement('input');
          input.type = 'text';
          const layoutValue = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
          input.value = layoutValue;
          input.dataset.originalValue = layoutValue; // Guardar valor original para detectar mudanças
          
          // Informações de layout
          const layoutFieldInfo: Record<string, { placeholder: string; title: string }> = {
            'width': {
              placeholder: '100px, 50%, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem, Xem, auto | Ex: 200px, 50%, auto'
            },
            'height': {
              placeholder: '100px, 50%, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem, Xem, auto | Ex: 100px, 50%, auto'
            },
            'marginTop': {
              placeholder: '10px, 1rem, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, auto, negativo | Ex: 10px, -5px, auto'
            },
            'marginBottom': {
              placeholder: '10px, 1rem, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, auto, negativo | Ex: 10px, -5px, auto'
            },
            'marginLeft': {
              placeholder: '10px, 1rem, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, auto, negativo | Ex: 10px, -5px, auto'
            },
            'marginRight': {
              placeholder: '10px, 1rem, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, auto, negativo | Ex: 10px, -5px, auto'
            },
            'paddingTop': {
              placeholder: '10px, 1rem',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, X% | Ex: 10px, 1rem, 5%'
            },
            'paddingBottom': {
              placeholder: '10px, 1rem',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, X% | Ex: 10px, 1rem, 5%'
            },
            'paddingLeft': {
              placeholder: '10px, 1rem',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, X% | Ex: 10px, 1rem, 5%'
            },
            'paddingRight': {
              placeholder: '10px, 1rem',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, X% | Ex: 10px, 1rem, 5%'
            },
            'borderRadius': {
              placeholder: '5px, 50%',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem | Ex: 5px (arredondado), 50% (círculo)'
            }
          };
          input.placeholder = layoutFieldInfo[prop]?.placeholder || 'ex: 100px, 50%, auto';
          input.title = layoutFieldInfo[prop]?.title || '';
          
          input.style.flex = '1';
          input.style.padding = '4px 8px';
          input.style.border = '1px solid #ccc';
          input.style.borderRadius = '4px';
          input.style.fontSize = '11px';
          input.dataset.cssProp = prop;
          
          row.appendChild(label);
          row.appendChild(input);
          layoutContent.appendChild(row);
        });
        
        // TAB 4: Avançado (Display, Position, Flex, Grid, Transform)
        const advancedContent = document.createElement('div');
        advancedContent.style.display = 'none';
        advancedContent.style.gap = '8px';
        advancedContent.style.flexDirection = 'column';
        
        const advancedProps = ['display', 'position', 'top', 'left', 'right', 'bottom', 'zIndex',
                               'flexDirection', 'justifyContent', 'alignItems', 'gap',
                               'gridTemplateColumns', 'gridTemplateRows', 'transform', 'transition'];
        advancedProps.forEach(prop => {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.marginBottom = '8px';
          
          const label = document.createElement('label');
          // Labels amigáveis para Avançado
          const advancedLabelMap: Record<string, string> = {
            'display': '👁️ Display',
            'position': '📍 Posição',
            'top': '⬆️ Topo',
            'left': '⬅️ Esquerda',
            'right': '➡️ Direita',
            'bottom': '⬇️ Baixo',
            'zIndex': '🔝 Z-Index',
            'flexDirection': '🔀 Flex Direção',
            'justifyContent': '↔️ Justify',
            'alignItems': '↕️ Align',
            'gap': '📏 Espaço Flex',
            'gridTemplateColumns': '📊 Grid Colunas',
            'gridTemplateRows': '📊 Grid Linhas',
            'transform': '🔄 Transform',
            'transition': '⚡ Transição'
          };
          label.textContent = advancedLabelMap[prop] || prop;
          label.style.fontSize = '11px';
          label.style.fontWeight = '600';
          label.style.color = '#555';
          label.style.width = '130px';
          label.style.flexShrink = '0';
          
          const input = document.createElement('input');
          input.type = 'text';
          const advancedValue = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
          input.value = advancedValue;
          input.dataset.originalValue = advancedValue; // Guardar valor original para detectar mudanças
          
          // Informações de propriedades avançadas
          const advancedFieldInfo: Record<string, { placeholder: string; title: string }> = {
            'display': {
              placeholder: 'block, flex, grid, none',
              title: 'Tipo: Enum | Valores: none, block, inline, inline-block, flex, grid, table, inline-flex | Ex: flex, block'
            },
            'position': {
              placeholder: 'relative, absolute, fixed',
              title: 'Tipo: Enum | Valores: static, relative, absolute, fixed, sticky | Ex: relative, absolute'
            },
            'top': {
              placeholder: '10px, 50%, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem, auto, negativo | Ex: 10px, 50%, -20px'
            },
            'left': {
              placeholder: '10px, 50%, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem, auto, negativo | Ex: 10px, 50%, -20px'
            },
            'right': {
              placeholder: '10px, 50%, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem, auto, negativo | Ex: 10px, 50%, -20px'
            },
            'bottom': {
              placeholder: '10px, 50%, auto',
              title: 'Tipo: Tamanho | Valores: Xpx, X%, Xrem, auto, negativo | Ex: 10px, 50%, -20px'
            },
            'zIndex': {
              placeholder: '10, 100, 999',
              title: 'Tipo: Número | Valores: números inteiros (negativo a positivo) | Ex: 1, 10, 100, -1'
            },
            'transform': {
              placeholder: 'rotate(45deg), scale(1.2)',
              title: 'Tipo: Função | Valores: rotate(Xdeg), scale(X), translate(Xpx, Ypx), skew(Xdeg) | Ex: rotate(45deg) scale(1.2)'
            },
            'transition': {
              placeholder: 'all 0.3s ease',
              title: 'Tipo: Transição | Formato: [propriedade] [duração] [timing] [delay] | Ex: all 0.3s ease, opacity 500ms'
            },
            'flexDirection': {
              placeholder: 'row, column',
              title: 'Tipo: Enum | Valores: row, column, row-reverse, column-reverse | Ex: row, column'
            },
            'justifyContent': {
              placeholder: 'center, space-between',
              title: 'Tipo: Enum | Valores: flex-start, center, flex-end, space-between, space-around, space-evenly | Ex: center'
            },
            'alignItems': {
              placeholder: 'center, flex-start',
              title: 'Tipo: Enum | Valores: flex-start, center, flex-end, stretch, baseline | Ex: center, stretch'
            },
            'gap': {
              placeholder: '10px, 1rem',
              title: 'Tipo: Tamanho | Valores: Xpx, Xrem, X% | Ex: 10px, 1rem, 20px'
            },
            'gridTemplateColumns': {
              placeholder: 'repeat(3, 1fr)',
              title: 'Tipo: Template | Valores: repeat(X, Xfr), Xpx Xpx, X% X% | Ex: repeat(3, 1fr), 100px 200px'
            },
            'gridTemplateRows': {
              placeholder: 'repeat(2, 1fr)',
              title: 'Tipo: Template | Valores: repeat(X, Xfr), Xpx Xpx, auto | Ex: repeat(2, 1fr), 100px auto'
            }
          };
          input.placeholder = advancedFieldInfo[prop]?.placeholder || '';
          input.title = advancedFieldInfo[prop]?.title || '';
          
          input.style.flex = '1';
          input.style.padding = '4px 8px';
          input.style.border = '1px solid #ccc';
          input.style.borderRadius = '4px';
          input.style.fontSize = '11px';
          input.dataset.cssProp = prop;
          
          row.appendChild(label);
          row.appendChild(input);
          advancedContent.appendChild(row);
        });
        
        contentContainer.appendChild(textContent);
        contentContainer.appendChild(styleContent);
        contentContainer.appendChild(layoutContent);
        contentContainer.appendChild(advancedContent);
        
        // Gerenciar tabs
        const showTab = (tabName: string) => {
          textContent.style.display = tabName === 'text' ? 'block' : 'none';
          styleContent.style.display = tabName === 'style' ? 'flex' : 'none';
          layoutContent.style.display = tabName === 'layout' ? 'flex' : 'none';
          advancedContent.style.display = tabName === 'advanced' ? 'flex' : 'none';
          
          textTab.style.backgroundColor = tabName === 'text' ? '#CFAF5A' : '#e5e7eb';
          textTab.style.color = tabName === 'text' ? 'white' : '#666';
          styleTab.style.backgroundColor = tabName === 'style' ? '#CFAF5A' : '#e5e7eb';
          styleTab.style.color = tabName === 'style' ? 'white' : '#666';
          layoutTab.style.backgroundColor = tabName === 'layout' ? '#CFAF5A' : '#e5e7eb';
          layoutTab.style.color = tabName === 'layout' ? 'white' : '#666';
          advancedTab.style.backgroundColor = tabName === 'advanced' ? '#CFAF5A' : '#e5e7eb';
          advancedTab.style.color = tabName === 'advanced' ? 'white' : '#666';
        };
        
        textTab.onclick = () => showTab('text');
        styleTab.onclick = () => showTab('style');
        layoutTab.onclick = () => showTab('layout');
        advancedTab.onclick = () => showTab('advanced');
        
        // Criar botão OK
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.justifyContent = 'flex-end';
        
        const okButton = document.createElement('button');
        okButton.textContent = '✓ OK';
        okButton.style.padding = '6px 16px';
        okButton.style.backgroundColor = '#10b981';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';
        okButton.style.fontWeight = '600';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '✕ Cancelar';
        cancelButton.style.padding = '6px 12px';
        cancelButton.style.backgroundColor = '#6b7280';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        
        const saveEdit = () => {
          // Pegar texto puro do textarea
          const newText = textarea.value;
          
          // console.log('Saving edit for element:', elementId);
          // console.log('New text:', newText);
          
          // Coletar APENAS as propriedades CSS que foram MODIFICADAS
          const cssChanges: Record<string, string> = {};
          const allInputs = editorContainer.querySelectorAll('input[data-css-prop]');
          console.log(`🔍 Found ${allInputs.length} input fields with data-css-prop`);
          
          let modifiedCount = 0;
          allInputs.forEach((input: Element, index) => {
            const htmlInput = input as HTMLInputElement;
            const prop = htmlInput.dataset.cssProp;
            const originalValue = htmlInput.dataset.originalValue || '';
            const currentValue = htmlInput.value;
            
            // Salvar APENAS se o valor foi modificado
            if (prop && currentValue !== originalValue) {
              const cssProperty = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
              console.log(`  ✏️ [${index}] MODIFICADO: ${prop} (${cssProperty})`);
              console.log(`      Original: "${originalValue}"`);
              console.log(`      Novo: "${currentValue}"`);
              cssChanges[cssProperty] = currentValue;
              modifiedCount++;
            }
          });
          
          console.log(`📝 Total de propriedades modificadas: ${modifiedCount} de ${allInputs.length}`);
          
          // console.log('CSS changes collected:', cssChanges);
          // console.log('Number of CSS properties:', Object.keys(cssChanges).length);
          
          // Aplicar mudanças de CSS imediatamente no elemento
          Object.entries(cssChanges).forEach(([prop, value]) => {
            console.log(`Applying CSS: ${prop} = ${value}`);
            editableElement.style.setProperty(prop, value);
          });
          
          // Calcular saveKey ANTES de setFields para usar depois
          let saveKey = elementId;
          if (elementId.includes('_dup_')) {
            saveKey = elementId.replace(/_dup_\d+$/, '');
            console.log(`🔄 Removing duplicate suffix: "${elementId}" → "${saveKey}"`);
          }
          
          const isSVG = editableElement.tagName.toLowerCase() === 'svg';
          
          try {
            // PASSO 1: Aplicar mudança no DOM PRIMEIRO (antes de atualizar state)
            const oldText = editableElement.textContent;
            console.log(`📝 Aplicando mudança visual: "${oldText}" → "${newText}"`);
            
            // Aplicar mudança no DOM
            if (editableElement.children.length === 0) {
              // Sem filhos: usar textContent (mais rápido)
              editableElement.textContent = newText;
            } else {
              // Com filhos: substituir apenas os TextNodes diretos
              const textNodes = Array.from(editableElement.childNodes).filter(
                node => node.nodeType === Node.TEXT_NODE
              );
              if (textNodes.length > 0) {
                textNodes[0].textContent = newText;
              } else {
                editableElement.textContent = newText;
              }
            }
            
            // PASSO 2: Adicionar ao Map de edições locais (persiste entre renders)
            localEdits.current.set(saveKey, newText);
            console.log(`💾 Adicionado ao map local: ${saveKey} = "${newText}"`);
            
            // PASSO 2.5: Ativar lock para bloquear atualizações do useLocaleTexts
            setEditLock(pageId, true);
            console.log(`🔒 Edit lock ativado para ${pageId}`);
            
            // PASSO 3: Atualizar estado (isso pode causar re-render, mas o lock impede useLocaleTexts)
            setFields(prev => {
              const updated = [...prev];
              
              // Para SVGs, salvar apenas estilos (não texto)
              if (isSVG) {
                // Para SVGs: SEMPRE salvar estilos, usando .styles
                const stylesKey = saveKey.startsWith('icons.') 
                  ? `${saveKey}.styles` 
                  : `${saveKey}__styles`;
                
                const styleFieldIndex = updated.findIndex(f => f.key === stylesKey);
                const stylesValue = JSON.stringify(cssChanges);
                
                if (styleFieldIndex >= 0) {
                  updated[styleFieldIndex] = {
                    ...updated[styleFieldIndex],
                    currentValue: stylesValue,
                    isModified: true
                  };
                } else {
                  updated.push({
                    key: stylesKey,
                    originalValue: '',
                    currentValue: stylesValue,
                    isModified: true
                  });
                }
                console.log(`💾 Saving SVG styles to: ${stylesKey}`);
              } else {
                // Para elementos de texto: atualizar texto
                const fieldIndex = updated.findIndex(f => f.key === saveKey);
                if (fieldIndex >= 0) {
                  updated[fieldIndex] = {
                    ...updated[fieldIndex],
                    currentValue: newText,
                    isModified: updated[fieldIndex].originalValue !== newText
                  };
                }
                
                // APENAS adicionar __styles se houver mudanças CSS
                if (Object.keys(cssChanges).length > 0) {
                  const stylesKey = `${saveKey}__styles`;
                  const styleFieldIndex = updated.findIndex(f => f.key === stylesKey);
                  const stylesValue = JSON.stringify(cssChanges);
                  
                  if (styleFieldIndex >= 0) {
                    updated[styleFieldIndex] = {
                      ...updated[styleFieldIndex],
                      currentValue: stylesValue,
                      isModified: true
                    };
                  } else {
                    updated.push({
                      key: stylesKey,
                      originalValue: '',
                      currentValue: stylesValue,
                      isModified: true
                    });
                  }
                  console.log(`💅 Saving CSS changes for: ${saveKey}`);
                }
              }
              
              // console.log('Updated fields:', updated.filter(f => f.isModified));
              return updated;
            });
            
            console.log('✅ Mudança aplicada no DOM e state. Use "Salvar Mudanças" para persistir no DB.');
          } catch (error) {
            console.error('Error in saveEdit:', error);
          }
          
          cleanup();
        };
        
        const cancelEdit = () => {
          // console.log('Cancelled editing');
          cleanup();
        };
        
        const cleanup = () => {
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          if (document.body.contains(editorContainer)) document.body.removeChild(editorContainer);
          setSelectedElement(null);
        };
        
        // Event listeners
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
        
        // Hint de atalhos
        const hint = document.createElement('div');
        hint.textContent = 'Ctrl+Enter para salvar | Esc para cancelar';
        hint.style.fontSize = '10px';
        hint.style.color = '#999';
        hint.style.marginTop = '8px';
        hint.style.textAlign = 'center';
        
        // Montar estrutura
        buttonContainer.appendChild(okButton);
        buttonContainer.appendChild(cancelButton);
        editorContainer.appendChild(title);
        editorContainer.appendChild(tabsContainer);
        editorContainer.appendChild(contentContainer);
        editorContainer.appendChild(buttonContainer);
        editorContainer.appendChild(hint);
        
        document.body.appendChild(overlay);
        document.body.appendChild(editorContainer);
        
        // Ajustar largura do editor para acomodar as tabs
        editorContainer.style.width = `${Math.max(rect.width, 500)}px`;
        editorContainer.style.maxWidth = '90vw';
        
        textarea.focus();
        textarea.select();
      }
    };

    // Adicionar highlights nos elementos editáveis
    const addEditableHighlights = () => {
      const editables = document.querySelectorAll('[data-editable]');
      console.log(`🎨 Adding highlights to ${editables.length} editable elements`);
      
      editables.forEach(el => {
        const htmlEl = el as HTMLElement;
        // Guardar estilos originais para restaurar depois
        const originalStyles = {
          cursor: htmlEl.style.cursor,
          outline: htmlEl.style.outline,
          transition: htmlEl.style.transition
        };
        htmlEl.setAttribute('data-original-styles', JSON.stringify(originalStyles));
        
        // Aplicar estilos de edição SEM mudar position
        htmlEl.style.cursor = 'pointer';
        htmlEl.style.outline = '1px dashed rgba(207, 175, 90, 0.5)';
        htmlEl.style.transition = 'all 0.2s';
        
        const handleMouseEnter = () => {
          htmlEl.style.outline = '2px solid rgba(207, 175, 90, 0.9)';
          htmlEl.style.backgroundColor = 'rgba(207, 175, 90, 0.15)';
          htmlEl.style.boxShadow = '0 0 8px rgba(207, 175, 90, 0.3)';
          
          // Adicionar badge FORA do elemento (como overlay) para não contaminar textContent
          const rect = htmlEl.getBoundingClientRect();
          const badge = document.createElement('div');
          badge.className = 'element-type-badge';
          badge.textContent = `<${htmlEl.tagName.toLowerCase()}>`;
          badge.style.position = 'fixed';
          badge.style.top = `${rect.top - 20}px`;
          badge.style.left = `${rect.left}px`;
          badge.style.backgroundColor = '#CFAF5A';
          badge.style.color = 'white';
          badge.style.padding = '2px 6px';
          badge.style.fontSize = '10px';
          badge.style.fontWeight = 'bold';
          badge.style.borderRadius = '3px';
          badge.style.zIndex = '10000';
          badge.style.pointerEvents = 'none';
          badge.style.fontFamily = 'monospace';
          badge.setAttribute('data-element-id', htmlEl.getAttribute('data-editable') || '');
          document.body.appendChild(badge); // CRÍTICO: adicionar no body, não no elemento!
        };
        
        const handleMouseLeave = () => {
          htmlEl.style.outline = '1px dashed rgba(207, 175, 90, 0.5)';
          htmlEl.style.backgroundColor = 'transparent';
          htmlEl.style.boxShadow = 'none';
          
          // Remover badge do body (não do elemento)
          const elementId = htmlEl.getAttribute('data-editable');
          const badge = document.body.querySelector(`.element-type-badge[data-element-id="${elementId}"]`);
          if (badge) {
            badge.remove();
          }
        };
        
        htmlEl.addEventListener('mouseenter', handleMouseEnter);
        htmlEl.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // console.log('✅ Registering click event listener...');
    document.addEventListener('click', handleClick, true);
    
    // console.log('⏱️ Scheduling highlight updates...');
    // Executar múltiplas vezes para garantir que pegue elementos carregados dinamicamente
    setTimeout(() => {
      // console.log('⏱️ Running highlights (100ms)...');
      addEditableHighlights();
    }, 100);
    setTimeout(() => {
      // console.log('⏱️ Running highlights (500ms)...');
      addEditableHighlights();
    }, 500);
    setTimeout(() => {
      // console.log('⏱️ Running highlights (1000ms)...');
      addEditableHighlights();
    }, 1000);

    return () => {
      // console.log('🧹 Cleanup: Removing edit mode styles...');
      document.removeEventListener('click', handleClick, true);
      
      // Remover CSS injetado
      const style = document.getElementById('visual-editor-styles');
      if (style) style.remove();
      
      // Limpar qualquer editor aberto
      const overlay = document.querySelector('.visual-editor-overlay');
      const container = document.querySelector('.visual-editor-container');
      if (overlay && document.body.contains(overlay)) document.body.removeChild(overlay);
      if (container && document.body.contains(container)) document.body.removeChild(container);
      
      // Remover todos os badges flutuantes
      const badges = document.body.querySelectorAll('.element-type-badge');
      badges.forEach(badge => badge.remove());
      
      // RESTAURAR estilos originais dos elementos editáveis
      const editables = document.querySelectorAll('[data-editable]');
      console.log(`🧹 Restoring original styles for ${editables.length} elements...`);
      editables.forEach(el => {
        const htmlEl = el as HTMLElement;
        
        // Restaurar estilos originais se foram salvos
        const originalStylesAttr = htmlEl.getAttribute('data-original-styles');
        if (originalStylesAttr) {
          try {
            const originalStyles = JSON.parse(originalStylesAttr);
            htmlEl.style.cursor = originalStyles.cursor || '';
            htmlEl.style.outline = originalStyles.outline || '';
            htmlEl.style.transition = originalStyles.transition || '';
          } catch (e) {
            console.warn('Failed to parse original styles:', e);
          }
          htmlEl.removeAttribute('data-original-styles');
        } else {
          // Fallback: apenas limpar
          htmlEl.style.cursor = '';
          htmlEl.style.outline = '';
          htmlEl.style.transition = '';
        }
        
        // Limpar outros estilos de edição
        htmlEl.style.backgroundColor = '';
        htmlEl.style.boxShadow = '';
        
        // Remover atributo data-editable ao sair do modo de edição
        htmlEl.removeAttribute('data-editable');
      });
      // console.log('✅ Cleanup completed');
    };
  }, [isEditMode, fields, pageId]);

  const handleSave = async () => {
    // Guard: prevenir execução duplicada
    if (isSaving.current) {
      console.warn('⚠️ Save already in progress, skipping duplicate call...');
      return;
    }
    
    isSaving.current = true;
    
    try {
      // Filtrar apenas campos modificados
      const modifiedFields = fields.filter(f => f.isModified);
      
      // Separar edições de texto e estilos
      const textEdits: Record<string, string> = {};
      const styleEdits: Record<string, string> = {};
      
      modifiedFields.forEach(field => {
        if (field.key.endsWith('__styles') || field.key.endsWith('.styles')) {
          // Estilos CSS
          styleEdits[field.key.replace(/__styles$/, '').replace(/\.styles$/, '')] = field.currentValue;
        } else {
          // Textos/conteúdo
          textEdits[field.key] = field.currentValue;
        }
      });
      
      console.log('📝 Text edits:', Object.keys(textEdits).length);
      console.log('💅 Style edits:', Object.keys(styleEdits).length);
      console.log('📤 Enviando para API:', textEdits);
      
      let savedCount = 0;
      
      // Salvar TEXTOS via /api/save-visual-edits
      if (Object.keys(textEdits).length > 0) {
        try {
          const payload = { pageId, edits: textEdits };
          
          const response = await fetch('http://localhost:3001/api/save-visual-edits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            await response.json();
            savedCount += Object.keys(textEdits).length;
          } else {
            throw new Error('API error saving texts');
          }
        } catch (apiError) {
          console.error('API error (texts):', apiError);
          setMessage({ 
            type: 'error', 
            text: `✗ Erro ao salvar textos. Servidor API não está respondendo.` 
          });
          setTimeout(() => setMessage(null), 8000);
          return;
        }
      }
      
      // Salvar ESTILOS via /api/save-styles
      if (Object.keys(styleEdits).length > 0) {
        try {
          const payload = { pageId, styles: styleEdits };
          // console.log('📤 Sending styles to API:', JSON.stringify(payload, null, 2));
          
          const response = await fetch('http://localhost:3001/api/save-styles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            const result = await response.json();
            // console.log('✓ Style save successful:', result);
            savedCount += Object.keys(styleEdits).length;
          } else {
            throw new Error('API error saving styles');
          }
        } catch (apiError) {
          console.error('API error (styles):', apiError);
          setMessage({ 
            type: 'error', 
            text: `✗ Erro ao salvar estilos. Servidor API não está respondendo.` 
          });
          setTimeout(() => setMessage(null), 8000);
          return;
        }
      }
      
      // Sucesso total - VALIDAÇÃO EM MALHA FECHADA (sem reload)
      // console.log('✅ Salvamento concluído, validando em malha fechada...');
      
      setMessage({ 
        type: 'success', 
        text: `✓ ${savedCount} alterações salvas! Atualizando com dados salvos...`
      });
      
      // VALIDAÇÃO EM MALHA FECHADA: Recarregar dados do banco para confirmar salvamento
      try {
        // 1. Buscar dados atualizados do banco via API (rota existente)
        const validateResponse = await fetch(`http://localhost:3001/api/content/${pageId}`);
        
        if (!validateResponse.ok) {
          throw new Error('Erro ao validar dados do servidor');
        }
        
        const validatedData = await validateResponse.json();
        // console.log('📥 Dados validados do servidor:', validatedData);
        
        // Extrair o objeto de conteúdo da resposta
        const contentJson = validatedData.content || {};
        // console.log('📦 Content JSON do DB:', contentJson);
        
        // 2. Atualizar campos com valores confirmados do banco
        setFields(prev => {
          const updatedFields = prev.map(field => {
            // Verificar se campo existe nos dados do servidor
            const dbValue = contentJson[field.key];
            
            if (dbValue !== undefined && dbValue !== null) {
              console.log(`✓ Validado [${field.key}]: DB confirmou valor`);
              return {
                key: field.key,
                originalValue: dbValue, // Valor do DB vira novo "original"
                currentValue: dbValue,  // Sincroniza com DB
                isModified: false       // Remove flag de modificação
              };
            }
            
            // Manter campo se não foi salvo no DB (ex: campos locais)
            return {
              ...field,
              isModified: false // Mas remove flag de modificação
            };
          });
          
          // console.log('✅ Campos sincronizados com banco:', updatedFields.length);
          return updatedFields;
        });
        
        // 3. Aplicar valores validados no DOM
        // Função auxiliar para buscar valor em estrutura aninhada
        const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
          const parts = path.split('.');
          let current: unknown = obj;
          for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
              current = current[part];
            } else {
              return undefined;
            }
          }
          return current;
        };
        
        // Atualizar DOM com valores do DB
        fields.forEach(field => {
          const element = document.querySelector(`[data-editable="${field.key}"]`) as HTMLElement;
          if (!element) return;
          
          // Buscar valor na estrutura aninhada do DB
          const dbValue = getNestedValue(contentJson, field.key);
          
          if (dbValue !== undefined && dbValue !== null) {
            if (!field.key.includes('__styles') && !field.key.includes('.styles')) {
              // Atualizar texto no DOM
              const newText = String(dbValue);
              if (element.textContent !== newText) {
                console.log(`🔄 Sincronizando DOM [${field.key}]: "${element.textContent}" → "${newText}"`);
                element.textContent = newText;
              }
            } else {
              // Atualizar estilos no DOM
              try {
                const styles = typeof dbValue === 'string' ? JSON.parse(dbValue) : dbValue;
                Object.entries(styles).forEach(([prop, styleValue]) => {
                  element.style.setProperty(prop, styleValue as string);
                });
                console.log(`🎨 Sincronizando estilos [${field.key}]`);
              } catch (e) {
                console.error('Erro ao aplicar estilos validados:', e);
              }
            }
          }
        });
        
        // PASSO 1: Limpar Map de edições locais primeiro (já estão no DB)
        localEdits.current.clear();
        console.log('🧹 Map de edições locais limpo');
        
        // PASSO 2: Desativar lock ANTES de triggerRefresh para permitir atualização
        setEditLock(pageId, false);
        console.log('🔓 Edit lock desativado');
        
        setMessage({ 
          type: 'success', 
          text: `✓ ${savedCount} alterações salvas! Sincronizando...`
        });
        
        // PASSO 3: Trigger refresh no hook useLocaleTexts para re-buscar do Supabase
        console.log(`🔄 Triggering refresh for page: ${pageId}`);
        triggerRefresh(pageId);
        
        // PASSO 4: Aguardar React re-renderizar com novos dados do Supabase
        setTimeout(() => {
          setFields(prev => prev.map(f => ({
            ...f,
            originalValue: f.currentValue, // Novo valor se torna o original
            isModified: false // Resetar flag de modificação
          })));
          setMessage(null);
          
          // PASSO 5: Desativar modo de edição e voltar ao estado de visualização
          setIsEditMode(false);
          console.log('✅ Estado sincronizado com Supabase e modo de edição desativado');
        }, 1000); // Aguardar 1s para garantir que useLocaleTexts atualizou
        
      } catch (validationError) {
        console.error('❌ Erro na validação em malha fechada:', validationError);
        setMessage({ 
          type: 'error', 
          text: '⚠️ Dados salvos, mas falha na validação. Recarregue a página para confirmar.'
        });
        setTimeout(() => setMessage(null), 5000);
      }
      
    } catch (error) {
      console.error('=== ERROR SAVING ===');
      console.error('Error details:', error);
      setMessage({ type: 'error', text: `✗ Erro ao salvar: ${error}` });
      setTimeout(() => setMessage(null), 8000);
    } finally {
      // Liberar lock IMEDIATAMENTE para permitir nova tentativa
      isSaving.current = false;
      console.log('🔓 Save lock released');
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
    // console.log('🔙 UNDO - Restaurando valores originais...');
    
    // 1. FECHAR qualquer overlay/textarea aberto
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/80.z-\\[9999\\]');
    if (overlay) {
      overlay.remove();
      // console.log('✓ Overlay removido');
    }
    
    // 2. Limpar Map de edições locais (cancelando mudanças)
    localEdits.current.clear();
    console.log('🧹 Map de edições locais limpo (cancelamento)');
    
    // 3. Aplicar valores originais ao DOM IMEDIATAMENTE (antes do cleanup!)
    // console.log('📝 Restaurando valores no DOM...');
    console.log(`📦 Total de fields disponíveis: ${fields.length}`);
    
    let restoredTextCount = 0;
    let restoredStyleCount = 0;
    
    // Separar campos de texto e estilo para processamento
    const textFields = fields.filter(f => !f.key.includes('__styles') && !f.key.includes('.styles'));
    const styleFields = fields.filter(f => f.key.includes('__styles') || f.key.includes('.styles'));
    
    console.log(`📄 Campos de texto: ${textFields.length}`);
    console.log(`🎨 Campos de estilo: ${styleFields.length}`);
    
    // PRIMEIRO: Restaurar TEXTOS
    textFields.forEach(field => {
      const elements = document.querySelectorAll('*');
      for (const el of Array.from(elements)) {
        const element = el as HTMLElement;
        const editableKey = element.getAttribute('data-editable');
        
        if (editableKey === field.key && element.textContent !== field.originalValue) {
          console.log(`↩️ Restaurando texto [${field.key}]: "${element.textContent?.substring(0,30)}" → "${field.originalValue?.substring(0,30)}"`);
          element.textContent = field.originalValue;
          restoredTextCount++;
          break;
        }
      }
    });
    
    // SEGUNDO: Restaurar ESTILOS CSS
    styleFields.forEach(field => {
      const baseKey = field.key.replace(/\.styles$/, '').replace(/__styles$/, '');
      console.log(`🔍 Procurando elemento com key: ${baseKey} (de ${field.key})`);
      
      // Se originalValue está vazio, significa que esse campo foi criado durante edição
      // Não havia estilos originais, então removemos os estilos aplicados
      if (!field.originalValue || field.originalValue === '') {
        console.log(`   ⚠️ Sem estilos originais (campo criado durante edição) - removendo estilos aplicados`);
        
        const elements = document.querySelectorAll('*');
        for (const el of Array.from(elements)) {
          const element = el as HTMLElement;
          const editableKey = element.getAttribute('data-editable');
          
          if (editableKey === baseKey) {
            // Parsear currentValue para saber quais propriedades remover
            try {
              const currentStyles = JSON.parse(field.currentValue as string);
              Object.keys(currentStyles).forEach(prop => {
                console.log(`   → Removendo: ${prop}`);
                element.style.removeProperty(prop);
              });
              restoredStyleCount++;
            } catch (e) {
              console.error('❌ Erro ao remover estilos:', e);
            }
            break;
          }
        }
        return;
      }
      
      const elements = document.querySelectorAll('*');
      let found = false;
      
      for (const el of Array.from(elements)) {
        const element = el as HTMLElement;
        const editableKey = element.getAttribute('data-editable');
        
        if (editableKey === baseKey) {
          found = true;
          console.log(`✓ Elemento encontrado! Tag: ${element.tagName}`);
          
          try {
            const originalStyles = JSON.parse(field.originalValue as string);
            console.log(`🎨 Restaurando estilos [${baseKey}]:`, originalStyles);
            
            // Aplicar cada estilo original
            Object.entries(originalStyles).forEach(([prop, value]) => {
              console.log(`   → Aplicando: ${prop} = ${value}`);
              element.style.setProperty(prop, value as string);
            });
            
            restoredStyleCount++;
            break;
          } catch (e) {
            console.error('❌ Erro ao parsear/aplicar estilos:', e);
            console.error('   Field:', field);
          }
        }
      }
      
      if (!found) {
        console.warn(`⚠️ Elemento não encontrado para: ${baseKey}`);
      }
    });
    
    console.log(`✅ Restaurados ${restoredTextCount} textos e ${restoredStyleCount} estilos no DOM`);
    
    // 3. Restaurar todos os campos para seus valores originais no estado
    setFields(prev => {
      const restored = prev.map(field => ({
        ...field,
        currentValue: field.originalValue, // Restaura valor original
        isModified: false // Remove flag de modificação
      }));
      
      // console.log('✅ Campos restaurados no estado:', restored.length);
      return restored;
    });
    
    // 4. Desligar modo de edição (cleanup vai acontecer depois)
    setIsEditMode(false);
    setSelectedElement(null);
  };

  const handleReset = () => {
    if (confirm('Restaurar conteúdo original? Todas as edições serão perdidas.')) {
      localStorage.removeItem(`visual_${pageId}`);
      setFields([]);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      {/* Message Alert - Floating Toast */}
      {message && (
        <div className="fixed top-4 right-4 z-10000 toast-notification">
          <Alert className={`${
            message.type === 'success' 
              ? 'bg-green-500 border-green-600 text-white shadow-2xl' 
              : 'bg-red-500 border-red-600 text-white shadow-2xl'
          } min-w-[400px] max-w-[600px]`}>
            <AlertDescription className="text-white font-semibold text-base flex items-center gap-2">
              {message.text}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {!isEditMode ? (
          <button
            onClick={() => {
              // console.log('� Ativando modo de edição...');
              setIsEditMode(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#CFAF5A] hover:bg-[#B38938] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-float"
            title="Ativar Edição"
          >
            <Edit3 className="w-5 h-5" />
            <span>Ativar Edição</span>
          </button>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSave();
              }}
              disabled={!hasChanges}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                hasChanges 
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Salvar Mudanças"
            >
              <Save className="w-5 h-5" />
              <span>Salvar</span>
              {hasChanges && (
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button
              onClick={handleCancelClick}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              title="Cancelar"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </button>
          </>
        )}
      </div>

      {/* Dialog de Confirmação de Cancelamento */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Descartar Alterações?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Você tem <strong className="text-orange-600">{fields.filter(f => f.isModified).length} alteração(ões)</strong> não salvas que serão perdidas permanentemente.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                Continuar Editando
              </button>
              <button
                onClick={() => {
                  setShowCancelDialog(false);
                  performCancel();
                }}
                className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Descartar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card - Minimal */}
      {hasChanges && isEditMode && (
        <div className="fixed top-4 left-4 z-9999">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm animate-pulse">
            ⚠️ Alterações não salvas
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="fixed top-20 right-4 z-9999 max-w-xs">
          <Alert className="bg-blue-50 border-blue-300 shadow-lg">
            <AlertDescription className="text-blue-900 text-xs">
              <strong>Modo Ativo:</strong> Clique em textos destacados para editar.
              <div className="mt-1">
                <kbd className="px-1 py-0.5 bg-white rounded border text-[10px]">Ctrl+Enter</kbd> salvar | 
                <kbd className="px-1 py-0.5 bg-white rounded border text-[10px] ml-1">Esc</kbd> cancelar
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Página Renderizada */}
      <div className={isEditMode ? 'border-4 border-dashed border-amber-400 rounded-lg' : ''}>
        <PageComponent />
      </div>
    </div>
  );
}
