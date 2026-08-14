import React, { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import { PaintBucket, Square, RotateCcw, Trash2, Settings2 } from 'lucide-react';
import styles from './CalloutBubbleMenu.module.css';
import { calculateSmartPosition, calculateSubMenuPosition } from '../../utils/floatingPosition';
import { getActiveToolbarInfo } from '../../utils/toolbarPriority';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { CALLOUT_THEMES } from '../../utils/defaultTheme';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [activePicker, setActivePicker] = useState<'bg' | 'border' | 'theme' | null>(null);
  const [activePickerStyle, setActivePickerStyle] = useState<React.CSSProperties>({});
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
    pos: number;
    currentBg?: string;
    currentBorder?: string;
  }>({
    visible: false,
    top: 0,
    left: 0,
    pos: -1,
  });

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const activeToolbar = getActiveToolbarInfo(editor);
      const { selection } = editor.state;
      const isTextSelection = selection instanceof TextSelection;
      const isTextSelected = isTextSelection && !selection.empty && selection.from !== selection.to;

      if (
        isDragging ||
        isTypeMenuOpen ||
        isTextSelected ||
        activeToolbar.type !== 'callout' ||
        !editor.isActive('callout')
      ) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setActivePicker(null);
        return;
      }

      let depth = selection.$anchor.depth;
      let calloutNode = null;
      let calloutPos = -1;

      while (depth > 0) {
        const node = selection.$anchor.node(depth);
        if (node.type.name === 'callout') {
          calloutNode = node;
          calloutPos = selection.$anchor.before(depth);
          break;
        }
        depth--;
      }

      if (!calloutNode || calloutPos === -1) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setActivePicker(null);
        return;
      }

      const { view } = editor;
      const domNode = view.nodeDOM(calloutPos) as HTMLElement | null;
      const calloutElement = domNode || (view.domAtPos(selection.$anchor.pos).node as HTMLElement)?.closest?.('[data-type="callout"]');

      if (!calloutElement || !(calloutElement instanceof HTMLElement)) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setActivePicker(null);
        return;
      }

      const container = view.dom.closest('[class*="editorContainer"]') as HTMLElement;
      const containerRect = container
        ? container.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

      const calloutRect = calloutElement.getBoundingClientRect();
      const menuWidth = menuRef.current ? menuRef.current.offsetWidth : 240;
      const menuHeight = 34;

      const posResult = calculateSmartPosition({
        targetRect: calloutRect,
        containerRect,
        menuWidth,
        menuHeight,
        preferredPlacement: 'top',
        offset: 8,
      });

      const calloutCenter = calloutRect.left + calloutRect.width / 2 - containerRect.left;
      const minCenter = menuWidth / 2 + 8;
      const maxCenter = containerRect.width - menuWidth / 2 - 8;
      const clampedCenter = Math.min(Math.max(minCenter, calloutCenter), maxCenter);

      setMenuState({
        visible: true,
        top: posResult.top,
        left: clampedCenter,
        placement: posResult.placement,
        pos: calloutPos,
        currentBg: calloutNode.attrs.backgroundColor || calloutNode.attrs.customBg || undefined,
        currentBorder: calloutNode.attrs.borderColor || calloutNode.attrs.customBorder || undefined,
      });
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor, isDragging, isTypeMenuOpen]);

  if (!editor || !menuState.visible || isDragging || isTypeMenuOpen) {
    return null;
  }

  const handleSetColor = (color: string, category: 'backgroundColor' | 'borderColor') => {
    if (!editor || menuState.pos < 0) return;
    const { state, view } = editor;
    const node = state.doc.nodeAt(menuState.pos);
    if (!node) return;

    const tr = state.tr;
    tr.setNodeMarkup(menuState.pos, null, {
      ...node.attrs,
      [category]: color,
      // 同步更新兼容别名
      ...(category === 'backgroundColor' ? { customBg: color } : { customBorder: color }),
    });
    view.dispatch(tr);
    setActivePicker(null);
  };

  const handleResetColors = () => {
    if (!editor || menuState.pos < 0) return;
    const { state, view } = editor;
    const node = state.doc.nodeAt(menuState.pos);
    if (!node) return;

    const tr = state.tr;
    tr.setNodeMarkup(menuState.pos, null, {
      ...node.attrs,
      backgroundColor: null,
      borderColor: null,
      customBg: null,
      customBorder: null,
    });
    view.dispatch(tr);
    setActivePicker(null);
  };

  const handleSelectTheme = (themeId: string) => {
    if (!editor || menuState.pos < 0) return;
    const theme = CALLOUT_THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    const { state, view } = editor;
    const node = state.doc.nodeAt(menuState.pos);
    if (!node) return;

    const tr = state.tr;
    tr.setNodeMarkup(menuState.pos, null, {
      ...node.attrs,
      themeColor: theme.id,
      backgroundColor: theme.bgColor,
      borderColor: theme.borderColor,
      customBg: theme.bgColor,
      customBorder: theme.borderColor,
    });
    view.dispatch(tr);
    setActivePicker(null);
  };

  const handleTogglePicker = (
    picker: 'bg' | 'border' | 'theme',
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (activePicker === picker) {
      setActivePicker(null);
      return;
    }

    const btnRect = e.currentTarget.getBoundingClientRect();
    const subWidth = picker === 'theme' ? 136 : 168;
    const subHeight = picker === 'theme' ? 120 : 250;

    const res = calculateSubMenuPosition({
      buttonRect: btnRect,
      submenuWidth: subWidth,
      submenuHeight: subHeight,
      offset: 6,
    });

    setActivePickerStyle(res.style);
    setActivePicker(picker);
  };

  return (
    <div
      ref={menuRef}
      className={styles.calloutBubbleMenu}
      style={{
        position: 'absolute',
        top: `${menuState.top}px`,
        left: `${menuState.left}px`,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* 预设主题面板 */}
      <div className={styles.menuGroup}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={`${styles.menuBtn} ${activePicker === 'theme' ? styles.menuBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => handleTogglePicker('theme', e)}
            title="预设主题"
          >
            <Settings2 size={16} />
          </button>

          {activePicker === 'theme' && (
            <div className={styles.popoverContainer} style={activePickerStyle} onMouseDown={(e) => e.preventDefault()}>
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: '8px',
                padding: '6px',
                boxShadow: '0 10px 24px -4px rgba(15, 23, 42, 0.12)',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px',
                width: '124px'
              }}>
                {CALLOUT_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    title={theme.name}
                    style={{
                      height: '22px',
                      borderRadius: '4px',
                      border: `1px solid ${theme.borderColor}`,
                      backgroundColor: theme.bgColor,
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                    onClick={() => handleSelectTheme(theme.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      {/* 边框颜色与背景颜色设置项 */}
      <div className={styles.menuGroup}>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={`${styles.menuBtn} ${activePicker === 'border' ? styles.menuBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => handleTogglePicker('border', e)}
            title="边框颜色"
          >
            <Square size={16} color={menuState.currentBorder || 'currentColor'} />
          </button>

          {activePicker === 'border' && (
            <div className={styles.popoverContainer} style={activePickerStyle} onMouseDown={(e) => e.preventDefault()}>
              <UnifiedColorPicker
                allowedCategories={['borderColor']}
                defaultCategory="borderColor"
                currentColor={menuState.currentBorder}
                onSelectColor={(color) => handleSetColor(color, 'borderColor')}
                onResetColor={handleResetColors}
              />
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={`${styles.menuBtn} ${activePicker === 'bg' ? styles.menuBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => handleTogglePicker('bg', e)}
            title="填充颜色"
          >
            <PaintBucket size={16} color={menuState.currentBg || 'currentColor'} />
          </button>

          {activePicker === 'bg' && (
            <div className={styles.popoverContainer} style={activePickerStyle} onMouseDown={(e) => e.preventDefault()}>
              <UnifiedColorPicker
                allowedCategories={['backgroundColor']}
                defaultCategory="backgroundColor"
                currentColor={menuState.currentBg}
                onSelectColor={(color) => handleSetColor(color, 'backgroundColor')}
                onResetColor={handleResetColors}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleResetColors}
          title="恢复默认颜色"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 删除 Block 按钮 */}
      <div className={styles.menuGroup}>
        <button
          type="button"
          className={`${styles.menuBtn} ${styles.dangerBtn}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().deleteNode('callout').run()}
          title="删除高亮块"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
