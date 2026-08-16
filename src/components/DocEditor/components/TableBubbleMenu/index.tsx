import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { CellSelection } from '@tiptap/pm/tables';
import { PaintBucket } from 'lucide-react';
import styles from './TableBubbleMenu.module.css';
import { calculateSubMenuPosition } from '../../utils/floatingPosition';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { FloatingBlockTool } from '../FloatingBlockTool';
import {
  RowInsertAboveIcon,
  RowInsertBelowIcon,
  ColumnInsertLeftIcon,
  ColumnInsertRightIcon,
  RowDeleteIcon,
  ColumnDeleteIcon,
  CellMergeIcon,
  CellSplitIcon,
} from './TableIcons';

export interface TableBubbleMenuProps {
  editor: Editor | null;
  isDragging?: boolean;
  isTypeMenuOpen?: boolean;
}

export const TableBubbleMenu: React.FC<TableBubbleMenuProps> = ({
  editor,
  isDragging,
  isTypeMenuOpen,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});

  // 监听全局隐藏事件或组件失焦时自动闭合调色板
  React.useEffect(() => {
    const handleResetPicker = () => {
      setShowColorPicker(false);
    };

    const handleCloseOthers = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.source !== 'TableBubbleMenu') {
        setShowColorPicker(false);
      }
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleResetPicker);
    window.addEventListener('CLOSE_OTHER_SUBMENUS', handleCloseOthers);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleResetPicker);
      window.removeEventListener('CLOSE_OTHER_SUBMENUS', handleCloseOthers);
    };
  }, []);

  if (!editor) return null;

  // 校验当前 Selection 是否聚焦在 Table 内部
  let isCellFocused = false;
  let rowCount = 0;
  let colCount = 0;

  if (editor.isActive('table')) {
    const { selection } = editor.state;
    let depth = selection.$anchor.depth;
    while (depth > 0) {
      const node = selection.$anchor.node(depth);
      if (node.type.name === 'table') {
        isCellFocused = true;
        rowCount = node.childCount;
        if (rowCount > 0) {
          const firstRow = node.child(0);
          colCount = 0;
          firstRow.forEach((cell) => {
            colCount += cell.attrs.colspan || 1;
          });
        }
        break;
      }
      depth--;
    }
  }

  const canDeleteRow = isCellFocused && rowCount > 1;
  const canDeleteCol = isCellFocused && colCount > 1;
  const canMerge = editor.can().mergeCells();
  const canSplit = editor.can().splitCell();

  const handleSetCellBg = (color: string) => {
    if (!editor || !isCellFocused) return;
    const { state, view } = editor;
    const { selection } = state;
    const tr = state.tr;
    const bgVal = color === 'transparent' ? null : color;

    if (selection instanceof CellSelection) {
      let hasChanged = false;
      selection.forEachCell((node, pos) => {
        if (node.attrs.backgroundColor !== bgVal) {
          tr.setNodeMarkup(pos, null, {
            ...node.attrs,
            backgroundColor: bgVal,
          });
          hasChanged = true;
        }
      });
      if (hasChanged) {
        view.dispatch(tr);
      }
    } else {
      let depth = selection.$anchor.depth;
      while (depth > 0) {
        const node = selection.$anchor.node(depth);
        if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
          const pos = selection.$anchor.before(depth);
          tr.setNodeMarkup(pos, null, {
            ...node.attrs,
            backgroundColor: bgVal,
          });
          view.dispatch(tr);
          break;
        }
        depth--;
      }
    }

    setShowColorPicker(false);
  };

  const getSelectedCellBg = (): string | undefined => {
    if (!isCellFocused || !editor) return undefined;
    const { selection } = editor.state;
    if (selection instanceof CellSelection) {
      let firstBg: string | undefined = undefined;
      selection.forEachCell((node) => {
        if (firstBg === undefined && node.attrs.backgroundColor) {
          firstBg = node.attrs.backgroundColor;
        }
      });
      return firstBg;
    }
    let depth = selection.$anchor.depth;
    while (depth > 0) {
      const node = selection.$anchor.node(depth);
      if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
        return node.attrs.backgroundColor || undefined;
      }
      depth--;
    }
    return undefined;
  };

  const handleDeleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  return (
    <FloatingBlockTool
      editor={editor}
      blockType="table"
      isDragging={isDragging}
      isTypeMenuOpen={isTypeMenuOpen}
      onDeleteBlock={handleDeleteTable}
    >
      {/* 插入行列组：在未点击单元格时自动置灰 */}
      <div className={styles.menuGroup}>
        <button
          className={styles.menuBtn}
          disabled={!isCellFocused}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => isCellFocused && editor.chain().focus().addRowBefore().run()}
          title={isCellFocused ? '在上方插入行' : '请先点击单元格聚焦后再操作'}
        >
          <RowInsertAboveIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          disabled={!isCellFocused}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => isCellFocused && editor.chain().focus().addRowAfter().run()}
          title={isCellFocused ? '在下方插入行' : '请先点击单元格聚焦后再操作'}
        >
          <RowInsertBelowIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          disabled={!isCellFocused}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => isCellFocused && editor.chain().focus().addColumnBefore().run()}
          title={isCellFocused ? '在左侧插入列' : '请先点击单元格聚焦后再操作'}
        >
          <ColumnInsertLeftIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          disabled={!isCellFocused}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => isCellFocused && editor.chain().focus().addColumnAfter().run()}
          title={isCellFocused ? '在右侧插入列' : '请先点击单元格聚焦后再操作'}
        >
          <ColumnInsertRightIcon size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 删除行列组 */}
      <div className={styles.menuGroup}>
        <button
          className={`${styles.menuBtn} ${styles.dangerBtn}`}
          disabled={!isCellFocused || !canDeleteRow}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (isCellFocused && canDeleteRow) {
              editor.chain().focus().deleteRow().run();
            }
          }}
          title={
            !isCellFocused
              ? '请先点击单元格聚焦后再操作'
              : canDeleteRow
                ? '删除当前行'
                : '不可删除唯一数据行'
          }
        >
          <RowDeleteIcon size={16} />
        </button>
        <button
          className={`${styles.menuBtn} ${styles.dangerBtn}`}
          disabled={!isCellFocused || !canDeleteCol}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (isCellFocused && canDeleteCol) {
              editor.chain().focus().deleteColumn().run();
            }
          }}
          title={
            !isCellFocused
              ? '请先点击单元格聚焦后再操作'
              : canDeleteCol
                ? '删除当前列'
                : '不可删除唯一数据列'
          }
        >
          <ColumnDeleteIcon size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 合并与拆分组 */}
      <div className={styles.menuGroup}>
        <button
          className={styles.menuBtn}
          disabled={!isCellFocused || !canMerge}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => isCellFocused && editor.chain().focus().mergeCells().run()}
          title={
            !isCellFocused
              ? '请先点击并框选单元格后再操作'
              : canMerge
                ? '合并选中的单元格'
                : '请框选 2 个或以上单元格以合并'
          }
        >
          <CellMergeIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          disabled={!isCellFocused || !canSplit}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => isCellFocused && editor.chain().focus().splitCell().run()}
          title={
            !isCellFocused
              ? '请先点击单元格聚焦后再操作'
              : canSplit
                ? '拆分合并的单元格'
                : '当前单元格无需拆分'
          }
        >
          <CellSplitIcon size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 单元格背景油漆桶 */}
      <div className={styles.menuGroup}>
        <div style={{ position: 'relative' }}>
          <button
            className={`${styles.menuBtn} ${showColorPicker ? styles.menuBtnActive : ''}`}
            disabled={!isCellFocused}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              if (!isCellFocused) return;
              if (!showColorPicker) {
                window.dispatchEvent(
                  new CustomEvent('CLOSE_OTHER_SUBMENUS', { detail: { source: 'TableBubbleMenu' } })
                );
                const btnRect = e.currentTarget.getBoundingClientRect();
                const res = calculateSubMenuPosition({
                  buttonRect: btnRect,
                  submenuWidth: 168,
                  submenuHeight: 250,
                  offset: 6,
                });
                setPickerStyle(res.style);
              }
              setShowColorPicker(!showColorPicker);
            }}
            title={isCellFocused ? '单元格背景填充' : '请先点击单元格聚焦后再操作'}
          >
            <PaintBucket size={16} />
          </button>
          {showColorPicker && isCellFocused && (
            <div
              style={pickerStyle}
              onMouseDown={(e) => e.preventDefault()}
            >
              <UnifiedColorPicker
                allowedCategories={['backgroundColor']}
                defaultCategory="backgroundColor"
                currentColor={getSelectedCellBg()}
                onSelectColor={(color) => handleSetCellBg(color)}
                onResetColor={() => handleSetCellBg('transparent')}
              />
            </div>
          )}
        </div>
      </div>
    </FloatingBlockTool>
  );
};
