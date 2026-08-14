# 技术研究与方案设计: DocEditor 内置 H1 文档标题

## 研究目标

针对在基于 Tiptap (ProseMirror) 的 DocEditor 组件中实现“内置固定 H1 标题”的需求进行技术可行性研究，评估架构选项并确定最佳实现策略。

## 研究课题与决策记录

### 课题 1: 标题节点在 Tiptap/ProseMirror Schema 中的建模策略

**可选方案评估**:

1. **方案 A: 改造 Document Schema 定义 (`doc: 'title block+'`)**
   - **实现机制**: 创建自定义 `DocumentTitle` 扩展，继承 `@tiptap/extension-document`，将 Document 的 `content` 规格重定义为 `title block+`。同时定义 `Title` 节点扩展，渲染为 `<h1>` HTML 元素。
   - **优点**: 在 Schema 语法树层面强制约束文档结构的第一个节点必须且只能是 `title`，后续为普通块节点。ProseMirror 自动保证物理存储中包含 title，彻底避免标题被误删。
   - **缺点**: 需要自定义 Title 节点以及调整 Markdown 解析/序列化配置。
   - **结论**: 推荐。这是最严谨且根源性解决“防删除”、“固定位置”的规范解法。

2. **方案 B: 规则限制首节点 Heading (ProseMirror Plugin / appendTransaction)**
   - **实现机制**: 保留原有的 `doc: 'block+'` 结构，通过 `appendTransaction` 检查文档首节点是否为 H1；若不是则自动插入或转换；通过快捷键拦截防删除。
   - **优点**: 无需更改基础 Document Schema。
   - **缺点**: 属于防御性校验，补丁多，防删除、拖拽排序、回车分割等边缘场景极易漏掉逻辑，导致标题节点被破坏。

**决策结果**: 采用 **方案 A (自定义 DocumentTitle + Title 节点)**。

---

### 课题 2: 标题节点的按键与删除拦截机制

**关键场景分析**:

1. **标题内回车 (Enter)**:
   - 行为: 不应在标题内产生换行（`<br>`），也不应切割标题节点。在标题任意位置按回车时，光标跳入下方首个正文块（若下方无正文块则自动创建段落块）。
   - 实现: 在 `Title` 节点扩展中配置 `addKeyboardShortcuts` 拦截 `Enter`，执行聚焦/创建下一块操作。

2. **标题内退格/删除 (Backspace / Delete)**:
   - 行为: 当光标位于标题开头，按下 Backspace 时，不允许与前节点合并（前无节点）也不允许删除标题块；标题为空时继续保留空标题节点。
   - 实现: 拦截 `Backspace`，当光标在标题且处于节点起始位置时阻止默认事件。

3. **拖拽与块类型菜单防护**:
   - 行为: 侧边拖拽手柄（DragHandle）与块类型菜单不应允许拖拽标题或将标题切换为其他块类型（如 H2、列表）。
   - 实现: 在拖拽手柄与菜单显示逻辑中判断，若目标节点类型为 `title`，隐藏拖拽与类型切换入口。

**决策结果**: 在 `Title` 节点的 `addKeyboardShortcuts` 与全局 `DragHandlePlugin` / `BlockTypeMenu` 中施加类型级别过滤。

---

### 课题 3: 标题差异化占位符 (Placeholder) 与 Markdown 序列化

**技术要点**:

1. **占位符**:
   - Tiptap 的 `@tiptap/extension-placeholder` 支持根据 `node` 节点动态返回提示语。
   - 规则: 若 `node.type.name === 'title'`，显示 `请输入文档标题`；否则显示 `输入 "/" 唤起快捷菜单...`。

2. **Markdown 互转**:
   - 导出 Markdown 时: 第一行输出 `# 标题内容\n\n`，后续输出正文。
   - 导入 Markdown 时: 解析首行 `# ...` 作为 Title 节点；若首行不是 `#`，则将第一行纯文本升格为 Title 节点或生成空 Title 节点。

**决策结果**: 配合 `tiptap-markdown` 配置自定义 Title 节点的 parse/serialize 规则。
