import { useImperativeHandle, type ForwardedRef } from 'react';
import type { Editor } from '@tiptap/react';
import type { DocEditorRef, DocumentNode, BlockNode } from '../types';

export function useDocEditorRef(ref: ForwardedRef<DocEditorRef>, editor: Editor | null) {
  useImperativeHandle(
    ref,
    () => ({
      getTitle: (): string => {
        if (!editor) return '';
        const firstNode = editor.state.doc.firstChild;
        return firstNode && firstNode.type.name === 'title' ? firstNode.textContent : '';
      },
      setTitle: (titleText: string) => {
        if (!editor) return;
        const firstNode = editor.state.doc.firstChild;
        if (firstNode && firstNode.type.name === 'title') {
          const titleStart = 1;
          const titleEnd = firstNode.nodeSize - 1;
          editor.chain().focus().insertContentAt({ from: titleStart, to: titleEnd }, titleText).run();
        }
      },
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
}
