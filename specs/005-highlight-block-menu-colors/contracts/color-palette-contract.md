# UI Contract: 统一调色板组件 (UnifiedColorPicker)

**Feature**: [spec.md](../spec.md) | **Data Model**: [data-model.md](../data-model.md)

## 组件接口契约 (Component Interface Contract)

### 组件名称: `UnifiedColorPicker`

`UnifiedColorPicker` 是重构后的标准颜色选择器，用于替换原有的简易颜色下拉面板。

#### Props

```typescript
export interface UnifiedColorPickerProps {
  /** 允许选择的功能分类，若未传则默认显示全部分类标签页 */
  allowedCategories?: ColorCategory[];

  /** 当前激活的默认分类标签页 */
  defaultCategory?: ColorCategory;

  /** 当前应用的颜色值 */
  currentColor?: string;

  /** 当用户选取具体颜色时的回调 */
  onSelectColor: (color: string, category: ColorCategory) => void;

  /** 清除/恢复默认颜色的回调 */
  onResetColor?: () => void;

  /** 自定义类名 */
  className?: string;
}
```

#### 视觉契约与渲染结构 (Visual Contract)

1. **分类切换 Tab 栏 (仅当 allowedCategories > 1 时显示)**:
   - `[ 字体颜色 ]` | `[ 背景颜色 ]` | `[ 边框颜色 ]`
2. **色阶网格 (Color Grid)**:
   - 包含“默认/无颜色”快捷选块。
   - 按色系（灰、蓝、绿、黄、红、紫、青、橙）行展示。
   - 每行提供三列明度色块：`[ 浅色 ]` `[ 中等 ]` `[ 正常 ]`。
3. **状态与可读性 (Accessibility & Tooltip)**:
   - 每个色块均带有 HTML `title` 提示（例如：“背景色 - 浅蓝”）。
   - 当前已生效的颜色色块附带选中状态边框高亮或 Check 图标。
