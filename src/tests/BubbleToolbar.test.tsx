import { describe, it, expect } from 'vitest';
import { FONT_SIZES, COLOR_PALETTE, HIGHLIGHT_PALETTE } from '../components/DocEditor/utils/defaultTheme';

describe('BubbleToolbar & DefaultTheme Settings (T007)', () => {
  it('应当包含符合排版规范的默认字号集合', () => {
    expect(FONT_SIZES).toHaveLength(7);
    expect(FONT_SIZES.map((f) => f.value)).toContain('16px');
  });

  it('应当提供正确的极简文字前景色与高亮调色盘选项', () => {
    expect(COLOR_PALETTE.length).toBeGreaterThanOrEqual(8);
    expect(HIGHLIGHT_PALETTE.length).toBeGreaterThanOrEqual(7);
  });
});
