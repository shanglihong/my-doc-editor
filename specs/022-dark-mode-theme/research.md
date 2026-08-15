# Research: Dark Mode Theme Architecture

## Decisions

### 1. 主题控制机制
- **Decision**: 使用 HTML 根节点属性 `<html data-theme="dark">` 结合 CSS 自定义变量 (CSS Variables) 进行主题切换。
- **Rationale**: 
  - 零运行开销，无需在每一个 React 组件重绘时深度传参。
  - 完美适配现有全局 CSS 变量（如 `--de-bg-body`, `--de-text-main`），全组件一键响应。
  - 非常容易与 `localStorage` 进行状态持久化绑定。

### 2. 按钮固定定位方案
- **Decision**: 左下角固定定位 `position: fixed; bottom: 24px; left: 24px; z-index: 1000;`
- **Rationale**: 不侵入正文编辑容器与左上角 TOC 大纲菜单，交互边界极为清晰。
