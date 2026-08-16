import type { EditorView } from '@tiptap/pm/view';
import { hoverStackManager } from './toolbarPriority';

declare global {
  interface Window {
    __editorBlockClipboard?: any;
    __editorClipboardText?: string;
  }
}

export function handleEditorPaste(view: EditorView, event: ClipboardEvent): boolean {
  // 1. 优先尝试从全局缓存解析完整 Block 节点
  if (
    window.__editorBlockClipboard &&
    typeof window.__editorBlockClipboard === 'object' &&
    window.__editorBlockClipboard.type
  ) {
    const textInClipboard = event.clipboardData?.getData('text/plain');
    const jsonStr = JSON.stringify(window.__editorBlockClipboard);
    if (
      !textInClipboard ||
      textInClipboard === jsonStr ||
      textInClipboard === window.__editorClipboardText
    ) {
      try {
        const node = view.state.schema.nodeFromJSON(window.__editorBlockClipboard);
        if (node) {
          const tr = view.state.tr.replaceSelectionWith(node);
          view.dispatch(tr);
          return true;
        }
      } catch (_e) {
        // fallback
      }
    }
  }

  // 2. 检查剪贴板文本是否为 Block JSON 数据结构
  const pastedText = event.clipboardData?.getData('text/plain');
  if (pastedText && pastedText.trim().startsWith('{') && pastedText.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(pastedText);
      if (parsed && typeof parsed === 'object' && parsed.type && typeof parsed.type === 'string') {
        const node = view.state.schema.nodeFromJSON(parsed);
        if (node) {
          const tr = view.state.tr.replaceSelectionWith(node);
          view.dispatch(tr);
          return true;
        }
      }
    } catch (_e) {
      // 非 Block JSON，交给默认粘贴
    }
  }

  return false;
}

export function handleEditorCopy(view: EditorView, event: ClipboardEvent): boolean {
  const { state } = view;
  const { selection } = state;
  if (selection.$anchor.parent.type.name === 'codeBlock') {
    const text = state.doc.textBetween(selection.from, selection.to, '\n');
    if (text && event.clipboardData) {
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
      return true;
    }
  }
  return false;
}

export function handleEditorMouseOver(view: EditorView, event: MouseEvent): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;

  // 1. 如果鼠标位于工具栏/弹出面板自身内部，保持悬浮活动状态（清除隐藏定时器）
  if (
    target.closest('[class*="unifiedToolbar"]') ||
    target.closest('[class*="BubbleMenu"]') ||
    target.closest('[class*="popover"]') ||
    target.closest('[class*="dropdown"]')
  ) {
    hoverStackManager.keepActive();
    return false;
  }

  const docSize = view.state.doc.content.size;

  // 按 CSS DOM 嵌套深度：优先匹配内层具体 Block 元素 (Image, Code, DrawIO, Table)
  const imageEl = target.closest('[class*="imageBlockContainer"]');
  const codeEl = target.closest('pre') || target.closest('[class*="codeBlockWrapper"]');
  const drawioEl = target.closest('[class*="drawio-node-wrapper"]');
  const tableEl = target.closest('table');
  const calloutEl = target.closest('[data-type="callout"]') || target.closest('[class*="calloutWrapper"]');

  // 2. 检查内层 ImageBlock (depth: 2)
  if (imageEl) {
    try {
      const domPos = view.posAtDOM(imageEl, 0);
      if (typeof domPos === 'number') {
        hoverStackManager.setExclusiveTarget({
          id: `image-${domPos}`,
          type: 'image',
          depth: 2,
          nodePos: domPos,
          domElement: imageEl as HTMLElement,
        });
        return false;
      }
    } catch (_err) {
      // ignore
    }
  }

  // 3. 检查内层 CodeBlock (depth: 2)
  if (codeEl) {
    try {
      const domPos = view.posAtDOM(codeEl, 0);
      if (typeof domPos === 'number') {
        hoverStackManager.setExclusiveTarget({
          id: `codeblock-${domPos}`,
          type: 'codeBlock',
          depth: 2,
          nodePos: domPos,
          domElement: codeEl as HTMLElement,
        });
        return false;
      }
    } catch (_err) {
      // ignore
    }
  }

  // 4. 检查内层 DrawIO (depth: 2)
  if (drawioEl) {
    try {
      const domPos = view.posAtDOM(drawioEl, 0);
      if (typeof domPos === 'number') {
        hoverStackManager.setExclusiveTarget({
          id: `drawio-${domPos}`,
          type: 'drawio',
          depth: 2,
          nodePos: domPos,
          domElement: drawioEl as HTMLElement,
        });
        return false;
      }
    } catch (_err) {
      // ignore
    }
  }

  // 5. 检查 Table Block (depth: 2)
  if (tableEl) {
    try {
      const domPos = view.posAtDOM(tableEl, 0);
      if (typeof domPos === 'number') {
        const resolved = view.state.doc.resolve(Math.min(domPos, docSize));
        let tablePos = domPos;
        let depth = resolved.depth;
        for (let d = resolved.depth; d > 0; d--) {
          if (resolved.node(d).type.name === 'table') {
            tablePos = resolved.before(d);
            depth = d;
            break;
          }
        }
        hoverStackManager.setExclusiveTarget({
          id: `table-${tablePos}`,
          type: 'table',
          depth: Math.max(2, depth),
          nodePos: tablePos,
          domElement: tableEl,
        });
        return false;
      }
    } catch (_err) {
      // ignore
    }
  }

  // 6. 检查外层包裹容器 Callout Block (depth: 1)
  if (calloutEl) {
    try {
      const domPos = view.posAtDOM(calloutEl, 0);
      if (typeof domPos === 'number') {
        hoverStackManager.setExclusiveTarget({
          id: `callout-${domPos}`,
          type: 'callout',
          depth: 1,
          nodePos: domPos,
          domElement: calloutEl as HTMLElement,
        });
        return false;
      }
    } catch (_err) {
      // ignore
    }
  }

  // 7. 如果鼠标划过普通的文本、段落等无特化工具栏节点或缝隙，使用 250ms 防抖延时平滑淡出
  const topBlock = target.closest('.ProseMirror > *');
  if (topBlock && !tableEl && !calloutEl && !codeEl && !imageEl && !drawioEl) {
    hoverStackManager.setExclusiveTarget(null, 250);
  }

  return false;
}

export function handleEditorMouseLeave(_view: EditorView, event: MouseEvent): boolean {
  const relatedTarget = (event as MouseEvent).relatedTarget as HTMLElement | null;
  if (
    relatedTarget &&
    (relatedTarget.closest('[class*="floatingBlockTool"]') ||
      relatedTarget.closest('[class*="unifiedToolbar"]') ||
      relatedTarget.closest('[class*="BubbleMenu"]') ||
      relatedTarget.closest('[class*="popover"]'))
  ) {
    return false;
  }
  hoverStackManager.setExclusiveTarget(null, 250);
  return false;
}
