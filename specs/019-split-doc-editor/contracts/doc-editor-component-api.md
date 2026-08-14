# Component API Contract: DocEditor

**Feature**: [spec.md](../spec.md) | **Date**: 2026-08-15

## Component Interface (Props)

```typescript
export interface DocEditorProps {
  value?: DocumentNode | string;
  onChange?: (doc: DocumentNode, markdown: string) => void;
  onTitleChange?: (title: string) => void;
  readOnly?: boolean;
  titlePlaceholder?: string;
  placeholder?: string;
  className?: string;
}
```

## Ref Interface (DocEditorRef)

```typescript
export interface DocEditorRef {
  getTitle: () => string;
  setTitle: (title: string) => void;
  getJSON: () => DocumentNode;
  getMarkdown: () => string;
  setContent: (content: DocumentNode | string) => void;
  clear: () => void;
  focus: () => void;
}
```

## Zero Breaking Change Guarantee

- 所有新增的 Hooks 和内部工具模块仅作为私有抽象使用，对外不泄露任何新的全局依赖。
- 组件 `DocEditor.displayName = 'DocEditor'` 与 `forwardRef` 包装保持一致。
