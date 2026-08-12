# Implementation Plan: 画图组件切换为 draw.io

**Branch**: `002-drawio-diagram-editor` | **Date**: 2026-08-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-drawio-diagram-editor/spec.md`

## Summary

将文档编辑器 (DocEditor) 中的画图组件从 Excalidraw 替换为 draw.io (diagrams.net)。彻底卸载 `@excalidraw/excalidraw` 依赖并删除相关代码；在项目 `public/drawio/` 中集成静态 draw.io 资源，基于 TipTap 节点扩展 (`DrawIOExtension`) 与 postMessage 通信实现自包含、无需访问外网的本地绘图与只读 SVG 高效渲染。

## Technical Context

**Language/Version**: TypeScript 6.0, React 19, HTML5
**Primary Dependencies**: TipTap v3.30 (`@tiptap/react`, `@tiptap/pm`), Vite 8, Lucide React
**Storage**: TipTap Document JSON (DrawIO Block 节点属性存储 `xml` 与 `svg`)
**Testing**: Vitest, React Testing Library
**Target Platform**: 桌面端与移动端现代 Web 浏览器 (Chrome, Edge, Firefox, Safari)
**Project Type**: Web Application (React 前端组件)
**Performance Goals**: 编辑器打开时间 < 1.0 秒；在只读模式下图表预览零 JS 编辑器开销；保存后 300ms 内更新 preview
**Constraints**: 纯本地自包含运行，不依赖外部公共 embed 域名服务；无历史数据转换包袱

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **原则一：代码质量至上** - 通过。移除重型 Excalidraw 依赖，按职责拆分 `DrawIOExtension` 与 `DrawIOModal` 组件，结构清晰。
- **原则二：严格测试标准** - 通过。必须配合 Vitest 编写节点属性解析与渲染逻辑的自动化测试用例。
- **原则三：用户体验一致性** - 通过。统一设计弹窗交互与图表悬浮控制栏，样式与现有的 DocEditor 保持高度一致。
- **原则四：高性能与高响应性** - 通过。只读模式下仅直接渲染轻量矢量 SVG 标签，杜绝 iframe 重型脚本加载，显著改善首屏性能。
- **原则五：架构简洁性与演进** - 通过。基于 draw.io 官方标准的 postMessage 通信协议，无不必要的过度封装。
- **原则六：规范与中文表达** - 通过。需求 Spec、设计 Plan、契约与 Quickstart 文档全量采用中文。

## Project Structure

### Documentation (this feature)

```text
specs/002-drawio-diagram-editor/
├── plan.md              # 本实施计划文件
├── research.md          # 架构选型与技术决策 (Phase 0)
├── data-model.md        # 节点属性与 Modal 状态模型 (Phase 1)
├── quickstart.md        # 端到端验证与测试指南 (Phase 1)
└── contracts/
    └── drawio-postmessage-contract.md # postMessage 通信协议契约 (Phase 1)
```

### Source Code (repository root)

```text
public/
└── drawio/              # 静态 draw.io Web 编辑器资源包

frontend/
├── package.json         # 依赖配置（移除 @excalidraw/excalidraw）
└── src/
    └── components/
        └── DocEditor/
            ├── index.tsx                         # 注册 DrawIOExtension，移除 ExcalidrawExtension
            ├── components/
            │   ├── SlashMenu/
            │   │   └── SlashMenuPlugin.ts        # 替换斜杠菜单中的 Excalidraw 为 draw.io
            │   ├── Excalidraw/                   # [DELETE] 删除原 Excalidraw 组件
            │   └── DrawIO/                       # [NEW] draw.io 图表组件
            │       ├── DrawIOView.tsx            # TipTap 节点视图组件
            │       └── DrawIOModal.tsx           # draw.io 嵌入式 iframe 全屏编辑弹窗
            └── extensions/
                ├── ExcalidrawExtension.ts        # [DELETE] 删除原扩展
                └── DrawIOExtension.ts            # [NEW] TipTap 自定义画图节点扩展
```

**Structure Decision**: 采用前端 Web Application 单项目方式，在 `frontend/src/components/DocEditor` 模块内完成替换与清理，静态 Web 资源部署于 `public/drawio/`。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(无宪章违规事项，不适用)*
