// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { hoverStackManager, getActiveToolbarInfo } from '../utils/toolbarPriority';

describe('hoverStackManager & getActiveToolbarInfo', () => {
  beforeEach(() => {
    // 单元测试重置管理器状态
    hoverStackManager.clear();
  });

  it('应当正常注册与注销悬浮 Block Target', () => {
    hoverStackManager.register({
      id: 'image-10',
      type: 'image',
      depth: 2,
      nodePos: 10,
    });

    const active = hoverStackManager.getActiveTarget();
    expect(active).not.toBeNull();
    expect(active?.type).toBe('image');
    expect(active?.nodePos).toBe(10);
  });

  it('最高 depth 的节点应当优先抢占为独占 Target', () => {
    hoverStackManager.register({
      id: 'callout-1',
      type: 'callout',
      depth: 1,
      nodePos: 0,
    });

    hoverStackManager.register({
      id: 'table-5',
      type: 'table',
      depth: 2,
      nodePos: 5,
    });

    const active = hoverStackManager.getActiveTarget();
    expect(active?.type).toBe('table');
    expect(active?.id).toBe('table-5');
  });

  it('keepActive 应当保持 Hover 活动并取消离场定时器', () => {
    hoverStackManager.register({
      id: 'drawio-10',
      type: 'drawio',
      depth: 2,
      nodePos: 10,
    });

    hoverStackManager.keepActive();
    expect(hoverStackManager.getActiveTarget()?.type).toBe('drawio');
  });

  it('getActiveToolbarInfo 应当正确根据优先级返回活跃工具栏类型', () => {
    hoverStackManager.register({
      id: 'image-20',
      type: 'image',
      depth: 2,
      nodePos: 20,
    });

    const mockEditor: any = {
      isEditable: true,
      state: { selection: {} },
      isActive: (name: string) => name === 'callout',
    };

    const info = getActiveToolbarInfo(mockEditor, 'image');
    expect(info.type).toBe('image');
  });
});
