# 实施计划: 拖拽菜单文本与代码块类型切换平铺及删除图标

**分支**: `014-drag-menu-type-switch` | **日期**: 2026-08-14 | **功能规范**: [spec.md](./spec.md)

**输入**: 来自 `/specs/014-drag-menu-type-switch/spec.md` 的功能规范

## 概述

在文档编辑器的拖拽侧边菜单中，将块类型转换交互重构为水平平铺 Icon 图标工具栏。平铺图标仅在文本块与代码块中展示，并支持文本与代码块互相转换；在平铺图标列表的最末尾（最后面位置）固定展示删除图标，满足一键删除需求。

## 技术上下文

**语言/版本**: TypeScript, React 18
**主要依赖**: TipTap Editor (`@tiptap/core`, `@tiptap/react`), Lucide React Icons
**样式组件**: CSS Modules (`BlockTypeMenu.module.css`)
**测试框架**: Vitest / React Testing Library
**目标平台**: Web 浏览器端
**项目类型**: Web frontend component
**性能目标**: 菜单弹出与图标点击响应延迟 < 50ms
**约束条件**: 不得破坏现有 TipTap 选单命令与编辑器拖拽重排功能

## 宪章检查 (Constitution Check)

*门禁状态: 已通过*

- **代码质量至上**: 将原本下拉列表逻辑重构为简练的 Icon Bar 组件，符合 KISS 原则。
- **用户体验一致性**: 统一 Icon 视觉风格与 hover 反馈，末尾固定删除图标建立一致的心理预期。
- **语言规范**: 全流程采用中文规范撰写所有文档。

## 项目结构

### 本功能相关文档

```text
specs/014-drag-menu-type-switch/
├── spec.md              # 需求规范
├── plan.md              # 本实施计划
├── research.md          # Phase 0 调研与决策报告
├── data-model.md        # Phase 1 数据模型与组件架构
├── quickstart.md        # Phase 1 快速验证指南
└── contracts/
    └── ui-contract.md   # Phase 1 UI 契约说明
```

### 源代码文件布局

```text
frontend/src/components/DocEditor/
├── index.tsx                                         # 主编辑器组件，包含 dragState 与 typeMenuState
├── components/
│   ├── BlockTypeMenu/
│   │   ├── index.tsx                                 # 拖拽平铺菜单主组件 (待重构为 Icon Bar)
│   │   └── BlockTypeMenu.module.css                  # 平铺菜单 CSS 样式 (待重构)
│   ├── DragHandle/
│   │   └── index.tsx                                 # DragHandle 侧边拖拽柄组件
│   └── utils/
│       └── blockIcons.tsx                            # 块类型图标映射工具
```

**结构决策**: 修改已有的 `BlockTypeMenu` 组件及对应 CSS Modules，在 `DocEditor/index.tsx` 中向 `BlockTypeMenu` 传递 `nodeType` 参数。

## 复杂性追踪

*无违规事项，不增加额外复杂性。*
