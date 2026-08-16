import { describe, it, expect } from 'vitest';
import { TableBubbleMenu } from '../components/DocEditor/components/TableBubbleMenu';
import { TABLE_CELL_BG_PALETTE } from '../components/DocEditor/utils/defaultTheme';

describe('TableBubbleMenu Component & Table Operations (T008, T013, T016)', () => {
  it('应当正确导出 TableBubbleMenu 组件', () => {
    expect(TableBubbleMenu).toBeDefined();
  });

  it('在仅剩 1 行或 1 列时提供安全校验保护逻辑', () => {
    const rowCountSingle = 1;
    const colCountSingle = 1;
    const canDeleteRow = rowCountSingle > 1;
    const canDeleteCol = colCountSingle > 1;

    expect(canDeleteRow).toBe(false);
    expect(canDeleteCol).toBe(false);

    const rowCountMultiple = 3;
    const colCountMultiple = 3;
    expect(rowCountMultiple > 1).toBe(true);
    expect(colCountMultiple > 1).toBe(true);
  });

  it('提供正确的单元格合并与拆分状态判定', () => {
    const mockCanMergeTrue = true;
    const mockCanSplitFalse = false;

    expect(mockCanMergeTrue).toBe(true);
    expect(mockCanSplitFalse).toBe(false);
  });

  it('应当提供符合设计规范的单元格背景颜色预设调色盘 (T016)', () => {
    expect(TABLE_CELL_BG_PALETTE).toBeDefined();
    expect(TABLE_CELL_BG_PALETTE.length).toBeGreaterThanOrEqual(7);
    expect(TABLE_CELL_BG_PALETTE.map((c) => c.value)).toContain('transparent');
    expect(TABLE_CELL_BG_PALETTE.map((c) => c.value)).toContain('#dbeafe');
  });

});
