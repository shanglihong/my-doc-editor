# UI 契约规范: 拖拽平铺菜单组件

**功能分支**: `014-drag-menu-type-switch`
**日期**: 2026-08-14

## 界面契约

### 1. `BlockTypeMenu` 交互契约

- **输入**:
  - `editor`: TipTap 编辑器实例。
  - `pos`: 当前触发菜单的块节点在文档中的绝对位置。
  - `nodeType`: 当前块节点的类型字符串（例如 `'paragraph'`, `'heading'`, `'codeBlock'`, `'imageBlock'` 等）。
  - `anchorRect`: 触发展示的 DragHandle DOM 矩形区域。
  - `isOpen`: 菜单打开状态。
  - `onClose`: 菜单关闭回调。
- **输出/行为**:
  - 点击平铺 Icon 图标：执行对应的类型切换命令（如 `setParagraph()`, `toggleCodeBlock()`），成功后触发 `onClose()`。
  - 点击最右侧删除图标：执行 `deleteRange({ from: pos, to: pos + nodeSize })` 并触发 `onClose()`。
  - 点击菜单外部区域或按 Esc 键：触发 `onClose()`。

### 2. UI 外观契约

- **容器排版**: 横向 Flex 居中单行容器。
- **图标维度**: 每个平铺图标尺寸 `28x28px` 或 `32x32px`，带圆角，hover 时增加微光/浅灰色背景 `background: #f1f5f9;`。
- **分割线与删除**: 最右侧带 `1px` 竖向分隔线，删除图标按钮带浅红 hover 态 `background: #fef2f2; color: #ef4444;`。
