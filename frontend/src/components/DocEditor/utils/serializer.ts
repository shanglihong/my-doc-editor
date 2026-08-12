import type { DocumentNode, BlockNode } from '../types';

/**
 * 将 Tiptap 的原生 JSON 结构转换为干净的 Block AST (DocumentNode)
 */
export function serializeToAST(editorJSON: any): DocumentNode {
  if (!editorJSON || typeof editorJSON !== 'object') {
    return { type: 'doc', version: '1.0', content: [] };
  }

  const content: BlockNode[] = Array.isArray(editorJSON.content)
    ? editorJSON.content.map((node: any, idx: number) => ({
        id: node.attrs?.id || `block-${idx}-${Date.now()}`,
        type: node.type,
        attrs: node.attrs,
        content: node.content,
      }))
    : [];

  return {
    type: 'doc',
    version: '1.0',
    content,
  };
}

/**
 * 将 DocumentNode AST 反序列化为 Tiptap 加载所需的 JSON
 */
export function deserializeFromAST(ast: DocumentNode): any {
  if (!ast || !Array.isArray(ast.content)) {
    return { type: 'doc', content: [] };
  }

  return {
    type: 'doc',
    content: ast.content.map((block) => ({
      type: block.type,
      attrs: block.attrs,
      content: block.content,
    })),
  };
}

/**
 * 将 DocumentNode AST 转为 Markdown 文本
 */
export function astToMarkdown(ast: DocumentNode): string {
  if (!ast || !Array.isArray(ast.content)) {
    return '';
  }

  const lines: string[] = [];

  for (const block of ast.content) {
    if (block.type === 'heading') {
      const level = block.attrs?.level || 1;
      const prefix = '#'.repeat(level);
      const text = extractText(block.content);
      lines.push(`${prefix} ${text}\n`);
    } else if (block.type === 'paragraph') {
      lines.push(`${extractText(block.content)}\n`);
    } else if (block.type === 'codeBlock') {
      const lang = block.attrs?.language || '';
      lines.push(`\`\`\`${lang}\n${extractText(block.content)}\n\`\`\`\n`);
    } else if (block.type === 'blockquote') {
      lines.push(`> ${extractText(block.content)}\n`);
    } else if (block.type === 'callout') {
      const icon = block.attrs?.icon || '💡';
      const theme = block.attrs?.themeColor || 'blue';
      lines.push(`> [!NOTE] icon="${icon}" theme="${theme}"\n> ${extractText(block.content)}\n`);
    } else if (block.type === 'excalidraw') {
      const jsonStr = JSON.stringify(block.attrs || {});
      lines.push(`\`\`\`excalidraw\n${jsonStr}\n\`\`\`\n`);
    } else if (block.type === 'horizontalRule') {
      lines.push('---\n');
    } else {
      lines.push(`${extractText(block.content)}\n`);
    }
  }

  return lines.join('\n').trim();
}

/**
 * 简单的 Markdown 字符串解析为 DocumentNode AST
 */
export function markdownToAST(markdown: string): DocumentNode {
  if (!markdown || typeof markdown !== 'string') {
    return { type: 'doc', version: '1.0', content: [] };
  }

  const lines = markdown.split('\n');
  const blocks: BlockNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      blocks.push({
        id: `block-${blocks.length}`,
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: line.substring(2) }] as any,
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        id: `block-${blocks.length}`,
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: line.substring(3) }] as any,
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        id: `block-${blocks.length}`,
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: line.substring(4) }] as any,
      });
    } else if (line.startsWith('```excalidraw')) {
      i++;
      let jsonStr = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        jsonStr += lines[i] + '\n';
        i++;
      }
      try {
        const attrs = JSON.parse(jsonStr.trim());
        blocks.push({
          id: `block-${blocks.length}`,
          type: 'excalidraw',
          attrs,
        });
      } catch {
        blocks.push({
          id: `block-${blocks.length}`,
          type: 'excalidraw',
          attrs: {},
        });
      }
    } else if (line.startsWith('```')) {
      const lang = line.substring(3).trim();
      i++;
      let code = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      blocks.push({
        id: `block-${blocks.length}`,
        type: 'codeBlock',
        attrs: { language: lang },
        content: [{ type: 'text', text: code.trim() }] as any,
      });
    } else if (line.trim().length > 0) {
      blocks.push({
        id: `block-${blocks.length}`,
        type: 'paragraph',
        content: [{ type: 'text', text: line.trim() }] as any,
      });
    }

    i++;
  }

  return {
    type: 'doc',
    version: '1.0',
    content: blocks,
  };
}

function extractText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(extractText).join('');
  }
  if (typeof content === 'object' && content.text) {
    return content.text;
  }
  if (typeof content === 'object' && content.content) {
    return extractText(content.content);
  }
  return '';
}
