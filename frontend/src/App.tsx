import { useRef, useState } from 'react';
import { DocEditor } from './components/DocEditor';
import type { DocEditorRef } from './components/DocEditor';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

export function App() {
  const editorRef = useRef<DocEditorRef>(null);
  const [markdown, setMarkdown] = useState('');

  return (
    <div className="appContainer">
      <DocEditor
        ref={editorRef}
        placeholder="输入 '/' 唤起快捷菜单..."
        onChange={(_doc, md) => setMarkdown(md)}
      />

      <section style={{ maxWidth: 900, margin: '24px auto 0 auto', background: 'var(--de-bg-body, #fff)', padding: 20, borderRadius: 12, border: '1px solid var(--de-border-color, #e2e8f0)', color: 'var(--de-text-main, #0f172a)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--de-text-main)' }}>Markdown 输出:</h3>
        <pre style={{ background: 'var(--de-bg-hover, #f1f5f9)', color: 'var(--de-text-main, #0f172a)', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
          {markdown || '(当前为空白文档)'}
        </pre>
      </section>

      <ThemeToggle />
    </div>
  );
}

export default App;
