# Research & Technical Decisions: 高亮 Block 浮动菜单与统一调色板

**Feature**: [spec.md](spec.md) | **Date**: 2026-08-14

## 技术调研与决策总结

### 1. 高亮 Block 浮动菜单（CalloutBubbleMenu）实现方案

- **决策 (Decision)**:
  参照既有 [TableBubbleMenu/index.tsx](../../frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx) 的实现模式，创建全新的 `CalloutBubbleMenu` 组件。通过监听 TipTap 的 `selectionUpdate` 和 `transaction` 事件，当检测到当前选区位于 `callout` 节点内部且非纯文本跨块选中时，通过 `calculateSmartPosition` 计算相对编辑容器的位置并呈现。
- **依据 (Rationale)**:
  - 项目已存在高度成熟且包含智能定位与防遮挡逻辑的 `calculateSmartPosition` 浮动算法工具。
  - 继承表格菜单的 CSS Module 样式规约（如阴影、圆角、背景色、分组分割线），可做到零视觉差异的极致一致体验。
- **备选方案对比 (Alternatives)**:
  - *备选方案 A*: 使用 TipTap 官方 `@tiptap/extension-bubble-menu` 扩展。由于 TipTap 官方 BubbleMenu 在多层嵌套（如表格内部的高亮块）或视口边缘定位调整时灵活性较差，且难以统一收管多个自定义控件，因此被否决。

### 2. 统一调色板数据结构与色调梯度设计

- **决策 (Decision)**:
  在 [defaultTheme.ts](../../frontend/src/components/DocEditor/utils/defaultTheme.ts) 中重构并导出 `UNIFIED_COLOR_SYSTEM`。包含三大功能分类（`textColor` 字体颜色、`backgroundColor` 背景颜色、`borderColor` 边框颜色），每个分类下按 8 种核心色调（灰、蓝、绿、黄、红、紫、青、橙）提供三级明度/深度梯度（`light` 浅色、`medium` 中等、`normal` 正常）：
  - 浅色 (Light): 用于大面积背景填充或柔和边框（如 `#f0f6ff`、`#eff6ff`）。
  - 中等 (Medium): 用于适度强调的高亮与边框（如 `#93c5fd`、`#3b82f6`）。
  - 正常 (Normal): 用于深色文字、高对比度边框或强图形凸显（如 `#1e40af`、`#1d4ed8`）。
- **依据 (Rationale)**:
  - 彻底打通原本分散的 `COLOR_PALETTE`、`HIGHLIGHT_PALETTE` 和 `TABLE_CELL_BG_PALETTE`。
  - 符合设计系统一致性与 WCAG 2.1 AA 级可读性标准。
- **备选方案对比 (Alternatives)**:
  - *备选方案 A*: 保留旧调色板，仅针对高亮 Block 单独写一套颜色。被否决，因为违背需求说明中“统一调整颜色设置”的核心意图。

### 3. 通用颜色选择器组件 (UnifiedColorPicker)

- **决策 (Decision)**:
  新建 `UnifiedColorPicker` 独立 UI 组件。支持两种模式：
  1. 单一功能模式（针对只需选择某种特定功能颜色的场景，如表格单元格背景仅选背景色）。
  2. Tab/分组全功能模式（支持在字体颜色、背景颜色、边框颜色之间切页或分块展示）。
  并在顶部提供“默认/清除颜色”按钮。
- **依据 (Rationale)**:
  高度解耦，供 `BubbleToolbar`（文字）、`TableBubbleMenu`（表格单元格背景/边框）、`CalloutBubbleMenu`（高亮块边框与背景）统一调用。
