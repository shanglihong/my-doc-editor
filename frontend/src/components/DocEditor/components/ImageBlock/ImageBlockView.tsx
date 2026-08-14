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
  const [isResizing, setIsResizing] = useState(false);
  const [, setHoverStateListener] = useState(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

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
    if (isResizing) return;
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

  const displaySrc = attrs.src;

  const handleAlignmentChange = (newAlign: 'left' | 'center' | 'right') => {
    updateAttributes({ alignment: newAlign });
  };

  const isCaptionVisible = !!attrs.showCaption;

  const handleToggleCaption = () => {
    updateAttributes({ showCaption: !isCaptionVisible });
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ caption: e.target.value, showCaption: true });
  };

  const handleRetryUpload = async () => {
    if (!attrs.src) return;
    setIsRetrying(true);
    updateAttributes({ status: 'uploading', errorMessage: null });

    try {
      const res = await fetch(attrs.src);
      const blob = await res.blob();
      const result = await ImageUploadService.uploadImage(blob);

      updateAttributes({
        src: result.url,
        status: 'ready',
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

  // 极简右侧拖拽手柄
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!imageWrapperRef.current) return;

    const startX = e.clientX;
    const startWidth = imageWrapperRef.current.offsetWidth;
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const currentX = moveEvent.clientX;
      const diffX = currentX - startX;

      const newWidth = Math.max(120, Math.min(1200, startWidth + diffX));
      updateAttributes({ width: `${newWidth}px` });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const alignmentClass =
    attrs.alignment === 'left'
      ? styles.alignLeft
      : attrs.alignment === 'right'
        ? styles.alignRight
        : styles.alignCenter;

  const activeToolbar = getActiveToolbarInfo(editor, isHovered ? 'image' : undefined);
  const showBubbleMenu = editor?.isEditable && activeToolbar.type === 'image';
  const showHandles = editor?.isEditable && (selected || isHovered || isResizing);

  return (
    <NodeViewWrapper
      className={`${styles.imageBlockContainer} ${alignmentClass} ${selected ? styles.selected : ''}`}
      style={{ position: 'relative', overflow: 'visible' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageWrapperRef}
        className={styles.imageWrapper}
        style={{
          width: attrs.width !== 'auto' ? attrs.width : undefined,
        }}
      >
        {/* 核心图片 */}
        {displaySrc && (
          <img
            src={displaySrc}
            alt={attrs.caption || attrs.alt || '图片'}
            className={styles.image}
            style={{
              width: '100%',
              height: attrs.height !== 'auto' ? attrs.height : undefined,
            }}
          />
        )}

        {/* 极简右侧拖拽条 (Resize Bar) */}
        {showHandles && (
          <div
            className={styles.minimalResizeBar}
            onMouseDown={handleResizeMouseDown}
            title="拖动调整宽度"
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
            <button
              type="button"
              className={styles.retryBtn}
              onClick={handleRetryUpload}
              disabled={isRetrying}
            >
              <RefreshCw size={14} className={isRetrying ? styles.spinner : ''} />
              重试上传
            </button>
          </div>
        )}
      </div>

      {/* 图片描述 Caption 编辑框 */}
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
          caption={attrs.caption || ''}
          showCaption={isCaptionVisible}
          getPos={props.getPos}
          nodeSize={node.nodeSize}
          onAlignChange={handleAlignmentChange}
          onCaptionChange={(cap) => updateAttributes({ caption: cap, showCaption: true })}
          onToggleCaption={handleToggleCaption}
          onDelete={deleteNode}
        />
      )}
    </NodeViewWrapper>
  );
};
