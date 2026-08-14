# Implementation Plan: 图片 Block 支持与文件存储

**Branch**: `007-image-block-support` | **Date**: 2026-08-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/007-image-block-support/spec.md`

## Summary

为文档编辑器支持图片 Block，包含剪贴板粘贴、本地文件导入、拖拽导入以及网络图片链接处理。采用乐观 UI 即时预览（Blob 本地渲染 + 等待/加载 Icon）与后台静默上传/转存保存至存储目录。支持区分“本地存储”与“网络外链直嵌”两种模式，并提供气泡菜单栏（Bubble Menu）用于编辑图片描述（Caption）以及配置左/中/右对齐排版。

## Technical Context

**Language/Version**: TypeScript / React 19 (Frontend), Node.js (Vite environment / Mock Service)

**Primary Dependencies**: Tiptap Editor (`@tiptap/react`, `@tiptap/core`, `@tiptap/extension-image`), Lucide React (Icons)

**Storage**: 本地文件存储目录 (`/public/uploads/` 或开发环境 API 服务存储路径)

**Testing**: Vitest (`npm test`), React Testing Library

**Target Platform**: Web Browsers (Chrome / Firefox / Safari / Edge)

**Project Type**: Web Application (React + Tiptap 编辑器)

**Performance Goals**: 乐观 UI 局部预览呈现时延 <= 100ms，整体上传与保存响应时延 <= 2 秒 (5MB 内图片)

**Constraints**: 单张图片大小限制 10MB，纯前端/浏览器端零阻塞

**Scale/Scope**: 支持常见图片类型 (PNG, JPEG, GIF, WebP)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **原则一：代码质量至上 (Code Quality Excellence)**: 通过（设计模块边界清晰，单独抽离 `ImageBlockNodeView`、`ImageBubbleMenu` 与 `imageUploadService` 模块，不引入复杂预测性封装）。
- **原则二：严格测试标准 (Rigorous Testing Standards)**: 通过（为图片 Block 解析、粘贴拖拽事件处理器及上传服务编写单元测试）。
- **原则三：用户体验一致性 (UX Consistency & Modern Design)**: 通过（遵循项目已有的 CSS Module 与 UI 组件风格，使用 Lucide 图标提供高品质加载、气泡菜单与对齐控制）。
- **原则四：高性能与高响应性 (Performance & Responsiveness)**: 通过（采用乐观 UI Blob 即时预览，异步上传过程完全不阻塞主线程编排）。
- **原则五：架构简洁性与演进 (Architectural Simplicity)**: 通过（直接使用基于 Tiptap Node 扩展的方案，避免引入重型无用依赖）。
- **原则六：规范与文档中文表达 (Specification & Language Standards)**: 通过（所有文档、接口注释与实施计划均全中文撰写）。

## Project Structure

### Documentation (this feature)

```text
specs/007-image-block-support/
├── spec.md              # 需求规格说明书
├── plan.md              # 本实施计划文件
├── research.md          # Phase 0 技术决策与调研
├── data-model.md        # Phase 1 实体数据结构
├── quickstart.md        # Phase 1 验证指南
├── contracts/           # Phase 1 接口协议
│   └── image-api.md     # 图片上传与转存服务 API 协议
└── checklists/
    └── requirements.md  # 规格质量检查清单
```

### Source Code (repository root)

```text
frontend/src/
├── components/
│   └── DocEditor/
│       ├── extensions/
│       │   └── ImageBlock/               # 图片 Block Tiptap 扩展
│       │       ├── ImageBlockExtension.ts # Node 节点扩展定义
│       │       ├── ImageBlockView.tsx    # 乐观 UI / 加载 Icon / 图片渲染视图
│       │       └── ImageBubbleMenu.tsx   # 图片悬浮工具栏 (描述编辑/左中右对齐/转存/替换)
│       └── services/
│           └── imageUploadService.ts     # 统一图片上传与转存服务
```

## Structure Decision

本需求基于 `frontend/src/components/DocEditor/` Web 应用架构进行模块化扩充。在 `extensions/` 目录下新增 `ImageBlock/` 包含 Node 定义、NodeView 交互组件与 `ImageBubbleMenu`；在 `services/` 目录下提供 `imageUploadService.ts` 集中处理上传与转存。

## Design Artifacts Summary

- **[research.md](research.md)**: 确认采用自定义 Tiptap NodeView + 乐观 UI Blob 预览 + 拦截器 (Paste / Drop) 方案。
- **[data-model.md](data-model.md)**: 确定 ImageBlockNode 节点属性 (`src`, `caption`, `alignment`, `storageType`, `status` 等) 与 `ImageBubbleMenu` 交互组件。
- **[image-api.md](contracts/image-api.md)**: 定义文件上传与网络外链转存服务 HTTP API 规范。
- **[quickstart.md](quickstart.md)**: 给出 5 个完整的端到端验证场景（粘贴、拖拽、本地导入、外链直嵌/转存与气泡菜单控制）。
