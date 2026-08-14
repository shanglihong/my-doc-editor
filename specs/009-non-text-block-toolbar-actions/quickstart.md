# Quickstart & Verification Guide: Non-Text Block Toolbar Actions & Unified Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Development & Test Commands

```bash
# 启动本地开发服务 (前台预览测试)
npm run dev

# 执行全量单元测试
npm run test

# 执行单项 UI / Toolbar 单元测试
npx jest --testPathPattern=toolbar

# 执行构建校验
npm run build
```

---

## Validation Scenarios

### Scenario 1: 图片 Block 插入空白块测试

1. 打开应用 `http://localhost:5173/`。
2. 插入或选中图片 Block。
3. 在图片 Block 浮动工具栏中点击“插入块”下拉按钮（带有加号/插入图标）。
4. 在展开的下拉菜单中选择“在上方插入”。
5. **期望结果**: 图片上方立即新建一个空白段落块，且光标聚焦在新建段落中。
6. 再次点击“插入块”下拉按钮，选择“在下方插入”。
7. **期望结果**: 图片下方立即新建一个空白段落块，且光标聚焦在新建段落中。

---

### Scenario 2: 代码 Block 工具栏样式与插入功能测试

1. 创建或聚焦一个代码 Block（Code Block）。
2. 查看代码 Block 顶部工具栏，确认其背景、边框、语言选择框与按钮样式符合非文本工具栏统一设计规范。
3. 点击工具栏上的“插入块”下拉按钮，验证“在上方插入”和“在下方插入”功能正常执行。

---

### Scenario 3: DrawIO / 图标 Block 工具栏测试

1. 创建或聚焦一个 DrawIO / 图标架构图 Block。
2. 查看浮动操作工具栏，确认“编辑”、“删除”与“插入块”按钮视觉风格全量统一。
3. 执行“在上方插入”和“在下方插入”，验证插入位置准确。

---

### Scenario 4: 防遮挡与下拉菜单互斥测试

1. 将非文本 Block 拖动或滚动至文档顶部或编辑器容器边缘。
2. 点击“插入块”下拉按钮，确认下拉菜单自动向上方或下方避让显示，不出现任何截断或溢出滚动条。
3. 在插入块菜单处于展开状态时，点击工具栏中的其他按钮（如代码块语言选择下拉框或编辑按钮）。
4. **期望结果**: 原插入块菜单自动关闭，实现多菜单互斥展示。
