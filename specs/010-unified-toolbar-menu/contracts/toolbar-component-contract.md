# 接口与组件契约：统一工具栏菜单

**Feature Branch**: `010-unified-toolbar-menu`
**Date**: 2026-08-14

## 组件契约规范

### 1. UnifiedBlockToolbar 组件 Props

所有 Block 组件（包括 Table, Callout, Image, CodeBlock, DrawIO 等）统一使用或整合统一工具栏容器 `<UnifiedBlockToolbar />`。

```typescript
export interface UnifiedBlockToolbarProps {
  /** TipTap Editor 实例 */
  editor: Editor;

  /** 当前工具栏关联的悬停 Block 描述信息 */
  target: HoverBlockTarget;

  /** 统一工具栏自定制右侧插槽（组件特有的操作项组件或按钮组） */
  customActions?: React.ReactNode;

  /** 是否展示内置左侧固定按钮组 (默认为 true) */
  showBuiltinLeftActions?: boolean;

  /** 插入空白 Block 回调 (若未传则默认在当前 Block 后插入空白 paragraph) */
  onInsertBlankBlock?: () => void;

  /** 删除 Block 回调 (若未传则默认删除当前 Block 节点) */
  onDeleteBlock?: () => void;
}
```

### 2. 左侧固定结构规范 (Left Fixed Toolbar Layout)

固定格式为:
```html
<div className="unified-toolbar-left-group">
  <button className="toolbar-btn" title="插入空白块" onClick={handleInsertBlankBlock}>
    <PlusIcon />
  </button>
  <button className="toolbar-btn danger" title="删除块" onClick={handleDeleteBlock}>
    <TrashIcon />
  </button>
</div>
```

### 3. 通用事件通信契约

各 Block View 组件必须统一触发 Hover 事件管理方法：

```typescript
// 进入 Block 悬停区
function handleMouseEnter(e: React.MouseEvent) {
  toolbarHoverManager.registerHover(targetInfo);
}

// 离开 Block 悬停区
function handleMouseLeave(e: React.MouseEvent) {
  toolbarHoverManager.unregisterHover(targetInfo.id);
}
```
