import React from 'react';
import type { Editor } from '@tiptap/core';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Tag,
} from 'lucide-react';
import styles from './ImageBubbleMenu.module.css';
import type { ImageAlignment } from './types';
import { UnifiedBlockToolbar } from '../../components/UnifiedBlockToolbar';

export interface ImageBubbleMenuProps {
  editor: Editor;
  alignment: ImageAlignment;
  caption: string;
  showCaption?: boolean;
  getPos: (() => number | undefined) | boolean | undefined;
  nodeSize: number;
  onAlignChange: (align: ImageAlignment) => void;
  onCaptionChange: (caption: string) => void;
  onToggleCaption: () => void;
  onDelete: () => void;
}

export const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({
  editor,
  alignment,
  showCaption,
  getPos,
  nodeSize,
  onAlignChange,
  onToggleCaption,
  onDelete,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <UnifiedBlockToolbar
        editor={editor}
        getPos={getPos}
        nodeSize={nodeSize}
        onDeleteBlock={onDelete}
      >
        {/* 对齐控制组 */}
        <div className={styles.btnGroup}>
          <button
            type="button"
            className={`${styles.iconBtn} ${alignment === 'left' ? styles.active : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onAlignChange('left');
            }}
            title="左对齐"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${alignment === 'center' ? styles.active : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onAlignChange('center');
            }}
            title="居中对齐"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            className={`${styles.iconBtn} ${alignment === 'right' ? styles.active : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onAlignChange('right');
            }}
            title="右对齐"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* 控制下方图片描述显隐按钮 */}
        <button
          type="button"
          className={`${styles.iconBtn} ${showCaption ? styles.active : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onToggleCaption();
          }}
          title={showCaption ? '收起/隐藏图片描述' : '展开/编辑图片描述'}
        >
          <Tag size={16} />
        </button>
      </UnifiedBlockToolbar>
    </div>
  );
};

export default ImageBubbleMenu;
