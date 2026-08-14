# Technical Research: 文案选择工具栏文本块类型切换 (Text Toolbar Block Type Switch)

## 调研目标

分析现有 `BubbleToolbar`（选中文本浮动工具栏）与 TipTap 编辑器 Command API 的集成机制，明确如何将“字号大小”下拉替换为“文本块类型”（Block Type Selector）控件，并新增支持“待办列表”(Task List / Task Item / Todo Block)。

## 关键技术决策

### 决策 1: 文本块类型提取与转换机制

- **选择**: 利用 TipTap 的 `editor.isActive(...)` API 动态检测当前选区所属的 Block 类型，并使用统一的声明式配置进行模式匹配。
- **依据**: 
  - `editor.isActive('paragraph')`
  - `editor.isActive('heading', { level: 1 })`
  - `editor.isActive('heading', { level: 2 })`
  - `editor.isActive('heading', { level: 3 })`
  - `editor.isActive('bulletList')`
  - `editor.isActive('orderedList')`
  - `editor.isActive('taskList')` (待办列表)
- **替代方案对比**:
  - 手动解析 ProseMirror Node 节点树：过度复杂且容易触发越界，TipTap 的 `isActive` 命令封装成熟且响应迅速。

### 决策 2: 待办列表 (Todo Block) 交互与链式命令封装

- **选择**: 在 TipTap 中使用 `editor.chain().focus().toggleTaskList().run()` 实现文本段落向带复选框的待办任务列表转换。
- **依据**: 项目中的 TipTap 扩展已支持 `TaskList` 和 `TaskItem` 扩展，使用 `toggleTaskList` 命令可以无缝实现普通段落/其他列表向待办列表的转换，且保留选中文本内容。
- **替代方案对比**:
  - 自定义 Node 注入：开销大，且可能引发 TipTap schema 不兼容问题。

### 决策 3: 工具栏组件结构解耦与下拉菜单浮动定位

- **选择**: 将原本 `BubbleToolbar` 中字号下拉位置替换为 `TextBlockTypeSelector` 组件，包含触发按钮（显示当前类型名称与图标，如“正文”、“标题 1”、“待办列表”）和下拉菜单。
- **依据**: 复用 `calculateSubMenuPosition` 智能定位算法，确保工具栏在靠近容器边缘时下拉菜单不被截断。

## 调研总结

方案具备高度可行性与良好的架构扩展性，可完全基于现有的 TipTap 插件与样式体系无缝升级。
