# 实施任务清单: 菜单防遮挡与完整可见性优化

**Feature Branch**: `006-fix-menu-clipping` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup (共享基础配置)

**目的**: 确认环境与辅助基础定义

- [x] T001 检查项目构建与开发环境配置

---

## Phase 2: Foundational (阻塞性基础设施)

**目的**: 核心防遮挡定位算法与通用工具函数扩展（必须在各用户故事实现前完成）

- [x] T002 在 [floatingPosition.ts](../../frontend/src/components/DocEditor/utils/floatingPosition.ts) 中增强 `calculateSmartPosition` 函数，完善 Top/Left 钳制算法与视口极值边界限制
- [x] T003 在 [floatingPosition.ts](../../frontend/src/components/DocEditor/utils/floatingPosition.ts) 中实现 `calculateSubMenuPosition` 二级弹出面板定位与方向反转计算工具

**检查点**: 基础定位算法就绪，用户故事可并行展开

---

## Phase 3: User Story 1 - 斜杠菜单 (Slash Menu) 防遮挡 (Priority: P1) 🎯 MVP

**目标**: 解决斜杠菜单 `/` 在靠近视口底部或长文档末尾时被屏幕裁切遮挡的问题

**独立测试**: 在文档顶部、底部及靠近屏幕边界处输入 `/` 唤起菜单，确认菜单全量展示在视口内

- [x] T004 [US1] 改造 [SlashMenuPlugin.ts](../../frontend/src/components/DocEditor/components/SlashMenu/SlashMenuPlugin.ts) 中的 `onStart` 与 `onUpdate` 定位逻辑，调用 `calculateSmartPosition` 动态检测视口边界
- [x] T005 [US1] 调整 [DocEditor.module.css](../../frontend/src/components/DocEditor/DocEditor.module.css) 中的 `slashMenu` 样式，设置标准 z-index (99999) 和滚动遮挡保护

**检查点**: 斜杠菜单独立测试通过，无底部截断现象

---

## Phase 4: User Story 2 - 文本工具栏与块级气泡菜单完整防遮挡 (Priority: P1)

**目标**: 解决选中文本浮动工具栏、Callout 气泡菜单、表格气泡菜单及其子颜色选择器的遮挡截断问题

**独立测试**: 选中文本或高亮块/表格，点击展开字号、前景色、背景高亮色及预设主题，确认子面板不冲出屏幕边界

- [x] T006 [P] [US2] 改造 [BubbleToolbar/index.tsx](../../frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)，将字号选择器、文字前景色与背景高亮色子面板接入防溢出钳制与方向计算
- [x] T007 [P] [US2] 改造 [CalloutBubbleMenu.tsx](../../frontend/src/components/DocEditor/components/Callout/CalloutBubbleMenu.tsx)，将其预设主题面板与 UnifiedColorPicker 边框/背景面板接入智能防遮挡翻转逻辑
- [x] T008 [P] [US2] 改造 [TableBubbleMenu/index.tsx](../../frontend/src/components/DocEditor/components/TableBubbleMenu/index.tsx)，将其单元格背景色 UnifiedColorPicker 子面板接入动态智能定位
- [x] T009 [P] [US2] 优化 [UnifiedColorPicker.module.css](../../frontend/src/components/DocEditor/components/ColorPicker/UnifiedColorPicker.module.css)，配置防视口挤压样式与 z-index 体系

**检查点**: 选中文本与块级气泡菜单及其子面板均可正常防遮挡展开

---

## Phase 5: User Story 3 - 拖拽手柄及其他组件浮动菜单视口自适应 (Priority: P2)

**目标**: 确保拖拽手柄菜单与块类型选择下拉菜单在边界视口下自适应平移

**独立测试**: 在缩窄窗口或靠右边缘触发拖拽手柄与块类型下拉框，确认菜单不超出屏幕右侧

- [x] T010 [P] [US3] 检查并改造 [DragHandle/index.tsx](../../frontend/src/components/DocEditor/components/DragHandle/index.tsx) 拖拽手柄菜单，确保靠右或靠底时防超出视口
- [x] T011 [P] [US3] 检查并改造 [BlockTypeMenu/index.tsx](../../frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) 块类型选择菜单的下拉定位防溢出

**检查点**: 所有菜单均具备视口防遮挡自适应能力

---

## Phase 6: Polish & Cross-Cutting Concerns (优化与校验)

**目的**: 自动化测试覆盖与整体验证

- [x] T012 补充/更新 [CalloutBubbleMenu.test.tsx](../../frontend/src/components/DocEditor/__tests__/CalloutBubbleMenu.test.tsx) 和 [TableBubbleMenu.test.tsx](../../frontend/src/components/DocEditor/__tests__/TableBubbleMenu.test.tsx) 单元测试，添加防遮挡计算断言
- [x] T013 按照 [quickstart.md](quickstart.md) 验证指南，手动在浏览器验证各边界条件下的菜单显示情况

---

## 依赖关系与执行顺序

### 阶段依赖

- **Phase 1 (Setup)**: 无依赖
- **Phase 2 (Foundational)**: 依赖 Phase 1 - 阻塞后续所有用户故事
- **Phase 3 (User Story 1 - Slash Menu)**: 依赖 Phase 2 基础算法完成
- **Phase 4 (User Story 2 - Toolbar/Callout/Table)**: 依赖 Phase 2 基础算法完成，可与 Phase 3 并行
- **Phase 5 (User Story 3 - DragHandle/BlockType)**: 依赖 Phase 2 基础算法完成
- **Phase 6 (Polish)**: 依赖所有用户故事完成

### 并行开发机会

- Phase 4 中的 T006, T007, T008, T009 可并行开发（位于不同组件文件内）
- Phase 5 中的 T010, T011 可并行开发

---

## 实施策略

### MVP 方案 (优先交付 User Story 1)

1. 完成 Phase 1 Setup 与 Phase 2 Foundational 算法
2. 完成 Phase 3 斜杠菜单防遮挡
3. 验证斜杠菜单功能
4. 顺序推进后续用户故事
