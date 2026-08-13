import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import styles from './DocEditor.module.css';
import type { DocEditorProps, DocEditorRef, DocumentNode, BlockNode, DrawIOModalState } from './types';
import { FontSizeMark } from './extensions/FontSizeMark';
import { DragHandlePlugin } from './extensions/DragHandlePlugin';
import { CalloutExtension } from './extensions/CalloutExtension';
import { DrawIOExtension } from './extensions/DrawIOExtension';
import { DrawIOModal } from './components/DrawIO/DrawIOModal';
import { SlashMenuExtension } from './components/SlashMenu/SlashMenuPlugin';
import { BubbleToolbar } from './components/BubbleToolbar';
import { DragHandleUI } from './components/DragHandle';

import { BlockTypeMenu } from './components/BlockTypeMenu';

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

    useEffect(() => {
      const handleOpenModal = (e: Event) => {
        const customEvent = e as CustomEvent;
        setDrawioModalState({
          isOpen: true,
          initialXml: customEvent.detail?.xml || '',
          nodePos: customEvent.detail?.nodePos ?? null,
        });
      };

      window.addEventListener('OPEN_DRAWIO_MODAL', handleOpenModal);
      return () => {
        window.removeEventListener('OPEN_DRAWIO_MODAL', handleOpenModal);
      };
    }, []);

    const handleSaveDrawIO = (xml: string, svg: string) => {
      if (!editor || drawioModalState.nodePos === null) return;
      editor
        .chain()
        .focus()
        .setNodeSelection(drawioModalState.nodePos)
        .updateAttributes('drawioBlock', { xml, svg })
        .run();
    };

    const editor = useEditor({
      editable: !readOnly,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          dropcursor: false,
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
        TableHeader,
        TableCell,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        FontSizeMark,
        CalloutExtension,
        DrawIOExtension,
        SlashMenuExtension,
        DragHandlePlugin.configure({
          onNodeChange: (data) => {
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
          },
        }),
      ],
      content: typeof value === 'string' ? value : undefined,
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

    return (
      <div
        className={`${styles.editorContainer} ${className}`}
        onMouseLeave={() => {
          setDragState((prev) => ({ ...prev, visible: false }));
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

          // 算法：归一化 N+1 个绝对线位置插槽
          if (mouseY < blocks[0].getBoundingClientRect().top + blocks[0].getBoundingClientRect().height / 2) {
            // 插槽 0: 第一个 Block 顶部
            calculatedLineTop = blocks[0].getBoundingClientRect().top - containerRect.top;
          } else if (
            mouseY >=
            blocks[blocks.length - 1].getBoundingClientRect().top +
              blocks[blocks.length - 1].getBoundingClientRect().height / 2
          ) {
            // 插槽 N: 最后一个 Block 底部
            calculatedLineTop = blocks[blocks.length - 1].getBoundingClientRect().bottom - containerRect.top;
          } else {
            // 插槽 1 ~ N-1: 相邻 Block 缝隙间，统一归一化吸附在下一个 Block 的顶端 (next.top)
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
          setDragState((prev) => ({ ...prev, isDragging: false }));
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
          visible={dragState.visible}
          nodeType={dragState.nodeType}
          nodeLevel={dragState.nodeLevel}
          isEmpty={dragState.isEmpty}
          onMouseDown={() => setTypeMenuState((prev) => ({ ...prev, isOpen: false }))}
          onDragStart={() => {
            setTypeMenuState((prev) => ({ ...prev, isOpen: false }));
            setDragState((prev) => ({ ...prev, isDragging: true }));
          }}
          onDragEnd={() => {
            setDragState((prev) => ({ ...prev, isDragging: false }));
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
          onClose={() => setTypeMenuState((prev) => ({ ...prev, isOpen: false }))}
        />
        <BubbleToolbar editor={editor} isDragging={dragState.isDragging} />
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
