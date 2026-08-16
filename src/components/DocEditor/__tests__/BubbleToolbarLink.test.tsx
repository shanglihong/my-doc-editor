// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LinkInputPanel } from '../components/BubbleToolbar/LinkInputPanel';

describe('LinkInputPanel 组件', () => {
  it('应正确渲染初始 URL 与按键操作', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    const onUnlink = vi.fn();

    render(
      <LinkInputPanel
        initialUrl="https://example.com"
        hasLink={true}
        onConfirm={onConfirm}
        onUnlink={onUnlink}
        onClose={onClose}
      />
    );

    const input = screen.getByPlaceholderText('输入或粘贴链接地址...') as HTMLInputElement;
    expect(input.value).toBe('https://example.com');

    // 测试修改并提交 Enter
    fireEvent.change(input, { target: { value: 'baidu.com' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onConfirm).toHaveBeenCalledWith('baidu.com');

    // 测试 Esc 闭合
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();

    // 测试点击取消链接
    const unlinkBtn = screen.getByTitle('清除链接');
    fireEvent.click(unlinkBtn);
    expect(onUnlink).toHaveBeenCalled();
  });
});
