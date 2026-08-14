import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import styles from './ImageBlockView.module.css';
import type { ImageBlockAttributes } from './types';
import { ImageUploadService } from '../../services/imageUploadService';
import { ImageBubbleMenu } from './ImageBubbleMenu';
import { getActiveToolbarInfo, hoverStackManager } from '../../utils/toolbarPriority';

export const ImageBlockView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, deleteNode, selected, editor } = props;
  const attrs = node.attrs as ImageBlockAttributes;

  const [isRetrying, setIsRetrying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [, setHoverStateListener] = useState(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const unsubscribe = hoverStackManager.subscribe(() => {
      setHoverStateListener((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleHideAll = () => {
      clearHideTimeout();
      setIsHovered(false);
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    };
  }, []);

  const handleMouseEnter = () => {
    clearHideTimeout();
    setIsHovered(true);
    if (typeof props.getPos === 'function') {
      const pos = props.getPos();
      if (typeof pos === 'number') {
        hoverStackManager.register({
          id: `image-${pos}`,
          type: 'image',
          depth: 2,
          nodePos: pos,
        });
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    clearHideTimeout();
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (
      relatedTarget &&
      (relatedTarget.closest('[class*="unifiedToolbar"]') ||
        relatedTarget.closest('[class*="BubbleMenu"]') ||
        relatedTarget.closest('[class*="popover"]'))
    ) {
      return;
    }
    if (typeof props.getPos === 'function') {
      const pos = props.getPos();
      if (typeof pos === 'number') {
        hoverStackManager.unregister(`image-${pos}`, 250);
      }
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250);
  };

  // 决定最终展示的图片 source
  const displaySrc = attrs.blobSrc || attrs.src;

  const handleAlignmentChange = (newAlign: 'left' | 'center' | 'right') => {
    updateAttributes({ alignment: newAlign });
  };

  // 明确判断描述框是否应该展出
  const isCaptionVisible = !!attrs.showCaption;

  const handleToggleCaption = () => {
    updateAttributes({ showCaption: !isCaptionVisible });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ caption: e.target.value, showCaption: true });
  };

  const handleRetryUpload = async () => {
    if (!attrs.blobSrc) return;
    setIsRetrying(true);
    updateAttributes({ status: 'uploading', errorMessage: null });

    try {
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

  const activeToolbar = getActiveToolbarInfo(editor, isHovered ? 'image' : undefined);
  const showBubbleMenu = editor?.isEditable && activeToolbar.type === 'image';

  return (
    <NodeViewWrapper
      className={`${styles.imageBlockContainer} ${alignmentClass} ${selected ? styles.selected : ''}`}
      style={{ position: 'relative', overflow: 'visible' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      {/* 图片描述 Caption 编辑框：由 isCaptionVisible 开关严格控制 */}
      {isCaptionVisible && (
        <input
          type="text"
          value={attrs.caption || ''}
          placeholder="添加图片描述 (Caption)..."
          onChange={handleCaptionChange}
          className={styles.captionInput}
          autoFocus
        />
      )}

      {/* 气泡悬浮菜单 Bubble Menu */}
      {showBubbleMenu && (
        <ImageBubbleMenu
          editor={editor}
          alignment={attrs.alignment}
          storageType={attrs.storageType}
          caption={attrs.caption || ''}
          showCaption={isCaptionVisible}
          getPos={props.getPos}
          nodeSize={node.nodeSize}
          onAlignChange={handleAlignmentChange}
          onCaptionChange={(cap) => updateAttributes({ caption: cap, showCaption: true })}
          onToggleCaption={handleToggleCaption}
          onConvertToLocal={handleConvertToLocal}
          onDelete={deleteNode}
        />
      )}
    </NodeViewWrapper>
  );
};
