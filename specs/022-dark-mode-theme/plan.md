# Implementation Plan: 022-dark-mode-theme 深色模式与左下角一键切换

**Feature Directory**: [specs/022-dark-mode-theme](../spec.md)  
**Status**: Planning Complete  

---

## Technical Context

- **Tech Stack**: React 18 / TypeScript / Vite / Tailwind CSS / Vanilla CSS Variables  
- **Architecture**:
  - CSS Variables Token Layer (`:root` 与 `[data-theme="dark"]`)
  - Theme State Hook (`useTheme`) 负责全局 `data-theme` 属性调度与 `localStorage` 恢复
  - Fixed Controller (`<ThemeToggle />`) 位于左下角固定层

---

## Architecture & Design Artifacts

- [research.md](./research.md) — 决定使用 HTML `data-theme` 属性与 CSS 变量双向绑定的方案
- [data-model.md](./data-model.md) — 主题状态与颜色 Token 体系定义
- [quickstart.md](./quickstart.md) — 功能场景验证步骤

---

## Proposed Changes

### [ThemeToggle Component]

#### [NEW] [index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/ThemeToggle/index.tsx)
- 左下角 `fixed` (`bottom: 24px; left: 24px; z-index: 1000`) 定位。
- Lucide 图标动态切换：浅色状态显示 `Moon` 图标；深色状态显示 `Sun` 图标。

### [Global Styling & Tokens]

#### [MODIFY] [index.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/index.css)
- 定义 `[data-theme="dark"]` 暗调背景色 `#0f172a` 与正文文字色 `#f8fafc`。

#### [MODIFY] [DocEditor.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/DocEditor.module.css)
- 在暗色模式下适配 `ProseMirror` 容器、代码块、高亮块、拖拽手柄、浮动工具栏色值。

#### [MODIFY] [TableOfContents.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/TableOfContents/TableOfContents.module.css)
- 暗色模式下大纲项目与图标的色值调优。
