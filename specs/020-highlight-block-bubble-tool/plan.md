# Implementation Plan: Highlighting Block Bubble Tool Support

**Branch**: `020-highlight-block-bubble-tool` | **Date**: 2026-08-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/020-highlight-block-bubble-tool/spec.md`

## Summary

解决在 DocEditor 高亮块（Callout Block）内部选中文本时文本格式化悬浮工具栏（BubbleToolbar）无法弹出的问题。
核心调整：优化统一调度算子 `getActiveToolbarInfo` (位于 `frontend/src/components/DocEditor/utils/toolbarPriority.ts`)，提升非空 `TextSelection` 的调度优先级，使其高于容器块的 Hover 栈状态；确保高亮块内部文本选选中时可正确弹出 BubbleToolbar，并在取消选中时平滑恢复 Callout 块级工具栏。

## Technical Context

**Language/Version**: TypeScript / React 18
**Primary Dependencies**: TipTap Editor, ProseMirror, Lucide React
**Storage**: Document JSON / HTML Persisted In-Memory State
**Testing**: Vitest / React Testing Library
**Target Platform**: Web Browsers (Desktop Chrome / Firefox / Safari)
**Project Type**: Web Frontend React Application
**Performance Goals**: Bubble Toolbar 弹出渲染响应时间 < 200ms
**Constraints**: 零破坏现有的 HoverStack 互斥机制，不污染 Callout 的节点 DOM 与 Schema 结构

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- 简洁至上：保持调度算子纯净性，无需添加复杂的跨组件事件派发。 (Passed)
- 结构化与可测性：修改集中在 `toolbarPriority.ts`，可直接编写针对性的单元测试。 (Passed)

## Project Structure

### Documentation (this feature)

```text
specs/020-highlight-block-bubble-tool/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Phase 0 research output
├── data-model.md        # Phase 1 data model & state priority matrix
├── quickstart.md        # Phase 1 validation guide
└── contracts/           # Interface contract for toolbar priority dispatcher
    └── toolbar-priority.md
```

### Source Code

```text
frontend/src/components/DocEditor/
├── utils/
│   └── toolbarPriority.ts                         # 统一工具栏优先级调度算子 (修改: 提升 TextSelection 优先级)
├── components/
│   ├── BubbleToolbar/                             # 文本格式化悬浮工具栏 (校验选中表现)
│   │   └── index.tsx
│   └── Callout/                                   # 高亮块级组件与工具栏
│       ├── CalloutView.tsx
│       └── CalloutBubbleMenu.tsx
└── __tests__/
    └── toolbarPriority.test.ts                    # 优先级调度单测 (扩展: 高亮块选中文本测试用例)
```

**Structure Decision**: 采用 Single Web Frontend 结构，修改局限在 `frontend/src/components/DocEditor/` 目录下。

## Complexity Tracking

*No violations found. Design adheres strictly to existing architecture.*
