// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { DoubleTapInsertPlugin } from '../extensions/DoubleTapInsertPlugin';
import { CalloutExtension } from '../extensions/CalloutExtension';

describe('DoubleTapInsertPlugin - 双击插入空白 Block 扩展', () => {
  it('应当正确导出 DoubleTapInsertPlugin 扩展模块', () => {
    expect(DoubleTapInsertPlugin).toBeDefined();
    expect(DoubleTapInsertPlugin.name).toBe('doubleTapInsert');
  });

  it('在编辑器中双击时能够创建新的空白段落 Block', () => {
    const editor = new Editor({
      extensions: [StarterKit, DoubleTapInsertPlugin],
      content: '<p>First Paragraph</p>',
    });

    const initialChildCount = editor.state.doc.childCount;
    expect(initialChildCount).toBe(1);

    const event = new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 100,
    });

    const view = editor.view;
    view.dom.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(editor.state.doc.childCount).toBe(2);
    editor.destroy();
  });

  it('在高亮块 Callout 内部双击时，应当在 Callout 内部插入新的空白段落 Block', () => {
    const editor = new Editor({
      extensions: [StarterKit, CalloutExtension, DoubleTapInsertPlugin],
    });

    editor.chain().setContent('<p>Callout Content</p>').setTextSelection({ from: 1, to: 10 }).setCallout().run();

    // 此时第一层节点是 callout
    expect(editor.state.doc.firstChild?.type.name).toBe('callout');

    // 定位焦点在 callout 内文本处
    editor.chain().setTextSelection(3).run();

    const event = new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 50,
    });

    const view = editor.view;
    view.dom.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    const calloutNodeAfter = editor.state.doc.firstChild;
    expect(calloutNodeAfter?.type.name).toBe('callout');
    expect(calloutNodeAfter?.childCount).toBe(2);

    editor.destroy();
  });
});
