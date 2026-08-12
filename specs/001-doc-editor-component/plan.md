# 实施计划：个人知识库文档编辑器前端组件

**分支**: `001-doc-editor-component` | **日期**: 2026-08-12 | **规范文件**: [spec.md](./spec.md)

**输入**: 来自 [spec.md](./spec.md) 的功能需求规范

## 概要 (Summary)

本功能计划构建一个轻量美观、体验媲美飞书云文档的前端文档编辑器 React 组件。
系统选用 **React + TypeScript** 编写，底层基于 **Tiptap 2.x (ProseMirror)** 富文本与块级引擎；嵌入 **Excalidraw** 作为画图/UML 绘制组件；高亮块设计为可内嵌丰富子块的 **Callout Container**；并提供斜杠快捷菜单、选区悬浮气泡工具栏、块级拖拽重排（Drag & Drop）以及与标准 Markdown/JSON AST 的无损转换能力。

---

## 技术上下文 (Technical Context)

- **语言与版本**: TypeScript 5.x, React 18.x
- **核心依赖**: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@excalidraw/excalidraw`, `lucide-react`, `tiptap-markdown`
- **存储方案**: 单机/纯前端组件，以 Block AST (JSON) 结构或 Markdown 字符串存储与导出
- **测试框架**: Vitest / React Testing Library
- **目标平台**: 现代主流桌面端浏览器 (Chrome, Safari, Edge, Firefox)
- **项目类型**: 前端 React UI 组件库模块
- **性能目标**: 首屏加载/初始化 <300ms，输入响应 <16ms (60fps)，画图渲染 <50ms，拖拽重排 <20ms
- **开发管理脚本**: Makefile (支持 `make dev`, `make install`, `make build`, `make test`)
- **配置与忽略管理**: 根目录与前端双层 `.gitignore` (版本控制忽略 node_modules, dist 与环境文件)
- **约束条件**: 纯前端/无网络依赖，不包含协同通信逻辑，极简高质感 UI 风格

---

## 宪章合规性检查 (Constitution Check)

*网关：必须在 Phase 0/Phase 1 通过*

| 原则 | 检查项 | 状态 | 评估与说明 |
|---|---|---|---|
| 原则一：代码质量至上 | 恪守 KISS 与 DRY 原则，边界清晰 | 通过 | 基于 Tiptap 模块化扩展架构，自定义 NodeView 分工明确，无过度防御设计。 |
| 原则二：严格测试标准 | 核心逻辑与组件测试 | 通过 | 为 AST 转换、Callout 容器节点及拖拽重排提供单元与集成测试。 |
| 原则三：UX 一致性 | 现代化极简设计语言 | 通过 | 参考飞书云文档视觉风格，统一颜色体系、字号与平滑过渡微交互。 |
| 原则四：高性能与高响应 | 帧率与加载开销控制 | 通过 | 按需挂载 Excalidraw 面板，拖拽指示线采用 requestAnimationFrame 渲染。 |
| 原则五：架构简洁性 | 优先验证成熟方案 | 通过 | 采用成熟生态 Tiptap + Excalidraw，不重复发明轮子。 |
| 原则六：中文规范表达 | 规范与文档全中文 | 通过 | 需求、计划、架构、API 契约及测试指南全中文撰写。 |

---

## 项目结构 (Project Structure)

### 本功能设计产出文档

```text
specs/001-doc-editor-component/
├── plan.md              # 实施计划与架构方案 (本文件)
├── research.md          # Phase 0 选型研究与技术决策
├── data-model.md        # Phase 1 AST 与数据模型规格
├── quickstart.md        # Phase 1 快速上手与验证指南
└── contracts/
    └── editor-api.md    # Phase 1 组件 API 契约定义
```

### 源代码目录规划 (`frontend/src/`)

```text
frontend/src/
├── components/
│   └── DocEditor/
│       ├── index.tsx                 # 组件主入口与 Ref 导出
│       ├── DocEditor.module.css      # 极简 UI 样式设计系统
│       ├── components/
│       │   ├── SlashMenu/            # 斜杠快捷插入菜单
│       │   ├── BubbleToolbar/        # 选区气泡工具栏 (字号、样式、调色盘)
│       │   ├── Callout/              # 高亮嵌套容器与 Icon/Theme 选择器面板
│       │   ├── Excalidraw/           # Excalidraw 嵌入式画图块
│       │   └── DragHandle/           # 拖拽把手与放置指示线视图
│       ├── extensions/
│       │   ├── CalloutExtension.ts   # Callout Container 扩展节点
│       │   ├── ExcalidrawExtension.ts# Excalidraw 扩展节点
│       │   ├── DragHandlePlugin.ts   # 拖拽重排 ProseMirror 插件
│       │   └── FontSizeMark.ts       # 字号选择器扩展 Mark
│       └── utils/
│           ├── serializer.ts         # AST <-> Markdown 转换层
│           └── defaultTheme.ts       # 8+ 高颜值预设主题配置
└── tests/
    ├── serializer.test.ts            # AST 转换测试
    └── DocEditor.test.tsx            # 编辑器交互集成测试
```

---

## 复杂度跟踪 (Complexity Tracking)

> 架构方案无宪章违例事项。
