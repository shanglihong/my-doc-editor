import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './SlashMenu.module.css';
import type { SlashMenuItem } from './SlashMenuPlugin';
import { BlockIcon } from '../../utils/blockIcons';

export interface SlashMenuProps {
  items: SlashMenuItem[];
  command: (item: SlashMenuItem) => void;
}

export interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const iconNameToBlockTypeMap: Record<string, { type: string; level?: number }> = {
  Heading1: { type: 'heading', level: 1 },
  Heading2: { type: 'heading', level: 2 },
  Heading3: { type: 'heading', level: 3 },
  List: { type: 'bulletList' },
  ListOrdered: { type: 'orderedList' },
  Image: { type: 'imageBlock' },
  Table: { type: 'table' },
  Code: { type: 'codeBlock' },
  Quote: { type: 'blockquote' },
  Minus: { type: 'horizontalRule' },
  Info: { type: 'callout' },
  Palette: { type: 'callout' },
  Workflow: { type: 'drawioBlock' },
};

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;

    const handleWheel = (e: WheelEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        const { scrollTop, scrollHeight, clientHeight } = menuRef.current;
        const delta = e.deltaY;
        const isAtTop = scrollTop === 0 && delta < 0;
        const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 2 && delta > 0;
        if (isAtTop || isAtBottom) {
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [items.length]);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={menuRef} className={styles.slashMenu}>
      {items.map((item, index) => {
        const blockTypeInfo = iconNameToBlockTypeMap[item.iconName] || { type: 'paragraph' };
        return (
          <div
            key={item.title}
            className={`${styles.slashMenuItem} ${
              index === selectedIndex ? styles.slashMenuItemSelected : ''
            }`}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className={styles.slashMenuIcon}>
              <BlockIcon type={blockTypeInfo.type} level={blockTypeInfo.level} size={15} />
            </div>
            <div>
              <div style={{ fontWeight: 400, fontSize: '13px', color: '#0f172a' }}>{item.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';
