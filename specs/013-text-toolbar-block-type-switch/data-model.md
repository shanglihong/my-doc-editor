# Data Model: 文案选择工具栏文本块类型切换 (Text Toolbar Block Type Switch)

## 核心数据结构与实体定义

### 1. TextBlockTypeOption (文本块类型选项实体)

定义下拉菜单中每个文本块类型的属性与对应的 TipTap 切换动作。

```typescript
export interface TextBlockTypeOption {
  key: string;            // 唯一标识 (如 'paragraph', 'heading-1', 'taskList')
  label: string;          // 显示名称 (如 '正文', '标题 1', '待办列表')
  type: string;           // TipTap 节点类型标识 (如 'paragraph', 'heading', 'taskList')
  level?: number;         // 标题层级 (1, 2, 3)
  iconName: string;       // 对应图标标识
  action: (editor: Editor) => void; // 切换动作执行函数
  isActive: (editor: Editor) => boolean; // 是否处于激活状态检测函数
}
```

### 2. ToolbarSelectionState (选区状态实体)

控制浮动工具栏以及下拉菜单展开/收起的状态实体。

```typescript
export interface ToolbarSelectionState {
  currentBlockType: TextBlockTypeOption; // 当前选区的文本块类型
  isMixed: boolean;                       // 是否为跨不同类型块的混合选中
  isBlockMenuOpen: boolean;               // 文本块类型下拉菜单是否展开
}
```

## 文本块类型配置定义 (Block Types Config)

| Key | Label | Node Type | TipTap Command |
| --- | --- | --- | --- |
| paragraph | 正文 | paragraph | `editor.chain().focus().setParagraph().run()` |
| heading-1 | 标题 1 | heading (level: 1) | `editor.chain().focus().toggleHeading({ level: 1 }).run()` |
| heading-2 | 标题 2 | heading (level: 2) | `editor.chain().focus().toggleHeading({ level: 2 }).run()` |
| heading-3 | 标题 3 | heading (level: 3) | `editor.chain().focus().toggleHeading({ level: 3 }).run()` |
| bulletList | 无序列表 | bulletList | `editor.chain().focus().toggleBulletList().run()` |
| orderedList | 有序列表 | orderedList | `editor.chain().focus().toggleOrderedList().run()` |
| taskList | 待办列表 | taskList | `editor.chain().focus().toggleTaskList().run()` |
| blockquote | 引用 | blockquote | `editor.chain().focus().toggleBlockquote().run()` |
