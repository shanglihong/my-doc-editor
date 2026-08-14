# 实施计划: 菜单防遮挡与完整可见性优化

**Branch**: `006-fix-menu-clipping` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: 来自 [spec.md](spec.md) 的需求规范

## 概要

针对编辑器内各类浮动菜单（斜杠菜单 `/`、文本选中浮动工具栏、Callout 气泡菜单、表格气泡菜单、拖拽手柄菜单以及二级颜色选择面板）在靠近视口边缘或深层容器时出现的截断遮挡问题，实施统一的视口防遮挡防裁剪与智能定位计算。通过升级 `floatingPosition.ts` 的算法，为所有一级与二级菜单引入边界感知、方向自动翻转与坐标钳制机制，确保 100% 菜单项在所有视口条件下完整可见。

## 技术上下文

**Language/Version**: React 18 / TypeScript 5 / CSS Modules

**Primary Dependencies**: Tiptap Prosemirror Editor Core, Lucide React

**Storage**: N/A (纯前端 UI 交互与定位)

**Testing**: Vitest, React Testing Library

**Target Platform**: Web 浏览器 (Desktop / Tablet / Mobile 视口)

**Project Type**: Web 前端富文本编辑器组件

**Performance Goals**: 60 fps 实时滚动跟手定位，无卡顿无闪烁

**Constraints**: 不引入额外的重型定位依赖库，保持代码简洁轻量 (KISS)

**Scale/Scope**: 涵盖编辑器内 6 大类核心浮动菜单与弹出面板

## 宪章检查 (Constitution Check)

*门禁校验：符合 My Docs 项目宪章 (v1.1.0)*

1. **代码质量至上 (KISS & DRY)**: 通过增强现有的 `floatingPosition.ts` 通用定位工具，复用同一套算法，避免重复造轮子，无过度工程化。
2. **测试驱动与验证**: 完善已有的组件单元测试（如 `TableBubbleMenu.test.tsx`、`CalloutBubbleMenu.test.tsx`）并添加防遮挡计算逻辑测试。
3. **用户体验一致性**: 统一浮动菜单弹出、避让与层级（z-index）体系，提供流畅一致的微交互体验。
4. **规范与文档中文表达**: 所有设计规范、实施计划与技术产物统一使用中文书写。

## 项目结构

### 需求与设计文档

```text
specs/006-fix-menu-clipping/
├── plan.md              # 实施计划
├── research.md          # 选型与方案决策
├── data-model.md        # 视图模型与定位实体定义
├── quickstart.md        # 快速测试验证指南
└── contracts/
    └── floating-menu-contract.md # 定位接口契约
```

### 源代码目录布局

```text
frontend/
└── src/
    └── components/
        └── DocEditor/
            ├── components/
            │   ├── BlockTypeMenu/       # 块类型下拉菜单
            │   ├── BubbleToolbar/       # 文本格式浮动工具栏
            │   ├── Callout/             # Callout 气泡菜单与预设主题面板
            │   ├── ColorPicker/         # 统一颜色选择面板
            │   ├── DragHandle/          # 拖拽手柄菜单
            │   ├── SlashMenu/           # 斜杠菜单与 Suggestion 插件
            │   └── TableBubbleMenu/     # 表格气泡菜单
            ├── utils/
            │   └── floatingPosition.ts  # 智能边界检测与防遮挡定位通用算法
            └── DocEditor.module.css     # 菜单样式与 z-index 体系定义
```

**结构说明**: 修改将集中在 `floatingPosition.ts` 的通用逻辑扩展，以及各大菜单组件/插件对防遮挡定位的统一接入与 CSS 修正。

## 复杂性追踪

*无违规项目。方案完全符合项目宪章原则。*
