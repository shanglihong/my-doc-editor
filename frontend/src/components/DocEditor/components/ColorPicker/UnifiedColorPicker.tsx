import React, { useState } from 'react';
import { Check, RotateCcw, Type, PaintBucket, Square } from 'lucide-react';
import { UNIFIED_COLOR_SYSTEM } from '../../utils/defaultTheme';
import type { ColorCategory, ColorGroup, ColorTier } from '../../utils/defaultTheme';
import styles from './UnifiedColorPicker.module.css';

export interface UnifiedColorPickerProps {
  allowedCategories?: ColorCategory[];
  defaultCategory?: ColorCategory;
  currentColor?: string;
  onSelectColor: (color: string, category: ColorCategory) => void;
  onResetColor?: () => void;
  className?: string;
}

const CATEGORY_TITLES: Record<ColorCategory, string> = {
  textColor: '字体',
  backgroundColor: '背景',
  borderColor: '边框',
};

const CATEGORY_ICONS: Record<ColorCategory, React.ReactNode> = {
  textColor: <Type size={12} />,
  backgroundColor: <PaintBucket size={12} />,
  borderColor: <Square size={12} />,
};

const TIERS_BY_CATEGORY: Record<ColorCategory, ColorTier[]> = {
  textColor: ['light', 'medium', 'normal'],
  backgroundColor: ['light', 'medium'],      // 填充去掉深色系 ('normal')
  borderColor: ['medium', 'normal'],         // 边框去掉浅色系 ('light')
};

export const UnifiedColorPicker: React.FC<UnifiedColorPickerProps> = ({
  allowedCategories = ['textColor', 'backgroundColor', 'borderColor'],
  defaultCategory = allowedCategories[0] || 'textColor',
  currentColor,
  onSelectColor,
  onResetColor,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<ColorCategory>(defaultCategory);

  const groups: ColorGroup[] = UNIFIED_COLOR_SYSTEM[activeCategory] || UNIFIED_COLOR_SYSTEM.textColor;
  const showHeader = allowedCategories.length > 1 || !!onResetColor;
  const currentTiers = TIERS_BY_CATEGORY[activeCategory] || ['light', 'medium', 'normal'];
  const gridColumnsClass = currentTiers.length === 2 ? styles.colorGrid4Cols : styles.colorGrid6Cols;

  return (
    <div
      className={`${styles.container} ${className}`}
      onMouseDown={(e) => e.preventDefault()}
    >
      {showHeader && (
        <div className={styles.topHeader}>
          {allowedCategories.length > 1 ? (
            <div className={styles.categoryTabs}>
              {allowedCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.tabBtn} ${activeCategory === cat ? styles.tabBtnActive : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setActiveCategory(cat)}
                  title={CATEGORY_TITLES[cat]}
                >
                  {CATEGORY_ICONS[cat]}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>
              {CATEGORY_TITLES[activeCategory]}
            </div>
          )}

          {onResetColor && (
            <button
              type="button"
              className={styles.resetBtn}
              onMouseDown={(e) => e.preventDefault()}
              onClick={onResetColor}
              title="重置"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      )}

      <div className={`${styles.colorGrid} ${gridColumnsClass}`}>
        {groups.map((group) =>
          currentTiers.map((tier) => {
            const option = group.shades[tier];
            const isSelected =
              currentColor &&
              option.value.toLowerCase() === currentColor.toLowerCase();

            const tierText = tier === 'light' ? '浅' : tier === 'medium' ? '中' : '深';
            const tooltipText = `${tierText}${group.hueName[0]}`;

            return (
              <button
                key={`${group.hue}-${tier}`}
                type="button"
                className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                style={{ backgroundColor: option.value }}
                title={tooltipText}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectColor(option.value, activeCategory)}
              >
                {isSelected && (
                  <Check
                    className={styles.checkIcon}
                    color={tier === 'light' ? '#1e293b' : '#ffffff'}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
