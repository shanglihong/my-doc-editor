# Interface Contract: 文本块类型选择组件 (TextBlockTypeSelector)

## 规范概述

本文档定义 `BubbleToolbar` 中 `TextBlockTypeSelector`（文本块类型选择下拉菜单组件）的接口契约与 UI 状态更新协议。

## 组件 Props 契约

```typescript
export interface TextBlockTypeSelectorProps {
  editor: Editor;                               // TipTap Editor 实例 (非空)
  isOpen: boolean;                              // 菜单展开状态
  onToggle: (e: React.MouseEvent) => void;      // 点击下拉按钮切换展开/收起
  onClose: () => void;                          // 关闭下拉菜单回调
  pickerStyle?: React.CSSProperties;            // 智能计算后的浮动定位样式
}
```

## 事件与交互流

1. **状态轮询/订阅**:
   - 组件通过监听 TipTap 编辑器的 `selectionUpdate` 与 `transaction` 事件，同步更新当前激活的文本块类型 `activeType`。

2. **下拉选项触发**:
   - 用户点击下拉选项后，触发 `opt.action(editor)`，然后立即调用 `onClose()` 关闭菜单。

3. **键盘事件控制**:
   - 在下拉菜单聚焦或展开状态下，按下 `Escape` 触发 `onClose()`。
