import React, { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import { CellSelection } from '@tiptap/pm/tables';
import { PaintBucket } from 'lucide-react';
import styles from './TableBubbleMenu.module.css';
import { calculateSmartPosition, calculateSubMenuPosition } from '../../utils/floatingPosition';
import { getActiveToolbarInfo, hoverStackManager } from '../../utils/toolbarPriority';
import { UnifiedColorPicker } from '../ColorPicker/UnifiedColorPicker';
import { UnifiedBlockToolbar } from '../UnifiedBlockToolbar';
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
  const [hoverStateListener, setHoverStateListener] = useState(0);
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
    rowCount: number;
    colCount: number;
    canMerge: boolean;
    canSplit: boolean;
    tablePos?: number;
    nodeSize?: number;
  }>({
    visible: false,
    top: 0,
    left: 0,
    rowCount: 0,
    colCount: 0,
    canMerge: false,
    canSplit: false,
  });

  // 监听 HoverStackManager 的订阅变更
  useEffect(() => {
    const unsubscribe = hoverStackManager.subscribe(() => {
      setHoverStateListener((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const activeToolbar = getActiveToolbarInfo(editor);
      const { selection } = editor.state;
      const isTextSelection = selection instanceof TextSelection;
      const isTextSelected = isTextSelection && !selection.empty && selection.from !== selection.to;

      // 严格全局互斥：优先校验 HoverStack 悬停目标类型
      const activeHover = hoverStackManager.getActiveTarget();
      if (activeHover && activeHover.type) {
        if (activeHover.type !== 'table') {
          setMenuState((prev) => ({ ...prev, visible: false }));
          setShowColorPicker(false);
          return;
        }
      } else {
        if (activeToolbar.type !== 'table' || !editor.isActive('table')) {
          setMenuState((prev) => ({ ...prev, visible: false }));
          setShowColorPicker(false);
          return;
        }
      }

      if (isDragging || isTypeMenuOpen || isTextSelected) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setShowColorPicker(false);
        return;
      }

      let tableNode = null;
      let rowCount = 0;
      let colCount = 0;
      let tablePos: number | undefined = undefined;

      const docSize = editor.state.doc.content.size;

      // 1. 优先使用全局 Hover 悬停到的 Table 节点信息
      if (activeHover && activeHover.type === 'table' && typeof activeHover.nodePos === 'number') {
        const targetPos = Math.min(Math.max(0, activeHover.nodePos), docSize);
        const directNode = editor.state.doc.nodeAt(targetPos);
        if (directNode && directNode.type.name === 'table') {
          tableNode = directNode;
          tablePos = targetPos;
        } else {
          const resolved = editor.state.doc.resolve(targetPos);
          for (let d = resolved.depth; d > 0; d--) {
            const n = resolved.node(d);
            if (n.type.name === 'table') {
              tableNode = n;
              tablePos = resolved.before(d);
              break;
            }
          }
        }
      }

      // 2. 若当前无 Hover Table，回退到选区焦点所在的 Table
      if (!tableNode && editor.isActive('table')) {
        let depth = selection.$anchor.depth;
        while (depth > 0) {
          const node = selection.$anchor.node(depth);
          if (node.type.name === 'table') {
            tableNode = node;
            tablePos = selection.$anchor.before(depth);
            break;
          }
          depth--;
        }
      }

      if (!tableNode || typeof tablePos !== 'number') {
        setMenuState((prev) => ({ ...prev, visible: false }));
        setShowColorPicker(false);
        return;
      }

      rowCount = tableNode.childCount;
      if (rowCount > 0) {
        const firstRow = tableNode.child(0);
        colCount = 0;
        firstRow.forEach((cell) => {
          colCount += cell.attrs.colspan || 1;
        });
      }

      const { view } = editor;
      let tableElement: HTMLElement | null = activeHover?.domElement || null;

      if (!tableElement) {
        try {
          const domNode = view.nodeDOM(tablePos) as HTMLElement | null;
          if (domNode && domNode.tagName === 'TABLE') {
            tableElement = domNode;
          } else if (domNode) {
            tableElement = domNode.querySelector('table') || domNode.closest('table');
          }

          if (!tableElement) {
            const rawDom = view.domAtPos(Math.min(tablePos + 1, docSize)).node;
            tableElement = (
              rawDom instanceof HTMLElement
                ? rawDom.closest('table')
                : rawDom.parentElement?.closest('table')
            ) as HTMLElement | null;
          }
        } catch (_err) {
          // fallback
        }
      }

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
        top: Math.max(4, posResult.top),
        left: clampedCenter,
        placement: posResult.placement,
        rowCount,
        colCount,
        canMerge,
        canSplit,
        tablePos,
        nodeSize: tableNode.nodeSize,
      });
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);

    updateMenu();

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor, isDragging, isTypeMenuOpen, hoverStateListener]);

  if (!editor || !menuState.visible || isDragging || isTypeMenuOpen) {
    return null;
  }

  // 精准判定：光标是否聚焦在当前悬浮展示的这同一个 Table 内部
  let focusedTablePos: number | undefined = undefined;
  if (editor.isActive('table')) {
    const { selection } = editor.state;
    let depth = selection.$anchor.depth;
    while (depth > 0) {
      const node = selection.$anchor.node(depth);
      if (node.type.name === 'table') {
        focusedTablePos = selection.$anchor.before(depth);
        break;
      }
      depth--;
    }
  }

  const isCellFocused =
    typeof menuState.tablePos === 'number' &&
    typeof focusedTablePos === 'number' &&
    menuState.tablePos === focusedTablePos;

  const canDeleteRow = isCellFocused && menuState.rowCount > 1;
  const canDeleteCol = isCellFocused && menuState.colCount > 1;

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

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${menuState.top}px`,
        left: `${menuState.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => {
        hoverStackManager.keepActive();
      }}
      onMouseOver={() => {
        hoverStackManager.keepActive();
      }}
    >
      <UnifiedBlockToolbar
        editor={editor}
        getPos={() => menuState.tablePos}
        nodeSize={menuState.nodeSize || 1}
        onDeleteBlock={() => editor.chain().focus().deleteTable().run()}
        onMouseEnter={() => {
          hoverStackManager.keepActive();
        }}
        onMouseLeave={(e) => {
          const relatedTarget = e.relatedTarget as HTMLElement | null;
          if (relatedTarget && relatedTarget.closest('table')) {
            return;
          }
          hoverStackManager.setExclusiveTarget(null, 250);
        }}
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

        {/* 删除行列组：未选择/未聚焦时置灰 */}
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

        {/* 合并与拆分组：未聚焦单元格时自动置灰 */}
        <div className={styles.menuGroup}>
          <button
            className={styles.menuBtn}
            disabled={!isCellFocused || !menuState.canMerge}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => isCellFocused && editor.chain().focus().mergeCells().run()}
            title={
              !isCellFocused
                ? '请先点击并框选单元格后再操作'
                : menuState.canMerge
                  ? '合并选中的单元格'
                  : '请框选 2 个或以上单元格以合并'
            }
          >
            <CellMergeIcon size={16} />
          </button>
          <button
            className={styles.menuBtn}
            disabled={!isCellFocused || !menuState.canSplit}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => isCellFocused && editor.chain().focus().splitCell().run()}
            title={
              !isCellFocused
                ? '请先点击单元格聚焦后再操作'
                : menuState.canSplit
                  ? '拆分合并的单元格'
                  : '当前单元格无需拆分'
            }
          >
            <CellSplitIcon size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* 单元格背景油漆桶：未聚焦时置灰 */}
        <div className={styles.menuGroup}>
          <div style={{ position: 'relative' }}>
            <button
              className={`${styles.menuBtn} ${showColorPicker ? styles.menuBtnActive : ''}`}
              disabled={!isCellFocused}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                if (!isCellFocused) return;
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
                  onSelectColor={(color) => handleSetCellBg(color)}
                  onResetColor={() => handleSetCellBg('transparent')}
                />
              </div>
            )}
          </div>
        </div>
      </UnifiedBlockToolbar>
    </div>
  );
};
