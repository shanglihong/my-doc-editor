# Implementation Plan: DocEditor 代码结构与样式重构

**Branch**: `012-refactor-doc-editor-structure` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [spec.md](spec.md)

## Summary

本次重构针对 `frontend/src/components/DocEditor` 目录进行纯结构性优化，旨在提高代码可读性与可维护性，且绝对不改变既有的编辑与渲染功能效果。核心工作包括：
1. 将约 17KB 的单一样式巨型文件 `DocEditor.module.css` 拆分为组件级模块化 CSS，按组件就近存放在 `components/[ComponentName]` 下。
2. 规范 UI 组件与 Extension 的目录体系，将 `extensions/ImageBlock` 目录下的 React 视图代码迁移至 `components/ImageBlock` 下，保持 `extensions/` 领域专用于 Tiptap 节点与扩展配置。
3. 整理相对路径引用，确保 TypeScript 构建通过且测试无回归。

## Technical Context

**Language/Version**: React 18, TypeScript 5.x
**Primary Dependencies**: Tiptap / ProseMirror, CSS Modules, Lucide React Icons
**Storage**: N/A (纯前端 UI 与结构重构)
**Testing**: Vitest / React Testing Library
**Target Platform**: Desktop & Mobile Browsers
**Project Type**: Web Application Frontend Component
**Performance Goals**: 首屏样式与 JS 解析开销微小减少，无重绘/重排性能退化
**Constraints**: 0 破坏性变更，保持所有已有 API 与导出契约
**Scale/Scope**: `frontend/src/components/DocEditor/` 目录及其所有子目录

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **原则一：代码质量至上 (Code Quality Excellence)** - PASS
   - 遵从 KISS 与高内聚低耦合原则，通过将样式和 React 视图组件就近组合，减少跨层级关联。
2. **原则二：严格测试标准 (Rigorous Testing Standards)** - PASS
   - 重构前后必须运行已有的自动化测试，确保测试用例 100% 通过。
3. **原则三：用户体验一致性 (UX Consistency & Modern Design)** - PASS
   - 零视觉与排版改变，所有的 CSS Module 类名与结构完全兼容。
4. **原则五：架构简洁性与演进 (Architectural Simplicity)** - PASS
   - 统一“UI 归 components/，插件配置归 extensions/”的标准契约。
5. **原则六：规范与文档中文表达 (Specification & Language Standards)** - PASS
   - Plan 及相关设计产物全部采用中文撰写，路径均使用相对路径。

## Project Structure

### Documentation (this feature)

```text
specs/012-refactor-doc-editor-structure/
├── spec.md              # 需求规格说明书
├── plan.md              # 实施计划方案
├── research.md          # 调研与技术决策
├── data-model.md        # 结构映射与重构对照
├── quickstart.md        # 验证与测试指南
└── contracts/
    └── component-structure.md # UI 与 Extension 目录结构规范
```

### Source Code (repository root)

```text
frontend/src/components/DocEditor/
├── DocEditor.module.css        # 拆分后的主/基础容器 CSS
├── index.tsx                   # 编辑器主入口
├── types.ts                    # 类型定义
├── components/                 # 所有 React UI 子组件目录
│   ├── BlockTypeMenu/
│   ├── BubbleToolbar/
│   ├── Callout/
│   ├── CodeBlock/
│   ├── ColorPicker/
│   ├── DragHandle/
│   ├── DrawIO/
│   ├── ImageBlock/             # (新迁移) 图片块 UI 组件及 ImageBlock.module.css
│   ├── NonTextBlockToolbar/
│   ├── SlashMenu/
│   ├── TableBubbleMenu/
│   └── UnifiedBlockToolbar/
└── extensions/                 # 纯 Tiptap 扩展与插件配置
    ├── CalloutExtension.ts
    ├── CustomTableExtensions.ts
    ├── DoubleTapInsertPlugin.ts
    ├── DragHandlePlugin.ts
    ├── DrawIOExtension.ts
    ├── FontSizeMark.ts
    └── ImageBlockExtension.ts  # (规范后) 仅包含扩展逻辑，引用 components/ImageBlock 视图
```

**Structure Decision**: 采用自包含组件体系与规范化的拓展拆分策略，完全符合 Option 2 (Web application) 的前端组件化最佳实践。

## Complexity Tracking

*未触发违规项，无需复杂度追踪说明*
