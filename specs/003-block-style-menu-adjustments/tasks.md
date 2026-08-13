# Tasks: Block Style and Menu Adjustments

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 准备基础底层扩展模块与算法工具

- [x] T001 [P] 创建浮动防遮挡定位计算工具在 frontend/src/components/DocEditor/utils/floatingPosition.ts
- [x] T002 [P] 创建统一且色彩丰富的 Block 图标系统在 frontend/src/components/DocEditor/utils/blockIcons.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 升级核心拖拽插件与基础 CSS 样式系统

- [x] T003 优化基础样式规范，提升各 Block 极简统一感在 frontend/src/components/DocEditor/DocEditor.module.css
- [x] T004 扩展拖拽把手插件，支持空 Block 坐标透传与节点元数据在 frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts

---

## Phase 3: User Story 1 - 简洁统一的 Block 样式与类型图标 (Priority: P1) 🎯 MVP

**Goal**: 为编辑器所有 Block 类型提供高质感、极简统一且色彩丰富的 Icon 系统与排版

**Independent Test**: 在编辑器中浏览各类 Block，确认不同 Block 类型均展示对应的多彩图标且 Block 排版规范统一

### Implementation for User Story 1

- [x] T005 [P] [US1] 在 blockIcons.tsx 中完成包含 Paragraph, Heading 1-3, List, Todo, CodeBlock, Quote, Callout, Table, DrawIO 的多彩图标定义在 frontend/src/components/DocEditor/utils/blockIcons.tsx
- [x] T006 [US1] 在 DocEditor.module.css 中配置 Block hover 态与 Icon 容器样式在 frontend/src/components/DocEditor/DocEditor.module.css

---

## Phase 4: User Story 2 - 拖拽按钮与 Block Icon / 加号 Icon 的互动与类型菜单 (Priority: P1)

**Goal**: 在拖拽控制区集成 Block Icon 与加号 Icon，点击弹出 Block 类型转换菜单

**Independent Test**: 点击非空 Block 的类型 Icon 和空 Block 的加号 Icon，验证均能正确弹出 BlockTypeMenu 菜单并转换 Block 类型

### Implementation for User Story 2

- [x] T007 [P] [US2] 创建 Block 类型转换快捷菜单组件在 frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx
- [x] T008 [US2] 改造 DragHandleUI 支持展示 Block Icon / Plus Icon 及菜单触发在 frontend/src/components/DocEditor/components/DragHandle/index.tsx
- [x] T009 [US2] 在 DocEditor 主组件中接管 BlockTypeMenu 的状态管理与类型转换执行在 frontend/src/components/DocEditor/index.tsx

---

## Phase 5: User Story 3 - 悬浮菜单栏与工具栏防遮挡智能定位 (Priority: P2)

**Goal**: 实现 BubbleToolbar 及其子下拉菜单的动态边界感知的上下自动翻转与防遮挡定位

**Independent Test**: 在编辑器顶部和底部分别选中文本或触发下拉菜单，验证工具栏和下拉框均 100% 留在视口与容器内部

### Implementation for User Story 3

- [x] T010 [US3] 重构 BubbleToolbar 定位逻辑，整合 floatingPosition.ts 的防遮挡翻转在 frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx
- [x] T011 [US3] 为 BubbleToolbar 中的字号、前景色、背景高亮色下拉框添加边界防截断定位在 frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 界面体验微调与验证

- [x] T012 [P] 调整 SlashMenu 样式与 blockIcons.tsx 统一图标风格在 frontend/src/components/DocEditor/components/SlashMenu/index.tsx
- [x] T013 执行 quickstart.md 中的全量交互场景验证与效果确认在 specs/003-block-style-menu-adjustments/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即启动
- **Foundational (Phase 2)**: 依赖 Setup 完成 - 阻塞后续 User Stories
- **User Stories (Phase 3+)**: 均依赖 Foundational Phase 完成
  - US1 (P1) 与 US2 (P1) 可并行开发，或者按 US1 → US2 顺序串行
  - US3 (P2) 依赖通用悬浮定位逻辑
- **Polish (Phase 6)**: 依赖所有 User Stories 完成

### Parallel Opportunities

- T001 与 T002 可并行创建
- T005 与 T007 可并行开发
- T012 可与其他 Polish 任务并行
