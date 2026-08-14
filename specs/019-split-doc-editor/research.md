# Research & Architectural Design: Split DocEditor Main Component

**Feature**: [spec.md](spec.md) | **Date**: 2026-08-15

## 1. Context & Problem Statement

`frontend/src/components/DocEditor/index.tsx` 目前包含 859 行代码，承担了过多职责：
1. 包含 20+ 个 TipTap 扩展的配置（`useEditor` extensions 配置）。
2. 自定义 ProseMirror 插件逻辑（粘贴块 JSON 解析、全局按键响应、复杂 DOM 鼠标悬浮多层级检测 `hoverStackManager`）。
3. 编辑器画布拖拽重排（Block Drag-and-Drop / Drop Indicator）算法与状态管理。
4. 多种弹窗与浮动菜单状态（拖拽句柄 UI、Block 类型切换菜单、DrawIO 弹窗、图片选择上传等）。
5. 导出组件 Ref 逻辑（`useImperativeHandle`）。

这导致组件代码高度耦合、阅读维护困难、二次开发容易产生踩踏。本次重构目标是在 100% 保持既有功能与对外 API 不变的前提下，将 `index.tsx` 拆解为高度内聚、职责单一的自定义 Hook 与子 UI 模块，将 `index.tsx` 行数精简至 200 行以内。

## 2. Research & Refactoring Options

### 方案评估 1：扩展配置解耦 (TipTap Extensions Hook)
- **选择**: 抽离出 `useDocEditorExtensions` Hook（或配置函数）。
- **理由**: 将所有 TipTap 扩展初始化（包含 `Placeholder` 闭包逻辑、`CodeBlockLowlight` 自定义 nodeView、`DragHandlePlugin` 回调）从主组件剥离。
- **替代方案**: 将 extensions 声明为全局静态常量。被否定原因：部分扩展如 `Placeholder` 和 `DragHandlePlugin` 需要依赖 React 状态或组件传入的 props（如 `titlePlaceholder`, `_placeholder`, `setTypeMenuState`, `setDragState`）。

### 方案评估 2：事件与拖拽逻辑 Hook 化 (Editor Events & DND Hook)
- **选择**: 抽离 `useDocEditorDragAndDrop` Hook 与 `useDocEditorModals` Hook。
- **理由**:
  - `useDocEditorDragAndDrop` 封装拖拽句柄状态 (`dragState`)、类型选择菜单状态 (`typeMenuState`)、放置指示条状态 (`dropIndicatorState`) 以及 `onDragOver`, `onDragLeave`, `onDrop` 事件处理逻辑。
  - `useDocEditorModals` 封装 DrawIO 弹窗、本地图片上传拾取器以及全局 CustomEvent 监听器（`OPEN_DRAWIO_MODAL`, `OPEN_IMAGE_MODAL` 等）。
- **替代方案**: 使用 React Context。被否定原因：当前仅为 `DocEditor` 内部重构，使用自定义 Hook 即可实现完美的逻辑复用与状态隔离，无需引入全局或组件树层级的 Context 复杂度，符合 KISS 原则。

### 方案评估 3：UI 浮层与弹窗收纳 (DocEditorOverlays Component)
- **选择**: 提取 `DocEditorOverlays` 容器子组件。
- **理由**: 将 `DragHandleUI`, `BlockTypeMenu`, `BubbleToolbar`, `TableBubbleMenu`, `CalloutBubbleMenu`, `DrawIOModal` 等 6+ 个浮动/弹窗 UI 统一收纳到一个子组件中，主视图只渲染 `<EditorContent>` 与 `<DocEditorOverlays>`。

### 方案评估 4：Imperative Ref 抽取 (useDocEditorRef Hook)
- **选择**: 抽取 `useDocEditorRef` Custom Hook。
- **理由**: 封装 `useImperativeHandle` 内部关于 `getTitle`, `setTitle`, `getJSON`, `getMarkdown`, `setContent`, `clear`, `focus` 等方法的导出细节。

## 3. Recommended Architectural Design

拆分后的目录结构规划如下：

```text
frontend/src/components/DocEditor/
├── index.tsx                         # 主入口组件（精简至 120-150 行）
├── types.ts                          # 类型定义（保持不变）
├── DocEditor.module.css              # 样式（保持不变）
├── hooks/
│   ├── useDocEditorExtensions.ts     # 扩展配置组装 Hook
│   ├── useDocEditorDragAndDrop.ts    # 拖拽句柄、类型菜单与放置指示条状态 Hook
│   ├── useDocEditorModals.ts         # 弹窗与全局事件监听 Hook
│   └── useDocEditorRef.ts            # Imperative Handle 接口封装 Hook
├── components/
│   ├── DocEditorOverlays.tsx         # 浮层与弹窗统一渲染组件
│   └── ... (现有组件保持不变)
└── utils/
    ├── editorDOMEvents.ts            # handlePaste / handleDOMEvents 鼠标悬浮与复制粘贴助手函数
    └── ... (现有 utils 保持不变)
```

## 4. Conclusion & Risks

- **性能影响**: 重构无新增昂贵计算，由于逻辑按 Hook 拆分，有助于 React 依赖项的精确清理与组件渲染层级管控。
- **回归风险**: 低。所有底层 DOM/TipTap 架构与事件监听保持原样，仅做代码位置挪移与变量传参整理。
