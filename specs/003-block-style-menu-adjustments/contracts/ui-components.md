# UI Component Contracts: Block Style and Menu Adjustments

## 1. DragHandleUI 组件契约

### 接口定义
```typescript
export interface DragHandleProps {
  top: number;
  left?: number;
  pos: number;
  visible: boolean;
  nodeType?: string;
  nodeLevel?: number;
  isEmpty?: boolean;
  onMouseDown?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onOpenTypeMenu?: (pos: number, anchorRect: DOMRect) => void;
}
```

### 行为契约
1. **渲染条件**: `visible === true` 时渲染，隐藏状态返回 `null`。
2. **图标分支**:
   - `isEmpty === true`: 渲染加号（`Plus`）图标。
   - `isEmpty === false`: 根据 `nodeType` 和 `nodeLevel` 寻找对应的 `BlockIcon` 渲染彩色图标。
3. **点击事件**:
   - 点击左侧 Icon 按钮触发 `onOpenTypeMenu(pos, anchorRect)`，阻止事件冒泡与编辑器失焦。
   - 按住右侧六点把手触发 `onDragStart` 保持已有重排与 Ghost 镜像生成。

---

## 2. BlockTypeMenu 组件契约

### 接口定义
```typescript
export interface BlockTypeMenuProps {
  editor: Editor | null;
  pos: number;
  anchorRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### 行为契约
1. **定位逻辑**: 依赖 `calculateSmartPosition` 结合 `anchorRect` 自动调整在图标下方或上方展现，无边框遮盖。
2. **键盘导航**: 支持 `Esc` 关闭，点击外部（click-outside）自动关闭。
3. **类型转换执行**: 点击指定类型项后，将文档 `pos` 位置的节点转换为所选类型，并平滑聚焦光标。

---

## 3. BubbleToolbar 智能定位契约

### 接口定义
```typescript
export interface BubbleToolbarProps {
  editor: Editor | null;
  isDragging?: boolean;
}
```

### 行为契约
1. **防遮挡计算**: 监听选区变化，通过选区坐标从 `calculateSmartPosition` 计算 `top` / `left` 和 `placement`。
2. **子菜单联动**: 字号选择器、前景色选择器、背景高亮选择器展开时，根据当前 Toolbar 的上下位置与视口空间动态决定弹出方向。
