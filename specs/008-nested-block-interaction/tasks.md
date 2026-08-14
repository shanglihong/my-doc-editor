# Tasks: 内嵌 Block 交互优化与空白 Block 双击插入

**Feature Branch**: `008-nested-block-interaction`
**Date**: 2026-08-14
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup (共享基础设施准备)

**Purpose**: 基础设施准备与底层层级调度架构设计

- [x] T001 [P] 创建菜单工具栏调度计算辅助模块 [toolbarPriority.ts](../../frontend/src/components/DocEditor/utils/toolbarPriority.ts)
- [x] T002 [P] 为菜单调度算法编写单元测试 [toolbarPriority.test.ts](../../frontend/src/components/DocEditor/__tests__/toolbarPriority.test.ts)

---

## Phase 2: Foundational (核心基础组件)

**Purpose**: 工具栏层级调度与菜单互斥判断逻辑基础

- [x] T003 [P] 完善 `getActiveToolbarInfo` 函数，支持根据 `$anchor` 祖先树 `depth` 准确计算活菜单类型（`text` / `table` / `callout` / `image`） [toolbarPriority.ts](../../frontend/src/components/DocEditor/utils/toolbarPriority.ts)

**Checkpoint**: 菜单层级调度基础完成，可并行开始各用户故事的开发与集成。

---

## Phase 3: User Story 1 - 块间/块下方双击插入空白 Block (Priority: P1) 🎯 MVP

**Goal**: 实现用户在任意 Block（包含顶层 Block 及内嵌 Block）下方或块间空白区域双击，精准追加新的空白段落 Block 并移动光标焦点。

**Independent Test**: 在独立 Block 下方、两个 Block 之间以及高亮块 Callout 内部空白区域双击，验证成功生成新段落 Block 且光标自动聚焦。

### Tests for User Story 1

- [x] T004 [P] [US1] 编写双击插入空白 Block 插件单元测试 [DoubleTapInsertPlugin.test.ts](../../frontend/src/components/DocEditor/__tests__/DoubleTapInsertPlugin.test.ts)

### Implementation for User Story 1

- [x] T005 [P] [US1] 创建 `DoubleTapInsertPlugin` 扩展，拦截 ProseMirror `dblclick` DOM 事件，计算坐标定位目标 Block [DoubleTapInsertPlugin.ts](../../frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts)
- [x] T006 [US1] 在 `DoubleTapInsertPlugin` 中实现 ProseMirror 事务，插入空白 `paragraph` 节点并更新选区 focus [DoubleTapInsertPlugin.ts](../../frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts)
- [x] T007 [US1] 在 `DocEditor` 主入口中注册 `DoubleTapInsertPlugin` 插件扩展 [index.tsx](../../frontend/src/components/DocEditor/index.tsx)

**Checkpoint**: User Story 1 功能完整且可单独验证测试。

---

## Phase 4: User Story 2 - 内嵌 Block 与父级 Block 工具菜单栏优先与互斥展示 (Priority: P1)

**Goal**: 解决内嵌 Block 与父级 Block 同时满足条件导致菜单重叠显示的视觉缺陷，确保仅展示最深活动层级的内嵌 Block 菜单栏。

**Independent Test**: 在高亮块内的表格、表格内的图片或高亮块内的选区处操作，验证界面上仅出现最内侧 Block 对应的工具菜单栏，父级菜单栏保持隐藏。

### Implementation for User Story 2

- [x] T008 [P] [US2] 在 `BubbleToolbar` 中接入 `getActiveToolbarInfo`，非 `'text'` 类型时强制隐藏文本菜单 [index.tsx](../../frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)
- [x] T009 [P] [US2] 在 `TableBubbleMenu` 中接入 `getActiveToolbarInfo`，非 `'table'` 类型时强制隐藏表格菜单 [index.tsx](../../frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)
- [x] T010 [P] [US2] 在 `CalloutBubbleMenu` 中接入 `getActiveToolbarInfo`，非 `'callout'` 类型时强制隐藏高亮块菜单 [CalloutBubbleMenu.tsx](../../frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)
- [x] T011 [P] [US2] 在 `ImageBlockView` 的 `ImageBubbleMenu` 渲染判定中加入层级校验，防止被外部父级 Block 菜单覆盖 [ImageBlockView.tsx](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx)

**Checkpoint**: User Story 1 与 User Story 2 均可独立及联合测试通过，实现菜单互斥与内嵌优先。

---

## Phase 5: User Story 3 - 交互体验与边界焦点平滑切换 (Priority: P2)

**Goal**: 优化双击插入和菜单显隐切换的边界交互，防止页面闪烁、滚动跳动或越界显示。

**Independent Test**: 在边界区域（如文档末尾、多层级极其紧凑区域）频繁双击与切换选区，验证动画与焦点移动流畅稳定。

### Implementation for User Story 3

- [x] T012 [P] [US3] 优化双击插入的位置边界判定（区分文本双击选词与空白处双击插入 Block），避免误触 [DoubleTapInsertPlugin.ts](../../frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts)
- [x] T013 [US3] 优化菜单显隐与绝对定位切换动画，确保选区在父子 Block 间频繁移动时平滑过渡无残留 [index.tsx](../../frontend/src/components/DocEditor/index.tsx)

---

## Phase 6: Polish & Cross-Cutting Concerns (优化与回归验证)

**Purpose**: 端到端全流程验证与回归测试

- [x] T014 [P] 执行单元测试套件 `npm run test` 确保所有测试通过
- [x] T015 根据 [quickstart.md](quickstart.md) 手动完成端到端交互回归验证

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即启动。
- **Foundational (Phase 2)**: 依赖 Phase 1，完成后解除 User Story 阻塞。
- **User Story 1 (Phase 3)**: 依赖 Phase 2，可独立并行实施。
- **User Story 2 (Phase 4)**: 依赖 Phase 2，可独立并行实施。
- **User Story 3 (Phase 5)**: 依赖 US1 与 US2 完成。
- **Polish (Phase 6)**: 依赖所有 User Story 完成。

### Parallel Opportunities

- T001 与 T002 可并行开发。
- Phase 4 中的 T008、T009、T010、T011 针对不同组件文件，完全可并行开发。
- US1 (Phase 3) 与 US2 (Phase 4) 在 Phase 2 完成后可由不同人员并行开发。

---

## Implementation Strategy

### MVP 交付策略 (User Story 1 优先)

1. 完成 Phase 1 与 Phase 2（基础设施与调度函数）。
2. 完成 Phase 3 (US1: 双击插入空白 Block)。
3. 验证 MVP 功能，确保双击插入机制正常运作。
4. 依次完成 Phase 4 (US2: 菜单栏互斥优先) 与 Phase 5 (US3: 体验优化)。
