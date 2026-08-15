# Phase 0 Research: Auto-Generated Document Table of Contents (TOC)

## Architectural & Design Decisions

### 1. 标题提取与过滤机制 (Heading Extraction & Filtering)

- **Decision**: 使用 TipTap / ProseMirror 的 `doc.forEach` 直接遍历文档顶层一级子节点，筛选 `node.type.name === 'heading'` 且 `node.attrs.level <= 3` (H1, H2, H3)。
- **Rationale**: 直接遍历顶层子节点可以自动无缝忽略任何嵌套/内嵌容器块（如 `callout`、`blockquote`、`table` 等）内部包含的标题，确保目录结构只反映主文档流的大纲。
- **Alternatives Considered**: 深度递归遍历全树，但这需要额外的节点类型判断与层级排除逻辑，复杂度更高且容易漏判。

### 2. 状态监听与增量更新 (State Synchronization)

- **Decision**: 监听 TipTap 的 `onUpdate` 与 `onSelectionUpdate` 事件，并在 `DocEditor` 的视图周期中通过防抖节流（Debounce 50ms）计算更新 TOC 结构。
- **Rationale**: 标题内容的修改、增加、删除与级别切换均会触发 `onUpdate`；引入防抖节流可以保障在大文档连续打字时界面依然流畅（< 100ms 延迟满足 SC-001）。
- **Alternatives Considered**: 手动突变底层 DOM 节点，但这破坏了 TipTap/React 响应式单向数据流原则。

### 3. 左侧固定定位与悬停折叠交互 (Fixed Positioning & Hover Interaction)

- **Decision**: UI 组件使用 `position: fixed; top: 90px; left: 28px; z-index: 90;` 固定置顶在屏幕左侧留白处；内部维护 `isExpanded` 状态，鼠标 `onMouseEnter` 展开面板，`onMouseLeave` 延迟（200ms）自动收起回复为悬浮图标。
- **Rationale**: `fixed` 定位可确保不管主页面或正文容器如何滚动，目录按钮始终置顶在左上角。静止态仅占据小角落（Icon 按钮），减少遮挡。
- **Alternatives Considered**: 页面侧栏绝对定位 `absolute`，但这会在滚动时移出视野外。

### 4. 锚点定位与平滑滚动导航 (Anchor Positioning & Smooth Scroll)

- **Decision**: 点击目录条目时，根据记录的 ProseMirror 节点 `pos` 或 DOM 引用，同时执行两项操作：
  1. 调用 `editor.chain().focus().setTextSelection(pos).run()` 聚焦并锁定光标到该标题。
  2. 调用对应 DOM 节点的 `scrollIntoView({ behavior: 'smooth', block: 'start' })` 精确平滑滚动定位。
- **Rationale**: 双重保障既能够让浏览器滚动动画自然流畅，又使得 TipTap 的编辑器光标与视图真实处于该标题节点上。
