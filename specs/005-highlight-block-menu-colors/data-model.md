# Data Model & Technical Specs: 高亮 Block 浮动菜单与统一调色板

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## 数据结构定义 (Data Definitions)

### 1. ColorOption (单个颜色项)

```typescript
export type ColorTier = 'light' | 'medium' | 'normal';

export interface ColorOption {
  label: string;      // 颜色显示名称，如 "浅蓝"
  value: string;      // HEX/RGB 色值，如 "#eff6ff" 或 "transparent"
  tier: ColorTier;    // 明度/深度等级
}
```

### 2. ColorGroup (按色系归类的三级梯度)

```typescript
export interface ColorGroup {
  hue: string;        // 色系标识，如 'blue', 'emerald', 'amber', 'rose', 'purple', 'cyan', 'slate', 'orange'
  hueName: string;    // 色系中文名，如 "蓝", "绿", "黄", "红", "紫", "青", "灰", "橙"
  shades: {
    light: ColorOption;   // 浅色
    medium: ColorOption;  // 中等
    normal: ColorOption;  // 正常
  };
}
```

### 3. UnifiedColorSystem (统一功能调色板)

```typescript
export type ColorCategory = 'textColor' | 'backgroundColor' | 'borderColor';

export interface UnifiedColorSystem {
  textColor: ColorGroup[];
  backgroundColor: ColorGroup[];
  borderColor: ColorGroup[];
}
```

### 4. Callout Node Attributes (高亮块节点属性扩展)

高亮 Block (Callout) 在 TipTap 节点的 `attrs` Schema 结构：

```typescript
export interface CalloutAttributes {
  icon: string;                  // 图标名称或 emoji
  iconType: 'lucide' | 'emoji';   // 图标类型
  theme?: string;                // 预设主题标识（可选）
  backgroundColor?: string;      // 背景填充颜色（HEX 色值或 transparent）
  borderColor?: string;          // 边框颜色（HEX 色值或 transparent）
}
```

---

## 组件状态模型 (Component State Models)

### CalloutBubbleMenu State

```typescript
export interface CalloutBubbleMenuState {
  visible: boolean;              // 菜单是否显示
  top: number;                   // 绝对定位 top (px)
  left: number;                  // 绝对定位 left (px)
  currentBgColor: string;        // 当前选中的背景色
  currentBorderColor: string;    // 当前选中的边框色
  currentIcon: string;           // 当前图标
}
```
