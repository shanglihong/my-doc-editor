# 接口契约规范: 菜单定位与防遮挡 API

**Feature Branch**: `006-fix-menu-clipping`

**Created**: 2026-08-14

## 函数与组件契约规范

### 1. `calculateSmartPosition` 函数契约

`frontend/src/components/DocEditor/utils/floatingPosition.ts`

```typescript
export interface FloatingPositionConfig {
  targetRect: DOMRect;
  containerRect?: DOMRect;
  menuWidth: number;
  menuHeight: number;
  preferredPlacement?: 'top' | 'bottom';
  offset?: number;
}

export interface FloatingPositionResult {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
}

/**
 * 智能边界检测与防遮挡定位函数
 * @param config 定位参数配置
 * @returns 包含计算后的 top, left 坐标以及实际 placement 方向
 */
export function calculateSmartPosition(config: FloatingPositionConfig): FloatingPositionResult;
```

**定位算法规则**:
1. **垂直方向判断**: 优先检查 `preferredPlacement` 方向上空间是否足够 `menuHeight + offset`。若不足且另一方向空间更大，则反转 `placement`。
2. **垂直钳制**: `top` 始终保持在 `[minTop, maxTop]` 区间，保证菜单内容不超出 `containerRect` 上下边缘。
3. **水平钳制**: `left` 坐标根据 `targetCenter` 居中后，强制钳制在 `[minLeft, maxLeft]` 内，防止菜单超出视口左右边缘。

---

### 2. 二级子面板智能方向选择契约 (`calculateSubMenuPosition`)

```typescript
export interface SubMenuPositionResult {
  verticalStyle: { top?: string; bottom?: string; marginTop?: string; marginBottom?: string };
  horizontalStyle: { left?: string; right?: string; transform?: string };
}

/**
 * 计算二级弹出面板（如颜色面板、下拉选项）防遮挡样式
 */
export function calculateSubMenuPosition(
  parentPlacement: 'top' | 'bottom',
  buttonRect: DOMRect,
  submenuWidth: number,
  submenuHeight: number
): SubMenuPositionResult;
```

---

### 3. 斜杠菜单 Plugin 挂载防遮挡契约

`frontend/src/components/DocEditor/components/SlashMenu/SlashMenuPlugin.ts`

- 在 `render.onStart` 及 `render.onUpdate` 中：
  - 获取光标包含元素的 `clientRect()`
  - 调用 `calculateSmartPosition` 计算 Top 与 Left 坐标（设 `menuWidth: 280`, `menuHeight: 300`, `preferredPlacement: 'bottom'`）
  - 动态应用至 `component.element.style`。
