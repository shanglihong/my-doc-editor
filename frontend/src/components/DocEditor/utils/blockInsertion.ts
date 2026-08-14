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
 * 在指定 Block 节点的上方或下方插入一个新的空白段落块，并将光标精准聚焦至新段落内部
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

  if (editor && editor.state && editor.state.doc) {
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
  const docSize = editor?.state?.doc?.content?.size;
  const insertPos = typeof docSize === 'number' ? Math.min(targetPos, docSize) : targetPos;

  const res = editor
    .chain()
    .focus()
    .insertContentAt(insertPos, { type: 'paragraph' })
    .run();

  if (res && editor?.commands?.setTextSelection && typeof docSize === 'number') {
    try {
      editor.commands.setTextSelection(Math.min(insertPos + 1, editor.state.doc.content.size));
    } catch (_e) {
      // 静默捕获 mock 兼容
    }
  }

  return res;
}
