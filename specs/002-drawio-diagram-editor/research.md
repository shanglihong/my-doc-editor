# Research: 画图组件切换为 draw.io

## 概述

本研究旨在评估并确定将文档编辑器中的画图组件从 Excalidraw 切换为 draw.io 的技术实现细节、通信协议、TipTap 节点扩展设计及清理策略。

## 技术决策与分析

### 决策 1：draw.io 编辑器嵌入与通信机制

- **选择方案**：在 `public/drawio/` 部署本地静态 draw.io Web 资源，通过 `iframe` 嵌入并基于 `window.postMessage` 协议通信。
- **选择理由**：
  1. 符合用户选择的“静态 draw.io Web 资源”本地集成要求，实现纯内网/自包含运行，不依赖第三方网络服务。
  2. draw.io 官方提供了成熟的 Embed Protocol 机制，支持通过 JSON 通信初始化图表数据、实时导出 SVG/PNG 预览及控制图表保存与关闭。
- **放弃方案**：
  - **官方在线 embed (embed.diagrams.net)**：依赖外网联通性，不符合自包含运行要求。
  - **Canvas/WASM 原生重写**：复杂度极高，不利于后续跟进 draw.io 上游升级。
- **通信流程定义**：
  1. 父页面创建隐藏/弹窗 `iframe`，加载 `drawio/index.html?embed=1&proto=json&spin=1`。
  2. `iframe` 页面加载就绪后向父窗口发送 `{"event": "init"}` 消息。
  3. 父窗口监听该消息并回应 `{"action": "load", "xml": "<xml>..."}`，填充已有绘图。
  4. 用户在 draw.io 内点击“Save/保存”时，`iframe` 发送 `{"event": "save", "xml": "...", "xmlpng": "..."}`，同步获取图表 XML 和矢量 SVG 预览。
  5. 用户点击关闭或取消时，`iframe` 发送 `{"event": "exit"}` 消息，关闭弹窗。

---

### 决策 2：TipTap 节点扩展设计 (DrawIOExtension)

- **选择方案**：新建 TipTap 自定义节点扩展 `DrawIOExtension`，节点名称设为 `drawioBlock`。
- **数据结构**：
  - 属性 `xml`：存储 draw.io 的原始绘图 XML 文本。
  - 属性 `svg`：存储根据 XML 导出的 SVG 矢量预览字符串。
  - 属性 `width` / `height`：图表在文档页面中的展现尺寸。
- **视图渲染策略**：
  - **编辑模式**：显示图形 SVG 预览图，右上方或悬浮提供“编辑图表”按钮与“删除”按钮。点击“编辑图表”弹出全屏 draw.io modal 对话框。
  - **只读模式**：仅直接渲染 `svg` 字符串，零 JS 编辑器开销，首屏与多图表渲染性能达到最优。

---

### 决策 3：Excalidraw 卸载与移除策略

- **选择方案**：
  1. 在 `frontend/package.json` 中移除 `@excalidraw/excalidraw` 依赖包。
  2. 物理删除 `frontend/src/components/DocEditor/components/Excalidraw/` 目录及 `frontend/src/components/DocEditor/extensions/ExcalidrawExtension.ts` 文件。
  3. 在 `SlashMenuPlugin.ts` 中删除 Excalidraw 斜杠项，替换为 `draw.io` 图表选项。
  4. 在 `DocEditor/index.tsx` 的 TipTap `extensions` 配置数组中替换节点注册。

---

## 结论

技术路线清晰可行，采用前端静态资源打包 + TipTap `drawioBlock` 自定义节点 + iframe postMessage 标准协议通信，能够在彻底移除 Excalidraw 的同时提供性能优秀、离线可用的 draw.io 绘图体验。
