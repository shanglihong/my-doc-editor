// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { CustomTableCell, CustomTableHeader } from '../extensions/CustomTableExtensions';
import { CalloutExtension } from '../extensions/CalloutExtension';
import { getActiveToolbarInfo, hoverStackManager } from '../utils/toolbarPriority';

describe('toolbarPriority - getActiveToolbarInfo 层级调度算法', () => {
  beforeEach(() => {
    hoverStackManager.clear();
  });

  it('当 editor 为 null 时，应当返回 { type: null, depth: -1 }', () => {
    const result = getActiveToolbarInfo(null);
    expect(result).toEqual({ type: null, depth: -1 });
  });

  it('普通空段落光标且无悬浮时，应当返回 { type: null, depth: -1 }', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Hello world</p>',
    });

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBeNull();
    editor.destroy();
  });

  it('使用 hoverStackManager 注册单个悬停 Block 时，应当优先选中', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Hello world</p>',
    });

    hoverStackManager.register({
      id: 'block-1',
      type: 'image',
      depth: 1,
    });

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('image');
    expect(result.target?.id).toBe('block-1');

    editor.destroy();
  });

  it('嵌套悬停测试：当同时注册 Callout (depth:1) 与 Callout 内 Table (depth:2) 时，优先选择 depth 更大的 Table', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Hello world</p>',
    });

    hoverStackManager.register({
      id: 'callout-outer',
      type: 'callout',
      depth: 1,
    });

    hoverStackManager.register({
      id: 'table-inner',
      type: 'table',
      depth: 2,
    });

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('table');
    expect(result.target?.id).toBe('table-inner');

    // 注销 inner Table 之后，应当退回 outer Callout
    hoverStackManager.unregister('table-inner', 0);
    const resultAfterUnregister = getActiveToolbarInfo(editor);
    expect(resultAfterUnregister.type).toBe('callout');
    expect(resultAfterUnregister.target?.id).toBe('callout-outer');

    editor.destroy();
  });
});
