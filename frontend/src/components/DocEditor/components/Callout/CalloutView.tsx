import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { CALLOUT_THEMES } from '../../utils/defaultTheme';
import { CalloutToolbar } from './CalloutToolbar';
import styles from '../../DocEditor.module.css';

export const CalloutView: React.FC<NodeViewProps> = ({ node, updateAttributes, editor }) => {
  const { icon, themeColor } = node.attrs;

  const currentThemeObj = CALLOUT_THEMES.find((t) => t.id === themeColor) || CALLOUT_THEMES[0];

  const handleSelectTheme = (themeId: string) => {
    updateAttributes({ themeColor: themeId });
  };

  const handleSelectIcon = (newIcon: string, iconType: 'lucide' | 'emoji') => {
    updateAttributes({ icon: newIcon, iconType });
  };

  return (
    <NodeViewWrapper
      className={styles.calloutWrapper}
      style={{
        backgroundColor: currentThemeObj.bgColor,
        borderColor: currentThemeObj.borderColor,
        color: currentThemeObj.textColor,
      }}
    >
      <div className={styles.calloutHeader}>
        <span className={styles.calloutIcon}>{icon || '💡'}</span>
        {editor.isEditable && (
          <CalloutToolbar
            currentTheme={themeColor}
            currentIcon={icon}
            onSelectTheme={handleSelectTheme}
            onSelectIcon={handleSelectIcon}
          />
        )}
      </div>
      <NodeViewContent className={styles.calloutContent} />
    </NodeViewWrapper>
  );
};
