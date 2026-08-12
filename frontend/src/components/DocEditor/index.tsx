import { forwardRef, useImperativeHandle, useState } from 'react';
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
import type { DocEditorProps, DocEditorRef, DocumentNode, BlockNode } from './types';
import { FontSizeMark } from './extensions/FontSizeMark';
import { DragHandlePlugin } from './extensions/DragHandlePlugin';
import { CalloutExtension } from './extensions/CalloutExtension';
import { ExcalidrawExtension } from './extensions/ExcalidrawExtension';
import { SlashMenuExtension } from './components/SlashMenu/SlashMenuPlugin';
import { BubbleToolbar } from './components/BubbleToolbar';
import { DragHandleUI } from './components/DragHandle';

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
    const [dragState, setDragState] = useState<{ visible: boolean; top: number }>({
      visible: false,
      top: 0,
    });

    const editor = useEditor({
      editable: !readOnly,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
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
        ExcalidrawExtension,
        SlashMenuExtension,
        DragHandlePlugin.configure({
          onNodeChange: (data) => {
            if (data) {
              setDragState({ visible: true, top: data.top });
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
      <div className={`${styles.editorContainer} ${className}`}>
        <DragHandleUI top={dragState.top} visible={dragState.visible} />
        <BubbleToolbar editor={editor} />
        <EditorContent editor={editor} className={styles.editorContent} />
      </div>
    );
  }
);

DocEditor.displayName = 'DocEditor';
