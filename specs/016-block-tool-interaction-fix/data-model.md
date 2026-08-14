# 数据模型与 UI 交互状态规范

## UI 交互控制状态 (UI State Model)

### 1. 全局悬停与工具栏独占状态 (`HoverStackManager`)

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `stack` | `HoverTarget[]` | 当前按嵌套深度排序的 Block 悬停目标 |
| `hideTimers` | `Map<string, Timeout>` | 悬停离开时的缓冲区定时器 |
| `isLocked` | `boolean` | 当拖拽或块菜单激活时锁定工具栏展示 |

### 2. 拖拽按钮状态 (`dragState`)

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | 拖拽按钮在 DOM 中的显示/隐藏状态 |
| `top` | `number` | `0` | 拖拽按钮相对于容器的 Top 偏移像素 |
| `left` | `number` | `10` | 拖拽按钮相对于容器的 Left 偏移像素 |
| `pos` | `number` | `0` | 当前绑定的 Block 节点在文档中的 Start Position |
| `isDragging` | `boolean` | `false` | 是否正在按住并拖动 |

### 3. 事件总线交互模型 (Event Bus Protocol)

- **`HIDE_ALL_FLOATING_MENUS`**: 当点击/按下 Drag Handle 或按下键盘按键时触发，通知所有 NodeView 及浮动 BubbleMenu 关闭显示。
- **`HIDE_DRAG_HANDLE`**: 当用户在 Block Tool（工具栏）上发起点击/按下操作时触发，通知 `DocEditor` 关闭 `DragHandleUI` 的显示。
