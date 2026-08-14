# Feature Specification: Split DocEditor Main Component

**Feature Branch**: `019-split-doc-editor`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: "/speckit-specify frontend/src/components/DocEditor/index.tsx 这个文件太大了，需要进行拆解"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Editor Functionality Preservation After Component Splitting (Priority: P1)

As a content creator or editor user, I want the rich text document editor to retain 100% of its existing capabilities (formatting, slash commands, drag-and-drop handles, image uploads, table editing, callout blocks, DrawIO diagramming, markdown export/import) after the monolithic component code is modularized, so that my writing experience remains seamless and bug-free.

**Why this priority**: Refactoring must be non-destructive. Preserving existing feature behavior and visual stability is the absolute highest priority.

**Independent Test**: Can be fully tested by opening the document editor, creating mixed content (headings, formatted text, code blocks, images, tables, callouts, DrawIO diagrams), using drag handles and floating block menus, and verifying that all actions function identically to the pre-refactored editor.

**Acceptance Scenarios**:

1. **Given** the refactored DocEditor component, **When** a user types text, applies formatting (bold, italic, underline, highlight, font size), or uses slash commands, **Then** all editor features respond correctly without runtime errors.
2. **Given** the refactored DocEditor component, **When** a user interacts with floating toolbars, block type menus, image upload modal, or DrawIO modal, **Then** all modals open, update content, and close accurately without state leakage.
3. **Given** external components using `DocEditorRef` (`getMarkdown`, `setMarkdown`, `focus`, `isEmpty`, `getEditor`), **When** calling imperative handle methods, **Then** the refactored component returns exact expected outputs and behavior.

---

### User Story 2 - Modular Component Architecture & Maintainability (Priority: P2)

As a frontend developer, I want `frontend/src/components/DocEditor/index.tsx` to be split into logical sub-modules (hooks, state managers, extension factories, UI overlay containers) such that the main component file is concise (under 200 lines), so that future feature development and bug fixes are easy to navigate and maintain.

**Why this priority**: High code size in `index.tsx` (850+ lines) creates cognitive load, tight coupling, and high collision risk during team collaboration.

**Independent Test**: Code analysis of directory structure and file sizes shows `index.tsx` focuses solely on orchestration, while extensions, state hooks, and overlay components reside in dedicated sub-files with single responsibilities.

**Acceptance Scenarios**:

1. **Given** the updated component structure, **When** reviewing `DocEditor/index.tsx`, **Then** the line count is significantly reduced (target under 200 lines) and clearly acts as a clean container.
2. **Given** editor extensions setup, **When** inspecting extensions definition, **Then** it is decoupled into a dedicated helper module or custom hook rather than inline in `index.tsx`.
3. **Given** UI overlays (floating tools, drag handle UI, modals), **When** inspecting component hierarchy, **Then** overlays are modularized into independent component layers.

---

### User Story 3 - Performance & State Isolation (Priority: P3)

As an editor user, I want state updates (such as mouse hover position for drag handles or modal open states) to be isolated, so that typing in the editor does not cause unnecessary re-renders of heavy UI layers.

**Why this priority**: Decoupling state into specific hooks/components prevents unnecessary React re-renders and keeps editor typing smooth.

**Independent Test**: Profiling editor render cycles shows that typing in the editor canvas does not re-render modal components or unneeded overlay states.

**Acceptance Scenarios**:

1. **Given** active typing in the editor, **When** observing component re-renders, **Then** only the active editor content view updates, while dormant modals and inactive toolbars remain stable.

---

### Edge Cases

- What happens when external callers call `ref.current.getMarkdown()` before TipTap editor initialization completes? (Handle null/undefined checks gracefully).
- How does the system handle state updates when switching between read-only and editable modes dynamically?
- What happens if modal states (Image modal, DrawIO modal) are triggered simultaneously or during an active drag operation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST maintain 100% feature parity for all TipTap extensions (StarterKit, Markdown, CodeBlock, CustomTable, Highlight, FontSize, Underline, TextAlign, Placeholder, Link, TaskList, Callout, DrawIO, ImageBlock, SlashMenu, TitleExtension).
- **FR-002**: System MUST modularize `DocEditor/index.tsx` into single-responsibility sub-modules, including Extension Configuration, State Management Hooks, and UI Overlay Renderers.
- **FR-003**: System MUST preserve all exported interfaces (`DocEditorProps`, `DocEditorRef`, `DocumentNode`, `BlockNode`, `DrawIOModalState`).
- **FR-004**: `DocEditor/index.tsx` file size MUST be reduced to under 200 lines, serving as a high-level orchestrator.
- **FR-005**: All imperative handle methods (`getMarkdown`, `setMarkdown`, `focus`, `isEmpty`, `getEditor`) MUST continue to work as specified in the original API contract.
- **FR-006**: System MUST isolate state management (drag-and-drop state, type menu state, drop indicator state, modal states) into dedicated custom React hooks.

### Key Entities

- **DocEditor Core Component**: Main orchestrator component providing ref forwarding and top-level DOM structure.
- **Editor Extension Factory / Hook**: Encapsulates configuration and initialization of all TipTap extensions and plugins.
- **Editor State Hooks**: Encapsulates state for drag handle position, block type selector menu, image upload modal, and DrawIO diagram modal.
- **DocEditor Overlays Component**: Sub-component container responsible for rendering floating toolbars, bubble menus, drag handles, and modal dialogs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `frontend/src/components/DocEditor/index.tsx` total line count is reduced from 859 lines to under 200 lines.
- **SC-002**: 100% of existing functional tests and visual editor features continue to function without any regressions or console warnings/errors.
- **SC-003**: Zero breaking changes to the external `DocEditor` component prop types and imperative ref methods.

## Assumptions

- No new end-user features or visual style changes are being added in this refactoring phase; the objective is strictly structural decomposition and code quality improvement.
- Existing custom extensions (`extensions/*`) and existing UI components (`components/*`) will be reused or organized without changing their underlying TipTap extensions logic.
