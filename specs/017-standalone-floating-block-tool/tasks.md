# Tasks: Standalone Floating Block Tool

**Feature**: Standalone Floating Block Tool (017-standalone-floating-block-tool)
**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 创建独立悬浮 Block Tool 子组件的新文件结构与基准样式配置

- [x] T001 [P] 创建独立悬浮 Block Tool 组件目录及类型定义文件 [frontend/src/components/DocEditor/components/FloatingBlockTool/index.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/index.ts)
- [x] T002 [P] 抽取高亮块基准样式为悬浮工具栏通用 CSS 模块 [frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.module.css)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心悬浮 Block Tool 子组件 `FloatingBlockTool` 的开发，作为全量非文本 Block 对接的前置依赖

- [x] T003 编写通用的 `FloatingBlockTool` 核心逻辑与结构 [frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.tsx)
  - 实现 `hoverStackManager` 订阅与节点 pos 计算
  - 实现 `calculateSmartPosition` 智能避让定位
  - 集成 `UnifiedBlockToolbar` 并导出 `children` 插槽

---

## Phase 3: User Story 1 - 独立悬浮 Block Tool 子组件封装与定制兼容 (Priority: P1) 🎯 MVP

**Goal**: 完成 `FloatingBlockTool` 子组件封装，并实现定制按钮功能插槽兼容

**Independent Test**: 在单元测试与 Callout 中验证 `FloatingBlockTool` 基础渲染与定制按键显示

- [x] T004 [P] [US1] 编写 FloatingBlockTool 的自动化单元测试 [frontend/src/components/DocEditor/__tests__/FloatingBlockTool.test.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/__tests__/FloatingBlockTool.test.tsx)
- [x] T005 [US1] 重构高亮块组件，全量对接 FloatingBlockTool 并传入主题与颜色选择插槽 [frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)

**Checkpoint**: 高亮块作为基准 Block Tool 顺利通过子组件解耦验证

---

## Phase 4: User Story 2 - 所有非文本 Block 统一对接悬浮 Block Tool (Priority: P2)

**Goal**: 废弃各自硬编码悬浮逻辑，全量非文本 Block 对接统一的 FloatingBlockTool 子组件

**Independent Test**: 依次在 CodeBlock, Table, Image, DrawIO 中验证工具栏统一呈现

- [x] T006 [P] [US2] 代码块 (CodeBlock) 对接 FloatingBlockTool 并配置语言选择与复制代码定制插槽 [frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx)
- [x] T007 [P] [US2] 表格块 (Table) 对接 FloatingBlockTool 并配置表格加减行列与对齐定制插槽 [frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)
- [x] T008 [P] [US2] 图片块 (Image) 对接 FloatingBlockTool 并配置图片对齐与重置定制插槽 [frontend/src/components/DocEditor/components/ImageBlock/ImageBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/ImageBlock/ImageBubbleMenu.tsx)
- [x] T009 [P] [US2] 图表块 (DrawIO) 对接 FloatingBlockTool 并配置编辑图表定制插槽 [frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx)

**Checkpoint**: 所有的非文本 Block 完成统一组件转换

---

## Phase 5: User Story 3 - 统一的鼠标悬停与拖拽按钮互斥控制 (Priority: P3)

**Goal**: 保证所有非文本 Block 统一遵循悬停 250ms 防抖显隐、点击工具栏隐藏拖拽按钮、点击拖拽句柄隐藏工具栏的交互规范

**Independent Test**: 手动对各 Block 交互测试悬停与拖拽显隐逻辑

- [x] T010 [US3] 优化 FloatingBlockTool 内部展开下拉菜单与子 Popover 时的防抖隐藏拦截与拖拽句柄互斥信号 [frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.tsx)
- [x] T011 [US3] 校验与调优各 NodeView 移入/移出与 hoverStackManager 注册防抖的一致性 [frontend/src/components/DocEditor/components/Callout/CalloutView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/Callout/CalloutView.tsx)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 清理冗余代码、测试运行与 quickstart 手动校验

- [x] T012 [P] 运行完整自动化测试套件 `npm run test`
- [x] T013 参照 quickstart.md 完成完整手动验证流程 [specs/017-standalone-floating-block-tool/quickstart.md](file:///Users/qiao.liu/Documents/my-docs/specs/017-standalone-floating-block-tool/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，立即开始
- **Foundational (Phase 2)**: 依赖 Setup，阻塞所有 User Story
- **User Story 1 (Phase 3)**: 依赖 Foundational (P1 优先级，MVP 核心)
- **User Story 2 (Phase 4)**: 依赖 Foundational，可与 US1 并行或依次推进
- **User Story 3 (Phase 5)**: 依赖 US1 & US2
- **Polish (Phase 6)**: 依赖所有 User Story 完成

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. 完成 Phase 1 (Setup) 与 Phase 2 (Foundational: FloatingBlockTool)
2. 完成 Phase 3 (US1: 高亮块解耦对接与单元测试)
3. 验证 MVP 功能正确

### Full Rollout
4. 完成 Phase 4 (US2: 全量非文本块 Block 工具栏转换)
5. 完成 Phase 5 (US3: 交互与拖拽互斥闭环)
6. 完成 Phase 6 (Polish & Quickstart 校验)
