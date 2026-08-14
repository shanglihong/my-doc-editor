# 任务列表: DocEditor 内置 H1 文档标题

**特性分支**: `015-doc-title-h1`  
**关联规格**: [spec.md](spec.md) | [plan.md](plan.md)

---

## 阶段 1: 准备工作 (Setup)

**目标**: 初始化必要的结构与测试基础

- [x] T001 [P] 创建测试策略与测试用例骨架文件 `frontend/src/components/DocEditor/__tests__/DocEditorTitle.test.tsx`

---

## 阶段 2: 基础设施 (Foundational)

**目标**: 创建核心 Title 扩展节点与 Root Schema 定义

- [x] T002 [P] 创建自定义 DocumentTitle 根节点扩展 `frontend/src/components/DocEditor/extensions/DocumentTitleExtension.ts`
- [x] T003 [P] 创建自定义 Title H1 节点扩展 `frontend/src/components/DocEditor/extensions/TitleExtension.ts`

**检查点**: 基础 Title 节点扩展代码就绪

---

## 阶段 3: 用户故事 1 - 查看与编辑内置 H1 文档标题 (Priority: P1) 🎯 MVP

**目标**: 在 DocEditor 中内置展示 H1 标题块，支持文本输入与专属占位符

**独立测试**: 打开 DocEditor 编辑器，确认首行为 H1 格式标题块且在空内容时显示“请输入文档标题”

### 用户故事 1 测试

- [x] T004 [P] [US1] 编写标题初始化与渲染占位符单元测试在 `frontend/src/components/DocEditor/__tests__/DocEditorTitle.test.tsx`

### 用户故事 1 实现

- [x] T005 [US1] 在 `frontend/src/components/DocEditor/extensions/TitleExtension.ts` 中完成 HTML 渲染规则与 `doc-title` 样式节点映射
- [x] T006 [US1] 在 `frontend/src/components/DocEditor/index.tsx` 中注册 `DocumentTitleExtension` 与 `TitleExtension`
- [x] T007 [US1] 在 `frontend/src/components/DocEditor/index.tsx` 中配置 `@tiptap/extension-placeholder` 针对 `title` 节点的专属占位符展示逻辑
- [x] T008 [US1] 补充标题样式规则在 `frontend/src/components/DocEditor/DocEditor.module.css`

**检查点**: User Story 1 具备独立可测试功能（MVP 达成）

---

## 阶段 4: 用户故事 2 - 标题块的固定约束与按键/菜单交互 (Priority: P2)

**目标**: 防止标题被误删，实现标题内按键跳跃以及屏蔽针对标题的菜单/拖拽操作

**独立测试**: 在标题区尝试删除、回车跳跃、全选清空，验证标题均无法被删除且可流畅跳到正文

### 用户故事 2 测试

- [x] T009 [P] [US2] 编写退格防删除与 Enter 按键跳转单元测试在 `frontend/src/components/DocEditor/__tests__/DocEditorTitle.test.tsx`

### 用户故事 2 实现

- [x] T010 [US2] 在 `frontend/src/components/DocEditor/extensions/TitleExtension.ts` 中使用 `addKeyboardShortcuts` 拦截 `Enter` 与 `Backspace` 交互
- [x] T011 [US2] 在 `frontend/src/components/DocEditor/extensions/DragHandlePlugin.ts` 中判定若选中节点为 `title` 时自动隐藏拖拽手柄
- [x] T012 [US2] 在 `frontend/src/components/DocEditor/components/BlockTypeMenu/index.tsx` 中屏蔽针对 `title` 节点的块类型转换选项

**检查点**: 标题节点成功施加防删除与菜单屏蔽防护

---

## 阶段 5: 用户故事 3 - 标题作为文档数据的一部分进行持久化 (Priority: P3)

**目标**: 确保标题节点能够通过 DocEditor Props / Ref 导出与导入，且与 Markdown 完美转换

**独立测试**: 通过 Ref 获取标题，输入 Markdown，确认第一行 `# 标题` 被正确解析装载

### 用户故事 3 测试

- [x] T013 [P] [US3] 编写 DocEditor Ref 方法 (getTitle/setTitle) 以及 Markdown 转换测试在 `frontend/src/components/DocEditor/__tests__/DocEditorTitle.test.tsx`

### 用户故事 3 实现

- [x] T014 [P] [US3] 更新类型定义在 `frontend/src/components/DocEditor/types.ts`，增加 `onTitleChange` 与 `titlePlaceholder`
- [x] T015 [US3] 在 `frontend/src/components/DocEditor/index.tsx` 中实现 `getTitle` 与 `setTitle` Imperative Handle 导出方法
- [x] T016 [US3] 在 `frontend/src/components/DocEditor/index.tsx` 中配置 Markdown 解析与序列化逻辑，确保首行正确转化为 Title 节点

**检查点**: 所有用户故事（US1, US2, US3）实现完毕

---

## 阶段 6: 优化与收尾 (Polish & Cross-Cutting Concerns)

**目标**: 运行完整测试套件，执行快速验证指南

- [x] T017 [P] 运行自动化测试集 `cd frontend && npm run test -- DocEditorTitle`
- [x] T018 依照 `specs/015-doc-title-h1/quickstart.md` 完成全流程验证

---

## 依赖关系与执行顺序

### 阶段依赖关系

- **准备工作 (阶段 1)**: 无依赖，可立即执行。
- **基础设施 (阶段 2)**: 依赖阶段 1，阻塞所有用户故事。
- **用户故事 1 (阶段 3)**: 依赖阶段 2 基础设施，构成 MVP。
- **用户故事 2 (阶段 4)**: 依赖阶段 3，可独立测试。
- **用户故事 3 (阶段 5)**: 依赖阶段 3，可独立测试。
- **收尾与优化 (阶段 6)**: 依赖所有用户故事完成。

### 并行执行机会

- T002, T003 可并行创建
- 测试用例 T004, T009, T013 可与相应模块并行编写
- T014 (types.ts) 与 T011 (DragHandlePlugin) 可并行执行

---

## 实施策略

### MVP 方案 (优先交付 User Story 1)

1. 完成阶段 1、阶段 2
2. 完成阶段 3 (User Story 1)
3. 验证 MVP 成果，交付基础 Title 编辑功能
