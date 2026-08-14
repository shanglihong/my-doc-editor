# Tasks: Non-Text Block Toolbar Actions & Unified Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Data Model**: [data-model.md](data-model.md) | **Contracts**: [contracts/toolbar-api.md](contracts/toolbar-api.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 通用基础设施与基础方法准备

- [x] T001 创建 TipTap 块插入辅助方法文件 `frontend/src/components/DocEditor/utils/blockInsertion.ts`
- [x] T002 [P] 实现 `insertParagraphBlockAround` 工具函数在 Block 上方/下方插入空白段落块及自动获焦

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 通用非文本工具栏核心组件与 CSS 规范（阻塞后续 User Story）

- [x] T003 创建非文本工具栏统一 CSS 模块文件 `frontend/src/components/DocEditor/components/NonTextBlockToolbar/NonTextBlockToolbar.module.css`
- [x] T004 [P] 在 `NonTextBlockToolbar.module.css` 中定义尺寸、背景、边框圆角、Hover/Active 状态与下拉菜单防遮挡层级 Token
- [x] T005 创建聚合“插入块”下拉菜单按钮组件 `frontend/src/components/DocEditor/components/NonTextBlockToolbar/InsertBlockDropdown.tsx`
- [x] T006 在 `InsertBlockDropdown.tsx` 中集成 `calculateSubMenuPosition` 视口防遮挡定位算法与点击外部自动关闭逻辑

---

## Phase 3: User Story 1 - Insert Blank Block Above or Below via Toolbar (Priority: P1) 🎯 MVP

**Goal**: 用户可以在图片、代码块、DrawIO/图标等非文本 Block 的工具栏中通过“插入块”按钮，在当前 Block 上方或下方无缝插入空白段落块并自动获取焦点。

**Independent Test**: 点击图片、代码块或 DrawIO 的工具栏“插入块”下拉按钮，分别触发“在上方插入”和“在下方插入”，验证是否成功在对应相对位置新建空白段落块并自动获焦。

### Implementation for User Story 1

- [x] T007 [US1] 改造图片块工具栏 `frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx` 引入 `InsertBlockDropdown`
- [x] T008 [P] [US1] 改造代码块组件 `frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx` 引入 `InsertBlockDropdown`
- [x] T009 [P] [US1] 改造 DrawIO 图表组件 `frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx` 引入 `InsertBlockDropdown`
- [x] T010 [US1] 验证边界情况（文档首尾 Block、嵌套 Callout 块内部插入）的插入体验

---

## Phase 4: User Story 2 - Unified Visual Style and Mutual Exclusion for Non-Text Block Toolbars (Priority: P2)

**Goal**: 统一所有非文本 Block 工具栏的视觉风格，为代码块工具栏补全工具类，并实现工具栏内多下拉菜单之间的互斥显示。

**Independent Test**: 比较图片、代码块、DrawIO 工具栏外观尺寸与 hover 反馈，确认100%样式一致；在一张图片或代码块工具栏上打开一个下拉菜单后点击另一个菜单，确认前一个菜单自动关闭（互斥效果）。

### Implementation for User Story 2

- [x] T011 [US2] 规整 `frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx` 顶部工具栏结构与样式类
- [x] T012 [P] [US2] 调整图片块工具栏 `frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.module.css` 匹配统一工具栏规范
- [x] T013 [P] [US2] 清理 `frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx` 内联样式并替换为统一工具栏样式类
- [x] T014 [US2] 在 `ImageBubbleMenu.tsx`、`CodeBlockComponent.tsx` 与 `DrawIOView.tsx` 中实现 `activeMenu` 互斥状态管控

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 测试校验与系统完善

- [x] T015 为 `blockInsertion.ts` 与 `InsertBlockDropdown` 编写单元测试 `frontend/src/components/DocEditor/components/NonTextBlockToolbar/__tests__/InsertBlockDropdown.test.tsx`
- [x] T016 运行 `npm run test` 确保全量测试通过
- [x] T017 运行 `npm run build` 确保前端构建成功无 TypeScript 错误
- [x] T018 参照 `quickstart.md` 验证浏览器预览效果并确认防遮挡功能正常

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 初始准备阶段，无依赖，立即开始。
- **Phase 2 (Foundational)**: 依赖 Phase 1 完成，阻塞所有 User Story。
- **Phase 3 (User Story 1 - MVP)**: 依赖 Phase 2 完成。
- **Phase 4 (User Story 2)**: 依赖 Phase 2 完成，可与 Phase 3 并行或顺序推进。
- **Phase 5 (Polish)**: 依赖 Phase 3 与 Phase 4 完成。

---

## Implementation Strategy

1. **MVP 首发**: 完成 Phase 1、Phase 2 与 Phase 3，优先满足在非文本 Block 工具栏中插入空白块的核心编辑诉求。
2. **样式重构与互斥优化**: 推进 Phase 4，实现全部非文本 Block 工具栏外观100%统一与菜单互斥。
3. **回归校验**: 完成 Phase 5 的单元测试与构建验证，确保高交付质量。
