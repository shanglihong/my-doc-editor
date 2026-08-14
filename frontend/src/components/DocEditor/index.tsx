import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, all } from 'lowlight';
import { Markdown } from 'tiptap-markdown';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { CustomTableCell, CustomTableHeader } from './extensions/CustomTableExtensions';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

import styles from './DocEditor.module.css';
import type { DocEditorProps, DocEditorRef, DocumentNode, BlockNode, DrawIOModalState } from './types';
import { FontSizeMark } from './extensions/FontSizeMark';
import { DragHandlePlugin } from './extensions/DragHandlePlugin';
import { DoubleTapInsertPlugin } from './extensions/DoubleTapInsertPlugin';
import { CalloutExtension } from './extensions/CalloutExtension';
import { DrawIOExtension } from './extensions/DrawIOExtension';
import { ImageBlockExtension } from './extensions/ImageBlockExtension';
import { ImageInsertModal } from './components/ImageBlock/ImageInsertModal';
import { ImageUploadService } from './services/imageUploadService';
import { DrawIOModal } from './components/DrawIO/DrawIOModal';
import { SlashMenuExtension } from './components/SlashMenu/SlashMenuPlugin';
import { BubbleToolbar } from './components/BubbleToolbar';
import { DragHandleUI } from './components/DragHandle';
import { BlockTypeMenu } from './components/BlockTypeMenu';
import { CodeBlockComponent } from './components/CodeBlock/CodeBlockComponent';
import { TableBubbleMenu } from './components/TableBubbleMenu';
import { CalloutBubbleMenu } from './components/Callout/CalloutBubbleMenu';
import { hoverStackManager } from './utils/toolbarPriority';

const lowlight = createLowlight(all);

export * from './types';
export * from './utils/defaultTheme';

declare module '@tiptap/core' {
  interface Storage {
    markdown?: {
      getMarkdown: () => string;
    };
  }
}

export const DocEditor = forwardRef<DocEditorRef, DocEditorProps>(
  (
    {
      value,
      onChange,
      readOnly = false,
      placeholder: _placeholder = '输入 "/" 唤起快捷菜单，或直接输入文本...',
      className = '',
    },
    ref
  ) => {
    const [dragState, setDragState] = useState<{
      visible: boolean;
      top: number;
      left: number;
      pos: number;
      nodeType?: string;
      nodeLevel?: number;
      isEmpty?: boolean;
      isDragging?: boolean;
    }>({
      visible: false,
      top: 0,
      left: 10,
      pos: 0,
      nodeType: 'paragraph',
      nodeLevel: undefined,
      isEmpty: false,
      isDragging: false,
    });
    const [typeMenuState, setTypeMenuState] = useState<{
      isOpen: boolean;
      pos: number;
      anchorRect: DOMRect | null;
    }>({
      isOpen: false,
      pos: 0,
      anchorRect: null,
    });
    const [dropIndicatorState, setDropIndicatorState] = useState<{ visible: boolean; top: number }>({
      visible: false,
      top: 0,
    });
    const [drawioModalState, setDrawioModalState] = useState<DrawIOModalState>({
      isOpen: false,
      initialXml: '',
      nodePos: null,
    });

    const editor = useEditor({
      editable: !readOnly,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          dropcursor: false,
          codeBlock: false,
        }),
        CodeBlockLowlight.configure({
          lowlight,
          defaultLanguage: 'plaintext',
        }).extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent);
          },
        }),
        Markdown.configure({
          html: false,
          transformCopiedText: true,
          transformPastedText: true,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        CustomTableHeader,
        CustomTableCell,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: ({ node }: { node: any }) => {
            if (node.type.name === 'codeBlock') {
              return '';
            }
            if (node.type.name === 'heading') {
              return `标题 ${node.attrs?.level || 1}`;
            }
            return "输入 '/' 唤起快捷菜单，或直接输入内容...";
          },
          emptyNodeClass: 'is-empty',
        }),
        Link.configure({
          autolink: false,
          openOnClick: false,
          linkOnPaste: true,
        }),
        FontSizeMark,
        CalloutExtension,
        DrawIOExtension,
        ImageBlockExtension,
        SlashMenuExtension,
        DoubleTapInsertPlugin,
        DragHandlePlugin.configure({
          onNodeChange: (data) => {
            setTypeMenuState((typeMenu) => {
              if (typeMenu.isOpen) {
                return typeMenu;
              }
              if (data) {
                setDragState({
                  visible: true,
                  top: data.top,
                  left: data.left,
                  pos: data.pos,
                  nodeType: data.nodeType,
                  nodeLevel: data.nodeLevel,
                  isEmpty: data.isEmpty,
                });
              } else {
                setDragState((prev) => ({ ...prev, visible: false }));
              }
              return typeMenu;
            });
          },
        }),
      ],
      content: typeof value === 'string' ? value : undefined,
      editorProps: {
        handleDOMEvents: {
          keydown: () => {
            window.dispatchEvent(new CustomEvent('HIDE_ALL_FLOATING_MENUS'));
            return false;
          },
          copy: (view, event) => {
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
          },
          mouseover: (view, event) => {
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
          },
          mouseleave: () => {
            hoverStackManager.setExclusiveTarget(null, 250);
            return false;
          },
        },
      },
      onUpdate: ({ editor }) => {
        if (!onChange) return;
        const json = editor.getJSON();
        const markdown = editor.storage.markdown?.getMarkdown() || editor.getText();

        const docNode: DocumentNode = {
          type: 'doc',
          version: '1.0',
          content: (json.content || []) as unknown as BlockNode[],
        };

        onChange(docNode, markdown);
      },
    });

    const handleSaveDrawIO = (xml: string, svg: string) => {
      if (!editor || drawioModalState.nodePos === null) return;
      editor
        .chain()
        .focus()
        .setNodeSelection(drawioModalState.nodePos)
        .updateAttributes('drawioBlock', { xml, svg })
        .run();
    };

    const handleInsertLocalImageFile = (file: File) => {
      if (!editor) return;
      const previewUrl = URL.createObjectURL(file);
      editor
        .chain()
        .focus()
        .setImageBlock({
          src: previewUrl,
          status: 'uploading',
          alignment: 'center',
        })
        .run();

      ImageUploadService.uploadImage(file)
        .then((result) => {
          editor.state.doc.descendants((docNode, pos) => {
            if (
              docNode.type.name === 'imageBlock' &&
              docNode.attrs.src === previewUrl
            ) {
              const trUpdate = editor.state.tr.setNodeMarkup(pos, undefined, {
                ...docNode.attrs,
                src: result.url,
                status: 'ready',
              });
              editor.view.dispatch(trUpdate);
            }
          });
        })
        .catch((err) => {
          editor.state.doc.descendants((docNode, pos) => {
            if (
              docNode.type.name === 'imageBlock' &&
              docNode.attrs.src === previewUrl
            ) {
              const trUpdate = editor.state.tr.setNodeMarkup(pos, undefined, {
                ...docNode.attrs,
                status: 'error',
                errorMessage: err?.message || '图片保存失败',
              });
              editor.view.dispatch(trUpdate);
            }
          });
        });
    };

    useEffect(() => {
      const handleOpenModal = (e: Event) => {
        const customEvent = e as CustomEvent;
        setDrawioModalState({
          isOpen: true,
          initialXml: customEvent.detail?.xml || '',
          nodePos: customEvent.detail?.nodePos ?? null,
        });
      };

      const handleOpenImageFilePicker = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            handleInsertLocalImageFile(files[0]);
          }
        };
        input.click();
      };

      window.addEventListener('OPEN_DRAWIO_MODAL', handleOpenModal);
      window.addEventListener('TRIGGER_OPEN_IMAGE_FILE_PICKER', handleOpenImageFilePicker);
      window.addEventListener('OPEN_IMAGE_MODAL', handleOpenImageFilePicker);

      return () => {
        window.removeEventListener('OPEN_DRAWIO_MODAL', handleOpenModal);
        window.removeEventListener('TRIGGER_OPEN_IMAGE_FILE_PICKER', handleOpenImageFilePicker);
        window.removeEventListener('OPEN_IMAGE_MODAL', handleOpenImageFilePicker);
      };
    }, [editor]);

    useImperativeHandle(
      ref,
      () => ({
        getJSON: (): DocumentNode => {
          if (!editor) {
            return { type: 'doc', version: '1.0', content: [] };
          }
          const json = editor.getJSON();
          return {
            type: 'doc',
            version: '1.0',
            content: (json.content || []) as unknown as BlockNode[],
          };
        },
        getMarkdown: (): string => {
          if (!editor) return '';
          return editor.storage.markdown?.getMarkdown() || editor.getText();
        },
        setContent: (content: DocumentNode | string) => {
          if (!editor) return;
          if (typeof content === 'string') {
            editor.commands.setContent(content);
          } else if (content && content.content) {
            editor.commands.setContent({
              type: 'doc',
              content: content.content,
            });
          }
        },
        clear: () => {
          if (!editor) return;
          editor.commands.clearContent();
        },
        focus: () => {
          if (!editor) return;
          editor.commands.focus();
        },
      }),
      [editor]
    );

    const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);

    useEffect(() => {
      const handleSlashMenuChange = (e: any) => {
        setIsSlashMenuOpen(!!e.detail?.isOpen);
        if (e.detail?.isOpen) {
          setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
        }
      };

      const handleGlobalMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        const isInsideDrag =
          target.closest('[class*="combinedDragHandleBtn"]') ||
          target.closest('[class*="dragHandle"]') ||
          target.closest('[class*="blockIconBtn"]');
        const isInsideBlockMenu = target.closest('[class*="blockTypeMenu"]');

        if (!isInsideDrag) {
          setDragState((prev) => ({ ...prev, visible: false }));
        }
        if (!isInsideDrag && !isInsideBlockMenu) {
          setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
        }
      };

      const handleGlobalKeyDown = () => {
        window.dispatchEvent(new CustomEvent('HIDE_ALL_FLOATING_MENUS'));
        setDragState((prev) => ({ ...prev, visible: false }));
      };

      window.addEventListener('SLASH_MENU_CHANGE', handleSlashMenuChange);
      window.addEventListener('mousedown', handleGlobalMouseDown);
      window.addEventListener('keydown', handleGlobalKeyDown);

      return () => {
        window.removeEventListener('SLASH_MENU_CHANGE', handleSlashMenuChange);
        window.removeEventListener('mousedown', handleGlobalMouseDown);
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }, []);

    return (
      <div
        className={`${styles.editorContainer} ${className}`}
        onMouseLeave={() => {
          setDragState((prev) => ({ ...prev, visible: false }));
          hoverStackManager.setExclusiveTarget(null, 250);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
          }
          if (!editor) return;
          const editorDom = editor.view.dom;
          const containerRect = e.currentTarget.getBoundingClientRect();
          const blocks = Array.from(editorDom.children) as HTMLElement[];

          if (blocks.length === 0) return;

          const mouseY = e.clientY;
          let calculatedLineTop = 0;

          if (mouseY < blocks[0].getBoundingClientRect().top + blocks[0].getBoundingClientRect().height / 2) {
            calculatedLineTop = blocks[0].getBoundingClientRect().top - containerRect.top;
          } else if (
            mouseY >=
            blocks[blocks.length - 1].getBoundingClientRect().top +
              blocks[blocks.length - 1].getBoundingClientRect().height / 2
          ) {
            calculatedLineTop = blocks[blocks.length - 1].getBoundingClientRect().bottom - containerRect.top;
          } else {
            for (let i = 0; i < blocks.length - 1; i++) {
              const currentRect = blocks[i].getBoundingClientRect();
              const nextRect = blocks[i + 1].getBoundingClientRect();
              const currentMid = currentRect.top + currentRect.height / 2;
              const nextMid = nextRect.top + nextRect.height / 2;

              if (mouseY >= currentMid && mouseY < nextMid) {
                calculatedLineTop = nextRect.top - containerRect.top;
                break;
              }
            }
          }

          setDropIndicatorState({ visible: true, top: calculatedLineTop });
        }}
        onDragLeave={() => {
          setDropIndicatorState({ visible: false, top: 0 });
        }}
        onDrop={(e) => {
          // 如果拖拽的是图片文件，由 ImageBlockExtension ProseMirror 插件优先拦截
          if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const hasImage = Array.from(e.dataTransfer.files).some((f) => f.type.startsWith('image/'));
            if (hasImage) return;
          }

          e.preventDefault();
          setDropIndicatorState({ visible: false, top: 0 });
          if (!editor) return;

          const posStr = e.dataTransfer.getData('application/x-tiptap-dragged-pos');
          if (!posStr) return;
          const fromPos = parseInt(posStr, 10);
          if (isNaN(fromPos)) return;

          const editorDom = editor.view.dom;
          const blocks = Array.from(editorDom.children) as HTMLElement[];
          if (blocks.length === 0) return;

          const mouseY = e.clientY;
          let targetBlockDom: HTMLElement | null = null;
          let dropAfter = false;

          if (mouseY < blocks[0].getBoundingClientRect().top + blocks[0].getBoundingClientRect().height / 2) {
            targetBlockDom = blocks[0];
            dropAfter = false;
          } else if (
            mouseY >=
            blocks[blocks.length - 1].getBoundingClientRect().top +
              blocks[blocks.length - 1].getBoundingClientRect().height / 2
          ) {
            targetBlockDom = blocks[blocks.length - 1];
            dropAfter = true;
          } else {
            for (let i = 0; i < blocks.length - 1; i++) {
              const currentRect = blocks[i].getBoundingClientRect();
              const nextRect = blocks[i + 1].getBoundingClientRect();
              const currentMid = currentRect.top + currentRect.height / 2;
              const nextMid = nextRect.top + nextRect.height / 2;

              if (mouseY >= currentMid && mouseY < nextMid) {
                targetBlockDom = blocks[i + 1];
                dropAfter = false;
                break;
              }
            }
          }

          if (targetBlockDom) {
            try {
              const domPos = editor.view.posAtDOM(targetBlockDom, 0);
              if (domPos !== null && domPos !== undefined) {
                const resolved = editor.state.doc.resolve(Math.min(domPos, editor.state.doc.content.size));
                const blockStart = resolved.before(1);
                let targetPos = blockStart;

                if (dropAfter) {
                  targetPos = resolved.after(1);
                }

                if (fromPos !== targetPos) {
                  const nodeToMove = editor.state.doc.nodeAt(fromPos);
                  if (nodeToMove) {
                    const tr = editor.state.tr;
                    if (fromPos < targetPos) {
                      tr.insert(targetPos, nodeToMove);
                      tr.delete(fromPos, fromPos + nodeToMove.nodeSize);
                    } else {
                      tr.delete(fromPos, fromPos + nodeToMove.nodeSize);
                      tr.insert(targetPos, nodeToMove);
                    }
                    editor.view.dispatch(tr);
                  }
                }
              }
            } catch (_err) {
              // fallback
            }
          }
          setDropIndicatorState({ visible: false, top: 0 });
          setDragState((prev) => ({ ...prev, visible: false, isDragging: false }));
        }}
      >
        {dropIndicatorState.visible && (
          <div
            className={styles.dropIndicator}
            style={{ top: `${dropIndicatorState.top}px` }}
          />
        )}
        <DragHandleUI
          top={dragState.top}
          left={dragState.left}
          pos={dragState.pos}
          visible={(dragState.visible || typeMenuState.isOpen) && !isSlashMenuOpen}
          nodeType={dragState.nodeType}
          nodeLevel={dragState.nodeLevel}
          isEmpty={dragState.isEmpty}
          onMouseDown={() => setTypeMenuState((prev) => ({ ...prev, isOpen: false }))}
          onDragStart={() => {
            setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
            setDragState((prev) => ({ ...prev, isDragging: true }));
          }}
          onDragEnd={() => {
            setDragState((prev) => ({ ...prev, visible: false, isDragging: false }));
            setDropIndicatorState({ visible: false, top: 0 });
          }}
          onOpenTypeMenu={(pos, anchorRect) => {
            setTypeMenuState({
              isOpen: true,
              pos,
              anchorRect,
            });
          }}
        />
        <BlockTypeMenu
          editor={editor}
          pos={typeMenuState.pos}
          anchorRect={typeMenuState.anchorRect}
          isOpen={typeMenuState.isOpen}
          onClose={() => {
            setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
            setDragState((prev) => ({ ...prev, visible: false }));
          }}
        />
        <BubbleToolbar
          editor={editor}
          isDragging={dragState.isDragging}
          isTypeMenuOpen={typeMenuState.isOpen}
        />
        <TableBubbleMenu
          editor={editor}
          isDragging={dragState.isDragging}
          isTypeMenuOpen={typeMenuState.isOpen}
        />
        <CalloutBubbleMenu
          editor={editor}
          isDragging={dragState.isDragging}
          isTypeMenuOpen={typeMenuState.isOpen}
        />
        <EditorContent editor={editor} className={styles.editorContent} />
        <DrawIOModal
          isOpen={drawioModalState.isOpen}
          initialXml={drawioModalState.initialXml}
          onSave={handleSaveDrawIO}
          onClose={() => setDrawioModalState((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }
);

DocEditor.displayName = 'DocEditor';
