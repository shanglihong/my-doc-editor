# Tasks: Highlighting Block Bubble Tool Support

**Feature Branch**: `020-highlight-block-bubble-tool`
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and validation

- [x] T001 Verify project build and editor environment in `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base infrastructure readiness for toolbar priority dispatching

- [x] T002 Inspect toolbar priority dispatcher interface in `frontend/src/components/DocEditor/utils/toolbarPriority.ts`

---

## Phase 3: User Story 1 - 高亮块内部文本选选中时使用悬浮工具栏 (Priority: P1) 🎯 MVP

**Goal**: 在高亮块（Callout Block）内部选中文本时，文本格式化悬浮工具栏（BubbleToolbar）能正常弹出并呈现。

**Independent Test**: 在编辑器高亮块内部选中文本，确认 BubbleToolbar 正确弹出，Callout 块级工具栏自动隐藏。

### Implementation for User Story 1

- [x] T003 [P] [US1] Unit test for TextSelection priority over Callout hover state in `frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts`
- [x] T004 [US1] Update `getActiveToolbarInfo` to prioritize non-empty TextSelection over Block Hover stack in `frontend/src/components/DocEditor/utils/toolbarPriority.ts`
- [x] T005 [US1] Verify BubbleToolbar positioning and visibility trigger with Callout selection in `frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx`

**Checkpoint**: User Story 1 可独立测试运行，高亮块选中文本显示 BubbleToolbar 目标达成。

---

## Phase 4: User Story 2 - 高亮块内文本块类型与样式状态响应 (Priority: P2)

**Goal**: 确保高亮块内部文本选选中时 BubbleToolbar 能准确反映文本属性（字号、颜色、加粗等）并支持块类型切换与清除格式。

**Independent Test**: 在高亮块内部为文本应用不同样式，重新选中后校验工具栏对应按钮高亮状态。

### Implementation for User Story 2

- [x] T006 [P] [US2] Verify format active state synchronization for Callout inner text in `frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx`
- [x] T007 [US2] Verify Callout block toolbar restoration when text selection becomes empty in `frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx`

**Checkpoint**: 高亮块内部文本属性响应及选区取消后的恢复逻辑全部就绪。

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 验证与质量保证

- [x] T008 [P] Run unit tests for toolbar priority in `frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts`
- [x] T009 Run quickstart manual validation guide per `specs/020-highlight-block-bubble-tool/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion.
- **Polish (Phase 5)**: Depends on all user stories completion.

### User Story Dependencies

- **User Story 1 (P1)**: Independent core dispatcher fix.
- **User Story 2 (P2)**: Builds upon US1 text selection toolbar display.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2
2. Complete Phase 3 (User Story 1)
3. Validate User Story 1 independently (選中文本正常弹出 BubbleToolbar)

### Incremental Delivery

1. MVP (User Story 1) -> User Story 2 (状态高亮与选区恢复) -> Phase 5 (测试与校验)
