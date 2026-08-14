# Quickstart & Verification Guide: Split DocEditor Main Component

**Feature**: [spec.md](spec.md) | **Date**: 2026-08-15

## 1. Development & Build Verification

在前端开发目录下运行构建和类型检查命令，确保重构无 TypeScript 类型错误及编译失败：

```bash
# 1. 运行 TypeScript 类型检查
npm --prefix frontend run build
# 或者在根目录运行 make dev / pnpm check
```

## 2. Manual Verification Checklist

在浏览器打开本地开发服务 (`http://localhost:5173`) 测试以下核心功能流程：

1. **基础编辑与格式化**:
   - 输入文本，使用快捷键/选中文本控制加粗、倾斜、下划线、字号、高亮背景色。
2. **Slash 菜单与块切换**:
   - 输入 `/` 唤起 斜杠菜单，测试插入标题、代码块、表格、Callout 引用块、DrawIO 图表。
3. **悬浮拖拽句柄 (Drag Handle)**:
   - 鼠标悬浮在任意块左侧，拖拽句柄应出现。
   - 拖拽句柄可放置块至新位置，放置指示条 (Drop Indicator) 准确指示目标位置。
   - 点击拖拽句柄可唤起块类型转换菜单 (BlockTypeMenu)。
4. **表格与 Callout 专属工具栏**:
   - 悬浮在表格或 Callout 块上，专用工具栏平滑出现，离开防抖隐藏。
5. **DrawIO 弹窗与图片插入**:
   - 双击 DrawIO 块，打开 DrawIO 模态框，保存后成功更新图形 SVG/XML。
   - 点击/拖入图片，显示上传预览与准备就绪状态。

## 3. Code Metrics Verification

运行以下脚本或命令，验证 `index.tsx` 行数缩减效果：

```bash
wc -l frontend/src/components/DocEditor/index.tsx
```

**期望结果**: 行数小于等于 200 行（原 859 行）。
