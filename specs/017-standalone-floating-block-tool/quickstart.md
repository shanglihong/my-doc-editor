# 验证与测试快速指南 (Quickstart Validation Guide)

**Feature**: Standalone Floating Block Tool (017-standalone-floating-block-tool)
**Date**: 2026-08-15

## 1. 验证目标

验证提炼独立出来的 `FloatingBlockTool` 悬浮 Block Tool 子组件能够在所有非文本 Block（Callout, CodeBlock, Table, Image, DrawIO）中统一生效，且满足以下 4 项核心规则：
1. 鼠标在 Block 悬停则展示，离开则隐藏（配合 250ms 防抖与工具栏内部移入保护）。
2. 点击 Block Tool 内菜单（如类型切换下拉框或弹窗）时自动隐藏拖拽按钮。
3. 点击拖拽按钮准备拖拽时自动隐藏 Block Tool。
4. 各个非文本 Block 专属的定制按钮功能完美兼容并响应。

---

## 2. 自动化单元测试指令

运行针对 `FloatingBlockTool` 与各 Block 组件的单元测试：

```bash
npm run test frontend/src/components/DocEditor/__tests__/FloatingBlockTool.test.tsx
```

---

## 3. 手动 UI 交互验证步骤

### 场景 1：高亮块 (Callout) 验证
1. 在文档中插入一个高亮块。
2. 鼠标移入高亮块：验证浮动工具栏正常展示，视觉外观与原有基准完全一致。
3. 鼠标移出高亮块：验证 250ms 后工具栏平滑隐藏；若鼠标移入工具栏本体或主题颜色弹窗，工具栏保持展示。
4. 点击工具栏中的预设主题/边框颜色：验证弹窗弹出，且侧边拖拽按钮自动隐藏。
5. 点击侧边拖拽按钮：验证悬浮工具栏立即隐藏。

### 场景 2：代码块 (CodeBlock) 验证
1. 插入一个代码块。
2. 鼠标悬停在代码块上：验证展示由 `FloatingBlockTool` 渲染的悬浮工具栏。
3. 检查定制按钮：验证语言选择器下拉框和代码复制按钮正常显示在 Block Tool 右侧。
4. 切换代码语言（如从 TypeScript 切到 Python）：验证语法高亮正常切换，且 Block Tool 不发生错位。

### 场景 3：表格块 (Table) 验证
1. 插入一个 3x3 表格。
2. 鼠标悬停在表格区域：验证出现统一的 Block Tool 悬浮工具栏。
3. 验证表格专属的行列加减、对齐等定制按钮正常工作。
4. 点击 Block Tool 中的删除按钮：验证表格块被成功删除。

### 场景 4：图片块 (Image) 与 DrawIO 块验证
1. 插入图片块与 DrawIO 图表块。
2. 悬停验证统一的 Block Tool 样式与交互行为。
3. 验证图片对齐/重置按钮与 DrawIO 编辑按钮功能正常。
