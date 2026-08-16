import { useState, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

export interface TOCItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
  pos: number;
}

export function useDocEditorTOC(editor: Editor | null) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const extractHeadings = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setItems([]);
      return;
    }

    const doc = editor.state.doc;
    const headings: TOCItem[] = [];

    // 仅遍历主文档树的第一层直接子节点，忽略 Callout / Table 等内嵌容器内部的标题
    doc.forEach((node, offset) => {
      if (node.type.name === 'heading') {
        const level = (node.attrs.level || 1) as number;
        if (level >= 1 && level <= 3) {
          const text = node.textContent.trim();
          headings.push({
            id: `toc-heading-${offset}`,
            text: text || `未命名标题 ${headings.length + 1}`,
            level: level as 1 | 2 | 3,
            pos: offset,
          });
        }
      }
    });

    setItems(headings);
  }, [editor]);

  // 计算当前活动的高亮标题 activeId
  const updateActiveHeading = useCallback(() => {
    if (!editor || editor.isDestroyed || items.length === 0) {
      setActiveId(null);
      return;
    }

    // 优先 1：基于屏幕滚动视口 DOM 判定
    let matchedId: string | null = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const domResult = editor.view.domAtPos(Math.min(item.pos + 1, editor.state.doc.content.size));
        const el = domResult.node instanceof HTMLElement ? domResult.node : domResult.node.parentElement;
        if (el) {
          const blockEl = (el.closest('.ProseMirror > *') as HTMLElement) || el;
          const rect = blockEl.getBoundingClientRect();
          if (rect.top <= 140) {
            matchedId = item.id;
          } else {
            break;
          }
        }
      } catch (_e) {
        // ignore
      }
    }

    // 兜底 2：基于编辑器光标位置 selection.from 判定
    if (!matchedId) {
      const currentPos = editor.state.selection.from;
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].pos <= currentPos) {
          matchedId = items[i].id;
          break;
        }
      }
    }

    // 如果还没有，则定位为第一个标题
    if (!matchedId && items.length > 0) {
      matchedId = items[0].id;
    }

    setActiveId(matchedId);
  }, [editor, items]);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    extractHeadings();

    const handleUpdate = () => {
      extractHeadings();
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, extractHeadings]);

  // 监听 DOM 页面滚动与 items 变动更新 activeId
  useEffect(() => {
    updateActiveHeading();

    const handleScroll = () => {
      updateActiveHeading();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateActiveHeading]);

  const scrollToHeading = useCallback(
    (pos: number) => {
      if (!editor || editor.isDestroyed) return;

      const targetPos = Math.min(pos + 1, editor.state.doc.content.size);

      try {
        // 1. 基于 ProseMirror DOMAtPos 查找标题节点
        const domResult = editor.view.domAtPos(targetPos);
        let el: HTMLElement | null = null;
        if (domResult.node instanceof HTMLElement) {
          el = domResult.node;
        } else if (domResult.node.parentElement) {
          el = domResult.node.parentElement;
        }

        if (el) {
          const blockEl = (el.closest('.ProseMirror > *') as HTMLElement) || el;
          // 计算相对于整个 document 顶部的绝对 Y 坐标，受当前滚动位置不敏感
          const absoluteTop = blockEl.getBoundingClientRect().top + window.scrollY;
          const targetY = Math.max(0, absoluteTop - 80);

          // 2. 一次性绝对平滑滚动到位
          window.scrollTo({
            top: targetY,
            behavior: 'smooth',
          });

          // 3. 延迟绑定光标焦点，防止 editor.focus() 原生强制滚动抢占平滑动画
          setTimeout(() => {
            try {
              if (editor && !editor.isDestroyed) {
                editor.commands.setTextSelection(targetPos);
              }
            } catch (_e) {
              // ignore
            }
          }, 60);

          return;
        }
      } catch (_err) {
        // fallback
      }

      // 4. Fallback 兜底
      try {
        editor.chain().focus().setTextSelection(targetPos).run();
      } catch (_err) {
        // ignore
      }
    },
    [editor]
  );

  return {
    items,
    activeId,
    scrollToHeading,
  };
}
