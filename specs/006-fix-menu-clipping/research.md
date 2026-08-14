# 技术调研与方案决策: 菜单防遮挡与完整可见性优化

**Feature Branch**: `006-fix-menu-clipping`

**Created**: 2026-08-14

## 核心技术选型与决策

### 决策 1: 采用基于视口的绝对/固定坐标系统与 Floating-UI 式智能算法

- **决策方案**: 增强已有的 `floatingPosition.ts` 工具算法，统一使用浏览器视口 (Window Viewport) 和主容器作为边界限制。
- **决策依据**:
  - Tiptap 的 `ReactRenderer` 浮动组件（如斜杠菜单 `/`）挂载在 `document.body` 上，使用 `fixed` 定位。原代码硬编码 `top = rect.bottom + 6`，在底部出现时必遮挡。
  - 组件气泡菜单（如 `CalloutBubbleMenu`、`TableBubbleMenu`、`BubbleToolbar`）挂载在编辑器相对容器中，使用 `absolute` 定位。其一级气泡菜单已调用 `calculateSmartPosition`，但二级下拉面板（如 `UnifiedColorPicker`）之前写死了方向或缺少横向视口溢出钳制。
- **替代方案对比**:
  - *替代方案 A*: 引入第三方库 Popper.js / Floating UI。
    - *被否决原因*: 引入外部新依赖会增加项目包体积，且目前已有轻量级 `calculateSmartPosition` 工具，只需对斜杠菜单和子弹出层面板加以完善即可满足 KISS 原则与宪章轻量要求。
  - *替代方案 B*: CSS纯 `overflow: visible` 方案。
    - *被否决原因*: 无法解决滚动容器（如外层视口或 modal 框）剪裁问题，亦无法动态反转弹出方向。

---

### 决策 2: 斜杠菜单 (SlashMenu) 的动态视口防断层计算

- **决策方案**:
  在 `SlashMenuPlugin.ts` 的 `onStart` 与 `onUpdate` 中，通过 `calculateSmartPosition` 获取视口边界，动态计算 top 和 left。
  当光标靠近视口底部（即下方剩余空间不足以容纳斜杠菜单高度 280px）时，自动调整为由光标上方向上展开（`top = rect.top - menuHeight - 6`）；若两侧超出，自动调整 left 确保完全留在屏幕内部。
- **决策依据**:
  斜杠菜单是全文档高频操作点，顶部和底部视口边缘是发生遮挡的最主要场景。

---

### 决策 3: 二级弹出面板（ColorPicker / SubDropdown）方向与边距智能反转

- **决策方案**:
  在 `CalloutBubbleMenu`、`TableBubbleMenu` 以及 `BubbleToolbar` 中的二级弹出层（如 `UnifiedColorPicker` 颜色选择器和字号选择列表）增加基于容器/视口位置的智能方向修正逻辑（或动态 Style 计算）。
  当气泡菜单靠近屏幕顶部时，选择器向下弹出；当气泡菜单靠近屏幕底部时，选择器向上弹出；当靠右或靠左时，水平方向自动钳制 `left` 或调整 margin 偏移。
- **决策依据**:
  一级气泡菜单位置居中时，二级弹出层高约 240px，极易突破顶部或底部边界。通过集成视口位置感知的 CSS/Style 修正，可彻底消灭子菜单截断遮挡问题。

---

### 决策 4: z-index 图层分级规范化

- **决策方案**:
  统一编辑器浮动元素的 z-index 体系：
  - `z-index: 900`: 一级气泡菜单（Callout Bubble Menu, Table Bubble Menu, Text Bubble Toolbar）
  - `z-index: 1000`: 气泡菜单内部二级弹出面板（Unified Color Picker, Theme Grid, Font Size List）
  - `z-index: 99999`: 斜杠菜单与悬浮手柄（Slash Menu, Drag Handle Dropdown）
- **决策依据**:
  防止不同菜单重叠时图层互相穿透或被顶部 Navbar/Toolbar 覆盖。
