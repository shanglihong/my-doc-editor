// @vitest-environment jsdom
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlockTypeMenu } from '../components/BlockTypeMenu';

describe('BlockTypeMenu 块类型切换菜单', () => {
  const createMockEditor = (selection = { from: 1, to: 1 }) => {
    const mockRun = vi.fn();
    const mockSetTextSelection = vi.fn().mockReturnValue({ run: mockRun });
    const mockToggleHeading = vi.fn().mockReturnValue({ run: mockRun });

    const mockFocus = vi.fn().mockReturnValue({
      setTextSelection: mockSetTextSelection,
      setParagraph: vi.fn().mockReturnValue({ run: mockRun }),
      toggleHeading: mockToggleHeading,
      toggleBulletList: vi.fn().mockReturnValue({ run: mockRun }),
      toggleOrderedList: vi.fn().mockReturnValue({ run: mockRun }),
      toggleTaskList: vi.fn().mockReturnValue({ run: mockRun }),
      toggleBlockquote: vi.fn().mockReturnValue({ run: mockRun }),
    });

    const mockChainObj = {
      focus: mockFocus,
    };

    return {
      state: {
        selection,
        doc: {
          content: { size: 100 },
          resolve: vi.fn().mockReturnValue({
            parent: { isTextblock: true },
          }),
          nodeAt: vi.fn().mockReturnValue({ nodeSize: 10, toJSON: () => ({ type: 'paragraph' }) }),
          nodesBetween: vi.fn(),
        },
      },
      chain: vi.fn().mockReturnValue(mockChainObj),
      view: {
        dom: {
          closest: () => null,
        },
      },
      _mockSetTextSelection: mockSetTextSelection,
      _mockToggleHeading: mockToggleHeading,
    } as any;
  };

  it('当 isOpen 为 false 时不渲染', () => {
    const mockEditor = createMockEditor();
    const { container } = render(
      <BlockTypeMenu
        editor={mockEditor}
        pos={0}
        anchorRect={new DOMRect(100, 100, 20, 20)}
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('当选区已在 Block 内部时，保留原有选区直接触发类型转换', () => {
    // 选区在 6~8，目标 Block 位置 5，节点大小 10 (即范围 5~15)
    const mockEditor = createMockEditor({ from: 6, to: 8 });
    const handleClose = vi.fn();

    const { container } = render(
      <BlockTypeMenu
        editor={mockEditor}
        pos={5}
        nodeSize={10}
        nodeType="paragraph"
        anchorRect={new DOMRect(100, 100, 20, 20)}
        isOpen={true}
        onClose={handleClose}
      />
    );

    const headingBtn = container.querySelector('button[title="一级标题"]') as HTMLButtonElement;
    expect(headingBtn).not.toBeNull();
    fireEvent.click(headingBtn);

    // 因为选区已在 Block 内部，不重新设置选区
    expect(mockEditor._mockSetTextSelection).not.toHaveBeenCalled();
    expect(mockEditor._mockToggleHeading).toHaveBeenCalledWith({ level: 1 });
    expect(handleClose).toHaveBeenCalled();
  });

  it('当选区不在 Block 内部时，更新选区到目标 Block 内部 (pos + 1)', () => {
    // 选区在 0~0 (外部)，目标 Block 位置 5
    const mockEditor = createMockEditor({ from: 0, to: 0 });
    const handleClose = vi.fn();

    const { container } = render(
      <BlockTypeMenu
        editor={mockEditor}
        pos={5}
        nodeSize={10}
        nodeType="paragraph"
        anchorRect={new DOMRect(100, 100, 20, 20)}
        isOpen={true}
        onClose={handleClose}
      />
    );

    const headingBtn = container.querySelector('button[title="一级标题"]') as HTMLButtonElement;
    expect(headingBtn).not.toBeNull();
    fireEvent.click(headingBtn);

    // 选区不在 Block 内部，调用 setTextSelection(6)
    expect(mockEditor._mockSetTextSelection).toHaveBeenCalledWith(6);
    expect(mockEditor._mockToggleHeading).toHaveBeenCalledWith({ level: 1 });
    expect(handleClose).toHaveBeenCalled();
  });
});
