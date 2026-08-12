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

              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (!pos) {
                this.options.onNodeChange(null);
                return false;
              }

              // 查找光标对应的顶层块节点
              const resolvedPos = view.state.doc.resolve(pos.pos);
              const node = resolvedPos.node(1);
              if (!node) {
                this.options.onNodeChange(null);
                return false;
              }

              const dom = view.nodeDOM(resolvedPos.before(1)) as HTMLElement;
              if (!dom) {
                this.options.onNodeChange(null);
                return false;
              }

              const rect = dom.getBoundingClientRect();
              const editorRect = view.dom.getBoundingClientRect();

              this.options.onNodeChange({
                node,
                pos: resolvedPos.before(1),
                top: rect.top - editorRect.top,
                left: -28,
              });

              return false;
            },
          },
        },
      }),
    ];
  },
});
