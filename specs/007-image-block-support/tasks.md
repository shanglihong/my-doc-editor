# Tasks: 图片 Block 支持与文件存储

**Input**: Design documents from `specs/007-image-block-support/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [image-api.md](contracts/image-api.md), [quickstart.md](quickstart.md)

**Organization**: 任务按 User Story 分组，支持独立开发与独立测试。

## Format: `- [x] [ID] [P?] [Story] Description`

- **[P]**: 可并行执行的任务（不同文件，无未完成依赖）
- **[Story]**: 属于哪个用户故事（如 US1, US2, US3）
- 描述中包含确切的文件相对路径

## Phase 1: Setup (共享基础框架)

**目的**: 初始化图片 Block 相关的数据类型与服务基础结构

- [x] T001 [P] 创建图片 Block 类型与接口定义在 frontend/src/components/DocEditor/extensions/ImageBlock/types.ts
- [x] T002 [P] 创建统一图片上传与转存服务骨架在 frontend/src/components/DocEditor/services/imageUploadService.ts

---

## Phase 2: Foundational (核心阻塞前提)

**目的**: 核心图片校验与上传服务逻辑，阻塞所有 User Story 的实现

- [x] T003 [P] 实现图片格式与文件大小限制校验逻辑在 frontend/src/components/DocEditor/extensions/ImageBlock/utils.ts
- [x] T004 实现图片上传服务 (POST /api/upload/image) 与外链转存服务 (POST /api/upload/fetch-url) 调用在 frontend/src/components/DocEditor/services/imageUploadService.ts

---

## Phase 3: User Story 1 - 插入与展现图片 Block (Priority: P1) 🎯 MVP

**目标**: 支持从剪贴板粘贴、拖拽文件、本地选择导入以及网络 URL 插入图片 Block，展示乐观 UI 本地 Blob 预览并自动持久化存储。

**独立测试验证**: 用户通过粘贴、拖拽、选择本地文件或输入网络 URL 插入图片，验证图片能瞬间在前端本地预览并在存入存储目录后持久化正常展示。

### Implementation for User Story 1

- [x] T005 [P] [US1] 定义 ImageBlock Extension Tiptap 节点在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockExtension.ts
- [x] T006 [P] [US1] 编写 ImageBlockView 基础 NodeView 渲染组件在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx
- [x] T007 [US1] 实现剪贴板粘贴 (Paste) 与文件拖拽 (Drag & Drop) 事件拦截在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockExtension.ts
- [x] T008 [US1] 编写图片插入弹窗组件 (支持本地导入与网络 URL 直嵌/转存选项) 在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageInsertModal.tsx
- [x] T009 [US1] 将 ImageBlockExtension 扩展注册并接入文档编辑器主入口在 frontend/src/components/DocEditor/DocEditor.tsx

**Checkpoint**: 完成 Phase 3 后，User Story 1 具备完整的 MVP 插入与展示持久化功能

---

## Phase 4: User Story 2 - 图片 Block 气泡菜单与外观交互控制 (Priority: P2)

**目标**: 选中图片 Block 调出气泡菜单栏 (Bubble Menu)，支持编辑图片描述 (Caption) 以及配置左/中/右对齐。

**独立测试验证**: 在已插入的图片 Block 上唤起气泡菜单，修改图片描述文本并切换左对齐、居中对齐、右对齐，验证渲染与排版实时更新。

### Implementation for User Story 2

- [x] T010 [P] [US2] 编写 ImageBubbleMenu 气泡菜单组件在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx
- [x] T011 [US2] 编写 ImageBubbleMenu 气泡菜单的样式文件在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.module.css
- [x] T012 [US2] 在 ImageBlockView 中接入左对齐、居中对齐、右对齐排版样式控制在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx
- [x] T013 [US2] 在 ImageBubbleMenu 中实现图片描述 (Caption) 输入框与绑定在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx
- [x] T014 [US2] 在 ImageBubbleMenu 中加入外链“转存至本地”与“删除 Block”控制按钮在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx

**Checkpoint**: 完成 Phase 4 后，图片描述与排版对齐功能完全就绪且独立可测

---

## Phase 5: User Story 3 - 图片上传状态与交互反馈 (Priority: P3)

**目标**: 提供加载等待 Icon 动画指示器与上传失败后的重试机制。

**独立测试验证**: 模拟慢速上传与上传失败场景，验证加载 Icon、失败提示框与重新上传按钮交互。

### Implementation for User Story 3

- [x] T015 [P] [US3] 在 ImageBlockView 中加入上传/加载中 (Uploading) 等待 Icon 与遮罩指示器在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx
- [x] T016 [US3] 实现上传失败 (Error) 状态 Icon 提示及“重新上传”重试触发逻辑在 frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx

**Checkpoint**: 所有 User Story 功能均开发完成并达到高可用交互体验

---

## Phase 6: Polish & Cross-Cutting Concerns

**目的**: 单元测试覆盖、整体验证与细节优化

- [x] T017 [P] 编写 ImageBlock 节点与上传服务的单元测试在 frontend/src/components/DocEditor/extensions/ImageBlock/__tests__/ImageBlock.test.tsx
- [x] T018 运行 quickstart.md 验证指南中的 5 个场景完成端到端校验

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即启动。
- **Foundational (Phase 2)**: 依赖 Setup 完成，阻塞所有 User Story。
- **User Stories (Phase 3+)**: 均依赖 Foundational Phase 完成。
  - User Story 1 (P1) 优先完成作为 MVP。
  - User Story 2 (P2) 与 User Story 3 (P3) 可按优先级顺序或并行推进。
- **Polish (Phase 6)**: 依赖所有 User Story 完成。

### Parallel Opportunities

- T001 与 T002 在 Phase 1 中可并行。
- T003 在 Phase 2 中可并行。
- T005 与 T006 在 Phase 3 中可并行。
- T010 与 T015 可在各自 Phase 中并行。

---

## Implementation Strategy

### MVP 交付路径 (User Story 1 Only)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational (核心校验与上传服务)
3. 完成 Phase 3: User Story 1 (实现图片粘贴、拖拽、本地导入与网络 URL 插入存储)
4. **验证 MVP**: 按照 quickstart.md 场景 1、2、3 进行测试验收。

### 增量迭代路径

1. 完成 MVP -> 具备基础插入存储与展示能力。
2. 接入 Phase 4 (User Story 2) -> 获得气泡菜单栏、图片描述与左中右对齐配置能力。
3. 接入 Phase 5 (User Story 3) -> 获得完善的加载 Icon 与失败重试交互机制。
