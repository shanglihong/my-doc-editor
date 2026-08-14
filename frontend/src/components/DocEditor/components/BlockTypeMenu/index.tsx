import React, { useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import styles from './BlockTypeMenu.module.css';
import { BlockIcon } from '../../utils/blockIcons';
import { calculateSmartPosition } from '../../utils/floatingPosition';

export interface BlockTypeMenuProps {
  editor: Editor | null;
  pos: number;
  anchorRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface MenuItemOption {
  key: string;
  label: string;
  description: string;
  type: string;
  level?: number;
  action: (editor: Editor, pos: number) => void;
}

const MENU_OPTIONS: MenuItemOption[] = [
  {
    key: 'paragraph',
    label: '正文文本',
    description: '转换为标准普通段落文本',
    type: 'paragraph',
    action: (editor, _pos) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    key: 'heading-1',
    label: '一级标题',
    description: '转换为最高层级大标题',
    type: 'heading',
    level: 1,
    action: (editor, _pos) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    key: 'heading-2',
    label: '二级标题',
    description: '转换为章节中级标题',
    type: 'heading',
    level: 2,
    action: (editor, _pos) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    key: 'heading-3',
    label: '三级标题',
    description: '转换为小节标题',
    type: 'heading',
    level: 3,
    action: (editor, _pos) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  {
    key: 'bulletList',
    label: '无序列表',
    description: '转换为项目符号点状列表',
    type: 'bulletList',
    action: (editor, _pos) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    key: 'orderedList',
    label: '有序列表',
    description: '转换为数字编号顺序列表',
    type: 'orderedList',
    action: (editor, _pos) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    key: 'taskList',
    label: '待办列表',
    description: '转换为带复选框的待办任务列表',
    type: 'taskList',
    action: (editor, _pos) => {
      editor.chain().focus().toggleTaskList().run();
    },
  },
  {
    key: 'blockquote',
    label: '引用块',
    description: '转换为引用文段或重点强调',
    type: 'blockquote',
    action: (editor, _pos) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    key: 'codeBlock',
    label: '代码',
    description: '转换为高亮代码片段区域',
    type: 'codeBlock',
    action: (editor, _pos) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    key: 'callout',
    label: '高亮块',
    description: '转换为带图标背景提示区域',
    type: 'callout',
    action: (editor, _pos) => {
      editor.chain().focus().toggleCallout().run();
    },
  },
  {
    key: 'table',
    label: '数据表格',
    description: '插入 3x3 结构化表格',
    type: 'table',
    action: (editor, _pos) => {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    key: 'drawioBlock',
    label: '画图',
    description: '插入流程图与架构图编辑器',
    type: 'drawioBlock',
    action: (editor, _pos) => {
      (editor.chain().focus() as any).insertDrawIO().run();
    },
  },
];

export const BlockTypeMenu: React.FC<BlockTypeMenuProps> = ({
  editor,
  pos,
  anchorRect,
  isOpen,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

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

    const handleWheel = (e: WheelEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        const listEl = menuRef.current.querySelector('[class*="blockTypeMenuList"]') as HTMLElement;
        if (listEl) {
          const { scrollTop, scrollHeight, clientHeight } = listEl;
          const delta = e.deltaY;
          const isAtTop = scrollTop === 0 && delta < 0;
          const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 2 && delta > 0;
          if (isAtTop || isAtBottom) {
            e.preventDefault();
          }
        }
        return;
      }
      e.preventDefault();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !editor || !anchorRect) {
    return null;
  }

  // 获取宿主容器（如 .editorContainer）的 bounding rect，计算相对 top 和 left
  const container = editor.view.dom.closest('[class*="editorContainer"]') as HTMLElement;
  const containerRect = container
    ? container.getBoundingClientRect()
    : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

  const menuWidth = 196;
  const menuHeight = 280;

  const posResult = calculateSmartPosition({
    targetRect: anchorRect,
    containerRect,
    menuWidth,
    menuHeight,
    preferredPlacement: 'bottom',
    offset: 6,
  });

  return (
    <div
      ref={menuRef}
      className={styles.blockTypeMenu}
      style={{
        position: 'absolute',
        top: `${posResult.top}px`,
        left: `${posResult.left}px`,
        width: `${menuWidth}px`,
        maxHeight: `${menuHeight}px`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={styles.blockTypeMenuHeader}>切换 / 转换 Block 类型</div>
      <div className={styles.blockTypeMenuList}>
        {MENU_OPTIONS.map((opt) => {
          return (
            <div
              key={opt.key}
              className={styles.blockTypeMenuItem}
              onClick={() => {
                try {
                  // 将选区切换至目标 Block pos
                  editor.chain().focus().setTextSelection(pos).run();
                } catch (_e) {
                  // 忽略选区越界
                }
                opt.action(editor, pos);
                onClose();
              }}
            >
              <BlockIcon type={opt.type} level={opt.level} size={15} />
              <div className={styles.blockTypeMenuText}>
                <div className={styles.blockTypeMenuTitle}>{opt.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
