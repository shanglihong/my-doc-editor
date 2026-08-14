import type { Editor } from '@tiptap/core';
import { TextSelection, NodeSelection } from '@tiptap/pm/state';

export type ToolbarType = 'text' | 'table' | 'callout' | 'image' | null;

export interface ActiveToolbarInfo {
  type: ToolbarType;
  depth: number;
}

/**
 * 计算当前选区在语法树层次结构中的“最深活节点菜单类型”。
 * 优先展示最深的内嵌 Block 菜单，隐藏浅层父级 Block 菜单。
 */
export function getActiveToolbarInfo(editor: Editor | null): ActiveToolbarInfo {
  if (!editor || !editor.state) {
    return { type: null, depth: -1 };
  }

  const { state } = editor;
  const { selection } = state;
  const { $anchor } = selection;

  const candidates: { type: ToolbarType; depth: number }[] = [];

  // 1. 如果选区是图片 Block (NodeSelection)
  if (selection instanceof NodeSelection && selection.node.type.name === 'imageBlock') {
    candidates.push({ type: 'image', depth: $anchor.depth });
  }

  // 2. 如果选区是非空文本选区且不在代码块中
  if (selection instanceof TextSelection && !selection.empty && selection.from !== selection.to) {
    if (!editor.isActive('codeBlock')) {
      candidates.push({ type: 'text', depth: $anchor.depth });
    }
  }

  // 3. 遍历祖先节点链 ($anchor.depth -> 1)
  for (let d = $anchor.depth; d > 0; d--) {
    const node = $anchor.node(d);
    if (node.type.name === 'table') {
      candidates.push({ type: 'table', depth: d });
    } else if (node.type.name === 'callout') {
      candidates.push({ type: 'callout', depth: d });
    }
  }

  if (candidates.length === 0) {
    return { type: null, depth: -1 };
  }

  // 按 depth 降序排序，选取 depth 最大的候选作为唯一胜出的活动菜单
  candidates.sort((a, b) => b.depth - a.depth);

  return candidates[0];
}
