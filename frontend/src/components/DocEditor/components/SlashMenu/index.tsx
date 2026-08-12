import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Code,
  Quote,
  Minus,
  Info,
  Palette,
  Workflow,
} from 'lucide-react';
import styles from '../../DocEditor.module.css';
import type { SlashMenuItem } from './SlashMenuPlugin';

export interface SlashMenuProps {
  items: SlashMenuItem[];
  command: (item: SlashMenuItem) => void;
}

export interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Code,
  Quote,
  Minus,
  Info,
  Palette,
  Workflow,
};

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

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
    <div className={styles.slashMenu}>
      {items.map((item, index) => {
        const IconComponent = iconMap[item.iconName] || List;
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
              <IconComponent />
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{item.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';
