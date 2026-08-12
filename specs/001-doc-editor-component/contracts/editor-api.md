# 编辑器组件 API 接口契约规范 (Contracts)

**功能规范文件**: [spec.md](../spec.md)
**数据模型文件**: [data-model.md](../data-model.md)
**创建时间**: 2026-08-12

## 1. DocEditor Component Props 接口契约

```typescript
import React from 'react';
import { DocumentNode } from '../data-model';

export interface DocEditorProps {
  /** 初始内容，支持传递 JSON Block AST 对象或 Markdown 文本 */
  value?: DocumentNode | string;

  /** 内容发生变更时的回调 */
  onChange?: (doc: DocumentNode, markdown: string) => void;

  /** 是否只读模式 */
  readOnly?: boolean;

  /** 自定义占位符文本 */
  placeholder?: string;

  /** 编辑器主题样式 ('light' | 'dark' | 'auto') */
  theme?: 'light' | 'dark' | 'auto';

  /** 样式类名扩展 */
  className?: string;

  /** 是否启用 Excalidraw 画图块扩展 */
  enableExcalidraw?: boolean;
}
```

---

## 2. DocEditor Ref 操纵接口契约 (Imperative API)

通过 `useRef<DocEditorRef>` 访问命令式方法：

```typescript
export interface DocEditorRef {
  /** 获取当前文档的结构化 JSON AST 对象 */
  getJSON: () => DocumentNode;

  /** 获取当前文档转换后的标准 Markdown 文本 */
  getMarkdown: () => string;

  /** 设置文档内容 (传入 JSON AST 或 Markdown) */
  setContent: (content: DocumentNode | string) => void;

  /** 清空当前编辑器 */
  clear: () => void;

  /** 使编辑器获得焦点 */
  focus: () => void;
}
```

---

## 3. 事件与扩展 Hooks 契约

```typescript
export interface EditorEventHandlers {
  onFocus?: () => void;
  onBlur?: () => void;
  onImageUpload?: (file: File) => Promise<string>;
}
```
