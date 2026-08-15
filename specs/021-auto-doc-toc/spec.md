# Feature Specification: Auto-Generated Document Table of Contents (TOC)

**Feature Directory**: `specs/021-auto-doc-toc`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "我需要有一个自动生成的目录，目录内容是文档的h1，2，3，不需要处理内嵌块，文档编辑需要自动更新目录。目录位置在左留白处，样式保存一致风格，目录不使用时（鼠标没有悬停）显示一个目录的icon，并且目录始终置顶在左上角不会随页面滚动而被遮盖"

## Clarifications

### Session 2026-08-15
- Q: 点击目录后导航定位行为是什么？ → A: 点击目录中的条目后，视图能跳转平滑滚动至对应标题的锚点位置（Anchor Positioning），并将页面滚动与视口锁定在对应标题节点处。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 自动解析 H1/H2/H3 标题生成目录树与锚点定位 (Priority: P1)

当用户在文档中录入或修改 H1、H2、H3 标题时，系统自动扫描并解析当前文档顶层的标题结构，在左侧留白区域实时同步构建清晰的目录树。忽略嵌套在内嵌块（如 Callout、高亮块、引用块等）内部的标题。点击目录条目能够触发平滑滚动与锚点定位。

**Why this priority**: 目录的核心价值在于根据主文档树的层级结构（H1、H2、H3）提供清晰的大纲导航，忽略内嵌干扰、实时同步并支持精准锚点定位是目录功能的基础。

**Independent Test**: 在文档中新建多级标题（H1/H2/H3）以及在内嵌块中放置标题，检查目录树是否仅包含顶层 H1/H2/H3，且文本编辑时目录内容自动准确更新；点击目录节点确认准确平滑滚动并锚点定位至相应标题。

**Acceptance Scenarios**:

1. **Given** 用户在文档中编辑主层级的 H1、H2、H3 标题，**When** 标题文本或级别发生变更（或新增/删除标题），**Then** 左侧目录组件在 100 毫秒内无缝更新对应的标题节点与缩进层级。
2. **Given** 用户在内嵌容器（如 Callout 块、Quote 块）中插入了 H1/H2/H3 标题，**When** 系统生成目录时，**Then** 目录树会自动过滤忽略内嵌块内部的标题，仅保留主文档流的标题结构。
3. **Given** 目录列表中展示了标题条目，**When** 用户点击目录中的某个标题项，**Then** 视图平滑滚动并锚点定位（Anchor Positioning）至编辑器中对应的标题节点处。

---

### User Story 2 - 左侧留白浮动固定定位与悬停展开交互 (Priority: P1)

目录组件固定置顶在屏幕左侧留白区（Sticky/Fixed），不会随着页面滚动而被遮盖或卷走。在未使用时表现为极简的目录图标，鼠标悬停或交互时展开完整的目录列表。

**Why this priority**: 左上角固定与微小的折叠图标既避免遮挡主正文编辑体验，又能在用户需要导航时随时一键开合，维持统一的现代化设计语言。

**Independent Test**: 上下滚动页面，确认目录按钮/面板始终置顶在左上角留白处；鼠标移入图标时面板平滑展开，移出后平滑收起为图标形态。

**Acceptance Scenarios**:

1. **Given** 用户向下长距离滚动编辑页面，**When** 页面滚动，**Then** 目录组件始终固定显示在浏览器左上角的留白区域（Top/Left Fixed），不会随视口滚动而被遮盖。
2. **Given** 鼠标未悬停在目录组件上，**When** 处于静止态，**Then** 仅展示一个微型极简的目录图标按钮（TOC Icon）。
3. **Given** 鼠标移动至目录图标或面板上方，**When** 触发 Hover 状态，**Then** 目录面板平滑展开显示完整标题层级；鼠标离开区域后面板自动收起回复为图标态。

---

### Edge Cases

- 当文档中完全没有 H1/H2/H3 标题时，目录图标的默认状态与提示（如置灰或展示空提示）。
- 当页面宽度在小屏幕（Mobile / Tablet 宽 < 1024px）下 left 留白受限时，目录图标的响应式适配与侧边抽屉或浮层处理。
- 当标题文本长度较长时，目录项的截断（Ellipsis）与 Hover 提示文本处理。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须自动提取并解析文档顶级主树中的 H1、H2、H3 标题节点生成目录结构。
- **FR-002**: 系统必须过滤忽略任何内嵌块（如 Callout、Quote、Table 等）内部包含的标题节点。
- **FR-003**: 目录内容必须与文档编辑状态实现实时自动同步（响应增、删、改标题）。
- **FR-004**: 目录组件必须采用固定定位（Fixed Position）锁定在页面左上角留白区域，确保在页面滚动过程中始终置顶、不被遮盖。
- **FR-005**: 目录组件默认显示为极简目录 Icon 状态，在鼠标悬停（Hover）或激活时展开完整目录树面板，离开后自动折叠。
- **FR-006**: 点击目录条目必须实现锚点定位（Anchor Positioning）与平滑滚动（Smooth Scroll），精确跳转并聚焦到对应标题节点。
- **FR-007**: 目录UI视觉设计必须遵循已建立的极简现代化 CSS 设计系统规范，保持调性统一。

### Key Entities

- **TOC Item (目录条目)**: 包含标题 ID/Pos、标题文本、标题层级（H1/H2/H3）、DOM/ProseMirror 节点的导航实体。
- **TOC Component (目录浮层组件)**: 包含左侧固定 Icon 按钮与 Hover 展开面板的交互性 UI 视图组件。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 标题修改后，目录树更新延迟小于 100 毫秒。
- **SC-002**: 点击目录导航条目后，页面平滑定位与锚点跳转至对应标题节点的准确率 100%。
- **SC-003**: 页面上下滚动时，目录组件置顶可见性 100%，无层级遮挡或随屏移出视口问题。

## Assumptions

- 标题层级为 H1 (Heading Level 1)、H2 (Heading Level 2)、H3 (Heading Level 3)。
- 目录导航不需要处理 H4 及以下层级。
