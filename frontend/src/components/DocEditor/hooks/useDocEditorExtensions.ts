import { useMemo } from 'react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { createLowlight, all } from 'lowlight';
import { Markdown } from 'tiptap-markdown';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

import { CustomTableCell, CustomTableHeader } from '../extensions/CustomTableExtensions';
import { DocumentTitleExtension } from '../extensions/DocumentTitleExtension';
import { TitleExtension } from '../extensions/TitleExtension';
import { FontSizeMark } from '../extensions/FontSizeMark';
import { DragHandlePlugin } from '../extensions/DragHandlePlugin';
import { DoubleTapInsertPlugin } from '../extensions/DoubleTapInsertPlugin';
import { CalloutExtension } from '../extensions/CalloutExtension';
import { DrawIOExtension } from '../extensions/DrawIOExtension';
import { ImageBlockExtension } from '../extensions/ImageBlockExtension';
import { SlashMenuExtension } from '../components/SlashMenu/SlashMenuPlugin';
import { CodeBlockComponent } from '../components/CodeBlock/CodeBlockComponent';

const lowlight = createLowlight(all);

export interface UseDocEditorExtensionsOptions {
  titlePlaceholder: string;
  placeholder: string;
  onDragNodeChange: (data: {
    top: number;
    left: number;
    pos: number;
    nodeType?: string;
    nodeLevel?: number;
    isEmpty?: boolean;
  } | null) => void;
}

export function useDocEditorExtensions({
  titlePlaceholder,
  placeholder,
  onDragNodeChange,
}: UseDocEditorExtensionsOptions) {
  return useMemo(() => {
    return [
      DocumentTitleExtension,
      TitleExtension,
      StarterKit.configure({
        document: false,
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
        types: ['heading', 'paragraph', 'title'],
      }),
      Placeholder.configure({
        placeholder: ({ node }: { node: any }) => {
          if (node.type.name === 'title') {
            return titlePlaceholder;
          }
          if (node.type.name === 'codeBlock') {
            return '';
          }
          if (node.type.name === 'heading') {
            return `标题 ${node.attrs?.level || 1}`;
          }
          return placeholder;
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
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      DoubleTapInsertPlugin,
      DragHandlePlugin.configure({
        onNodeChange: onDragNodeChange,
      }),
    ];
  }, [titlePlaceholder, placeholder, onDragNodeChange]);
}
