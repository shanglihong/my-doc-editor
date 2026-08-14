# Tasks: DocEditor 代码结构与样式重构

**Feature**: DocEditor 代码结构与样式重构
**Branch**: `012-refactor-doc-editor-structure`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 准备重构基础，确保现有构建与测试环境健全

- [x] T001 检查项目构建状态与当前 DocEditor 测试覆盖基础

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 准备新的组件样式与目录基础设施

- [x] T002 确认组件目录与依赖映射表（依据 data-model.md 与 contracts/component-structure.md）

**Checkpoint**: 基础架构映射确认完成，开始按 User Story 逐步重构

---

## Phase 3: User Story 1 - 组件独立样式拆分与隔离 (Priority: P1) 🎯 MVP

**Goal**: 将巨型全局 `DocEditor.module.css` 拆解为组件内就近的 CSS Module 文件，并更新对应组件的引入

**Independent Test**: 拆解样式后，运行组件渲染测试并通过，各组件界面视觉无偏差

### Implementation for User Story 1

- [x] T003 [P] [US1] 创建 Callout 组件独立样式 frontend/src/components/DocEditor/components/Callout/Callout.module.css 并提取 Callout 专属样式
- [x] T004 [US1] 更新 Callout 组件 frontend/src/components/DocEditor/components/Callout/CalloutView.tsx 导入新的 CSS Module
- [x] T005 [P] [US1] 创建 DrawIO 组件独立样式 frontend/src/components/DocEditor/components/DrawIO/DrawIO.module.css 并提取 DrawIO 专属样式
- [x] T006 [US1] 更新 DrawIO 组件 frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx 导入新的 CSS Module
- [x] T007 [P] [US1] 创建 CodeBlock 组件独立样式 frontend/src/components/DocEditor/components/CodeBlock/CodeBlock.module.css 并提取 CodeBlock 专属样式
- [x] T008 [US1] 更新 CodeBlock 组件 frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx 导入新的 CSS Module
- [x] T009 [P] [US1] 创建 BubbleToolbar 组件独立样式 frontend/src/components/DocEditor/components/BubbleToolbar/BubbleToolbar.module.css 并提取 BubbleToolbar 专属样式
- [x] T010 [US1] 更新 BubbleToolbar 组件 frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx 导入新的 CSS Module
- [x] T011 [P] [US1] 创建 DragHandle 独立样式 frontend/src/components/DocEditor/components/DragHandle/DragHandle.module.css 并提取相应样式
- [x] T012 [US1] 更新 DragHandle 组件 frontend/src/components/DocEditor/components/DragHandle/index.tsx 导入新的 CSS Module
- [x] T013 [P] [US1] 创建 SlashMenu 独立样式 frontend/src/components/DocEditor/components/SlashMenu/SlashMenu.module.css 并提取 SlashMenu 专属样式
- [x] T014 [US1] 更新 SlashMenu 组件 frontend/src/components/DocEditor/components/SlashMenu/index.tsx 导入新的 CSS Module
- [x] T015 [US1] 精简主样式文件 frontend/src/components/DocEditor/DocEditor.module.css，仅保留根容器与全局编辑区基类

**Checkpoint**: User Story 1 独立样式拆解完成，编辑器全局与组件样式模块化隔离

---

## Phase 4: User Story 2 - 规范 UI 组件与 Tiptap 扩展目录结构 (Priority: P2)

**Goal**: 将 ImageBlock React UI 视图迁移至 `components/ImageBlock/` 目录下，保持 `extensions/` 领域专注于 Extension 配置

**Independent Test**: 图片插入、调整尺寸与对齐交互保持功能正常，且模块结构符合规范

### Implementation for User Story 2

- [x] T016 [P] [US2] 创建图片组件目录 frontend/src/components/DocEditor/components/ImageBlock/ 及样式文件 frontend/src/components/DocEditor/components/ImageBlock/ImageBlockView.module.css
- [x] T017 [P] [US2] 迁移 React UI 组件 ImageBlockView.tsx, ImageBubbleMenu.tsx, ImageInsertModal.tsx 至 frontend/src/components/DocEditor/components/ImageBlock/
- [x] T018 [US2] 更新 frontend/src/components/DocEditor/components/ImageBlock/ 下组件内部与组件间的相对引用路径及 CSS Module 导入
- [x] T019 [US2] 重构扩展配置文件 frontend/src/components/DocEditor/extensions/ImageBlockExtension.ts，将其指向 frontend/src/components/DocEditor/components/ImageBlock/ImageBlockView.tsx
- [x] T020 [US2] 清理原本在 frontend/src/components/DocEditor/extensions/ImageBlock/ 目录下的残余 UI 文件并删除空目录

**Checkpoint**: User Story 2 完成，实现了统一的 UI Components 与 Tiptap Extensions 架构治理

---

## Phase 5: User Story 3 - 代码可读性与模块解耦重构 (Priority: P3)

**Goal**: 清理全局导出，重构 DocEditor 主入口与各模块之间的导入路径，消除冗余依赖

**Independent Test**: 框架编译无任何警告与错误，入口逻辑更加简明清晰

### Implementation for User Story 3

- [x] T021 [US3] 整理并更新主入口 frontend/src/components/DocEditor/index.tsx 的组件与 Extension 引入路径
- [x] T022 [US3] 优化类型定义 frontend/src/components/DocEditor/types.ts 与各子组件间类型导出的统一性

**Checkpoint**: 所有 User Stories 代码重构与整理完成

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 验证全局集成、代码规范与文档对齐

- [x] T023 执行静态 TypeScript 类型检查 (cd frontend && npx tsc --noEmit)
- [x] T024 执行单元测试套件校验 (cd frontend && npm run test -- src/components/DocEditor)
- [x] T025 按照 quickstart.md 完成手工验证并记录重构结果

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖
- **Foundational (Phase 2)**: 依赖 Setup 完成
- **User Story 1 (P1)**: 依赖 Foundational 完成 (MVP)
- **User Story 2 (P2)**: 依赖 Foundational 完成，可与 US1 并行或在 US1 之后执行
- **User Story 3 (P3)**: 依赖 US1 与 US2 的文件位置变更完成
- **Polish (Phase 6)**: 依赖所有 User Stories 完成

### Parallel Opportunities

- T003, T005, T007, T009, T011, T013 可并行创建并提取独立 CSS Module
- T016, T017 可并行准备新 ImageBlock 组件目录与复制迁移

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1 & 2
2. 完成 Phase 3 (US1 样式拆分)
3. 验证编辑页面视觉与交互一致

### Incremental Delivery

1. 完成 US1 -> CSS 样式就近模块化
2. 完成 US2 -> ImageBlock 目录结构规范化
3. 完成 US3 -> 主入口清理与全流程回归测试 (Phase 6)
