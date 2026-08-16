import React from 'react';
import type { Editor } from '@tiptap/react';
import { DragHandleUI } from './DragHandle';
import { BlockTypeMenu } from './BlockTypeMenu';
import { BubbleToolbar } from './BubbleToolbar';
import { TableBubbleMenu } from './TableBubbleMenu';
import { CalloutBubbleMenu } from './Callout/CalloutBubbleMenu';
import { DrawIOModal } from './DrawIO/DrawIOModal';
import { TableOfContents } from './TableOfContents';
import type { DrawIOModalState } from '../types';

export interface DocEditorOverlaysProps {
  editor: Editor | null;
  styles: Record<string, string>;
  dragState: {
    visible: boolean;
    top: number;
    left: number;
    pos: number;
    nodeType?: string;
    nodeLevel?: number;
    isEmpty?: boolean;
    isDragging?: boolean;
  };
  setDragState: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      top: number;
      left: number;
      pos: number;
      nodeType?: string;
      nodeLevel?: number;
      isEmpty?: boolean;
      isDragging?: boolean;
    }>
  >;
  typeMenuState: {
    isOpen: boolean;
    pos: number;
    anchorRect: DOMRect | null;
    nodeType?: string;
    nodeLevel?: number;
    nodeSize?: number;
  };
  setTypeMenuState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      pos: number;
      anchorRect: DOMRect | null;
      nodeType?: string;
      nodeLevel?: number;
      nodeSize?: number;
    }>
  >;
  dropIndicatorState: { visible: boolean; top: number };
  setDropIndicatorState: React.Dispatch<React.SetStateAction<{ visible: boolean; top: number }>>;
  isSlashMenuOpen: boolean;
  drawioModalState: DrawIOModalState;
  setDrawioModalState: React.Dispatch<React.SetStateAction<DrawIOModalState>>;
  handleSaveDrawIO: (xml: string, svg: string) => void;
  showToc?: boolean;
  isTocExpanded?: boolean;
  onTocExpandChange?: (expanded: boolean) => void;
}

export const DocEditorOverlays: React.FC<DocEditorOverlaysProps> = ({
  editor,
  styles,
  dragState,
  setDragState,
  typeMenuState,
  setTypeMenuState,
  dropIndicatorState,
  setDropIndicatorState,
  isSlashMenuOpen,
  drawioModalState,
  setDrawioModalState,
  handleSaveDrawIO,
  showToc = true,
  isTocExpanded,
  onTocExpandChange,
}) => {
  // 捕获阶段点击外部区域收起所有展开的下拉菜单/调色板弹窗
  React.useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInsidePopup =
        target.closest('[class*="popover"]') ||
        target.closest('[class*="Popover"]') ||
        target.closest('[class*="Dropdown"]') ||
        target.closest('[class*="dropdown"]') ||
        target.closest('[class*="Picker"]') ||
        target.closest('[class*="picker"]') ||
        target.closest('[class*="floatingBlockTool"]') ||
        target.closest('[class*="bubbleToolbar"]') ||
        target.closest('[class*="tableBubbleMenu"]') ||
        target.closest('[class*="calloutBubbleMenu"]') ||
        target.closest('[class*="unifiedToolbar"]') ||
        target.closest('[class*="Btn"]') ||
        target.closest('[class*="btn"]') ||
        target.closest('[class*="slashMenu"]');

      if (!isInsidePopup) {
        setTypeMenuState((prev) => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      }
    };

    document.addEventListener('mousedown', handleGlobalMouseDown, true);
    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown, true);
    };
  }, [setTypeMenuState]);
  return (
    <>
      {dropIndicatorState.visible && (
        <div
          className={styles.dropIndicator}
          style={{ top: `${dropIndicatorState.top}px` }}
        />
      )}
      <DragHandleUI
        top={dragState.top}
        left={dragState.left}
        pos={dragState.pos}
        visible={(dragState.visible || typeMenuState.isOpen) && !isSlashMenuOpen}
        nodeType={dragState.nodeType}
        nodeLevel={dragState.nodeLevel}
        isEmpty={dragState.isEmpty}
        onMouseDown={() => setTypeMenuState((prev) => ({ ...prev, isOpen: false }))}
        onDragStart={() => {
          setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
          setDragState((prev) => ({ ...prev, isDragging: true }));
        }}
        onDragEnd={() => {
          setDragState((prev) => ({ ...prev, visible: false, isDragging: false }));
          setDropIndicatorState({ visible: false, top: 0 });
        }}
        onOpenTypeMenu={(pos, anchorRect) => {
          const targetNode = editor?.state.doc.nodeAt(pos);
          setTypeMenuState({
            isOpen: true,
            pos,
            anchorRect,
            nodeType: dragState.nodeType,
            nodeLevel: dragState.nodeLevel,
            nodeSize: targetNode?.nodeSize || 1,
          });
        }}
      />
      <BlockTypeMenu
        editor={editor}
        pos={typeMenuState.pos}
        anchorRect={typeMenuState.anchorRect}
        isOpen={typeMenuState.isOpen}
        nodeType={typeMenuState.nodeType}
        nodeLevel={typeMenuState.nodeLevel}
        nodeSize={typeMenuState.nodeSize}
        onClose={() => {
          setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
          setDragState((prev) => ({ ...prev, visible: false }));
        }}
      />
      <BubbleToolbar
        editor={editor}
        isDragging={dragState.isDragging}
        isTypeMenuOpen={typeMenuState.isOpen}
      />
      <TableBubbleMenu
        editor={editor}
        isDragging={dragState.isDragging}
        isTypeMenuOpen={typeMenuState.isOpen}
      />
      <CalloutBubbleMenu
        editor={editor}
        isDragging={dragState.isDragging}
        isTypeMenuOpen={typeMenuState.isOpen}
      />
      <DrawIOModal
        isOpen={drawioModalState.isOpen}
        initialXml={drawioModalState.initialXml}
        onSave={handleSaveDrawIO}
        onClose={() => setDrawioModalState((prev) => ({ ...prev, isOpen: false }))}
      />
      {showToc && (
        <TableOfContents
          editor={editor}
          isExpanded={isTocExpanded}
          onExpandChange={onTocExpandChange}
        />
      )}
    </>
  );
};
