# Implementation Plan: Auto-Generated Document Table of Contents (TOC)

**Branch**: `021-auto-doc-toc` | **Date**: 2026-08-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/021-auto-doc-toc/spec.md`

## Summary

实现自动提取主文档 H1/H2/H3 标题的大纲目录组件（TOC），固定置顶在屏幕左侧留白处。
核心策略：
1. **自动提取与内嵌过滤**：直接遍历 ProseMirror 文档顶层子节点（过滤内嵌 Callout/Table 等节点内部包含的标题），提取 H1/H2/H3 标题的 `text`、`level` 及 `pos`。
2. **实时同步**：订阅 TipTap `update` 事件并采用防抖（50ms）实时重新生成 TOC 节点。
3. **左侧固定与 Hover 展开**：在左上角通过 `fixed` 定位提供极简目录 Icon，鼠标悬停时平滑展开详细大纲面板，离开后自动收回。
4. **锚点跳转定位**：点击目录节点调用 `setTextSelection(pos)` 配合 `scrollIntoView` 实现精准锚点跳转与光标定位。

## Technical Context

**Language/Version**: TypeScript / React 18
**Primary Dependencies**: TipTap Editor, ProseMirror, Lucide React (`List` / `ListOrdered` Icon)
**Storage**: TipTap Editor Document State
**Testing**: Vitest / React Testing Library
**Target Platform**: Web Browsers
**Project Type**: Web Frontend React Application
**Performance Goals**: 目录更新响应 < 100ms，定位跳转精确度 100%
**Constraints**: 不干扰底层编辑与交互，严格控制样式与现有极简设计系统协同

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- 简洁至上：单独封装 `TableOfContents` 组件，通过 TipTap Editor 实例通信，逻辑解耦清晰。 (Passed)
- 结构化与可测性：提取与导航逻辑模块化，便于单元与集成测试。 (Passed)

## Project Structure

### Documentation (this feature)

```text
specs/021-auto-doc-toc/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan
├── research.md          # Phase 0 research output
├── data-model.md        # Phase 1 data model & state priority matrix
└── quickstart.md        # Phase 1 validation guide
```

### Source Code

```text
frontend/src/components/DocEditor/
├── components/
│   ├── TableOfContents/                           # [NEW] 目录树 Floating UI 组件
│   │   ├── index.tsx
│   │   └── TableOfContents.module.css
│   └── DocEditorOverlays.tsx                       # [MODIFY] 挂载 TableOfContents 组件
└── hooks/
    └── useDocEditorTOC.ts                         # [NEW] 提取并实时计算 H1/H2/H3 目录的 Hook
```

**Structure Decision**: 模块化新增于 `frontend/src/components/DocEditor/components/TableOfContents/` 与 `hooks/useDocEditorTOC.ts` 中。

## Complexity Tracking

*No violations found. Clean component design adheres to existing architecture.*
