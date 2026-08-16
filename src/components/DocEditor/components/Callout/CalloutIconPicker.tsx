import React, { useEffect, useRef, useState } from 'react';
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
import styles from './Callout.module.css';
import { calculateSubMenuPosition } from '../../utils/floatingPosition';

interface IconConfig {
  name: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; color?: string }>;
  defaultColor: string;
}

const ICON_OPTIONS: IconConfig[] = [
  { name: 'Info',          icon: Info,          defaultColor: '#3b82f6' },
  { name: 'Lightbulb',     icon: Lightbulb,     defaultColor: '#f59e0b' },
  { name: 'AlertTriangle', icon: AlertTriangle, defaultColor: '#eab308' },
  { name: 'CheckCircle2',  icon: CheckCircle2,  defaultColor: '#22c55e' },
  { name: 'OctagonAlert',  icon: OctagonAlert,  defaultColor: '#ef4444' },
  { name: 'Star',          icon: Star,          defaultColor: '#eab308' },
  { name: 'Flame',         icon: Flame,         defaultColor: '#f97316' },
  { name: 'Zap',           icon: Zap,           defaultColor: '#eab308' },
  { name: 'Bookmark',      icon: Bookmark,      defaultColor: '#64748b' },
  { name: 'FileText',      icon: FileText,      defaultColor: '#06b6d4' },
  { name: 'Pin',           icon: Pin,           defaultColor: '#f43f5e' },
  { name: 'Heart',         icon: Heart,         defaultColor: '#ef4444' },
  { name: 'Rocket',        icon: Rocket,        defaultColor: '#a855f7' },
  { name: 'MessageCircle', icon: MessageCircle, defaultColor: '#10b981' },
  { name: 'Target',        icon: Target,        defaultColor: '#ef4444' },
  { name: 'Lock',          icon: Lock,          defaultColor: '#64748b' },
  { name: 'Coffee',        icon: Coffee,        defaultColor: '#854d0e' },
  { name: 'Globe',         icon: Globe,         defaultColor: '#3b82f6' },
  { name: 'Music',         icon: Music,         defaultColor: '#ec4899' },
  { name: 'Camera',        icon: Camera,        defaultColor: '#64748b' },
];

interface CalloutIconPickerProps {
  currentIcon: string;
  iconColor?: string;
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
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const currentConfig = ICON_OPTIONS.find((c) => c.name === currentIcon) || ICON_OPTIONS[0];
  const CurrentIcon = currentConfig.icon;
  const activeColor = currentConfig.defaultColor;

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
        onClick={(e) => {
          if (!isOpen) {
            const btnRect = e.currentTarget.getBoundingClientRect();
            const res = calculateSubMenuPosition({
              buttonRect: btnRect,
              submenuWidth: 192,
              submenuHeight: 180,
              offset: 6,
            });
            setPickerStyle(res.style);
          }
          onToggle();
        }}
        title="切换图标"
      >
        <CurrentIcon size={18} color={activeColor} />
      </button>

      {isOpen && (
        <div className={styles.calloutPickerPopover} style={pickerStyle}>
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
                  <IconComp size={16} color={c.defaultColor} />
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
