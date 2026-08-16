import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CalloutView } from '../components/Callout/CalloutView';

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: {
        icon?: string;
        iconType?: 'lucide' | 'emoji';
        themeColor?: string;
        customBg?: string;
        customBorder?: string;
        backgroundColor?: string;
        borderColor?: string;
      }) => ReturnType;
      toggleCallout: (attributes?: {
        icon?: string;
        iconType?: 'lucide' | 'emoji';
        themeColor?: string;
        customBg?: string;
        customBorder?: string;
        backgroundColor?: string;
        borderColor?: string;
      }) => ReturnType;
    };
  }
}

export const CalloutExtension = Node.create<CalloutOptions>({
  name: 'callout',

  group: 'block',

  content: 'block+',

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      icon: {
        default: 'Info',
      },
      iconType: {
        default: 'lucide',
      },
      themeColor: {
        default: 'blue',
      },
      customBg: {
        default: null,
      },
      customBorder: {
        default: null,
      },
      backgroundColor: {
        default: '#dbeafe',
      },
      borderColor: {
        default: '#93c5fd',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'callout' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes);
        },
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes);
        },
    };
  },
});
