import React, { useEffect, useState, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  ChevronDown,
} from 'lucide-react';
import styles from './BubbleToolbar.module.css';
import { BlockIcon } from '../../utils/blockIcons';
import { calculateSmartPosition, calculateSubMenuPosition } from '../../utils/floatingPosition';
import { getActiveToolbarInfo } from '../../utils/toolbarPriority';
import { normalizeUrl } from '../../utils/urlUtils';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { LinkInputPanel } from './LinkInputPanel';

export interface TextBlockOption {
  key: string;
  label: string;
  type: string;
  level?: number;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

const TEXT_BLOCK_OPTIONS: TextBlockOption[] = [
  {
    key: 'paragraph',
    label: '正文',
    type: 'paragraph',
    action: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) =>
      editor.isActive('paragraph') &&
      !editor.isActive('bulletList') &&
      !editor.isActive('orderedList') &&
      !editor.isActive('taskList'),
  },
  {
    key: 'heading-1',
    label: '一级标题',
    type: 'heading',
    level: 1,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    key: 'heading-2',
    label: '二级标题',
    type: 'heading',
    level: 2,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    key: 'heading-3',
    label: '三级标题',
    type: 'heading',
    level: 3,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    key: 'bulletList',
    label: '无序列表',
    type: 'bulletList',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    key: 'orderedList',
    label: '有序列表',
    type: 'orderedList',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    key: 'taskList',
    label: '待办列表',
    type: 'taskList',
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskList'),
  },
];

export interface TextAlignOption {
  key: string;
  label: string;
  value: 'left' | 'center' | 'right';
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; className?: string }>;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

const TEXT_ALIGN_OPTIONS: TextAlignOption[] = [
  {
    key: 'left',
    label: '靠左对齐',
    value: 'left',
    icon: AlignLeft,
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })),
  },
  {
    key: 'center',
    label: '居中对齐',
    value: 'center',
    icon: AlignCenter,
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
  },
  {
    key: 'right',
    label: '靠右对齐',
    value: 'right',
    icon: AlignRight,
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
  },
];


export interface BubbleToolbarProps {
  editor: Editor | null;
  isDragging?: boolean;
  isTypeMenuOpen?: boolean;
}

export const BubbleToolbar: React.FC<BubbleToolbarProps> = ({ editor, isDragging, isTypeMenuOpen }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showBlockTypePicker, setShowBlockTypePicker] = useState(false);
  const [showAlignPicker, setShowAlignPicker] = useState(false);
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

  const getCurrentBlockType = (ed: Editor): TextBlockOption => {
    const activeOpt = TEXT_BLOCK_OPTIONS.find((opt) => opt.isActive(ed));
    return activeOpt || TEXT_BLOCK_OPTIONS[0];
  };

  const getCurrentTextAlign = (ed: Editor): TextAlignOption => {
    const activeOpt = TEXT_ALIGN_OPTIONS.find((opt) => opt.isActive(ed));
    return activeOpt || TEXT_ALIGN_OPTIONS[0];
  };

  const handleToggleDropdown = (
    type: 'blockType' | 'textAlign' | 'color' | 'highlight' | 'link',
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const btnRect = e.currentTarget.getBoundingClientRect();
    let subWidth = 168;
    let subHeight = 250;
    if (type === 'blockType') {
      subWidth = 136;
      subHeight = 240;
    } else if (type === 'textAlign') {
      subWidth = 120;
      subHeight = 120;
    } else if (type === 'link') {
      subWidth = 320;
      subHeight = 44;
    }

    const res = calculateSubMenuPosition({
      buttonRect: btnRect,
      submenuWidth: subWidth,
      submenuHeight: subHeight,
      parentPlacement: position.placement,
      offset: 6,
    });

    setPickerStyle(res.style);

    window.dispatchEvent(
      new CustomEvent('CLOSE_OTHER_SUBMENUS', { detail: { source: 'BubbleToolbar' } })
    );

    if (type === 'blockType') {
      setShowBlockTypePicker(!showBlockTypePicker);
      setShowAlignPicker(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'textAlign') {
      setShowAlignPicker(!showAlignPicker);
      setShowBlockTypePicker(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'color') {
      setShowColorPicker(!showColorPicker);
      setShowBlockTypePicker(false);
      setShowAlignPicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'highlight') {
      setShowHighlightPicker(!showHighlightPicker);
      setShowBlockTypePicker(false);
      setShowAlignPicker(false);
      setShowColorPicker(false);
      setShowLinkPanel(false);
    } else if (type === 'link') {
      setShowLinkPanel(!showLinkPanel);
      setShowBlockTypePicker(false);
      setShowAlignPicker(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
    }
  };

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      if (isDragging || isTypeMenuOpen) {
        setPosition((prev) => ({ ...prev, visible: false }));
        setShowBlockTypePicker(false);
        setShowAlignPicker(false);
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
        setShowBlockTypePicker(false);
        setShowAlignPicker(false);
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
      setShowBlockTypePicker(false);
      setShowAlignPicker(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowLinkPanel(false);
    };

    const handleCloseOthers = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.source !== 'BubbleToolbar') {
        setShowBlockTypePicker(false);
        setShowAlignPicker(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLinkPanel(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowBlockTypePicker(false);
        setShowAlignPicker(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowLinkPanel(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        const { selection } = editor.state;
        if (!selection.empty && selection instanceof TextSelection) {
          e.preventDefault();
          setShowLinkPanel(true);
          setShowBlockTypePicker(false);
          setShowAlignPicker(false);
          setShowColorPicker(false);
          setShowHighlightPicker(false);
        }
      }
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    window.addEventListener('CLOSE_OTHER_SUBMENUS', handleCloseOthers);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('transaction', updatePosition);
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
      window.removeEventListener('CLOSE_OTHER_SUBMENUS', handleCloseOthers);
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
      onMouseDown={(e) => {
        window.dispatchEvent(new CustomEvent('HIDE_DRAG_HANDLE'));
        e.preventDefault();
      }}
    >
      {/* 文本块类型选择 */}
      <div style={{ position: 'relative' }}>
        <button
          className={`${styles.blockTypeBtn} ${showBlockTypePicker ? styles.toolbarBtnActive : ''}`}
          onClick={(e) => handleToggleDropdown('blockType', e)}
          title={`文本块类型: ${getCurrentBlockType(editor).label}`}
        >
          <BlockIcon
            type={getCurrentBlockType(editor).type}
            level={getCurrentBlockType(editor).level}
            size={15}
          />
          <ChevronDown size={12} style={{ opacity: 0.7 }} />
        </button>
        {showBlockTypePicker && (
          <div
            className={styles.blockTypeDropdown}
            style={pickerStyle}
          >
            {TEXT_BLOCK_OPTIONS.map((opt) => {
              const isActive = opt.isActive(editor);
              return (
                <button
                  key={opt.key}
                  className={`${styles.blockTypeOption} ${isActive ? styles.blockTypeOptionActive : ''}`}
                  onClick={() => {
                    opt.action(editor);
                    setShowBlockTypePicker(false);
                  }}
                >
                  <BlockIcon
                    type={opt.type}
                    level={opt.level}
                    size={14}
                    color={isActive ? '#2563eb' : undefined}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.toolbarDivider} />

      {/* 对齐方式选择 (第二个位置) */}
      <div style={{ position: 'relative' }}>
        <button
          className={`${styles.alignBtn} ${showAlignPicker ? styles.toolbarBtnActive : ''}`}
          onClick={(e) => handleToggleDropdown('textAlign', e)}
          title={`对齐方式: ${getCurrentTextAlign(editor).label}`}
        >
          {React.createElement(getCurrentTextAlign(editor).icon, { size: 16 })}
          <ChevronDown size={12} style={{ opacity: 0.65 }} />
        </button>
        {showAlignPicker && (
          <div
            className={styles.alignDropdown}
            style={pickerStyle}
          >
            {TEXT_ALIGN_OPTIONS.map((opt) => {
              const isActive = opt.isActive(editor);
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.key}
                  className={`${styles.alignOption} ${isActive ? styles.alignOptionActive : ''}`}
                  onClick={() => {
                    opt.action(editor);
                    setShowAlignPicker(false);
                  }}
                >
                  <IconComp size={14} strokeWidth={1.6} color={isActive ? '#2563eb' : undefined} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.toolbarDivider} />

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
    </div>
  );
};
