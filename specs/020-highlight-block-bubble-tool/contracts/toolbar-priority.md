# Interface Contract: Toolbar Priority Dispatcher

## Module Specification

- **File**: `frontend/src/components/DocEditor/utils/toolbarPriority.ts`
- **Function**: `getActiveToolbarInfo(editor: Editor | null, hoveredBlockType?: ToolbarType): ActiveToolbarInfo`

### Behavior Contract

1. **NodeSelection Priority**: 当 `selection` 为 `NodeSelection`（如选中的图片或 DrawIO 架构图）时，优先返回对应的节点工具栏类型（`image` 或 `drawio`）。
2. **TextSelection Priority**: 当 `selection` 为非空 `TextSelection`（`selection.from !== selection.to` 且未在 `codeBlock` 内）时，无论 `hoverStackManager` 是否包含 `callout` 等 Block 的悬停目标，均优先返回 `type: 'text'`。
3. **Hover Stack Fallback**: 当选区为空或非 `TextSelection` 时，读取 `hoverStackManager.getActiveTarget()`。如果包含 `callout` 或 `table` 悬停目标，返回对应块工具栏类型（如 `callout`）。
4. **Default**: 若既无 Hover 目标也无选区，按 `hoveredBlockType` 兜底或返回 `{ type: null, depth: -1 }`。
