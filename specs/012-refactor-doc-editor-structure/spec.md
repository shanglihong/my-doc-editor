# Feature Specification: DocEditor 代码结构与样式重构

**Feature Branch**: `012-refactor-doc-editor-structure`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "调整代码位置，不要改变原有的功能效果 1. DocEditor.module.css 拆解大文件，组件相关的css放到对应的组件目录下 2. extensions/ImageBlock 作为单独的子组件，是不是应该放到 components/ 下，可以分析下 3. 检查其他的代码，进行结构性重构，保证更好的阅读性和可维护"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 组件独立样式拆分与隔离 (Priority: P1)

作为富文本编辑器的维护者，希望将统一的全局大样式文件按组件拆分为模块化样式文件，并存放在各组件目录下，从而在维护具体 UI 组件时能够更聚焦、避免样式冲突与全局臃肿。

**Why this priority**: 目前 DocEditor.module.css 承载了所有组件的全局与局部样式，代码体积过大且职责混杂，拆解 CSS 是提升可读性与模块化程度的最核心诉求。

**Independent Test**: 在拆分样式后，项目重新编译并通过组件渲染测试，编辑器各项 Block（如表格、呼出块、DrawIO、图片块、浮动菜单等）的外观与交互样式与重构前保持 100% 一致。

**Acceptance Scenarios**:

1. **Given** 存在单一巨型 CSS 文件 frontend/src/components/DocEditor/DocEditor.module.css，**When** 完成样式按组件按功能拆分并重构引入路径，**Then** 原有的编辑器功能界面样式没有任何视觉与排版上的偏差。
2. **Given** 各个独立组件（如 Callout, DrawIO, ImageBlock, BubbleToolbar 等），**When** 查看其组件目录结构，**Then** 可以直观看到该组件专有的 CSS Module 文件与 TSX 组件文件同级存放。

---

### User Story 2 - 规范 UI 组件与 Tiptap 扩展目录结构 (Priority: P2)

作为富文本编辑器的开发者，希望调整 extensions/ImageBlock 目录职责，将 React UI 交互组件规范迁移至 components/ 目录下，Tiptap 扩展逻辑保留在 extensions/ 中，建立全项目统一的“UI 视图归 components/，插件扩展归 extensions/”规范。

**Why this priority**: 统一架构目录规范可以消除后续开发中的定位困惑，使代码结构具备一致性。

**Independent Test**: 图片块的图片插入、尺寸调整、对齐方式设置等交互在重构后均能正常工作，代码目录结构清晰划分为 UI 组件与扩展定义。

**Acceptance Scenarios**:

1. **Given** extensions/ImageBlock 目录下混杂了 React 组件与 Extension 定义，**When** 进行结构重构，**Then** React UI 组件迁移至 components/ImageBlock 目录下，extensions 目录下仅保留或引用 Tiptap Extension 的配置声明。
2. **Given** 编辑器中使用 ImageBlock 的渲染逻辑，**When** 用户在编辑器中操作图片块，**Then** 图片拖拽缩放、对齐控制和右键/浮动菜单保持原有功能正常运转。

---

### User Story 3 - 代码可读性与模块解耦重构 (Priority: P3)

作为代码审查人员，希望对 DocEditor 目录下的类型定义、长文件及重用工具进行结构清理，移除冗余导出与不一致的逻辑，提高整体阅读性与可维护性。

**Why this priority**: 在保证功能不发生改变的前提下，优化核心文件逻辑与模块组织，降低未来开发新特性的认知负担。

**Independent Test**: 运行类型检查与自动化单元测试，所有测试用例保持通过，无 TypeScript 编译错误。

**Acceptance Scenarios**:

1. **Given** 重构后的 DocEditor 源码，**When** 执行类型检查与构建过程，**Then** 构建过程无编译报错或未解决的模块导入路径错误。
2. **Given** 开发者浏览 DocEditor 源码，**When** 从 index.tsx 查看编辑器整体结构，**Then** 能够通过清晰的子组件与自包含样式快速理解各模块协作逻辑。

---

### Edge Cases

- 拆分 CSS Module 后，依赖标准类名覆盖的第三方 DOM 样式（如 Tiptap 编辑区 .ProseMirror 内置类名）是否丢失：需保证全局或层级限定样式正确导入并应用于编辑容器。
- 相对路径引用变动：当将 extensions/ImageBlock/ 视图代码移至 components/ImageBlock/ 时，内部相对引用的 utils, services, types 路径需要同步更新，不能发生路径断链。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 拆解 frontend/src/components/DocEditor/DocEditor.module.css，将各组件专有样式放置到 corresponding 目录下（如 components/Callout/Callout.module.css），主 CSS 文件仅保留基础全局规则与编辑器根容器样式。
- **FR-002**: 重新调整 frontend/src/components/DocEditor/extensions/ImageBlock 的目录结构，将其中的 React 视图组件（如 ImageBlockView, ImageBlockWidthHandler 等）迁移至 components/ImageBlock/ 目录，将 Tiptap Extension 声明文件规范保留在 extensions 领域。
- **FR-003**: 保证所有重构变动均为纯结构性重构，绝对不改变原有编辑器的任何功能表现、视觉样式或 API 接口。
- **FR-004**: 检查并整理 components 目录与 extensions 目录中的引用关系，确保模块依赖关系为单向且清晰。
- **FR-005**: 修复由于文件位置变动引起的导入路径调整，确保类型定义与 TypeScript 编译没有任何报错。

### Key Entities

- **DocEditor Core Component**: 富文本编辑器主入口组件，整合所有 Tiptap 扩展、工具栏及渲染视图。
- **Block Components**: 独立块级 UI 视图组件（包括 Callout, DrawIO, ImageBlock, CodeBlock 等），采用各自独立的 React 组件结构和 CSS Module 进行沉淀。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 重构完成后，frontend/src/components/DocEditor/DocEditor.module.css 的行数/体积大幅减少 60% 以上，职责仅限于编辑区全局基类。
- **SC-002**: 代码结构符合统一规范，components/ 包含所有 100% React UI 视图组件，extensions/ 仅包含 Tiptap 扩展配置文件。
- **SC-003**: 现存所有单元测试及功能回归测试 100% 通过，没有任何功能退化或样式走样。

## Assumptions

- 现有的 CSS 样式规则不依赖特定的全局选择器权重大乱序，拆分样式为模块化 CSS 能够被正确组合。
- 此次重构仅限于 frontend/src/components/DocEditor 及其子目录，不影响外部对 <DocEditor /> 组件的调用接口。
