import React, { useEffect, useState, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Type,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
} from 'lucide-react';
import styles from '../../DocEditor.module.css';
import { FONT_SIZES } from '../../utils/defaultTheme';
import { calculateSmartPosition, calculateSubMenuPosition } from '../../utils/floatingPosition';
import { getActiveToolbarInfo } from '../../utils/toolbarPriority';
import { normalizeUrl } from '../../utils/urlUtils';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { LinkInputPanel } from './LinkInputPanel';

export interface BubbleToolbarProps {
  editor: Editor | null;
  isDragging?: boolean;
  isTypeMenuOpen?: boolean;
}

export const BubbleToolbar: React.FC<BubbleToolbarProps> = ({ editor, isDragging, isTypeMenuOpen }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const showLinkPanelRef = useRef(showLinkPanel);
  useEffect(() => {
    showLinkPanelRef.current = showLinkPanel;
  }, [showLinkPanel]);

  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    placement: 'top' | 'bottom';
    visible: boolean;
  }>({
    top: 0,
    left: 0,
    placement: 'top',
    visible: false,
  });

  const handleToggleDropdown = (
    type: 'fontSize' | 'color' | 'highlight' | 'link',
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const btnRect = e.currentTarget.getBoundingClientRect();
    let subWidth = 168;
    let subHeight = 250;
    if (type === 'fontSize') {
      subWidth = 100;
      subHeight = 160;
    } else if (type === 'link') {
      subWidth = 320;
      subHeight = 44;
    }

    const res = calculateSubMenuPosition({
      buttonRect: btnRect,
      submenuWidth: subWidth,
      submenuHeight: subHeight,
      offset: 4,
    });

    setPickerStyle(res.style);

    if (type === 'fontSize') {
      setShowFontSizePicker(!showFontSizePicker);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'color') {
      setShowColorPicker(!showColorPicker);
      setShowFontSizePicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'highlight') {
      setShowHighlightPicker(!showHighlightPicker);
      setShowFontSizePicker(false);
      setShowColorPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'link') {
      setShowLinkPanel(!showLinkPanel);
      setShowFontSizePicker(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
    }
  };

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      if (isDragging || isTypeMenuOpen) {
        setPosition((prev) => ({ ...prev, visible: false }));
        setShowFontSizePicker(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLinkPanel(false);
        return;
      }

      if (showLinkPanelRef.current) {
        return;
      }

      const activeToolbar = getActiveToolbarInfo(editor);
      const { selection } = editor.state;
      const isTextSelection = selection instanceof TextSelection;
      const isInCodeBlock = editor.isActive('codeBlock');
      if (
        activeToolbar.type !== 'text' ||
        selection.empty ||
        selection.from === selection.to ||
        !isTextSelection ||
        isInCodeBlock
      ) {
        setPosition((prev) => ({ ...prev, visible: false }));
        setShowFontSizePicker(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLinkPanel(false);
        return;
      }

      const { view } = editor;
      const { from, to } = selection;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const container = view.dom.closest('[class*="editorContainer"]') as HTMLElement;
      const containerRect = container
        ? container.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

      const targetRect = new DOMRect(
        Math.min(start.left, end.left),
        Math.min(start.top, end.top),
        Math.max(1, Math.abs(end.left - start.left)),
        Math.max(20, Math.abs(end.bottom - start.top))
      );

      const toolbarWidth = 380;
      const toolbarHeight = 40;

      const posResult = calculateSmartPosition({
        targetRect,
        containerRect,
        menuWidth: toolbarWidth,
        menuHeight: toolbarHeight,
        preferredPlacement: 'top',
        offset: 8,
      });

      setPosition({
        top: posResult.top,
        left: posResult.left,
        placement: posResult.placement,
        visible: true,
      });
    };

    editor.on('selectionUpdate', updatePosition);
    editor.on('transaction', updatePosition);

    const handleHideAll = () => {
      setPosition((prev) => ({ ...prev, visible: false }));
      setShowFontSizePicker(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const { selection } = editor.state;
        if (!selection.empty && selection instanceof TextSelection) {
          e.preventDefault();
          setShowLinkPanel(true);
          setShowFontSizePicker(false);
          setShowColorPicker(false);
          setShowHighlightPicker(false);
        }
      }
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('transaction', updatePosition);
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, isDragging]);

  const handleConfirmLink = (urlInput: string) => {
    if (!editor) return;
    const normalized = normalizeUrl(urlInput);
    if (normalized) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: normalized, target: '_blank' }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setShowLinkPanel(false);
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowLinkPanel(false);
  };

  if (!editor || !position.visible || isDragging || isTypeMenuOpen) {
    return null;
  }


  return (
    <div
      className={styles.bubbleToolbar}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* 字号选择 */}
      <div style={{ position: 'relative' }}>
        <button
          className={styles.toolbarBtn}
          onClick={(e) => handleToggleDropdown('fontSize', e)}
          title="字号大小"
        >
          <Type size={16} />
        </button>
        {showFontSizePicker && (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              width: '100px',
              ...pickerStyle,
            }}
          >
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.value}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 8px',
                  textAlign: 'left',
                  fontSize: '12px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={() => {
                  (editor.chain().focus() as any).setFontSize(fs.value).run();
                  setShowFontSizePicker(false);
                }}
              >
                {fs.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 加粗 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="加粗"
      >
        <Bold size={16} />
      </button>

      {/* 斜体 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="斜体"
      >
        <Italic size={16} />
      </button>

      {/* 下划线 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('underline') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="下划线"
      >
        <Underline size={16} />
      </button>

      {/* 删除线 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('strike') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="删除线"
      >
        <Strikethrough size={16} />
      </button>

      {/* 行内代码 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('code') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="行内代码"
      >
        <Code size={16} />
      </button>

      {/* 超链接 */}
      <div style={{ position: 'relative' }}>
        <button
          className={`${styles.toolbarBtn} ${editor.isActive('link') || showLinkPanel ? styles.toolbarBtnActive : ''}`}
          onClick={(e) => handleToggleDropdown('link', e)}
          title="超链接 (Cmd+K)"
        >
          <Link size={16} />
        </button>
        {showLinkPanel && (
          <LinkInputPanel
            initialUrl={editor.getAttributes('link').href || ''}
            hasLink={editor.isActive('link')}
            style={pickerStyle}
            onConfirm={handleConfirmLink}
            onUnlink={handleUnlink}
            onClose={() => setShowLinkPanel(false)}
          />
        )}
      </div>

      {/* 文字颜色 */}
      <div style={{ position: 'relative' }}>
        <button
          className={`${styles.toolbarBtn} ${showColorPicker ? styles.toolbarBtnActive : ''}`}
          onClick={(e) => handleToggleDropdown('color', e)}
          title="文字前景色"
        >
          <Palette size={16} />
        </button>
        {showColorPicker && (
          <div style={pickerStyle}>
            <UnifiedColorPicker
              allowedCategories={['textColor']}
              defaultCategory="textColor"
              onSelectColor={(color) => {
                editor.chain().focus().setColor(color).run();
                setShowColorPicker(false);
              }}
              onResetColor={() => {
                editor.chain().focus().unsetColor().run();
                setShowColorPicker(false);
              }}
            />
          </div>
        )}
      </div>

      {/* 背景高亮 */}
      <div style={{ position: 'relative' }}>
        <button
          className={`${styles.toolbarBtn} ${showHighlightPicker ? styles.toolbarBtnActive : ''}`}
          onClick={(e) => handleToggleDropdown('highlight', e)}
          title="背景高亮色"
        >
          <Highlighter size={16} />
        </button>
        {showHighlightPicker && (
          <div style={pickerStyle}>
            <UnifiedColorPicker
              allowedCategories={['backgroundColor']}
              defaultCategory="backgroundColor"
              onSelectColor={(color) => {
                editor.chain().focus().setHighlight({ color }).run();
                setShowHighlightPicker(false);
              }}
              onResetColor={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
            />
          </div>
        )}
      </div>

      {/* 靠左对齐 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'left' }) ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="靠左对齐"
      >
        <AlignLeft size={16} />
      </button>

      {/* 居中对齐 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'center' }) ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="居中对齐"
      >
        <AlignCenter size={16} />
      </button>

      {/* 靠右对齐 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive({ textAlign: 'right' }) ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="靠右对齐"
      >
        <AlignRight size={16} />
      </button>
    </div>
  );
};
