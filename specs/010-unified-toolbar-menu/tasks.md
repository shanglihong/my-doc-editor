# Tasks: 统一工具栏菜单管理

**Feature Branch**: `010-unified-toolbar-menu`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 确认工具栏架构重构范围与开发环境准备

- [x] T001 检查工具栏组件结构并准备统一管理容器目录在 frontend/src/components/DocEditor/components/UnifiedBlockToolbar/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 升级工具栏核心调度算法与创建统一工具栏基础容器

- [x] T002 升级 toolbarPriority 算法支持嵌套深度 (depth) 栈与 Hover Priority 在 frontend/src/components/DocEditor/utils/toolbarPriority.ts
- [x] T003 [P] 创建 UnifiedBlockToolbar 统一工具栏容器框架与基础样式在 frontend/src/components/DocEditor/components/UnifiedBlockToolbar/UnifiedBlockToolbar.tsx 及 UnifiedBlockToolbar.module.css
- [x] T004 [P] 撰写 toolbarPriority 基础调度的单元测试在 frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts

**Checkpoint**: 核心调度算法与统一工具栏基础组件就绪，即可开始各 User Story 迭代

---

## Phase 3: User Story 1 - 固定结构与自定制工具栏展示 (Priority: P1) 🎯 MVP

**Goal**: 实现左侧固定“插入空白/删除”按钮与右侧组件自定制插槽的标准工具栏布局

**Independent Test**: 悬停于表格、高亮块、图片等组件时，验证最左侧均固定显示插入与删除图标，右侧显示对应组件专用操作

### Implementation for User Story 1

- [x] T005 [P] [US1] 编写 UnifiedBlockToolbar 组件测试验证左固定项与右插槽渲染在 frontend/src/components/DocEditor/__tests__/UnifiedBlockToolbar.test.tsx
- [x] T006 [US1] 实现 UnifiedBlockToolbar 左侧固定“插入空白 Block”和“删除 Block”逻辑在 frontend/src/components/DocEditor/components/UnifiedBlockToolbar/UnifiedBlockToolbar.tsx
- [x] T007 [US1] 重构 TableBubbleMenu 接入统一工具栏并在右侧填充表格自定制插槽在 frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx
- [x] T008 [US1] 重构 CalloutBubbleMenu 接入统一工具栏并在右侧填充高亮块自定制插槽在 frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx
- [x] T009 [US1] 重构 ImageBubbleMenu 接入统一工具栏并在右侧填充图片对齐与操作插槽在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx

**Checkpoint**: MVP 阶段完成，所有 Block 工具栏在外观与左侧固定功能上实现完全统一

---

## Phase 4: User Story 2 - 基于鼠标悬停与离开的显隐控制 (Priority: P1)

**Goal**: 工具栏由鼠标悬停出现、离开隐藏驱动，完全剥离与组件点击/选区的依赖

**Independent Test**: 鼠标滑过 Block 时工具栏自动淡入，移出时淡出；点击 Block 不触发附加独立菜单

### Implementation for User Story 2

- [x] T010 [US2] 在 Block 视图层移除依赖点击/focus 触发工具栏的逻辑在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx 及 CalloutView.tsx
- [x] T011 [US2] 实现 UnifiedBlockToolbar 的 mouseenter/mouseleave 防抖显隐机制在 frontend/src/components/DocEditor/components/UnifiedBlockToolbar/UnifiedBlockToolbar.tsx
- [x] T012 [P] [US2] 添加纯 Hover 触发及脱钩点击事件的单元与集成测试在 frontend/src/components/DocEditor/__tests__/UnifiedBlockToolbar.test.tsx

**Checkpoint**: 工具栏显隐逻辑全面切至 Hover 驱动

---

## Phase 5: User Story 3 - 全局与嵌套组件工具栏互斥与优先级处理 (Priority: P1)

**Goal**: 保证全页最多存在一个可见工具栏，嵌套组件按节点深度优先级互斥（内层优先）

**Independent Test**: 在高亮块内嵌表格中悬停移动，验证悬停在内层表格时高亮块工具栏自动遮蔽，仅显示表格工具栏

### Implementation for User Story 3

- [x] T013 [US3] 实现全局 Hover 状态池与 hoverStack 深度排序调度在 frontend/src/components/DocEditor/utils/toolbarPriority.ts
- [x] T014 [US3] 优化 CalloutView 与内嵌 Block 的悬停事件捕获与优先权抢占在 frontend/src/components/DocEditor/components/Callout/CalloutView.tsx
- [x] T015 [P] [US3] 添加 Callout 嵌套 Table 的多级悬停互斥单测与集成测试在 frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts

**Checkpoint**: 所有嵌套组件完成无缝互斥与优先层级适配

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全局验证与代码优化

- [x] T016 运行 quickstart.md 验证流程及前端所有单元测试在 frontend/
- [x] T017 优化 UnifiedBlockToolbar 动画过渡与自适应定位样式在 frontend/src/components/DocEditor/components/UnifiedBlockToolbar/UnifiedBlockToolbar.module.css

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 可立即开始
- **Foundational (Phase 2)**: 依赖 Setup 完成，阻塞所有 User Story
- **User Stories (Phase 3+)**: 均依赖 Foundational Phase 完成
  - US1 (MVP) -> US2 -> US3 按顺序推进
- **Polish (Phase 6)**: 依赖所有 User Story 完成

### User Story Dependencies

- **User Story 1 (P1)**: 基础统一组件布局结构，无其他 Story 依赖
- **User Story 2 (P1)**: 基于 US1 的统一组件加入 Hover 显隐控制
- **User Story 3 (P1)**: 基于 US1 与 US2 加入深层嵌套调度与互斥

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1 Setup 与 Phase 2 Foundational
2. 完成 Phase 3 User Story 1
3. 验证左侧固定插入/删除与右侧插槽展示

### Incremental Delivery

1. 完成 MVP (US1) -> 交付统一架构工具栏
2. 完成 US2 -> 交付纯 Hover 显隐驱动
3. 完成 US3 -> 交付深层嵌套全局互斥
