import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { CalloutIconPicker, ICON_OPTIONS } from './CalloutIconPicker';
import styles from './Callout.module.css';
import { CALLOUT_THEMES } from '../../utils/defaultTheme';
import { hoverStackManager } from '../../utils/toolbarPriority';

export const CalloutView: React.FC<NodeViewProps> = (props) => {
  const { node, updateAttributes, editor, getPos } = props;
  const { icon } = node.attrs;
  const [pickerOpen, setPickerOpen] = useState(false);

  // 鼠标悬浮移入高亮块容器
  const handleMouseEnter = (_e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        hoverStackManager.register({
          id: `callout-${pos}`,
          type: 'callout',
          depth: 1,
          nodePos: pos,
        });
      }
    }
  };

  // 鼠标悬浮移出高亮块容器：赋予 250ms 防抖缓冲平滑过渡
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (
      relatedTarget &&
      (relatedTarget.closest('[class*="floatingBlockTool"]') ||
        relatedTarget.closest('[class*="unifiedToolbar"]') ||
        relatedTarget.closest('[class*="BubbleMenu"]') ||
        relatedTarget.closest('[class*="popover"]'))
    ) {
      return;
    }
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        hoverStackManager.unregister(`callout-${pos}`, 200);
      }
    }
  };

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
  const iconColor = defaultTheme.iconColor || '#475569';

  const customStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderColor: borderColor,
  };

  return (
    <NodeViewWrapper
      className={styles.calloutWrapper}
      style={customStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {editor.isEditable ? (
        <CalloutIconPicker
          currentIcon={icon || 'Info'}
          iconColor={iconColor}
          isOpen={pickerOpen}
          onToggle={() => setPickerOpen((v) => !v)}
          onSelectIcon={handleSelectIcon}
        />
      ) : (
        <div className={styles.calloutIconArea}>
          <div className={styles.calloutIconBtn} style={{ cursor: 'default' }}>
            <CurrentIcon size={18} color={iconColor} />
          </div>
        </div>
      )}
      <NodeViewContent className={styles.calloutContent} />
    </NodeViewWrapper>
  );
};
