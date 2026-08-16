# DocEditor 快速接入与验证指南

**特征**: `023-export-doc-editor` | **日期**: 2026-08-16 | **需求文件**: [spec.md](spec.md)

## 1. 快速接入示例

在宿主 React 应用或组件中使用导出的 `DocEditor` 组件：

```tsx
import React, { useRef, useState } from 'react';
import { DocEditor, type DocEditorRef, type DocumentNode } from '@/components/DocEditor';

export const DemoPage: React.FC = () => {
  const editorRef = useRef<DocEditorRef>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [markdownText, setMarkdownText] = useState<string>('# 示例文档\n欢迎使用DocEditor');

  const handleUploadImage = async (file: File): Promise<string> => {
    // 模拟上传逻辑或调用宿主 OSS/图床 SDK
    console.log('正在上传图片:', file.name);
    return 'https://via.placeholder.com/600x400';
  };

  return (
    <div style={{ padding: 24, background: theme === 'dark' ? '#1f1f1f' : '#ffffff' }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          切换宿主主题（当前：{theme}）
        </button>
        <button onClick={() => editorRef.current?.focus()}>清空并聚焦</button>
        <button onClick={() => alert(editorRef.current?.getMarkdown())}>获取 Markdown</button>
      </div>

      <DocEditor
        ref={editorRef}
        value={markdownText}
        theme={theme}
        onChange={(docNode: DocumentNode, markdown: string) => {
          setMarkdownText(markdown);
        }}
        onUploadImage={handleUploadImage}
        onFocus={() => console.log('Editor focused')}
        onBlur={() => console.log('Editor blurred')}
      />
    </div>
  );
};
```

---

## 2. 验证与测试步骤

### 验证点 1：干净接入与导出验证
1. 打开工程代码，确保可直接通过 `import { DocEditor } from '@/components/DocEditor'` 导入组件。
2. 检查 TS 类型导出无遗漏或报错，运行 `npm run build` 或 TypeScript 类型检查校验导出完整性。

### 验证点 2：夜间模式受控控制验证
1. 在 UI 页面中观察 `DocEditor` 工具栏，确认无任何夜间模式切换按钮。
2. 通过宿主按钮切换 `theme="dark"` / `theme="light"`，观察编辑器的文字颜色、背景颜色和选区样式是否正常随宿主主题进行顺滑切换。

### 3. 验证点 3：对接 Hooks & 事件验证
1. 点击编辑区触发 `onFocus`，失焦触发 `onBlur`。
2. 拖入或粘贴图片文件，触发自定义 `onUploadImage` 异步方法并成功渲染返回的图片 URL。
3. 检查通过 `editorRef.current` 调用的命令式方法是否准确有效。
