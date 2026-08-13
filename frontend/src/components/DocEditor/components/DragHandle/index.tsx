import React from 'react';
import { GripVertical } from 'lucide-react';
import styles from '../../DocEditor.module.css';
import { BlockIcon } from '../../utils/blockIcons';

export interface DragHandleProps {
  top: number;
  left?: number;
  pos: number;
  visible: boolean;
  nodeType?: string;
  nodeLevel?: number;
  isEmpty?: boolean;
  onMouseDown?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onOpenTypeMenu?: (pos: number, anchorRect: DOMRect) => void;
}

export const DragHandleUI: React.FC<DragHandleProps> = ({
  top,
  left = 10,
  pos,
  visible,
  nodeType = 'paragraph',
  nodeLevel,
  isEmpty = false,
  onMouseDown,
  onDragStart,
  onDragEnd,
  onOpenTypeMenu,
}) => {
  if (!visible) return null;

  return (
    <div
      className={styles.dragHandleContainer}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        opacity: visible ? 1 : 0,
      }}
    >
      {/* 左侧 Block 类型 / 加号图标按钮 */}
      <button
        type="button"
        className={styles.blockIconBtn}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (onOpenTypeMenu) {
            const rect = e.currentTarget.getBoundingClientRect();
            onOpenTypeMenu(pos, rect);
          }
        }}
        title={isEmpty ? '点此选择 Block 类型' : '点击切换 Block 类型'}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <BlockIcon type={nodeType} level={nodeLevel} isEmpty={isEmpty} size={14} />
      </button>

      {/* 右侧六点拖拽把手 */}
      <div
        className={styles.dragHandle}
        draggable
        onMouseDown={onMouseDown}
        onDragStart={(e) => {
          if (onDragStart) onDragStart();
          e.dataTransfer.setData('application/x-tiptap-dragged-pos', String(pos));
          e.dataTransfer.effectAllowed = 'move';

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
        <GripVertical size={15} color="#94a3b8" />
      </div>
    </div>
  );
};
