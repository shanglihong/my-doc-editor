# Tasks: 块工具栏与拖拽按钮交互修复

**Feature Branch**: `016-block-tool-interaction-fix`
**Created**: 2026-08-15
**Status**: Ready

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 准备基础研发环境与审查设计文档

- [x] T001 Review and confirm design artifacts in `specs/016-block-tool-interaction-fix/plan.md` and `specs/016-block-tool-interaction-fix/spec.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 建立基础工具栏优先级与事件监听基础设施

- [x] T002 Update `hoverStackManager` event dispatching and locking mechanism in `frontend/src/components/DocEditor/utils/toolbarPriority.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 表格块工具栏未聚焦单元格时的删除功能 (Priority: P1) 🎯 MVP

**Goal**: 支持鼠标未定位在单元格内部时，通过表格悬浮工具栏成功删除整个表格块

**Independent Test**: 悬停表格弹出 `TableBubbleMenu`，保证光标在表格外部，点击“删除块”，表格成功被移除

- [x] T003 [P] [US1] Enhance table position extraction and node size tracking in `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx`
- [x] T004 [US1] Implement `deleteRange` fallback for table deletion when selection is outside table cells in `frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx`

**Checkpoint**: User Story 1 表格未定位单元格删除功能独立可测试并生效

---

## Phase 4: User Story 2 - 点击拖拽按钮时隐藏所有 Block Tool (Priority: P2)

**Goal**: 在用户点击或触发 DragHandle 时，立即收起所有浮动呈现的 Block Tool（如 CodeBlock, ImageBlock, DrawIO 等）

**Independent Test**: 悬停于 Code Block / Image Block 上使其工具栏显示，点击侧边拖拽按钮，工具栏立即完全隐藏

- [x] T005 [P] [US2] Add `HIDE_ALL_FLOATING_MENUS` event handler to `CodeBlockComponent` in `frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx`
- [x] T006 [P] [US2] Add `HIDE_ALL_FLOATING_MENUS` event handler to `ImageBlockView` in `frontend/src/components/DocEditor/components/ImageBlock/ImageBlockView.tsx`
- [x] T007 [P] [US2] Add `HIDE_ALL_FLOATING_MENUS` event handler to `DrawIOView` in `frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx`
- [x] T008 [US2] Dispatch `HIDE_ALL_FLOATING_MENUS` on `DragHandle` click/drag actions in `frontend/src/components/DocEditor/index.tsx`

**Checkpoint**: User Story 2 点击拖拽按钮隐藏工具栏独立可测试并生效

---

## Phase 5: User Story 3 - 点击 Block Tool 时隐藏拖拽按钮 (Priority: P3)

**Goal**: 在用户点击 Block Tool 时，自动隐藏当前显示的侧边 DragHandle

**Independent Test**: 悬停显示拖拽按钮后，点击 Block 顶部工具栏，拖拽按钮自动隐藏

- [x] T009 [P] [US3] Add `onMouseDown` event listener to dispatch `HIDE_DRAG_HANDLE` in `frontend/src/components/DocEditor/components/UnifiedBlockToolbar/index.tsx`
- [x] T010 [P] [US3] Add `onMouseDown` event listener to dispatch `HIDE_DRAG_HANDLE` in `frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx`
- [x] T011 [US3] Subscribe to `HIDE_DRAG_HANDLE` event in `DocEditor` to set `dragState.visible` to false in `frontend/src/components/DocEditor/index.tsx`

**Checkpoint**: User Story 3 点击 Block Tool 隐藏拖拽按钮独立可测试并生效

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 验证全局交互流畅性与多组件联动效果

- [x] T012 [P] Run quickstart validation scenarios defined in `specs/016-block-tool-interaction-fix/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖
- **Foundational (Phase 2)**: 依赖 Setup
- **User Stories (Phase 3-5)**: 依赖 Foundational 完成，可按优先级 P1 -> P2 -> P3 依次实现
- **Polish (Phase 6)**: 依赖所有 User Story 完成

---

## Parallel Opportunities

- Phase 3: T003 可并行准备
- Phase 4: T005, T006, T007 在不同 NodeView 文件，可完全并行开发
- Phase 5: T009, T010 在不同工具栏组件文件，可完全并行开发
