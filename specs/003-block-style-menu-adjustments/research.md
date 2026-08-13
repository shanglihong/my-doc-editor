# Research & Technical Decisions: Block Style and Menu Adjustments

## 1. 拖拽控制区与 Block Icon / 加号 Icon 触发机制

### 问题分析
在原有 `DragHandlePlugin.ts` 中，对空段落（`isContentEmpty === true`）采取了直接隐匿把手的逻辑，导致空 Block 无法呈现任何左侧交互控件。此外，原来的把手仅有一个 `GripVertical` 六点图标，没有显示 Block 类型，更无法点击切换类型。

### 决策与方案
- **Plugin 层优化**：调整 `DragHandlePlugin.ts` 的检测逻辑，移除空 Block 忽略限制，向 UI 传递 `isEmpty` 状态、当前节点 `node.type.name` 以及 heading 的 `level` 等元数据。
- **UI 交互增强**：
  - 在 `DragHandleUI` 中划分为两个子区域：左侧为 `BlockIcon` 触发按钮，右侧为 `GripVertical` 拖拽把手。
  - 非空 Block：左侧展示该 Block 类型的专属色彩 Icon（例如 H1 蓝色大字标题，Bulleted List 绿色点阵等），hover 时高亮；
  - 空 Block：左侧展示加号 `Plus` 图标（灰调，hover 时变深紫/蓝色）；
  - 点击左侧 Icon 时，阻止冒泡并在 Icon 正下方/正上方弹出 `BlockTypeMenu` 快捷切换菜单。

---

## 2. 悬浮工具栏与下拉菜单防遮挡智能定位

### 问题分析
当前 `BubbleToolbar` 和下拉菜单采用固定偏移计算：
```typescript
const top = start.top - editorDom.top - 45;
```
这种简单计算面临两处边界缺陷：
1. 当选中文本位于编辑器最顶部或前两行时，`top - 45` 会超出视口上边界或编辑器顶边，导致悬浮工具栏被容器顶部遮挡；
2. 当悬浮工具栏靠近页面底部时，点击展开的下拉子菜单（如颜色选择器、字号选择器）会向下延伸并被页面底部遮挡或截断。

### 决策与方案
建立通用的边界碰撞与浮动定位算法函数 `calculateSmartPosition`：
- 输入：`targetRect`（选区或触发按钮的 ClientRect）、`menuDimensions`（菜单宽与高）、`containerRect`（编辑器或视口 Rect）、`preferredPlacement`（首选方向 'top' 或 'bottom'）。
- 判断逻辑：
  - 若 `preferredPlacement === 'top'` 且 `targetRect.top - menuHeight - margin < containerRect.top`，自动翻转为 `'bottom'`，Top 计算为 `targetRect.bottom + margin`；
  - 若 `preferredPlacement === 'bottom'` 且 `targetRect.bottom + menuHeight + margin > containerRect.bottom`，自动翻转为 `'top'`，Top 计算为 `targetRect.top - menuHeight - margin`；
  - Left 定位限制在 `[containerRect.left + margin, containerRect.right - menuWidth - margin]` 范围内，消除左右溢出。

---

## 3. 多彩统一图标体系与极简 Block 视觉规范

### 决策与方案
在 `frontend/src/components/DocEditor/utils/blockIcons.tsx` 中建立映射表：

| Block 类型 | 图标组件 | 统一视觉配色（CSS 变量/色彩） |
|---|---|---|
| Paragraph (段落) | `Pilcrow` | 柔和深灰 (`#475569`) |
| Heading 1 (一级标题) | `Heading1` | 靛蓝 (`#4f46e5`) |
| Heading 2 (二级标题) | `Heading2` | 蔚蓝 (`#0284c7`) |
| Heading 3 (三级标题) | `Heading3` | 青绿 (`#0d9488`) |
| Bullet List (无序列表) | `List` | 翡翠绿 (`#16a34a`) |
| Ordered List (有序列表) | `ListOrdered` | 暖橙 (`#ea580c`) |
| Task List (待办列表) | `CheckSquare` | 蓝紫 (`#6366f1`) |
| Blockquote (引用) | `Quote` | 琥珀金 (`#d97706`) |
| Code Block (代码块) | `Code2` | 玫红 (`#e11d48`) |
| Callout (高亮块) | `Megaphone` | 紫色 (`#9333ea`) |
| Table (表格) | `Table` | 蓝绿 (`#0891b2`) |
| DrawIO (图表) | `Workflow` | 森林绿 (`#059669`) |
| Empty Block (+) | `Plus` | Slate 灰 (`#64748b`) |

视觉规范整体采用 8px 圆角、微小内边距、优雅的灰色边框与柔和阴影，消除冗余重装饰，保持高品质极简感。
