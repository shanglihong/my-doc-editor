import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { ChevronDown, Palette } from 'lucide-react';
import styles from './CalloutBubbleMenu.module.css';
import { calculateSubMenuPosition } from '../../utils/floatingPosition';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { FloatingBlockTool } from '../FloatingBlockTool';

export interface CalloutBubbleMenuProps {
  editor: Editor | null;
  isDragging?: boolean;
  isTypeMenuOpen?: boolean;
}

export const CalloutBubbleMenu: React.FC<CalloutBubbleMenuProps> = ({
  editor,
  isDragging,
  isTypeMenuOpen,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const [currentBg, setCurrentBg] = useState<string | undefined>();
  const [currentBorder, setCurrentBorder] = useState<string | undefined>();
  const [activePos, setActivePos] = useState<number>(-1);
  const prevPosRef = React.useRef(activePos);

  // 监听全局隐藏事件或选区/位置变动时自动重置收缩颜色选择菜单
  React.useEffect(() => {
    const handleResetPicker = () => {
      setShowColorPicker(false);
    };

    const handleCloseOthers = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.source !== 'CalloutBubbleMenu') {
        setShowColorPicker(false);
      }
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleResetPicker);
    window.addEventListener('CLOSE_OTHER_SUBMENUS', handleCloseOthers);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleResetPicker);
      window.removeEventListener('CLOSE_OTHER_SUBMENUS', handleCloseOthers);
    };
  }, []);

  // 仅在真实跨 Block 改变节点位置时收起 ColorPicker，避免首次初始化 activePos 时引发误关闪退
  React.useEffect(() => {
    if (prevPosRef.current !== -1 && prevPosRef.current !== activePos) {
      setShowColorPicker(false);
    }
    prevPosRef.current = activePos;
  }, [activePos]);

  // 当选区改变时自动同步最新的节点属性
  React.useEffect(() => {
    updateCurrentAttrs();
  }, [editor?.state.selection]);

  // 从当前 TipTap Selection 获取颜色属性
  const updateCurrentAttrs = () => {
    if (!editor) return;
    const { selection } = editor.state;
    let calloutNode = null;
    let pos = -1;
    let depth = selection.$anchor.depth;
    while (depth > 0) {
      const node = selection.$anchor.node(depth);
      if (node.type.name === 'callout') {
        calloutNode = node;
        pos = selection.$anchor.before(depth);
        break;
      }
      depth--;
    }
    if (calloutNode) {
      setCurrentBg(calloutNode.attrs.backgroundColor || calloutNode.attrs.customBg || '#dbeafe');
      setCurrentBorder(calloutNode.attrs.borderColor || calloutNode.attrs.customBorder || '#93c5fd');
      setActivePos(pos);
    }
  };

  const handleSetColor = (color: string, category: 'backgroundColor' | 'borderColor') => {
    if (!editor || activePos < 0) return;
    const { state, view } = editor;
    const node = state.doc.nodeAt(activePos);
    if (!node) return;

    const tr = state.tr;
    tr.setNodeMarkup(activePos, null, {
      ...node.attrs,
      [category]: color,
      ...(category === 'backgroundColor'
        ? { customBg: color }
        : { customBorder: color }),
    });
    view.dispatch(tr);
    setShowColorPicker(false);
    updateCurrentAttrs();
  };

  const handleResetColors = () => {
    if (!editor || activePos < 0) return;
    const { state, view } = editor;
    const node = state.doc.nodeAt(activePos);
    if (!node) return;

    const tr = state.tr;
    tr.setNodeMarkup(activePos, null, {
      ...node.attrs,
      backgroundColor: null,
      borderColor: null,
      customBg: null,
      customBorder: null,
    });
    view.dispatch(tr);
    setShowColorPicker(false);
    updateCurrentAttrs();
  };

  const handleDeleteCallout = () => {
    if (!editor || activePos < 0) return;
    const node = editor.state.doc.nodeAt(activePos);
    if (!node) return;

    const tr = editor.state.tr;
    tr.delete(activePos, activePos + node.nodeSize);
    editor.view.dispatch(tr);
  };

  const handleToggleColorPicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    updateCurrentAttrs();
    if (showColorPicker) {
      setShowColorPicker(false);
      return;
    }

    window.dispatchEvent(
      new CustomEvent('CLOSE_OTHER_SUBMENUS', { detail: { source: 'CalloutBubbleMenu' } })
    );

    const btnRect = e.currentTarget.getBoundingClientRect();
    const subWidth = 228;
    const subHeight = 260;

    const res = calculateSubMenuPosition({
      buttonRect: btnRect,
      submenuWidth: subWidth,
      submenuHeight: subHeight,
      offset: 6,
    });

    setPickerStyle(res.style);
    setShowColorPicker(true);
  };

  return (
    <FloatingBlockTool
      editor={editor}
      blockType="callout"
      isDragging={isDragging}
      isTypeMenuOpen={isTypeMenuOpen}
      onDeleteBlock={handleDeleteCallout}
    >
      {/* 参考 BubbleTool 调色板代替原有的 4 个图标按钮 */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className={`${styles.colorCombineBtn} ${showColorPicker ? styles.menuBtnActive : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => handleToggleColorPicker(e)}
          title="高亮块填充与边框颜色"
        >
          <Palette size={15} />
          <ChevronDown size={12} style={{ opacity: 0.65 }} />
        </button>

        {showColorPicker && (
          <div className={styles.popoverContainer} style={pickerStyle} onMouseDown={(e) => e.preventDefault()}>
            <UnifiedColorPicker
              allowedCategories={['borderColor', 'backgroundColor']}
              currentBorderColor={currentBorder}
              currentBgColor={currentBg}
              bgSingleRowOnly={true}
              onSelectColor={(color, category) => {
                if (category === 'borderColor') {
                  handleSetColor(color, 'borderColor');
                } else if (category === 'backgroundColor') {
                  handleSetColor(color, 'backgroundColor');
                }
              }}
              onResetColor={handleResetColors}
            />
          </div>
        )}
      </div>
    </FloatingBlockTool>
  );
};
