# Feature Specification: Block Style and Menu Adjustments

**Feature Branch**: `003-block-style-menu-adjustments`

**Created**: 2026-08-13

**Status**: Draft

**Input**: User description: "进行菜单，组件样式风格的调整 1.检查各block样式，整体保持简洁风格 2.悬浮菜单栏，工具栏不要被页面边框遮盖，可以适当调整出现在上方还是下方 3.block type使用统一的icon，icon简洁，符合block类型，并且色彩丰富 4.拖拽按钮左边加上block type的icon，点击后出现block类型切换的菜单 5.如果是一个空的block，拖拽按钮左边则展示一个加号的icon，点击后出现菜单同4"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 简洁统一的 Block 样式与类型图标 (Priority: P1)

用户在编辑文档时，希望所有 Block 组件呈现统一且简洁的视觉风格。每个 Block 类型（如段落、各级标题、无序/有序列表、代办事项、代码块、引用块、DrawIO 图表等）都拥有符合其语义、视觉简洁且色彩丰富的图标标识。

**Why this priority**: 良好的视觉规范和直观的类型图标是提升编辑器整体美观度与用户感知质量的基础。

**Independent Test**: 打开编辑器，插入并预览不同类型的 Block，检查样式是否简洁一致，且每个 Block 类型展示对应的多彩 Icons。

**Acceptance Scenarios**:

1. **Given** 用户在文档中查看不同类型的 Block，**When** 浏览页面内容，**Then** 各 Block 样式保持视觉上的简洁大方，间距与字号规范统一。
2. **Given** 用户打开 Block 类型选择或识别，**When** 查看 Block 图标，**Then** 图标保持设计风格统一、形态简洁、符合类型含义，且具备丰富的色彩标识。

---

### User Story 2 - 拖拽按钮与 Block Icon / 加号 Icon 的互动与类型菜单 (Priority: P1)

用户在编辑具体 Block 时，非空 Block 的拖拽按钮左侧展示当前 Block 类型的彩色 Icon，点击该 Icon 可触发 Block 类型切换菜单；空 Block 的拖拽按钮左侧展示加号 Icon，点击同样弹出 Block 类型切换菜单（或添加菜单）。

**Why this priority**: 这是用户在编辑行内频繁交互的核心入口，将类型选择与 Icon 直接贴合在拖拽控制区能极大提升编辑效率。

**Independent Test**: 在非空 Block 和空 Block 上分别观察拖拽控制区左侧图标形态，点击后验证是否弹出完整的 Block 类型切换菜单并可成功切换类型。

**Acceptance Scenarios**:

1. **Given** 处于一个非空 Block 行，**When** 悬浮或聚焦到该 Block，**Then** 拖拽按钮左侧显示该 Block 类型的对应彩色图标。
2. **Given** 点击非空 Block 拖拽按钮左侧的 Block 类型图标，**When** 触发点击事件，**Then** 弹出 Block 类型切换菜单，选择新类型后 Block 成功转换。
3. **Given** 处于一个空的 Block 行（无文本内容），**When** 悬浮或聚焦到该 Block，**Then** 拖拽按钮左侧展示加号图标。
4. **Given** 点击空 Block 拖拽按钮左侧的加号图标，**When** 触发点击事件，**Then** 弹出与 Block 类型切换/新增一致的菜单供用户挑选 Block 类型。

---

### User Story 3 - 悬浮菜单栏与工具栏防遮挡智能定位 (Priority: P2)

当用户选中文本或触发悬浮工具栏、Block 转换菜单时，浮动菜单栏不应被浏览器视口或页面容器边框遮挡，能够根据顶部/底部空间自动在上方或下方弹出。

**Why this priority**: 避免菜单弹出时被切割或超出可视区域，确保良好的交互可用性。

**Independent Test**: 在页面最顶部和最底部触发悬浮菜单与工具栏，验证菜单是否会自动翻转至可视一侧，不被边框截断。

**Acceptance Scenarios**:

1. **Given** 用户在靠近页面顶部或底部的位置触发悬浮工具栏或右键/点击菜单，**When** 菜单弹出，**Then** 菜单自动检测边界空间，若上方空间不足则显示在下方，下方空间不足则显示在上方，避免被边框遮盖。

---

### Edge Cases

- 当 Block 处于页面最边缘（如首行或末行）且紧贴容器边缘时，弹出菜单的位置调整策略是否会导致页面抖动或滚动条跳动？
- 当在极小屏视口或多层嵌套容器内使用时，工具栏和悬浮菜单的翻转定位算法能否正确感知边界？

## Clarifications

### Session 2026-08-13

- Q: 弹出菜单项是否需要显示功能副标题/描述文字？ -> A: 菜单保持极简，不需要副标题/描述文字，只展示图标与主标题名称。
- Q: 菜单的图标呈现与项内间距有何要求？ -> A: 使用简洁独立的图标形态（无需冗余背景色衬底），并调优图标与标题之间的水平间距与菜单整体内边距，呈现呼吸感与舒适视觉比例。
- Q: 菜单展开时的滚动行为限制如何控制？ -> A: 弹出菜单展示期间锁定页面/外部容器滚动，滚轮交互仅作用于菜单内部列表滚动，关闭后恢复外围滚动。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统 MUST 统一各 Block 组件的 CSS 样式规范，确保视觉上保持简洁大方。
- **FR-002**: 系统 MUST 为所有支持的 Block 类型提供设计统一、简洁且色彩丰富的图标。
- **FR-003**: 系统 MUST 在非空 Block 的拖拽控制按钮左侧展示当前 Block 类型对应的图标。
- **FR-004**: 系统 MUST 在空 Block 的拖拽控制按钮左侧展示加号（+）图标。
- **FR-005**: 用户点击非空 Block 的类型图标或空 Block 的加号图标时，系统 MUST 弹出 Block 类型切换/选择菜单。
- **FR-006**: 系统 MUST 在用户从类型切换菜单中选择目标 Block 类型后，将当前 Block 转换为对应类型并保持光标聚焦。
- **FR-007**: 系统的悬浮菜单栏和工具栏 MUST 实现智能边界检测与防遮挡定位，根据上下方可用空间动态选择出现在上方或下方。
- **FR-008**: 所有的 Block 类型切换与快捷菜单项 MUST 保持极简风格，只展示图标与类型主标题，不包含副标题/描述文案。
- **FR-009**: 菜单项内的图标 MUST 采用极简透明背景形态呈现，且图标与标题间距保持 8px-10px 舒适视觉间隔。
- **FR-010**: 浮动菜单展开期间系统 MUST 锁定外部页面与文档容器滚动，仅允许菜单内部列表响应滚轮滚动，菜单关闭后自动恢复原滚动状态。

### Key Entities

- **BlockElement**: 代表文档中的一个块级节点，包含类型（type）、内容（content）、是否为空（isEmpty）等状态。
- **BlockIconSpec**: 代表 Block 类型的图标配置，包含图标组件/路径、标准视觉风格与颜色定义。
- **FloatingMenuToolbar**: 悬浮工具栏及弹出菜单组件，具备视口/容器边界识别与上下翻转定位逻辑。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% 的 Block 类型（包括段落、标题、列表、代码块、引用、DrawIO 等）在拖拽控制区均拥有明确、统一且富色彩的图标标识。
- **SC-002**: 用户点击 Block Icon 或加号图标打开类型切换菜单的响应时间小于 100ms。
- **SC-003**: 在页面顶部 50px 内或底部 50px 内触发悬浮菜单时，悬浮菜单 100% 不会被容器边框或浏览器视口截断。
- **SC-004**: 用户对于空/非空 Block 转换的操作路径缩短，提升编辑流畅度。

## Assumptions

- 拖拽按钮与左侧图标作为一个整体控制区显示在 Block 的左侧外边距或行首位置。
- 图标集使用统一的图标库（如 Lucide Icons 或自定义 SVG 图标库），并通过统一的色彩方案赋值。
- 浮动定位使用成熟的边缘检测或 Popper/Floating-UI 逻辑进行碰撞判断。
