# 数据模型与 AST 结构规格说明：个人知识库文档编辑器前端组件

**功能规范文件**: [spec.md](./spec.md)
**技术研究文件**: [research.md](./research.md)
**创建时间**: 2026-08-12

## 1. 核心 AST 数据结构

文档数据在组件内部以 JSON Block 结构表示，映射自 ProseMirror 节点的 JSON Schema。

### 1.1 DocumentNode (文档根节点)

```typescript
export interface DocumentNode {
  type: 'doc';
  version: '1.0';
  content: BlockNode[];
}
```

### 1.2 BlockNode (块节点定义)

```typescript
export type BlockType = 
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'table'
  | 'callout'
  | 'excalidraw'
  | 'horizontalRule';

export interface BlockNode {
  id: string; // 唯一块 ID
  type: BlockType;
  attrs?: Record<string, any>;
  content?: InlineContentNode[] | BlockNode[]; // 基础块为 InlineContentNode，容器块为 BlockNode[]
  children?: BlockNode[]; // 支持容器层级嵌套
}
```

### 1.3 InlineContentNode 与 MarkState (内联文本与样式)

```typescript
export interface InlineContentNode {
  type: 'text';
  text: string;
  marks?: MarkState[];
}

export interface MarkState {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'fontSize' | 'color' | 'highlight';
  attrs?: {
    size?: 'small' | 'normal' | 'large' | 'huge'; // 对应字号控制
    color?: string; // HEX 前景色
    highlightColor?: string; // HEX 背景高亮色
  };
}
```

---

## 2. 特殊块节点属性规格

### 2.1 CalloutNode (高亮嵌套容器)

```typescript
export interface CalloutAttributes {
  icon: string; // 图标标识符或 Emoji 字符（如 "info", "warning", "💡"）
  iconType: 'lucide' | 'emoji';
  themeColor: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray' | 'pink' | 'black' | 'custom';
  customBg?: string; // 自定义 HEX 背景色
  customBorder?: string; // 自定义 HEX 边框色
}

// 示例 JSON:
// {
//   "type": "callout",
//   "attrs": { "icon": "💡", "iconType": "emoji", "themeColor": "yellow" },
//   "content": [
//     { "type": "paragraph", "content": [{ "type": "text", "text": "高亮容器内可以包含多行文本..." }] },
//     { "type": "codeBlock", "attrs": { "language": "typescript" }, ... }
//   ]
// }
```

### 2.2 ExcalidrawNode (嵌入式画图块)

```typescript
export interface ExcalidrawAttributes {
  elements: Array<Record<string, any>>; // Excalidraw 元素集合
  appState: Record<string, any>; // 画布视图状态 (zoom, scroll等)
  caption?: string; // 图表说明文字
  previewSvg?: string; // 缓存的 SVG 静态标量图
}

// 示例 JSON:
// {
//   "type": "excalidraw",
//   "attrs": {
//     "elements": [ ... ],
//     "appState": { "viewBackgroundColor": "#ffffff" },
//     "caption": "系统架构流程图"
//   }
// }
```

---

## 3. 编辑状态模型 (Transient UI State)

### 3.1 DragState (块拖拽重排状态)

```typescript
export interface DragState {
  isDragging: boolean;
  draggedBlockId: string | null;
  targetBlockId: string | null;
  dropPosition: 'before' | 'after' | 'inside';
}
```

### 3.2 SelectionState (选区与工具栏状态)

```typescript
export interface SelectionState {
  isTextSelected: boolean;
  from: number;
  to: number;
  activeMarks: Record<string, boolean>;
  activeFontSize: string;
  activeColor: string;
}
```
