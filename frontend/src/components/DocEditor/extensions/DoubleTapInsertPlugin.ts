import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { TextSelection } from '@tiptap/pm/state';

export const DoubleTapInsertPluginKey = new PluginKey('doubleTapInsert');

export const DoubleTapInsertPlugin = Extension.create({
  name: 'doubleTapInsert',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: DoubleTapInsertPluginKey,
        props: {
          handleDOMEvents: {
            dblclick: (view, event) => {
              if (!view.editable) return false;

              const target = event.target as HTMLElement | null;
              if (!target) return false;

              // 检查是否属于特殊的不可编辑内部控件 (如按钮、输入框)
              if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.closest('button') ||
                target.closest('input') ||
                target.closest('[class*="bubbleMenu"]') ||
                target.closest('[class*="toolbar"]')
              ) {
                return false;
              }

              // 获取 DOM 选区，如果用户精准双击了非空文本单词（触发选词），不拦截
              const windowSelection = window.getSelection();
              if (windowSelection && windowSelection.toString().trim().length > 0) {
                // 如果双击的是具体文本且选中了单词，允许原生选词
                const targetRect = target.getBoundingClientRect();
                if (targetRect && targetRect.height > 0) {
                  const relativeY = event.clientY - targetRect.top;
                  if (relativeY >= 0 && relativeY < targetRect.height * 0.75) {
                    return false;
                  }
                }
              }

              let pos: number | null = null;
              if (target !== view.dom && !target.classList.contains('ProseMirror')) {
                try {
                  const coords = { left: event.clientX, top: event.clientY };
                  const posResult = view.posAtCoords(coords);
                  if (posResult) pos = posResult.pos;
                } catch (_e) {
                  pos = null;
                }

                if (pos === null) {
                  try {
                    const domPos = view.posAtDOM(target, 0);
                    if (domPos !== null && domPos !== undefined) {
                      pos = domPos;
                    }
                  } catch (_e) {
                    pos = null;
                  }
                }
              }

              if (pos === null) {
                pos = view.state.selection.$anchor.pos;
              }

              const $pos = view.state.doc.resolve(Math.min(pos, view.state.doc.content.size));

              // 决定要在哪个深度 depth 后方追加空白 Block
              let targetDepth = $pos.depth;

              // 如果点在最深的内容节点 (如段落中的文本)
              while (targetDepth > 0) {
                const node = $pos.node(targetDepth);
                if (node.isBlock) {
                  break;
                }
                targetDepth--;
              }

              if (targetDepth < 0) targetDepth = 0;

              const insertPos = $pos.after(Math.max(1, targetDepth));
              if (insertPos < 0 || insertPos > view.state.doc.content.size) {
                return false;
              }

              const schema = view.state.schema;
              if (!schema.nodes.paragraph) return false;

              const paragraphNode = schema.nodes.paragraph.create();
              const tr = view.state.tr;
              tr.insert(insertPos, paragraphNode);

              const $insertedPos = tr.doc.resolve(Math.min(insertPos + 1, tr.doc.content.size));
              tr.setSelection(TextSelection.near($insertedPos));
              tr.scrollIntoView();

              view.dispatch(tr);
              view.focus();

              event.preventDefault();
              event.stopPropagation();
              return true;
            },
          },
        },
      }),
    ];
  },
});
