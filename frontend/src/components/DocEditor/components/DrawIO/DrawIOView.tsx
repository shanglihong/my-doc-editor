import React from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Edit3, Trash2, Workflow } from 'lucide-react';

export const DrawIOView: React.FC<NodeViewProps> = ({
  node,
  deleteNode,
  editor,
  getPos,
}) => {
  const { xml, svg } = node.attrs;
  const isEditable = editor.isEditable;

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

  const isDataUrl = typeof svg === 'string' && (svg.startsWith('data:') || svg.startsWith('http://') || svg.startsWith('https://'));

  return (
    <NodeViewWrapper
      className="drawio-node-wrapper"
      style={{
        margin: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
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

          {isEditable && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(4px)',
              }}
              onMouseDown={handleStopPropagation}
            >
              <button
                type="button"
                onMouseDown={handleStopPropagation}
                onClick={handleOpenEditor}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#3b82f6',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <Edit3 size={14} /> 编辑
              </button>
              <button
                type="button"
                onMouseDown={handleStopPropagation}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteNode();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <Trash2 size={14} /> 删除
              </button>
            </div>
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
          onClick={handleOpenEditor}
          onMouseDown={handleStopPropagation}
        >
          <Workflow size={32} style={{ color: '#3b82f6' }} />
          <div style={{ fontSize: '14px', fontWeight: 500 }}>draw.io 架构流程图块</div>
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
