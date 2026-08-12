import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ExcalidrawView } from '../components/Excalidraw/ExcalidrawView';

export interface ExcalidrawOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    excalidraw: {
      insertExcalidraw: (attributes?: {
        elements?: Array<Record<string, any>>;
        appState?: Record<string, any>;
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const ExcalidrawExtension = Node.create<ExcalidrawOptions>({
  name: 'excalidraw',

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      elements: {
        default: [],
      },
      appState: {
        default: {},
      },
      caption: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="excalidraw"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'excalidraw' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExcalidrawView);
  },

  addCommands() {
    return {
      insertExcalidraw:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
