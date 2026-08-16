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

              // 检查是否属于特殊的不可编辑内部控件 (如按钮、输入框、悬浮菜单)
              if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.closest('button') ||
                target.closest('input') ||
                target.closest('[class*="bubbleMenu"]') ||
                target.closest('[class*="toolbar"]') ||
                target.closest('[class*="floatingBlockTool"]')
              ) {
                return false;
              }

              // 获取 DOM 选区，如果用户精准双击了非空文本单词（触发选词），允许原生选词
              const windowSelection = window.getSelection();
              if (windowSelection && windowSelection.toString().trim().length > 0) {
                const targetRect = target.getBoundingClientRect();
                if (targetRect && targetRect.height > 0) {
                  const relativeY = event.clientY - targetRect.top;
                  if (relativeY >= 0 && relativeY < targetRect.height * 0.75) {
                    return false;
                  }
                }
              }

              let insertPos: number | null = null;

              // 1. 优先使用鼠标物理坐标 (clientX, clientY) 精准匹配鼠标位置所在的 Block
              try {
                const coords = { left: event.clientX, top: event.clientY };
                const posResult = view.posAtCoords(coords);
                if (posResult && typeof posResult.pos === 'number') {
                  const $pos = view.state.doc.resolve(posResult.pos);
                  let depth = $pos.depth;
                  while (depth > 0) {
                    const node = $pos.node(depth);
                    if (node.isBlock) {
                      insertPos = $pos.after(depth);
                      break;
                    }
                    depth--;
                  }
                }
              } catch {
                insertPos = null;
              }

              // 2. 若当前焦点有效，优先从选区 $anchor 寻找最近内部 Block (保证嵌套块内部正常追加)
              if (insertPos === null && view.state.selection) {
                const $pos = view.state.selection.$anchor;
                let depth = $pos.depth;
                while (depth > 0) {
                  const node = $pos.node(depth);
                  if (node.isBlock) {
                    insertPos = $pos.after(depth);
                    break;
                  }
                  depth--;
                }
              }

              // 3. 如果仍未解析到 (如双击在 Block 下方的空白大留白处)，根据鼠标垂直 Y 坐标定位
              if (insertPos === null) {
                const editorDom = view.dom;
                const blocks = Array.from(editorDom.children) as HTMLElement[];
                const mouseY = event.clientY;

                if (blocks.length > 0) {
                  let targetBlockDom: HTMLElement | null = null;
                  let insertAfter = true;

                  if (mouseY < blocks[0].getBoundingClientRect().top) {
                    targetBlockDom = blocks[0];
                    insertAfter = false;
                  } else if (mouseY >= blocks[blocks.length - 1].getBoundingClientRect().bottom) {
                    targetBlockDom = blocks[blocks.length - 1];
                    insertAfter = true;
                  } else {
                    for (let i = 0; i < blocks.length; i++) {
                      const rect = blocks[i].getBoundingClientRect();
                      if (mouseY >= rect.top && mouseY <= rect.bottom) {
                        targetBlockDom = blocks[i];
                        insertAfter = true;
                        break;
                      } else if (i < blocks.length - 1) {
                        const nextRect = blocks[i + 1].getBoundingClientRect();
                        if (mouseY > rect.bottom && mouseY < nextRect.top) {
                          targetBlockDom = blocks[i];
                          insertAfter = true;
                          break;
                        }
                      }
                    }
                  }

                  if (targetBlockDom) {
                    try {
                      const domPos = view.posAtDOM(targetBlockDom, 0);
                      if (typeof domPos === 'number') {
                        const safeDomPos = Math.min(domPos, view.state.doc.content.size);
                        const $pos = view.state.doc.resolve(safeDomPos);
                        let depth = $pos.depth;
                        while (depth > 0) {
                          const node = $pos.node(depth);
                          if (node.isBlock) {
                            insertPos = insertAfter ? $pos.after(depth) : $pos.before(depth);
                            break;
                          }
                          depth--;
                        }
                      }
                    } catch {
                      insertPos = null;
                    }
                  }
                }
              }

              const docSize = view.state.doc.content.size;
              if (insertPos === null || insertPos < 0 || insertPos > docSize) {
                insertPos = docSize;
              }

              const schema = view.state.schema;
              if (!schema.nodes.paragraph) return false;

              const paragraphNode = schema.nodes.paragraph.create();
              const tr = view.state.tr;

              // 在鼠标物理位置所在的 Block 后方追加生成空白段落
              tr.insert(insertPos, paragraphNode);

              const targetTextPos = Math.min(insertPos + 1, tr.doc.content.size);
              tr.setSelection(TextSelection.near(tr.doc.resolve(targetTextPos)));
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
