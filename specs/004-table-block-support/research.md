# Research: 表格 Block 增强与扩展功能

## 1. 架构与依赖选择 (Architecture & Dependency Choice)

### 决策 1：基于 `@tiptap/extension-table` 扩展与封装表格操作
- **选择**: 充分利用已有依赖 `@tiptap/extension-table`、`@tiptap/extension-table-row`、`@tiptap/extension-table-header` 和 `@tiptap/extension-table-cell`。
- **依据**: 
  1. 项目 `package.json` 中已安装 `@tiptap/extension-table` 及其子包组件（版本 `^3.30.0`）。
  2. TipTap Table 插件原生内置基于 ProseMirror Table 的底层事务操作与状态计算，包括 `addRowBefore`、`addRowAfter`、`deleteRow`、`addColumnBefore`、`addColumnAfter`、`deleteColumn`、`mergeCells`、`splitCell`、`mergeOrSplit` 等核心 Command。
  3. 自研底层矩阵渲染或变异逻辑极易破坏 ProseMirror 节点树一致性，复用官方经过大量检验的 TipTap/ProseMirror Table 命令能保持 KISS 与架构简洁原则。
- **替代方案对比**:
  - *自研原生 HTML Table 组件*: 放弃 TipTap 引擎，自行构建表格 HTML 结构。**未采用原因**: 极其复杂且无法与 TipTap 撤销重做（Undo/Redo）、选区（Selection）、文档序列化（Markdown / JSON）协同。

### 决策 2：单元格多块与全量块级元素支持 (Cell Block Model)
- **选择**: 配置 `TableCell` 节点的 `content`Schema 为 `'block+'`。
- **依据**: 
  1. `@tiptap/extension-table-cell` 默认配置即为 `content: 'block+'`（包含段落、标题、列表、代码块、高亮块等各种块级 Component）。
  2. TipTap 内的拖拽、快捷菜单（SlashMenu）和 BubbleToolbar 等交互可在单元格焦点范围内自动发挥作用。
  3. 拆分合并单元格时，ProseMirror Table 内置命令默认将被合并单元格的内容按 Node 顺序追加合并到主单元格中；拆分时主单元格保留全量 Node 块，恢复出来的子单元格填充初始空段落（`paragraph`）。这完全符合用户选择的 Option B（支持全量块级元素）与 Option A（拆分保留在首个单元格）。

### 决策 3：表格悬浮浮动工具栏与快捷交互 UI (Table Bubble Toolbar / Controls UI)
- **选择**: 在 `frontend/src/components/DocEditor/components/` 下新增 `TableBubbleMenu`（或扩展既有 `BubbleToolbar`），当光标位于 Table 内部时激活表格专用的操作菜单。
- **依据**: 
  1. 目前编辑器的 `BubbleToolbar` 仅支持文本格式操作（加粗、斜体、颜色、字号等）。
  2. 需要针对表格节点添加易用的工具栏按钮组：插入行/列（上/下/左/右）、删除行/列、合并/拆分单元格、切换表头行/列。
  3. 操作直观，符合“在 2 次点击内完成行列调整”的 SC-001 成功指标。

## 2. 核心技术痛点与解决方案 (Technical Pain Points & Solutions)

### 痛点 1：删除最后一行/最后一列时的崩溃或非法结构
- **解决**: 封装命令包装函数 `safeDeleteRow` 与 `safeDeleteColumn`。在执行前检查当前表格总行数/总列数，若只剩 1 行或 1 列，则禁用删除按钮或阻止命令执行，避免整表非法被裁切导致 ProseMirror 选区报错。

### 痛点 2：单元格多选中合并/拆分按钮的状态判定
- **解决**: 使用 `@tiptap/extension-table` 提供的 `can().mergeCells()` 与 `can().splitCell()` 判定当前选区状态。在 Floating Menu / Context Menu 中根据 `can()` 接口动态高亮或禁用“合并单元格”与“拆分单元格”按钮。

### 痛点 3：样式与列宽拖拽适配 (Resizable Columns & Styling)
- **解决**: `Table.configure({ resizable: true })` 已在当前 `index.tsx` 中启用。需在 `DocEditor.module.css` 中完善 `.ProseMirror table`、`.ProseMirror td`、`.ProseMirror th`、`.column-resize-handle` 以及选区高亮 `.selectedCell` 的 CSS 样式，确保拖拽拉伸与选中合并态视觉突出且不错位。

## 3. 研究结论总结 (Research Summary)

本特性在底层完全基于既有的 TipTap Table 插件构建，前端增加表格专用的控制悬浮菜单组件 `TableBubbleMenu` 与 CSS 样式完善。整体方案简单直接、高可靠、无新增第三方依赖负担。
