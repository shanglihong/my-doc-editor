# 组件接口与数据契约: DocEditor Title 扩展

## DocEditor组件 Props 契约更新

```typescript
export interface DocEditorProps {
  /** 文档初始数据或内容 (包含标题或纯文本/Markdown) */
  value?: string | DocumentNode;
  
  /** 内容或标题变更时的回调函数 */
  onChange?: (value: string) => void;
  
  /** 标题专属变更回调 (可选, 当需要单独订阅标题变化时) */
  onTitleChange?: (title: string) => void;

  /** 标题占位符文案 */
  titlePlaceholder?: string;
  
  /** 正文占位符文案 */
  placeholder?: string;
  
  /** 是否只读模式 */
  readOnly?: boolean;
  
  /** 自定义 CSS 类名 */
  className?: string;
}
```

## DocEditor Ref 方法契约更新

```typescript
export interface DocEditorRef {
  /** 获取当前标题纯文本 */
  getTitle: () => string;
  
  /** 动态设置当前标题 */
  setTitle: (title: string) => void;
  
  /** 获取全量 Markdown 数据 (首行为 # Title) */
  getMarkdown: () => string;
  
  /** 获取全量 JSON 节点数据 (首个节点为 Title 节点) */
  getJSON: () => object;
  
  /** 清空正文内容 (保留标题节点) */
  clearContent: () => void;
}
```

## Markdown 序列化 / 反序列化契约

1. **导出 Markdown 格式契约**:
   ```markdown
   # 文档标题文本

   正文段落第一段...
   ```

2. **解析 Markdown 格式契约**:
   - 若 Markdown 输入以 `# [标题文本]` 开头，则将其解析填入内置 `title` 节点。
   - 若 Markdown 输入不包含 `#` 开头，系统将第一行解析为 `title` 节点内容，其余解析为正文块。
