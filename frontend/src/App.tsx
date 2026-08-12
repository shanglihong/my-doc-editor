import { useRef, useState } from 'react';
import { DocEditor } from './components/DocEditor';
import type { DocEditorRef } from './components/DocEditor';

export function App() {
  const editorRef = useRef<DocEditorRef>(null);
  const [markdown, setMarkdown] = useState('');

  return (
    <div style={{ padding: '32px 16px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ maxWidth: 900, margin: '0 auto 24px auto' }}>
        <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 8px 0' }}>
          个人知识库文档编辑器预览
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>阶段 2 核心渲染基础设施建立完成</p>
      </header>

      <DocEditor
        ref={editorRef}
        placeholder="输入 '/' 唤起快捷菜单..."
        onChange={(_doc, md) => setMarkdown(md)}
      />

      <section style={{ maxWidth: 900, margin: '24px auto 0 auto', background: '#fff', padding: 20, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>Markdown 输出:</h3>
        <pre style={{ background: '#f1f5f9', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
          {markdown || '(当前为空白文档)'}
        </pre>
      </section>
    </div>
  );
}

export default App;
