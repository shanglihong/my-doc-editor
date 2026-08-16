# 任务分解清单 (Tasks): DocEditor 标准组件导出与扩展改造

**特征**: `023-export-doc-editor` | **日期**: 2026-08-16 | **需求文档**: [spec.md](spec.md) | **实施计划**: [plan.md](plan.md)

## Phase 1: 基础设施与准备 (Shared Infrastructure)

**目标**: 初始化组件改造环境与基线文件

- [x] T001 检查并清理 `frontend/src/components/DocEditor/` 目录下未使用的过时辅助文件
- [x] T002 [P] 在 `frontend/src/components/DocEditor/types.ts` 中规范基础 AST 类型 `BlockNode` 与 `DocumentNode`

---

## Phase 2: 基础支撑 (Foundational Prerequisites)

**目标**: 构建支撑受控主题和标准绑定的公共基础模型

- [x] T003 [P] 在 `frontend/src/components/DocEditor/types.ts` 中定义 `EditorTheme` 类型及扩展 `DocEditorProps` 主接口
- [x] T004 在 `frontend/src/components/DocEditor/styles/` 调整样式系统以支持受控 CSS 属性类名选择器 `data-theme`

---

## Phase 3: User Story 1 - 独立标准组件导出 (Priority: P1) 🎯 MVP

**目标**: 将 `DocEditor` 改造为高内聚、纯净且无副作用的独立导出组件

**独立测试标准**: 宿主引入 `DocEditor` 并成功编译渲染，无全局副作用与未定位的依赖报错

- [x] T005 [US1] 移除 `frontend/src/components/DocEditor/index.tsx` 内部对全局 Custom Event 的硬编码监听逻辑
- [x] T006 [US1] 重构 `frontend/src/components/DocEditor/index.tsx` 导出入口，集中统一导出组件与所有 public 类型
- [x] T007 [P] [US1] 整理 `frontend/src/components/DocEditor/` 的目录划分（components, hooks, extensions, utils, styles），确保职责明确

**阶段检查点**: 此时 `DocEditor` 已可独立接入并以干净的方式导出。

---

## Phase 4: User Story 2 - 夜间模式受控代码对接 (Priority: P1)

**目标**: 从编辑器的所有工具栏与菜单中移除暗黑模式切换按钮，改由 `theme` 属性在代码层控制

**独立测试标准**: 界面工具栏中无暗黑模式按钮，修改 `theme` 属性组件样式瞬间响应切换

- [x] T008 [US2] 从 `frontend/src/components/DocEditor/components/DocEditorOverlays.tsx` 及其悬浮/气泡工具栏中移除夜间模式切换按钮
- [x] T009 [US2] 在 `frontend/src/components/DocEditor/index.tsx` 中绑定 `theme` 属性，并将 `data-theme` 属性同步更新到根容器 DOM 上

**阶段检查点**: 夜间模式按钮已从 UI 移除，主题切换完全由宿主控制。

---

## Phase 5: User Story 3 - 集成 Hooks 与公共 API 对接口子 (Priority: P1)

**目标**: 补全标准编辑器事件回调 (`onFocus`, `onBlur`, `onSelectionChange`)，媒体处理 Hook (`onUploadImage`) 及 Ref 句柄

**独立测试标准**: 绑定的生命周期回调、图片上传 Hook 及 `ref.current` 开放方法能按预期被触发并正确返回数据

- [x] T010 [US3] 在 `frontend/src/components/DocEditor/types.ts` 中完善 `DocEditorRef` 接口方法声明 (`focus`, `blur`, `clearContent`, `getMarkdown`, `getJSON`, `setMarkdown`, `isEmpty`)
- [x] T011 [US3] 在 `frontend/src/components/DocEditor/hooks/useDocEditorRef.ts` 中实现新增的命令式 Ref 方法
- [x] T012 [P] [US3] 在 `frontend/src/components/DocEditor/index.tsx` 中对接 TipTap 的 `onFocus`、`onBlur` 及 `onSelectionUpdate` 回调并向外透传
- [x] T013 [US3] 在 `frontend/src/components/DocEditor/hooks/useDocEditorExtensions.ts` 与图片扩展中接入 `onUploadImage` 处理异步文件上传

**阶段检查点**: 编辑器拥有完整的生命周期事件监听与外部控制能力。

---

## Phase 6: 优化与快速验证 (Polish & Verification)

**目标**: 确保功能完整性并跑通验证流程

- [x] T014 [P] 更新 `frontend/src/components/DocEditor/README.md`，补充 API 说明与快速使用指南
- [x] T015 根据 `specs/023-export-doc-editor/quickstart.md` 指南完成组件端到端集成验证

---

## 依赖关系与执行顺序 (Dependencies & Execution Order)

### 阶段依赖
- **Phase 1 (基础设施)**: 无依赖，立即开始
- **Phase 2 (基础支撑)**: 依赖 Phase 1 基础类型定义
- **Phase 3 (User Story 1 - 独立导出)**: 依赖 Phase 2 基础支撑
- **Phase 4 (User Story 2 - 夜间模式控制)**: 依赖 Phase 3 组件基线
- **Phase 5 (User Story 3 - 对接 Hooks)**: 依赖 Phase 3/4 组件架构
- **Phase 6 (优化与验证)**: 依赖所有 User Story 完成

---

## 实施策略 (Implementation Strategy)

### MVP 最小可行性交付
1. 完成 Phase 1 与 Phase 2 基础支撑
2. 完成 Phase 3 (User Story 1 - 独立标准组件导出)
3. **验证点**: 验证组件干净导出无死代码

### 增量交付
- MVP 交付后，依次推进 Phase 4 (夜间模式属性化) 和 Phase 5 (扩展对接 Hooks 与 Ref Handles)
- 每个阶段完成后按照 [quickstart.md](quickstart.md) 进行独立功能验证
