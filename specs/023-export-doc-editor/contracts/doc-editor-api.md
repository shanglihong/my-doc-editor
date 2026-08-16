# 接口契约规范: DocEditor 公开 API

**特征**: `023-export-doc-editor` | **日期**: 2026-08-16 | **需求文件**: [spec.md](../spec.md)

## 1. 导出模块与入口规范

宿主工程或包使用者通过以下方式引用 `DocEditor` 及其相关类型：

```typescript
import { 
  DocEditor, 
  type DocEditorProps, 
  type DocEditorRef, 
  type DocumentNode, 
  type BlockNode,
  type EditorTheme 
} from '@/components/DocEditor';
```

---

## 2. 详细接口描述

### 2.1 组件属性 (`DocEditorProps`)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|---|---|---|---|---|
| `value` | `string \| DocumentNode` | `""` | 否 | 编辑器的初始内容或受控内容（支持 Markdown 字符串或 AST JSON） |
| `onChange` | `(docNode: DocumentNode, markdown: string) => void` | `undefined` | 否 | 文档内容变动回调函数 |
| `onTitleChange` | `(title: string) => void` | `undefined` | 否 | 文档标题变动回调函数 |
| `readOnly` | `boolean` | `false` | 否 | 是否开启只读不可编辑模式 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 否 | 代码指定的夜间/明亮主题模式 |
| `titlePlaceholder` | `string` | `'请输入文档标题'` | 否 | 第一行标题占位提示文本 |
| `placeholder` | `string` | `'输入 "/" 唤起快捷菜单...'` | 否 | 正文内容占位提示文本 |
| `className` | `string` | `""` | 否 | 自定义根容器外层 class 名称 |
| `onFocus` | `(event: FocusEvent) => void` | `undefined` | 否 | 编辑器获得焦点时的回调 |
| `onBlur` | `(event: FocusEvent) => void` | `undefined` | 否 | 编辑器失去焦点时的回调 |
| `onSelectionChange` | `(info: { empty: boolean; from: number; to: number }) => void` | `undefined` | 否 | 编辑器光标或选择区域变更回调 |
| `onUploadImage` | `(file: File) => Promise<string>` | `undefined` | 否 | 自定义异步图片上传处理 Hook |

---

### 2.2 Ref 开放方法 (`DocEditorRef`)

通过 `useRef<DocEditorRef>(null)` 绑定到 `DocEditor` 之后支持调用的方法：

- `focus(): void`: 强制将焦点定位至编辑器。
- `blur(): void`: 取消编辑器的当前焦点。
- `clearContent(): void`: 清空编辑器所有内容（保留默认标题节点）。
- `getMarkdown(): string`: 提取当前编辑器的 Markdown 源码文本。
- `getJSON(): DocumentNode`: 提取当前编辑器的 AST 结构 JSON 对象。
- `setMarkdown(content: string): void`: 覆盖设置当前编辑器的内容。
- `isEmpty(): boolean`: 返回当前文档正文是否为空。

---

## 3. UI 按钮移除限制契约

- 编辑器的 **Top Toolbar**、**Floating Drag Menu**、**Bubble Format Menu** 等界面元素中**禁止**包含任何切换主题/夜间模式的交互按钮。
- 组件必须完全尊重传入的 `theme` prop 行为，不允许在组件内部私有持久化（如 `localStorage`）覆盖 `theme` 属性。
