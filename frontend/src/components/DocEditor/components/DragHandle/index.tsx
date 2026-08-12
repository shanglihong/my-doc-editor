import React from 'react';
import { GripVertical } from 'lucide-react';
import styles from '../../DocEditor.module.css';

export interface DragHandleProps {
  top: number;
  visible: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

export const DragHandleUI: React.FC<DragHandleProps> = ({ top, visible, onDragStart }) => {
  if (!visible) return null;

  return (
    <div
      className={styles.dragHandle}
      style={{
        top: `${top}px`,
        opacity: visible ? 1 : 0,
      }}
      draggable
      onDragStart={onDragStart}
      title="按住拖拽重排块位置"
    >
      <GripVertical size={16} />
    </div>
  );
};
