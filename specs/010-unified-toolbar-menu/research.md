# 技术研究文档：统一工具栏菜单管理

**Feature Branch**: `010-unified-toolbar-menu`
**Date**: 2026-08-14

## 研究课题 1：纯 Hover 驱动的工具栏显隐与事件脱钩机制

### Decision
废除依赖 Tiptap `selection`（TextSelection / NodeSelection）及点击事件（`onClick` / `onFocus`）触发工具栏显示的方式，全面改为由 DOM/React 级别的 `mouseenter` / `mouseleave` 鼠标悬停事件驱动工具栏的生命周期。

### Rationale
- 用户显式要求工具栏菜单与组件点击无关，移除点击触发事件。
- 悬停驱动可以保持编辑器的清爽状态，随鼠标落点即时呈现可操作项。
- 为了解决鼠标从 Block 移向浮动工具栏途中因悬停离开 Block 导致工具栏闪烁隐藏的问题，工具栏与 Block 需建立统一的 Hover 作用域，并配合轻量延迟防抖（150ms）处理边界隙移。

### Alternatives Considered
- **维持 Selection 联动**: 当点击选区时依然弹出工具栏。—— *被否决*：违背用户“与点击无关”的明确指令，且会导致选中文本与悬停工具栏发生界面重叠摩擦。

---

## 研究课题 2：标准化工具栏组件架构（左侧固定 + 右侧自定制）

### Decision
创建统一的封装组件 `<UnifiedBlockToolbar />`（或通用工具栏基类容器），包含两大部分：
1. **左侧固定操作区 (Fixed Left Toolbar)**: 固定提供“插入空白 Block”（在当前 Block 后/前插入段落）和“删除 Block”两个标准化按钮。
2. **右侧自定制区 (Custom Right Slot)**: 暴露 React Children 或 `customActions` 属性，供不同 Block 组件（Table, Callout, Image, CodeBlock, DrawIO 等）自由扩展注入其专有操作面板（如表格行列变更、高亮块颜色挑选、图片替换等）。

### Rationale
- 彻底消除各个 Block 组件自行从头实现工具栏 HTML/CSS 带来的视觉差异与逻辑重复问题，符合 DRY 原则。
- 保证整个编辑器在交互与外观上的一致性，满足宪章“用户体验一致性”的要求。

### Alternatives Considered
- **在各 Block 内重构重复逻辑**: 仅规范代码写法但不抽离统一容器。—— *被否决*：代码冗余度高，后续调整通用左侧按钮时维护成本极高。

---

## 研究课题 3：全局工具栏互斥与深层嵌套优先级调度算法

### Decision
重构 `toolbarPriority.ts` 与全局 Hover 状态 Store/Context，建立基于 DOM 树深度（`depth`）与悬停堆叠栈（Hover Stack）的调度机制：
1. 全局单例记录当前激活的 `activeHoverBlockInfo: { blockId: string; type: ToolbarType; depth: number; targetEl: HTMLElement } | null`。
2. 当鼠标进入一个 Block（`onMouseEnter`）时，将其推入当前 Hover 栈；当离开时（`onMouseLeave`），将其从 Hover 栈中移除。
3. 任何时刻，全局仅激活 Hover 栈中 `depth` 最高（即最具体/最内层）的 Block 工具栏。
4. 彻底互斥：只要激活的目标发生了变化，旧 Block 的工具栏必然立刻隐藏，全局 100% 保持单一工具栏渲染。

### Rationale
- 完美解决 Callout 内嵌 Table / Image 等嵌套结构的工具栏冲突问题。
- 最内层节点直接对应用户的精准悬停焦点，优先响应最具体的子组件交互诉求。

### Alternatives Considered
- **父子工具栏同时展示/级联展示**: —— *被否决*：会造成严重页面遮挡与视觉混乱，违背“严格控制不要出现多个菜单”的需求。
