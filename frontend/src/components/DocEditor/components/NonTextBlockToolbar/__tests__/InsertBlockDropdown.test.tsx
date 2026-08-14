import { describe, it, expect, vi } from 'vitest';
import { insertParagraphBlockAround } from '../../../utils/blockInsertion';
import { InsertBlockDropdown } from '../InsertBlockDropdown';

describe('blockInsertion & InsertBlockDropdown', () => {
  it('应当导出 InsertBlockDropdown 组件与 insertParagraphBlockAround 工具函数', () => {
    expect(InsertBlockDropdown).toBeDefined();
    expect(insertParagraphBlockAround).toBeDefined();
  });

  it('在没有 editor 或 getPos 无效时，insertParagraphBlockAround 应当安全返回 false', () => {
    const result = insertParagraphBlockAround({
      editor: null as any,
      getPos: () => 10,
      nodeSize: 5,
      direction: 'above',
    });
    expect(result).toBe(false);
  });

  it('当在上方插入时，应当计算正确的坐标 (pos) 并调用 insertContentAt', () => {
    const runMock = vi.fn().mockReturnValue(true);
    const insertContentAtMock = vi.fn().mockReturnValue({ run: runMock });
    const focusMock = vi.fn().mockReturnValue({ insertContentAt: insertContentAtMock });

    const mockEditor: any = {
      chain: () => ({
        focus: focusMock,
      }),
    };

    const result = insertParagraphBlockAround({
      editor: mockEditor,
      getPos: () => 100,
      nodeSize: 20,
      direction: 'above',
    });

    expect(focusMock).toHaveBeenCalled();
    expect(insertContentAtMock).toHaveBeenCalledWith(100, { type: 'paragraph' });
    expect(runMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('当在下方插入时，应当计算正确的坐标 (pos + nodeSize) 并调用 insertContentAt', () => {
    const runMock = vi.fn().mockReturnValue(true);
    const insertContentAtMock = vi.fn().mockReturnValue({ run: runMock });
    const focusMock = vi.fn().mockReturnValue({ insertContentAt: insertContentAtMock });

    const mockEditor: any = {
      chain: () => ({
        focus: focusMock,
      }),
    };

    const result = insertParagraphBlockAround({
      editor: mockEditor,
      getPos: () => 100,
      nodeSize: 20,
      direction: 'below',
    });

    expect(insertContentAtMock).toHaveBeenCalledWith(120, { type: 'paragraph' });
    expect(result).toBe(true);
  });
});
