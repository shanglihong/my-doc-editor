# Feature Specification: Standalone DocEditor Component Export & Extensibility

**Feature Branch**: `023-export-doc-editor`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "我期望将doc editor作为一个标准组件进行导出，需要进行一些功能改造，1.删除无关代码，2.将夜间模式按钮去掉，将夜间模式切换作为一个可以使用代码对接的功能，3.标准化目录，4.提供一些编辑器常见的对接口子"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clean Standalone Component Export (Priority: P1)

As a developer integrating `DocEditor`, I want to import it as a clean, standardized component package with pure directory structure and no dead/irrelevant code, so that I can maintain and consume it easily without unused dependencies or side-effects.

**Why this priority**: Core foundation for turning the editor into a reusable, standard production component.

**Independent Test**: Import `DocEditor` from the primary entry point into a separate host component/demo page, verifying zero compilation errors, zero circular dependency warnings, and zero broken references to non-existent code.

**Acceptance Scenarios**:

1. **Given** the component source tree, **When** examining the directory structure and files, **Then** all unused legacy scripts, duplicate style files, and irrelevant mock services are cleaned up, adhering to standard component library directory layouts.
2. **Given** a host application importing `DocEditor`, **When** importing through the index module, **Then** all essential component exports and TypeScript type declarations are accessible directly from the clean top-level export.

---

### User Story 2 - Programmatic Theme Control (Priority: P1)

As a component consumer, I want to control the editor's visual mode (light/dark theme) programmatically via component properties instead of having an internal UI toggle button, so that the editor seamlessly aligns with host application themes.

**Why this priority**: Removes static UI controls from internal toolbars and allows external host applications to trigger dark mode changes dynamically.

**Independent Test**: Render the editor, inspect the toolbar to ensure no theme toggle button exists, then change `theme="dark"` (or `isDark={true}`) programmatically and verify the editor adapts visually.

**Acceptance Scenarios**:

1. **Given** the `DocEditor` toolbar and floating menus, **When** rendered, **Then** no dark mode toggle button or internal theme switcher button is present in the UI.
2. **Given** host application state changes, **When** passing light/dark theme properties to `DocEditor`, **Then** the component updates its visual styling instantaneously.

---

### User Story 3 - Comprehensive Integration Hooks & Callbacks (Priority: P1)

As an external developer, I want `DocEditor` to expose common editor hooks, event callbacks, and custom handlers (such as focus/blur, selection changes, media upload handlers, and imperative command references), so that I can easily integrate business logic around the editor.

**Why this priority**: Standard editors need rich programmatic interfaces for external business logic integration.

**Independent Test**: Bind callback functions for editor events (focus, blur, content change, selection change, media upload) and trigger actions in the editor to verify all hooks fire with expected payloads.

**Acceptance Scenarios**:

1. **Given** host event listeners attached to `DocEditor`, **When** user focuses, blurs, or alters selection within the editor, **Then** `onFocus`, `onBlur`, and `onSelectionChange` callbacks fire with accurate editor state payloads.
2. **Given** media upload requirements (e.g. image paste or upload), **When** an image is added, **Then** `DocEditor` delegates handling to an optional custom `onUploadImage` (or `mediaHandler`) hook provided by the host application.
3. **Given** imperative control needs, **When** accessing `DocEditorRef`, **Then** host applications can invoke methods to clear content, focus, blur, or retrieve active document statistics.

---

### Edge Cases

- What happens when no theme prop is provided by the host? (System MUST default gracefully to standard light theme).
- What happens when custom upload hook (`onUploadImage`) is not provided? (System MUST fall back to standard inline/local data URI preview or default handling without throwing runtime exceptions).
- What happens when invalid or unsupported props are passed? (Component MUST validate props and handle graceful fallbacks).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST export `DocEditor` and all associated public types from a standardized top-level index file.
- **FR-002**: System MUST remove unreferenced legacy files, redundant styles, and non-component demo dependencies from `DocEditor`.
- **FR-003**: System MUST standardize the `DocEditor` internal directory structure (e.g., separating components, hooks, extensions, types, and styles cleanly).
- **FR-004**: System MUST remove the internal dark mode toggle button from the editor toolbar and floating UI panels.
- **FR-005**: System MUST support programmatic theme control via props (e.g., `theme?: 'light' | 'dark'` or `isDark?: boolean`).
- **FR-006**: System MUST expose standard lifecycle and user event callbacks, including `onFocus`, `onBlur`, `onSelectionChange`, `onChange`, and `onTitleChange`.
- **FR-007**: System MUST provide customizable integration hooks for media handling (e.g., `onUploadImage` returning image target URL).
- **FR-008**: System MUST provide extended imperative ref methods via `DocEditorRef` for external programmatic interaction.

### Key Entities *(include if feature involves data)*

- **DocEditorProps**: Primary configuration interface defining editor initial value, read-only state, theme props, lifecycle callbacks, and custom handler hooks.
- **DocEditorRef**: Imperative reference handle providing external methods to focus, blur, get/set content, clear, and access state.
- **EditorEventPayload**: Data structures emitted during event callbacks (e.g., selection info, node attributes, cursor state).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of internal dark mode toggle buttons removed from editor toolbars and menus.
- **SC-002**: Component directory structure conforms strictly to standard component library conventions without orphan or dead files.
- **SC-003**: All standard integration hooks (`onFocus`, `onBlur`, `onSelectionChange`, `onUploadImage`, `theme`) respond as expected with 0 unhandled exceptions.
- **SC-004**: Bundle size/file count reduced by eliminating dead code and redundant files.

## Assumptions

- Host applications manage external state such as theme preference and server storage for uploaded media.
- Backwards compatibility for basic `value`/`onChange` props remains intact.
