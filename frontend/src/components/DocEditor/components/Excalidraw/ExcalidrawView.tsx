import React, { useEffect, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import styles from '../../DocEditor.module.css';

export const ExcalidrawView: React.FC<NodeViewProps> = ({ node, updateAttributes, editor }) => {
  const { elements = [], appState = {}, caption = '' } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  // 当完成编辑或初始化预览时，自动按比例放缩自适应居中 (zoomToFit) 展示画图内容
  useEffect(() => {
    if (!isEditing && excalidrawAPI && Array.isArray(elements) && elements.length > 0) {
      try {
        excalidrawAPI.scrollToContent(elements, {
          fitToViewport: true,
          viewportZoomFactor: 0.85,
          animate: true,
        });
      } catch (_e) {
        // fallback ignore
      }
    }
  }, [isEditing, excalidrawAPI, elements]);

  return (
    <NodeViewWrapper className={styles.excalidrawWrapper}>
      <div className={styles.excalidrawHeader}>
        <span className={styles.excalidrawTitle}>Excalidraw 画图块</span>
        {editor.isEditable && (
          <button
            type="button"
            className={styles.excalidrawToggleBtn}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '完成编辑 (保存退出)' : '编辑画图 (全屏绘制)'}
          </button>
        )}
      </div>

      {isEditing ? (
        /* 全屏 Modal 铺满编辑模式 (Full-Screen Modal Edit Mode) */
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '16px' }}>Excalidraw 全屏画图编辑器</div>
            <button
              type="button"
              style={{
                padding: '8px 20px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={() => setIsEditing(false)}
            >
              完成编辑
            </button>
          </div>
          <div style={{ flex: 1, position: 'relative', width: '100%', height: 'calc(100vh - 60px)' }}>
            <Excalidraw
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
              initialData={{
                elements: Array.isArray(elements) ? elements : [],
                appState: { ...appState, zenModeEnabled: false },
              }}
              onChange={(elems, state) => {
                updateAttributes({
                  elements: elems,
                  appState: {
                    viewBackgroundColor: state.viewBackgroundColor,
                  },
                });
              }}
              viewModeEnabled={false}
            />
          </div>
        </div>
      ) : (
        /* 文档内按比例自适应缩放预览模式 (Scaled Inline Preview Mode) */
        <div
          className={`${styles.excalidrawContainer} ${styles.excalidrawPreview}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            overflow: 'hidden',
          }}
        >
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={{
              elements: Array.isArray(elements) ? elements : [],
              appState: { ...appState, zenModeEnabled: true },
            }}
            viewModeEnabled={true}
          />
        </div>
      )}

      {caption && <div className={styles.excalidrawCaption}>{caption}</div>}
    </NodeViewWrapper>
  );
};
