# Phase 1 Data Model: Table of Contents (TOC) State & Entity Matrix

## 1. TOC Item Entity Schema

```typescript
export interface TOCItem {
  /** 标题节点唯一标识或自增 ID */
  id: string;
  /** 标题文本内容 */
  text: string;
  /** 标题级别: 1 (H1), 2 (H2), 3 (H3) */
  level: 1 | 2 | 3;
  /** ProseMirror 文档树中的起始点位置 pos */
  pos: number;
}
```

## 2. TOC Component State Matrix

```typescript
export interface TOCComponentState {
  /** 当前解析出的主文档层级目录列表 */
  items: TOCItem[];
  /** 鼠标是否悬停在目录 Icon/面板上 */
  isExpanded: boolean;
  /** 当前光标或视口滚动所在的活动标题 ID */
  activeId: string | null;
}
```

## 3. Transition Rules & Event Hooks

| Event Trigger | Source State | Condition | Target State / Action |
|---------------|--------------|-----------|-----------------------|
| `editor.on('update')` | Items Updated | Document changed | 提取顶层 H1/H2/H3，更新 `items` 列表 |
| `onMouseEnter` | `isExpanded = false` | Mouse hovered TOC icon/panel | `isExpanded = true` (平滑展开目录树) |
| `onMouseLeave` | `isExpanded = true` | Mouse left TOC area | 延迟 200ms 后 `isExpanded = false` (平滑收起为 Icon) |
| `onItemClick(item)` | Any | User clicked TOC row | 执行平滑滚动 + 光标锚点聚焦 `setTextSelection(item.pos)` |
