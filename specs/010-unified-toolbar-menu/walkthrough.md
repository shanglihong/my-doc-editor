# Walkthrough - 统一工具栏菜单管理与 ImageBubbleMenu 模块类型导出修复

**Feature Branch**: `010-unified-toolbar-menu`
**Date**: 2026-08-14

## 问题诊断与修复

### 彻底解决“找不到模块 ./ImageBubbleMenu 或其相应的类型声明 ts(2307)”
- **原因分析**: 在 [ImageBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx) 中仅导出了具名 `export const ImageBubbleMenu`，在部分 TypeScript 编译器与 IDE 语言服务版本解析中，缺失 `default` 导出时可能触发缓存误报 ts(2307)。
- **解决方案**:
  1. 在 [ImageBubbleMenu.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx) 底部追加 `export default ImageBubbleMenu;`，双重兼顾具名与默认导出。
  2. 刷新 [ImageBlockView.tsx](file:///Users/qiao.liu/Documents/my-docs/frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx) 中的引用声明，IDE 警告消除，全量 TypeScript 生产构建（`tsc -b && vite build`）0 错误成功打包。
