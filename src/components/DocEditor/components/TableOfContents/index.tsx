import React, { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import { ListTree, ChevronsLeft } from 'lucide-react';
import styles from './TableOfContents.module.css';
import { useDocEditorTOC } from '../../hooks/useDocEditorTOC';

export interface TableOfContentsProps {
  editor: Editor | null;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ editor }) => {
  const { items, activeId, scrollToHeading } = useDocEditorTOC(editor);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className={`${styles.tocContainer} ${isExpanded ? styles.tocContainerExpanded : ''}`}
    >
      <button
        type="button"
        className={styles.tocIconButton}
        title={isExpanded ? '收起文档大纲' : '展开文档大纲'}
        onClick={toggleExpand}
      >
        {isExpanded ? <ChevronsLeft size={18} /> : <ListTree size={18} />}
      </button>

      {isExpanded && (
        <div className={styles.tocPanel}>
          {items.length === 0 ? (
            <div className={styles.tocItem} style={{ color: '#94a3b8', cursor: 'default' }}>
              <span className={styles.tocItemText}>无标题大纲</span>
            </div>
          ) : (
            <div className={styles.tocList}>
              {items.map((item) => {
                const levelClass =
                  item.level === 1
                    ? styles.tocItemLevel1
                    : item.level === 2
                    ? styles.tocItemLevel2
                    : styles.tocItemLevel3;

                const isActive = item.id === activeId;

                return (
                  <div
                    key={item.id}
                    className={`${styles.tocItem} ${levelClass} ${isActive ? styles.tocItemActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToHeading(item.pos);
                    }}
                  >
                    <span className={styles.tocItemText}>{item.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
