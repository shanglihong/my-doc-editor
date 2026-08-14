import React, { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import { PaintBucket, Square, RotateCcw, Settings2 } from 'lucide-react';
import styles from './CalloutBubbleMenu.module.css';
import { calculateSmartPosition, calculateSubMenuPosition } from '../../utils/floatingPosition';
import { getActiveToolbarInfo, hoverStackManager } from '../../utils/toolbarPriority';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { UnifiedBlockToolbar } from '../UnifiedBlockToolbar';
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
  const [hoverStateListener, setHoverStateListener] = useState(0);
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
    pos: number;
    currentBg?: string;
    currentBorder?: string;
    nodeSize?: number;
  }>({
    visible: false,
    top: 0,
    left: 0,
    pos: -1,
  });

  // 监听 HoverStackManager 的订阅变更
  useEffect(() => {
    const unsubscribe = hoverStackManager.subscribe(() => {
      setHoverStateListener((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleHideAll = () => {
      setActivePicker(null);
      setMenuState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    };
  }, []);

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const activeToolbar = getActiveToolbarInfo(editor);
      const { selection } = editor.state;
      const isTextSelection = selection instanceof TextSelection;
      const isTextSelected = isTextSelection && !selection.empty && selection.from !== selection.to;

      // 严格全局互斥：优先校验 HoverStack 悬停目标类型
      const activeHover = hoverStackManager.getActiveTarget();
      if (activeHover && activeHover.type) {
        if (activeHover.type !== 'callout') {
          setMenuState((prev) => ({ ...prev, visible: false }));
          setActivePicker(null);
          return;
        }
      } else {
        if (activeToolbar.type !== 'callout' || !editor.isActive('callout')) {
          setMenuState((prev) => ({ ...prev, visible: false }));
          setActivePicker(null);
          return;
        }
      }

      if (isDragging || isTypeMenuOpen || isTextSelected) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setActivePicker(null);
        return;
      }

      let calloutNode = null;
      let calloutPos = -1;
      let calloutElement: HTMLElement | null = activeHover?.domElement || null;

      const docSize = editor.state.doc.content.size;

      // 1. 优先使用全局 HoverStack 悬浮到的 Callout 节点信息
      if (activeHover && activeHover.type === 'callout' && typeof activeHover.nodePos === 'number') {
        const targetPos = Math.min(Math.max(0, activeHover.nodePos), docSize);
        const directNode = editor.state.doc.nodeAt(targetPos);
        if (directNode && directNode.type.name === 'callout') {
          calloutNode = directNode;
          calloutPos = targetPos;
        } else {
          const resolved = editor.state.doc.resolve(targetPos);
          for (let d = resolved.depth; d > 0; d--) {
            const n = resolved.node(d);
            if (n.type.name === 'callout') {
              calloutNode = n;
              calloutPos = resolved.before(d);
              break;
            }
          }
        }
      }

      // 2. 若当前无 Hover Callout，回退到选区焦点所在的高亮块
      if (!calloutNode && editor.isActive('callout')) {
        let depth = selection.$anchor.depth;
        while (depth > 0) {
          const node = selection.$anchor.node(depth);
          if (node.type.name === 'callout') {
            calloutNode = node;
            calloutPos = selection.$anchor.before(depth);
            break;
          }
          depth--;
        }
      }

      if (!calloutNode || calloutPos === -1) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setActivePicker(null);
        return;
      }

      const { view } = editor;
      if (!calloutElement) {
        const domNode = view.nodeDOM(calloutPos) as HTMLElement | null;
        calloutElement =
          domNode ||
          (view.domAtPos(Math.min(calloutPos + 1, docSize)).node as HTMLElement)?.closest?.(
            '[data-type="callout"]'
          );
      }

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
        top: Math.max(4, posResult.top),
        left: clampedCenter,
        placement: posResult.placement,
        pos: calloutPos,
        currentBg: calloutNode.attrs.backgroundColor || calloutNode.attrs.customBg || undefined,
        currentBorder: calloutNode.attrs.borderColor || calloutNode.attrs.customBorder || undefined,
        nodeSize: calloutNode.nodeSize,
      });
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);
    updateMenu();

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor, isDragging, isTypeMenuOpen, hoverStateListener]);

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

  const handleDeleteCallout = () => {
    if (!editor || menuState.pos < 0) return;
    const node = editor.state.doc.nodeAt(menuState.pos);
    if (!node) return;

    const tr = editor.state.tr;
    tr.delete(menuState.pos, menuState.pos + node.nodeSize);
    editor.view.dispatch(tr);
    setMenuState((prev) => ({ ...prev, visible: false }));
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
      style={{
        position: 'absolute',
        top: `${menuState.top}px`,
        left: `${menuState.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => {
        hoverStackManager.keepActive();
      }}
      onMouseOver={() => {
        hoverStackManager.keepActive();
      }}
    >
      <UnifiedBlockToolbar
        editor={editor}
        getPos={() => menuState.pos}
        nodeSize={menuState.nodeSize || 1}
        onDeleteBlock={handleDeleteCallout}
        onMouseEnter={() => {
          hoverStackManager.keepActive();
        }}
        onMouseLeave={(e) => {
          const relatedTarget = e.relatedTarget as HTMLElement | null;
          if (relatedTarget && relatedTarget.closest('[data-type="callout"]')) {
            return;
          }
          hoverStackManager.setExclusiveTarget(null, 250);
        }}
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
      </UnifiedBlockToolbar>
    </div>
  );
};
