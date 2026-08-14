# 界面组件与编辑器契约 (Toolbar & Editor Contract)

**Feature Branch**: `011-text-selection-hyperlink`  
**Date**: 2026-08-14  
**Spec**: [spec.md](../spec.md)

## 1. Tiptap 命令契约 (Tiptap Command Contract)

在富文本编辑器中，超链接操作须通过链式 API 进行状态控制与更新。

### 1.1 设置/修改超链接 (setLink)

```typescript
editor
  .chain()
  .focus()
  .extendMarkRange('link')
  .setLink({ href: normalizedUrl, target: '_blank' })
  .run();
```

### 1.2 清除/取消超链接 (unsetLink)

```typescript
editor
  .chain()
  .focus()
  .extendMarkRange('link')
  .unsetLink()
  .run();
```

### 1.3 查询超链接激活状态与属性 (isActive & getAttributes)

```typescript
// 检查选区是否处于 link 激活状态
const isLinkActive = editor.isActive('link');

// 获取当前 link 属性
const currentHref = editor.getAttributes('link').href || '';
```

---

## 2. 气泡工具栏超链接入口行为契约 (Bubble Toolbar Behavior)

1. **入口显隐状态**: 当高亮选中文本（`TextSelection`）且非 `codeBlock` 内部时，选中工具栏（`BubbleToolbar`）正常显示。
2. **按钮高亮**: 若当前选区已包含链接，超链接图标按钮展现 `.toolbarBtnActive` 高亮样式。
3. **快捷键相应**: 按下 `Mod+K` 时，直接触发超链接面板展开并高亮输入框。
