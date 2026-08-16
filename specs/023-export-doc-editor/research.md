# 架构与技术调研报告: DocEditor 标准组件导出与扩展改造

**特征**: `023-export-doc-editor` | **日期**: 2026-08-16 | **需求文件**: [spec.md](spec.md)

## 1. 调研目标与背景

为了将当前项目中的 `DocEditor` 改造为可以单独导出并在其他工程或模块中复用的标准 React 组件，需要解决以下核心问题：
1. **代码解耦与无关逻辑清理**：移除特定演示页面逻辑、未使用的 Mock 服务/测试残留以及全局侧边栏联动等硬编码依赖。
2. **夜间模式 UI 解耦与属性控制**：从编辑器自带的工具栏/悬浮菜单中彻底移除夜间模式切换按钮，将夜间模式改为通过组件属性（`theme` 或 `isDark`）受控对接。
3. **标准化组件目录结构**：理顺 `frontend/src/components/DocEditor` 目录下的层级架构，明确各子目录职责，并设立干净的顶层 `index.ts` 集中导出组件与 TS 类型。
4. **集成对接钩子（Hooks & Callbacks）与 Ref 句柄**：暴露补全标准的编辑器事件回调（如 `onFocus`, `onBlur`, `onSelectionChange`, `onChange`, `onTitleChange`），媒体处理钩子（如 `onUploadImage`），以及命令式句柄 (`DocEditorRef`)。

---

## 2. 核心技术决策与评估

### 决策一：代码清理与解耦策略 (Code Cleanup & Decoupling)

- **现状分析**：
  - `DocEditor` 内部直接依赖了特定于全局 Layout 的 Custom Event（例如 `window.dispatchEvent(new CustomEvent('HIDE_ALL_FLOATING_MENUS'))`），以及包含内部直接修改全局 DOM class 的逻辑。
  - `services/` 目录中包含了硬编码的默认模版/Mock 模拟逻辑，与纯组件功能交织。
- **决策方案**：
  - 彻底清理 `DocEditor` 内部未使用的组件文件与调试脚本。
  - 提取纯组件所需的类型定义与扩展插件，去除对上层应用 Layout 的强耦合。

### 决策二：夜间模式受控控制 (Programmatic Theme Control)

- **现状分析**：
  - 当前主题控制逻辑分散在 `styles/` 和某些悬浮工具栏按钮中，允许用户点击按钮切换 dark/light。
- **决策方案**：
  - 从 `components/DocEditorOverlays` 及悬浮/气泡工具栏中移除夜间模式切换图标按钮。
  - 在 `DocEditorProps` 中增加 `theme?: 'light' | 'dark' | 'auto'`（或布尔值 `isDark?: boolean`，默认为 `'light'`）。
  - 组件内部通过监听 `theme` 属性变化，动态为编辑器根 DOM 节点添加/切换 `data-theme="dark"` 或对应 CSS 类名，顺滑响应宿主系统的模式切换。

### 决策三：标准化目录组织规范 (Standardized Component Structure)

- **决策方案**：
  在 `frontend/src/components/DocEditor/` 建立清晰规范的单组件包目录划分：
  ```text
  frontend/src/components/DocEditor/
  ├── index.tsx                  # 顶层入口：导出 DocEditor 主组件及 public types
  ├── types.ts                   # 集中管理 API Props、Ref 句柄与事件 Payload 类型
  ├── DocEditor.module.css       # 核心容器与排版样式
  ├── components/                # 内部子组件 (Overlays, FloatingMenu, BubbleTool, Modals)
  ├── extensions/                # TipTap 扩展集合 (TitleExtension, ImageBlockExtension, etc.)
  ├── hooks/                     # 内部自定义 Hooks (useDocEditorExtensions, useDocEditorRef, etc.)
  ├── utils/                     # 纯函数工具集 (DOM事件、格式转换、Toolbar priority)
  └── styles/                    # 主题变量与编辑区基础样式
  ```

### 决策四：通用接口与对接口子 (Integration Callbacks & Imperative API)

- **决策方案**：
  1. **生命周期与状态监听**：
     - `onFocus?: (event: FocusEvent) => void`
     - `onBlur?: (event: FocusEvent) => void`
     - `onSelectionChange?: (selectionInfo: { empty: boolean; from: number; to: number }) => void`
     - `onChange?: (docNode: DocumentNode, markdown: string) => void`
     - `onTitleChange?: (title: string) => void`
  2. **媒体处理接口**：
     - `onUploadImage?: (file: File) => Promise<string>` （提供自定义图片上传能力，若未提供则降级为本地 Base64 / Blob URL）
  3. **命令句柄 (`DocEditorRef`)**：
     - `focus(): void`
     - `blur(): void`
     - `clearContent(): void`
     - `getMarkdown(): string`
     - `getJSON(): DocumentNode`
     - `setMarkdown(content: string): void`

---

## 3. 替代方案对比分析

| 方案维 | 选中方案 | 替代方案 | 拒绝理由 |
|---|---|---|---|
| **夜间模式控制** | 通过 Props 显式受控控制，移除 UI 按钮 | 保留 UI 按钮，但增加 `onThemeChange` 导出 | 无法满足需求“将夜间模式按钮去掉”，且导致宿主应用与编辑器内部状态不一致 |
| **图片上传接入** | 暴露 `onUploadImage` Promise 回调 | 仅允许静态 URL 输入框 | 限制了工程实际接入图床/OSS的能力，灵活性不足 |
| **类型导出** | 统一在 `index.tsx` 和 `types.ts` 中重新导出 | 散落各子文件夹分别 import | 不符合标准 React 组件库暴露规范，增加使用者引用成本 |

---

## 4. 结论

该技术方案完全符合项目宪章的代码简洁性（KISS）与高可维护性要求，去除了过度的内部交互解耦限制，使 `DocEditor` 转型为一个纯粹、可受控、高扩展性的标准 React 文档编辑器组件。
