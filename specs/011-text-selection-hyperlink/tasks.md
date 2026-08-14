# 任务拆解：文本选中菜单栏超链接处理 (Text Selection Hyperlink)

**Feature Branch**: `011-text-selection-hyperlink` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup (共享基础设置)

**目的**: 引入必要的拓展依赖并配置文件

- [x] T001 在 [frontend/src/components/DocEditor/index.tsx](frontend/src/components/DocEditor/index.tsx) 中导入并注册 `@tiptap/extension-link` 扩展，配置 `autolink: false` 和 `openOnClick: false`。

---

## Phase 2: Foundational (核心底层基础)

**目的**: 核心 URL 处理逻辑与独立校验库

- [x] T002 创建 [frontend/src/components/DocEditor/utils/urlUtils.ts](frontend/src/components/DocEditor/utils/urlUtils.ts) 并实现 `normalizeUrl` 规范化工具函数（自动为缺失协议前缀的输入补全 `https://`）。
- [x] T003 [P] 创建单元测试文件 [frontend/src/components/DocEditor/__tests__/urlUtils.test.ts](frontend/src/components/DocEditor/__tests__/urlUtils.test.ts)，验证 `normalizeUrl` 的基础 URL、无协议域名及特殊路径处理。

---

## Phase 3: User Story 1 - 为选中文本添加超链接 (Priority: P1) 🎯 MVP

**目标**: 选中文本后可通过选区浮动菜单调出输入框并应用超链接

**独立测试标准**: 选中文本点击工具栏超链接图标，在弹出面板中输入 URL 并保存，所选文本正确附带超链接属性。

### 核心实现 tasks

- [x] T004 [P] [US1] 创建超链接输入面板组件 [frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx)，包含输入框、确认保存按钮以及视口自适应布局。
- [x] T005 [US1] 修改 [frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx)，引入 `Link` 图标按钮及 `showLinkPanel` 展开/收起状态。
- [x] T006 [US1] 在 [frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx) 中挂载 `LinkInputPanel`，并在提交时调用 `editor.chain().focus().extendMarkRange('link').setLink({ href }).run()`。

---

## Phase 4: User Story 2 - 编辑与移除现有超链接 (Priority: P2)

**目标**: 选中有超链接的文本时自动回显地址，并支持编辑与取消链接

**独立测试标准**: 点击或选中有链接的文本时工具栏超链接图标呈现激活高亮，可修改现有链接或点击取消链接恢复文本原样。

### 核心实现 tasks

- [x] T007 [P] [US2] 扩展 [frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx)，加入“取消链接”(Unlink) 按钮与新标签页外链预览按钮。
- [x] T008 [US2] 在 [frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx](frontend/src/components/DocEditor/index.tsx) 中增加对已有 `editor.isActive('link')` 状态及 `editor.getAttributes('link').href` 属性的回显读取，并绑定 `unsetLink()` 清除链接逻辑。

---

## Phase 5: User Story 3 - 键盘快捷交互与异常提示 (Priority: P3)

**目标**: 提供快捷键调起超链接面板及键盘高效闭合操作

**独立测试标准**: 使用 `Mod+K` 可直接激活超链接输入框，按下 `Esc` 键可无损退出面板。

### 核心实现 tasks

- [x] T009 [P] [US3] 在 [frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx) 中增加自动 focus/select 逻辑，并捕获 `Enter` 快捷保存与 `Esc` 快捷退出。
- [x] T010 [US3] 在 [frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx](frontend/src/components/DocEditor/components/BubbleToolbar/index.tsx) 中绑定 `Mod+K` 快捷键，响应键盘召唤超链接面板动作。

---

## Phase 6: Polish & Cross-Cutting Concerns (收尾与集成校验)

**目的**: 自动化集成测试与文档跑通

- [x] T011 [P] 编写工具栏超链接集成测试 [frontend/src/components/DocEditor/__tests__/BubbleToolbarLink.test.tsx](frontend/src/components/DocEditor/__tests__/BubbleToolbarLink.test.tsx)。
- [x] T012 按照 [quickstart.md](specs/011-text-selection-hyperlink/quickstart.md) 校验整个超链接生命周期（创建、编辑、取消、快捷键）。

---

## 依赖关系与执行顺序 (Dependencies & Execution Order)

### Phase 依赖关系

- **Setup (Phase 1)**: 无依赖，首先执行。
- **Foundational (Phase 2)**: 依赖 Setup，提供基础工具函数。
- **User Story 1 (Phase 3)**: 依赖 Foundational 阶段完成，为 MVP 核心交付。
- **User Story 2 (Phase 4)**: 依赖 User Story 1 基础面板框架。
- **User Story 3 (Phase 5)**: 依赖 User Story 1 与 2 的面板与触发逻辑。
- **Polish (Phase 6)**: 依赖所有 User Stories 开发完毕。

---

## 并行开发示例 (Parallel Opportunities)

```bash
# 同时进行工具函数与面板基础 UI 组件的开发
Task: "创建单元测试文件 frontend/src/components/DocEditor/__tests__/urlUtils.test.ts"
Task: "创建超链接输入面板组件 frontend/src/components/DocEditor/components/BubbleToolbar/LinkInputPanel.tsx"
```

---

## 实施策略 (Implementation Strategy)

1. 完成 Phase 1 到 Phase 3，优先交付 MVP（实现选中文本添加超链接）。
2. 在 MVP 通过测试后，逐步叠加 Phase 4（回显与取消链接）和 Phase 5（键盘快捷键与流畅交互）。
3. 最终通过 Phase 6 进行自动化测试补充与全流程手工验证。
