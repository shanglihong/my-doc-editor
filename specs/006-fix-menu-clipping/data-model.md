# 视图模型与数据契约: 菜单防遮挡与完整可见性优化

**Feature Branch**: `006-fix-menu-clipping`

**Created**: 2026-08-14

## 数据实体与视图状态模型

### 1. 浮动定位配置实体 (FloatingPositionConfig)

用于计算菜单和弹出层在屏幕中的坐标与方向。

| 字段名 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `targetRect` | `DOMRect` | 触发源或光标选区的矩形边界 | `{ top: 400, left: 100, width: 20, height: 20 }` |
| `containerRect` | `DOMRect` | 限制容器或可视区域的矩形边界 | `{ top: 0, left: 0, width: 1440, height: 900 }` |
| `menuWidth` | `number` | 弹出菜单的预计/实际宽度 (px) | `240` |
| `menuHeight` | `number` | 弹出菜单的预计/实际高度 (px) | `280` |
| `preferredPlacement` | `'top' \| 'bottom'` | 期望的首选展开方向 | `'bottom'` |
| `offset` | `number` | 菜单与目标元素的间距 (px) | `8` |

---

### 2. 浮动定位结果实体 (FloatingPositionResult)

计算后返回的精确 CSS 坐标与实际展开方位。

| 字段名 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `top` | `number` | 修正后的 Y 轴像素坐标 | `212` |
| `left` | `number` | 修正后的 X 轴像素坐标 | `100` |
| `placement` | `'top' \| 'bottom'` | 实际采用的展开方向 | `'top'` |

---

### 3. 子面板定位配置 (SubMenuPositionConfig)

针对二层弹出框（如颜色选择面板）计算相对于父级气泡菜单的位置。

| 字段名 | 类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| `parentPlacement` | `'top' \| 'bottom'` | 一级气泡菜单所在的方位 | `'top'` |
| `parentRect` | `DOMRect` | 父级气泡菜单按钮或矩形框 | DOM 节点位置 |
| `submenuWidth` | `number` | 二级面板宽度 | `240` |
| `submenuHeight` | `number` | 二级面板高度 | `240` |
| `viewportHeight` | `number` | 浏览器窗口高度 | `900` |
| `viewportWidth` | `number` | 浏览器窗口宽度 | `1440` |

---

### 4. 浮动菜单视图状态 (FloatingMenuState)

组件内部管理菜单显示、防遮挡位置和交互状态。

```typescript
export interface FloatingMenuState {
  visible: boolean;
  top: number;
  left: number;
  placement: 'top' | 'bottom';
  activeSubMenu: string | null;
}
```
