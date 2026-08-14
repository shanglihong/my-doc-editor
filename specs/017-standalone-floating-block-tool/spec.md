# 需求规范：独立悬浮 Block Tool 子组件与非文本块统一对接 (Standalone Floating Block Tool Subcomponent & Non-Text Block Integration)

**Feature Branch**: `017-standalone-floating-block-tool`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "以高亮块的block tool作为基准，独立一个悬浮block tool的子组件，要求非文本block均对接该子组件。统一要求：1.鼠标在block悬停则展示，离开则隐藏；2.当点击block tool时（是一个菜单）隐藏拖拽按钮；3.点击拖拽按钮时隐藏block tool；4.不同的block tool可能会有一些定制的按钮功能需要兼容。"

## 用户场景与测试 *(mandatory)*

### 用户故事 1 - 独立悬浮 Block Tool 子组件封装与定制兼容 (Priority: P1)

作为开发者和用户，需要以高亮块（Highlight/Callout Block）的块工具栏（Block Tool）作为外观、结构与交互基准，提炼并独立出一个通用的悬浮 Block Tool 子组件。该子组件统一管理悬浮操作栏的渲染、高亮块基准样式、浮动定位与显示隐藏逻辑，同时支持不同 Block 的定制按钮功能插槽兼容。

**Why this priority**: 抽取独立通用的悬浮 Block Tool 子组件并支持定制按钮扩展，是消除各非文本块组件重复代码、统一设计规范与交互逻辑的基础前提。

**Independent Test**: 将独立出来的悬浮 Block Tool 子组件单独使用或在高亮块中测试，验证其视觉外观、悬浮定位与通用控制按钮与原有高亮块 Block Tool 完全一致，且传入定制按钮时能够正常渲染并响应操作。

**Acceptance Scenarios**:

1. **Given** 独立封装的悬浮 Block Tool 子组件，**When** 传入对应的 Block 状态与配置参数时，**Then** 正确渲染符合高亮块基准样式的悬浮工具栏。
2. **Given** 不同的 Block 拥有专属功能需求（如代码块语言切换、图片块对齐设置），**When** 在悬浮 Block Tool 中配置对应的定制按钮插槽，**Then** 定制按钮顺利渲染且正常触发各自的回调逻辑。

---

### 用户故事 2 - 所有非文本 Block 统一对接悬浮 Block Tool (Priority: P2)

作为编辑器的用户，在对任何非文本 Block（包括高亮块 Callout、代码块 Code Block、表格块 Table Block、图片块 Image Block、DrawIO 图表块等）进行交互时，均使用统一的悬浮 Block Tool 子组件呈现工具栏。

**Why this priority**: 统一所有非文本 Block 的悬浮工具栏体验，保障交互的一致性与视觉高保真，避免各个非文本块拥有各自样式不一、行为不一致的硬编码工具栏。

**Independent Test**: 依次在文档中插入高亮块、代码块、表格块、图片块与 DrawIO 图表块，验证均显示统一规范的悬浮 Block Tool。

**Acceptance Scenarios**:

1. **Given** 用户在文档中选中或悬停任意非文本 Block，**When** 块激活时，**Then** 该 Block 均通过统一的悬浮 Block Tool 子组件渲染其悬浮工具栏。

---

### 用户故事 3 - 统一的鼠标悬停与拖拽按钮互斥控制 (Priority: P3)

作为用户，在对任何非文本 Block 进行鼠标悬停、激活 Block Tool 菜单或使用拖拽按钮时，遵循统一的显隐与互斥规则。

**Why this priority**: 统一的显隐与互斥逻辑可以消除工具栏与拖拽句柄之间的视觉重叠与不稳定性，提供顺畅的操作体验。

**Independent Test**: 在非文本 Block 上移动鼠标及点击工具栏/拖拽按钮，验证 4 项统一规则生效。

**Acceptance Scenarios**:

1. **Given** 鼠标移动至任意非文本 Block 上，**When** 鼠标进入 Block 区域，**Then** 显示悬浮 Block Tool；**When** 鼠标离开 Block 区域，**Then** 自动隐藏 Block Tool。
2. **Given** 当前 Block 显示了拖拽按钮与 Block Tool，**When** 用户点击 Block Tool（展开菜单），**Then** 拖拽按钮自动隐藏。
3. **Given** 当前 Block 显示了 Block Tool，**When** 用户点击拖拽按钮准备拖拽，**Then** Block Tool 自动隐藏。

---

### 边界情况

- **多层嵌套块/复杂选区**: 当非文本 Block 处于嵌套容器（如表格单元格内）时，悬浮 Block Tool 的层级与定位需准确计算，避免超出遮挡。
- **自定义扩展项越界**: 当某些非文本 Block 传入较多定制扩展按钮时，悬浮工具栏需支持自动换行或响应式收容，防止超出编辑器有效视口。
- **菜单展开时的离块处理**: 当用户点击 Block Tool 展开下拉菜单后，鼠标即使暂时离开 Block 区域， Block Tool 及下拉菜单也应保持开启，直到菜单关闭或在外部点击。

## 需求 *(mandatory)*

### 功能需求

- **FR-001**: 系统 MUST 以高亮块（Callout Block）现有的 Block Tool 外观、DOM 布局与交互规范为基准，提取并独立为一个可复用的悬浮 Block Tool 子组件。
- **FR-002**: 悬浮 Block Tool 子组件 MUST 提供标准的 Props 接口与插槽，完美兼容不同 Block 的定制按钮功能需求（如特定设置菜单、下拉选择框等）。
- **FR-003**: 所有的非文本 Block（包含 Callout 高亮块、Code Block 代码块、Table Block 表格块、Image Block 图片块、DrawIO 图表块等）MUST 统一对接使用该独立悬浮 Block Tool 子组件。
- **FR-004**: 悬浮 Block Tool 子组件 MUST 实现统一的悬停显隐规则：鼠标进入 Block 触发区域时展示悬浮 Block Tool，鼠标离开触发区域时隐藏 Block Tool（已展开菜单时保持显示直至菜单关闭）。
- **FR-005**: 悬浮 Block Tool 子组件 MUST 实现统一的交互互斥规则：当用户点击 Block Tool（展开菜单）时自动隐藏当前拖拽按钮；当用户点击拖拽按钮时自动隐藏 Block Tool。
- **FR-006**: 悬浮 Block Tool 子组件 MUST 保持样式代码的解耦与规范统一，主样式基于高亮块基准 CSS 进行抽离。

### 关键实体

- **FloatingBlockTool Component (悬浮 Block Tool 子组件)**: 统一的非文本块悬浮操作栏组件，负责基础 UI 渲染、定制按钮插槽集成、定位与 hover/click 生命周期控制。
- **Non-Text Block (非文本块)**: 编辑器中区别于普通文本段落的富结构节点（Callout, CodeBlock, Table, Image, DrawIO 等），统一对接 FloatingBlockTool 子组件。
- **Custom Tool Actions (定制按钮功能)**: 针对特定非文本 Block 传入的定制组件或按键，以插件插槽形式嵌入通用 Block Tool 中。

## 成功标准 *(mandatory)*

### 可衡量结果

- **SC-001**: 100% 的非文本 Block（Callout, CodeBlock, Table, Image, DrawIO）完成向独立悬浮 Block Tool 子组件的对接迁移。
- **SC-002**: 各非文本 Block 的悬浮工具栏严格遵循：hover 进入显示、离开隐藏；点击 Block Tool 隐藏拖拽按钮；点击拖拽按钮隐藏 Block Tool。
- **SC-003**: 各非文本 Block 的特定定制按钮功能 100% 能够在统一子组件中流畅加载与响应。

## 假设

- 高亮块（Callout Block）目前的 Block Tool 在视觉设计与交互逻辑上已得到认可，可以作为全局非文本 Block 工具栏的最佳实践基准。
- 对接独立子组件不会对已有的 Block 编辑器数据模型与节点解析产生破坏性改动。
