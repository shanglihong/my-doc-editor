# Quickstart & Manual Validation Guide

## Validation Scenarios

### Scenario 1: 高亮块内部文本选选中弹出 Bubble Toolbar

1. 在 DocEditor 中点击输入框，输入斜杠命令或使用菜单插入一个高亮块（Callout Block）。
2. 在高亮块内部文本区域输入文本：`这是一个高亮块内部的测试文本`。
3. 鼠标选选中该段文本中的 `测试文本` 四个字。
4. **期望结果**: 
   - 高亮块本身的 Callout 块工具栏（显示背景色、边框颜色的工具栏）自动隐藏。
   - 文本格式化悬浮工具栏（BubbleToolbar）在选中文本上方正常弹出。

### Scenario 2: 高亮块内部文本格式化操作

1. 保持上述文本选选中状态。
2. 点击 BubbleToolbar 上的【加粗】按钮（Bold）及【文本颜色】按钮选选中红色。
3. **期望结果**: 
   - 选中的 `测试文本` 变为加粗与红色。
   - 高亮块容器外观、图标及外框无任何破损或异常变动。

### Scenario 3: 清除选区后恢复 Callout 块工具栏

1. 点击高亮块外部或取消选中文本（选区变为空）。
2. 将鼠标悬停在高亮块容器上。
3. **期望结果**: 
   - 文本格式化悬浮工具栏（BubbleToolbar）隐去。
   - 高亮块容器的 Callout 块工具栏重新展示。

## Automated Tests

运行单元测试确保调度优先级与高亮块悬浮工具栏测试通过：

```bash
cd frontend && npm test -- --runInBand src/components/DocEditor/__tests__/toolbarPriority.test.ts
```
