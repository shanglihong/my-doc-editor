import { describe, it, expect } from 'vitest';
import { DragHandlePlugin } from '../components/DocEditor/extensions/DragHandlePlugin';

describe('DragHandlePlugin (T008)', () => {
  it('应当正确导出 DragHandlePlugin 扩展对象及其配置', () => {
    expect(DragHandlePlugin.name).toBe('dragHandlePlugin');
    expect(typeof DragHandlePlugin.configure).toBe('function');
  });
});
