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
 * 智能边界检测与防遮挡定位算法
 * 自动计算悬浮菜单或下拉框在屏幕/容器内的最优展现位置，防止超界
 */
export function calculateSmartPosition({
  targetRect,
  containerRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight),
  menuWidth,
  menuHeight,
  preferredPlacement = 'top',
  offset = 8,
}: FloatingPositionConfig): FloatingPositionResult {
  let placement: 'top' | 'bottom' = preferredPlacement;

  // 校验首选方向空间
  if (preferredPlacement === 'top') {
    const spaceAbove = targetRect.top - containerRect.top;
    if (spaceAbove < menuHeight + offset) {
      // 上方空间不足，检查下方空间
      const spaceBelow = containerRect.bottom - targetRect.bottom;
      if (spaceBelow >= menuHeight + offset || spaceBelow > spaceAbove) {
        placement = 'bottom';
      }
    }
  } else {
    const spaceBelow = containerRect.bottom - targetRect.bottom;
    if (spaceBelow < menuHeight + offset) {
      const spaceAbove = targetRect.top - containerRect.top;
      if (spaceAbove >= menuHeight + offset || spaceAbove > spaceBelow) {
        placement = 'top';
      }
    }
  }

  // 垂直 Top 坐标计算（基于容器相对位置或视口绝对位置）
  let rawTop: number;
  if (placement === 'top') {
    rawTop = targetRect.top - containerRect.top - menuHeight - offset;
  } else {
    rawTop = targetRect.bottom - containerRect.top + offset;
  }

  // 垂直边缘保底钳制
  const minTop = 8;
  const maxTop = Math.max(minTop, containerRect.height - menuHeight - 8);
  const top = Math.min(Math.max(minTop, rawTop), maxTop);

  // 水平居中并 clamp 限制在容器水平边界内
  const targetCenter = targetRect.left + targetRect.width / 2 - containerRect.left;
  const idealLeft = targetCenter - menuWidth / 2;

  const minLeft = 8;
  const maxLeft = Math.max(minLeft, containerRect.width - menuWidth - 8);
  const left = Math.min(Math.max(minLeft, idealLeft), maxLeft);

  return {
    top,
    left,
    placement,
  };
}
