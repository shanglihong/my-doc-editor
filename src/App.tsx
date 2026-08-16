import { useRef } from 'react';
import { DocEditor } from './components/DocEditor';
import type { DocEditorRef } from './components/DocEditor';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

export function App() {
  const editorRef = useRef<DocEditorRef>(null);

  return (
    <div className="appContainer">
      <DocEditor
        ref={editorRef}
        placeholder="输入 '/' 唤起快捷菜单..."
      />
      <ThemeToggle />
    </div>
  );
}

export default App;
