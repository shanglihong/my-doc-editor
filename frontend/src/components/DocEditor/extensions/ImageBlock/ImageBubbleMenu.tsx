import React from 'react';
import type { Editor } from '@tiptap/core';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  Trash2,
  Tag,
} from 'lucide-react';
import styles from './ImageBubbleMenu.module.css';
import type { ImageAlignment, ImageStorageType } from './types';

export interface ImageBubbleMenuProps {
  editor: Editor;
  alignment: ImageAlignment;
  storageType: ImageStorageType;
  caption: string;
  onAlignChange: (align: ImageAlignment) => void;
  onCaptionChange: (caption: string) => void;
  onConvertToLocal: () => void;
  onDelete: () => void;
}

export const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({
  alignment,
  storageType,
  caption,
  onAlignChange,
  onCaptionChange,
  onConvertToLocal,
  onDelete,
}) => {
  const handlePromptCaption = () => {
    const input = window.prompt('请输入/编辑图片描述 (Caption):', caption);
    if (input !== null) {
      onCaptionChange(input);
    }
  };

  return (
    <div className={styles.bubbleMenu} onClick={(e) => e.stopPropagation()}>
      {/* 对齐控制组 */}
      <div className={styles.btnGroup}>
        <button
          type="button"
          className={`${styles.iconBtn} ${alignment === 'left' ? styles.active : ''}`}
          onClick={() => onAlignChange('left')}
          title="左对齐"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          className={`${styles.iconBtn} ${alignment === 'center' ? styles.active : ''}`}
          onClick={() => onAlignChange('center')}
          title="居中对齐"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          className={`${styles.iconBtn} ${alignment === 'right' ? styles.active : ''}`}
          onClick={() => onAlignChange('right')}
          title="右对齐"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 图片描述按钮 */}
      <button
        type="button"
        className={styles.textBtn}
        onClick={handlePromptCaption}
        title="编辑图片描述"
      >
        <Tag size={14} />
        <span>描述</span>
      </button>

      {/* 外链转存按钮 */}
      {storageType === 'external' && (
        <>
          <div className={styles.divider} />
          <button
            type="button"
            className={styles.textBtn}
            onClick={onConvertToLocal}
            title="将外链图片下载保存至本地存储目录"
          >
            <Download size={14} />
            <span>转存本地</span>
          </button>
        </>
      )}

      <div className={styles.divider} />

      {/* 删除 Block */}
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.deleteBtn}`}
        onClick={onDelete}
        title="删除图片 Block"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
