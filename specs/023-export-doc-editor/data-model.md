# 数据模型与接口结构设计: DocEditor 标准组件

**特征**: `023-export-doc-editor` | **日期**: 2026-08-16 | **需求文件**: [spec.md](spec.md)

## 1. 类型体系与数据结构

### 1.1 主属性接口 (`DocEditorProps`)

```typescript
export type EditorTheme = 'light' | 'dark' | 'auto';

export interface DocEditorProps {
  /** 编辑器文档内容 (Markdown 字符串 或 JSON 结构) */
  value?: string | DocumentNode;
  
  /** 内容变更回调 */
  onChange?: (docNode: DocumentNode, markdown: string) => void;
  
  /** 标题变更回调 (当第一行为 title 节点时) */
  onTitleChange?: (title: string) => void;
  
  /** 是否只读模式，默认为 false */
  readOnly?: boolean;
  
  /** 主题样式模式，支持 'light' | 'dark' | 'auto'，默认为 'light' */
  theme?: EditorTheme;
  
  /** 标题占位文本，默认为 '请输入文档标题' */
  titlePlaceholder?: string;
  
  /** 正文内容占位文本，默认为 '输入 "/" 唤起快捷菜单...' */
  placeholder?: string;
  
  /** 容器额外 CSS 类名 */
  className?: string;
  
  /** 聚焦事件回调 */
  onFocus?: (event: FocusEvent) => void;
  
  /** 失焦事件回调 */
  onBlur?: (event: FocusEvent) => void;
  
  /** 光标/选区变更回调 */
  onSelectionChange?: (selection: { empty: boolean; from: number; to: number }) => void;
  
  /** 图片上传处理钩子 (传入 File，异步返回服务端可访问的 Image URL) */
  onUploadImage?: (file: File) => Promise<string>;
}
```

---

### 1.2 命令式引用 Handle (`DocEditorRef`)

```typescript
export interface DocEditorRef {
  /** 使编辑器获取焦点 */
  focus: () => void;
  
  /** 使编辑器失去焦点 */
  blur: () => void;
  
  /** 清空编辑器当前所有内容 */
  clearContent: () => void;
  
  /** 获取当前编辑器的 Markdown 字符串 */
  getMarkdown: () => string;
  
  /** 获取当前编辑器的 AST JSON 结构 */
  getJSON: () => DocumentNode;
  
  /** 动态设置编辑器的 Markdown 内容 */
  setMarkdown: (content: string) => void;
  
  /** 检查当前编辑器是否为空 */
  isEmpty: () => boolean;
}
```

---

### 1.3 核心 AST 文档模型 (`DocumentNode` & `BlockNode`)

```typescript
export interface BlockNode {
  type: string;
  attrs?: Record<string, any>;
  content?: BlockNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export interface DocumentNode {
  type: 'doc';
  version?: string;
  content: BlockNode[];
}
```

---

## 2. 状态与主题数据流

```mermaid
flowchart TD
    HostApp[宿主应用 Host App] -- "1. 传入 props (value, theme, callbacks)" --> DocEditor[DocEditor 核心组件]
    DocEditor -- "2. 监听 theme 变更" --> ThemeEngine[Theme Switcher Style Binding]
    ThemeEngine -- "3. 绑定至根节点" --> DOMContainer[<div data-theme="light/dark">]
    
    UserAction[用户编辑操作] -- "4. 触发 Editor Events" --> TipTapInstance[TipTap Core Engine]
    TipTapInstance -- "5. 触发 onFocus / onBlur / onChange" --> HostApp
    TipTapInstance -- "6. 拖拽/粘贴图片" --> UploadHook{是否配置 onUploadImage?}
    UploadHook -- "是" --> CustomUpload[调用宿主 onUploadImage(file)]
    UploadHook -- "否" --> FallbackUpload[转换为 Base64 / Local Blob URL]
    CustomUpload -- "返回 Image URL" --> TipTapInstance
    FallbackUpload -- "返回 Base64 URL" --> TipTapInstance
```

---

## 3. 校验规则

1. **Theme 属性规范**：`theme` 仅接受 `'light'`、`'dark'` 或 `'auto'`，非法值降级至 `'light'`。
2. **Read-Only 模式约束**：当 `readOnly={true}` 时，编辑器所有浮动菜单、气泡菜单及图片/块选择能力均处于不可编辑状态。
3. **媒体上传钩子超时与错误处理**：`onUploadImage` 若 Promise reject，组件内部应拦截该错误并呈现用户友好提示，避免崩溃。
