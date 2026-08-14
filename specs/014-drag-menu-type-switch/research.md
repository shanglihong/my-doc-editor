# 技术调研与决策报告: 拖拽菜单文本与代码块类型切换平铺及删除图标

**功能分支**: `014-drag-menu-type-switch`
**日期**: 2026-08-14

## 调研主题 1: 拖拽侧边菜单布局从垂直下拉改为单排平铺 Icon 工具栏

- **决策**: 将 `BlockTypeMenu` 的 UI 布局重构为水平平铺图标条（Horizontal Icon Bar），CSS 采用 `display: flex; flex-direction: row; align-items: center; gap: 4px; padding: 6px 8px;` 布局。
- **理由**:
  - 用户明确要求“菜单平铺 icon 图标即可”。
  - 相比垂直下拉选单，水平平铺图标占用的纵向空间更小，在侧边操作时点击路径最短，符合 KISS 与 Modern UI UX 原则。
- **被拒绝的替代方案**:
  - 继续沿用带标题和多行文本描述的纵向下拉选单。被拒绝原因：不符合用户平铺 Icon 的直观操作需求。

## 调研主题 2: 块类型切换作用域控制

- **决策**: 定义块分类判定逻辑：
  - 文本类块: `paragraph`, `heading` (L1-L3), `bulletList`, `orderedList`, `taskList`, `blockquote`, `callout`
  - 代码类块: `codeBlock`
  - 当 `nodeType` 属于文本块或代码块时，平铺展示该两类块互相转换的 Icon 集合。
  - 当 `nodeType` 属于非文本非代码块（如 `imageBlock`, `drawioBlock`, `table` 等）时，隐藏类型转换 Icon 集合。
- **理由**: 避免对复杂多媒体或结构化块执行非法/无意义的转换逻辑。

## 调研主题 3: 菜单末尾固定展示删除图标

- **决策**: 在平铺 Icon 列表的最右侧（最后面），添加垂直分隔线（Divider）及删除图标按钮（包含 `Trash2` Lucide 图标与危险态 hover 样式）。
- **理由**:
  - 用户显式需求：“全部展示删除的图标，在最后面”。
  - 满足所有类型 Block 在拖拽菜单中的一键删除操作，提升功能完整性。

## 调研主题 4: 浮动定位尺寸调致

- **决策**: 在 `calculateSmartPosition` 中更新平铺菜单的计算基准尺寸：`menuWidth` 设为 `380px`，`menuHeight` 设为 `44px`。
- **理由**: 平铺后菜单由纵向伸展变为横向伸展，尺寸更新可防止定位失准或超出容器边界。
