import { Node, mergeAttributes } from '@tiptap/core';

export interface TitleOptions {
  HTMLAttributes: Record<string, any>;
}

export const TitleExtension = Node.create<TitleOptions>({
  name: 'title',

  content: 'inline*',

  group: '',

  defining: true,

  selectable: false,

  parseHTML() {
    return [
      {
        tag: 'h1.doc-title-node',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['h1', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'doc-title-node' }), 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state } = this.editor.view;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === 'title') {
          const titleEndPos = $from.end($from.depth);
          const nextPos = titleEndPos + 1;

          if (nextPos < state.doc.content.size) {
            this.editor.commands.setTextSelection(nextPos + 1);
          } else {
            this.editor.chain().insertContentAt(titleEndPos, { type: 'paragraph' }).focus(titleEndPos + 2).run();
          }
          return true;
        }
        return false;
      },
      Backspace: () => {
        const { selection } = this.editor.state;
        const { $from, empty } = selection;

        if ($from.parent.type.name === 'title') {
          if ($from.parentOffset === 0 && empty) {
            return true;
          }
        }
        return false;
      },
    };
  },
});
