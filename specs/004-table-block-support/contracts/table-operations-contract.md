# Contract: 表格操作指令与 UI 交互契约 (Table Operations Contract)

## 1. TipTap Editor Command 契约

单元格操作通过 `editor.chain().focus()` 调用的官方 Command API 如下：

### 1.1 行列增删接口

| 操作 | 对应 TipTap API | 前置条件 / 边界约束 |
|------|-----------------|---------------------|
| 在上方插入行 | `.addRowBefore().run()` | 光标在单元格内 |
| 在下方插入行 | `.addRowAfter().run()` | 光标在单元格内 |
| 在左侧插入列 | `.addColumnBefore().run()` | 光标在单元格内 |
| 在右侧插入列 | `.addColumnAfter().run()` | 光标在单元格内 |
| 删除当前行 | `.deleteRow().run()` | 当前表格行数 > 1，否则禁用 |
| 删除当前列 | `.deleteColumn().run()` | 当前表格列数 > 1，否则禁用 |

### 1.2 单元格合并与拆分接口

| 操作 | 对应 TipTap API | 前置条件 / 校验逻辑 |
|------|-----------------|---------------------|
| 合并单元格 | `.mergeCells().run()` | `editor.can().mergeCells()` 为 true（选中矩形区域选区） |
| 拆分单元格 | `.splitCell().run()` | `editor.can().splitCell()` 为 true（光标在合并单元格内） |
| 切换合并/拆分 | `.mergeOrSplit().run()` | 根据当前选区自动判定并切换 |

### 1.3 表头与表格结构切换接口

| 操作 | 对应 TipTap API | 说明 |
|------|-----------------|------|
| 切换表头行 | `.toggleHeaderRow().run()` | 将首行设为/取消 `tableHeader` |
| 切换表头列 | `.toggleHeaderColumn().run()` | 将首列设为/取消 `tableHeader` |
| 删除整个表格 | `.deleteTable().run()` | 删除整个表格 Block |

---

## 2. 悬浮菜单 (Table Bubble Menu) 组件契约

### 组件名称
`TableBubbleMenu`

### Props 契约
```typescript
export interface TableBubbleMenuProps {
  editor: Editor | null;
}
```

### 渲染触发规则
- 当且仅当 `editor.isActive('table')` 为 `true`，且编辑器处于可编辑状态（`editable === true`）时进行显示。
- 定位跟随当前表格顶部悬浮区域。
