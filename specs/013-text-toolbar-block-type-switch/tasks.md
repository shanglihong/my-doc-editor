# Implementation Tasks: 文案选择工具栏文本块类型切换 (Text Toolbar Block Type Switch)

**Feature Directory**: `specs/013-text-toolbar-block-type-switch`

**Spec Link**: [spec.md](spec.md) | **Plan Link**: [plan.md](plan.md)

---

## Phase 1: Setup (共享基础与基础设施)

**Purpose**: 确认功能构建目标与文件映射基础

- [X] T001 确认项目组件目录结构与代码映射: frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx 与 frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx

---

## Phase 2: Foundational (阻塞性基础设施)

**Purpose**: 核心依赖与共享数据菜单项支撑 (必须在实现用户故事前完成)

- [X] T002 在 BlockTypeMenu 中新增待办列表 (Todo Block) 转换选项配置: frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx

---

## Phase 3: User Story 1 - 在选中文本浮动工具栏中选择并切换文本块类型 (Priority: P1) 🎯 MVP

**Goal**: 在选中文本时弹出的文案选择工具栏中，将字号大小改为文本块类型选择器，点击展开后可切换为正文、标题 1~3、无序列表、有序列表、待办列表等格式。

**Independent Test**: 在文档中选中文本，工具栏原字号位置显示当前文本块类型（如“正文”），展开菜单后点击“待办列表”或“标题 1”，文本块即时转换。

### Implementation for User Story 1

- [X] T003 [P] [US1] 增加和调整文本块类型选择下拉菜单组件样式定义: frontend/src/components/DocEditor/components/BubbleToolbar/BubbleToolbar.module.css
- [X] T004 [US1] 在选中文本工具栏中替换字号大小控件为文本块类型选择器组件，包含类型检测与切换逻辑: frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx

**Checkpoint**: 完成 User Story 1 后，浮动工具栏基本功能可以独立运行并验证。

---

## Phase 4: User Story 2 - 支持混合选中与多段落文本块类型转换 (Priority: P2)

**Goal**: 在跨段落选中多行文本时，支持批量转换为目标文本块类型，并处理混合选中状态的显示。

**Independent Test**: 跨段落选中包含多种样式的多行文本，点击“待办列表”或“无序列表”，选中段落统一转换为目标格式。

### Implementation for User Story 2

- [X] T005 [US2] 增强多段落选区下的文本块类型状态判定逻辑与批量转换处理: frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx

**Checkpoint**: User Story 1 与 User Story 2 均可独立测试与正常协同工作。

---

## Phase 5: User Story 3 - 键盘导航与快捷交互 (Priority: P3)

**Goal**: 提供键盘 Escape 收起下拉菜单以及按键交互支持。

**Independent Test**: 展开下拉菜单后按下 Esc 键，菜单平滑收起且文本块类型不被更改。

### Implementation for User Story 3

- [X] T006 [US3] 添加下拉菜单展开状态下的键盘 Esc 收起及按键监听: frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx

---

## Phase 6: Polish & Cross-Cutting Concerns (优化与自动化测试)

**Purpose**: 代码质量保证、文档补充与测试校验

- [X] T007 [P] 为选中文本工具栏的文本块类型切换功能编写单元测试: frontend/src/components/DocEditor/__tests__/BubbleToolbarBlockType.test.tsx
- [X] T008 执行 quickstart.md 快速验证流程，校验功能完成度: specs/013-text-toolbar-block-type-switch/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即开始
- **Foundational (Phase 2)**: 依赖 Setup，阻塞所有 User Story 实现
- **User Story 1 (Phase 3 - P1 MVP)**: 依赖 Phase 2 基础完成
- **User Story 2 (Phase 4 - P2)**: 依赖 Phase 2 完成
- **User Story 3 (Phase 5 - P3)**: 依赖 Phase 3 完成
- **Polish (Phase 6)**: 依赖各 User Story 完成

### Implementation Strategy

1. **MVP 先行**: 完成 Phase 1 -> Phase 2 -> Phase 3，优先交付选中文本浮动工具栏转换为正文/标题/列表/待办列表的基本功能。
2. **渐进迭代**: 完成 Phase 4 多段选区批量转换 -> Phase 5 键盘支持 -> Phase 6 测试校验。
