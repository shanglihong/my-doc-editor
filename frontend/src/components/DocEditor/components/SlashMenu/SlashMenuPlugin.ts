import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import { SlashMenu } from './index';
import { calculateSmartPosition } from '../../utils/floatingPosition';

export interface SlashMenuItem {
  title: string;
  description: string;
  iconName: string;
  command: (props: { editor: any; range: any }) => void;
}

export const getSlashMenuItems = (): SlashMenuItem[] => [
  {
    title: '一级标题',
    description: '高亮大标题，构建主要大纲结构',
    iconName: 'Heading1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: '二级标题',
    description: '中等标题，区分不同讨论模块',
    iconName: 'Heading2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: '三级标题',
    description: '小标题，罗列具体子项目内容',
    iconName: 'Heading3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: '无序列表',
    description: '创建简单清晰的无序列表项',
    iconName: 'List',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: '有序列表',
    description: '创建带编号的顺序步骤清单',
    iconName: 'ListOrdered',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: '表格',
    description: '插入 3x3 极简卡片风格数据表格',
    iconName: 'Table',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    title: '代码块',
    description: '插入支持多语言高亮的代码段落',
    iconName: 'Code',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  },
  {
    title: '引用块',
    description: '插入强调式观点或参考文案',
    iconName: 'Quote',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: '分割线',
    description: '插入分割线切分章节',
    iconName: 'Minus',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: '高亮容器',
    description: '插入带图标与多主题高亮块，可内嵌子块',
    iconName: 'Info',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout().run();
    },
  },
  {
    title: 'DrawIO 图表',
    description: '插入流程图、架构图与专业矢量图表',
    iconName: 'Workflow',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertDrawIO().run();
    },
  },
];

export const SlashMenuExtension = Extension.create({
  name: 'slashMenu',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          return getSlashMenuItems().filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer<any> | null = null;

          return {
            onStart: (props: any) => {
              window.dispatchEvent(new CustomEvent('SLASH_MENU_CHANGE', { detail: { isOpen: true } }));
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              document.body.appendChild(component.element);
              const rect = props.clientRect?.();
              if (rect && component.element) {
                const menuHeight = component.element.offsetHeight || 300;
                const menuWidth = component.element.offsetWidth || 280;
                const pos = calculateSmartPosition({
                  targetRect: rect,
                  menuWidth,
                  menuHeight,
                  preferredPlacement: 'bottom',
                  offset: 6,
                  isFixed: true,
                });
                component.element.style.position = 'fixed';
                component.element.style.left = `${pos.left}px`;
                component.element.style.top = `${pos.top}px`;
                component.element.style.zIndex = '99999';
              }
            },

            onUpdate(props: any) {
              component?.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              const rect = props.clientRect();
              if (rect && component?.element) {
                const menuHeight = component.element.offsetHeight || 300;
                const menuWidth = component.element.offsetWidth || 280;
                const pos = calculateSmartPosition({
                  targetRect: rect,
                  menuWidth,
                  menuHeight,
                  preferredPlacement: 'bottom',
                  offset: 6,
                  isFixed: true,
                });
                component.element.style.position = 'fixed';
                component.element.style.left = `${pos.left}px`;
                component.element.style.top = `${pos.top}px`;
                component.element.style.zIndex = '99999';
              }
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                window.dispatchEvent(new CustomEvent('SLASH_MENU_CHANGE', { detail: { isOpen: false } }));
                if (component?.element) {
                  component.element.remove();
                }
                component?.destroy();
                return true;
              }

              return (component?.ref as any)?.onKeyDown?.(props) || false;
            },

            onExit() {
              window.dispatchEvent(new CustomEvent('SLASH_MENU_CHANGE', { detail: { isOpen: false } }));
              if (component?.element) {
                component.element.remove();
              }
              component?.destroy();
            },
          };
        },
      } as Partial<SuggestionOptions>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
