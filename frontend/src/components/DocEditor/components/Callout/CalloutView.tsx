import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { CalloutIconPicker, ICON_OPTIONS } from './CalloutIconPicker';
import styles from '../../DocEditor.module.css';
import { CALLOUT_THEMES } from '../../utils/defaultTheme';

export const CalloutView: React.FC<NodeViewProps> = ({ node, updateAttributes, editor }) => {
  const { icon } = node.attrs;
  const [pickerOpen, setPickerOpen] = useState(false);

  // icon 字段存储图标名称（如 'Lightbulb'）
  const handleSelectIcon = (name: string) => {
    updateAttributes({ icon: name, iconType: 'lucide' });
    setPickerOpen(false);
  };

  // 只读模式：展示图标
  const currentConfig = ICON_OPTIONS.find((c) => c.name === icon) || ICON_OPTIONS[1];
  const CurrentIcon = currentConfig.icon;

  const defaultTheme = CALLOUT_THEMES.find((t) => t.id === node.attrs.themeColor) || CALLOUT_THEMES[0];
  const bgColor = node.attrs.backgroundColor || node.attrs.customBg || defaultTheme.bgColor;
  const borderColor = node.attrs.borderColor || node.attrs.customBorder || defaultTheme.borderColor;

  const customStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderColor: borderColor,
  };

  return (
    <NodeViewWrapper className={styles.calloutWrapper} style={customStyle}>
      {editor.isEditable ? (
        <CalloutIconPicker
          currentIcon={icon || 'Info'}
          isOpen={pickerOpen}
          onToggle={() => setPickerOpen((v) => !v)}
          onSelectIcon={handleSelectIcon}
        />
      ) : (
        <div className={styles.calloutIconArea}>
          <div className={styles.calloutIconBtn} style={{ cursor: 'default' }}>
            <CurrentIcon size={18} color={currentConfig.color} />
          </div>
        </div>
      )}
      <NodeViewContent className={styles.calloutContent} />
    </NodeViewWrapper>
  );
};
