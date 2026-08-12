import React from 'react';
import { GripVertical } from 'lucide-react';
import styles from '../../DocEditor.module.css';

export interface DragHandleProps {
  top: number;
  left?: number;
  pos: number;
  visible: boolean;
  onMouseDown?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const DragHandleUI: React.FC<DragHandleProps> = ({
  top,
  left = 10,
  pos,
  visible,
  onMouseDown,
  onDragStart,
  onDragEnd,
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
        if (onDragStart) onDragStart();
        e.dataTransfer.setData('application/x-tiptap-dragged-pos', String(pos));
        e.dataTransfer.effectAllowed = 'move';

        // 终极第一性原理解法：创建独立极简 Ghost DOM 卡片，彻底斩断原生 DOM 截取全页面的浏览器 Bug
        const handleEl = e.currentTarget;
        const handleRect = handleEl.getBoundingClientRect();
        const handleCenterY = handleRect.top + handleRect.height / 2;

        const container = handleEl.closest('[class*="editorContainer"]');
        if (container) {
          const blocks = Array.from(container.querySelectorAll('.ProseMirror > *')) as HTMLElement[];
          let matchedBlock: HTMLElement | null = null;

          for (const b of blocks) {
            const r = b.getBoundingClientRect();
            if (handleCenterY >= r.top - 6 && handleCenterY <= r.bottom + 6) {
              matchedBlock = b;
              break;
            }
          }

          if (matchedBlock && typeof e.dataTransfer.setDragImage === 'function') {
            const ghost = document.createElement('div');
            ghost.style.position = 'absolute';
            ghost.style.top = '-9999px';
            ghost.style.left = '-9999px';
            ghost.style.width = '240px';
            ghost.style.padding = '8px 12px';
            ghost.style.background = '#ffffff';
            ghost.style.border = '2px solid #2563eb';
            ghost.style.borderRadius = '8px';
            ghost.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.2)';
            ghost.style.fontSize = '13px';
            ghost.style.fontWeight = '500';
            ghost.style.color = '#1e293b';
            ghost.style.pointerEvents = 'none';
            ghost.style.zIndex = '99999';

            const rawText = matchedBlock.innerText.trim().slice(0, 24);
            ghost.innerText = rawText ? `已选中: ${rawText}...` : '块节点重排中';

            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 20, 15);
            setTimeout(() => {
              if (document.body.contains(ghost)) {
                document.body.removeChild(ghost);
              }
            }, 0);
          }
        }
      }}
      onDragEnd={() => {
        if (onDragEnd) onDragEnd();
      }}
      title="按住拖拽重排块位置"
    >
      <GripVertical size={16} />
    </div>
  );
};
