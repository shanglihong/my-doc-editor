// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { FloatingBlockTool } from '../components/FloatingBlockTool';
import { hoverStackManager } from '../utils/toolbarPriority';

describe('FloatingBlockTool', () => {
  afterEach(() => {
    cleanup();
    hoverStackManager.clear();
  });

  const mockEditor: any = {
    chain: () => ({
      focus: () => ({
        insertContentAt: () => ({
          run: () => true,
        }),
      }),
    }),
    state: {
      selection: {},
      doc: {
        content: { size: 100 },
        nodeAt: () => ({ type: { name: 'callout' }, nodeSize: 10 }),
        resolve: () => ({
          depth: 1,
          node: () => ({ type: { name: 'callout' }, nodeSize: 10 }),
          before: () => 0,
        }),
      },
    },
    isActive: (type: string) => type === 'callout',
    on: vi.fn(),
    off: vi.fn(),
    view: {
      domAtPos: () => ({ node: document.createElement('div') }),
      nodeDOM: () => document.createElement('div'),
      dom: document.createElement('div'),
    },
  };

  it('在无激活选区及未悬停状态下不应当无故渲染', () => {
    const { container } = render(
      <FloatingBlockTool
        editor={{ ...mockEditor, isActive: () => false }}
        blockType="callout"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('当匹配 Hover 悬停并激活 Block 时应当渲染 Block Tool 及其定制插槽', () => {
    // 模拟 HoverStackManager 挂载节点
    hoverStackManager.register({
      id: 'callout-0',
      type: 'callout',
      depth: 1,
      nodePos: 0,
      domElement: document.createElement('div'),
    });

    render(
      <FloatingBlockTool editor={mockEditor} blockType="callout">
        <span data-testid="custom-action-btn">Custom Action</span>
      </FloatingBlockTool>
    );

    expect(screen.getByTestId('custom-action-btn')).toBeDefined();
  });
});
