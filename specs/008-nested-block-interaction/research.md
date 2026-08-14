# Phase 0: Research & Technical Architecture - 内嵌 Block 交互优化与空白 Block 双击插入

**Feature Branch**: `008-nested-block-interaction`
**Date**: 2026-08-14
**Spec**: [spec.md](spec.md)

## 1. 块间与块下方双击插入空白 Block 机制研究

### 问题背景
在多层级文档或包含高亮块（Callout）、表格（Table）、代码块（CodeBlock）、图片（ImageBlock）等复杂 Block 的编辑器中，用户频繁需要在块下方或块与块之间的空隙双击鼠标，快速创建一个空白段落 Block。

### 技术选型与决策
- **决策**: 编写 TipTap / ProseMirror 插件 `DoubleTapInsertPlugin`（位于 `frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts`），通过 ProseMirror `editorProps.handleDOMEvents.dblclick` 拦截双击事件。
- **定位逻辑**:
  1. 获取双击坐标 `(event.clientX, event.clientY)`，利用 `view.posAtCoords` 和 `view.posAtDOM` 获取最接近的 ProseMirror 文档位置 `$pos`。
  2. 判断点击目标是否属于可编辑区域及所在 Block。
  3. 若双击发生在 Block 的下半部分、底端 margin/padding 区域或块间缝隙，计算该 Block 的后方文档位置 `$pos.after(depth)`。
  4. 使用 ProseMirror 事务 `tr.insert(insertPos, schema.nodes.paragraph.create())` 在该位置追加空白段落。
  5. 自动移动选区焦点 `tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1)))` 并调用 `view.focus()` 确保光标即刻可用。
- **拒绝的替代方案**:
  - *替代方案 A*: 给每个 Block DOM 绑死 React `onDoubleClick` 事件。
    *拒绝原因*: 增加了 React 组件生命周期与 DOM 调度的开销，且无法精准捕获块间缝隙或外围容器空白区域的点击。

---

## 2. 内嵌 Block 与父级 Block 工具菜单栏优先与互斥展示研究

### 问题背景
当内嵌 Block（如高亮块 Callout 内部的表格、表格中的图片、高亮块中的选区）处于选中状态时，由于每个菜单栏组件（`BubbleToolbar`、`TableBubbleMenu`、`CalloutBubbleMenu`、`ImageBubbleMenu`）各自独立监听 `editor.isActive('nodeType')`，会导致父级 Block 与子级 Block 的菜单栏同时触发并在界面上叠加、挡住编辑区域。

### 技术选型与决策
- **决策**: 创建统一的工具栏层级调度算法 `getActiveToolbarInfo`（位于 `frontend/src/components/DocEditor/utils/toolbarPriority.ts`）。
- **调度算法核心逻辑**:
  1. 遍历当前选区锚点 `$anchor` 从最深层 `depth` 到根节点 `1` 的祖先节点路径。
  2. 收集所有符合菜单展示条件的候选节点及其深度 `depth`：
     - 若为 `imageBlock` 的 `NodeSelection` -> 候选类型 `'image'`（深度为节点所在 `depth`）。
     - 若选区为非空 `TextSelection` 且不在 `codeBlock` 中 -> 候选类型 `'text'`（深度为当前文本选区所在 `depth`）。
     - 若祖先路径中存在 `table` -> 候选类型 `'table'`（深度为 `table` 所在 `depth`）。
     - 若祖先路径中存在 `callout` -> 候选类型 `'callout'`（深度为 `callout` 所在 `depth`）。
  3. 将所有候选项按照 `depth` 降序排列。
  4. 选取 `depth` 最大的候选项作为唯一的“活动菜单（Winning Toolbar）”。
  5. 各个 Bubble Menu 组件在 `selectionUpdate` / `transaction` 更新时，调用 `getActiveToolbarInfo(editor)`，仅当活动菜单类型与自身匹配时才显示，否则强制返回 `visible: false`。
- **效益与优点**:
  - 架构清晰、性能优异、遵循第一性原理。
  - 完全解耦各个菜单栏组件，便于后续拓展更多内嵌 Block 类型。

---

## 3. 宪章与设计原则合规

- **KISS & DRY**: 通过单一工具函数计算层级优先级，逻辑集中统一，无重复判断。
- **无 Emoji 规范**: 方案与文档全过程不包含 Emoji 图标。
- **中文文档表达**: 恪守项目宪章，全中文编写。
