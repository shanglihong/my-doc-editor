# Feature Specification: 022-dark-mode-theme

**Feature Name**: 深色模式与左下角一键切换 (Dark Mode Theme Toggle)  
**Created**: 2026-08-15  
**Status**: Draft  

## Feature Summary

为文档编辑器及整体应用添加符合现代审美的主题切换功能（支持浅色 Light Mode 与深色 Dark Mode 自由无缝切换）。在页面左下角固定一个极简的主题切换按钮，用户点击即可随时切换亮色/暗色界面风格。

---

## User Scenarios & Flows

### Scenario 1: 左下角固定按钮一键切换主题
- **Given** 用户在浏览器中打开文档编辑器
- **When** 用户观察页面左下角，看到固定的主题切换按钮（如太阳/月亮图标）
- **Then** 点击该按钮后，整体界面（背景、编辑器、文本、TOC 目录、代码块、高亮块、工具栏）在 150ms 内平滑过渡转换为深色暗黑主题（Dark Mode）
- **And** 再次点击按钮，界面再次平滑转换回浅色主题（Light Mode）

### Scenario 2: 主题状态持久化与系统记忆
- **Given** 用户将界面切换为深色模式
- **When** 用户刷新页面或再次访问应用
- **Then** 应用自动记住用户先前的深色主题设置，保持深色模式展示

---

## Functional Requirements

1. **固定定位与按钮状态 (Fixed Toggle Control)**
   - 页面左下角 (`position: fixed; bottom: 24px; left: 24px; z-index: 1000`) 放置极简通透的主题切换按钮。
   - 按钮具备悬浮指示与 Icon 动态响应：浅色模式下展示月亮/暗色图标，深色模式下展示太阳/亮色图标。

2. **深色主题配色与设计系统 (Dark Theme Color Tokens)**
   - 全局背景色切换为暗调高质感暗黑背景（如 `#0f172a` 或 `#121212`）。
   - 正文与标题文字颜色切换为高对比度清晰浅文本（如 `#f8fafc` / `#e2e8f0`）。
   - 编辑器边框、拖拽手柄、浮动工具栏、TOC 大纲面板、代码块与高亮块全部适配深色暗调色值，避免暗色模式下亮白色刺眼色块。

3. **快捷交互与切换动画**
   - 切换过程具备平滑的 CSS color/background 过渡（`transition: background-color 0.2s, color 0.2s`）。

4. **主题设置持久化 (Local Storage Persistence)**
   - 使用 `localStorage` 自动记录并恢复用户当前选择的主题状态。

---

## Success Criteria

1. 点击左下角固定按钮可 100% 成功在浅色与深色模式间平滑切换。
2. 暗色模式下所有界面组件（正文、TOC、代码块、浮动菜单、高亮块）色值对比度符合 WCAG 2.1 标准（文本对比度 >= 4.5:1）。
3. 刷新页面后主题选择状态保持一致不丢失。

---

## Assumptions

- 默认初始主题为浅色模式 (Light Mode)。
- 深色模式不需要重启或者重新加载页面，纯 CSS CSS-Variables / Data-Attribute 响应式切换。
