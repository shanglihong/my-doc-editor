import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import styles from '../../DocEditor.module.css';
import { FONT_SIZES, COLOR_PALETTE, HIGHLIGHT_PALETTE } from '../../utils/defaultTheme';

export interface BubbleToolbarProps {
  editor: Editor | null;
  isDragging?: boolean;
}

export const BubbleToolbar: React.FC<BubbleToolbarProps> = ({ editor, isDragging }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; visible: boolean }>({
    top: 0,
    left: 0,
    visible: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      if (isDragging) {
        setPosition((prev) => ({ ...prev, visible: false }));
        setShowFontSizePicker(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        return;
      }

      const { selection } = editor.state;
      // 严格限定：必须是 TextSelection（文本选区）且选中了非空文本，排除 NodeSelection（节点选区）
      const isTextSelection = selection instanceof TextSelection;
      if (selection.empty || selection.from === selection.to || !isTextSelection) {
        setPosition((prev) => ({ ...prev, visible: false }));
        setShowFontSizePicker(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        return;
      }

      const { view } = editor;
      const { from, to } = selection;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const editorDom = view.dom.getBoundingClientRect();
      const left = (start.left + end.left) / 2 - editorDom.left;
      const top = start.top - editorDom.top - 45;

      setPosition({
        top: Math.max(0, top),
        left: Math.max(10, left - 100),
        visible: true,
      });
    };

    editor.on('selectionUpdate', updatePosition);
    editor.on('transaction', updatePosition);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('transaction', updatePosition);
    };
  }, [editor, isDragging]);

  if (!editor || !position.visible || isDragging) {
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
          onClick={() => {
            setShowFontSizePicker(!showFontSizePicker);
            setShowColorPicker(false);
            setShowHighlightPicker(false);
          }}
          title="字号大小"
        >
          <Type size={16} />
        </button>
        {showFontSizePicker && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              width: '100px',
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
        title="加粗 (Bold)"
      >
        <Bold size={16} />
      </button>

      {/* 斜体 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="斜体 (Italic)"
      >
        <Italic size={16} />
      </button>

      {/* 下划线 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('underline') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="下划线 (Underline)"
      >
        <Underline size={16} />
      </button>

      {/* 删除线 */}
      <button
        className={`${styles.toolbarBtn} ${editor.isActive('strike') ? styles.toolbarBtnActive : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="删除线 (Strike)"
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

      {/* 文字颜色 */}
      <div style={{ position: 'relative' }}>
        <button
          className={styles.toolbarBtn}
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowFontSizePicker(false);
            setShowHighlightPicker(false);
          }}
          title="文字前景色"
        >
          <Palette size={16} />
        </button>
        {showColorPicker && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              width: '120px',
            }}
          >
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.value}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: c.value === 'inherit' ? '#000' : c.value,
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
                title={c.label}
                onClick={() => {
                  if (c.value === 'inherit') {
                    editor.chain().focus().unsetColor().run();
                  } else {
                    editor.chain().focus().setColor(c.value).run();
                  }
                  setShowColorPicker(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 背景高亮 */}
      <div style={{ position: 'relative' }}>
        <button
          className={styles.toolbarBtn}
          onClick={() => {
            setShowHighlightPicker(!showHighlightPicker);
            setShowFontSizePicker(false);
            setShowColorPicker(false);
          }}
          title="背景高亮色"
        >
          <Highlighter size={16} />
        </button>
        {showHighlightPicker && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              width: '120px',
            }}
          >
            {HIGHLIGHT_PALETTE.map((h) => (
              <button
                key={h.value}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: h.value === 'transparent' ? '#fff' : h.value,
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
                title={h.label}
                onClick={() => {
                  if (h.value === 'transparent') {
                    editor.chain().focus().unsetHighlight().run();
                  } else {
                    editor.chain().focus().setHighlight({ color: h.value }).run();
                  }
                  setShowHighlightPicker(false);
                }}
              />
            ))}
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
