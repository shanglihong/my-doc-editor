import { describe, it, expect } from 'vitest';
import { CalloutBubbleMenu } from '../components/Callout/CalloutBubbleMenu';
import { UnifiedColorPicker } from '../components/ColorPicker/UnifiedColorPicker';
import { UNIFIED_COLOR_SYSTEM } from '../utils/defaultTheme';

describe('CalloutBubbleMenu & UnifiedColorPicker Components', () => {
  it('应当正确导出 CalloutBubbleMenu 与 UnifiedColorPicker 组件', () => {
    expect(CalloutBubbleMenu).toBeDefined();
    expect(UnifiedColorPicker).toBeDefined();
  });

  it('应当包含完整的三级明度色彩体系 UNIFIED_COLOR_SYSTEM', () => {
    expect(UNIFIED_COLOR_SYSTEM).toBeDefined();
    expect(UNIFIED_COLOR_SYSTEM.textColor).toHaveLength(8);
    expect(UNIFIED_COLOR_SYSTEM.backgroundColor).toHaveLength(8);
    expect(UNIFIED_COLOR_SYSTEM.borderColor).toHaveLength(8);
  });

  it('每个色系分类下应当包含浅、中、正常三个明度梯度', () => {
    const blueGroup = UNIFIED_COLOR_SYSTEM.backgroundColor.find((g) => g.hue === 'blue');
    expect(blueGroup).toBeDefined();
    expect(blueGroup?.shades.light.tier).toBe('light');
    expect(blueGroup?.shades.medium.tier).toBe('medium');
    expect(blueGroup?.shades.normal.tier).toBe('normal');

    expect(blueGroup?.shades.light.value).toBe('#eff6ff');
    expect(blueGroup?.shades.medium.value).toBe('#dbeafe');
    expect(blueGroup?.shades.normal.value).toBe('#93c5fd');
  });

  it('边框颜色分类应当包含正确的默认浅、中、正常色阶', () => {
    const emeraldGroup = UNIFIED_COLOR_SYSTEM.borderColor.find((g) => g.hue === 'emerald');
    expect(emeraldGroup).toBeDefined();
    expect(emeraldGroup?.shades.light.value).toBe('#bbf7d0');
    expect(emeraldGroup?.shades.medium.value).toBe('#86efac');
    expect(emeraldGroup?.shades.normal.value).toBe('#22c55e');
  });
});
