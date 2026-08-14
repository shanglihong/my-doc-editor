import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const dragHandlePluginKey = new PluginKey('dragHandlePlugin');

export interface DragHandleData {
  node: any;
  pos: number;
  top: number;
  left: number;
  nodeType: string;
  nodeLevel?: number;
  isEmpty: boolean;
}

export interface DragHandleOptions {
  onNodeChange?: (data: DragHandleData | null) => void;
}

export const DragHandlePlugin = Extension.create<DragHandleOptions>({
  name: 'dragHandlePlugin',

  addOptions() {
    return {
      onNodeChange: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: dragHandlePluginKey,
        props: {
          handleDOMEvents: {
            dragstart: (_view, event) => {
              const targetEl = event.target as HTMLElement;
              const isFromDragHandle =
                targetEl &&
                (targetEl.classList.contains('dragHandle') ||
                  targetEl.closest('[class*="dragHandle"]') !== null);

              // 强制：如果触发源不是左侧留白区的六点拖拽把手，全量阻断并停止冒泡正文 Block 的原生拖拽
              if (!isFromDragHandle) {
                event.preventDefault();
                event.stopPropagation();
                return true;
              }
              return false;
            },
            mousemove: (view, event) => {
              if (!this.options.onNodeChange) return false;

              const editorDom = view.dom;
              const container = editorDom.closest('[class*="editorContainer"]') || editorDom.parentElement;
              if (!container) {
                this.options.onNodeChange(null);
                return false;
              }

              const editorRect = editorDom.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              // 超出编辑器整体上/下边界时立即隐藏
              if (event.clientY < editorRect.top || event.clientY > editorRect.bottom) {
                this.options.onNodeChange(null);
                return false;
              }

              const sampleX = Math.max(editorRect.left + 20, containerRect.left + 40);
              const sampleY = event.clientY;

              const targetEl = document.elementFromPoint(sampleX, sampleY);
              if (!targetEl) {
                this.options.onNodeChange(null);
                return false;
              }

              // 必须严格匹配 .ProseMirror > * 级别的直接 Block 子节点
              let blockDom = targetEl.closest('.ProseMirror > *') as HTMLElement;
              if (!blockDom || !editorDom.contains(blockDom)) {
                this.options.onNodeChange(null);
                return false;
              }

              const rect = blockDom.getBoundingClientRect();
              // 严格限定：仅当鼠标 clientY 处于该 Block 节点的实际渲染高度范围内时展示把手
              if (event.clientY < rect.top || event.clientY > rect.bottom) {
                this.options.onNodeChange(null);
                return false;
              }

              try {
                // 针对 Tiptap 表格节点特别适配：DOM 元素可能为 tableWrapper，实际节点为其中的 table 元素
                const domForPos = blockDom.querySelector('table') || blockDom;
                let pos = view.posAtDOM(domForPos, 0);

                if (pos === null || pos === undefined) {
                  pos = view.posAtDOM(blockDom, 0);
                }

                if (pos === null || pos === undefined) {
                  this.options.onNodeChange(null);
                  return false;
                }

                const resolvedPos = view.state.doc.resolve(Math.min(pos, view.state.doc.content.size));
                const blockStartPos = resolvedPos.before(1);
                const node = view.state.doc.nodeAt(blockStartPos);

                if (!node || node.type.name === 'title') {
                  this.options.onNodeChange(null);
                  return false;
                }

                // 判空规则：检测段落与标题是否为空内容
                const isTextNode = node.type.name === 'paragraph' || node.type.name === 'heading';
                const isContentEmpty = isTextNode && node.textContent.trim() === '';

                // 垂直对齐规则：单行文案 Block 几何居中对齐，多行/卡片/表格 Block 精准对齐首行文字中线
                const handleHeight = 24;
                const isHeadingNode = node.type.name === 'heading';
                const level = node.attrs?.level || 1;
                const singleLineThreshold = isHeadingNode ? (level === 1 ? 52 : level === 2 ? 44 : 38) : 34;
                let relativeTop: number;

                if (node.type.name === 'table') {
                  // 表格块：对齐表格首行/表头区域
                  relativeTop = rect.top - containerRect.top + 8;
                } else if (rect.height <= singleLineThreshold) {
                  relativeTop = rect.top - containerRect.top + (rect.height - handleHeight) / 2;
                } else {
                  // 多行 Block 首行中线对齐
                  if (isHeadingNode && level === 1) {
                    relativeTop = rect.top - containerRect.top + 6;
                  } else if (isHeadingNode && level === 2) {
                    relativeTop = rect.top - containerRect.top + 3.5;
                  } else {
                    relativeTop = rect.top - containerRect.top + 1;
                  }
                }

                this.options.onNodeChange({
                  node,
                  pos: blockStartPos,
                  top: relativeTop,
                  left: 10,
                  nodeType: node.type.name,
                  nodeLevel: node.attrs?.level,
                  isEmpty: isContentEmpty,
                });
              } catch (_err) {
                this.options.onNodeChange(null);
              }

              return false;
            },
          },
        },
      }),
    ];
  },
});

