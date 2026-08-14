# Tasks: Split DocEditor Main Component

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Date**: 2026-08-15

## Phase 1: Setup (共享基础设施准备)

**Purpose**: 创建重构所需的基础目录结构

- [X] T001 创建 hooks 目录 `frontend/src/components/DocEditor/hooks/`

---

## Phase 2: Foundational (底层助手函数抽离)

**Purpose**: 抽离非 UI 的底层 DOM 事件与粘贴解析逻辑，为后续 Hook 提供服务

- [X] T002 抽离 DOM 鼠标悬浮多层级检测与剪贴板 Block JSON 粘贴解析函数至 `frontend/src/components/DocEditor/utils/editorDOMEvents.ts`

**Checkpoint**: 基础助手模块就绪

---

## Phase 3: User Story 1 - 保留完整编辑器功能与对外接口 (Priority: P1) 🎯 MVP

**Goal**: 确保组件在模块拆分过程中 100% 继承既有功能与对外 Ref API 契约

**Independent Test**: 测试外部调用 `getMarkdown`, `setMarkdown`, `focus`, `clear` 等方法，以及输入文本与全量扩展的交互正常

- [X] T003 [P] [US1] 抽离 TipTap 扩展组装与配置逻辑至 `frontend/src/components/DocEditor/hooks/useDocEditorExtensions.ts`
- [X] T004 [P] [US1] 抽离 Imperative Ref 逻辑至 `frontend/src/components/DocEditor/hooks/useDocEditorRef.ts`

**Checkpoint**: 核心功能与扩展 Hook 解耦完成，对外 API 无破坏性变更

---

## Phase 4: User Story 2 - 模块化组件拆分与维护性提升 (Priority: P2)

**Goal**: 将主组件 `index.tsx` 拆分为职责专一的 Hooks 与 UI 浮层组件，使 `index.tsx` 代码量精简至 200 行以内

**Independent Test**: 查看组件代码层级与文件行数，确认 `index.tsx` 小于等于 200 行，编辑器所有交互（拖拽句柄、斜杠菜单、类型选择菜单、DrawIO 弹窗、图片上传）工作正常

- [X] T005 [P] [US2] 抽离拖拽句柄、块类型菜单及放置指示条状态至 `frontend/src/components/DocEditor/hooks/useDocEditorDragAndDrop.ts`
- [X] T006 [P] [US2] 抽离 DrawIO 弹窗、本地图片上传及全局 CustomEvent 监听至 `frontend/src/components/DocEditor/hooks/useDocEditorModals.ts`
- [X] T007 [US2] 创建浮层与弹窗统一渲染组件 `frontend/src/components/DocEditor/components/DocEditorOverlays.tsx`
- [X] T008 [US2] 重构主组件 `frontend/src/components/DocEditor/index.tsx`，通过组合 Hooks 与 Overlays 组件完成组装并缩减代码行数

**Checkpoint**: `DocEditor/index.tsx` 瘦身完成，代码结构内聚且易于维护

---

## Phase 5: User Story 3 - 性能隔离与状态优化 (Priority: P3)

**Goal**: 隔离拖拽悬浮与防抖状态更新，降低不必要的组件重渲染

**Independent Test**: 在编辑器中高频打字与移动鼠标，验证只有关联浮窗更新，编辑器文本输入流畅

- [X] T009 [P] [US3] 优化 `frontend/src/components/DocEditor/hooks/useDocEditorDragAndDrop.ts` 中的悬浮防抖与清理机制

---

## Phase 6: Polish & 交叉验证

**Purpose**: 最终质量与构建校验

- [X] T010 运行 TypeScript 类型检查 `npm --prefix frontend run build` 确保无编译错误
- [X] T011 校验 `frontend/src/components/DocEditor/index.tsx` 行数满足目标要求 (`wc -l`)
- [X] T012 按照 [quickstart.md](quickstart.md) 验证步骤完成浏览器全功能测试

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即执行
- **Foundational (Phase 2)**: 依赖 Setup
- **User Story 1 (Phase 3)**: 依赖 Foundational 阶段完成
- **User Story 2 (Phase 4)**: 依赖 US1 Hooks 完成
- **User Story 3 (Phase 5)**: 依赖 US2 完成
- **Polish (Phase 6)**: 依赖所有阶段完成

### Parallel Opportunities

- T003 (`useDocEditorExtensions.ts`) 与 T004 (`useDocEditorRef.ts`) 可并行开发。
- T005 (`useDocEditorDragAndDrop.ts`) 与 T006 (`useDocEditorModals.ts`) 可并行开发。
