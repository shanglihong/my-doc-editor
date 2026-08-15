# Tasks: 022-dark-mode-theme 深色模式与左下角一键切换

## Phase 1: Global Theme CSS Variables Token Setup

- [x] Task 1.1: 在 [index.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/index.css) 中为 `[data-theme="dark"]` / `html[data-theme="dark"]` 配置深色模式全局 CSS 变量（`--de-bg-body: #0f172a`, `--de-text-main: #f8fafc`, `--de-border-color: #334155` 等）。
- [x] Task 1.2: 在 [DocEditor.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/DocEditor.module.css) 与 [TableOfContents.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/components/TableOfContents/TableOfContents.module.css) 中补充适配深色主题的 CSS Token 变量引用。

## Phase 2: ThemeToggle Component & Hook

- [x] Task 2.1: 创建 [ThemeToggle/index.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/ThemeToggle/index.tsx) 与 [ThemeToggle.module.css](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/ThemeToggle/ThemeToggle.module.css)，实现左下角 `fixed` 悬浮按钮，带有 Sun / Moon 动态 Lucide 图标切换与 `localStorage` 读取保存逻辑。

## Phase 3: Integration & Testing

- [x] Task 3.1: 在 [App.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/App.tsx) 中引入并渲染 `<ThemeToggle />`。
- [x] Task 3.2: 验证全页在暗色模式与亮色模式间的平滑切换、持久化与单元测试通过。
