# 任务清单: 拖拽菜单文本与代码块类型切换平铺及删除图标

**功能分支**: `014-drag-menu-type-switch` | **日期**: 2026-08-14 | **功能规范**: [spec.md](./spec.md) | **实施计划**: [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**目的**: 确认组件基线与依赖关系

- [x] T001 检查并确认开发运行环境与 TipTap 编辑器组件结构 [BlockTypeMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

**目的**: 建立块类型分类基线与平铺容器基础 CSS 结构

- [x] T002 在 [BlockTypeMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) 中定义文本块与代码块的分类集合常量 (`TEXT_BLOCK_TYPES`, `CODE_BLOCK_TYPE`) 及组件 Props 扩展
- [x] T003 [P] 在 [BlockTypeMenu.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/BlockTypeMenu.module.css) 中配置横向单排 Icon 工具栏容器的 Flex 布局与基本阴影样式

---

## Phase 3: User Story 1 - 平铺展示文本与代码块类型切换 Icon 图标 (Priority: P1) 🎯 MVP

**目标**: 将拖拽侧边菜单的块类型转换升级为横向平铺 Icon 图标工具栏

**独立测试**: 在段落或代码块上触发拖拽侧边菜单，验证直接平铺显示可切换的 Icon 图标，点击可完成块类型转换

- [x] T004 [US1] 在 [BlockTypeMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) 中将下拉列表菜单重构为横向 Icon 按钮列表，集成段落、标题1-3、列表、待办、引用、高亮与代码块切换逻辑
- [x] T005 [P] [US1] 在 [BlockTypeMenu.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/BlockTypeMenu.module.css) 中实现各 Icon 按钮的尺寸、圆角、hover 悬停提示背景视觉样式
- [x] T006 [US1] 在 [DocEditor/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/index.tsx) 中传递当前选中的 `nodeType` 参数给 `BlockTypeMenu`

---

## Phase 4: User Story 2 - 在平铺菜单最末尾展示删除图标 (Priority: P1)

**目标**: 在平铺 Icon 列表的最右侧/最后面固定提供删除图标，点击可删除当前块

**独立测试**: 打开任意支持拖拽菜单的块，检查图标列表最右侧/最后面是否固定显示删除 Icon，点击验证删除功能

- [x] T007 [US2] 在 [BlockTypeMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) 最右侧末尾位置增加分割线与危险态删除图标按钮 (`Trash2`)，绑定删除块逻辑
- [x] T008 [P] [US2] 在 [BlockTypeMenu.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/BlockTypeMenu.module.css) 中为末尾删除按钮添加浅红色 Hover 危险态样式及分割线样式
- [x] T009 [US2] 在 [DocEditor/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/index.tsx) 中向 `BlockTypeMenu` 传递 `nodeSize` 参数，确保删除范围准确

---

## Phase 5: User Story 3 - 限制非文本与非代码块的类型切换 (Priority: P2)

**目标**: 对图片、图表、表格等非文本非代码块隐藏类型转换 Icon，仅保留末尾删除图标

**独立测试**: 在图片块或图表块上打开拖拽菜单，验证是否隐藏文本和代码块切换图标，仅显示末尾删除图标

- [x] T010 [US3] 在 [BlockTypeMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) 中添加判定逻辑：当 `nodeType` 为非文本块且非代码块时，隐藏类型转换 Icon 集合，仅渲染末尾删除图标

---

## Phase 6: Polish & Cross-Cutting Concerns

**目的**: 体验调优与完整流程校验

- [x] T011 [P] 在 [BlockTypeMenu/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx) 中优化 Tooltip 悬停提示与智能浮动定位 `calculateSmartPosition` 参数
- [x] T012 按照 [quickstart.md](./quickstart.md) 指南在浏览器中进行端到端功能验证

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖
- **Foundational (Phase 2)**: 依赖 Setup 完成 - 阻断所有 User Story
- **User Stories (Phase 3+)**: 依赖 Foundational 完成
  - US1 (P1) 与 US2 (P1) 可并行开发，并构成 MVP 核心
  - US3 (P2) 在基础与类型判断就绪后集成
- **Polish (Phase 6)**: 依赖所有 User Story 完成

### Parallel Opportunities

- T003 与 T002 可并行处理（CSS 与逻辑）
- T005 [P] 与 T004 可并行处理
- T008 [P] 与 T007 可并行处理
- T011 [P] 可与快速验证独立并行
