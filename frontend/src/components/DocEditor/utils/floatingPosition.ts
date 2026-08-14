export interface FloatingPositionConfig {
  targetRect: DOMRect;
  containerRect?: DOMRect;
  menuWidth: number;
  menuHeight: number;
  preferredPlacement?: 'top' | 'bottom';
  offset?: number;
  isFixed?: boolean;
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
  containerRect,
  menuWidth,
  menuHeight,
  preferredPlacement = 'top',
  offset = 8,
  isFixed = false,
}: FloatingPositionConfig): FloatingPositionResult {
  const effectiveContainerRect =
    containerRect || new DOMRect(0, 0, window.innerWidth, window.innerHeight);

  let placement: 'top' | 'bottom' = preferredPlacement;

  // 校验首选方向空间
  if (preferredPlacement === 'top') {
    const spaceAbove = targetRect.top - effectiveContainerRect.top;
    if (spaceAbove < menuHeight + offset) {
      // 上方空间不足，检查下方空间
      const spaceBelow = effectiveContainerRect.bottom - targetRect.bottom;
      if (spaceBelow >= menuHeight + offset || spaceBelow > spaceAbove) {
        placement = 'bottom';
      }
    }
  } else {
    const spaceBelow = effectiveContainerRect.bottom - targetRect.bottom;
    if (spaceBelow < menuHeight + offset) {
      const spaceAbove = targetRect.top - effectiveContainerRect.top;
      if (spaceAbove >= menuHeight + offset || spaceAbove > spaceBelow) {
        placement = 'top';
      }
    }
  }

  // 垂直 Top 坐标计算（基于容器相对位置或视口绝对位置）
  let rawTop: number;
  if (isFixed) {
    if (placement === 'top') {
      rawTop = targetRect.top - menuHeight - offset;
    } else {
      rawTop = targetRect.bottom + offset;
    }
  } else {
    if (placement === 'top') {
      rawTop = targetRect.top - effectiveContainerRect.top - menuHeight - offset;
    } else {
      rawTop = targetRect.bottom - effectiveContainerRect.top + offset;
    }
  }

  // 垂直边缘保底钳制
  const minTop = 8;
  const maxContainerHeight = isFixed ? window.innerHeight : effectiveContainerRect.height;
  const maxTop = Math.max(minTop, maxContainerHeight - menuHeight - 8);
  const top = Math.min(Math.max(minTop, rawTop), maxTop);

  // 水平居中并 clamp 限制在容器水平边界内
  const targetCenter = isFixed
    ? targetRect.left + targetRect.width / 2
    : targetRect.left + targetRect.width / 2 - effectiveContainerRect.left;
  const idealLeft = targetCenter - menuWidth / 2;

  const minLeft = 8;
  const maxContainerWidth = isFixed ? window.innerWidth : effectiveContainerRect.width;
  const maxLeft = Math.max(minLeft, maxContainerWidth - menuWidth - 8);
  const left = Math.min(Math.max(minLeft, idealLeft), maxLeft);

  return {
    top,
    left,
    placement,
  };
}

export interface SubMenuPositionConfig {
  buttonRect: DOMRect;
  submenuWidth: number;
  submenuHeight: number;
  parentPlacement?: 'top' | 'bottom';
  offset?: number;
}

export interface SubMenuPositionResult {
  placement: 'top' | 'bottom';
  align: 'left' | 'right';
  style: React.CSSProperties;
}

/**
 * 智能计算二级 Popover / 下拉子菜单在视口内的避让定位
 */
export function calculateSubMenuPosition({
  buttonRect,
  submenuWidth,
  submenuHeight,
  offset = 4,
}: SubMenuPositionConfig): SubMenuPositionResult {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let placement: 'top' | 'bottom' = 'bottom';
  const spaceBelow = windowHeight - buttonRect.bottom;
  const spaceAbove = buttonRect.top;

  if (spaceBelow < submenuHeight + offset && spaceAbove > spaceBelow) {
    placement = 'top';
  }

  let align: 'left' | 'right' = 'left';
  if (buttonRect.left + submenuWidth > windowWidth - 12) {
    align = 'right';
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1000,
  };

  if (placement === 'bottom') {
    style.top = '100%';
    style.marginTop = `${offset}px`;
  } else {
    style.bottom = '100%';
    style.marginBottom = `${offset}px`;
  }

  if (align === 'right') {
    style.right = 0;
  } else {
    style.left = 0;
  }

  return { placement, align, style };
}

