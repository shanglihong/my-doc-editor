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
  category: 'text' | 'non-text';
  command: (props: { editor: any; range: any }) => void;
}

export const getSlashMenuItems = (): SlashMenuItem[] => [
  {
    title: '一级标题',
    description: '高亮大标题，构建主要大纲结构',
    iconName: 'Heading1',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: '二级标题',
    description: '中等标题，区分不同讨论模块',
    iconName: 'Heading2',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: '三级标题',
    description: '小标题，罗列具体子项目内容',
    iconName: 'Heading3',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: '无序列表',
    description: '创建简单清晰的无序列表项',
    iconName: 'List',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: '有序列表',
    description: '创建带编号的顺序步骤清单',
    iconName: 'ListOrdered',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: '待办列表',
    description: '创建带复选框的待办任务清单',
    iconName: 'CheckSquare',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: '引用块',
    description: '插入强调式观点或参考文案',
    iconName: 'Quote',
    category: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: '图片',
    description: '选择本地图片生成图片 Block',
    iconName: 'Image',
    category: 'non-text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.dispatchEvent(new CustomEvent('TRIGGER_OPEN_IMAGE_FILE_PICKER'));
    },
  },
  {
    title: '表格',
    description: '插入 3x3 极简卡片风格数据表格',
    iconName: 'Table',
    category: 'non-text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    title: '代码',
    description: '插入支持多语言高亮的代码段落',
    iconName: 'Code',
    category: 'non-text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  },
  {
    title: '画图',
    description: '插入流程图、架构图与专业矢量图表',
    iconName: 'Workflow',
    category: 'non-text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertDrawIO().run();
    },
  },
  {
    title: '高亮块',
    description: '插入带图标与多主题高亮块，可内嵌子块',
    iconName: 'Info',
    category: 'non-text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout().run();
    },
  },
  {
    title: '分割线',
    description: '插入分割线切分章节',
    iconName: 'Minus',
    category: 'non-text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
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
                  align: 'left',
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
                  align: 'left',
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
