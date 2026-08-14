import React, { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Copy, ClipboardPaste, Trash2 } from 'lucide-react';
import styles from './BlockTypeMenu.module.css';
import { BlockIcon } from '../../utils/blockIcons';
import { calculateSmartPosition } from '../../utils/floatingPosition';

declare global {
  interface Window {
    __editorBlockClipboard?: any;
    __editorClipboardText?: string;
  }
}

export interface BlockTypeMenuProps {
  editor: Editor | null;
  pos: number;
  nodeType?: string;
  nodeLevel?: number;
  nodeSize?: number;
  anchorRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteBlock?: () => void;
}

export interface MenuItemOption {
  key: string;
  label: string;
  type: string;
  level?: number;
  action: (editor: Editor, pos: number) => void;
}

const TEXT_BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'taskList',
  'blockquote',
]);

const isTextBlock = (type?: string) => {
  if (!type) return true;
  return TEXT_BLOCK_TYPES.has(type);
};

const MENU_OPTIONS: MenuItemOption[] = [
  {
    key: 'paragraph',
    label: '正文',
    type: 'paragraph',
    action: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    key: 'heading-1',
    label: '一级标题',
    type: 'heading',
    level: 1,
    action: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    key: 'heading-2',
    label: '二级标题',
    type: 'heading',
    level: 2,
    action: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    key: 'heading-3',
    label: '三级标题',
    type: 'heading',
    level: 3,
    action: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  {
    key: 'bulletList',
    label: '无序列表',
    type: 'bulletList',
    action: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    key: 'orderedList',
    label: '有序列表',
    type: 'orderedList',
    action: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    key: 'taskList',
    label: '待办列表',
    type: 'taskList',
    action: (editor) => {
      editor.chain().focus().toggleTaskList().run();
    },
  },
  {
    key: 'blockquote',
    label: '引用',
    type: 'blockquote',
    action: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
];

export const BlockTypeMenu: React.FC<BlockTypeMenuProps> = ({
  editor,
  pos,
  nodeType,
  nodeLevel,
  nodeSize = 1,
  anchorRect,
  isOpen,
  onClose,
  onDeleteBlock,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hasClipboardData, setHasClipboardData] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const checkClipboard = async () => {
      if (window.__editorBlockClipboard) {
        if (isMounted) setHasClipboardData(true);
        return;
      }

      try {
        if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
          const text = await navigator.clipboard.readText();
          if (isMounted) {
            setHasClipboardData(Boolean(text && text.trim().length > 0));
          }
        } else {
          if (isMounted) setHasClipboardData(false);
        }
      } catch (_e) {
        if (isMounted) setHasClipboardData(false);
      }
    };

    checkClipboard();

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !editor || !anchorRect) {
    return null;
  }

  const isText = isTextBlock(nodeType);

  const container = editor.view.dom.closest('[class*="editorContainer"]') as HTMLElement;
  const containerRect = container
    ? container.getBoundingClientRect()
    : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

  // 尺寸精确定位
  const menuWidth = isText ? 148 : 136;
  const estimatedMenuHeight = isText ? 160 : 100;

  const posResult = calculateSmartPosition({
    targetRect: anchorRect,
    containerRect,
    menuWidth,
    menuHeight: estimatedMenuHeight,
    preferredPlacement: 'bottom',
    offset: 6,
  });

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const targetNode = editor.state.doc.nodeAt(pos);
      if (targetNode) {
        const blockJSON = targetNode.toJSON();
        window.__editorBlockClipboard = blockJSON;

        const jsonString = JSON.stringify(blockJSON);
        window.__editorClipboardText = jsonString;
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(jsonString);
        }
        setHasClipboardData(true);
      }
    } catch (_e) {
      // 忽略异常
    }
    onClose();
  };

  const handlePaste = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasClipboardData) return;

    let contentToInsert: any = window.__editorBlockClipboard;

    if (!contentToInsert) {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
          const sysText = await navigator.clipboard.readText();
          if (sysText) {
            try {
              contentToInsert = JSON.parse(sysText);
            } catch (_e) {
              contentToInsert = sysText;
            }
          }
        }
      } catch (_e) {
        // ignore
      }
    }

    if (contentToInsert && editor) {
      try {
        const insertPos = pos + nodeSize;
        editor.chain().focus().insertContentAt(insertPos, contentToInsert).run();
      } catch (_e) {
        // 忽略范围异常
      }
    }
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteBlock) {
      onDeleteBlock();
    } else {
      try {
        editor.chain().focus().deleteRange({ from: pos, to: pos + nodeSize }).run();
      } catch (_e) {
        // 忽略范围异常
      }
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={styles.blockTypeMenu}
      style={{
        position: 'absolute',
        top: `${posResult.top}px`,
        left: `${posResult.left}px`,
        width: `${menuWidth}px`,
        height: 'auto',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isText && (
        <div className={styles.iconGrid}>
          {MENU_OPTIONS.map((opt) => {
            const isActive =
              opt.type === 'heading'
                ? nodeType === 'heading' && nodeLevel === opt.level
                : nodeType === opt.type;

            return (
              <button
                key={opt.key}
                type="button"
                className={`${styles.iconBtn} ${isActive ? styles.activeBtn : ''}`}
                title={opt.label}
                onClick={() => {
                  try {
                    editor.chain().focus().setTextSelection(pos).run();
                  } catch (_e) {
                    // 忽略选区越界
                  }
                  opt.action(editor, pos);
                  onClose();
                }}
              >
                <BlockIcon
                  type={opt.type}
                  level={opt.level}
                  size={16}
                  color={isActive ? '#2563eb' : undefined}
                />
              </button>
            );
          })}
        </div>
      )}

      {isText && <div className={styles.horizontalDivider} />}

      <div className={styles.actionGroup}>
        <button
          type="button"
          className={styles.actionItem}
          onClick={handleCopy}
        >
          <Copy size={14} strokeWidth={1.6} />
          <span className={styles.actionText}>复制</span>
        </button>

        <button
          type="button"
          className={`${styles.actionItem} ${!hasClipboardData ? styles.disabledItem : ''}`}
          disabled={!hasClipboardData}
          onClick={handlePaste}
        >
          <ClipboardPaste size={14} strokeWidth={1.6} />
          <span className={styles.actionText}>粘贴</span>
        </button>

        <button
          type="button"
          className={`${styles.actionItem} ${styles.deleteItem}`}
          onClick={handleDelete}
        >
          <Trash2 size={14} strokeWidth={1.6} />
          <span className={styles.actionText}>删除</span>
        </button>
      </div>
    </div>
  );
};
