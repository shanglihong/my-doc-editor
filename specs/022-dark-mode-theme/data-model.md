# Data Model & Color Tokens: 022-dark-mode-theme

## Theme State Model

```typescript
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
}
```

## Color Tokens Specification

| Token Name | Light Mode Value | Dark Mode Value | Usage |
|---|---|---|---|
| `--de-bg-body` | `#ffffff` | `#0f172a` | 应用全页/编辑器底色 |
| `--de-text-main` | `#0f172a` | `#f8fafc` | 主正文与标题文本颜色 |
| `--de-text-muted` | `#64748b` | `#94a3b8` | 次要文本与图标颜色 |
| `--de-border-color` | `#e2e8f0` | `#334155` | 边框与分割线色 |
| `--de-bg-hover` | `#f1f5f9` | `#1e293b` | 菜单/按钮悬浮背景 |
| `--de-bg-active` | `#e2e8f0` | `#334155` | 按压/选中底色 |
