// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { UnifiedBlockToolbar } from '../components/UnifiedBlockToolbar';

describe('UnifiedBlockToolbar Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('正确渲染左侧固定项（插入与删除按钮）以及右侧自定制插槽', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Test block</p>',
    });

    render(
      <UnifiedBlockToolbar editor={editor}>
        <button data-testid="custom-action">Custom Action</button>
      </UnifiedBlockToolbar>
    );

    // 左侧插入空白块下拉按钮
    expect(screen.getByTitle('在上方或下方插入空白块')).toBeDefined();
    // 左侧删除块按钮
    expect(screen.getByTitle('删除块')).toBeDefined();
    // 右侧自定义插槽
    expect(screen.getByTestId('custom-action')).toBeDefined();

    editor.destroy();
  });

  it('点击删除按钮应当触发 onDeleteBlock 回调', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Test block</p>',
    });

    const handleDelete = vi.fn();

    render(
      <UnifiedBlockToolbar editor={editor} onDeleteBlock={handleDelete} />
    );

    const deleteBtn = screen.getByTitle('删除块');
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);

    editor.destroy();
  });

  it('移入和移出容器时应当触发 onMouseEnter 和 onMouseLeave', () => {
    const editor = new Editor({
      extensions: [StarterKit],
      content: '<p>Test block</p>',
    });

    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();

    const { container } = render(
      <UnifiedBlockToolbar
        editor={editor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );

    const toolbarEl = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(toolbarEl);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(toolbarEl);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);

    editor.destroy();
  });
});
