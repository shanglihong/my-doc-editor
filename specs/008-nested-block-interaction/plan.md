# Implementation Plan: 内嵌 Block 交互优化与空白 Block 双击插入

**Branch**: `008-nested-block-interaction` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-nested-block-interaction/spec.md`

## Summary

实现内嵌 Block 交互优化与空白 Block 双击插入两项核心功能：
1. **双击插入空白 Block**: 开发 `DoubleTapInsertPlugin` 扩展，通过拦截 `dblclick` 事件，精准计算双击所在 Block 下边缘或块间空白位置，通过 ProseMirror 事务在该位置追加空白段落 Block 并自动聚焦光标。
2. **工具菜单栏优先与互斥展示**: 开发 `getActiveToolbarInfo` 统一层级调度逻辑，遍历当前选区祖先节点链，按节点深度 `depth` 判定唯一活动菜单（`text` / `table` / `callout` / `image`），解耦并限制各个 Bubble Menu 组件的显隐，消除多菜单重叠挤压现象。

## Technical Context

**Language/Version**: TypeScript / React 18 / TipTap 2.x / ProseMirror
**Primary Dependencies**: `@tiptap/react`, `@tiptap/core`, `@tiptap/pm`
**Storage**: N/A (编辑器交互层)
**Testing**: Vitest + React Testing Library
**Target Platform**: Modern Desktop/Mobile Web Browsers
**Project Type**: React Web Application
**Performance Goals**: 双击插入响应 < 50ms，菜单优先级计算 < 5ms，菜单显隐切换零重叠
**Constraints**: 不破坏既有快捷菜单、拖拽句柄及富文本编辑逻辑

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **原则一：代码质量至上 (KISS & DRY)**: 采用统一的 `toolbarPriority.ts` 计算层级，无冗余多重判断；使用单一插件统一处理双击事件。 -> **PASS**
- **原则二：严格测试标准**: 为 `toolbarPriority` 调度逻辑与 `DoubleTapInsertPlugin` 补充单元测试。 -> **PASS**
- **原则三：用户体验一致性**: 解决浮动菜单重叠遮挡问题，确保块间插入交互符合自然直觉。 -> **PASS**
- **原则六：规范与文档中文表达**: Spec、Plan、Research、Data Model、Quickstart 及任务全中文撰写，全相对路径引用，无 Emoji 图标。 -> **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/008-nested-block-interaction/
├── spec.md              # 需求规格说明书
├── plan.md              # 本实施计划文件
├── research.md          # 技术架构与方案研究
├── data-model.md        # 核心数据结构与状态转移定义
├── quickstart.md        # 端到端功能验证指南
└── checklists/
    └── requirements.md  # 规格质量校验清单
```

### Source Code Layout

```text
frontend/
├── src/
│   ├── components/
│   │   └── DocEditor/
│   │       ├── components/
│   │       │   ├── BubbleToolbar/          # 文本选区气泡工具栏
│   │       │   ├── TableBubbleMenu/        # 表格气泡工具栏
│   │       │   └── Callout/               # 高亮块气泡工具栏
│   │       ├── extensions/
│   │       │   ├── DoubleTapInsertPlugin.ts # [NEW] 双击块间插入空白 Block 插件
│   │       │   └── ImageBlock/             # 图片 Block 视图与气泡菜单
│   │       ├── utils/
│   │       │   └── toolbarPriority.ts      # [NEW] 工具栏层级调度算法
│   │       └── index.tsx                   # 编辑器主入口与插件集成
└── __tests__/
```

**Structure Decision**: 采用前端 React 单应用结构，所有变动集中在 `frontend/src/components/DocEditor` 模块中。

## Proposed Changes

### Component: DocEditor (Editor Core & Extensions)

#### [NEW] [toolbarPriority.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/utils/toolbarPriority.ts)
- 实现 `getActiveToolbarInfo(editor: Editor | null)` 函数，遍历 `$anchor` 祖先树，按最深层级 `depth` 决定唯一活显示的 `ToolbarType` (`'text' | 'table' | 'callout' | 'image' | null`)。

#### [NEW] [DoubleTapInsertPlugin.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/DoubleTapInsertPlugin.ts)
- 实现 TipTap Extension `DoubleTapInsertPlugin`，拦截 DOM `dblclick` 事件，计算点击位置归属并插入空白 `paragraph` 节点，定位焦点。

#### [MODIFY] [BubbleToolbar/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)
- 在位置更新逻辑中调用 `getActiveToolbarInfo`，当胜出类型不为 `'text'` 时自动重置 `visible: false`。

#### [MODIFY] [TableBubbleMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)
- 在位置更新逻辑中调用 `getActiveToolbarInfo`，当胜出类型不为 `'table'` 时自动重置 `visible: false`。

#### [MODIFY] [CalloutBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)
- 在位置更新逻辑中调用 `getActiveToolbarInfo`，当胜出类型不为 `'callout'` 时自动重置 `visible: false`。

#### [MODIFY] [ImageBlockView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx)
- 在 `ImageBubbleMenu` 渲染判定中接入层级校验，防止被外层 `Callout` 等父 Block 菜单遮挡。

#### [MODIFY] [DocEditor/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/index.tsx)
- 注册 `DoubleTapInsertPlugin` 扩展至编辑器实例。

---

## Verification Plan

### Automated Tests
- 在 `frontend/src/components/DocEditor/__tests__/` 下编写与扩展单元测试：
  - `toolbarPriority.test.ts`: 测试独立文本选区、Callout 内文本、Table 内文本、Callout 内 Table、Callout 内 ImageBlock 等场景下的 `getActiveToolbarInfo` 输出结果，确保层级最深者胜出。
  - `DoubleTapInsertPlugin.test.ts`: 测试模拟 `dblclick` 事件在 Block 下方触发时，ProseMirror 文档中成功插入空白 `paragraph` 节点。

### Manual Verification
- 参照 [quickstart.md](quickstart.md) 逐步在浏览器界面（http://localhost:5173/）中验证双击插入及多层内嵌 Block 菜单独立显示的最终效果。
