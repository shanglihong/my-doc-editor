# Implementation Plan: Split DocEditor Main Component

**Branch**: `019-split-doc-editor` | **Date**: 2026-08-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/019-split-doc-editor/spec.md`

## Summary

将臃肿的 `frontend/src/components/DocEditor/index.tsx` (859 行) 拆解重构为清晰、模块化的架构。通过抽离扩展配置 Hook (`useDocEditorExtensions`)、拖拽与类型菜单 Hook (`useDocEditorDragAndDrop`)、弹窗与全局事件 Hook (`useDocEditorModals`)、Imperative Ref Hook (`useDocEditorRef`)，以及创建统一的浮层渲染组件 (`DocEditorOverlays`)，将 `index.tsx` 精简至 200 行以内，同时保持 100% 的功能与 API 契约兼容。

## Technical Context

**Language/Version**: TypeScript / React 18
**Primary Dependencies**: @tiptap/react, @tiptap/starter-kit, tiptap-markdown, lowlight
**Storage**: Client state / TipTap ProseMirror Doc Model
**Testing**: Vitest / React Testing Library / Node/Browser Verify
**Target Platform**: Modern Browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: React Frontend Component Library
**Performance Goals**: 渲染无卡顿，悬浮菜单延迟 <50ms，主文件缩减至 200 行以内
**Constraints**: 零 Breaking Change，对外接口与样式完全一致，遵守 KISS 与 DRY 原则
**Scale/Scope**: 核心编辑器组件拆解，涉及 1 个主文件重构与 5 个新增子 Hook/组件

## Constitution Check

*GATE: Passed before Phase 0 research. Re-checked after Phase 1 design.*

- **原则一：代码质量至上 (Code Quality Excellence)**: 拆解后的 Hook 职责专一，降低耦合，代码可读性显著提升。通过无损重构减少单个文件的认知负荷。
- **原则二：严格测试标准 (Rigorous Testing Standards)**: 保持组件导出契约完全不变，构建脚本与浏览器测试全部通过。
- **原则三：用户体验一致性 (UX Consistency & Modern Design)**: 重构不变更任何 UI 样式与交互逻辑，用户体验保持一致。
- **原则四：高性能与高响应性 (Performance & Responsiveness)**: 事件监听与悬浮防抖在专属 Hook 中封装，减少主视图无关重渲染。
- **原则五：架构简洁性与演进 (Architectural Simplicity)**: 采用 React 标准自定义 Hook 和纯组件拆分，不额外引入外部复杂状态库。
- **原则六：规范与文档中文表达**: 计划与技术设计产出物全中文编写。

## Project Structure

### Documentation (this feature)

```text
specs/019-split-doc-editor/
├── plan.md              # 实施计划文档
├── research.md          # 架构调研与选择方案
├── data-model.md        # 状态模型与 API 契约说明
├── quickstart.md        # 验证与测试指南
├── contracts/           # 组件接口契约文档
│   └── doc-editor-component-api.md
└── tasks.md             # 任务分解列表 (/speckit-tasks 生成)
```

### Source Code

```text
frontend/src/components/DocEditor/
├── index.tsx                         # [REFACTOR] 主入口组件（精简至 <200 行）
├── types.ts                          # [PRESERVE] 类型定义
├── DocEditor.module.css              # [PRESERVE] 样式文件
├── hooks/                            # [NEW] 自定义 Hooks 目录
│   ├── useDocEditorExtensions.ts     # [NEW] TipTap 扩展初始化 Hook
│   ├── useDocEditorDragAndDrop.ts    # [NEW] 拖拽、类型菜单与放置指示条 Hook
│   ├── useDocEditorModals.ts         # [NEW] 模态框与全局事件监听 Hook
│   └── useDocEditorRef.ts            # [NEW] Imperative Ref 处理 Hook
├── components/                       # 内部子组件目录
│   ├── DocEditorOverlays.tsx         # [NEW] 浮层与弹窗 UI 统一渲染容器
│   └── ...                           # [PRESERVE] 现有子组件
└── utils/                            # 工具库
    ├── editorDOMEvents.ts            # [NEW] 粘贴与 DOM 事件句柄抽离
    └── ...                           # [PRESERVE] 现有工具函数
```

**Structure Decision**: 采用标准子目录组织方式 (`hooks/`, `components/`, `utils/`)，保持主目录层级清晰，防止文件杂乱。

## Proposed Implementation Steps

### 步骤 1：建立 helpers 与工具模块
- 抽离 `handlePaste` 与 `handleDOMEvents` (mouseover / mouseleave) 到 `utils/editorDOMEvents.ts`。

### 步骤 2：创建功能 Hook
- `useDocEditorExtensions.ts`: 封装所有 TipTap 扩展组装。
- `useDocEditorDragAndDrop.ts`: 封装拖拽句柄、类型菜单、指示条状态与事件。
- `useDocEditorModals.ts`: 封装 DrawIO、图片上传及全局 CustomEvent。
- `useDocEditorRef.ts`: 封装 `useImperativeHandle` 方法集合。

### 步骤 3：创建 `DocEditorOverlays` 渲染组件
- 统一渲染 `DragHandleUI`, `BlockTypeMenu`, `BubbleToolbar`, `TableBubbleMenu`, `CalloutBubbleMenu`, `DrawIOModal`。

### 步骤 4：组装并精简 `DocEditor/index.tsx`
- 用上述 Hook 和 `DocEditorOverlays` 替换原 `index.tsx` 内部逻辑，保留 `forwardRef` 导出的主壳，验证行数缩小至 <200 行。

### 步骤 5：构建与自动化验证
- 运行类型检查、本地构建并进行浏览器交互测试。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 无 | N/A | 本方案遵守所有宪章原则与最佳实践 |
