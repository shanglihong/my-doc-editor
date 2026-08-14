import React, { useEffect, useRef } from 'react';
import {
  Lightbulb,
  Info,
  AlertTriangle,
  CheckCircle2,
  OctagonAlert,
  Star,
  Flame,
  Zap,
  Bookmark,
  FileText,
  Pin,
  Heart,
  Rocket,
  MessageCircle,
  Target,
  Lock,
  Coffee,
  Globe,
  Music,
  Camera,
} from 'lucide-react';
import styles from '../../DocEditor.module.css';

interface IconConfig {
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const ICON_OPTIONS: IconConfig[] = [
  { name: 'Lightbulb',     icon: Lightbulb,     color: '#f59e0b' },
  { name: 'Info',          icon: Info,           color: '#3b82f6' },
  { name: 'AlertTriangle', icon: AlertTriangle,  color: '#f97316' },
  { name: 'CheckCircle2',  icon: CheckCircle2,   color: '#22c55e' },
  { name: 'OctagonAlert',  icon: OctagonAlert,   color: '#ef4444' },
  { name: 'Star',          icon: Star,           color: '#eab308' },
  { name: 'Flame',         icon: Flame,          color: '#f97316' },
  { name: 'Zap',           icon: Zap,            color: '#8b5cf6' },
  { name: 'Bookmark',      icon: Bookmark,       color: '#64748b' },
  { name: 'FileText',      icon: FileText,       color: '#0891b2' },
  { name: 'Pin',           icon: Pin,            color: '#ec4899' },
  { name: 'Heart',         icon: Heart,          color: '#f43f5e' },
  { name: 'Rocket',        icon: Rocket,         color: '#6366f1' },
  { name: 'MessageCircle', icon: MessageCircle,  color: '#14b8a6' },
  { name: 'Target',        icon: Target,         color: '#ef4444' },
  { name: 'Lock',          icon: Lock,           color: '#78716c' },
  { name: 'Coffee',        icon: Coffee,         color: '#a16207' },
  { name: 'Globe',         icon: Globe,          color: '#0284c7' },
  { name: 'Music',         icon: Music,          color: '#d946ef' },
  { name: 'Camera',        icon: Camera,         color: '#475569' },
];

interface CalloutIconPickerProps {
  currentIcon: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelectIcon: (name: string) => void;
}

export const CalloutIconPicker: React.FC<CalloutIconPickerProps> = ({
  currentIcon,
  isOpen,
  onToggle,
  onSelectIcon,
}) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const currentConfig = ICON_OPTIONS.find((c) => c.name === currentIcon) || ICON_OPTIONS[1];
  const CurrentIcon = currentConfig.icon;

  // 点击外部关闭
  useEffect(() => {
    if (!isOpen) return;
    const handleDown = (e: MouseEvent) => {
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [isOpen, onToggle]);

  return (
    <div ref={areaRef} className={styles.calloutIconArea}>
      <button
        type="button"
        className={styles.calloutIconBtn}
        onClick={onToggle}
        title="切换图标"
      >
        <CurrentIcon size={18} color={currentConfig.color} />
      </button>

      {isOpen && (
        <div className={styles.calloutPickerPopover}>
          <div className={styles.pickerTitle}>选择图标</div>
          <div className={styles.iconGrid}>
            {ICON_OPTIONS.map((c) => {
              const IconComp = c.icon;
              return (
                <button
                  key={c.name}
                  type="button"
                  className={`${styles.iconOption} ${currentIcon === c.name ? styles.iconOptionActive : ''}`}
                  title={c.name}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelectIcon(c.name);
                  }}
                >
                  <IconComp size={16} color={c.color} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export { ICON_OPTIONS };
export type { IconConfig };
