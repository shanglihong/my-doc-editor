import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/core';
import { SquarePlus, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './NonTextBlockToolbar.module.css';
import { insertParagraphBlockAround } from '../../utils/blockInsertion';
import { calculateSubMenuPosition } from '../../utils/floatingPosition';

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

  // 监听全局隐藏菜单事件与键盘 keydown 事件
  useEffect(() => {
    const handleHideAll = () => {
      handleClose();
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    };
  }, [isControlled]);

  // 动态计算下拉菜单防遮挡避让坐标
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const btnRect = buttonRef.current.getBoundingClientRect();
    const { style } = calculateSubMenuPosition({
      buttonRect: btnRect,
      submenuWidth: 140,
      submenuHeight: 80,
      offset: 4,
    });

    setMenuStyle(style);
  }, [isOpen]);

  // 点击外部自动关闭菜单
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
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
            <span className={styles.dropdownItemIcon}>
              <ArrowUp size={14} />
            </span>
            <span>在上方插入</span>
          </button>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={(e) => handleInsert('below', e)}
          >
            <span className={styles.dropdownItemIcon}>
              <ArrowDown size={14} />
            </span>
            <span>在下方插入</span>
          </button>
        </div>
      )}
    </div>
  );
};
