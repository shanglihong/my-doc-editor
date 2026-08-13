# Implementation Plan: 表格 Block 增强与扩展功能

**Branch**: `004-table-block-support` | **Date**: 2026-08-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [spec.md](spec.md)

## Summary

为文档编辑器中的表格 Block 提供完整的动态行列操作（添加/删除行列）、全量块级元素内嵌编辑（段落、代码块、高亮块等）以及矩形区域单元格合并与拆分功能。前端底层完全基于现有的 `@tiptap/extension-table` 插件及其子模块，在 UI 层通过封装 `TableBubbleMenu` 悬浮控制工具栏与样式优化实现。

## Technical Context

**Language/Version**: TypeScript 5.x / React 19.x

**Primary Dependencies**: `@tiptap/react` 3.30.0, `@tiptap/extension-table` 3.30.0, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`

**Storage**: 前端内存状态，序列化保存为 JSON / Markdown 字符串

**Testing**: Vitest / React Testing Library

**Target Platform**: Modern Web Browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: Web Application (React Frontend + DocEditor Component)

**Performance Goals**: 单元格文本输入延迟 < 50ms，合并/拆分渲染 < 100ms

**Constraints**: 避免任何直接修改 DOM 的突变逻辑，遵循 TipTap ProseMirror 事务流与 KISS 原则

**Scale/Scope**: 作用于前端 `DocEditor` 组件及其表格扩展模块

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **原则一：代码质量至上**: 复用官方依赖包 `@tiptap/extension-table` 的已有功能，无需重复造轮子，无过度工程化设计。[PASS]
- **原则二：严格测试标准**: 为新建的表格操作命令以及 `TableBubbleMenu` 提供单元测试与交互测试。[PASS]
- **原则三：用户体验一致性**: 提供直观的表格悬浮菜单（TableBubbleMenu），视觉样式与现有的 BubbleToolbar 保持一致。[PASS]
- **原则四：高性能与高响应性**: 操作直接触发 TipTap Command，不引起二次重排或阻塞。[PASS]
- **原则五：架构简洁性**: 基于标准 React 组件与 TipTap 扩展，不引入复杂中介层。[PASS]
- **原则六：规范与文档中文表达**: Plan 及关联设计文档均使用中文编写。[PASS]

## Project Structure

### Documentation (this feature)

```text
specs/004-table-block-support/
├── plan.md              # 本文件
├── research.md          # Phase 0 输出：技术调研与方案对比
├── data-model.md        # Phase 1 输出：表格节点实体与状态模型
├── quickstart.md        # Phase 1 输出：验证与测试指南
├── contracts/           # Phase 1 输出：接口契约
│   └── table-operations-contract.md # 表格指令与 UI 契约
└── tasks.md             # Phase 2 输出（后续由 /speckit-tasks 生成）
```

### Source Code (repository root)

```text
frontend/
└── src/
    └── components/
        └── DocEditor/
            ├── components/
            │   ├── TableBubbleMenu/ # [NEW] 表格专属悬浮菜单与按钮组
            │   │   ├── index.tsx
            │   │   └── TableBubbleMenu.module.css
            │   └── BubbleToolbar/
            ├── index.tsx            # [MODIFY] 接入 TableBubbleMenu 组件与扩展
            └── DocEditor.module.css # [MODIFY] 补充表格与单元格选区样式
```

**Structure Decision**: 采用 Web Application 架构模式，在前端 `frontend/src/components/DocEditor/components/` 下新增 `TableBubbleMenu`，并更新 `index.tsx` 及 `DocEditor.module.css`。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(无宪章违规项，无需填写)*
