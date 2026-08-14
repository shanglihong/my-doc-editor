# 研究与技术决策记录 (Research & Technical Decisions)

**Feature Branch**: `011-text-selection-hyperlink`  
**Date**: 2026-08-14  
**Spec**: [spec.md](spec.md)

## 1. 链接扩展方案选择 (Link Extension Choice)

### 决策 (Decision)
选用 `@tiptap/extension-link` 官方扩展，配置 `autolink: false`（仅由用户通过界面显式应用超链接），并设置 `openOnClick: false`（编辑模式下点击不直接调起浏览器跳转，避免干扰编辑），默认 `linkOnPaste: true`（粘贴 URL 自动转换）。

### 理由 (Rationale)
- 兼容 TipTap 生态，支持 standard schema (ProseMirror mark `link`)。
- 完善的 API 方法：`editor.chain().focus().setLink({ href }).run()` 与 `editor.chain().focus().unsetLink().run()`。
- 开箱即用支持 `isActive('link')` 判断及属性获取 `editor.getAttributes('link').href`。

### 替代方案评估 (Alternatives Considered)
- 自研 ProseMirror Mark: 复杂度高且维护成本大，缺乏与 Markdown 转换插件 (`tiptap-markdown`) 的天然集成。

---

## 2. 气泡菜单与超链接面板交互设计 (Bubble Menu & Link Panel Integration)

### 决策 (Decision)
在 `BubbleToolbar` 中新增 `Link` 按钮（采用 `lucide-react` 的 `Link` / `Unlink` / `ExternalLink` 图标）。点击后展开放置于按钮下方的 `LinkInputPanel`（内联浮动面板）。

### 理由 (Rationale)
- 遵循现有的 `showFontSizePicker`, `showColorPicker`, `showHighlightPicker` 子浮动组件管理范式。
- 利用项目已有 `calculateSubMenuPosition` 工具函数，自动计算弹出框在视口中的智能定位，防止跨边界遮挡。

### 替代方案评估 (Alternatives Considered)
- 全局 Modal 弹窗: 会打断用户的富文本编辑流，上下文距离远，体验不够敏捷。
- 原生 `window.prompt`: UI 不契合项目的现代化视觉语言，无法进行回显、预览与一键取消链接操作。

---

## 3. URL 自动规范化与安全处理 (URL Normalization & Validation)

### 决策 (Decision)
在应用链接前进行协议补全逻辑：
1. 若输入框为空，且当前已存在超链接，点击保存时执行 `unsetLink()`；若当前无链接，直接关闭面板。
2. 若输入以 `http://`, `https://`, `mailto:`, `tel://`, `/`, `#` 等开头的协议或相对路径，保留原样。
3. 若输入无协议前缀（如 `baidu.com` 或 `www.google.com`），自动补全 `https://` 前缀。

### 理由 (Rationale)
- 防范 `javascript:` 等恶意脚本注入风险（Tiptap Link Extension 默认防护或设置白名单）。
- 保证用户输入普通域名时无需手动打 `https://`，提高操作效率。

---

## 4. 快捷键与焦点管理 (Shortcuts & Focus Management)

### 决策 (Decision)
- 快捷键支持：全局捕获 `Mod+K`（Mac `Cmd+K`, Windows `Ctrl+K`），触发时直接选中文本并弹窗聚焦超链接输入框。
- 键盘导航：输入框按 `Enter` 键提交保存，按 `Esc` 键取消关闭。
- 避免选区丢失：在操作输入框时防止失焦导致 ProseMirror Selection 丢失。
