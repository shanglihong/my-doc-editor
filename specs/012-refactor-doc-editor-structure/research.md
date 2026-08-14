# Research: DocEditor 代码结构与样式重构调研

## 1. DocEditor.module.css 拆解策略

### 现状分析
当前 `DocEditor.module.css` (约 17KB) 包含了以下几种混合级别的样式：
1. **编辑器全局/容器样式**：包含 `.editorContainer`, `.editorContent`, Tiptap 编辑区 `.ProseMirror` 的全局排版、焦点环、基础块间距等。
2. **工具栏与浮动菜单样式**：包含 UnifiedBlockToolbar, BubbleToolbar, SlashMenu, BlockTypeMenu, NonTextBlockToolbar, TableBubbleMenu 等。
3. **特定 Block 组件样式**：包含 Callout, DrawIO, CodeBlock, ImageBlock, TableBlock 等。

### 拆解方案决策
- **核心容器与全局基础样式**：保留在 `frontend/src/components/DocEditor/DocEditor.module.css`，作为编辑器的基础框架样式。
- **独立 UI 组件样式**：沉淀至各自组件目录下：
  - `components/Callout/Callout.module.css`
  - `components/DrawIO/DrawIO.module.css`
  - `components/ImageBlock/ImageBlock.module.css`
  - `components/CodeBlock/CodeBlock.module.css`
  - `components/BubbleToolbar/BubbleToolbar.module.css`
  - `components/UnifiedBlockToolbar/UnifiedBlockToolbar.module.css`
  - `components/SlashMenu/SlashMenu.module.css`
  - `components/TableBubbleMenu/TableBubbleMenu.module.css`
  - `components/NonTextBlockToolbar/NonTextBlockToolbar.module.css`
  - `components/BlockTypeMenu/BlockTypeMenu.module.css`

---

## 2. ImageBlock 目录结构重构分析

### 现状分析
`extensions/ImageBlock/` 目录下同时包含：
- React UI 交互视图：`ImageBlockComponent.tsx`, `ImageBlockView.tsx`, `ImageBlockWidthHandler.tsx`
- Tiptap Node Extension 定义：`ImageBlockExtension.ts`

而项目中其他 Extension（如 `CalloutExtension.ts`, `DrawIOExtension.ts`）的架构模式为：
- UI 交互视图放于 `components/Callout/`, `components/DrawIO/`
- Extension 配置与节点定义放于 `extensions/` 顶层

### 重构方案决策
1. **新建 UI 目录**：`frontend/src/components/DocEditor/components/ImageBlock/`
2. **迁移视图代码**：将 `ImageBlockComponent.tsx`, `ImageBlockView.tsx`, `ImageBlockWidthHandler.tsx` 移入 `components/ImageBlock/`。
3. **新设 CSS 模块**：在 `components/ImageBlock/` 中创建 `ImageBlock.module.css`，从大 CSS 文件中提取图片块缩放柄、对齐控制框、对齐工具栏等独立样式。
4. **规范 Extension 位置**：将 `ImageBlockExtension.ts` 规范调整并导入 `components/ImageBlock/` 的 React 节点视图。

---

## 3. 代码结构与可维护性提升

### 决策与规范
1. **组件封装一致性**：所有 `components/` 下的 UI 子组件使用统一的目录布局——组件源文件 + `*.module.css` + `index.ts`（若需要统一导出）。
2. **依赖依赖层级单向**：
   - `index.tsx` (DocEditor 主入口) -> 引用 `components/*` 与 `extensions/*`
   - `extensions/*` -> 仅配置 Node/Mark/Plugin，必要时引入 `components/*` 作为 ReactNodeView
   - `components/*` -> 仅处理 UI 渲染与交互，不反向依赖 `index.tsx`
3. **零破坏保障**：
   - 保持所有 CSS Module 的类名导出逻辑不变
   - 保持 Tiptap Node/Extension 的 HTML 属性、Schema 定义、数据结构完全不变
