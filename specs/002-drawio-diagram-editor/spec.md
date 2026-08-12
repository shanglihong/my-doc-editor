# Feature Specification: 画图组件切换为 draw.io

**Feature Branch**: `002-drawio-diagram-editor`

**Created**: 2026-08-12

**Status**: Draft

**Input**: User description: "画图组件切换为draw.io"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 插入与嵌入式编辑 draw.io 图表 (Priority: P1)

用户在编辑文档时，可以通过快捷指令或斜杠菜单插入 draw.io 绘图组件。插入后显示图表预览占位区域，点击或双击图表可打开全屏/弹窗式的 draw.io 编辑界面。用户在 draw.io 中完成绘图并保存后，图表数据及渲染矢量图自动保存回文档中，并在编辑器内更新显示。

**Why this priority**: 这是替换画图组件的核心价值，使用户能够使用功能强大的 draw.io 绘制流程图、架构图、思维导图等高复杂度图表。

**Independent Test**: 用户在新建文档中输入斜杠命令插入 draw.io 块，双击打开编辑界面绘制简单图形并保存，校验文档中能正确更新并展现绘制的图表内容。

**Acceptance Scenarios**:

1. **Given** 用户在文档编辑器中处于编辑状态，**When** 输入斜杠菜单并选择“draw.io 图表”，**Then** 文档中插入一个新的 draw.io 绘图块并提示点击开始绘图。
2. **Given** 文档中已存在 draw.io 绘图块，**When** 用户点击“编辑”按钮或双击图表区域，**Then** 系统弹出嵌入的 draw.io 交互编辑器，并载入该块当前的图表数据。
3. **Given** 用户在 draw.io 编辑器中修改了图表并点击保存，**When** 关闭编辑器窗口，**Then** 编辑器内的图表块实时更新渲染为最新绘制的内容。

---

### User Story 2 - 图表只读预览与导出 (Priority: P2)

当用户处于文档只读查看模式或导出文档（如导出为 PDF/HTML/Markdown）时，draw.io 图表块能够以高质量矢量格式（如 SVG）或清晰图片格式正常呈现，无须加载完整的绘图编辑器环境。

**Why this priority**: 保证文档在分享、预览与导出场景下的内容完整性与渲染性能。

**Independent Test**: 切换文档为只读模式或执行文档导出，检查导出的文件与界面中 draw.io 图表是否清晰无失真且无法触发编辑。

**Acceptance Scenarios**:

1. **Given** 用户打开一份包含 draw.io 图表的只读文档，**When** 页面加载完成，**Then** 图表以高清晰度矢量格式展现，不触发编辑界面加载。
2. **Given** 用户点击导出文档，**When** 导出文件生成完成，**Then** 导出文档中包含图表的最新静态渲染图像。

---

### User Story 3 - 移除 Excalidraw 原画图组件 (Priority: P3)

彻底移除项目中原有的 Excalidraw 画图组件、相关代码及 NPM 包依赖，避免冗余代码留存并优化打包体积。

**Why this priority**: 保持系统架构简洁干净，避免双画图组件并存带来的维护成本和体积膨胀。

**Independent Test**: 检查代码库及 package.json，确认 Excalidraw 相关模块与依赖均已彻底清理，应用整体构建与运行不受影响。

**Acceptance Scenarios**:

1. **Given** 重新构建并启动前端应用，**When** 检查项目依赖与斜杠菜单组件，**Then** Excalidraw 彻底从组件库与菜单中移除，且无残留报错。

---

### Edge Cases

- **网络隔离与本地静态资源加载**：draw.io 静态资源部署于本地/应用内，需确保在无外网环境下 iframe 正确加载本地资源。
- **超大图表渲染**：当绘图数据体量非常大（如包含数百个节点的架构图）时，控制渲染计算复杂度，避免导致文档编辑器主线程卡顿。
- **未保存直接关闭**：用户在 draw.io 界面中做了修改但直接关闭弹窗时，系统是否提示确认未保存的修改？

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统 MUST 支持在文档编辑器的斜杠菜单（Slash Menu）与插入工具栏中加入“draw.io 图表”选项。
- **FR-002**: 系统 MUST 在文档块数据中存储 draw.io 的标准图表数据格式（XML / compressed XML）及对应的静态渲染预览数据（SVG / PNG）。
- **FR-003**: 系统 MUST 提供嵌入式的 draw.io 图表编辑器全屏/弹窗界面，支持通过 postMessage 事件机制传输初始化数据与保存指令。
- **FR-004**: 系统 MUST 在文档只读模式下仅加载轻量静态预览，以优化页面加载性能。
- **FR-005**: 系统 MUST 彻底移除原有的 Excalidraw 画图组件代码、关联路由/视图及相关第三方 npm 包依赖，无历史数据迁移负担。
- **FR-006**: 系统 MUST 将 draw.io 静态 Web 资源打包/集成于项目静态资源目录中，实现自包含、无需访问外网的本地化渲染与编辑。

### Key Entities

- **DrawIO Diagram Entity**: 表示一个图表块的数据结构，包含唯一标识符 (ID)、图表源码数据 (XML)、静态预览图像数据 (SVG/PNG)、图表宽高及元数据。
- **Document Block Entity**: 文档编辑器中的通用块实体，扩展支持类型为 `drawio` 的块类型。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户从点击编辑到 draw.io 编辑器完整加载完成的时间不超过 1.0 秒（在本地静态资源加载模式下）。
- **SC-002**: 用户在 draw.io 编辑器中保存后，文档页面内的图表预览在 300 毫秒内完成更新。
- **SC-003**: 100% 的 draw.io 图表能够在只读模式和文档导出（PDF/HTML）中清晰渲染，且不依赖编辑器的二次加载。
- **SC-004**: 移除 Excalidraw 依赖并集成静态 draw.io 资源后，项目构建无冗余依赖遗留。

## Assumptions

- **A-001**: 假设项目由于无历史环境数据积攒，不需要针对 Excalidraw 格式数据进行兼容或转换。
- **A-002**: 假设 draw.io 图表保存格式采用标准的 XML / compressed XML 结构，便于后续扩充与跨平台导入导出。
- **A-003**: 假设移动端查看模式下仅支持静态预览，完整编辑功能优先适配桌面端设备。
