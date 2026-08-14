# Feature Specification: Non-Text Block Toolbar Actions & Unified Floating Styling

**Feature Branch**: `009-non-text-block-toolbar-actions`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "在图片，图标，code等非文本的block中，在工具栏增加菜单项，用于在block上方或者下方插入一个空白的block。1.code需要增加工具类，并且工具栏统一风格，统一互斥效果。2.调整图片block的工具栏风格。3.插入空白的菜单项聚合在一个按钮上，点击后通过下拉方式展开，选择合适icon，并且需要注意不要被页面遮盖。补充要求：1.不要改变code block本身的样式；2.图片，code block统一使用悬浮工具栏的形式；3.严格遵守内嵌工具栏互斥；4.严格遵守全局工具栏互斥；5.当键盘输入时，所有的菜单与工具栏均隐藏。"

## Clarifications

### Session 2026-08-14
- Q: 如何呈现非文本 Block（图片、代码块、DrawIO/图标块）的工具栏与按钮交互？ → A: 统一采用悬浮工具栏（Floating Bubble Toolbar）形式，在 Block 被选中（selected）或悬浮时浮动显示在 Block 上方；保持代码块本身原有样式不变，不使用内嵌在节点 Header 内部的按钮。
- Q: 工具栏与菜单的互斥与键盘避让规则？ → A: 严格遵守：1. 内嵌工具栏内部按钮/下拉框互斥（同一工具栏内展开新菜单自动关闭原菜单）；2. 全局工具栏互斥（全编辑器同一时刻只允许展示一个活动悬浮工具栏/菜单）；3. 当用户产生键盘输入（keydown/typing）时，立即全量隐藏所有的浮动工具栏、气泡菜单与下拉面板。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Insert Blank Block Above or Below via Floating Toolbar (Priority: P1)

As a document editor user, when selecting or interacting with non-text blocks (such as images, code blocks, drawings/icons), I want to see a floating bubble toolbar above the block containing an "Insert Block" menu button, so that I can insert a blank paragraph block directly above or below the current block without altering the native styling of the block content.

**Why this priority**: Inserting content around media and code blocks via a floating toolbar delivers an unobtrusive and intuitive editing experience.

**Independent Test**: Select an image, code block, or diagram block, verify a floating toolbar appears above it, click "Insert Block" dropdown, select "Insert Above" or "Insert Below", and verify a new editable blank block is inserted at the exact relative position.

**Acceptance Scenarios**:

1. **Given** a non-text block (image, code block, diagram/icon) is selected or hovered, **When** its floating toolbar appears, **Then** the toolbar contains a unified "Insert Block" dropdown button.
2. **Given** the insert dropdown menu is open, **When** the user selects "Insert Above", **Then** a new blank text block is created immediately before the current block and focus moves to it.
3. **Given** the insert dropdown menu is open, **When** the user selects "Insert Below", **Then** a new blank text block is created immediately after the current block and focus moves to it.
4. **Given** the user presses any key on the keyboard during editing, **When** typing occurs, **Then** all open floating toolbars and dropdown menus hide instantly.

---

### User Story 2 - Inner and Global Mutual Exclusion for Toolbars (Priority: P2)

As a user, I want strict mutual exclusion both within individual toolbars and globally across all editor toolbars, so that only one menu or popover is visible at any given second.

**Why this priority**: Preventing multiple overlapping popovers maintains clean UX and eliminates visual clutter.

**Independent Test**:
1. Open one popover in a toolbar (e.g. language select or insert block menu), then click another button in the same toolbar -> previous popover closes (inner mutual exclusion).
2. Hover/select an image and a code block sequentially -> previous block's toolbar hides immediately (global mutual exclusion).
3. Type any character on keyboard -> all visible toolbars and popovers close immediately.

**Acceptance Scenarios**:

1. **Given** a dropdown or popover is active in a toolbar, **When** another button in the same toolbar is clicked, **Then** the active dropdown closes immediately.
2. **Given** a floating toolbar is displayed on one block, **When** another block becomes active or hovered, **Then** only the newly active block's toolbar is shown.
3. **Given** any floating toolbar or menu is currently visible, **When** a keyboard `keydown` event occurs, **Then** all toolbars and menus disappear instantly.

---

### Edge Cases

- **Keyboard Input Hiding**: Fast typing or pressing navigation keys (Up/Down/Enter/Escape/Character keys) must hide all floating toolbars without UI flicker.
- **Nested Container Blocks**: Inserting above/below a non-text block nested within a container (e.g. callout box, table cell) must place the new block inside the same parent container level.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All non-text blocks (Image, Code Block, DrawIO/Icon Block) MUST render a floating bubble toolbar (悬浮工具栏) above the block when selected or hovered.
- **FR-002**: Code block internal container and header styles MUST NOT be modified.
- **FR-003**: Each floating toolbar MUST include an aggregated "Insert Block" menu button.
- **FR-004**: Clicking "Insert Block" MUST expand a dropdown menu with "Insert Above" (在上方插入) and "Insert Below" (在下方插入) options.
- **FR-005**: Selecting "Insert Above" or "Insert Below" MUST insert a blank paragraph block at the designated relative position and focus it.
- **FR-006**: Inner toolbar mutual exclusion MUST be enforced (opening any popover inside a toolbar closes all other popovers in that toolbar).
- **FR-007**: Global toolbar mutual exclusion MUST be enforced (at most one floating toolbar or menu active across the entire document).
- **FR-008**: All floating toolbars, bubble menus, and popovers MUST immediately hide upon receiving any keyboard input (`keydown` event).

### Key Entities

- **Floating Block Toolbar**: The bubble toolbar rendered above non-text blocks.
- **Global Toolbar Event Bus**: Event channel for broadcasting `HIDE_ALL_FLOATING_MENUS` on keydown or global state transitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% compliance with inner toolbar mutual exclusion (0 instances of dual active popovers within a single toolbar).
- **SC-002**: 100% compliance with global toolbar mutual exclusion (0 instances of multiple active floating toolbars in document).
- **SC-003**: 100% instant concealment of all toolbars and menus on keyboard `keydown` events.

## Assumptions

- Keyboard events are captured via global keydown listeners and TipTap editor handleDOMEvents keydown handlers.
