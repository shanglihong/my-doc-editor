import React, { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { TextSelection } from '@tiptap/pm/state';
import styles from './FloatingBlockTool.module.css';
import { getActiveToolbarInfo, hoverStackManager } from '../../utils/toolbarPriority';
import { UnifiedBlockToolbar } from '../UnifiedBlockToolbar';

export interface FloatingBlockToolProps {
  /** TipTap 编辑器实例 */
  editor: Editor | null;
  /** 当前 Block 节点的类型名称（如 'callout', 'codeBlock', 'table', 'image', 'drawio'） */
  blockType: string;
  /** 拖拽状态：点击拖拽句柄时为 true */
  isDragging?: boolean;
  /** 块类型切换菜单是否处于打开状态 */
  isTypeMenuOpen?: boolean;
  /** 是否使用 NodeView 局部相对定位（写在 NodeView 内部时传 true） */
  isLocalPositioning?: boolean;
  /** 获取当前 Node 在文档中的位置函数 */
  getPos?: (() => number | undefined) | boolean | undefined;
  /** 自定义块删除回调（如果不传，则默认根据节点 pos 删除完整节点） */
  onDeleteBlock?: () => void;
  /** 是否隐藏类型切换下拉菜单（部分特殊 Block 可使用此项） */
  hideTypeDropdown?: boolean;
  /** 定制按钮插槽：用于嵌入特定 Block 独有的格式/操作控件 */
  children?: React.ReactNode;
}

export const FloatingBlockTool: React.FC<FloatingBlockToolProps> = ({
  editor,
  blockType,
  isDragging,
  isTypeMenuOpen,
  isLocalPositioning,
  getPos,
  onDeleteBlock,
  hideTypeDropdown,
  children,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoverStateListener, setHoverStateListener] = useState(0);

  const [menuState, setMenuState] = useState<{
    visible: boolean;
    top: number | string;
    left: number | string;
    placement?: 'top' | 'bottom';
    pos: number;
    nodeSize?: number;
  }>({
    visible: false,
    top: 0,
    left: 0,
    pos: -1,
  });

  // 监听 HoverStackManager 的订阅变更
  useEffect(() => {
    const unsubscribe = hoverStackManager.subscribe(() => {
      setHoverStateListener((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  // 监听全局隐藏事件（如全局按 Esc 或全屏弹窗激活）
  useEffect(() => {
    const handleHideAll = () => {
      setMenuState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    return () => {
      window.removeEventListener('HIDE_ALL_FLOATING_MENUS', handleHideAll);
    };
  }, []);

  // 当 FloatingBlockTool 隐藏时，主动广播闭合所有下拉/调色板子菜单（避免误杀死划选文本工具栏 BubbleToolbar）
  useEffect(() => {
    if (!menuState.visible) {
      window.dispatchEvent(
        new CustomEvent('CLOSE_OTHER_SUBMENUS', { detail: { source: 'FloatingBlockToolHide' } })
      );
    }
  }, [menuState.visible]);

  // 主更新与定位逻辑
  useEffect(() => {
    if (!editor) return;

    // 当为局部 NodeView 定位模式时，直接呈现并锚定在顶部 -40px
    if (isLocalPositioning === true) {
      if (isDragging || isTypeMenuOpen) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        return;
      }
      let myPos = -1;
      if (typeof getPos === 'function') {
        const p = getPos();
        if (typeof p === 'number') {
          myPos = p;
        }
      }
      setMenuState({
        visible: true,
        top: '-40px',
        left: '50%',
        placement: 'top',
        pos: myPos,
        nodeSize: 1,
      });
      return;
    }

    const updateMenu = () => {
      const activeToolbar = getActiveToolbarInfo(editor);
      const { selection } = editor.state;
      const isTextSelection = selection instanceof TextSelection;
      const isTextSelected = isTextSelection && !selection.empty && selection.from !== selection.to;

      // 全局互斥：校验 HoverStack 悬停目标类型
      const activeHover = hoverStackManager.getActiveTarget();

      if (activeHover && activeHover.type) {
        if (activeHover.type !== blockType) {
          setMenuState((prev) => ({ ...prev, visible: false }));
          return;
        }
      } else {
        if (activeToolbar.type !== blockType || !editor.isActive(blockType)) {
          setMenuState((prev) => ({ ...prev, visible: false }));
          return;
        }
      }

      // 拖拽中、类型菜单开启中或包含非空文本选区时置隐藏
      if (isDragging || isTypeMenuOpen || isTextSelected) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        return;
      }

      let targetNode = null;
      let targetPos = -1;
      let targetElement: HTMLElement | null = activeHover?.domElement || null;

      const docSize = editor.state.doc.content.size;

      if (activeHover && activeHover.type === blockType && typeof activeHover.nodePos === 'number') {
        const checkPos = Math.min(Math.max(0, activeHover.nodePos), docSize);
        const directNode = editor.state.doc.nodeAt(checkPos);
        if (directNode && (directNode.type.name === blockType || directNode.type.name === `${blockType}Block`)) {
          targetNode = directNode;
          targetPos = checkPos;
        } else {
          const resolved = editor.state.doc.resolve(checkPos);
          for (let d = resolved.depth; d > 0; d--) {
            const n = resolved.node(d);
            if (n.type.name === blockType || n.type.name === `${blockType}Block`) {
              targetNode = n;
              targetPos = resolved.before(d);
              break;
            }
          }
        }
      }

      if (!targetNode && editor.isActive(blockType)) {
        let depth = selection.$anchor.depth;
        while (depth > 0) {
          const node = selection.$anchor.node(depth);
          if (node.type.name === blockType || node.type.name === `${blockType}Block`) {
            targetNode = node;
            targetPos = selection.$anchor.before(depth);
            break;
          }
          depth--;
        }
      }

      if (!targetNode || targetPos === -1) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        return;
      }

      const { view } = editor;
      if (!targetElement) {
        const domNode = view.nodeDOM(targetPos) as HTMLElement | null;
        if (domNode && domNode instanceof HTMLElement) {
          targetElement = domNode;
        } else {
          const rawNode = view.domAtPos(Math.min(targetPos + 1, docSize)).node as Node | null;
          if (rawNode) {
            const el = rawNode instanceof HTMLElement ? rawNode : rawNode.parentElement;
            targetElement =
              el?.closest?.(`[data-type="${blockType}"]`) ||
              el?.closest?.(`[data-type="${blockType}-block"]`) ||
              el?.closest?.(`[data-type="codeBlock"]`) ||
              el?.closest?.(`[data-type="drawio-block"]`) ||
              el?.closest?.(`[data-type="image-block"]`) ||
              el?.closest?.(`[data-type="callout"]`) ||
              el?.closest?.(`table`) ||
              el ||
              null;
          }
        }
      }

      if (!targetElement || !(targetElement instanceof HTMLElement)) {
        setMenuState((prev) => ({ ...prev, visible: false }));
        return;
      }

      // 全局浮动菜单模式
      const container = view.dom.closest('[class*="editorContainer"]') as HTMLElement;
      const containerRect = container
        ? container.getBoundingClientRect()
        : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

      const blockRect = targetElement.getBoundingClientRect();
      const menuWidth = menuRef.current ? menuRef.current.offsetWidth : 240;
      const menuHeight = 34;

      const calcTop = blockRect.top - containerRect.top - menuHeight - 8;
      const finalTop = Math.max(4, calcTop);

      const blockCenter = blockRect.left + blockRect.width / 2 - containerRect.left;
      const minCenter = menuWidth / 2 + 8;
      const maxCenter = containerRect.width - menuWidth / 2 - 8;
      const clampedCenter = Math.min(Math.max(minCenter, blockCenter), maxCenter);

      setMenuState({
        visible: true,
        top: `${finalTop}px`,
        left: `${clampedCenter}px`,
        placement: 'top',
        pos: targetPos,
        nodeSize: targetNode.nodeSize,
      });
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);
    updateMenu();

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor, blockType, isDragging, isTypeMenuOpen, isLocalPositioning, getPos, hoverStateListener]);

  if (!editor || !menuState.visible || isDragging || isTypeMenuOpen) {
    return null;
  }

  // 节点删除逻辑
  const handleDefaultDelete = () => {
    if (onDeleteBlock) {
      onDeleteBlock();
    }
    if (editor && menuState.pos >= 0) {
      const nodeSize = menuState.nodeSize || editor.state.doc.nodeAt(menuState.pos)?.nodeSize || 1;
      try {
        editor
          .chain()
          .focus()
          .deleteRange({
            from: menuState.pos,
            to: menuState.pos + nodeSize,
          })
          .run();
      } catch (_e) {
        // 静默捕获
      }
    }
    setMenuState((prev) => ({ ...prev, visible: false }));
    hoverStackManager.clear();
  };

  const styleObj: React.CSSProperties = {
    top: typeof menuState.top === 'number' ? `${menuState.top}px` : menuState.top,
    left: typeof menuState.left === 'number' ? `${menuState.left}px` : menuState.left,
    transform: 'translateX(-50%)',
  };

  return (
    <div
      ref={menuRef}
      className={styles.floatingBlockTool}
      style={styleObj}
      onMouseDown={() => {
        window.dispatchEvent(new CustomEvent('HIDE_DRAG_HANDLE'));
      }}
      onMouseEnter={() => {
        hoverStackManager.keepActive();
      }}
      onMouseOver={() => {
        hoverStackManager.keepActive();
      }}
      onMouseLeave={(e) => {
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        if (
          relatedTarget &&
          (relatedTarget.closest('[class*="floatingBlockTool"]') ||
            relatedTarget.closest('[class*="unifiedToolbar"]') ||
            relatedTarget.closest('[class*="BubbleMenu"]') ||
            relatedTarget.closest('[class*="popover"]') ||
            relatedTarget.closest('[data-type]') ||
            relatedTarget.closest('table') ||
            relatedTarget.closest('pre'))
        ) {
          hoverStackManager.keepActive();
          return;
        }
        const active = hoverStackManager.getActiveTarget();
        if (active?.id) {
          hoverStackManager.unregister(active.id, 250);
        }
      }}
    >
      <UnifiedBlockToolbar
        editor={editor}
        getPos={() => menuState.pos}
        nodeSize={menuState.nodeSize || 1}
        onDeleteBlock={handleDefaultDelete}
        hideBuiltinLeft={hideTypeDropdown}
        onMouseEnter={() => {
          hoverStackManager.keepActive();
        }}
      >
        {children && (
          <div className={styles.customActions}>{children}</div>
        )}
      </UnifiedBlockToolbar>
    </div>
  );
};
