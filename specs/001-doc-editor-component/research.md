# 技术研究与方案选择：个人知识库文档编辑器前端组件

**功能规范文件**: [spec.md](./spec.md)
**创建时间**: 2026-08-12

## 1. 核心架构选型

### 决策 1：底层富文本引擎选型

- **选定方案**: **Tiptap 2.x (基于 ProseMirror)**
- **选择理由**:
  - Tiptap 是当前前端领域极具现代感的 headless 块级富文本框架，完全解耦 DOM 视图与逻辑。
  - 原生支持基于 Node View 的自定义组件嵌入（完美集成 React 组件如 Excalidraw）。
  - 提供良好的 Schema 扩展机制，能够方便地定义容器节点（Nested Callout Container）及 Mark 文本样式。
- **放弃替代方案**:
  - *Slate.js*: 更加底层，需自行编写大量文本计算与把手选区控制逻辑，开发与维护成本高。
  - *Draft.js*: 社区已基本停止更新，缺乏现代 block/nesting 容器机制支持。
  - *Quill / CKEditor*: 结构偏传统文档，拓展块级容器和 React 嵌套组件极不方便。

---

### 决策 2：Excalidraw 嵌入式画图组件集成机制

- **选定方案**: **Tiptap React Custom NodeView (`@excalidraw/excalidraw`)**
- **选择理由**:
  - `@excalidraw/excalidraw` 提供了完整的 React 原生画布组件。
  - 通过 Tiptap `ReactNodeViewRenderer` 将 Excalidraw 画布封装为 `ExcalidrawBlock` 节点。
  - 块未被激活时，渲染内联预览图与全屏编辑按钮；点击编辑时挂载 Excalidraw 交互面板。数据（`elements`, `appState`）以 JSON 格式保存在 Block Node `attrs` 中。
- **放弃替代方案**:
  - *iframe 嵌入模式*: 通信复杂，依赖 `postMessage` 容易丢失状态且难以无缝捕获 Markdown 导出。

---

### 决策 3：高亮嵌套容器 (Callout Container) 实现

- **选定方案**: **ProseMirror 嵌套 Node View 方案 (`content: "block+"`)**
- **选择理由**:
  - 在 Tiptap 中定义 `CalloutNode` 扩展，设置 `group: "block"`, `content: "block+"` (充当通用 block 容器)。
  - 定义 `attrs`: `icon`, `iconType`, `themeColor`, `customBg` 等。
  - 允许在容器内自由使用斜杠 `/` 菜单继续创建与缩进任何级别的 block（文本、列表、表格、代码块）。

---

### 决策 4：块级拖拽重排 (Block Drag & Drop) 实现

- **选定方案**: **ProseMirror DragHandle Plugin + 放置指示线**
- **选择理由**:
  - 使用 Tiptap/ProseMirror 的视图插件监听 `mousemove` 事件，当光标靠近目标 Block 左侧边界时，动态定位六点把手（`DragHandle`）。
  - 拖拽过程触发 ProseMirror `drop` 事件，通过 transaction 在 DOM 树中插入放置指示线（Placement Indicator），松开后更新 Block AST 节点层次。

---

### 决策 5：Block AST 与 Markdown 双向转换机制

- **选定方案**: **tiptap-markdown 转换扩展**
- **选择理由**:
  - 利用 `tiptap-markdown` 解析器将 ProseMirror Doc JSON AST 直接转换成兼容标准规范的 Markdown 字符串。
  - 对于 Excalidraw 画图块与 Callout 复杂容器，输出具有规则标记的扩展 Markdown（如 `:::callout[icon=info theme=blue]` 与 `:::excalidraw` 代码块）。
