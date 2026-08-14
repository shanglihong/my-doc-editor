# 技术研究与决策 (Research & Technical Decisions)

**Feature**: Standalone Floating Block Tool (017-standalone-floating-block-tool)
**Date**: 2026-08-15

## 1. 组件抽离方案与架构设计

### 核心问题
现有的各类非文本 Block（高亮块 Callout、代码块 CodeBlock、表格 Table、图片 Image、DrawIO 图表）各自实现了冗余的浮动位置计算 (`calculateSmartPosition`)、`hoverStackManager` 订阅、TipTap 选区更新监听、DOM 节点获取以及显示/隐藏逻辑。导致维护困难，且在工具栏与拖拽按钮的互斥逻辑上容易出现不一致。

### 研究决策
以 `CalloutBubbleMenu` 的浮动定位与悬停交互逻辑为基准，抽离出一个高度可复用、响应式的通用悬浮 Block Tool 子组件 `FloatingBlockTool`（位于 [frontend/src/components/DocEditor/components/FloatingBlockTool](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool)）。

### 结构划分
- **`FloatingBlockTool` (独立悬浮子组件容器)**：
  - 职责：统一管理宿主 Block 节点的 DOM 定位、`hoverStackManager` 悬停状态绑定、TipTap 事件监听、智能边界计算（`calculateSmartPosition`）、显隐动画与拖拽互斥。
  - 内嵌封装 `UnifiedBlockToolbar`：默认自带标准的 Block 类型切换菜单（`InsertBlockDropdown`）、删除按钮、更广泛的样式容器。
  - 支持 `children` 或扩展插槽 (`customActions`)：平滑容纳不同非文本 Block 的定制按钮（如高亮块的主题/颜色选择器、代码块的语言选择器/复制按钮、图片块的对齐与尺寸重置按钮等）。

---

## 2. 关键交互逻辑与控制流

### 交互规则 1：鼠标悬停显示与防抖离开
- **悬停显示**：鼠标在非文本 Block 的 `NodeViewWrapper` 上移入 (`onMouseEnter`)，触发 `hoverStackManager.register(...)`，`FloatingBlockTool` 监听到活跃目标匹配当前 Block 后显示。
- **离开隐藏**：鼠标离开 Block 区域 (`onMouseLeave`) 时，调用 `hoverStackManager.unregister(...)`，附带 250ms 防抖缓冲。当鼠标平滑移动至 `FloatingBlockTool` 工具栏本体或下拉 Popover 时，触发 `keepActive()` 阻止隐藏。

### 交互规则 2：点击 Block Tool 隐藏拖拽按钮
- 当用户点击 Block Tool 内的类型切换下拉菜单（`InsertBlockDropdown`）或任意子 Popover（如颜色选择器）时，触发全局/状态通知 `isBlockToolMenuOpen = true`。
- 拖拽句柄插件（`DragHandlePlugin`）监听到 Block Tool 菜单处于打开状态时，强制隐藏拖拽句柄（`hideDragHandle()`）。

### 交互规则 3：点击拖拽按钮隐藏 Block Tool
- 当用户点击拖拽按钮（`isDragging = true`）启动 Block 拖拽时，`FloatingBlockTool` 监听到 `isDragging === true`，立即置 `visible = false` 并关闭所有子 Popover，确保拖拽期间视觉清爽。

### 交互规则 4：定制按钮功能的平滑兼容
- `FloatingBlockTool` 支持传入 `children` 作为定制动作组件。
- 定制动作区域采用 flex 布局，自动处理按钮间距、分隔线（Divider）与弹窗层级（Popover Positioning）。

---

## 3. 替代方案对比 (Alternatives Considered)

| 方案 | 优点 | 缺点 | 结论 |
| --- | --- | --- | --- |
| **方案 A (选定)**: 封装通用的 `FloatingBlockTool` 容器组件，内部集成 `UnifiedBlockToolbar` 与插槽 | 逻辑高聚拢，使用简单，非文本块仅需一行配置；完美解耦定位与UI | 无 | **优先采纳** |
| **方案 B**: 仅抽象 React Hook (`useFloatingBlockTool`) | 灵活性高 | 每个 Block 依然需要编写相同的 DOM 节点包裹与 `UnifiedBlockToolbar` 组件层，不够干净 | 放弃 |
| **方案 C**: 基于 TipTap 原生 `BubbleMenu` 扩展 | 利用 TipTap 原生能力 | 难以精准控制 hover 栈优先级与多层嵌套 Block（如表格单元格内）的智能避让定位 | 放弃 |
