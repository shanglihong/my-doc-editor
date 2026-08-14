# Implementation Plan: Standalone Floating Block Tool

**Branch**: `017-standalone-floating-block-tool` | **Date**: 2026-08-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [specs/017-standalone-floating-block-tool/spec.md](spec.md)

## Summary

以高亮块（Callout/Highlight Block）已有的 Block Tool 外观设计与交互逻辑为基准，提取并独立出一个通用的悬浮操作栏子组件 `FloatingBlockTool`。全量替换并统一所有非文本 Block（Callout 高亮块、CodeBlock 代码块、Table 表格块、Image 图片块、DrawIO 图表块）各自散乱的悬浮工具栏实现，统一控制鼠标悬停显隐（250ms 防抖）、菜单展开时隐藏拖拽按钮、点击拖拽按钮隐藏工具栏以及各非文本块专属定制按钮的平滑兼容。

## Technical Context

**Language/Version**: TypeScript / React 18
**Primary Dependencies**: TipTap (@tiptap/react, @tiptap/pm), Lucide Icons
**Storage**: Document JSON State (TipTap Prosemirror Document)
**Testing**: Vitest + React Testing Library (`npm run test`)
**Target Platform**: Modern Web Browsers
**Project Type**: Frontend Web Application Component
**Performance Goals**: 工具栏定位计算延迟 < 16ms，防抖流畅无卡顿/无闪烁
**Constraints**: 不侵入 TipTap 核心渲染管道，与现有 `hoverStackManager` 及 `DragHandlePlugin` 紧密集成
**Scale/Scope**: 涵盖全量非文本 Block (Callout, CodeBlock, Table, Image, DrawIO)

## Constitution Check

- 简洁至上 (KISS)：通过抽取通用 `FloatingBlockTool` 替代 5+ 个组件中重复编写的 `calculateSmartPosition` 与 `hoverStackManager` 绑定逻辑，极大简化代码。
- 渐进式开发：抽象 `FloatingBlockTool` 后依次对接高亮块、代码块、表格块、图片块与 DrawIO 块，逐步平滑过渡。
- 不使用 emoji，项目内 Markdown 文件路径统一使用相对路径。

## Project Structure

### Documentation (this feature)

```text
specs/017-standalone-floating-block-tool/
├── plan.md              # 本实施计划
├── research.md          # Phase 0 技术决策与设计
├── data-model.md        # Phase 1 组件数据模型与状态流转
├── quickstart.md        # Phase 1 验证与测试指南
└── contracts/
    └── floating-block-tool-contract.md  # 组件接口契约
```

### Source Code

```text
frontend/src/components/DocEditor/
├── components/
│   ├── FloatingBlockTool/                  # [NEW] 独立悬浮 Block Tool 子组件目录
│   │   ├── FloatingBlockTool.tsx
│   │   ├── FloatingBlockTool.module.css
│   │   └── index.ts
│   ├── UnifiedBlockToolbar/                # 内嵌标准类型切换与删除控制
│   ├── Callout/
│   │   ├── CalloutBubbleMenu.tsx           # [MODIFY] 对接 FloatingBlockTool
│   │   └── CalloutView.tsx
│   ├── CodeBlock/
│   │   └── CodeBlockComponent.tsx          # [MODIFY] 对接 FloatingBlockTool
│   ├── TableBubbleMenu/
│   │   └── index.tsx                       # [MODIFY] 对接 FloatingBlockTool
│   ├── ImageBlock/
│   │   └── ImageBubbleMenu.tsx             # [MODIFY] 对接 FloatingBlockTool
│   └── DrawIO/
│       └── DrawIOView.tsx                  # [MODIFY] 对接 FloatingBlockTool
└── __tests__/
    └── FloatingBlockTool.test.tsx          # [NEW] 单元测试文件
```

---

## User Review Required

> [!NOTE]
> 重构后所有非文本 Block 的悬浮工具栏将统一由 `FloatingBlockTool` 进行管理，各个块原先分散的 DOM 定位逻辑将被完全收拢。各个非文本块的特有操作（如代码语言切换、图片对齐等）将通过组件 `children` 插槽传入。

---

## Proposed Changes

### 悬浮 Block Tool 子组件与扩展 (FloatingBlockTool)

#### [NEW] [FloatingBlockTool.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.tsx)
- 实现通用的 `FloatingBlockTool` 组件。
- 封装 `calculateSmartPosition` 浮动定位计算。
- 自动订阅与响应 `hoverStackManager` 的悬停状态。
- 集成与 `DragHandlePlugin` 的互斥显示/隐藏事件通知。
- 默认内嵌 `UnifiedBlockToolbar` 基础功能，并通过 `children` 提供自定义按键插槽。

#### [NEW] [FloatingBlockTool.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/FloatingBlockTool.module.css)
- 提炼以高亮块 Block Tool 为基准的公共悬浮工具栏样式（阴影、圆角、圆角图标、间距、Popover 层级）。

#### [NEW] [index.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/FloatingBlockTool/index.ts)
- 导出 `FloatingBlockTool` 及其 Props 声明。

---

### 非文本 Block 重构对接 (Non-Text Blocks)

#### [MODIFY] [CalloutBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)
- 替换为使用 `FloatingBlockTool`，将主题面板、颜色选择器作为 `children` 传入。

#### [MODIFY] [CodeBlockComponent.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/CodeBlock/CodeBlockComponent.tsx)
- 替换内嵌的悬浮菜单逻辑，对接使用 `FloatingBlockTool`，传入语言选择与复制代码定制按钮。

#### [MODIFY] [TableBubbleMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)
- 替换浮动定位与显示控制逻辑，对接 `FloatingBlockTool`，传入表格特定增删行列定制按钮。

#### [MODIFY] [ImageBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/ImageBlock/ImageBubbleMenu.tsx)
- 替换现有定位，对接 `FloatingBlockTool`，传入图片对齐与重置按钮。

#### [MODIFY] [DrawIOView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx)
- 替换现有定位，对接 `FloatingBlockTool`，传入图表重新编辑按钮。

---

## Verification Plan

### Automated Tests
- 运行针对 `FloatingBlockTool` 的单元测试：
  ```bash
  npm run test frontend/src/components/DocEditor/__tests__/FloatingBlockTool.test.tsx
  ```

### Manual Verification
- 参照 [quickstart.md](quickstart.md) 手动测试步骤：
  1. 在浏览器中打开编辑器，分别插入高亮块、代码块、表格块、图片块与 DrawIO 块。
  2. 验证鼠标悬停展示与离开隐藏（250ms）。
  3. 验证点击 Block Tool 菜单时侧边拖拽按钮自动隐藏。
  4. 验证点击侧边拖拽按钮时 Block Tool 自动隐藏。
  5. 验证各块特有功能按键可正常操作使用。
