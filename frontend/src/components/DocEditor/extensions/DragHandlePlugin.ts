import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const dragHandlePluginKey = new PluginKey('dragHandlePlugin');

export interface DragHandleOptions {
  onNodeChange?: (data: { node: any; pos: number; top: number; left: number } | null) => void;
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
              const blockDom = targetEl.closest('.ProseMirror > *') as HTMLElement;
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
                const pos = view.posAtDOM(blockDom, 0);
                if (pos === null || pos === undefined) {
                  this.options.onNodeChange(null);
                  return false;
                }

                const resolvedPos = view.state.doc.resolve(Math.min(pos, view.state.doc.content.size));
                const blockStartPos = resolvedPos.before(1);
                const node = view.state.doc.nodeAt(blockStartPos);

                if (!node) {
                  this.options.onNodeChange(null);
                  return false;
                }

                const relativeTop = rect.top - containerRect.top + 2;

                this.options.onNodeChange({
                  node,
                  pos: blockStartPos,
                  top: relativeTop,
                  left: 16,
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
