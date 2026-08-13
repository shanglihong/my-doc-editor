# Data Model & State Schema: Block Style and Menu Adjustments

## 1. 块图标配置模型 (BlockIconConfig)

```typescript
export interface BlockIconConfig {
  type: string;                  // 对应 Tiptap 节点类型，如 'paragraph', 'heading', 'bulletList' 等
  level?: number;                // 标题层级 1, 2, 3（仅当 type 为 heading 时生效）
  label: string;                 // 类型可读名称，如 '一级标题'
  icon: React.ComponentType;     // Lucide 图标组件
  color: string;                 // 图标前景色 / 品牌色
  backgroundColor: string;       // 图标浅色背景/微晕色
  description?: string;          // 类型描述或快捷键提示
}
```

---

## 2. 拖拽把手与 Icon 状态模型 (DragHandleState)

```typescript
export interface DragHandleState {
  visible: boolean;              // 把手及 Icon 是否在当前 Block 悬浮显示
  top: number;                   // 把手绝对 Y 坐标（像素）
  left: number;                  // 把手绝对 X 坐标（像素）
  pos: number;                   // 当前匹配 ProseMirror 节点的文档位置 (Node Start Position)
  nodeType: string;              // 当前 Block 节点的类型名称
  nodeLevel?: number;            // 若为 heading，其层级 level (1|2|3)
  isEmpty: boolean;              // 当前 Block 是否为空节点
  isDragging?: boolean;          // 是否正处于拖拽重排操作中
}
```

---

## 3. 浮动防遮挡定位配置 (FloatingPositionConfig)

```typescript
export interface FloatingPositionConfig {
  targetRect: DOMRect;           // 触发锚点（选区或按钮）的 ClientRect
  containerRect: DOMRect;        // 约束容器（如编辑器 DOM 或窗口视口）的 ClientRect
  menuWidth: number;             // 待渲染菜单的预测宽度
  menuHeight: number;            // 待渲染菜单的预测高度
  preferredPlacement?: 'top' | 'bottom'; // 倾向出现的位置（默认 'top'）
  offset?: number;               // 与锚点之间的像素间距（默认 8px）
}

export interface FloatingPositionResult {
  top: number;                   // 最终定位 Top (相对于容器)
  left: number;                  // 最终定位 Left (相对于容器)
  placement: 'top' | 'bottom';   // 实际采用的方向（翻转后）
}
```

---

## 4. Block 类型切换菜单项模型 (BlockTypeMenuItem)

```typescript
export interface BlockTypeMenuItem {
  id: string;                    // 菜单项标识，如 'heading-1', 'bullet-list'
  type: string;                  // 转换的目标 Tiptap 节点类型
  level?: number;                // 目标标题层级
  title: string;                 // 菜单项标题
  description: string;           // 菜单项功能说明
  icon: React.ComponentType;     // 彩色图标组件
  iconColor: string;             // 图标主体色彩
  iconBg: string;                // 图标微晕背景色
  action: (editor: Editor, pos: number) => void; // 转化类型操作钩子
}
```
