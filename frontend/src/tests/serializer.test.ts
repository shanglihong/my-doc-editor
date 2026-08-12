import { describe, it, expect } from 'vitest';
import {
  serializeToAST,
  deserializeFromAST,
  astToMarkdown,
  markdownToAST,
} from '../components/DocEditor/utils/serializer';
import type { DocumentNode } from '../components/DocEditor/types';

describe('serializer 序列化与 AST 转换测试', () => {
  it('应该能正确将原生 JSON 转换为 DocumentNode AST', () => {
    const rawJSON = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: '知识库测试大纲' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '这是一个测试段落' }],
        },
      ],
    };

    const ast = serializeToAST(rawJSON);
    expect(ast.type).toBe('doc');
    expect(ast.version).toBe('1.0');
    expect(ast.content.length).toBe(2);
    expect(ast.content[0].type).toBe('heading');
  });

  it('应该能正确将 DocumentNode AST 反序列化', () => {
    const ast: DocumentNode = {
      type: 'doc',
      version: '1.0',
      content: [
        {
          id: 'block-1',
          type: 'paragraph',
          content: [{ type: 'text', text: '反序列化测试' }] as any,
        },
      ],
    };

    const raw = deserializeFromAST(ast);
    expect(raw.type).toBe('doc');
    expect(raw.content.length).toBe(1);
    expect(raw.content[0].type).toBe('paragraph');
  });

  it('应该能实现 AST 到 Markdown 的转换与 Markdown 解析', () => {
    const markdownInput = '# 一级标题\n\n测试段落内容\n\n```typescript\nconst a = 1;\n```';
    const ast = markdownToAST(markdownInput);

    expect(ast.content.length).toBe(3);
    expect(ast.content[0].type).toBe('heading');
    expect(ast.content[1].type).toBe('paragraph');
    expect(ast.content[2].type).toBe('codeBlock');

    const outputMarkdown = astToMarkdown(ast);
    expect(outputMarkdown).toContain('# 一级标题');
    expect(outputMarkdown).toContain('测试段落内容');
    expect(outputMarkdown).toContain('```typescript');
  });
});
