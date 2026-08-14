# Quickstart Validation Guide: 内嵌 Block 交互优化与空白 Block 双击插入

**Feature Branch**: `008-nested-block-interaction`
**Date**: 2026-08-14
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## 验证准备

开发服务可通过命令行启动：

```bash
make dev
```

并在浏览器中访问前端编辑界面：
`http://localhost:5173/`

---

## 验证场景 1：双击 Block 下方与块间空白插入空白 Block

### 步骤
1. 打开文档编辑器，输入两段文字 Block。
2. 在第一段与第二段 Block 之间的缝隙区域双击鼠标左键。
3. 在任意 Block 的下方空白区域双击鼠标左键。
4. 插入一个高亮块（Callout），在高亮块内部文本下方的空白区域双击鼠标左键。

### 预期结果
- 步骤 2 成功在第一段与第二段之间插入一个新的空白段落 Block，光标自动聚焦在该新 Block 中。
- 步骤 3 成功在 Block 下方追加一个新的空白段落 Block 并聚焦。
- 步骤 4 成功在高亮块内部追加一个新的空白段落 Block，没有越界破坏高亮块容器。

---

## 验证场景 2：内嵌 Block 工具菜单栏优先与互斥展示

### 步骤
1. 插入一个高亮块（Callout）。
2. 在高亮块内部插入一个表格（Table）。
3. 鼠标点击表格内部单元格。
4. 在表格内部选中一段文本。
5. 在高亮块内插入一张图片（ImageBlock）并点击选中图片。

### 预期结果
- 步骤 3 时，仅浮现 `TableBubbleMenu`（表格工具栏），`CalloutBubbleMenu` 被隐蔽，无菜单重叠。
- 步骤 4 时，仅浮现 `BubbleToolbar`（文本格式工具栏），`TableBubbleMenu` 与 `CalloutBubbleMenu` 均隐藏。
- 步骤 5 时，仅浮现 `ImageBubbleMenu`（图片工具栏），`CalloutBubbleMenu` 保持隐藏。

---

## 验证场景 3：单元测试自动化校验

运行自动化测试验证菜单优先级与插件功能：

```bash
cd frontend && npm run test
```

所有测试用例应通过无报错。
