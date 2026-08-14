// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { TextSelection } from '@tiptap/pm/state';
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

  it('在高亮块等 Hover 节点存在时，非空 TextSelection 应当优先返回 text 工具栏类型', () => {
    // 模拟鼠标悬停在高亮块 (Callout) 容器上
    hoverStackManager.register({
      id: 'callout-10',
      type: 'callout',
      depth: 1,
      nodePos: 10,
    });

    const mockTextSelection = {
      empty: false,
      from: 12,
      to: 18,
      $anchor: { depth: 2 },
    };

    // 使用 TextSelection.prototype 模拟 instanceof 判断
    Object.setPrototypeOf(mockTextSelection, TextSelection.prototype);

    const mockEditor: any = {
      isEditable: true,
      state: { selection: mockTextSelection },
      isActive: (name: string) => name === 'callout',
    };

    // 在高亮块内部框选中文本时，应当优先弹出 text 工具栏 (BubbleToolbar)
    const info = getActiveToolbarInfo(mockEditor);
    expect(info.type).toBe('text');

    // 当选区变为空时，应当平滑恢复显示 callout 块级工具栏
    mockTextSelection.empty = true;
    mockTextSelection.from = 12;
    mockTextSelection.to = 12;

    const infoEmpty = getActiveToolbarInfo(mockEditor);
    expect(infoEmpty.type).toBe('callout');
  });
});
