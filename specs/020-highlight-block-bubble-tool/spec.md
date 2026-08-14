# Feature Specification: Highlighting Block Bubble Tool Support

**Feature Branch**: `020-highlight-block-bubble-tool`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "高亮块中的文本block应该能使用bubble tool"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 高亮块内部文本选中文本时使用悬浮工具栏 (Priority: P1)

用户在高亮块（Highlight Block）内的文本块中选择一段文本时，系统自动弹出浮动工具栏（Bubble Toolbar），允许用户对高亮块内的文本执行基础格式化操作（如加粗、斜体、字号、颜色、高亮、链接等）。

**Why this priority**: 高亮块是编辑器的核心块级元素之一，用户在高亮块内部编写文本时同样存在丰富的样式编排需求。支持 Bubble Tool 能提升内容创作的一致性与体验。

**Independent Test**: 在编辑器中插入高亮块，并在高亮块内部输入文本并选中文本，校验悬浮工具栏是否正常显示且各项格式化功能可用。

**Acceptance Scenarios**:

1. **Given** 用户在文档中创建了一个高亮块并在其中输入了文本，**When** 用户高亮选选中该文本块中的部分或全部文字，**Then** 悬浮工具栏（Bubble Tool）应在选中区域上方或上方附近正常弹出显示。
2. **Given** 悬浮工具栏已高亮显示在选中文本上方，**When** 用户点击工具栏上的格式按钮（如加粗、斜体、文本颜色、字号调节等），**Then** 被选中的高亮块内部文本应正确应用对应的样式。

---

### User Story 2 - 高亮块内文本块类型与样式状态响应 (Priority: P2)

悬浮工具栏能准确高亮反映高亮块内部选中文本的当前格式状态（例如当前字号、颜色、是否已加粗），并支持切换块类型或清除格式。

**Why this priority**: 保证工具栏状态与所选文本的实际属性保持同步，避免用户误判文本格式状态。

**Independent Test**: 在高亮块内部的文本应用不同格式后选中文本，观察悬浮工具栏图标与下拉框的激活状态是否与选中内容匹配。

**Acceptance Scenarios**:

1. **Given** 高亮块内部文本已包含某种格式（例如斜体、红色文本），**When** 用户再次选中该文本，**Then** 悬浮工具栏中对应的格式按钮应显示为激活/高亮状态。
2. **Given** 用户在高亮块内选中文本并点击清除格式或更改文本块类型，**When** 操作完成，**Then** 文本块响应更新，且高亮块容器结构保持稳定。

---

### Edge Cases

- 选中文本范围同时跨越高亮块内部和高亮块外部的段落时，悬浮工具栏的行为及格式化作用域。
- 在高亮块内部的嵌套列表或多级段落中文本选中的冒泡与工具栏定位。
- 当高亮块处于只读模式或只读区域时，悬浮工具栏应自动禁用或隐藏。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须支持在高亮块（Highlight Block）内部的文本块触发并显示悬浮工具栏（Bubble Toolbar）。
- **FR-002**: 悬浮工具栏必须提供完整的文本格式化选项（加粗、斜体、下划线、删除线、字号、字体颜色、背景高亮色、超链接等），并正确作用于高亮块内的选中文本。
- **FR-003**: 悬浮工具栏必须能实时响应并展示高亮块内当前选中文本的属性状态。
- **FR-004**: 格式化高亮块内部文本时，系统必须保证高亮块本身的容器结构及已有配置（如高亮块背景色、图标等）不受破坏。

### Key Entities

- **Highlight Block (高亮块)**: 编辑器中的块级容器，包含背景色、图标及子节点文本块。
- **Bubble Toolbar (悬浮工具栏)**: 文本选选中时跟随弹出的样式与操作工具栏组件。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户在高亮块内选中文本后，悬浮工具栏在 200 毫秒内顺畅弹出。
- **SC-002**: 100% 的文字格式化指令（如加粗、改变字号、修改颜色）在高亮块内部文本上均能准确生效并持久化。
- **SC-003**: 对高亮块内部文本执行格式化或工具栏交互时，高亮块容器结构零异常破坏。

## Assumptions

- 高亮块内部的文本节点使用标准的富文本编辑器 schema。
- Bubble Toolbar 的显示条件基于标准的 Text Selection 状态监听。
