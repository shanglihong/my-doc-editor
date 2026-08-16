# DocEditor 标准文档编辑器组件

`DocEditor` 是一个基于 TipTap 引擎的高性能、可扩展富文本与块级文档编辑器组件，支持 Markdown 双向转换、丰富块级扩展以及完全代码受控的主题控制。

## 基于 GitHub 仓库安装与导入

宿主应用（第三方工程）可以直接通过 GitHub 链接将本项目作为依赖包进行安装与消费。

### 1. 宿主工程安装命令

在宿主 React 项目的根目录下执行以下命令：

```bash
# 使用 npm
npm install git+https://github.com/shanglihong/my-doc-editor.git

# 或使用 yarn
yarn add git+https://github.com/shanglihong/my-doc-editor.git

# 或使用 pnpm
pnpm add git+https://github.com/shanglihong/my-doc-editor.git
```

也可以直接在宿主项目的 `package.json` 的 `dependencies` 中添加：

```json
{
  "dependencies": {
    "my-doc-editor": "git+https://github.com/shanglihong/my-doc-editor.git#main"
  }
}
```

### 2. 宿主工程代码引入

在宿主项目的组件中引入 `DocEditor` 组件与其样式文件：

```tsx
import { 
  DocEditor, 
  type DocEditorRef, 
  type DocEditorProps, 
  type DocumentNode, 
  type EditorTheme 
} from 'my-doc-editor';

// 引入组件样式
import 'my-doc-editor/dist/my-doc-editor.css';
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

---

## 主题控制 (Dark Mode)

`DocEditor` 内部集成了完整的暗色夜间模式。只需在组件上配置 `theme="dark"` 即可完全生效：

```tsx
<DocEditor theme="dark" />
```

编辑器及其浮动工具栏、斜杠快捷菜单、调色板与各弹窗组件均会完美呈现暗色样式，无需强制在宿主根节点 `html` 上增加全局属性。

---

## Draw.io 静态资源与 Embed 说明

本项目集成了 draw.io 流程图/架构图编辑扩展，具备**零配置全自动离线感知与平滑降级**支持：

### 1. 零配置与防 SPA 拦截智能探针
在调用方项目中渲染 `<DocEditor />` 组件时，无需传递任何画图配置参数：
- **精准探针检测**：组件库会自动发起 HTTP 请求探测调用方的离线主程序文件 `/drawio/drawio-app.html`；
- **防 SPA 误判过滤**：探针内置了内容特征校验，能自动过滤 Vite / Webpack DevServer 在单页应用（SPA）开发模式下将缺失资源 404 误重定向为宿主 `index.html` 的假 200 响应；
- **内置桥接框架**：当确认离线包就绪（探测到 `/drawio/drawio-app.html`）时，组件库使用打包在 JS 内部的桥接框架无缝启动离线画图，调用方无需在 `public/` 根目录下手动放置额外的 HTML 文件；
- **在线平滑降级**：若未检测到离线资源包，组件库会自动平滑降级使用官方在线画图服务（`https://embed.diagrams.net`），点击画图依然开箱即用。

### 2. 私有化/完全离线包部署模式 (npx CLI)
若宿主工程需要在**完全无网/私有化环境**下运行画图，宿主只需在其项目根目录下运行如下一条 CLI 命令即可：

```bash
# 一键拉取并部署离线 Draw.io 静态资源包到宿主 public/ 目录
npx setup-drawio
```

运行完成后，直接使用 `<DocEditor />` 即可自动畅享完全离线的画图功能。





