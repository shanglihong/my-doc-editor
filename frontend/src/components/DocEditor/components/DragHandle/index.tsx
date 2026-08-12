import React from 'react';
import { GripVertical } from 'lucide-react';
import styles from '../../DocEditor.module.css';

export interface DragHandleProps {
  top: number;
  left?: number;
  pos: number;
  visible: boolean;
  onMouseDown?: () => void;
}

export const DragHandleUI: React.FC<DragHandleProps> = ({
  top,
  left = 10,
  pos,
  visible,
  onMouseDown,
}) => {
  if (!visible) return null;

  return (
    <div
      className={styles.dragHandle}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        opacity: visible ? 1 : 0,
      }}
      draggable
      onMouseDown={onMouseDown}
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-tiptap-dragged-pos', String(pos));
        e.dataTransfer.effectAllowed = 'move';

        // 将整个 Block DOM 节点设为拖拽预览虚影 (Drag Preview Ghost Image)
        const container = e.currentTarget.closest('[class*="editorContainer"]');
        if (container) {
          const blocks = container.querySelectorAll('.ProseMirror > *');
          let matchedBlock: HTMLElement | null = null;
          let minDiff = Infinity;

          const containerTop = container.getBoundingClientRect().top;
          blocks.forEach((b) => {
            const el = b as HTMLElement;
            const bTop = el.getBoundingClientRect().top - containerTop;
            const diff = Math.abs(bTop - top);
            if (diff < minDiff) {
              minDiff = diff;
              matchedBlock = el;
            }
          });

          if (matchedBlock && typeof e.dataTransfer.setDragImage === 'function') {
            e.dataTransfer.setDragImage(matchedBlock, 0, 10);
          }
        }
      }}
      title="按住拖拽重排块位置"
    >
      <GripVertical size={16} />
    </div>
  );
};
