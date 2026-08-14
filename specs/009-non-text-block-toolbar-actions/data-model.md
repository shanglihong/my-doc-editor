# Data Model & Component Specs: Non-Text Block Toolbar Actions & Unified Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`  
**Spec**: [spec.md](spec.md) | **Research**: [research.md](research.md)

## Entities & Data Models

### 1. InsertBlockOption (插入块选项)

代表“插入空白块”下拉菜单中的单项选择数据。

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `'above' \| 'below'` | 插入方向标识 |
| `label` | `string` | 展示文本（“在上方插入” / “在下方插入”） |
| `icon` | `React.ComponentType` | Lucide 图标对象（如 `ArrowUpToLine` / `ArrowDownToLine`） |
| `action` | `() => void` | 点击时执行的块插入回调逻辑 |

---

### 2. InsertBlockDropdownProps (插入块菜单组件属性)

“插入空白块”聚合下拉按钮组件的 Component Props 说明。

```typescript
export interface InsertBlockDropdownProps {
  /** TipTap 编辑器实例 */
  editor: Editor;
  /** 当前 NodeView 获取精确文档位置的回调 */
  getPos: () => number;
  /** 当前节点大小 node.nodeSize */
  nodeSize: number;
  /** 当前工具栏激活的子菜单 Key (用于互斥) */
  activeMenu: string | null;
  /** 切换子菜单激活状态的回调 */
  onToggleMenu: (menuKey: string | null) => void;
  /** 自定义工具栏按钮 className */
  buttonClassName?: string;
}
```

---

### 3. NonTextToolbarStyleTokens (非文本工具栏样式 Token)

定义图片、代码、DrawIO 等非文本 Block 工具栏统一的视觉 Token 物理规格。

```css
/* 视觉样式 Token */
--non-text-toolbar-height: 32px;
--non-text-toolbar-bg: rgba(255, 255, 255, 0.95);
--non-text-toolbar-border: 1px solid #e5e7eb;
--non-text-toolbar-radius: 6px;
--non-text-toolbar-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
--non-text-toolbar-btn-hover: #f3f4f6;
--non-text-toolbar-btn-active: #e5e7eb;
--non-text-toolbar-text-color: #374151;
```

---

### 4. ToolbarState (工具栏互斥状态模型)

```typescript
export interface NonTextToolbarState {
  /** 当前打开的下拉菜单 Key，如 'insert' | 'language' | 'color' | null */
  openMenuKey: string | null;
}
```
