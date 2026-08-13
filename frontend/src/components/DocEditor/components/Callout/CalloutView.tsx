import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { CalloutIconPicker } from './CalloutIconPicker';
import styles from '../../DocEditor.module.css';

export const CalloutView: React.FC<NodeViewProps> = ({ node, updateAttributes, editor }) => {
  const { icon } = node.attrs;

  const handleSelectIcon = (newIcon: string, iconType: 'lucide' | 'emoji') => {
    updateAttributes({ icon: newIcon, iconType });
  };

  return (
    <NodeViewWrapper className={styles.calloutWrapper}>
      <div className={styles.calloutHeader}>
        {editor.isEditable ? (
          <CalloutIconPicker currentIcon={icon} onSelectIcon={handleSelectIcon} />
        ) : (
          <span className={styles.calloutIcon}>{icon || '💡'}</span>
        )}
      </div>
      <NodeViewContent className={styles.calloutContent} />
    </NodeViewWrapper>
  );
};
