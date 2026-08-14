# Research: Highlighting Block Bubble Tool Support

## Technical Analysis & Decisions

### Decision 1: 文本选区与容器块 Hover 状态的优先级调度调整

- **Decision**: 修改 `getActiveToolbarInfo` (位于 `frontend/src/components/DocEditor/utils/toolbarPriority.ts`) 的调度逻辑，当存在非空 `TextSelection` 时，优先判定为 `text` 类型工具栏，覆盖块容器（如 Callout）的 Hover 栈状态。
- **Rationale**: 
  - 当用户在 Callout（高亮块）内显式框选文本时，`selection` 变为非空 `TextSelection`。用户的明确意图是对选中文本进行格式化（如加粗、改变字号、设置字体颜色等）。
  - 目前 `getActiveToolbarInfo` 优先读取 `hoverStackManager.getActiveTarget()`，因为鼠标停留在高亮块上，导致返回 `type: 'callout'`。`BubbleToolbar` 组件判断 `activeToolbar.type !== 'text'` 从而被隐藏。
  - 将非空 `TextSelection` 的优先级提升到 Block Hover 栈之上后，选中文本时 `getActiveToolbarInfo` 返回 `type: 'text'`，`BubbleToolbar` 可正常弹出。
  - 同时，`FloatingBlockTool` 已具备 `isTextSelected` 隐藏逻辑，选中文本时 Callout 的块级工具栏会自动隐藏，避免界面重叠与冲突。
- **Alternatives Considered**: 
  - *方案 B：修改 CalloutView 的 mouseLeave 逻辑*：在选中文本时不向 `hoverStackManager` 注册 `callout`。缺点：受限于 DOM 事件，无法完美感知键盘选选或拖拽选中，且破坏了 Hover 栈的通用抽象。
  - *方案 C：在 BubbleToolbar 中硬编码排除 Callout*：在 `BubbleToolbar` 中特化逻辑。缺点：增加耦合，违反统一调度算子原则。

### Decision 2: 保持格式化作用域与 Selection 监听机制不变

- **Decision**: 依赖 TipTap 原生的 Command 机制（如 `toggleBold`, `setFontSize`, `setColor` 等）对高亮块内部选中的 Text Node 执行格式化操作。
- **Rationale**: 高亮块内部的文本节点本身属于 TipTap ProseMirror Schema 的标准 Inline Content，原生的文本指令可直接作用于当前 `TextSelection`，无需特殊变更。
