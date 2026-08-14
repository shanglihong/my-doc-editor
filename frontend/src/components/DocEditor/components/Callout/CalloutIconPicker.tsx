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
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const ICON_OPTIONS: IconConfig[] = [
  { name: 'Info',          icon: Info },
  { name: 'Lightbulb',     icon: Lightbulb },
  { name: 'AlertTriangle', icon: AlertTriangle },
  { name: 'CheckCircle2',  icon: CheckCircle2 },
  { name: 'OctagonAlert',  icon: OctagonAlert },
  { name: 'Star',          icon: Star },
  { name: 'Flame',         icon: Flame },
  { name: 'Zap',           icon: Zap },
  { name: 'Bookmark',      icon: Bookmark },
  { name: 'FileText',      icon: FileText },
  { name: 'Pin',           icon: Pin },
  { name: 'Heart',         icon: Heart },
  { name: 'Rocket',        icon: Rocket },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Target',        icon: Target },
  { name: 'Lock',          icon: Lock },
  { name: 'Coffee',        icon: Coffee },
  { name: 'Globe',         icon: Globe },
  { name: 'Music',         icon: Music },
  { name: 'Camera',        icon: Camera },
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
  iconColor,
  isOpen,
  onToggle,
  onSelectIcon,
}) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const currentConfig = ICON_OPTIONS.find((c) => c.name === currentIcon) || ICON_OPTIONS[0];
  const CurrentIcon = currentConfig.icon;
  const activeColor = iconColor || '#475569';

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
                  <IconComp size={16} color={activeColor} />
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
