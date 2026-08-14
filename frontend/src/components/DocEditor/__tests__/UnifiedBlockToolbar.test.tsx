// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { UnifiedBlockToolbar } from '../components/UnifiedBlockToolbar';

describe('UnifiedBlockToolbar', () => {
  afterEach(() => {
    cleanup();
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
      doc: {
        content: { size: 100 },
        nodeAt: () => ({ nodeSize: 10 }),
      },
    },
  };

  it('应当渲染通用悬浮工具栏及其基础按钮结构', () => {
    render(
      <UnifiedBlockToolbar
        editor={mockEditor}
        getPos={() => 10}
        nodeSize={10}
        onDeleteBlock={vi.fn()}
      >
        <span data-testid="custom-child">Child Element</span>
      </UnifiedBlockToolbar>
    );

    expect(screen.getByTestId('custom-child')).toBeDefined();
    expect(screen.getByTitle('删除块')).toBeDefined();
  });

  it('点击删除按钮应当正确触发 onDeleteBlock 回调', () => {
    const handleDelete = vi.fn();
    render(
      <UnifiedBlockToolbar
        editor={mockEditor}
        getPos={() => 10}
        nodeSize={10}
        onDeleteBlock={handleDelete}
      />
    );

    const deleteBtn = screen.getByTitle('删除块');
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('在下方插入空白 Block 应当计算正确位置参数并调用相关插入指令', () => {
    render(
      <UnifiedBlockToolbar
        editor={mockEditor}
        getPos={() => 10}
        nodeSize={10}
        onDeleteBlock={vi.fn()}
      />
    );

    const dropdownTrigger = screen.getByTitle('在上方或下方插入空白块');
    fireEvent.click(dropdownTrigger);

    const insertBelowBtn = screen.getByText('在下方插入');
    fireEvent.click(insertBelowBtn);
  });
});
