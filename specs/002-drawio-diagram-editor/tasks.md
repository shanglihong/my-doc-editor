# Tasks: 画图组件切换为 draw.io

**Feature Branch**: `002-drawio-diagram-editor`
**Input Documents**: [plan.md](plan.md), [spec.md](spec.md), [data-model.md](data-model.md), [drawio-postmessage-contract.md](contracts/drawio-postmessage-contract.md), [quickstart.md](quickstart.md)

---

## Phase 1: Setup (共享基础与资源集成)

**Purpose**: 准备本地静态 draw.io Web 资源并整理依赖项

- [x] T001 [P] 集成静态 draw.io Web 资源至项目目录 `public/drawio/`
- [x] T002 [P] 从 `frontend/package.json` 中移除 `@excalidraw/excalidraw` 依赖项

---

## Phase 2: Foundational (阻塞性基础设施与数据类型)

**Purpose**: 定义 TipTap 画图节点的核心数据模型与 postMessage 通信协议接口

- [x] T003 [P] 在 `frontend/src/components/DocEditor/types.ts` 中补充 `DrawIOBlockAttrs` 及 Modal 交互接口类型
- [x] T004 [P] 编写 draw.io 通信协议处理封装在 `frontend/src/components/DocEditor/components/DrawIO/drawioProtocol.ts`

---

## Phase 3: User Story 1 - 插入与嵌入式编辑 draw.io 图表 (Priority: P1) 🎯 MVP

**Goal**: 用户可以在文档编辑中通过斜杠菜单插入 draw.io 图表，并全屏弹窗进行交互编辑与实时保存。

**Independent Test**: 在文档编辑器中选择斜杠菜单插入“draw.io 图表”，双击或点击编辑在弹窗中修改图形并点击保存，图表预览能够实时更新呈现。

### Implementation for User Story 1

- [x] T005 [P] [US1] 实现嵌入式 draw.io 弹窗对话框组件在 `frontend/src/components/DocEditor/components/DrawIO/DrawIOModal.tsx`
- [x] T006 [P] [US1] 创建 TipTap 自定义节点扩展在 `frontend/src/components/DocEditor/extensions/DrawIOExtension.ts`
- [x] T007 [US1] 实现画图节点 React 视图组件在 `frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx`（包含 SVG 预览与浮动控制栏，依赖 T005、T006）
- [x] T008 [US1] 在斜杠菜单中增加 draw.io 选项并在 `frontend/src/components/DocEditor/components/SlashMenu/SlashMenuPlugin.ts` 中映射指令
- [x] T009 [US1] 在文档编辑器主视图 `frontend/src/components/DocEditor/index.tsx` 中注册 DrawIOExtension 节点扩展并挂载 DrawIOModal

---

## Phase 4: User Story 2 - 图表只读预览与导出 (Priority: P2)

**Goal**: 只读模式或导出场景下仅渲染轻量 SVG 矢量预览图，零 iframe 和编辑器重型脚本开销。

**Independent Test**: 将编辑器切换为只读模式，验证图表仅挂载静态 SVG 标签且无法激活弹窗编辑。

### Implementation for User Story 2

- [x] T010 [P] [US2] 在 `frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx` 中增加只读状态判断与纯 SVG 节点挂载渲染
- [x] T011 [US2] 增加导出 PDF/HTML 场景下的 SVG 安全渲染与尺寸样式适配在 `frontend/src/components/DocEditor/components/DrawIO/DrawIOView.tsx`

---

## Phase 5: User Story 3 - 移除 Excalidraw 原画图组件 (Priority: P3)

**Goal**: 彻底清理原 Excalidraw 代码、路由与多余文件，保持项目干净无残留。

**Independent Test**: 确认源码中不留残留 Excalidraw 代码，执行构建无报错。

### Implementation for User Story 3

- [x] T012 [P] [US3] 删除原 Excalidraw 组件目录及文件在 `frontend/src/components/DocEditor/components/Excalidraw/`
- [x] T013 [P] [US3] 删除原 Excalidraw TipTap 节点扩展文件在 `frontend/src/components/DocEditor/extensions/ExcalidrawExtension.ts`
- [x] T014 [US3] 从 `frontend/src/components/DocEditor/components/SlashMenu/SlashMenuPlugin.ts` 中彻底清空 Excalidraw 选项

---

## Phase 6: Polish & Cross-Cutting Concerns (优化与测试验证)

**Purpose**: 编写自动化测试并进行全流程构建验证

- [x] T015 [P] 编写 TipTap DrawIOExtension 节点序列化与数据解析测试在 `frontend/src/components/DocEditor/extensions/__tests__/DrawIOExtension.test.ts`
- [x] T016 执行 quickstart 验证流程并进行项目全量类型检查与构建校验

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖，可立即执行
- **Foundational (Phase 2)**: 依赖 Setup 完成，阻塞所有 User Story 阶段
- **User Stories (Phase 3+)**: 均依赖 Foundational 阶段完成
  - User Story 1 (P1): 优先完成作为 MVP 交付
  - User Story 2 (P2) & User Story 3 (P3): 可在 US1 基础上方推进或并行处理
- **Polish (Phase 6)**: 依赖主代码功能开发完成

### Parallel Opportunities

- T001, T002 可并行处理
- T003, T004 可并行处理
- T005, T006 可并行处理
- T012, T013 可并行处理

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)

1. 完成 Phase 1 & Phase 2 基础准备
2. 完成 Phase 3 (User Story 1)，实现插入 draw.io 与全屏弹窗编辑渲染
3. **验证 MVP**：支持插入、绘制、保存与基本呈现

### Full Feature Scope

依次完成 Phase 4 (只读预览)、Phase 5 (清理 Excalidraw) 与 Phase 6 (测试与构建校验)，达成完整的画图组件替换。
