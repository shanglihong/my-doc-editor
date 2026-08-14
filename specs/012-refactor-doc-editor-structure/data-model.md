# Data Model & Structure Mapping: DocEditor 模块结构映射

## 1. CSS 模块映射关系 (CSS Modules Mapping)

| 原始 CSS 块位置 | 目标 CSS Module 文件路径 | 涵盖的 UI 组件/功能 |
| :--- | :--- | :--- |
| `DocEditor.module.css` (顶部全局) | `DocEditor.module.css` | `.editorContainer`, `.editorContent`, `.ProseMirror` 等基础排版与编辑器顶层容器 |
| `DocEditor.module.css` (Callout 部分) | `components/Callout/Callout.module.css` | 呼出块容器、图标选择器、颜色边框样式 |
| `DocEditor.module.css` (DrawIO 部分) | `components/DrawIO/DrawIO.module.css` | DrawIO 图表预览框、编辑遮罩、全屏编辑按钮 |
| `DocEditor.module.css` (ImageBlock 部分) | `components/ImageBlock/ImageBlock.module.css` | 图片容器、缩放拖拽柄、对齐浮动工具条 |
| `DocEditor.module.css` (CodeBlock 部分) | `components/CodeBlock/CodeBlock.module.css` | 代码块语言切换器、复制按钮、代码区域 |
| `DocEditor.module.css` (BubbleToolbar 部分) | `components/BubbleToolbar/BubbleToolbar.module.css` | 选中文本浮动工具栏、按钮组、链接输入弹窗 |
| `DocEditor.module.css` (UnifiedBlockToolbar) | `components/UnifiedBlockToolbar/UnifiedBlockToolbar.module.css` | 块添加拖拽点、菜单容器、浮动条 |
| `DocEditor.module.css` (SlashMenu 部分) | `components/SlashMenu/SlashMenu.module.css` | `/` 命令弹出菜单列表与菜单项 |
| `DocEditor.module.css` (TableBubbleMenu) | `components/TableBubbleMenu/TableBubbleMenu.module.css` | 表格行列增删浮动工具栏 |

---

## 2. ImageBlock 组件与扩展文件映射 (File Refactoring Mapping)

| 原始路径 | 重构后目标路径 | 文件类型/职责 |
| :--- | :--- | :--- |
| `extensions/ImageBlock/ImageBlockComponent.tsx` | `components/ImageBlock/ImageBlockComponent.tsx` | React NodeView 组件入口 |
| `extensions/ImageBlock/ImageBlockView.tsx` | `components/ImageBlock/ImageBlockView.tsx` | 图片渲染与调整核心视图 |
| `extensions/ImageBlock/ImageBlockWidthHandler.tsx` | `components/ImageBlock/ImageBlockWidthHandler.tsx` | 图片宽度拖拽调整柄 |
| `extensions/ImageBlock/ImageBlockExtension.ts` | `extensions/ImageBlockExtension.ts` | Tiptap Node 扩展注册逻辑 |
| *(新建)* | `components/ImageBlock/ImageBlock.module.css` | 图片块独立样式模块 |
