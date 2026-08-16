# 实施计划 (Implementation Plan): DocEditor 标准组件导出与扩展改造

**分支**: `023-export-doc-editor` | **日期**: 2026-08-16 | **需求文档**: [spec.md](spec.md)

**输入**: 来自 [spec.md](spec.md) 的需求规范

## 1. 概述 (Summary)

本实施计划旨在将 `DocEditor` 改造为一个高内聚、易扩展、无无关代码依赖的标准 React 组件。改造主要包含四大板块：
1. **代码清理与解耦**：彻底清除 `DocEditor` 目录下的无关脚本、冗余模拟服务及测试残留，解耦上层应用特定事件绑定。
2. **夜间模式受控控制**：移除编辑器 UI 界面中的夜间模式按钮，改为由组件属性 `theme?: 'light' | 'dark' | 'auto'` 在代码层面受控切换。
3. **标准化目录架构**：整理并规范 `frontend/src/components/DocEditor/` 目录结构，通过顶层 `index.tsx` 清晰导出所有 API Props 和 Ref 类型。
4. **扩展集成 Hooks 与对接口子**：丰富并补全编辑器的事件生命周期回调（`onFocus`, `onBlur`, `onSelectionChange`）及媒体上传钩子（`onUploadImage`），增强 `DocEditorRef` 操作句柄。

---

## 2. 技术上下文 (Technical Context)

**语言/版本**: TypeScript 5.x / React 18
**核心依赖**: `@tiptap/react`, `@tiptap/core`, `@tiptap/pm`
**存储方式**: 无持久化依赖，纯 UI 组件
**测试框架**: Vitest / React Testing Library
**目标平台**: Web (Chrome, Safari, Firefox, Edge)
**项目类型**: 独立 React 组件 (React Component Library Standard)
**性能目标**: 主题与状态响应时间小于 50ms，渲染无丢帧或额外重排
**约束条件**: 遵循 KISS 原则，零无关全局副作用，全中文技术文档，无 emoji

---

## 3. 宪章合规性检查 (Constitution Check)

*门禁审查: 必须在规划与设计阶段前验证通过*

| 宪章原则 | 合规评估 | 措施与说明 |
|---|---|---|
| **原则一：代码质量至上 (KISS/DRY)** | 通过 | 消除冗余代码与废弃辅助脚本，保持单组件极简与可读性 |
| **原则二：严格测试标准** | 通过 | 保持并完善核心组件接口与单元测试覆盖 |
| **原则三：用户体验一致性** | 通过 | 移除硬编码 UI 按钮，使主题完全受控于宿主应用视觉系统 |
| **原则四：高性能与高响应性** | 通过 | 优化组件重渲染逻辑，图片上传与事件监听均采用轻量异步回调 |
| **原则五：架构简洁性与演进** | 通过 | 标准化目录划分与公共导出，提升组件的独立扩展性 |
| **原则六：规范与文档中文表达** | 通过 | 所有 Spec, Plan, Design 产出物均全中文编写，禁止使用 emoji |

---

## 4. 项目目录结构 (Project Structure)

### 4.1 特征文档目录 (`specs/023-export-doc-editor/`)

```text
specs/023-export-doc-editor/
├── spec.md              # 需求规格说明书
├── plan.md              # 实施计划（本文件）
├── research.md          # 架构与技术调研报告
├── data-model.md        # 数据模型与接口结构设计
├── quickstart.md        # 快速接入与验证指南
└── contracts/
    └── doc-editor-api.md # 接口契约规范文件
```

### 4.2 源码目录结构 (`frontend/src/components/DocEditor/`)

```text
frontend/src/components/DocEditor/
├── index.tsx                  # 顶层标准组件与类型集中导出文件
├── types.ts                   # 包含 DocEditorProps, DocEditorRef, DocumentNode 等类型声明
├── DocEditor.module.css       # 核心容器与布局样式
├── components/                # 内部渲染组件
│   ├── DocEditorOverlays.tsx  # 悬浮层与工具栏容器 (修改：移除暗黑模式按钮)
│   ├── FloatingBlockMenu/     # 块拖拽与菜单组件
│   └── BubbleToolbar/         # 浮动富文本工具栏
├── extensions/                # TipTap 插件扩展集合
├── hooks/                     # 组件内部逻辑 Hooks
│   ├── useDocEditorExtensions.ts
│   ├── useDocEditorRef.ts
│   └── useDocEditorModals.ts
├── utils/                     # 辅助工具函数集
└── styles/                    # 主题变量与通用排版样式 (重构支持受控主题类名)
```

---

## 5. 复杂度与违规追踪 (Complexity Tracking)

*当前无违规项，不需要填写*

---

## 6. 设计产出汇总 (Design Artifacts)

- **调研报告**: [research.md](research.md)
- **数据模型与接口**: [data-model.md](data-model.md)
- **API 契约**: [contracts/doc-editor-api.md](contracts/doc-editor-api.md)
- **验证与快速接入指南**: [quickstart.md](quickstart.md)
