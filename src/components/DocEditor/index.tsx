import { forwardRef, useRef, useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import styles from './DocEditor.module.css';
import type { DocEditorProps, DocEditorRef, DocumentNode, BlockNode } from './types';
import { hoverStackManager } from './utils/toolbarPriority';
import {
  handleEditorPaste,
  handleEditorCopy,
  handleEditorMouseOver,
  handleEditorMouseLeave,
} from './utils/editorDOMEvents';
import { useDocEditorExtensions } from './hooks/useDocEditorExtensions';
import { useDocEditorDragAndDrop } from './hooks/useDocEditorDragAndDrop';
import { useDocEditorModals } from './hooks/useDocEditorModals';
import { useDocEditorRef } from './hooks/useDocEditorRef';
import { DocEditorOverlays } from './components/DocEditorOverlays';

export * from './types';
export * from './utils/defaultTheme';

declare module '@tiptap/core' {
  interface Storage {
    markdown?: {
      getMarkdown: () => string;
    };
  }
}

export const DocEditor = forwardRef<DocEditorRef, DocEditorProps>(
  (
    {
      value,
      onChange,
      onTitleChange,
      readOnly = false,
      titlePlaceholder = '请输入文档标题',
      placeholder: _placeholder = '输入 "/" 唤起快捷菜单，或直接输入内容...',
      theme = 'light',
      className = '',
      onFocus,
      onBlur,
      onSelectionChange,
      onUploadImage,
      showToc = true,
    },
    ref
  ) => {
    // 使用 ref 延迟绑定 DragNodeChange 回调以支持 Hook 顺序关系
    const dndHandleRef = useRef<((data: any) => void) | null>(null);
    const handleDragNodeChange = useCallback((data: any) => {
      dndHandleRef.current?.(data);
    }, []);

    // 1. 组装 TipTap Extensions
    const extensions = useDocEditorExtensions({
      titlePlaceholder,
      placeholder: _placeholder,
      onUploadImage,
      onDragNodeChange: handleDragNodeChange,
    });

    // 2. 创建 TipTap Editor 实例
    const editor = useEditor({
      editable: !readOnly,
      extensions,
      content: typeof value === 'string' ? value : undefined,
      editorProps: {
        handlePaste: handleEditorPaste,
        handleDOMEvents: {
          copy: handleEditorCopy,
          mouseover: handleEditorMouseOver,
          mouseleave: handleEditorMouseLeave,
        },
      },
      onFocus: ({ event }) => {
        onFocus?.(event as FocusEvent);
      },
      onBlur: ({ event }) => {
        onBlur?.(event as FocusEvent);
      },
      onSelectionUpdate: ({ editor: currentEditor }) => {
        if (onSelectionChange) {
          const { empty, from, to } = currentEditor.state.selection;
          onSelectionChange({ empty, from, to });
        }
      },
      onUpdate: ({ editor: currentEditor }) => {
        if (onTitleChange) {
          const firstNode = currentEditor.state.doc.firstChild;
          const titleText = firstNode && firstNode.type.name === 'title' ? firstNode.textContent : '';
          onTitleChange(titleText);
        }
        if (!onChange) return;
        const json = currentEditor.getJSON();
        const markdown = currentEditor.storage.markdown?.getMarkdown() || currentEditor.getText();

        const docNode: DocumentNode = {
          type: 'doc',
          version: '1.0',
          content: (json.content || []) as unknown as BlockNode[],
        };

        onChange(docNode, markdown);
      },
    });

    // 3. 绑定 DragAndDrop, Modals 与 ImperativeRef Hooks
    const dnd = useDocEditorDragAndDrop(editor);
    dndHandleRef.current = dnd.handleDragNodeChange;

    const modals = useDocEditorModals(editor);
    useDocEditorRef(ref, editor);

    const [isTocExpanded, setIsTocExpanded] = useState(false);

    const activeThemeAttr = theme === 'auto' ? undefined : theme;

    return (
      <div
        data-theme={activeThemeAttr}
        className={`${styles.editorContainer} ${isTocExpanded ? styles.hasExpandedToc : ''} ${className}`}
        onClick={(e) => {
          if (
            (e.target === e.currentTarget || (e.target as HTMLElement).classList?.contains(styles.editorContent)) &&
            editor &&
            !readOnly
          ) {
            const docSize = editor.state.doc.content.size;
            const lastNode = editor.state.doc.lastChild;
            if (lastNode && lastNode.type.name !== 'paragraph') {
              editor
                .chain()
                .focus()
                .insertContentAt(docSize, { type: 'paragraph' })
                .setTextSelection(docSize + 1)
                .run();
            } else {
              editor.chain().focus('end').run();
            }
          }
        }}
        onMouseLeave={() => {
          dnd.setDragState((prev) => ({ ...prev, visible: false }));
          hoverStackManager.setExclusiveTarget(null, 250);
        }}
        onDragOver={dnd.handleDragOver}
        onDragLeave={dnd.handleDragLeave}
        onDrop={dnd.handleDrop}
      >
        <EditorContent editor={editor} className={styles.editorContent} />
        <DocEditorOverlays
          editor={editor}
          styles={styles}
          dragState={dnd.dragState}
          setDragState={dnd.setDragState}
          typeMenuState={dnd.typeMenuState}
          setTypeMenuState={dnd.setTypeMenuState}
          dropIndicatorState={dnd.dropIndicatorState}
          setDropIndicatorState={dnd.setDropIndicatorState}
          isSlashMenuOpen={dnd.isSlashMenuOpen}
          drawioModalState={modals.drawioModalState}
          setDrawioModalState={modals.setDrawioModalState}
          handleSaveDrawIO={modals.handleSaveDrawIO}
          showToc={showToc}
          isTocExpanded={isTocExpanded}
          onTocExpandChange={setIsTocExpanded}
        />
      </div>
    );
  }
);

DocEditor.displayName = 'DocEditor';
