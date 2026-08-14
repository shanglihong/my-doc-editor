import React, { useState } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import styles from './ImageBlockView.module.css';
import type { ImageBlockAttributes } from './types';
import { ImageUploadService } from '../../services/imageUploadService';
import { ImageBubbleMenu } from './ImageBubbleMenu';
import { getActiveToolbarInfo } from '../../utils/toolbarPriority';

export const ImageBlockView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, deleteNode, selected, editor } = props;
  const attrs = node.attrs as ImageBlockAttributes;

  const [isRetrying, setIsRetrying] = useState(false);

  // 决定最终展示的图片 source（优先使用 Blob 乐观预览，其次使用持久路径）
  const displaySrc = attrs.blobSrc || attrs.src;

  const handleAlignmentChange = (newAlign: 'left' | 'center' | 'right') => {
    updateAttributes({ alignment: newAlign });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ caption: e.target.value });
  };

  const handleRetryUpload = async () => {
    if (!attrs.blobSrc) return;
    setIsRetrying(true);
    updateAttributes({ status: 'uploading', errorMessage: null });

    try {
      // 提取原始 Blob 并重试
      const res = await fetch(attrs.blobSrc);
      const blob = await res.blob();
      const result = await ImageUploadService.uploadImage(blob);

      updateAttributes({
        src: result.url,
        status: 'ready',
        blobSrc: null,
      });
    } catch (err: any) {
      updateAttributes({
        status: 'error',
        errorMessage: err?.message || '重新上传失败，请再次重试',
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleConvertToLocal = async () => {
    if (!attrs.src || attrs.storageType === 'local') return;

    updateAttributes({ status: 'uploading' });
    try {
      const result = await ImageUploadService.fetchAndStoreUrl(attrs.src);
      updateAttributes({
        src: result.url,
        storageType: 'local',
        status: 'ready',
      });
    } catch {
      updateAttributes({
        status: 'error',
        errorMessage: '转存至本地存储目录失败',
      });
    }
  };

  const alignmentClass =
    attrs.alignment === 'left'
      ? styles.alignLeft
      : attrs.alignment === 'right'
        ? styles.alignRight
        : styles.alignCenter;

  return (
    <NodeViewWrapper
      className={`${styles.imageBlockContainer} ${alignmentClass} ${selected ? styles.selected : ''
        }`}
    >
      <div className={styles.imageWrapper}>
        {/* 存储模式 Badge */}
        {attrs.status === 'ready' && (
          <span className={styles.storageBadge}>
            {attrs.storageType === 'local' ? '本地存储' : '网络外链'}
          </span>
        )}

        {/* 核心图片 */}
        {displaySrc && (
          <img
            src={displaySrc}
            alt={attrs.caption || attrs.alt || '图片'}
            className={styles.image}
            style={{
              width: attrs.width !== 'auto' ? attrs.width : undefined,
              height: attrs.height !== 'auto' ? attrs.height : undefined,
            }}
          />
        )}

        {/* 乐观 UI 上传中加载指示器 */}
        {attrs.status === 'uploading' && (
          <div className={styles.uploadingOverlay}>
            <Loader2 className={styles.spinner} />
            <span>正在保存至存储目录...</span>
          </div>
        )}

        {/* 上传失败/处理错误覆盖层 */}
        {attrs.status === 'error' && (
          <div className={styles.errorOverlay}>
            <AlertCircle size={24} />
            <span>{attrs.errorMessage || '图片保存失败'}</span>
            {attrs.blobSrc && (
              <button
                type="button"
                className={styles.retryBtn}
                onClick={handleRetryUpload}
                disabled={isRetrying}
              >
                <RefreshCw size={14} className={isRetrying ? styles.spinner : ''} />
                重试上传
              </button>
            )}
          </div>
        )}
      </div>

      {/* 图片描述 Caption 编辑框 */}
      {(attrs.caption !== undefined || selected) && (
        <input
          type="text"
          value={attrs.caption || ''}
          placeholder="添加图片描述 (Caption)..."
          onChange={handleCaptionChange}
          className={styles.captionInput}
        />
      )}

      {/* 气泡悬浮菜单 Bubble Menu (仅当当前选区最深活动层级为 image 时展示) */}
      {selected && getActiveToolbarInfo(editor).type === 'image' && (
        <ImageBubbleMenu
          editor={editor}
          alignment={attrs.alignment}
          storageType={attrs.storageType}
          caption={attrs.caption || ''}
          onAlignChange={handleAlignmentChange}
          onCaptionChange={(cap) => updateAttributes({ caption: cap })}
          onConvertToLocal={handleConvertToLocal}
          onDelete={deleteNode}
        />
      )}
    </NodeViewWrapper>
  );
};
