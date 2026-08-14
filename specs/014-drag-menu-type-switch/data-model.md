# 数据模型与逻辑架构: 拖拽菜单文本与代码块类型切换平铺及删除图标

**功能分支**: `014-drag-menu-type-switch`
**日期**: 2026-08-14

## 核心数据抽象与分类

### 1. Block 节点分类 (Block Categories)

为了精确控制平铺菜单中图标项的隐显，将 TipTap / Slate 编辑器中的块类型分为以下三类：

- **文本块 (Text Blocks)**:
  - `paragraph`: 正文段落
  - `heading` (level 1-3): 一级/二级/三级标题
  - `bulletList`: 无序列表
  - `orderedList`: 有序列表
  - `taskList`: 待办列表
  - `blockquote`: 引用块
- **代码块 (Code Block)**:
  - `codeBlock`: 高亮代码片段块
- **复合容器及非文本块 (Non-Text / Non-Code Blocks)**:
  - `callout`: 高亮块 (复合容器)
  - `imageBlock`: 图片块
  - `drawioBlock`: Draw.io 图表块
  - `table`: 数据表格块

### 2. 菜单项数据模型 (MenuItemOption)

```typescript
export interface BlockMenuItemOption {
  key: string;
  label: string;
  type: string;
  level?: number;
  iconName: string;
  action: (editor: Editor, pos: number) => void;
}
```

### 3. 组件 Props 定义 (`BlockTypeMenuProps`)

```typescript
export interface BlockTypeMenuProps {
  editor: Editor | null;
  pos: number;
  nodeType?: string;
  nodeLevel?: number;
  nodeSize?: number;
  anchorRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteBlock?: () => void;
}
```

## 数据流与交互逻辑

```
[用户点击 DragHandle 按钮]
         │
         ▼
[计算 nodeType 及 pos, anchorRect] ──► 传入 BlockTypeMenu 组件
                                                │
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │ 判断 nodeType 是否属于 Text Block 或 Code Block?│
                        └───────────────────────┬───────────────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼                                                 ▼
             【是: 文本块或代码块】                               【否: 其它块】
                       │                                                 │
      ┌────────────────┴───────────────┐                        ┌────────┴────────┐
      ▼                                ▼                        ▼                 ▼
[渲染平铺切换 Icon 集合]      [末尾渲染分隔符与删除 Icon]    [隐藏类型 Icon]  [仅渲染删除 Icon]
```
