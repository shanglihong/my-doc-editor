import { describe, it, expect } from 'vitest';
import { CALLOUT_THEMES } from '../components/DocEditor/utils/defaultTheme';
import { CalloutExtension } from '../components/DocEditor/extensions/CalloutExtension';

describe('CalloutExtension (T014)', () => {
  it('应当包含 8+ 种预设极简主题', () => {
    expect(CALLOUT_THEMES.length).toBeGreaterThanOrEqual(8);
  });

  it('应当提供正确的 Callout Node 组名与配置', () => {
    expect(CalloutExtension.name).toBe('callout');
  });
});
