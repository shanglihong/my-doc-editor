# Technical Research: Non-Text Block Floating Toolbar Actions & Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`  
**Spec**: [spec.md](spec.md)

## Overview & Technical Objectives

本研究涵盖非文本 Block（包括图片 Block、代码 Block、DrawIO/图标 Block）悬浮工具栏功能的增强与交互调优：
1. 增加统一的“插入空白块”下拉菜单按钮，支持在 Block 上方或下方插入空白段落块。
2. 所有非文本 Block 统一采用选中时展现的悬浮工具栏（Floating Bubble Toolbar）形式，不使用嵌入节点内部的按钮。
3. 代码 Block 保持其原生容器与 Header 样式完全不变，插入块操作通过在其上方浮动的工具栏承载。
4. 保证工具栏内下拉菜单在视口与滚动容器中不被截断遮挡，并建立多菜单间的互斥显示机制。

---

## Key Research Topics & Technical Decisions

### Research Item 1: 悬浮工具栏 (Floating Bubble Toolbar) 与原生 Block 样式保留

**现状与澄清分析**:
- 代码块（CodeBlockComponent）保留其原生 header 与 select 样式，不做内联修改。当节点被选中（`selected`）时，在代码块上方浮动展示包含“插入块”菜单的悬浮工具栏。
- 图片块（ImageBubbleMenu）与 DrawIO 块同样使用浮动工具栏，共享 `NonTextBlockToolbar.module.css` 悬浮样式。

**决策**:
- 统一使用 `position: absolute; top: -40px;` 在非文本 Block 被选中时浮动呈现工具栏。
- 工具栏统一高度 32px ~ 34px，边框圆角 6px，背景 `rgba(255, 255, 255, 0.95)`（支持 `backdrop-filter: blur(8px)`），阴影 `0 2px 8px rgba(0, 0, 0, 0.12)`。

---

### Research Item 2: 在 Block 上方/下方插入空白块的编辑器交互逻辑 (Block Insertion Logic)

**技术方案**:
- 在 TipTap 中，基于 NodeView 提供的 `editor` 与 `getPos()` 函数精确计算节点位置。
- **在上方插入**:
  ```typescript
  const pos = getPos();
  editor.chain().focus().insertContentAt(pos, { type: 'paragraph' }).run();
  ```
- **在下方插入**:
  ```typescript
  const pos = getPos() + node.nodeSize;
  editor.chain().focus().insertContentAt(pos, { type: 'paragraph' }).run();
  ```
- **焦点定位**: 插入后，焦点自动跳转至新建的空白段落块中，保证用户无缝继续录入文本。

---

### Research Item 3: 插入块下拉菜单防遮挡与视口自适应 (Menu Positioning & Anti-Clipping)

**决策**:
- 借助项目现有的防遮挡计算工具 `calculateSubMenuPosition` （位于 [floatingPosition.ts](../../frontend/src/components/DocEditor/utils/floatingPosition.ts)）。
- 下拉菜单根据悬浮按钮在视口中的 `getBoundingClientRect()` 动态测算空间：
  - 上方空间不够时自动向下展开 (`placement: 'bottom'`)；
  - 下方空间不够时自动向上展开 (`placement: 'top'`)；
  - 边缘溢出时自动平移归位 (`left: 0` 或 `right: 0`)。

---

### Research Item 4: 工具栏下拉菜单与弹窗互斥控制 (Mutual Exclusion Mechanism)

**决策**:
- 在悬浮工具栏中维护 `activeMenu: string | null` 状态。
- 每次触发任何下拉按钮时，先关闭其他已展开的菜单，确保同一个工具栏上同一时刻最多仅有一个下拉菜单呈现。

---

## Summary of Decisions

| 研究领域 | 选定方案 | 决策理由 |
|---------|---------|---------|
| 工具栏形态 | 悬浮工具栏 (Floating Toolbar) | 不破坏代码块等原生容器样式，提供统一且不侵入内容的悬浮交互 |
| 块插入算法 | TipTap `insertContentAt` + `node.nodeSize` | 精确计算 Block 上下边界，新建 Paragraph 自动获焦 |
| 防遮挡策略 | `calculateSubMenuPosition` 动态测算 | 复用项目避让算法，消除边缘裁剪 |
| 互斥效果 | 单一激活菜单 State 集中管控 | 消除多个菜单重叠展开的视觉冲突 |
