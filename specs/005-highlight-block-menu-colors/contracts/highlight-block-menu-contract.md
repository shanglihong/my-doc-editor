# UI Contract: 高亮 Block 浮动菜单组件 (CalloutBubbleMenu)

**Feature**: [spec.md](../spec.md) | **Data Model**: [data-model.md](../data-model.md)

## 组件接口契约 (Component Interface Contract)

### 组件名称: `CalloutBubbleMenu`

`CalloutBubbleMenu` 是高亮 Block (Callout) 在编辑区域获得焦点或被点击时显示的悬浮操作条。

#### Props

```typescript
export interface CalloutBubbleMenuProps {
  /** TipTap 编辑器实例 */
  editor: Editor | null;

  /** 是否正在拖拽节点 (拖拽时隐藏菜单) */
  isDragging?: boolean;

  /** 块菜单是否已打开 (打开时隐藏悬浮菜单) */
  isTypeMenuOpen?: boolean;
}
```

#### 操作组与按钮契约 (Toolbar Actions Group)

1. **图标/主题设置组 (Icon & Theme)**:
   - [ 图标选择器 ]: 打开 Lucide 图标/Emoji 弹出选择器。
   - [ 预设主题 ]: 快速应用预设好的色系搭配（如信息蓝、成功绿、警告黄等）。

2. **分隔线 (Divider)**

3. **自定义颜色组 (Colors)**:
   - [ 边框颜色 (Border Color) ]: 点击弹窗 `UnifiedColorPicker`（限定 `borderColor` 类别），实时更新高亮 Block 的 `borderColor` 属性。
   - [ 填充背景色 (Fill/Bg Color) ]: 点击弹窗 `UnifiedColorPicker`（限定 `backgroundColor` 类别），实时更新高亮 Block 的 `backgroundColor` 属性。

4. **分隔线 (Divider)**

5. **危险操作组 (Danger Group)**:
   - [ 重置样式 ]: 清除自定义背景色与边框色。
   - [ 删除 Block ]: 点击执行 `deleteNode('callout')` 彻底删除当前高亮块。
