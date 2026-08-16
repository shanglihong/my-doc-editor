# DocEditor 标准文档编辑器组件

`DocEditor` 是一个基于 TipTap 引擎的高性能、可扩展富文本与块级文档编辑器组件，支持 Markdown 双向转换、丰富块级扩展以及完全代码受控的主题控制。

## 安装与引入

```tsx
import { 
  DocEditor, 
  type DocEditorRef, 
  type DocEditorProps, 
  type DocumentNode, 
  type EditorTheme 
} from '@/components/DocEditor';
```

## 快速使用

```tsx
import React, { useRef, useState } from 'react';
import { DocEditor, type DocEditorRef } from '@/components/DocEditor';

export const MyEditorApp = () => {
  const editorRef = useRef<DocEditorRef>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>

      <DocEditor
        ref={editorRef}
        value="# 欢迎使用 DocEditor"
        theme={theme}
        onChange={(docNode, markdown) => {
          console.log('Markdown:', markdown);
        }}
        onUploadImage={async (file) => {
          // 自定义异步图片上传
          return 'https://example.com/uploaded-image.png';
        }}
      />
    </div>
  );
};
```

## API 说明

### Component Props (`DocEditorProps`)

| 属性名 | 类型 | 默认值 | 描述 |
|---|---|---|---|
| `value` | `string \| DocumentNode` | `""` | 编辑器内容 (支持 Markdown 文本或 AST JSON 对象) |
| `onChange` | `(docNode: DocumentNode, markdown: string) => void` | `undefined` | 内容变更时的回调 |
| `onTitleChange` | `(title: string) => void` | `undefined` | 第一行标题变更时的回调 |
| `readOnly` | `boolean` | `false` | 是否开启只读不可编辑模式 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 代码受控主题模式 |
| `titlePlaceholder` | `string` | `'请输入文档标题'` | 第一行标题占位文本 |
| `placeholder` | `string` | `'输入 "/" 唤起快捷菜单...'` | 正文区占位文本 |
| `className` | `string` | `""` | 容器根节点扩展 class |
| `onFocus` | `(event: FocusEvent) => void` | `undefined` | 获得焦点时的回调 |
| `onBlur` | `(event: FocusEvent) => void` | `undefined` | 失去焦点时的回调 |
| `onSelectionChange` | `(selection: { empty: boolean; from: number; to: number }) => void` | `undefined` | 选择区域或光标位置变更时的回调 |
| `onUploadImage` | `(file: File) => Promise<string>` | `undefined` | 拖拽/粘贴图片时的自定义上传 Hook |

### Ref Handles (`DocEditorRef`)

- `focus()`: 聚焦编辑器
- `blur()`: 使编辑器失去焦点
- `clearContent()`: 清空正文内容
- `getMarkdown()`: 获取当前文档的 Markdown 文本
- `getJSON()`: 获取当前文档的 AST JSON 对象
- `setMarkdown(content: string)`: 重置文档 Markdown 内容
- `isEmpty()`: 判断正文是否为空
