# Implementation Plan: 文案选择工具栏文本块类型切换 (Text Toolbar Block Type Switch)

**Branch**: `013-text-toolbar-block-type-switch` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `spec.md`

## Summary

在文档编辑器的选中文本浮动工具栏（BubbleToolbar / 文案选择工具栏）中，移除原本用于设定字号大小的下拉控件，替换为文本块类型（Block Type Selector）切换下拉菜单。菜单展开后支持将选中的文本/段落转换为正文、标题 1、标题 2、标题 3、无序列表、有序列表、待办列表 (Todo Block / Task List) 等格式。

## Technical Context

**Language/Version**: TypeScript 5.x / React 18

**Primary Dependencies**: @tiptap/react, @tiptap/pm, lucide-react

**Storage**: React State / TipTap ProseMirror Editor State

**Testing**: Vitest / React Testing Library

**Target Platform**: Modern Web Browsers (Chrome, Safari, Firefox, Edge)

**Project Type**: React Web Application Component

**Performance Goals**: 菜单展开与块类型切换处理延迟在 100ms 以内

**Constraints**: 符合现有设计规范，禁止出现布局溢出或内容丢失，保证代码简洁性 (KISS 原则)

**Scale/Scope**: 作用于 `BubbleToolbar` 组件及 `BlockTypeMenu` 的文本 Block 类型声明

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **原则一：代码质量至上 (Code Quality Excellence)**: 通过复用 TipTap 的链式 Command 及既有浮动定位工具类，避免冗余和过度封装。符合 KISS 原则。
- **原则二：严格测试标准 (Rigorous Testing Standards)**: 为 `BubbleToolbar` 文本块类型切换编写测试用例。
- **原则三：用户体验一致性 (UX Consistency & Modern Design)**: 遵循统一工具栏视觉风格与动画体验。
- **原则四：高性能与高响应性 (Performance & Responsiveness)**: 纯轻量级 DOM 状态与 TipTap 事务交互，无昂贵计算。
- **原则六：规范与文档中文表达 (Specification & Language Standards)**: 方案设计与技术文档全量使用中文书写。

**Gate Status**: Passed (全部通过)

## Project Structure

### Documentation (this feature)

```text
specs/013-text-toolbar-block-type-switch/
├── spec.md              # 需求规范
├── plan.md              # 实施计划 (本文档)
├── research.md          # 阶段 0 技术调研
├── data-model.md        # 阶段 1 数据模型
├── quickstart.md        # 阶段 1 快速验证指南
├── contracts/           # 阶段 1 契约定义
│   └── text-toolbar-block-type-selector.md
└── checklists/
    └── requirements.md  # 规范质量检查清单
```

### Source Code (repository root)

```text
frontend/
└── src/
    └── components/
        └── DocEditor/
            ├── components/
            │   ├── BubbleToolbar/
            │   │   ├── index.tsx                # 修改：移除字号控件，集成文本块类型下拉选择器
            │   │   └── BubbleToolbar.module.css # 修改/补充：文本块类型下拉按钮与菜单样式
            │   └── BlockTypeMenu/
            │       └── index.tsx                # 修改：增加待办列表 (Todo Block) 选项支持
            └── __tests__/
                └── BubbleToolbar.test.tsx       # 新增/修改：单元测试
```

**Structure Decision**: Web 前端应用单体组件演进结构。修改位于 `frontend/src/components/DocEditor/components/` 及其子文件夹中。

## Complexity Tracking

*未触发任何宪章违反，无需额外记录复杂性特批。*
