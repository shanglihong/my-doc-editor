// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { DocumentTitleExtension } from '../extensions/DocumentTitleExtension';
import { TitleExtension } from '../extensions/TitleExtension';

describe('DocEditor 内置 H1 标题扩展规范测试', () => {
  it('DocumentTitleExtension 属性声明正确', () => {
    expect(DocumentTitleExtension.name).toBe('doc');
    expect(DocumentTitleExtension.config.topNode).toBe(true);
    expect(DocumentTitleExtension.config.content).toBe('title block+');
  });

  it('TitleExtension 节点定义与属性配置正确', () => {
    expect(TitleExtension.name).toBe('title');
    expect(TitleExtension.config.content).toBe('inline*');
    expect(TitleExtension.config.defining).toBe(true);
    expect(TitleExtension.config.selectable).toBe(false);
  });

  it('TitleExtension 键盘拦截注册快捷键', () => {
    const mockEditor = {
      view: {
        state: {
          doc: {
            content: { size: 10 },
          },
          selection: {
            $from: {
              parent: { type: { name: 'title' } },
              end: () => 5,
              parentOffset: 0,
            },
            empty: true,
          },
        },
      },
      state: {
        selection: {
          $from: {
            parent: { type: { name: 'title' } },
            parentOffset: 0,
          },
          empty: true,
        },
      },
      commands: {
        setTextSelection: vi.fn(),
      },
      chain: () => ({
        insertContentAt: () => ({
          focus: () => ({
            run: vi.fn(),
          }),
        }),
      }),
    } as any;

    const shortcuts = TitleExtension.config.addKeyboardShortcuts?.call({
      name: 'title',
      options: { HTMLAttributes: {} },
      storage: {},
      editor: mockEditor,
    } as any);

    expect(shortcuts).toHaveProperty('Enter');
    expect(shortcuts).toHaveProperty('Backspace');

    // 验证退格在标题起始位置时返回 true (阻止默认删除)
    const backspaceResult = shortcuts?.Backspace();
    expect(backspaceResult).toBe(true);

    // 验证回车在标题节点中执行处理逻辑并返回 true
    const enterResult = shortcuts?.Enter();
    expect(enterResult).toBe(true);
  });
});
