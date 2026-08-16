import { useState, useCallback, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';

export function useDocEditorDragAndDrop(editor: Editor | null) {
  const editorRef = useRef<Editor | null>(editor);
  editorRef.current = editor;

  const [dragState, setDragState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    pos: number;
    nodeType?: string;
    nodeLevel?: number;
    isEmpty?: boolean;
    isDragging?: boolean;
  }>({
    visible: false,
    top: 0,
    left: 10,
    pos: 0,
    nodeType: 'paragraph',
    nodeLevel: undefined,
    isEmpty: false,
    isDragging: false,
  });

  const [typeMenuState, setTypeMenuState] = useState<{
    isOpen: boolean;
    pos: number;
    anchorRect: DOMRect | null;
    nodeType?: string;
    nodeLevel?: number;
    nodeSize?: number;
  }>({
    isOpen: false,
    pos: 0,
    anchorRect: null,
  });

  const [dropIndicatorState, setDropIndicatorState] = useState<{ visible: boolean; top: number }>({
    visible: false,
    top: 0,
  });

  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);

  const handleDragNodeChange = useCallback(
    (data: {
      top: number;
      left: number;
      pos: number;
      nodeType?: string;
      nodeLevel?: number;
      isEmpty?: boolean;
    } | null) => {
      setTypeMenuState((typeMenu) => {
        if (typeMenu.isOpen) {
          return typeMenu;
        }
        if (data) {
          setDragState({
            visible: true,
            top: data.top,
            left: data.left,
            pos: data.pos,
            nodeType: data.nodeType,
            nodeLevel: data.nodeLevel,
            isEmpty: data.isEmpty,
          });
        } else {
          setDragState((prev) => ({ ...prev, visible: false }));
        }
        return typeMenu;
      });
    },
    []
  );

  useEffect(() => {
    const handleSlashMenuChange = (e: any) => {
      setIsSlashMenuOpen(!!e.detail?.isOpen);
      if (e.detail?.isOpen) {
        setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    const handleGlobalMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInsideDrag =
        target.closest('[class*="combinedDragHandleBtn"]') ||
        target.closest('[class*="dragHandle"]') ||
        target.closest('[class*="blockIconBtn"]');
      const isInsideBlockMenu = target.closest('[class*="blockTypeMenu"]');

      if (!isInsideDrag) {
        setDragState((prev) => ({ ...prev, visible: false }));
      }
      if (!isInsideDrag && !isInsideBlockMenu) {
        setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    const handleGlobalKeyDown = () => {
      window.dispatchEvent(new CustomEvent('HIDE_ALL_FLOATING_MENUS'));
      setDragState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener('SLASH_MENU_CHANGE', handleSlashMenuChange);
    window.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('SLASH_MENU_CHANGE', handleSlashMenuChange);
      window.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const currentEditor = editorRef.current;
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (!currentEditor) return;
    const editorDom = currentEditor.view.dom;
    const containerRect = e.currentTarget.getBoundingClientRect();
    const blocks = Array.from(editorDom.children) as HTMLElement[];

    if (blocks.length === 0) return;

    const mouseY = e.clientY;
    let calculatedLineTop = 0;

    if (mouseY < blocks[0].getBoundingClientRect().top + blocks[0].getBoundingClientRect().height / 2) {
      calculatedLineTop = blocks[0].getBoundingClientRect().top - containerRect.top;
    } else if (
      mouseY >=
      blocks[blocks.length - 1].getBoundingClientRect().top +
        blocks[blocks.length - 1].getBoundingClientRect().height / 2
    ) {
      calculatedLineTop = blocks[blocks.length - 1].getBoundingClientRect().bottom - containerRect.top;
    } else {
      for (let i = 0; i < blocks.length - 1; i++) {
        const currentRect = blocks[i].getBoundingClientRect();
        const nextRect = blocks[i + 1].getBoundingClientRect();
        const currentMid = currentRect.top + currentRect.height / 2;
        const nextMid = nextRect.top + nextRect.height / 2;

        if (mouseY >= currentMid && mouseY < nextMid) {
          calculatedLineTop = nextRect.top - containerRect.top;
          break;
        }
      }
    }

    setDropIndicatorState({ visible: true, top: calculatedLineTop });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropIndicatorState({ visible: false, top: 0 });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const currentEditor = editorRef.current;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const hasImage = Array.from(e.dataTransfer.files).some((f) => f.type.startsWith('image/'));
      if (hasImage) return;
    }

    e.preventDefault();
    setDropIndicatorState({ visible: false, top: 0 });
    if (!currentEditor) return;

    const posStr = e.dataTransfer.getData('application/x-tiptap-dragged-pos');
    if (!posStr) return;
    const fromPos = parseInt(posStr, 10);
    if (isNaN(fromPos)) return;

    const editorDom = currentEditor.view.dom;
    const blocks = Array.from(editorDom.children) as HTMLElement[];
    if (blocks.length === 0) return;

    const mouseY = e.clientY;
    let targetBlockDom: HTMLElement | null = null;
    let dropAfter = false;

    if (mouseY < blocks[0].getBoundingClientRect().top + blocks[0].getBoundingClientRect().height / 2) {
      targetBlockDom = blocks[0];
      dropAfter = false;
    } else if (
      mouseY >=
      blocks[blocks.length - 1].getBoundingClientRect().top +
        blocks[blocks.length - 1].getBoundingClientRect().height / 2
    ) {
      targetBlockDom = blocks[blocks.length - 1];
      dropAfter = true;
    } else {
      for (let i = 0; i < blocks.length - 1; i++) {
        const currentRect = blocks[i].getBoundingClientRect();
        const nextRect = blocks[i + 1].getBoundingClientRect();
        const currentMid = currentRect.top + currentRect.height / 2;
        const nextMid = nextRect.top + nextRect.height / 2;

        if (mouseY >= currentMid && mouseY < nextMid) {
          targetBlockDom = blocks[i + 1];
          dropAfter = false;
          break;
        }
      }
    }

    if (targetBlockDom) {
      try {
        const domPos = currentEditor.view.posAtDOM(targetBlockDom, 0);
        if (domPos !== null && domPos !== undefined) {
          const resolved = currentEditor.state.doc.resolve(Math.min(domPos, currentEditor.state.doc.content.size));
          const blockStart = resolved.before(1);
          let targetPos = blockStart;

          if (dropAfter) {
            targetPos = resolved.after(1);
          }

          if (fromPos !== targetPos) {
            const nodeToMove = currentEditor.state.doc.nodeAt(fromPos);
            if (nodeToMove) {
              const tr = currentEditor.state.tr;
              if (fromPos < targetPos) {
                tr.insert(targetPos, nodeToMove);
                tr.delete(fromPos, fromPos + nodeToMove.nodeSize);
              } else {
                tr.delete(fromPos, fromPos + nodeToMove.nodeSize);
                tr.insert(targetPos, nodeToMove);
              }
              currentEditor.view.dispatch(tr);
            }
          }
        }
      } catch (_err) {
        // fallback
      }
    }
    setDropIndicatorState({ visible: false, top: 0 });
    setDragState((prev) => ({ ...prev, visible: false, isDragging: false }));
  }, []);

  return {
    dragState,
    setDragState,
    typeMenuState,
    setTypeMenuState,
    dropIndicatorState,
    setDropIndicatorState,
    isSlashMenuOpen,
    handleDragNodeChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
