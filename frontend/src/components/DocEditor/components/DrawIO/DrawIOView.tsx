import React, { useState, useRef } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Edit3, Workflow } from 'lucide-react';
import { getActiveToolbarInfo, hoverStackManager } from '../../utils/toolbarPriority';
import { FloatingBlockTool } from '../FloatingBlockTool';

export const DrawIOView: React.FC<NodeViewProps> = (props) => {
  const { node, deleteNode, editor, getPos, selected } = props;
  const { xml, svg } = node.attrs;
  const isEditable = editor.isEditable;
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearHideTimeout();
    setIsHovered(true);
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        hoverStackManager.register({
          id: `drawio-${pos}`,
          type: 'drawio',
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
      (relatedTarget.closest('[class*="floatingBlockTool"]') ||
        relatedTarget.closest('[class*="unifiedToolbar"]') ||
        relatedTarget.closest('[class*="popover"]'))
    ) {
      return;
    }
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        hoverStackManager.unregister(`drawio-${pos}`, 200);
      }
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const handleOpenEditor = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isEditable) return;

    let pos: number | null = null;
    try {
      if (typeof getPos === 'function') {
        const currentPos = getPos();
        if (typeof currentPos === 'number') {
          pos = currentPos;
        }
      }
    } catch (_err) {
      // 忽略位置获取错误
    }

    try {
      window.dispatchEvent(
        new CustomEvent('OPEN_DRAWIO_MODAL', {
          detail: {
            xml: xml || '',
            nodePos: pos,
          },
        })
      );
    } catch (_err) {
      // 捕获异常
    }
  };

  const handleStopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const isDataUrl =
    typeof svg === 'string' &&
    (svg.startsWith('data:') || svg.startsWith('http://') || svg.startsWith('https://'));

  const activeToolbar = getActiveToolbarInfo(editor);
  const showFloatingToolbar = isEditable && (isHovered || selected) && (activeToolbar.type === 'drawio' || selected);

  return (
    <NodeViewWrapper
      data-type="drawio"
      className="drawio-node-wrapper"
      style={{
        margin: '24px 0 16px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showFloatingToolbar && (
        <FloatingBlockTool
          editor={editor}
          blockType="drawio"
          getPos={getPos}
          isLocalPositioning={true}
          onDeleteBlock={deleteNode}
        />
      )}

      {svg ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            overflow: 'auto',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            cursor: isEditable ? 'pointer' : 'default',
          }}
          onDoubleClick={handleOpenEditor}
        >
          {isDataUrl ? (
            <img
              src={svg}
              alt="draw.io 图表预览"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: svg }}
              style={{ maxWidth: '100%', height: 'auto', display: 'flex', justifyContent: 'center' }}
            />
          )}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: '180px',
            borderRadius: '8px',
            border: '2px dashed #d1d5db',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#6b7280',
            cursor: isEditable ? 'pointer' : 'default',
          }}
          onDoubleClick={handleOpenEditor}
          onClick={handleOpenEditor}
          onMouseDown={handleStopPropagation}
        >
          <Workflow size={32} style={{ color: '#3b82f6' }} />
          <div style={{ fontSize: '14px', fontWeight: 500 }}>draw.io 架构流程图块 (双击即可编辑)</div>
          {isEditable && (
            <button
              type="button"
              onMouseDown={handleStopPropagation}
              onClick={handleOpenEditor}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s',
              }}
            >
              <Edit3 size={14} /> 开始绘制图表
            </button>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
};
