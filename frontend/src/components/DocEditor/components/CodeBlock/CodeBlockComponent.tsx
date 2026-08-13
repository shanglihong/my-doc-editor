import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Copy, Check } from 'lucide-react';
import styles from '../../DocEditor.module.css';

const LANGUAGES = [
  { label: 'Auto (自动)', value: 'plaintext' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'SQL', value: 'sql' },
  { label: 'Bash / Shell', value: 'bash' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'YAML', value: 'yaml' },
];

export const CodeBlockComponent: React.FC<NodeViewProps> = ({
  node,
  editor,
  updateAttributes,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let textToCopy = '';

    if (editor) {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const selectedText = editor.state.doc.textBetween(from, to, '\n');
        if (selectedText) {
          textToCopy = selectedText;
        }
      }
    }

    if (!textToCopy) {
      textToCopy = node.textContent;
    }

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentLanguage = node.attrs?.language || 'plaintext';

  return (
    <NodeViewWrapper className={styles.codeBlockWrapper}>
      <div className={styles.codeBlockHeader} contentEditable={false}>
        <div className={styles.codeBlockLeft}>
          <select
            className={styles.codeBlockSelect}
            value={currentLanguage}
            onChange={(e) => updateAttributes({ language: e.target.value })}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.codeBlockActions}>
          <button
            type="button"
            className={styles.codeBlockIconBtn}
            onClick={handleCopy}
            title={copied ? '已复制' : '复制代码'}
          >
            {copied ? <Check size={14} className={styles.codeCopySuccess} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      <pre className={styles.codeBlockContainer}>
        <NodeViewContent className={`language-${currentLanguage}`} />
      </pre>
    </NodeViewWrapper>
  );
};
