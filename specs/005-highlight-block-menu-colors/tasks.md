# Implementation Tasks: 高亮 Block 浮动菜单与统一调色板

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 校验编辑器代码环境与基础架构准备

- [x] T001 校验前端编辑器代码环境与组件依赖结构在 [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心色彩体系重构与通用 `UnifiedColorPicker` 基础组件实现

**⚠️ CRITICAL**: 必须完成此阶段后方可展开具体 User Story 研发

- [x] T002 [P] 重构并导出全量三级明度色彩体系 `UNIFIED_COLOR_SYSTEM` 在 [frontend/src/components/DocEditor/utils/defaultTheme.ts](frontend/src/components/DocEditor/utils/defaultTheme.ts)
- [x] T003 [P] 扩展高亮 Block Prosemirror 节点 Schema，增加 `backgroundColor` 与 `borderColor` 属性支持在 [frontend/src/components/DocEditor/components/Callout/CalloutView.tsx](frontend/src/components/DocEditor/components/Callout/CalloutView.tsx)
- [x] T004 [P] 实现通用三级明度调色板组件 [frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.tsx](frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.tsx) 与 CSS 样式 [frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.module.css](frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.module.css)

**Checkpoint**: 基础调色板与 Block 节点数据模型准备完毕

---

## Phase 3: User Story 1 - 高亮 Block 专属浮动菜单 (Priority: P1) 🎯 MVP

**Goal**: 当光标聚焦或点击高亮 Block 时显示专属浮动菜单，支持在线设置边框颜色与背景填充颜色。

**Independent Test**: 在编辑器中插入高亮 Block，选中后触发浮动菜单，测试点击边框颜色与背景颜色是否即时渲染生效。

### Implementation for User Story 1

- [x] T005 [P] [US1] 编写高亮 Block 专属浮动菜单组件 [frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx](frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)
- [x] T006 [P] [US1] 编写高亮 Block 浮动菜单 CSS Module 样式 [frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.module.css](frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.module.css)
- [x] T007 [US1] 在主编辑器挂载 `CalloutBubbleMenu` 组件并在 [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx) 中集成激活状态
- [x] T008 [US1] 更新 `CalloutView` 节点视图，支持实时渲染自定义 `backgroundColor` 与 `borderColor` 在 [frontend/src/components/DocEditor/components/Callout/CalloutView.tsx](frontend/src/components/DocEditor/components/Callout/CalloutView.tsx)

**Checkpoint**: User Story 1 具备完备且独立可测试的 MVP 功能

---

## Phase 4: User Story 2 - 统一的功能与明度分层调色板 (Priority: P2)

**Goal**: 文本选择工具栏与表格浮动菜单全面升级为 `UnifiedColorPicker`，按功能及“浅、中、正常”三级明度呈现。

**Independent Test**: 分别在文本选区和表格单元格选择颜色，验证面板统一以“功能分类 + 三级明度”渲染。

### Implementation for User Story 2

- [x] T009 [P] [US2] 升级选中文本弹出的工具栏 [frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)，接入 `UnifiedColorPicker`
- [x] T010 [P] [US2] 升级表格浮动菜单油漆桶面板 [frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx](frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)，接入 `UnifiedColorPicker`

**Checkpoint**: 编辑器内全量组件颜色选择器完成彻底统一

---

## Phase 5: User Story 3 - 颜色重置与预设清除 (Priority: P3)

**Goal**: 允许用户在浮动菜单与调色板中快速“清除自定义颜色/恢复默认”。

**Independent Test**: 高亮 Block 设置自定义颜色后，点击恢复默认，验证恢复为初始主题。

### Implementation for User Story 3

- [x] T011 [US3] 在高亮 Block 菜单中增加清除背景色与边框色的重置操作在 [frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx](frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)
- [x] T012 [US3] 优化调色板中的清除与默认选项绑定在 [frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.tsx](frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.tsx)

**Checkpoint**: 颜色清除与重置功能完整无误

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 自动化测试与全量验证

- [x] T013 [P] 编写 `CalloutBubbleMenu` 与 `UnifiedColorPicker` 自动化单元测试在 [frontend/src/components/DocEditor/__tests__/CalloutBubbleMenu.test.tsx](frontend/src/components/DocEditor/__tests__/CalloutBubbleMenu.test.tsx)
- [x] T014 [P] 执行 [quickstart.md](quickstart.md) 手动交互与自动化回归测试

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即执行。
- **Foundational (Phase 2)**: 依赖 Setup 完成，阻断所有 User Story。
- **User Stories (Phase 3+)**: 依赖 Foundational 完成。按 Priority P1 (US1) -> P2 (US2) -> P3 (US3) 推进。
- **Polish (Phase 6)**: 依赖功能代码编写完成。

### Parallel Opportunities

- Phase 2 中的 `T002` (色彩体系定义)、`T003` (Schema 扩展)、`T004` (调色板组件) 均为独立文件，可并行开发。
- Phase 3 中的 `T005` (菜单逻辑) 与 `T006` (菜单 CSS 样式) 可并行开发。
- Phase 4 中的 `T009` (文本工具栏) 与 `T010` (表格菜单) 可并行开发。
- Phase 6 中的 `T013` (单元测试) 与 `T014` (全量验证) 可并行开发。
