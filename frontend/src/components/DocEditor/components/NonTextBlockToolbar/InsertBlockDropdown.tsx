import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import { SquarePlus, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './NonTextBlockToolbar.module.css';
import { insertParagraphBlockAround } from '../../utils/blockInsertion';

export interface InsertBlockDropdownProps {
  /** TipTap 编辑器实例 */
  editor: Editor;
  /** 获取当前节点在文档中位置的回调 */
  getPos: (() => number | undefined) | boolean | undefined;
  /** 当前节点的大小 node.nodeSize */
  nodeSize: number;
  /** （可选）受控方式：菜单当前是否处于展开状态 */
  isOpen?: boolean;
  /** （可选）受控方式：切换展开/关闭的回调 */
  onToggle?: (open: boolean) => void;
  /** （可选）受控方式：关闭菜单的回调 */
  onClose?: () => void;
}

export const InsertBlockDropdown: React.FC<InsertBlockDropdownProps> = ({
  editor,
  getPos,
  nodeSize,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onClose: controlledOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isOpen;
    if (isControlled) {
      controlledOnToggle?.(nextState);
    } else {
      setInternalIsOpen(nextState);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      controlledOnClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('INSERT_BLOCK_DROPDOWN_TOGGLE', { detail: { isOpen } })
    );
  }, [isOpen]);

  // 监听全局隐藏菜单事件
  useEffect(() => {
    const handleHideAll = () => {
      handleClose();
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    };
  }, [isControlled]);

  // 动态计算下拉菜单对齐（设为 left: -6px，消除偏左现象）
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const btnRect = buttonRef.current.getBoundingClientRect();
    const spaceAbove = btnRect.top;
    const spaceBelow = window.innerHeight - btnRect.bottom;

    const placement = spaceBelow < 90 && spaceAbove > spaceBelow ? 'top' : 'bottom';

    const calculatedStyle: React.CSSProperties = {
      position: 'absolute',
      left: '-6px',
      zIndex: 1000,
    };

    if (placement === 'bottom') {
      calculatedStyle.top = '100%';
      calculatedStyle.marginTop = '6px';
    } else {
      calculatedStyle.bottom = '100%';
      calculatedStyle.marginBottom = '6px';
    }

    setMenuStyle(calculatedStyle);
  }, [isOpen]);

  // 点击外部自动关闭菜单
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInsert = (direction: 'above' | 'below', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    insertParagraphBlockAround({
      editor,
      getPos,
      nodeSize,
      direction,
    });

    handleClose();
  };

  return (
    <div
      ref={containerRef}
      className={styles.dropdownWrapper}
      style={{ position: 'relative', zIndex: 100 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.iconBtn} ${isOpen ? styles.iconBtnActive : ''}`}
        onClick={handleToggle}
        title="在上方或下方插入空白块"
      >
        <SquarePlus size={16} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} style={menuStyle}>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={(e) => handleInsert('above', e)}
          >
            <span className={styles.dropdownItemIcon} style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUp size={14} />
            </span>
            <span style={{ textAlign: 'left', flex: 1 }}>在上方插入</span>
          </button>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={(e) => handleInsert('below', e)}
          >
            <span className={styles.dropdownItemIcon} style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDown size={14} />
            </span>
            <span style={{ textAlign: 'left', flex: 1 }}>在下方插入</span>
          </button>
        </div>
      )}
    </div>
  );
};
