# Implementation Plan - 块工具栏与拖拽按钮交互修复

**Feature Branch**: `016-block-tool-interaction-fix`
**Created**: 2026-08-15
**Status**: Draft

## 技术上下文

- **目标组件**: `DocEditor` (`TableBubbleMenu`, `CodeBlockComponent`, `ImageBlockView`, `DrawIOView`, `UnifiedBlockToolbar`, `DragHandleUI`)
- **关键设计**:
  1. 通过 `menuState.tablePos` 结合 `deleteRange` 解决未定位单元格时的表格删除问题。
  2. 使用 `HIDE_ALL_FLOATING_MENUS` 全局事件与 `hoverStackManager` 互斥控制，确保点击/拖拽 DragHandle 时隐藏 Block Tool。
  3. 使用 `HIDE_DRAG_HANDLE` 全局事件，确保点击 Block Tool 时隐藏拖拽按钮。

## 架构检查与规程

- [x] **架构原则校验**: 符合 KISS 原则，不引入复杂第三方库，基于原生 React & Tiptap 事件流进行响应式状态互斥。
- [x] **语言规范**: 统一采用全中文编写。

## 实施阶段与步骤

### Phase 0: 调研与设计确认 (research.md)
- 明确 Table 块节点的精确范围删除命令。
- 确认悬浮菜单与 DragHandle 的相互隐藏触发机制。

### Phase 1: 设计文档 (data-model.md & quickstart.md)
- 定义 UI 显隐交互状态模型。
- 提供验证场景清单。
