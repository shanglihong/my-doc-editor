# Tasks: 表格 Block 增强与扩展功能

**Feature Branch**: `004-table-block-support`
**Implementation Plan**: [plan.md](plan.md)
**Feature Spec**: [spec.md](spec.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 准备表格扩展与操作组件的文件结构与基建

- [x] T001 创建 TableBubbleMenu 组件目录 `frontend/src/components/DocEditor/components/TableBubbleMenu/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 在前端 DocEditor 中奠定表格样式、核心状态及基础 DOM 接入

- [x] T002 在 `frontend/src/components/DocEditor/DocEditor.module.css` 中添加表格核心 CSS 样式（`.ProseMirror table` 边框、单元格内边距、拖拽拉伸 Handle `.column-resize-handle` 以及选中单元格 `.selectedCell` 高亮）
- [x] T003 [P] 创建 `frontend/src/components/DocEditor/components/TableBubbleMenu/TableBubbleMenu.module.css` 提供表格悬浮工具栏样式

**Checkpoint**: 表格基础 CSS 与选区高亮就绪，可开始具体 User Story 开发

---

## Phase 3: User Story 1 - 动态添加与删除表格行列 (Priority: P1) 🎯 MVP

**Goal**: 实现表格在指定位置动态插入上/下行、左/右列，以及删除行/列的功能，并包含行列保护校验（防止删除最后一行或最后一列）。

**Independent Test**: 在编辑器中插入表格，选中任意单元格，分别点击“上方插入行”、“下方插入行”、“左侧插入列”、“右侧插入列”、“删除行”、“删除列”，校验网格变化与边界逻辑。

### Implementation for User Story 1

- [x] T004 [US1] 创建 `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx` 组件框架，监听 TipTap 编辑器中的表格选中状态 `editor.isActive('table')`
- [x] T005 [US1] 在 `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx` 中实现行列增删按钮逻辑（调用 TipTap Table 插件的 `addRowBefore`, `addRowAfter`, `addColumnBefore`, `addColumnAfter`, `deleteRow`, `deleteColumn` 命令）
- [x] T006 [US1] 在 `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx` 中添加行列安全保护校验（当 `rowCount <= 1` 时禁用删除行按钮，当 `colCount <= 1` 时禁用删除列按钮）
- [x] T007 [US1] 在 `frontend/src/components/DocEditor/index.tsx` 中导入并渲染 `TableBubbleMenu` 组件
- [x] T008 [US1] 在 `frontend/src/components/DocEditor/__tests__/TableBubbleMenu.test.tsx` 中添加行列增删命令与边界保护的单元测试

**Checkpoint**: MVP 阶段就绪，用户可在 2 次点击内完成表格行列的任意增删调整

---

## Phase 4: User Story 2 - 单元格内嵌套与编辑全量块结构 (Priority: P2)

**Goal**: 确保单元格内部支持内嵌与编辑全量 Block 节点（段落、标题、列表、代码块、高亮块等），样式适配正常。

**Independent Test**: 在单元格内输入文本按下 Enter 创建新段落块，并通过斜杠菜单在单元格中插入代码块与高亮块，验证渲染与编辑独立性。

### Implementation for User Story 2

- [x] T009 [US2] 在 `frontend/src/components/DocEditor/index.tsx` 中确认 `TableCell` 扩展配置的 `content`Schema 为 `block+`
- [x] T010 [US2] 优化 `frontend/src/components/DocEditor/DocEditor.module.css` 中单元格内部嵌套块级元素（如代码块 CodeBlockComponent、高亮块 Callout、标题等）的边距与对齐样式

**Checkpoint**: 单元格内具备完整的微型文档编辑能力，支持全量 Block 元素混合排版

---

## Phase 5: User Story 3 - 矩形区域单元格合并与拆分 (Priority: P3)

**Goal**: 实现跨多行多列矩形选区单元格的合并，以及已合并单元格的拆分，拆分后原内容完整保留在左上角单元格。

**Independent Test**: 框选 2x2 单元格点击“合并单元格”，校验融合为一个大单元格；再点击“拆分单元格”，校验恢复 2x2 网格且内容在左上角。

### Implementation for User Story 3

- [x] T011 [US3] 在 `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx` 中接入 `mergeCells` 与 `splitCell` 指令按钮
- [x] T012 [US3] 在 `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx` 中根据 `editor.can().mergeCells()` 与 `editor.can().splitCell()` 动态控制合并与拆分按钮的可点击状态
- [x] T013 [US3] 在 `frontend/src/components/DocEditor/__tests__/TableBubbleMenu.test.tsx` 中添加合并与拆分单元格的测试用例

**Checkpoint**: 表格合并与拆分功能完全就绪

---

## Phase 6: User Story 4 - 单元格背景颜色设置 (Priority: P4)

**Goal**: 在 TableBubbleMenu 中新增调色盘按钮，支持对当前焦点单元格或框选选区内的单元格设置/清除背景颜色（`setCellAttribute('backgroundColor', color)`）。

**Independent Test**: 选中单个或多个单元格，在悬浮菜单中点击背景色按钮并选择颜色，验证选中的单元格背景色实时改变；选择无背景色可清除背景。

### Implementation for User Story 4

- [x] T014 [P] [US4] 在 `frontend/src/components/DocEditor/components/TableBubbleMenu/TableBubbleMenu.module.css` 中增加背景颜色下拉调色盘样式
- [x] T015 [US4] 在 `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx` 中增加背景色按钮与调色盘下拉组件（支持选择预设颜色与清除背景色）
- [x] T016 [P] [US4] 在 `frontend/src/components/DocEditor/__tests__/TableBubbleMenu.test.tsx` 中添加单元格背景色设置的测试用例

**Checkpoint**: 单元格背景颜色功能开发就绪

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 整体交互体验优化、样式微调与全流程回归测试

- [x] T017 优化 `TableBubbleMenu` 在视口边界处的定位与吸附动画体验
- [x] T018 按 [quickstart.md](quickstart.md) 进行全流程功能与背景颜色测试验证

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，已完成
- **Foundational (Phase 2)**: 依赖 Setup 阶段完成，已完成
- **User Stories (Phase 3+)**:
  - US1 (P1) -> US2 (P2) -> US3 (P3) -> US4 (P4)
- **Polish (Phase 7)**: 依赖所有 User Story 完成

---

## Implementation Strategy

### Incremental Delivery

1. 已交付 MVP (US1), US2, US3
2. 已交付 US4 -> 单元格背景颜色设置能力 (T014 ~ T016)
3. 全流程验证与润色完成 (T017 ~ T018)
