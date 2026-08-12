# 实施任务清单：个人知识库文档编辑器前端组件

**分支**: `001-doc-editor-component` | **规范文件**: [spec.md](./spec.md) | **实施计划**: [plan.md](./plan.md)

---

## Phase 1: 项目初始化与环境依赖 (Setup)

**目的**: 准备前端工程依赖、底层扩展与公共类型定义

- [x] T001 检查并安装前端 Tiptap 与 Excalidraw 依赖包 [frontend/package.json](frontend/package.json)
- [x] T002 [P] 创建并配置核心 AST 数据结构与类型定义 [frontend/src/components/DocEditor/types.ts](frontend/src/components/DocEditor/types.ts)
- [x] T003 [P] 定义预设 8+ 极简高颜值配色主题与 CSS Variables 样式变量 [frontend/src/components/DocEditor/utils/defaultTheme.ts](frontend/src/components/DocEditor/utils/defaultTheme.ts)

---

## Phase 2: 编辑器核心容器与基础设施 (Foundational)

**目的**: 搭建 Tiptap 基础引擎架构与 48px~64px 容器留白 UI 系统

- [x] T004 实现编辑器整体容器 CSS 布局，支持居中 Max-Width 与 48px~64px 左右 padding 留白区 [frontend/src/components/DocEditor/DocEditor.module.css](frontend/src/components/DocEditor/DocEditor.module.css)
- [x] T005 实现 DocEditor 主组件受控/非受控框架与 Tiptap useEditor 初始化 [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx)
- [x] T006 [P] 实现字号控制 Mark 扩展 [frontend/src/components/DocEditor/extensions/FontSizeMark.ts](frontend/src/components/DocEditor/extensions/FontSizeMark.ts)

---

## Phase 3: 用户故事 1 - 基础文档与块级内容编辑与拖拽重排 (Priority: P1) 🎯 MVP

**目标**: 提供基础块输入、表格编辑、气泡菜单控制、斜杠菜单唤起以及基于左侧留白区把手与指示线的块级拖拽重排能力

**独立测试方法**: 打开编辑器组件，输入文字并插入标题、列表与表格；选中一段文本触发悬浮气泡工具栏切换字号（小/正常/大/超大）、加粗、样式及段落对齐方式（左/中/右）；鼠标悬浮在左侧 48px~64px 留白区触发把手，按住拖拽重排块顺序，校验蓝色放置指示线及节点重排精准无损。

### 接口测试 (Tests)

- [x] T007 [P] [US1] 编写 BubbleMenu 选区样式与对齐逻辑单元测试 [frontend/src/tests/BubbleToolbar.test.tsx](frontend/src/tests/BubbleToolbar.test.tsx)
- [x] T008 [P] [US1] 编写 DragHandle 重排交易处理单元测试 [frontend/src/tests/DragHandlePlugin.test.ts](frontend/src/tests/DragHandlePlugin.test.ts)

### 功能实现 (Implementation)

- [x] T009 [P] [US1] 配置基础块类型（标题 1-3、有序/无序列表、任务清单、引用块、分割线与卡片表格）扩展 [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx)
- [x] T010 [P] [US1] 实现斜杠插入快捷菜单组件 (SlashMenu) [frontend/src/components/DocEditor/components/SlashMenu/index.tsx](frontend/src/components/DocEditor/components/SlashMenu/index.tsx)
- [x] T011 [P] [US1] 实现选中文本悬浮气泡工具栏组件 (BubbleToolbar)，包含字号选择、字形样式、前景色/背景高亮调色盘及靠左/居中/靠右对齐控制 [frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)
- [x] T012 [US1] 实现 ProseMirror 拖拽把手插件 (DragHandlePlugin)，在左侧 48px~64px 留白区展示内置把手并支持自动锁定选区与整块 DOM 虚影 [frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts](frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts)
- [x] T013 [US1] 实现拖拽放置指示线视图组件 (DragHandleView)，展示 3px 蓝色目标吸附指示线并处理拖拽重排事务 [frontend/src/components/DocEditor/components/DragHandle/DragHandleView.tsx](frontend/src/components/DocEditor/components/DragHandle/DragHandleView.tsx)

---

## Phase 4: 用户故事 2 - 进阶内容块编辑（代码块、高亮嵌套容器与 Excalidraw 画图） (Priority: P2)

**目标**: 实现语法高亮代码块、支持内嵌子块与 Icon/主题选盘的 Callout 高亮块容器，以及集成 Excalidraw 嵌入式画图块

**独立测试方法**: 插入代码块验证多语言高亮与复制；插入高亮块，更换图标与 8+ 预设极简主题色，在内部按 `/` 插入子块；拖拽块入/出 Callout 容器；插入画图块，唤起 Excalidraw 界面绘制图表并保存预览。

### 接口测试 (Tests)

- [x] T014 [P] [US2] 编写 Callout 容器嵌套节点与主题属性单元测试 [frontend/src/tests/CalloutExtension.test.ts](frontend/src/tests/CalloutExtension.test.ts)

### 功能实现 (Implementation)

- [x] T015 [P] [US2] 实现代码块 (Code Block) 扩展，集成语法高亮、换行开关与一键复制功能 [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx)
- [x] T016 [US2] 实现 Callout 嵌套容器 Tiptap 扩展节点 (CalloutExtension) [frontend/src/components/DocEditor/extensions/CalloutExtension.ts](frontend/src/components/DocEditor/extensions/CalloutExtension.ts)
- [x] T017 [US2] 实现 Callout NodeView 组件，支持框内 `/` 唤起插入子块，并提供 Icon/Emoji 面板与 8+ 主题调色盘 [frontend/src/components/DocEditor/components/Callout/CalloutView.tsx](frontend/src/components/DocEditor/components/Callout/CalloutView.tsx)
- [x] T018 [US2] 实现 Excalidraw 扩展节点 (ExcalidrawExtension) 与 React Custom NodeView [frontend/src/components/DocEditor/extensions/ExcalidrawExtension.ts](frontend/src/components/DocEditor/extensions/ExcalidrawExtension.ts)
- [x] T019 [US2] 实现 Excalidraw 画布 View 视图与全屏/浮层编辑弹窗 [frontend/src/components/DocEditor/components/Excalidraw/ExcalidrawView.tsx](frontend/src/components/DocEditor/components/Excalidraw/ExcalidrawView.tsx)
- [x] T020 [US2] 扩展 DragHandlePlugin 逻辑，支持块跨容器（拖入/拖出 Callout 高亮块）拖拽重排 [frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts](frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts)

---

## Phase 5: 用户故事 3 - 文档导入导出与持久化 (Priority: P3)

**目标**: 提供 Block AST (JSON) 与 Markdown 文本的相互转换 API，实现带 Excalidraw 数据及 Callout 属性的扩展 Markdown 无损导出

**独立测试方法**: 调用 `getJSON` / `getMarkdown` 导出包含各种块、选区样式及 Excalidraw 画图的复杂文档，重新注入编辑器校验精准还原。

### 接口测试 (Tests)

- [x] T021 [P] [US3] 编写 AST 与 Markdown 双向转换序列化器单元测试 [frontend/src/tests/serializer.test.ts](frontend/src/tests/serializer.test.ts)

### 功能实现 (Implementation)

- [x] T022 [US3] 实现 AST <-> Markdown 双向转换序列化工具 (serializer) [frontend/src/components/DocEditor/utils/serializer.ts](frontend/src/components/DocEditor/utils/serializer.ts)
- [x] T023 [US3] 实现 DocEditor Ref 命令式 API (`getJSON`, `getMarkdown`, `setContent`, `clear`, `focus`) [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx)

---

## Phase 6: 优化与综合质量验证 (Polish)

**目的**: 完善整体样式微调、性能优化及全流程集成验证

- [x] T024 [P] 优化整体编辑器极简卡片与暗隐配色样式，确保与飞书云文档视觉体验一致 [frontend/src/components/DocEditor/DocEditor.module.css](frontend/src/components/DocEditor/DocEditor.module.css)
- [x] T025 执行 quickstart 完整验证流并运行前端全套自动化测试套件 [specs/001-doc-editor-component/quickstart.md](specs/001-doc-editor-component/quickstart.md)
