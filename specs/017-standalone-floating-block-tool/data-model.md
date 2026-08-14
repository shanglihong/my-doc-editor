# 数据模型与组件契约 (Data Model & Component Contracts)

**Feature**: Standalone Floating Block Tool (017-standalone-floating-block-tool)
**Date**: 2026-08-15

## 1. 组件 Props 数据模型 (`FloatingBlockToolProps`)

`FloatingBlockTool` 独立悬浮组件接受以下参数接口定义：

```typescript
export interface FloatingBlockToolProps {
  /** TipTap 编辑器实例 */
  editor: Editor | null;
  /** 当前 Block 节点对应的类型名称 (如 'callout', 'codeBlock', 'table', 'image', 'drawio') */
  blockType: string;
  /** 拖拽状态：点击拖拽句柄时为 true */
  isDragging?: boolean;
  /** 块类型切换菜单是否处于打开状态 */
  isTypeMenuOpen?: boolean;
  /** 删除当前 Block 的回调逻辑（若不传则提供标准 TipTap 节点删除默认实现） */
  onDeleteBlock?: () => void;
  /** 是否隐藏类型切换下拉菜单（部分特殊 Block 可选择隐藏） */
  hideTypeDropdown?: boolean;
  /** 定制按钮插槽：用于嵌入特定 Block 独有的格式/操作控件 */
  children?: React.ReactNode;
}
```

---

## 2. 内部浮动定位与状态模型 (`FloatingToolState`)

```typescript
export interface FloatingToolState {
  /** 工具栏是否可见 */
  visible: boolean;
  /** 浮动工具栏 Top 坐标 (px) */
  top: number;
  /** 浮动工具栏 Left 坐标 (px) */
  left: number;
  /** 悬浮方位 ('top' | 'bottom') */
  placement: 'top' | 'bottom';
  /** 当前目标 Block 节点的绝对位置 pos */
  pos: number;
  /** 当前目标 Block 节点的尺寸 nodeSize */
  nodeSize: number;
}
```

---

## 3. 非文本 Block 对接清单与特征矩阵

| Block 类型 | 节点名称 (`blockType`) | 定制插槽内容 (`children`) | 删除逻辑回调 (`onDeleteBlock`) |
| --- | --- | --- | --- |
| **高亮块 (Callout)** | `'callout'` | 预设主题面板、边框颜色选择器、背景颜色选择器、重置颜色 | 删除整个高亮块节点 |
| **代码块 (CodeBlock)** | `'codeBlock'` | 语言切换下拉框 (`LanguageSelect`)、代码复制按钮 | 删除整个代码块节点 |
| **表格块 (Table)** | `'table'` | 表格行列增删菜单、表头设置选项 | 删除整个表格块节点 |
| **图片块 (Image)** | `'image'` | 图片对齐方式 (左/中/右)、替换图片、尺寸重置 | 删除整个图片块节点 |
| **DrawIO 块 (DrawIO)** | `'drawio'` | 重新编辑图表按钮 | 删除整个 DrawIO 节点 |

---

## 4. 状态转换与事件流图

```
[ 初始状态: 隐藏 (visible: false) ]
       │
       ├─ 鼠标进入 Block 区域 (onMouseEnter)
       │      ↓
       │  [ 触发 HoverStack 注册 (type: blockType) ]
       │      ↓
       │  [ 计算智能浮动定位 (calculateSmartPosition) ]
       │      ↓
       ├─► [ 状态变更: 展示工具栏 (visible: true) ]
       │      │
       │      ├─ 鼠标离开 Block 区域 ──► 250ms 防抖未进入工具栏 ──► [ 状态变更: 隐藏 (visible: false) ]
       │      │
       │      ├─ 点击 Block Tool 内菜单 ──► [ 触发 HIDE_DRAG_HANDLE 通知 ] ──► 隐藏拖拽句柄
       │      │
       │      └─ 点击拖拽句柄 (isDragging: true) ──► [ 状态变更: 隐藏 (visible: false) ]
```
