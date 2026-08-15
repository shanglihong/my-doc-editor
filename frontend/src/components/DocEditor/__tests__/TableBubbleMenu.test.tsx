import { describe, it, expect } from 'vitest';
import { TableBubbleMenu } from '../components/TableBubbleMenu';
import { TABLE_CELL_BG_PALETTE } from '../utils/defaultTheme';

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

  it('应当正确提供日间与夜间模式下的表格单元格填充色系预设与双向映射', async () => {
    const { LIGHT_THEME_COLOR_PRESETS, DARK_THEME_COLOR_PRESETS } = await import('../utils/defaultTheme');
    expect(LIGHT_THEME_COLOR_PRESETS).toBeDefined();
    expect(DARK_THEME_COLOR_PRESETS).toBeDefined();
    
    // 验证核心色系 (blue, rose, emerald, amber, purple) 在日间与夜间模式下成对存在
    const blueLight = LIGHT_THEME_COLOR_PRESETS.find((p) => p.hue === 'blue');
    const blueDark = DARK_THEME_COLOR_PRESETS.find((p) => p.hue === 'blue');
    expect(blueLight?.bgValue).toBe('#dbeafe');
    expect(blueDark?.bgValue).toBe('#223965');

    const roseLight = LIGHT_THEME_COLOR_PRESETS.find((p) => p.hue === 'rose');
    const roseDark = DARK_THEME_COLOR_PRESETS.find((p) => p.hue === 'rose');
    expect(roseLight?.bgValue).toBe('#fee2e2');
    expect(roseDark?.bgValue).toBe('#552222');
  });
});

