# Walkthrough - 统一工具栏菜单管理与相邻高亮块隔离修复

**Feature Branch**: `010-unified-toolbar-menu`
**Date**: 2026-08-14

## 问题深入诊断与解决方案

### 彻底解决“两个高亮块中间空白 Block 被删除后，两个高亮块会自动合并”的问题
- **病因分析**: 在 TipTap / ProseMirror Schema 规范中，节点默认未设置 `isolating: true` 隔离属性。当删除了两个相邻高亮块（Callout）之间的空白段落时，ProseMirror 的默认节点平铺算法会认为边界失效，自动将两个 Callout 容器融合成一个。
- **解决方案**:
  1. 在 [CalloutExtension.ts](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/CalloutExtension.ts) 节点 Schema 定义中添加 `isolating: true` 隔离标记。
  2. 声明每个高亮块为绝对块级隔离区。删除相邻间的空白 Block 或在内部退格（Backspace）时，前后的两个高亮块绝不会自动合并，保持独立完整的块结构。

---

## 验证总结

已成功完成高亮块隔离规范更新，全量编辑器交互体验稳定。
