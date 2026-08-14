import type { Editor } from '@tiptap/core';

export interface InsertParagraphBlockParams {
  /** TipTap 编辑器实例 */
  editor: Editor;
  /** 获取节点在文档中位置的回调函数 */
  getPos: (() => number | undefined) | boolean | undefined;
  /** 节点占据的大小 (node.nodeSize) */
  nodeSize: number;
  /** 插入方向：'above' 在上方插入，'below' 在下方插入 */
  direction: 'above' | 'below';
}

/**
 * 在指定 Block 节点的上方或下方插入一个新的空白段落块，并将焦点定位至新块
 */
export function insertParagraphBlockAround({
  editor,
  getPos,
  nodeSize,
  direction,
}: InsertParagraphBlockParams): boolean {
  if (!editor || typeof getPos !== 'function') {
    return false;
  }

  let pos: number | null = null;
  try {
    const rawPos = getPos();
    if (typeof rawPos === 'number') {
      pos = rawPos;
    }
  } catch {
    return false;
  }

  if (pos === null || pos < 0) {
    return false;
  }

  let actualNodeSize = nodeSize || 1;

  if (editor.state && editor.state.doc) {
    try {
      const docSize = editor.state.doc.content.size;
      const safePos = Math.min(pos, docSize);
      const node = editor.state.doc.nodeAt(safePos);
      if (node) {
        actualNodeSize = node.nodeSize;
      }
    } catch (_err) {
      // fallback
    }
  }

  const targetPos = direction === 'above' ? pos : pos + actualNodeSize;

  return editor
    .chain()
    .focus()
    .insertContentAt(targetPos, { type: 'paragraph' })
    .run();
}
