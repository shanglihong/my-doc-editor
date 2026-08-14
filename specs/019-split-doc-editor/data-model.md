# Data Model & State Specifications: Split DocEditor Main Component

**Feature**: [spec.md](spec.md) | **Date**: 2026-08-15

## 1. Component State Entities

重构将拆分并规范以下状态实体（定义维持在 [types.ts](../../frontend/src/components/DocEditor/types.ts) 中）：

### DragState (拖拽句柄状态)
```typescript
interface DragState {
  visible: boolean;
  top: number;
  left: number;
  pos: number;
  nodeType?: string;
  nodeLevel?: number;
  isEmpty?: boolean;
  isDragging?: boolean;
}
```

### TypeMenuState (块类型切换菜单状态)
```typescript
interface TypeMenuState {
  isOpen: boolean;
  pos: number;
  anchorRect: DOMRect | null;
  nodeType?: string;
  nodeLevel?: number;
  nodeSize?: number;
}
```

### DropIndicatorState (拖放指示条状态)
```typescript
interface DropIndicatorState {
  visible: boolean;
  top: number;
}
```

### DrawIOModalState (DrawIO 编辑模态框状态)
```typescript
interface DrawIOModalState {
  isOpen: boolean;
  initialXml: string;
  nodePos: number | null;
}
```

## 2. Ref Method Contracts (DocEditorRef)

组件对外暴露的 API 契约保持完全兼容：

| 方法 | 入参 | 返回值 | 说明 |
| --- | --- | --- | --- |
| `getTitle` | - | `string` | 获取当前文档标题节点内容 |
| `setTitle` | `titleText: string` | `void` | 设置当前文档标题节点内容 |
| `getJSON` | - | `DocumentNode` | 获取文档 JSON 数据结构 |
| `getMarkdown` | - | `string` | 获取文档 Markdown 格式字符串 |
| `setContent` | `content: DocumentNode \| string` | `void` | 更新编辑器文档内容 |
| `clear` | - | `void` | 清空编辑器内容 |
| `focus` | - | `void` | 聚焦编辑器 |
