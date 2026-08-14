import React from 'react';
import type { Editor } from '@tiptap/core';
import { Trash2 } from 'lucide-react';
import styles from './UnifiedBlockToolbar.module.css';
import { InsertBlockDropdown } from '../NonTextBlockToolbar/InsertBlockDropdown';

export interface UnifiedBlockToolbarProps {
  /** TipTap 编辑器实例 */
  editor: Editor;
  /** 获取当前 Block 节点在文档中的位置 */
  getPos?: (() => number | undefined) | boolean;
  /** 当前 Block 节点的大小 node.nodeSize */
  nodeSize?: number;
  /** 自定义/直接传入的 Block 删除回调（若传则优先使用） */
  onDeleteBlock?: () => void;
  /** 是否隐藏左侧固定内置项，默认为 false */
  hideBuiltinLeft?: boolean;
  /** 右侧自定制组件插槽 */
  children?: React.ReactNode;
  /** 自定义外层 style */
  style?: React.CSSProperties;
  /** 自定义 class */
  className?: string;
  /** 鼠标移入容器事件，防止悬停离开误隐藏 */
  onMouseEnter?: (e: React.MouseEvent) => void;
  /** 鼠标移出容器事件 */
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export const UnifiedBlockToolbar: React.FC<UnifiedBlockToolbarProps> = ({
  editor,
  getPos,
  nodeSize = 1,
  onDeleteBlock,
  hideBuiltinLeft = false,
  children,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDeleteBlock) {
      onDeleteBlock();
      return;
    }

    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number' && editor) {
        editor.chain().focus().deleteRange({ from: pos, to: pos + nodeSize }).run();
      }
    }
  };

  return (
    <div
      className={`${styles.unifiedToolbarContainer} ${className || ''}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {!hideBuiltinLeft && (
        <>
          <div className={styles.leftGroup}>
            <InsertBlockDropdown
              editor={editor}
              getPos={getPos}
              nodeSize={nodeSize}
            />
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.dangerBtn}`}
              onClick={handleDelete}
              title="删除块"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {children && <div className={styles.divider} />}
        </>
      )}

      {children && <div className={styles.rightGroup}>{children}</div>}
    </div>
  );
};
