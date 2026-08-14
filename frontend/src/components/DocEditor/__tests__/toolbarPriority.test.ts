// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { CustomTableCell, CustomTableHeader } from '../extensions/CustomTableExtensions';
import { CalloutExtension } from '../extensions/CalloutExtension';
import { ImageBlockExtension } from '../extensions/ImageBlock/ImageBlockExtension';
import { getActiveToolbarInfo } from '../utils/toolbarPriority';

describe('toolbarPriority - getActiveToolbarInfo 层级调度算法', () => {
  it('当 editor 为 null 时，应当返回 { type: null, depth: -1 }', () => {
    const result = getActiveToolbarInfo(null);
    expect(result).toEqual({ type: null, depth: -1 });
  });

  it('普通空段落光标时，应当返回 { type: null, depth: -1 }', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Hello world</p>',
    });

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBeNull();
    editor.destroy();
  });

  it('选中文本时，应当优先返回 type: "text"', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Hello world</p>',
    });

    // 选中文本 "Hello"
    editor.chain().setTextSelection({ from: 1, to: 6 }).run();

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('text');
    editor.destroy();
  });

  it('在 Callout 高亮块内部光标时，应当返回 type: "callout"', () => {
    const editor = new Editor({
      extensions: [StarterKit, CalloutExtension],
      content: '<div data-type="callout"><p>Inside callout</p></div>',
    });

    editor.chain().focus(3).run();

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('callout');
    editor.destroy();
  });

  it('在 Callout 内部选中文本时，由于文本选区层级更深，应当优先返回 type: "text"', () => {
    const editor = new Editor({
      extensions: [StarterKit, CalloutExtension],
      content: '<div data-type="callout"><p>Inside callout</p></div>',
    });

    // 选中 Callout 内部段落的文字
    editor.chain().setTextSelection({ from: 3, to: 8 }).run();

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('text');
    editor.destroy();
  });

  it('在 Table 嵌套内部时，应当返回 type: "table"', () => {
    const editor = new Editor({
      extensions: [StarterKit, Table, TableRow, CustomTableHeader, CustomTableCell],
      content: '<table><tr><td><p>Cell text</p></td></tr></table>',
    });

    editor.chain().focus(5).run();

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('table');
    editor.destroy();
  });

  it('在 Callout 内部嵌套 Table 时，由于 Table 层级更深，应当优先返回 type: "table" 而非 "callout"', () => {
    const editor = new Editor({
      extensions: [StarterKit, CalloutExtension, Table, TableRow, CustomTableHeader, CustomTableCell],
      content: '<div data-type="callout"><table><tr><td><p>Cell text inside callout</p></td></tr></table></div>',
    });

    editor.chain().focus(6).run();

    const result = getActiveToolbarInfo(editor);
    expect(result.type).toBe('table');
    editor.destroy();
  });
});
