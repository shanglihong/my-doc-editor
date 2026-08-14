# 交互问题调研与技术方案

## 1. TableBlock 未定位单元格时的删除方案

- **问题分析**: Tiptap 默认的 `deleteTable()` 命令需要光标在 `tableCell` 或 `tableHeader` 节点内部。当用户通过悬停触发 `TableBubbleMenu` 且光标在表格外部时，`deleteTable()` 返回 `false`。
- **技术决定**: 使用 `editor.chain().focus().deleteRange({ from: tablePos, to: tablePos + nodeSize }).run()` 进行精确位置节点删除。
- **替代方案对比**: 强制选区 refocus 到表格第一单元格再执行 `deleteTable()`——此方法可能带来光标闪烁与额外的选区更新逻辑，不如 `deleteRange` 干净且确定。

## 2. 点击拖拽按钮隐藏 Block Tool

- **问题分析**: 各类自定义 NodeView（如 CodeBlock, ImageBlock, DrawIOView）内部通过自身 Hover 状态决定是否渲染浮动工具栏，当用户与侧边拖拽按钮交互时，尚未通知这些 NodeView 隐藏。
- **技术决定**: 当点击/按下拖拽句柄（`DragHandle`）或触发 `onOpenTypeMenu` 时，广播 `HIDE_ALL_FLOATING_MENUS` 事件，并在 `hoverStackManager` 中清空当前 Hover 节点。各类 Block Tool 监听到该事件或观察到 Hover 清空后自动隐藏。

## 3. 点击 Block Tool 隐藏拖拽按钮

- **问题分析**: `DragHandleUI` 的显隐逻辑受 `dragState.visible` 控制。点击 Block Tool 区域时未主动清除 `dragState.visible`。
- **技术决定**: 在 `UnifiedBlockToolbar` 及各类工具栏根节点增加 `onMouseDown` 监听，广播 `HIDE_DRAG_HANDLE` 自定义事件。`DocEditor` 收到事件后将 `dragState.visible` 置为 `false`。
