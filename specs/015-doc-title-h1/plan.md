# 实施计划: DocEditor 内置 H1 文档标题

**Branch**: `015-doc-title-h1` | **Date**: 2026-08-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [spec.md](spec.md)

## 概述

DocEditor 组件需要内置一个固定且不可删除的 H1 文档标题节点，作为整个文档的第一部分。技术方案采用改造 Tiptap 的 Document Schema 规则 (`doc: 'title block+'`) 并添加自定义 `Title` 扩展节点，在 Schema 层、快捷键绑定层以及浮动菜单过滤层提供三重防删除与交互保障，同时配合扩展支持差异化占位符及 Markdown/JSON 的正确解析与导出。

## 技术上下文

**Language/Version**: TypeScript 5.x / React 18
**Primary Dependencies**: `@tiptap/react`, `@tiptap/core`, `@tiptap/starter-kit`, `tiptap-markdown`
**Storage**: N/A (内存文档树数据结构与状态)
**Testing**: Jest, React Testing Library
**Target Platform**: Web (主流桌面与移动端现代浏览器)
**Project Type**: React Web Editor Component
**Performance Goals**: 标题与光标按键响应延迟 < 50ms，渲染无可见闪烁
**Constraints**: 遵守项目宪章，全中文文档，无复杂过度工程化
**Scale/Scope**: DocEditor 基础组件及其配套子组件 (DragHandle, BlockTypeMenu, BubbleToolbar)

## 宪章检查 (Constitution Check)

*GATE: 必须在 Phase 0/1 设计完成前通过。*

- [x] **原则一：代码质量至上**: 采用原生的 Tiptap Extension 机制定义 Title 节点，避免高耦合的外围防删补丁。
- [x] **原则二：严格测试标准**: 编写单元测试验证标题防删除、按键跳转和数据序列化。
- [x] **原则三：用户体验一致性**: 统一 H1 视觉样式与符合直觉的按键及占位符体验。
- [x] **原则四：高性能与高响应性**: 按键与节点操作零阻塞，拦截逻辑时间复杂度均在 O(1)。
- [x] **原则五：架构简洁性**: 沿用项目现有 Tiptap 扩展体系，不引入任何新的第三方依赖。
- [x] **原则六：规范与文档中文表达**: 所有规格说明、实施计划与测试指引全中文呈现，无 emoji 图标。

## 项目结构

### 需求与设计文档

```text
specs/015-doc-title-h1/
├── plan.md              # 实施计划说明
├── research.md          # 架构研究与技术决策
├── data-model.md        # 节点数据模型与 Schema 规范
├── quickstart.md        # 快速验证指南
├── contracts/           # 组件接口与数据契约
│   └── doc-editor-title.md
└── checklists/          # 质量检查清单
    └── requirements.md
```

### 源代码文件目录

```text
frontend/src/components/DocEditor/
├── index.tsx                         # DocEditor 主入口组件
├── types.ts                          # 接口与类型定义
├── extensions/
│   ├── DocumentTitleExtension.ts     # [NEW] 自定义 Document 根节点扩展 (title block+)
│   ├── TitleExtension.ts             # [NEW] 自定义 Title H1 节点扩展
│   ├── DragHandlePlugin.ts           # 过滤 Title 节点的拖拽入口
│   └── ...
├── components/
│   ├── BlockTypeMenu/                # 过滤 Title 节点的类型转换
│   └── ...
└── __tests__/
    └── DocEditorTitle.test.tsx       # [NEW] 标题节点防删除与按键测试
```

**结构决策**: 保持在 `frontend/src/components/DocEditor/` 内做高内聚收拢，新增两个轻量扩展组件并对联动插件做点状保护。

## 复杂度跟踪

> 无宪章违反事项，无需额外的复杂性说明。
