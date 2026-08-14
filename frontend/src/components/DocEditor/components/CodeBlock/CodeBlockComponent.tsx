import React, { useState, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Copy, Check } from 'lucide-react';
import styles from './CodeBlock.module.css';
import { getActiveToolbarInfo, hoverStackManager } from '../../utils/toolbarPriority';
import { FloatingBlockTool } from '../FloatingBlockTool';

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

export const CodeBlockComponent: React.FC<NodeViewProps> = (props) => {
  const { node, deleteNode, editor, getPos, updateAttributes, selected } = props;
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearHideTimeout();
    setIsHovered(true);
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        hoverStackManager.register({
          id: `codeblock-${pos}`,
          type: 'codeBlock',
          depth: 2,
          nodePos: pos,
        });
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    clearHideTimeout();
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (
      relatedTarget &&
      (relatedTarget.closest('[class*="floatingBlockTool"]') ||
        relatedTarget.closest('[class*="unifiedToolbar"]') ||
        relatedTarget.closest('[class*="popover"]'))
    ) {
      return;
    }
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (typeof pos === 'number') {
        hoverStackManager.unregister(`codeblock-${pos}`, 200);
      }
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

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
  const isEditable = editor?.isEditable;
  const activeToolbar = getActiveToolbarInfo(editor);
  const showFloatingToolbar =
    isEditable &&
    (isHovered || selected) &&
    (activeToolbar.type === 'codeBlock' || selected);
  console.log("activeToolbar", activeToolbar.type + " " + isHovered)
  return (
    <NodeViewWrapper
      data-type="codeBlock"
      className={styles.codeBlockWrapper}
      style={{ position: 'relative', overflow: 'visible' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showFloatingToolbar && (
        <FloatingBlockTool
          editor={editor}
          blockType="codeBlock"
          getPos={getPos}
          isLocalPositioning={true}
          onDeleteBlock={deleteNode}
        />
      )}

      {/* 代码块原有的 Header：保持语言选择与复制代码功能 */}
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
