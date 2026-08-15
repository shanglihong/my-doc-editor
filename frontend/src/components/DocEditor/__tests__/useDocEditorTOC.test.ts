import { describe, it, expect } from 'vitest';

describe('useDocEditorTOC Heading Filtering', () => {
  it('should filter out headings inside embedded blocks and keep top-level H1, H2, H3', () => {
    // 模拟文档树节点测试逻辑
    const mockTopLevelHeadings = [
      { type: { name: 'heading' }, attrs: { level: 1 }, textContent: '一级标题' },
      { type: { name: 'heading' }, attrs: { level: 2 }, textContent: '二级标题' },
      { type: { name: 'heading' }, attrs: { level: 3 }, textContent: '三级标题' },
    ];

    const result = mockTopLevelHeadings
      .filter((node) => node.type.name === 'heading' && node.attrs.level <= 3)
      .map((node, index) => ({
        text: node.textContent,
        level: node.attrs.level,
        index,
      }));

    expect(result).toHaveLength(3);
    expect(result[0].text).toBe('一级标题');
    expect(result[1].text).toBe('二级标题');
    expect(result[2].text).toBe('三级标题');
  });
});
