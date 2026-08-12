import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DrawIOView } from '../components/DrawIO/DrawIOView';

export interface DrawIOOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    drawioBlock: {
      /**
       * 插入一个 draw.io 绘图块
       */
      insertDrawIO: (attributes?: { xml?: string; svg?: string }) => ReturnType;
    };
  }
}

export const DrawIOExtension = Node.create<DrawIOOptions>({
  name: 'drawioBlock',

  group: 'block',

  selectable: true,

  draggable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      xml: {
        default: '',
      },
      svg: {
        default: '',
      },
      alignment: {
        default: 'center',
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="drawio-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'drawio-block',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawIOView);
  },

  addCommands() {
    return {
      insertDrawIO:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
