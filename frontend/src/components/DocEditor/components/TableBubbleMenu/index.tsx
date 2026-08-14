import React, { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';
import { PaintBucket, Trash2 } from 'lucide-react';
import styles from './TableBubbleMenu.module.css';
import { calculateSmartPosition, calculateSubMenuPosition } from '../../utils/floatingPosition';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
    rowCount: number;
    colCount: number;
    canMerge: boolean;
    canSplit: boolean;
  }>({
    visible: false,
    top: 0,
    left: 0,
    rowCount: 0,
    colCount: 0,
    canMerge: false,
    canSplit: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const { selection } = editor.state;
      const isTextSelection = selection instanceof TextSelection;
      const isTextSelected = isTextSelection && !selection.empty && selection.from !== selection.to;

      if (isDragging || isTypeMenuOpen || isTextSelected || !editor.isActive('table')) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setShowColorPicker(false);
        return;
      }

      const { view } = editor;

      let depth = selection.$anchor.depth;
      let tableNode = null;
      let rowCount = 0;
      let colCount = 0;

      while (depth > 0) {
        const node = selection.$anchor.node(depth);
        if (node.type.name === 'table') {
          tableNode = node;
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

      if (!tableNode) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setShowColorPicker(false);
        return;
      }

      const tableDOM = view.domAtPos(selection.$anchor.pos).node;
      const tableElement = (
        tableDOM instanceof HTMLElement
          ? tableDOM.closest('table')
          : tableDOM.parentElement?.closest('table')
      ) as HTMLElement | null;

      if (!tableElement) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setShowColorPicker(false);
        return;
      }

      const container = view.dom.closest('[class*="editorContainer"]') as HTMLElement;
      const containerRect = container
        ? container.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

      const tableRect = tableElement.getBoundingClientRect();
      const menuWidth = menuRef.current ? menuRef.current.offsetWidth : 320;
      const menuHeight = 34;

      const posResult = calculateSmartPosition({
        targetRect: tableRect,
        containerRect,
        menuWidth,
        menuHeight,
        preferredPlacement: 'top',
        offset: 8,
      });

      const tableCenter = tableRect.left + tableRect.width / 2 - containerRect.left;
      const minCenter = menuWidth / 2 + 8;
      const maxCenter = containerRect.width - menuWidth / 2 - 8;
      const clampedCenter = Math.min(Math.max(minCenter, tableCenter), maxCenter);

      const canMerge = editor.can().mergeCells();
      const canSplit = editor.can().splitCell();

      setMenuState({
        visible: true,
        top: posResult.top,
        left: clampedCenter,
        placement: posResult.placement,
        rowCount,
        colCount,
        canMerge,
        canSplit,
      });
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor, isDragging, isTypeMenuOpen]);

  if (!editor || !menuState.visible || isDragging || isTypeMenuOpen) {
    return null;
  }

  const canDeleteRow = menuState.rowCount > 1;
  const canDeleteCol = menuState.colCount > 1;

  const handleSetCellBg = (color: string) => {
    if (!editor) return;
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

  return (
    <div
      ref={menuRef}
      className={styles.tableBubbleMenu}
      style={{
        position: 'absolute',
        top: `${menuState.top}px`,
        left: `${menuState.left}px`,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* 插入行列高语义图标组 */}
      <div className={styles.menuGroup}>
        <button
          className={styles.menuBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title="在上方插入行"
        >
          <RowInsertAboveIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title="在下方插入行"
        >
          <RowInsertBelowIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title="在左侧插入列"
        >
          <ColumnInsertLeftIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title="在右侧插入列"
        >
          <ColumnInsertRightIcon size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 删除行列高语义图标组 */}
      <div className={styles.menuGroup}>
        <button
          className={`${styles.menuBtn} ${styles.dangerBtn}`}
          disabled={!canDeleteRow}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (canDeleteRow) {
              editor.chain().focus().deleteRow().run();
            }
          }}
          title={canDeleteRow ? '删除当前行' : '不可删除唯一数据行'}
        >
          <RowDeleteIcon size={16} />
        </button>
        <button
          className={`${styles.menuBtn} ${styles.dangerBtn}`}
          disabled={!canDeleteCol}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (canDeleteCol) {
              editor.chain().focus().deleteColumn().run();
            }
          }}
          title={canDeleteCol ? '删除当前列' : '不可删除唯一数据列'}
        >
          <ColumnDeleteIcon size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 合并与拆分高语义图标组 */}
      <div className={styles.menuGroup}>
        <button
          className={styles.menuBtn}
          disabled={!menuState.canMerge}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().mergeCells().run()}
          title={menuState.canMerge ? '合并选中的单元格' : '请框选 2 个或以上单元格以合并'}
        >
          <CellMergeIcon size={16} />
        </button>
        <button
          className={styles.menuBtn}
          disabled={!menuState.canSplit}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().splitCell().run()}
          title={menuState.canSplit ? '拆分合并的单元格' : '当前单元格无需拆分'}
        >
          <CellSplitIcon size={16} />
        </button>
      </div>

      <div className={styles.divider} />

      {/* 单元格背景油漆桶与整表删除 */}
      <div className={styles.menuGroup}>
        <div style={{ position: 'relative' }}>
          <button
            className={`${styles.menuBtn} ${showColorPicker ? styles.menuBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              if (!showColorPicker) {
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
            title="单元格背景填充"
          >
            <PaintBucket size={16} />
          </button>
          {showColorPicker && (
            <div
              style={pickerStyle}
              onMouseDown={(e) => e.preventDefault()}
            >
              <UnifiedColorPicker
                allowedCategories={['backgroundColor']}
                defaultCategory="backgroundColor"
                onSelectColor={(color) => handleSetCellBg(color)}
                onResetColor={() => handleSetCellBg('transparent')}
              />
            </div>
          )}
        </div>

        <button
          className={`${styles.menuBtn} ${styles.dangerBtn}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().deleteTable().run()}
          title="删除整个表格"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
