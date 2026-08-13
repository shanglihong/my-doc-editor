# Implementation Plan: Block Style and Menu Adjustments

**Branch**: `003-block-style-menu-adjustments` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-block-style-menu-adjustments/spec.md`

## Summary

本计划旨在全面提升文档编辑器的组件与菜单视觉风格，实现以下关键优化：
1. 统一各 Block 组件的 DOM 样式与排版规范，整体保持现代极简与高质感设计；
2. 改造悬浮工具栏（BubbleToolbar）与各类浮动菜单的定位逻辑，具备边缘感知机制，在上方空间不足时自动调整至选区下方，防止被浏览器视口或容器遮盖；
3. 设计一套多彩且极简统一的 Block 类型图标体系（BlockIconSystem）；
4. 增强拖拽控制区（DragHandle）：在拖拽按钮左侧集成 Block Icon（非空 Block 显示对应彩色类型图标，空 Block 显示加号图标），点击均可触发 Block 类型切换/插入菜单。

## Technical Context

**Language/Version**: TypeScript 5.x, React 18
**Primary Dependencies**: @tiptap/react, @tiptap/pm, lucide-react, CSS Modules
**Storage**: N/A (编辑器纯前端 DOM / State 交互)
**Testing**: Vitest / React Testing Library (前端单元与组件测试)
**Target Platform**: Web Browsers (Chrome/Safari/Firefox/Edge)
**Project Type**: Web application / Rich-text doc editor component
**Performance Goals**: 菜单响应与定位计算延迟 < 16ms (60fps 帧率)，无视口抖动
**Constraints**: 维持现有 Tiptap 扩展架构与数据结构兼容，避免重构既有数据层
**Scale/Scope**: 涵盖通用文本 Block、标题 1-3、列表、代码块、引用、Callout、DrawIO 图表等所有文档节点

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- 简洁至上（KISS 原则）：使用极其轻量的边缘坐标算法与纯粹的组件化扩展，避免引入沉重的第三方重构。
- 深度分析（第一性原理）：重构悬浮把手 DOM 与提示定位机制，确保空块与非空块逻辑无缝衔接。
- 事实为本：全量界面与功能改动均经单元测试与交互验证。

## Project Structure

### Documentation (this feature)

```text
specs/003-block-style-menu-adjustments/
├── plan.md              # 本计划文件
├── research.md          # Phase 0 调研与解决方案
├── data-model.md        # Phase 1 实体与状态模型
├── quickstart.md        # Phase 1 验证指南
└── contracts/           # Phase 1 接口与组件契约
```

### Source Code (repository root)

```text
frontend/
└── src/
    └── components/
        └── DocEditor/
            ├── DocEditor.module.css               # 样式统一与极简规范调整
            ├── index.tsx                           # 主编辑器集成与事件路由
            ├── components/
            │   ├── BubbleToolbar/                 # 智能悬浮工具栏（带防遮挡与方向自动反转）
            │   ├── DragHandle/                    # 增加 Block Icon / Plus Icon 及下拉菜单触发
            │   ├── BlockTypeMenu/                 # 新增：Block 类型切换 Popover 菜单组件
            │   └── SlashMenu/                     # Slash 菜单统一图标与样式优化
            ├── utils/
            │   ├── blockIcons.tsx                 # 新增：多彩统一 Block 图标映射表与组件
            │   └── floatingPosition.ts            # 新增：通用的浮动定位与防遮挡边界计算工具
            └── extensions/
                └── DragHandlePlugin.ts            # 更新：支持空 Block 触发与坐标精度优化
```

**Structure Decision**: 采用 Web application (Frontend 组件模块化扩展) 结构，集中于 `frontend/src/components/DocEditor` 目录及其子模块。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 无违反项 | N/A | N/A |
