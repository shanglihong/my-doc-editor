# Component Structure Contract: UI 组件与 Extension 规范

## 1. UI 组件目录规范 (UI Component Directory Standard)

所有存放在 `frontend/src/components/DocEditor/components/` 下的子组件必须遵循如下文件与导出规范：

```text
components/[ComponentName]/
├── [ComponentName].tsx       # 核心 React 组件
├── [ComponentName].module.css# 独立 CSS Module
└── index.ts                  # (可选) 导出组件及相关 Props 类型
```

### 规范要求
- **样式隔离**：组件内部通过 `import styles from './[ComponentName].module.css'` 引入样式，严禁直接依赖顶层全局组件样式（除 CSS 变量与主题全局定义外）。
- **相对导入**：组件内部引用的类型或工具函数，若跨模块则使用标准相对路径引用（如 `../../types`）。

---

## 2. Extension 扩展规范 (Extension Directory Standard)

所有存放在 `frontend/src/components/DocEditor/extensions/` 下的 Tiptap 扩展文件必须遵循如下规范：

```text
extensions/
├── [Feature]Extension.ts     # 单个扩展文件（如 CalloutExtension.ts, DrawIOExtension.ts, ImageBlockExtension.ts）
└── [Plugin]Plugin.ts         # 单个插件文件（如 DragHandlePlugin.ts）
```

### 规范要求
- **不包含纯 UI 组件**：`extensions/` 目录下不得直接包含复杂的 React UI 组件。如果 NodeView 需要使用 React 渲染，其 React 组件必须存放在 `components/[ComponentName]` 下，在 `Extension.ts` 中通过 `ReactNodeViewRenderer(ComponentName)` 进行绑定。
- **职责划分**：`Extension.ts` 仅负责声明属性 Schema、解析 HTML 规则（`parseHTML`）、生成 HTML 规则（`renderHTML`）以及扩展命令（`addCommands`）。
