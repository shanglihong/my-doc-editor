# Tasks: Auto-Generated Document Table of Contents (TOC)

**Feature Branch**: `021-auto-doc-toc`
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment verification

- [x] T001 Verify project structure in `frontend/src/components/DocEditor/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base infrastructure readiness for TOC extraction and component structure

- [x] T002 Create TOC Hook declaration in `frontend/src/components/DocEditor/hooks/useDocEditorTOC.ts`

---

## Phase 3: User Story 1 - 自动解析 H1/H2/H3 标题生成目录树与锚点定位 (Priority: P1) 🎯 MVP

**Goal**: 实现从主文档树中提取 H1/H2/H3 标题节点（自动过滤 Callout 等内嵌块），并支持点击目录条目进行平滑滚动与光标锚点定位。

**Independent Test**: 在文档中新建多级标题与 Callout 内嵌标题，确认目录精准提取且点击能成功跳转定位。

### Implementation for User Story 1

- [x] T003 [P] [US1] Create unit test for TOC extraction and filtering in `frontend/src/components/DocEditor/__tests__/useDocEditorTOC.test.ts`
- [x] T004 [US1] Implement H1/H2/H3 extraction logic and update event subscription in `frontend/src/components/DocEditor/hooks/useDocEditorTOC.ts`
- [x] T005 [P] [US1] Create TableOfContents styles in `frontend/src/components/DocEditor/components/TableOfContents/TableOfContents.module.css`
- [x] T006 [US1] Implement TableOfContents component with smooth scroll and anchor positioning in `frontend/src/components/DocEditor/components/TableOfContents/index.tsx`
- [x] T007 [US1] Mount TableOfContents component in `frontend/src/components/DocEditor/components/DocEditorOverlays.tsx`

**Checkpoint**: User Story 1 核心解析提取与锚点定位跳转完成。

---

## Phase 4: User Story 2 - 左侧留白浮动固定定位与悬停展开交互 (Priority: P1)

**Goal**: 实现目录组件在屏幕左侧留白的固定置顶定位（Fixed Position），支持默认 Icon 状态与鼠标 Hover 悬停展开/收起机制。

**Independent Test**: 滚动页面确认目录始终置顶在左上角，测试鼠标悬停展开与离开自动折叠。

### Implementation for User Story 2

- [x] T008 [P] [US2] Implement fixed positioning and transition styles in `frontend/src/components/DocEditor/components/TableOfContents/TableOfContents.module.css`
- [x] T009 [US2] Add hover expand and delayed collapse interaction in `frontend/src/components/DocEditor/components/TableOfContents/index.tsx`

**Checkpoint**: 目录浮层 fixed 置顶与 hover 展开折叠交互全部完成。

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Quality assurance and testing

- [x] T010 [P] Run unit tests and verify build cleanliness
- [x] T011 Perform manual verification scenarios per `specs/021-auto-doc-toc/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion.
- **Polish (Phase 5)**: Depends on all user stories completion.

### User Story Dependencies

- **User Story 1 (P1)**: Core heading extraction and navigation.
- **User Story 2 (P1)**: Hover interaction and fixed positioning for UI.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2
2. Complete Phase 3 (User Story 1)
3. Validate User Story 1 (标题提取正确与锚点跳转生效)

### Incremental Delivery

1. MVP (User Story 1) -> User Story 2 (Hover 悬停展开与固定定位) -> Phase 5 (测试与校验)
