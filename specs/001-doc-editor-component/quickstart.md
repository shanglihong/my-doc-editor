# 快速上手与验证指南：个人知识库文档编辑器前端组件

**功能规范文件**: [spec.md](./spec.md)
**API 契约文件**: [contracts/editor-api.md](./contracts/editor-api.md)
**创建时间**: 2026-08-12

可通过根目录 `Makefile` 快捷管理或手动安装依赖：

```bash
# 方式一：快捷使用 Makefile (推荐)
make install   # 安装前端依赖
make dev       # 启动开发服务器

# 方式二：手动进入 frontend 目录安装
cd frontend
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit tiptap-markdown @excalidraw/excalidraw lucide-react --legacy-peer-deps
```

---

## 2. 基础使用示例

```tsx
import React, { useRef, useState } from 'react';
import { DocEditor, DocEditorRef } from './components/DocEditor';

export const KnowledgeBaseApp: React.FC = () => {
  const editorRef = useRef<DocEditorRef>(null);
  const [markdownOutput, setMarkdownOutput] = useState('');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>个人知识库编辑器</h1>
      
      {/* 嵌入文档编辑器组件 */}
      <DocEditor
        ref={editorRef}
        placeholder="输入 '/' 唤起快捷菜单，或直接输入文字..."
        onChange={(doc, markdown) => {
          setMarkdownOutput(markdown);
        }}
      />

      <div style={{ marginTop: 24 }}>
        <h3>实时 Markdown 转换输出：</h3>
        <pre>{markdownOutput}</pre>
      </div>
    </div>
  );
};
```

---

## 3. 功能验证场景点核查

在开发完成后，可通过以下步骤进行验证：

1. **斜杠菜单与基本块**：输入 `/` 确保出现悬浮菜单，顺利插入标题、列表、表格和代码块。
2. **气泡格式工具栏**：选中文本，核对气泡工具栏中的字号选择、加粗、斜体、下划线、删除线及高亮调色盘。
3. **嵌套高亮容器 (Callout)**：插入高亮块，点击更换 Icon/Emoji 及 8+ 主题色板；在框内按下 `/` 插入嵌套代码块和表格。
4. **Excalidraw 嵌入画图**：插入画图块，点击编辑唤起 Excalidraw 面板绘制流程图与 UML，退出后查看矢量图表渲染。
5. **块级拖拽重排**：悬浮在块左侧，拖动拖拽把手重排块，观察蓝色放置指示线并验证拖入/拖出 Callout。
6. **Markdown 导出**：点击导出或查看实时 markdown 输出，验证格式无损。
