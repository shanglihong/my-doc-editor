import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import styles from '../../DocEditor.module.css';

export const ExcalidrawView: React.FC<NodeViewProps> = ({ node, updateAttributes, editor }) => {
  const { elements = [], appState = {}, caption = '' } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);

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
            {isEditing ? '完成编辑' : '编辑画图'}
          </button>
        )}
      </div>

      <div className={styles.excalidrawContainer} style={{ height: isEditing ? '450px' : '300px' }}>
        <Excalidraw
          initialData={{
            elements: Array.isArray(elements) ? elements : [],
            appState: { ...appState, zenModeEnabled: !isEditing },
          }}
          onChange={(elems, state) => {
            if (isEditing) {
              updateAttributes({
                elements: elems,
                appState: {
                  viewBackgroundColor: state.viewBackgroundColor,
                },
              });
            }
          }}
          viewModeEnabled={!isEditing || !editor.isEditable}
        />
      </div>

      {caption && <div className={styles.excalidrawCaption}>{caption}</div>}
    </NodeViewWrapper>
  );
};
